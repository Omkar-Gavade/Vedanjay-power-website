# 02 — UI / UX Design

Everything here is expressed in the **existing** design system. No new colour, no
new font, no new radius, no animation library. The assistant should look like it
was always part of the site.

## 2.1 Surfaces

Two components only.

**Launcher** — fixed bottom-right. A pill on ≥576px ("Ask Vedanjay" + icon), a
56px circular icon button below that. Uses `--vp-primary`, `--vp-radius-pill`,
`--vp-shadow-lg`.

**Panel** — the conversation surface.

| Breakpoint | Presentation | Rationale |
|---|---|---|
| < 576px | Full-screen sheet | A 360px-wide floating card on a phone is unusable for reading technical answers. |
| ≥ 576px | 400 × 620px card, anchored bottom-right, 24px inset | Keeps the page visible; matches the site's restrained scale. |
| ≥ 1400px | 420 × 680px | Uses available space without becoming a page takeover. |

The panel reuses the **existing drawer pattern** (`.vp-drawer`,
`.vp-drawer-backdrop`, `.vp-drawer__head/__body/__foot` in
`frontend/src/styles/navbar.css:220-260`). The chat panel is structurally the
same object as the mobile nav drawer: a dismissible overlay with a head, a
scrolling body, and a fixed foot. New styles go in a `chat.css` that *extends*
those classes rather than restating them.

## 2.2 Z-index

The site already owns a documented scale in `tokens.css`:

```
--vp-z-header:1030  --vp-z-dropdown:1040  --vp-z-drawer:1050  --vp-z-skip:1100
```

Add **one** token:

```css
--vp-z-chat: 1045;
```

Deliberately **below** `--vp-z-drawer`. If the mobile nav drawer opens, it must
cover the chat panel, not fight it. And the chat panel must never cover the skip
link. The launcher itself sits at `--vp-z-chat`.

## 2.3 Anatomy

```
┌─────────────────────────────────────┐
│ ● Vedanjay Assistant           ✕    │  head: status dot, title, close
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Hi — I can answer questions   │  │  assistant bubble
│  │ about Vedanjay's capabilities │  │  (surface bg, left)
│  │ and coverage.                 │  │
│  └───────────────────────────────┘  │
│                                     │
│  [What is a QCA?]  [Which states?]  │  suggestion chips (first turn only)
│  [Talk to the team]                 │
│                                     │
│                ┌──────────────────┐ │
│                │ Do you cover MP? │ │  user bubble
│                └──────────────────┘ │  (--vp-primary, right)
│                                     │
├─────────────────────────────────────┤
│ ┌───────────────────────────┐ ┌───┐ │  foot
│ │ Ask a question…           │ │ ▲ │ │  textarea (auto-grow, max 4 rows)
│ └───────────────────────────┘ └───┘ │
│ AI assistant — verify details with  │  persistent disclosure
│ our team.                           │
└─────────────────────────────────────┘
```

### Message bubbles

- **Assistant:** `--vp-surface` background, `--vp-border` 1px, `--vp-radius-lg`,
  left-aligned, max-width 92%. Body font (Source Sans 3), 15px.
- **User:** `--vp-primary` background, `--vp-n-0` text, right-aligned, max-width 85%.
- **Never** IBM Plex Mono. That font is reserved for technical data across the
  site; using it for chat would dilute an established signal.

### Suggestion chips

Shown **only on the empty state**, and only three. They exist to teach the
assistant's scope in one glance, not to be a menu. They disappear permanently
once the first message is sent — persistent chips train users to click rather
than ask, which defeats the purpose.

Chips are drawn from the three highest-value jobs (§01): a capability question,
a coverage question, and the escalation path.

## 2.4 States

| State | Presentation |
|---|---|
| Idle / empty | Greeting + 3 chips. No fake "typing" theatre. |
| Sending | Input disabled, send button shows a spinner. |
| Streaming | Tokens append live; a soft caret trails the text; **stop button replaces send**. |
| Error | Inline assistant-styled bubble with the reason and a "Try again" button. Never a modal, never a toast. |
| Rate-limited | Explicit, non-blaming copy + the contact email. Input disabled with a countdown. |
| Offline | Detected via `navigator.onLine`; banner in the foot, input disabled. |

The **stop button during streaming is required**, not a nicety: it is the user's
only escape from a long or wrong answer, and it saves tokens.

## 2.5 Motion

Governed by the existing contract in `frontend/src/styles/motion.css` — only
`opacity` and `transform` animate, nothing triggers layout.

| Element | Motion | Duration |
|---|---|---|
| Panel (desktop) | fade + `translateY(12px)` | `--vp-dur` (280ms), `--vp-ease` |
| Panel (mobile) | slide up from bottom | 320ms — same as `vp-drawer-in` |
| Backdrop | fade to `rgb(0 0 0 / .4)` | `--vp-dur-fast` |
| New message | fade + `translateY(6px)` | `--vp-dur-fast` (160ms) |
| Launcher hover | `translateY(-2px)` + shadow | `--vp-dur-fast` |

Under `prefers-reduced-motion: reduce`: **all of it collapses to opacity only**,
and the message list uses `scroll-behavior: auto`. This mirrors how the rest of
the site already behaves — the assistant must not be the one component that
ignores the user's OS setting.

## 2.6 Placement and intrusion

- The launcher **never auto-opens**. No proactive "Can I help you?" bubble, no
  delay-triggered pop. That pattern is universally disliked and would undercut
  the site's restraint.
- The launcher fades to 55% opacity while the user is actively scrolling and
  returns to full on scroll-stop, reusing `useScrollState`.
- On the homepage hero (`100vh`), the launcher is **hidden until the user has
  scrolled past the first viewport**. The hero is the brand statement; a widget
  in its corner cheapens it.
- Dismissing the panel is remembered for the session (`sessionStorage`), so the
  launcher does not re-assert itself on every route change.

## 2.7 Theme

The panel inherits `data-bs-theme` from `<html>` automatically, because every
colour it uses is a semantic token (`--vp-surface`, `--vp-text`, `--vp-border`,
`--vp-primary`) that is already redefined per theme in `tokens.css`.

**No theme-specific CSS should be written for the chatbot.** If a colour needs a
`[data-bs-theme="dark"]` override, that is a signal the wrong token was chosen.

## 2.8 Copy tone

Matches the site: plain, specific, no exclamation marks, no emoji, no "Great
question!". Short paragraphs. The assistant refers to "Vedanjay Power" or "we",
never "the company".

Greeting:

> Hi — I can answer questions about Vedanjay Power's capabilities, coverage and
> experience. For commercial enquiries I can put you in touch with the team.

Refusal (the most important string in the product):

> I don't have verified information on that. The Vedanjay team can confirm it —
> you can reach them at projects@vedanjay-power.com or +91 7666901814.

Note it says *"I don't have verified information"*, not *"I don't know"*. The
first is accurate and reflects well on the company's rigour; the second sounds
like a broken tool.
