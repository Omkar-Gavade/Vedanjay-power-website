import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { OPENERS, topicById } from '../../data/assistant.js';
import { answer, resolve } from '../../utils/assistant.js';
import { company } from '../../data/company.js';
import { ROUTES } from '../../constants/routes.js';
import '../../styles/chat.css';

/**
 * The website assistant.
 *
 * ENTIRELY LOCAL. It matches a question against the topics in data/assistant.js
 * — which are themselves composed from the modules the pages render — and
 * answers from them. There is no request, no key, no quota and nothing to fall
 * back to when a provider is down, because there is no provider.
 *
 * It is deliberately not a chatbot pretending to be a person. It is a way
 * around the site: every answer that has a page behind it offers that page, and
 * every answer offers three sensible next questions, so a visitor can get from
 * "what do you do" to the contact form in two clicks without typing again.
 */

const uid = () => Math.random().toString(36).slice(2, 9);
const STORE = 'vp-assistant';

/* sessionStorage, not localStorage: a conversation about a project should not
   outlive the visit on a shared machine. Every access is guarded — private mode
   and storage-blocked browsers throw, and the assistant must still work. */
const load = () => {
  try { return JSON.parse(sessionStorage.getItem(STORE) ?? 'null'); } catch { return null; }
};
const save = (messages) => {
  try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-24))); } catch { /* ignore */ }
};

/* The whole reveal fits in this budget whatever the answer's length. */
const TYPE_MS = 620;
const TICK_MS = 22;

const prefersStill = () => typeof matchMedia === 'function'
  && matchMedia('(prefers-reduced-motion: reduce)').matches;

function MarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5 2.5 8.5h3.2l-.9 6 5.7-7.2H7.3l1.4-5.8Z" fill="currentColor" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function RestartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 8a5.5 5.5 0 1 1-1.7-3.97" stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" />
      <path d="M13.2 1.9v2.8h-2.8" stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8h9M8 4.5 11.5 8 8 11.5" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Reveals an answer a few characters at a time.
 *
 * Purely presentational: `text` is complete before this runs, so nothing is
 * being waited on and the message is whole in the DOM for assistive technology
 * from the first frame. Under prefers-reduced-motion it prints at once.
 */
