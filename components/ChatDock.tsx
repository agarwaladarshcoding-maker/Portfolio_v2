"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/lib/content";
import { buildCorpus } from "@/lib/rag";

type Msg = { from: "user" | "bot"; text: string; via?: string };

const panelInit = { opacity: 0, y: 24, scale: 0.98 };
const panelShow = { opacity: 1, y: 0, scale: 1 };
const panelExit = { opacity: 0, y: 24, scale: 0.98 };
const panelTrans = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

export default function ChatDock() {
  const { content } = useContent();
  const chatbot = content.chatbot;
  const site = content.site;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ from: "bot", text: chatbot.intro }]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Open when the nav "Talk to AdarshAI" button fires the event.
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-adarsh-ai", openIt);
    return () => window.removeEventListener("open-adarsh-ai", openIt);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  // Domain buckets map question words to a project's `domain` tag.
  const domainGroups = [
    { label: "Quant", terms: ["quant", "trading", "finance", "hft", "option", "options", "arbitrage", "market", "pricing", "derivative"] },
    { label: "AI/ML", terms: ["ai", "ml", "machine", "learning", "rag", "llm", "model", "agent", "nlp", "deep", "neural"] },
    { label: "Systems", terms: ["system", "systems", "latency", "cuda", "kernel", "cpp", "low-level", "performance", "engine"] },
    { label: "Full-Stack", terms: ["web", "full-stack", "fullstack", "react", "frontend", "backend", "node", "website"] },
  ];

  const reply = (input: string): string => {
    const q = input.toLowerCase();
    const projects = content.projects;
    const wantsProjects = /(project|projects|work|portfolio|built|build|made)/.test(q);

    // 1) Resume / CV request -> point to the live resume link + email.
    if (/(resume|r\u00e9sum\u00e9|\bcv\b|curriculum)/.test(q)) {
      const link = site.resumeUrl && site.resumeUrl !== "#" ? site.resumeUrl : "the Resume / CV button in the About section";
      return "You can grab " + site.name + "'s resume here: " + link + ". Prefer email? " + site.email + ".";
    }

    // 2) Projects in a specific domain (e.g. "quant projects", "ai work").
    const matchedDomain = domainGroups.find((g) => g.terms.some((t) => q.includes(t)));
    if (wantsProjects && matchedDomain) {
      const list = projects.filter((p) => (p.domain || "").toLowerCase() === matchedDomain.label.toLowerCase());
      if (list.length > 0) {
        return matchedDomain.label + " projects: " + list.map((p) => p.title).join("; ") + ". Ask me about any one by name, or open the Work section for the full case studies.";
      }
    }

    // 3) A specific project, matched by title / slug / tagline word overlap.
    const tokens = q.split(/[^a-z0-9+]+/).filter((t) => t.length > 2);
    let bestProject = projects[0];
    let bestProjectScore = 0;
    for (const p of projects) {
      const hay = (p.title + " " + p.slug.replace(/-/g, " ") + " " + p.tagline).toLowerCase();
      let s = 0;
      for (const t of tokens) {
        if (hay.includes(t)) s += 1;
      }
      if (q.includes(p.title.toLowerCase())) s += 3;
      if (s > bestProjectScore) {
        bestProjectScore = s;
        bestProject = p;
      }
    }
    if (bestProject && bestProjectScore >= 2) {
      const gh = bestProject.github ? " GitHub: " + bestProject.github + "." : "";
      return bestProject.title + " \u2014 " + bestProject.tagline + ". " + bestProject.blurb + gh;
    }

    // 4) "List all projects".
    if (wantsProjects && /(all|list|every|each|name them)/.test(q)) {
      return "All projects with code: " + projects.map((p) => p.title).join("; ") + ". Ask about any by name.";
    }

    // 5) Curated knowledge base (keyword scoring).
    let best = chatbot.fallback;
    let bestScore = 0;
    for (const entry of chatbot.knowledge) {
      let score = 0;
      for (const k of entry.keywords) {
        if (q.includes(k.toLowerCase())) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = entry.answer;
      }
    }
    return best;
  };

  // Speak replies aloud (text-to-speech), off by default.
  const speakText = (t: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.rate = 1.02;
      window.speechSynthesis.speak(u);
    } catch {
      // ignore unsupported
    }
  };

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setValue("");
    setTyping(true);

    let answer: string | null = null;
    let via = "offline engine";
    // 1) Try the RAG + LLM route. Retrieval (vectorless, hybrid) runs here in the
    //    browser; only the top chunks are sent to the server for the LLM call.
    try {
      // Feed the LLM the ENTIRE knowledge base (profile doc + structured data),
      // not just the top matches, so it has full context for the best answer.
      const corpus = buildCorpus(content);
      const context = corpus.map((c) => "[" + c.title + "]\n" + c.text).join("\n\n");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: clean,
          context,
          links: {
            resume: site.resumeUrl,
            email: site.email,
            socials: site.socials.map((s) => s.label + ": " + s.href).join(", "),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.answer === "string" && data.answer.trim().length > 0) {
          answer = data.answer.trim();
          via = "LLM" + (data.model ? " \u00b7 " + data.model : "");
        } else if (data && data.configured === false) {
          via = "offline engine (no API key set)";
        } else if (data && data.error) {
          via = "offline engine (LLM error: " + data.error + ")";
        }
      } else {
        via = "offline engine (route " + res.status + ")";
      }
    } catch {
      via = "offline engine (route unreachable)";
    }

    // 2) Fallback: built-in rule-based answer (works fully offline, no key).
    if (!answer) answer = reply(clean);

    setMessages((m) => [...m, { from: "bot", text: answer as string, via }]);
    setTyping(false);
    if (speak) speakText(answer);
  };

  // Voice input (speech-to-text) using the browser's Web Speech API.
  const startListening = () => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { from: "bot", text: "Voice input isn't supported in this browser - try Chrome or Edge." }]);
      return;
    }
    try {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const said = e.results[0][0].transcript;
        setListening(false);
        send(said);
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
        className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-full bg-signal px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-deep shadow-xl transition-transform hover:-translate-y-0.5"
        data-hover
        aria-label="Talk to AdarshAI"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-deep opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ink-deep" />
        </span>
        Talk to AdarshAI
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed bottom-24 right-6 z-[80] flex h-[480px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-ink-line bg-ink-soft/95 backdrop-blur-md"
            initial={panelInit}
            animate={panelShow}
            exit={panelExit}
            transition={panelTrans}
          >
            <div className="flex items-center justify-between border-b border-ink-line px-4 py-3">
              <span className="font-display text-sm font-semibold text-bone">AdarshAI · ask about {site.name}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSpeak((s) => !s)}
                  className={"font-mono text-xs uppercase " + (speak ? "text-signal" : "text-bone-mute hover:text-bone")}
                  data-hover
                  aria-label="Toggle voice replies"
                >
                  {speak ? "Voice on" : "Voice off"}
                </button>
                <button onClick={() => setOpen(false)} className="font-mono text-xs uppercase text-bone-mute" data-hover>
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => {
                const bubble =
                  m.from === "user"
                    ? "inline-block max-w-[85%] rounded-2xl bg-signal px-3 py-2 text-sm text-ink-deep"
                    : "inline-block max-w-[85%] rounded-2xl bg-ink-line px-3 py-2 text-sm text-bone-dim";
                return (
                  <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
                    <span className={bubble}>{m.text}</span>
                    {m.from === "bot" && m.via ? (
                      <div className={"mt-1 font-mono text-[9px] uppercase tracking-[0.12em] " + (m.via.startsWith("LLM") ? "text-signal" : "text-bone-mute")}>
                        {m.via}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {typing ? <div className="text-left font-mono text-xs text-bone-mute">typing…</div> : null}
              <div ref={endRef} />
            </div>

            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {chatbot.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-ink-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-bone-mute transition-colors hover:border-signal hover:text-signal"
                  data-hover
                >
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex gap-2 border-t border-ink-line p-3">
              <button
                type="button"
                onClick={startListening}
                className={"rounded-full border px-3 py-2 font-mono text-xs " + (listening ? "border-signal text-signal" : "border-ink-line text-bone-mute hover:text-bone")}
                data-hover
                aria-label="Voice input"
              >
                {listening ? "..." : "Mic"}
              </button>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask something…"
                className="flex-1 rounded-full border border-ink-line bg-ink-deep px-4 py-2 text-sm text-bone outline-none placeholder:text-bone-mute"
              />
              <button className="rounded-full bg-signal px-4 py-2 font-mono text-xs uppercase text-ink-deep" data-hover>
                Send
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
