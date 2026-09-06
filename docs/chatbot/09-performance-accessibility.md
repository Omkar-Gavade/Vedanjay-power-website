# 09 — Performance & Accessibility

## 9.1 The hard performance constraint

> The chatbot must not measurably slow the website for the ~97% of visitors who
> never open it.

Measured baseline of the current build (`frontend/dist`, gzip):

| Asset | Raw | Gzip |
|---|---:|---:|
| `index-*.js` | 273,296 B | **84,961 B** |
| `index-*.css` | 169,365 B | **23,850 B** |
| `NotFound-*.js` (existing lazy chunk) | 816 B | 469 B |

The existing `NotFound` chunk is the precedent: `App.jsx:1,8,15` already uses
`lazy` + `Suspense`. The chat panel follows the pattern that is already in the
codebase rather than introducing a new one.

## 9.2 Loading strategy

```
Initial page load
└── ChatLauncher              eager, ~1.5 kB gz   ← the only always-on cost
                                                    (button markup + open handler)

First click on launcher
└── chat panel chunk          lazy, ~9–12 kB gz
    ├── ChatPanel, ChatMessage, ChatComposer, EnquiryFlow
    ├── useChat
    └── chat.css              (imported by the chunk, not the global sheet)
```

### Budgets

| Metric | Budget | Enforcement |
|---|---|---|
| Added JS on initial load | ≤ 2 kB gz | CI size check on `index-*.js` |
| Added CSS on initial load | **0 B** | `chat.css` imported only by the lazy chunk |
| Lazy chunk | ≤ 15 kB gz | CI size check |
| LCP / CLS delta | 0 | Launcher is `position: fixed`, outside flow |
| Long tasks added before interaction | 0 | No work runs until click |

`chat.css` must **not** be added to `frontend/src/styles/index.css`. Importing it
from the lazy component is what keeps the initial CSS delta at zero — the single
easiest mistake to make here, and the one that would break the budget silently.

### No layout shift

The launcher is `position: fixed` with an explicit width and height, so it never
participates in layout and cannot contribute to CLS. It is rendered inside
`RootLayout` after the footer in DOM order to keep the tab sequence sensible.

### Idle prefetch

After the page is idle and only if the connection permits, the panel chunk is
prefetched so the first click feels instant:

```js
if ('requestIdleCallback' in window &&
    !navigator.connection?.saveData &&
    !/2g/.test(navigator.connection?.effectiveType ?? '')) {
  requestIdleCallback(() => import('./ChatPanel.jsx'));
}
```

Guarded on `saveData` and slow connections, because prefetching a feature the
user has not asked for is exactly the behaviour that makes sites feel heavy on
poor networks — a real consideration for this audience in India.

## 9.3 Streaming and perceived latency

Time to first token is what users experience as speed, not total time.

| Target | Value |
|---|---|
| Time to first token | < 1.2 s (p50) |
| Full answer | < 4 s (p50) |

Contributors:

- **SSE streaming** (§06.1) — text appears while generating.
- **`@cf/meta/llama-3.1-8b-instruct-fast`** — the "fast" variant is chosen
  specifically for this metric.
- **No embedding round trip** — the §05 no-RAG decision removes a whole network
  hop before generation begins.
- **Optimistic user bubble** — rendered immediately on send, before the request
  resolves.
- **Cold start** — model cold start is 1–3 s on first invocation. Mitigated by
  the AI Gateway cache (§04.7) for common questions; otherwise accepted, since
  it affects only the first visitor in a quiet period.

The message list uses `content-visibility: auto` on off-screen bubbles and
appends without re-rendering the list, so a long conversation does not degrade.

## 9.4 Accessibility

Target: **WCAG 2.2 AA**, consistent with the rest of the site.

### Dialog semantics

```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="vp-chat-title"
  ref={panelRef}
>
  <h2 id="vp-chat-title" className="visually-hidden">Vedanjay Assistant</h2>
```

Focus management reuses the **existing** `useFocusTrap(ref, active, onClose)`
hook (`frontend/src/hooks/useFocusTrap.js`), which already provides exactly what
a chat dialog needs and is already battle-tested by the mobile drawer:

- traps Tab/Shift-Tab within the dialog
- locks body scroll **without** a layout shift (scrollbar-width compensation)
- closes on Escape
- restores focus to the opener on close

It holds `onClose` in a ref so the effect depends only on `[ref, active]` — the
fix that stopped focus being yanked back to the opener on every parent render.
Reusing it means the chat panel inherits that correctness for free. Writing a
second focus trap would be the wrong instinct.

### Live region for streaming

Streamed tokens must be announced without flooding the screen reader.

```jsx
<div aria-live="polite" aria-atomic="false" aria-busy={isStreaming}>
```

- `aria-live="polite"` — never interrupts.
- `aria-busy` set during streaming so assistive tech can wait for a settled
  state rather than announcing each token.
- The **complete** message is announced on stream end; partial tokens are not
  individually announced. A naive `aria-live` on a token stream produces
  unusable, stuttering speech — this is the single most-missed a11y detail in
  chat UIs.

### Keyboard

| Key | Action |
|---|---|
| `Enter` | Send |
| `Shift+Enter` | Newline |
| `Esc` | Close panel (restores focus to launcher) |
| `Tab` | Cycles within the dialog only |

The composer is a `<textarea>`, not a `contenteditable`, so it behaves natively
with IME input and assistive tech.

### Visual

- Every colour comes from a semantic token already contrast-checked in
  `tokens.css`. Body text at 15px minimum — above the 11–12px legibility floor
  established earlier in this project.
- User bubbles use `--vp-primary` (`--vp-green-600` in light, AA-safe) with
  `--vp-n-0` text. The raw brand green is only 3.32:1 on white and must not be
  used for text-bearing surfaces.
- Focus rings use `--vp-focus`, matching the site.
- The close button is 44×44px minimum touch target with a `visually-hidden`
  label.
- Status dot is decorative (`aria-hidden`); status is conveyed in text.
- Nothing relies on colour alone — an error bubble carries an icon and text.

### Reduced motion

Under `prefers-reduced-motion: reduce`, all panel/message motion collapses to
opacity and the message list scrolls with `behavior: 'auto'`. This mirrors the
global contract in `frontend/src/styles/motion.css`.

## 9.5 Measurement

| What | How |
|---|---|
| Bundle budgets | CI size check on the two `index-*` assets and the chat chunk |
| Core Web Vitals delta | Lighthouse on `/` before and after, 5 runs, compare medians |
| Time to first token | Worker-side duration log (§07.5) |
| Refusal / answer rate | `outcome` field in aggregate logs |
| Cost | AI Gateway analytics, or Workers AI usage in the dashboard |

Aggregate counters only. Nothing here requires reading a conversation, which is
what makes the §07 no-storage decision affordable.