function useTypedText(text, active) {
  const [shown, setShown] = useState(active ? '' : text);

  useEffect(() => {
    if (!active) { setShown(text); return undefined; }
    if (prefersStill()) { setShown(text); return undefined; }
    setShown('');
    let i = 0;
    /* Whole words, not characters: a per-character reveal at this length reads
       as a stutter and takes far too long on a 500-character answer. */
    const parts = text.split(/(\s+)/);
    /* FIXED DURATION, not a fixed rate. Revealing two words per tick made the
       animation as long as the answer — a 1,400-character reply took over four
       seconds, which reads as a hung panel rather than an assistant thinking.
       The step scales with the length instead, so every answer lands in about
       the same beat and a long one simply reveals in larger pieces. */
    const step = Math.max(2, Math.ceil(parts.length / (TYPE_MS / TICK_MS)));
    const id = setInterval(() => {
      i += step;
      setShown(parts.slice(0, i).join(''));
      if (i >= parts.length) clearInterval(id);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [text, active]);

  return shown;
}

function BotMessage({ msg, typing, onPick }) {
  const shown = useTypedText(msg.text, typing);
  const done = shown.length >= msg.text.length;
  const follow = useMemo(() => resolve(msg.next ?? []), [msg.next]);

  return (
    <div className="vp-cm" data-role="bot">
      <span className="vp-cm__mark" aria-hidden="true"><MarkIcon /></span>
      <div className="vp-cm__col">
        {/* The COMPLETE answer, for assistive technology, present from the first
            frame. The visible bubble reveals a word at a time and is hidden from
            the accessibility tree, so a screen reader is read the whole answer
            once instead of being re-interrupted on every tick of the animation. */}
        <p className="visually-hidden">{msg.text}</p>
        <div className="vp-cm__bubble" aria-hidden="true">
          {/* Answers are plain text with line breaks — no markdown parser, and
              nothing from the page is interpolated as HTML. */}
          {shown.split('\n').map((line, i) => (
            <p key={i} className={line.startsWith('•') ? 'vp-cm__li' : undefined}>
              {line.startsWith('•') ? line.slice(1).trim() : line}
            </p>
          ))}
        </div>

        {done && msg.link && (
          <Link className="vp-cm__go" to={msg.link.to}>
            <span>{msg.link.label}</span>
            <ArrowIcon />
          </Link>
        )}

        {done && follow.length > 0 && (
          <div className="vp-cm__next">
            {follow.map((t) => (
              <button key={t.id} type="button" className="vp-cm__chip" onClick={() => onPick(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState(() => (load() ?? []).map((m) => ({ ...m, fresh: false })));
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState('');
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const timer = useRef(null);
  const exit = useRef(null);

  /* Closing plays out rather than cutting: the panel is a large surface, and
     having it vanish between frames reads as a glitch. The unmount is driven by
     a timer rather than `animationend` so a browser that never fires the event
     — or a reduced-motion rule that removes the animation entirely — still
     closes the panel. */
  const requestClose = useCallback(() => {
    if (prefersStill()) { onClose(); return; }
    setClosing(true);
    exit.current = setTimeout(onClose, 190);
  }, [onClose]);

  useFocusTrap(panelRef, true, requestClose);

  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(exit.current); }, []);

  /* The composer is the point of the panel, so it takes focus on open. */
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { save(messages); }, [messages]);

  /* Follow the conversation as it grows, including while an answer types. */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: messages.length > 1 ? 'smooth' : 'auto' });
  }, [messages, thinking]);

  const respond = useCallback((query) => {
    /* The previous answer IS the context: what it offered as follow-ups, and
       which topic it was, so "tell me more" has something to open. */
    const prevBot = [...messages].reverse().find((m) => m.role === 'bot');
    const context = { offered: prevBot?.next ?? [], last: prevBot?.topicId ?? null };

    setMessages((prev) => [...prev, { id: uid(), role: 'user', text: query }]);
    setThinking(true);
    /* A beat before answering. Instant replies to a typed question read as a
       lookup table rather than an assistant, and the pause is what makes the
       typing indicator meaningful rather than decorative. */
    timer.current = setTimeout(() => {
      const a = answer(query, context);
      setThinking(false);
      setMessages((prev) => [...prev, {
        id: uid(),
        role: 'bot',
        text: a.text,
        link: a.link,
        next: a.next,
        topicId: a.topic?.id ?? null,
        fresh: true,
      }]);
    }, 420);
  }, [messages]);

  const pick = useCallback((id) => {
    const t = topicById.get(id);
    if (t) respond(t.label);
  }, [respond]);

  const submit = (e) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q || thinking) return;
    setDraft('');
    respond(q);
  };

  const restart = () => {
    clearTimeout(timer.current);
    setThinking(false);
    setMessages([]);
    try { sessionStorage.removeItem(STORE); } catch { /* ignore */ }
    inputRef.current?.focus();
  };

  const openers = resolve(OPENERS);
  const empty = messages.length === 0;

  return (
    <>
      <div className="vp-chat-backdrop" data-closing={closing ? 'true' : 'false'}
           onClick={requestClose} aria-hidden="true" />
      <div
        className="vp-chat-panel"
        data-closing={closing ? 'true' : 'false'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vp-chat-title"
        ref={panelRef}
      >
        <header className="vp-chat-head">
          <span className="vp-chat-head__mark" aria-hidden="true"><MarkIcon /></span>
          <div className="vp-chat-head__text">
            <h2 className="vp-chat-head__title" id="vp-chat-title">Vedanjay Assistant</h2>
            <p className="vp-chat-head__status">
              <span className="vp-chat-dot" aria-hidden="true" />
              Here to help you find your way around
            </p>
          </div>
          {!empty && (
            <button type="button" className="vp-chat-icon-btn" onClick={restart}
                    aria-label="Start a new conversation" title="Start a new conversation">
              <RestartIcon />
            </button>
          )}
          <button type="button" className="vp-chat-icon-btn" onClick={requestClose}
                  aria-label="Close assistant">
            <CloseIcon />
          </button>
        </header>

        <div className="vp-chat-body" ref={bodyRef}>
          {empty ? (
            <div className="vp-chat-intro">
              <p className="vp-chat-intro__eyebrow">{company.name}</p>
              <p className="vp-chat-intro__title">What would you like to know?</p>
              <p className="vp-chat-intro__body">
                I can answer from what is published on this site and point you to the
                right page. Pick a topic, or type a question.
              </p>
              <div className="vp-chat-actions">
                {openers.map((t) => (
                  <button key={t.id} type="button" className="vp-chat-action"
                          onClick={() => pick(t.id)}>
                    <span>{t.label}</span>
                    <ArrowIcon />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="vp-chat-thread" role="log" aria-live="polite"
                 aria-relevant="additions" aria-label="Conversation">
              {messages.map((m) => (m.role === 'user' ? (
                <div className="vp-cm" data-role="user" key={m.id}>
                  <div className="vp-cm__bubble">{m.text}</div>
                </div>
              ) : (
                <BotMessage key={m.id} msg={m} typing={m.fresh} onPick={pick} />
              )))}

              {thinking && (
                <div className="vp-cm" data-role="bot">
                  <span className="vp-cm__mark" aria-hidden="true"><MarkIcon /></span>
                  <div className="vp-cm__bubble vp-cm__bubble--typing" role="status" aria-label="Typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="vp-chat-foot">
          <form className="vp-chat-form" onSubmit={submit}>
            <label htmlFor="vp-chat-input" className="visually-hidden">
              Ask about Vedanjay Power
            </label>
            <input
              id="vp-chat-input"
              ref={inputRef}
              className="vp-chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about services, projects, offices…"
              autoComplete="off"
              enterKeyHint="send"
            />
            <button type="submit" className="vp-chat-send" disabled={!draft.trim() || thinking}
                    aria-label="Send">
              <SendIcon />
            </button>
          </form>
          <p className="vp-chat-note">
            Answers come from this website. For anything else,{' '}
            <Link to={ROUTES.contact}>contact the team</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
