"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { chatbot } from "@/lib/data";
import SectionHeading from "./SectionHeading";

type Msg = { role: "user" | "bot"; text: string };

const EASE = [0.22, 1, 0.36, 1] as const;
const wrapHidden = { opacity: 0, y: 30 };
const wrapShow = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-60px" };
const wrapTrans = { duration: 0.7, ease: EASE };
const msgInit = { opacity: 0, y: 10 };
const msgShow = { opacity: 1, y: 0 };
const msgTrans = { duration: 0.35, ease: EASE };

function reply(input: string): string {
  const q = input.toLowerCase();
  let best = chatbot.fallback;
  let bestScore = 0;
  for (const k of chatbot.knowledge) {
    let score = 0;
    for (const kw of k.keywords) {
      if (q.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = k.answer;
    }
  }
  return best;
}

export default function Chatbot() {
  const initial: Msg[] = [{ role: "bot", text: chatbot.intro }];
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opts = { behavior: "smooth", block: "nearest" } as const;
    endRef.current?.scrollIntoView(opts);
  }, [messages, typing]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const userMsg: Msg = { role: "user", text: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const answer = reply(value);
    window.setTimeout(() => {
      const botMsg: Msg = { role: "bot", text: answer };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
    }, 700);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <section id="chat" className="mx-auto max-w-shell px-[var(--shell-x)] py-28">
      <SectionHeading index="05" title="Ask my AI" sub="A little assistant that knows me" />
      <motion.div
        className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-ink-line bg-ink-soft/40 backdrop-blur-md"
        initial={wrapHidden}
        whileInView={wrapShow}
        viewport={viewport}
        transition={wrapTrans}
      >
        <div className="flex items-center gap-2 border-b border-ink-line px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-signal" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint" />
          <span className="ml-2 font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">
            ask-me-anything
          </span>
        </div>

        <div className="flex h-[340px] flex-col gap-3 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const rowCls = isUser ? "flex justify-end" : "flex justify-start";
            const bubbleCls = isUser
              ? "max-w-[82%] rounded-2xl rounded-br-sm bg-signal px-4 py-2.5 text-sm leading-relaxed text-ink-deep"
              : "max-w-[82%] rounded-2xl rounded-bl-sm border border-ink-line bg-ink-deep px-4 py-2.5 text-sm leading-relaxed text-bone-dim";
            return (
              <motion.div key={i} className={rowCls} initial={msgInit} animate={msgShow} transition={msgTrans}>
                <div className={bubbleCls}>{m.text}</div>
              </motion.div>
            );
          })}
          {typing ? (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-ink-line bg-ink-deep px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bone-mute" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bone-mute [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-bone-mute [animation-delay:0.3s]" />
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-ink-line px-5 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {chatbot.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-ink-line px-3 py-1.5 font-mono text-[11px] text-bone-dim transition-colors hover:border-signal hover:text-signal"
                data-hover
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="flex-1 rounded-full border border-ink-line bg-ink-deep px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-bone-mute focus:border-signal"
            />
            <button
              type="submit"
              className="rounded-full bg-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-deep transition-transform hover:-translate-y-0.5"
              data-hover
            >
              Send
            </button>
          </form>
        </div>
      </motion.div>
      <p className="mx-auto mt-4 max-w-2xl text-center font-mono text-[11px] text-bone-mute">
        Demo assistant — answers come from a built-in profile in lib/data.ts. Wire it to an LLM API in components/Chatbot.tsx to make it live.
      </p>
    </section>
  );
}
