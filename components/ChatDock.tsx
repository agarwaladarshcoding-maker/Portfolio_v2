"use client";

// AdarshAI — the retrieval demo.
//
// The site claims a working RAG pipeline, so this panel shows its work rather
// than asserting it: retrieval runs in the browser, the passages it selected
// are listed under the answer, and the footer names which engine replied. An
// interviewer can open this, ask something, and see exactly what was fed to
// the model.
//
// Previously this shipped the entire corpus to the LLM, which meant retrieve()
// never actually ran. It now sends only the top-k chunks — which is the thing
// that makes it retrieval-augmented rather than just a long prompt.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  site,
  thesis,
  evidence,
  facts,
  about,
  projects,
  experience,
  skills,
  achievements,
  now,
  chatbot,
  profileDoc,
} from "@/lib/data";
import { buildCorpus, retrieve, type Chunk, type SiteContent } from "@/lib/rag";

type Msg = { from: "user" | "bot"; text: string; via?: string; sources?: string[] };

const TOP_K = 5;

// buildCorpus() takes the full site-content shape — assembled directly from
// data.ts now that the localStorage-backed content layer is gone.
const content: SiteContent = {
  site,
  thesis,
  evidence,
  facts,
  about,
  projects,
  experience,
  skills,
  achievements,
  now,
  chatbot,
  profileDoc,
};

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ from: "bot", text: chatbot.intro }]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-adarsh-ai", openIt);
    return () => window.removeEventListener("open-adarsh-ai", openIt);
  }, []);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  // Offline fallback: keyword match over the built-in answers. Used when no
  // API key is configured, so the panel never dead-ends.
  const offlineReply = (input: string): string => {
    const q = input.toLowerCase();
    if (/(resume|résumé|\bcv\b)/.test(q) && site.resumeUrl) {
      return `Adarsh's resume is at ${site.resumeUrl} — or email him at ${site.email}.`;
    }
    const tokens = q.split(/[^a-z0-9+]+/).filter((t) => t.length > 2);
    let best = chatbot.fallback;
    let bestScore = 0;
    for (const entry of chatbot.knowledge) {
      const score = entry.keywords.reduce((n, k) => n + (tokens.includes(k) || q.includes(k) ? 1 : 0), 0);
      if (score > bestScore) {
        bestScore = score;
        best = entry.answer;
      }
    }
    return best;
  };

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setValue("");
    setTyping(true);

    // Retrieval happens here, in the browser. Only the winning chunks travel.
    const corpus = buildCorpus(content);
    const hits: Chunk[] = retrieve(clean, corpus, TOP_K);
    const context = hits.map((c) => `[${c.title}]\n${c.text}`).join("\n\n");
    const sources = hits.map((c) => c.title);

    let answer: string | null = null;
    let via = "offline engine";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: clean,
          context,
          links: {
            resume: site.resumeUrl,
            email: site.email,
            socials: site.socials.map((s) => `${s.label}: ${s.href}`).join(", "),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.answer === "string" && data.answer.trim()) {
          answer = data.answer.trim();
          via = data.model ? `${data.model}` : "LLM";
        } else if (data && data.configured === false) {
          via = "offline engine — no API key set";
        }
      }
    } catch {
      via = "offline engine — route unreachable";
    }

    if (!answer) answer = offlineReply(clean);

    setMessages((m) => [...m, { from: "bot", text: answer as string, via, sources }]);
    setTyping(false);
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { from: "bot", text: "Voice input needs Chrome or Edge." }]);
      return;
    }
    try {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.onresult = (e: any) => {
        setListening(false);
        send(e.results[0][0].transcript);
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      setListening(true);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(value);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 border border-bone bg-bone px-4 py-2.5 font-mono text-micro uppercase text-ground transition-colors hover:border-amber hover:bg-amber"
        aria-expanded={open}
        aria-label={open ? "Close the retrieval demo" : "Ask the index"}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-ground" />
        {open ? "Close" : "Ask the index"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-[4.5rem] right-5 z-[80] flex h-[min(78vh,540px)] w-[min(94vw,420px)] flex-col border border-bone bg-ground-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="AdarshAI retrieval demo"
          >
            <div className="border-b border-rule px-4 py-3">
              <p className="font-mono text-micro uppercase text-bone">AdarshAI</p>
              <p className="mt-1 text-[12px] leading-snug text-bone-2">
                TF-IDF retrieval over {buildCorpus(content).length} chunks, top {TOP_K} to the model.
              </p>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i}>
                  {m.from === "user" ? (
                    <p className="ml-auto max-w-[85%] bg-bone px-3 py-2 text-[14px] leading-snug text-ground">{m.text}</p>
                  ) : (
                    <div className="max-w-[92%]">
                      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-bone">{m.text}</p>
                      {m.sources && m.sources.length > 0 && (
                        <details className="mt-2.5 border-l-2 border-amber pl-3">
                          <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
                            {m.sources.length} passages retrieved
                          </summary>
                          <ul className="mt-1.5 space-y-1">
                            {m.sources.map((s, j) => (
                              <li key={j} className="font-mono text-[10px] leading-relaxed text-bone-2">
                                {j + 1}. {s}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                      {m.via && <p className="mt-2 font-mono text-[10px] uppercase text-bone-3">{m.via}</p>}
                    </div>
                  )}
                </div>
              ))}
              {typing && <p className="font-mono text-[10px] uppercase text-bone-3">retrieving…</p>}
              <div ref={endRef} />
            </div>

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-rule px-4 py-3">
                {chatbot.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="border border-rule px-2.5 py-1 font-mono text-[10px] text-bone-2 transition-colors hover:border-amber hover:text-amber"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-rule px-4 py-3">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask about a project…"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-bone placeholder:text-bone-3 focus:outline-none"
                aria-label="Your question"
              />
              <button
                type="button"
                onClick={startListening}
                className={`font-mono text-[10px] uppercase ${listening ? "text-amber" : "text-bone-3 hover:text-bone"}`}
                aria-label="Ask by voice"
              >
                {listening ? "listening" : "mic"}
              </button>
              <button type="submit" className="font-mono text-[10px] uppercase text-amber hover:underline">
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
