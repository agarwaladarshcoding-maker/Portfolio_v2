"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useContent, defaultContent, type SiteContent } from "@/lib/content";

const PASSWORD = "12345678";
const SESSION_KEY = "adarsh.admin.unlocked";

const inputCls =
  "w-full rounded-lg border border-ink-line bg-ink-soft/60 px-3 py-2 text-sm text-bone outline-none transition-colors focus:border-signal";
const areaCls = inputCls + " leading-relaxed";
const labelCls = "mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-bone-mute";
const cardCls = "rounded-2xl border border-ink-line bg-ink-soft/20 p-6";
const smallBtn =
  "rounded-full border border-ink-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-bone-mute transition-colors hover:border-signal hover:text-signal";

function clone(value: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(value));
}

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.length > 0 ? base : "item-" + Math.random().toString(36).slice(2, 7);
}

function cleanList(list: string[]): string[] {
  return list.map((s) => s.trim()).filter((s) => s.length > 0);
}

// Tidy the draft just before saving.
function sanitize(input: SiteContent): SiteContent {
  const c = clone(input);
  c.slogans = cleanList(c.slogans);
  c.about.paragraphs = cleanList(c.about.paragraphs);
  c.projects = c.projects.map((p, i) => ({
    ...p,
    slug: p.slug && p.slug.trim().length > 0 ? p.slug.trim() : slugify(p.title),
    index: String(i + 1).padStart(2, "0"),
    description: cleanList(p.description),
    highlights: cleanList(p.highlights),
    stack: cleanList(p.stack),
  }));
  c.experience = c.experience.map((e) => ({
    ...e,
    slug: e.slug && e.slug.trim().length > 0 ? e.slug.trim() : slugify(e.org),
    description: cleanList(e.description),
    highlights: cleanList(e.highlights),
    stack: cleanList(e.stack),
  }));
  c.skills = c.skills.map((g) => ({ ...g, items: cleanList(g.items) }));
  c.chatbot.suggestions = cleanList(c.chatbot.suggestions);
  c.chatbot.knowledge = c.chatbot.knowledge
    .map((k) => ({ keywords: cleanList(k.keywords), answer: k.answer.trim() }))
    .filter((k) => k.answer.length > 0);
  return c;
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const { content, setContent, reset, loaded } = useContent();
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [savedAt, setSavedAt] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  // Load the draft from current content once unlocked and content has loaded.
  useEffect(() => {
    if (unlocked && loaded && draft === null) {
      setDraft(clone(content));
    }
  }, [unlocked, loaded, draft, content]);

  const tryUnlock = () => {
    if (pw === PASSWORD) {
      setUnlocked(true);
      setError(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
    } else {
      setError(true);
    }
  };

  const lock = () => {
    setUnlocked(false);
    setPw("");
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  };

  // Apply a mutation to a fresh clone of the draft.
  const edit = (fn: (d: SiteContent) => void) => {
    setDraft((prev) => {
      const base = prev ? clone(prev) : clone(content);
      fn(base);
      return base;
    });
  };

  const save = () => {
    if (!draft) return;
    const clean = sanitize(draft);
    setContent(clean);
    setDraft(clone(clean));
    const now = new Date();
    setSavedAt(now.toLocaleTimeString());
  };

  const resetAll = () => {
    reset();
    setDraft(clone(defaultContent));
    setSavedAt("");
  };

  // Export the profile document as a PDF via the browser's print-to-PDF.
  const exportPdf = () => {
    if (typeof window === "undefined" || !draft) return;
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const w = window.open("", "_blank");
    if (!w) return;
    const styled = esc(draft.profileDoc)
      .split("\n")
      .map((line) => {
        const m = line.match(/^(#{1,3})\s+(.*)/);
        if (m) {
          const size = m[1].length === 1 ? 22 : m[1].length === 2 ? 15 : 13;
          return "<div style='font-weight:700;font-size:" + size + "px;margin:18px 0 6px'>" + m[2] + "</div>";
        }
        if (!line.trim()) return "<div style='height:8px'></div>";
        return "<div style='margin:4px 0'>" + line + "</div>";
      })
      .join("");
    w.document.write(
      "<title>Adarsh Agarwala - Profile</title>" +
        "<div style=\"font-family:Georgia,serif;color:#13141a;max-width:720px;margin:0 auto;padding:48px;line-height:1.55\">" +
        styled +
        "</div>",
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center px-[var(--shell-x)]">
        <div className="w-full max-w-sm rounded-3xl border border-ink-line bg-ink-soft/30 p-8">
          <h1 className="font-display text-3xl font-bold tracking-tightest text-bone">Admin</h1>
          <p className="mt-2 text-sm text-bone-dim">Enter the password to edit site content.</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? tryUnlock() : null)}
            placeholder="Password"
            className={inputCls + " mt-6"}
          />
          {error ? <p className="mt-2 font-mono text-xs text-signal">Wrong password. Try again.</p> : null}
          <button
            onClick={tryUnlock}
            className="mt-4 w-full rounded-full bg-signal px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-deep transition-transform hover:-translate-y-0.5"
          >
            Unlock
          </button>
          <Link href="/" className="mt-4 block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bone-mute hover:text-bone">
            ← Back to site
          </Link>
        </div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">Loading…</span>
      </main>
    );
  }

  const d = draft;

  return (
    <main className="mx-auto max-w-4xl px-[var(--shell-x)] pb-32 pt-28">
      <div className="sticky top-0 z-40 -mx-[var(--shell-x)] mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-ink-line bg-ink-deep/90 px-[var(--shell-x)] py-4 backdrop-blur-md">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tightest text-bone">Site admin</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-mute">
            Saves to this browser {savedAt ? "· saved " + savedAt : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className={smallBtn} data-hover>
            View site
          </Link>
          <button onClick={resetAll} className={smallBtn} data-hover>
            Reset
          </button>
          <button onClick={lock} className={smallBtn} data-hover>
            Lock
          </button>
          <button
            onClick={save}
            className="rounded-full bg-signal px-5 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-deep transition-transform hover:-translate-y-0.5"
            data-hover
          >
            Save changes
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* PROFILE */}
        <section className={cardCls}>
          <h2 className="mb-5 font-display text-xl font-semibold text-bone">Profile</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Labeled label="Name">
              <input className={inputCls} value={d.site.name} onChange={(e) => edit((x) => { x.site.name = e.target.value; })} />
            </Labeled>
            <Labeled label="Role">
              <input className={inputCls} value={d.site.role} onChange={(e) => edit((x) => { x.site.role = e.target.value; })} />
            </Labeled>
            <Labeled label="Email">
              <input className={inputCls} value={d.site.email} onChange={(e) => edit((x) => { x.site.email = e.target.value; })} />
            </Labeled>
            <Labeled label="Resume URL">
              <input className={inputCls} value={d.site.resumeUrl} onChange={(e) => edit((x) => { x.site.resumeUrl = e.target.value; })} />
            </Labeled>
            <Labeled label="Location">
              <input className={inputCls} value={d.site.location} onChange={(e) => edit((x) => { x.site.location = e.target.value; })} />
            </Labeled>
          </div>
          <div className="mt-4">
            <Labeled label="Summary (hero paragraph)">
              <textarea rows={3} className={areaCls} value={d.site.summary} onChange={(e) => edit((x) => { x.site.summary = e.target.value; })} />
            </Labeled>
          </div>
          <div className="mt-4">
            <span className={labelCls}>Social links</span>
            <div className="flex flex-col gap-2">
              {d.site.socials.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputCls + " max-w-[160px]"} value={s.label} onChange={(e) => edit((x) => { x.site.socials[i].label = e.target.value; })} />
                  <input className={inputCls} value={s.href} onChange={(e) => edit((x) => { x.site.socials[i].href = e.target.value; })} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLOGANS */}
        <section className={cardCls}>
          <h2 className="mb-5 font-display text-xl font-semibold text-bone">Slogans (rotating)</h2>
          <div className="flex flex-col gap-2">
            {d.slogans.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputCls} value={s} onChange={(e) => edit((x) => { x.slogans[i] = e.target.value; })} />
                <button className={smallBtn} onClick={() => edit((x) => { x.slogans.splice(i, 1); })}>Remove</button>
              </div>
            ))}
          </div>
          <button className={smallBtn + " mt-3"} onClick={() => edit((x) => { x.slogans.push("New slogan"); })}>+ Add slogan</button>
        </section>

        {/* ABOUT */}
        <section className={cardCls}>
          <h2 className="mb-5 font-display text-xl font-semibold text-bone">About</h2>
          <Labeled label="Lead line">
            <textarea rows={2} className={areaCls} value={d.about.lead} onChange={(e) => edit((x) => { x.about.lead = e.target.value; })} />
          </Labeled>
          <div className="mt-4">
            <Labeled label="Paragraphs (one per line)">
              <textarea rows={5} className={areaCls} value={d.about.paragraphs.join("\n")} onChange={(e) => edit((x) => { x.about.paragraphs = e.target.value.split("\n"); })} />
            </Labeled>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {d.about.cards.map((card, i) => (
              <div key={i} className="rounded-xl border border-ink-line p-4">
                <input className={inputCls + " mb-2"} value={card.label} onChange={(e) => edit((x) => { x.about.cards[i].label = e.target.value; })} />
                <input className={inputCls} value={card.value} onChange={(e) => edit((x) => { x.about.cards[i].value = e.target.value; })} />
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className={cardCls}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-bone">Projects</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-mute">First 3 featured show on home</span>
          </div>
          <div className="flex flex-col gap-6">
            {d.projects.map((p, i) => (
              <div key={i} className="rounded-xl border border-ink-line p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-bone-mute">
                      <input type="checkbox" checked={!!p.featured} onChange={(e) => edit((x) => { x.projects[i].featured = e.target.checked; })} />
                      Featured
                    </label>
                    <button className={smallBtn} onClick={() => edit((x) => { x.projects.splice(i, 1); })}>Delete</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Labeled label="Title">
                    <input className={inputCls} value={p.title} onChange={(e) => edit((x) => { x.projects[i].title = e.target.value; })} />
                  </Labeled>
                  <Labeled label="Tagline">
                    <input className={inputCls} value={p.tagline} onChange={(e) => edit((x) => { x.projects[i].tagline = e.target.value; })} />
                  </Labeled>
                  <Labeled label="Year">
                    <input className={inputCls} value={p.year} onChange={(e) => edit((x) => { x.projects[i].year = e.target.value; })} />
                  </Labeled>
                  <Labeled label="Role">
                    <input className={inputCls} value={p.role} onChange={(e) => edit((x) => { x.projects[i].role = e.target.value; })} />
                  </Labeled>
                  <Labeled label="Domain (Quant / AI-ML / Systems / Full-Stack)">
                    <input className={inputCls} value={p.domain ?? ""} onChange={(e) => edit((x) => { x.projects[i].domain = e.target.value; })} />
                  </Labeled>
                  <Labeled label="GitHub URL">
                    <input className={inputCls} value={p.github ?? ""} onChange={(e) => edit((x) => { x.projects[i].github = e.target.value; })} />
                  </Labeled>
                  <Labeled label="Live URL">
                    <input className={inputCls} value={p.live ?? ""} onChange={(e) => edit((x) => { x.projects[i].live = e.target.value; })} />
                  </Labeled>
                </div>
                <div className="mt-3">
                  <Labeled label="Card blurb">
                    <textarea rows={2} className={areaCls} value={p.blurb} onChange={(e) => edit((x) => { x.projects[i].blurb = e.target.value; })} />
                  </Labeled>
                </div>
                <div className="mt-3">
                  <Labeled label="Stack (comma separated)">
                    <input className={inputCls} value={p.stack.join(", ")} onChange={(e) => edit((x) => { x.projects[i].stack = e.target.value.split(","); })} />
                  </Labeled>
                </div>
                <div className="mt-3">
                  <Labeled label="Description (one paragraph per line)">
                    <textarea rows={3} className={areaCls} value={p.description.join("\n")} onChange={(e) => edit((x) => { x.projects[i].description = e.target.value.split("\n"); })} />
                  </Labeled>
                </div>
                <div className="mt-3">
                  <Labeled label="Highlights (one per line)">
                    <textarea rows={3} className={areaCls} value={p.highlights.join("\n")} onChange={(e) => edit((x) => { x.projects[i].highlights = e.target.value.split("\n"); })} />
                  </Labeled>
                </div>
              </div>
            ))}
          </div>
          <button
            className={smallBtn + " mt-4"}
            onClick={() => edit((x) => {
              x.projects.push({
                slug: "",
                index: String(x.projects.length + 1).padStart(2, "0"),
                title: "New project",
                tagline: "Short tagline",
                blurb: "What this project is and why it matters.",
                description: ["Describe the project."],
                highlights: ["Key highlight"],
                year: "2026",
                role: "Solo build",
                stack: ["Python"],
                metrics: [],
                github: "",
                featured: false,
              });
            })}
          >
            + Add project
          </button>
        </section>

        {/* EXPERIENCE */}
        <section className={cardCls}>
          <h2 className="mb-5 font-display text-xl font-semibold text-bone">Experience</h2>
          <div className="flex flex-col gap-6">
            {d.experience.map((e, i) => (
              <div key={i} className="rounded-xl border border-ink-line p-5">
                <div className="mb-3 flex items-center justify-end">
                  <button className={smallBtn} onClick={() => edit((x) => { x.experience.splice(i, 1); })}>Delete</button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Labeled label="Organisation">
                    <input className={inputCls} value={e.org} onChange={(ev) => edit((x) => { x.experience[i].org = ev.target.value; })} />
                  </Labeled>
                  <Labeled label="Role">
                    <input className={inputCls} value={e.role} onChange={(ev) => edit((x) => { x.experience[i].role = ev.target.value; })} />
                  </Labeled>
                  <Labeled label="Period">
                    <input className={inputCls} value={e.period} onChange={(ev) => edit((x) => { x.experience[i].period = ev.target.value; })} />
                  </Labeled>
                  <Labeled label="One-line note">
                    <input className={inputCls} value={e.note} onChange={(ev) => edit((x) => { x.experience[i].note = ev.target.value; })} />
                  </Labeled>
                </div>
                <div className="mt-3">
                  <Labeled label="Description (one paragraph per line)">
                    <textarea rows={3} className={areaCls} value={e.description.join("\n")} onChange={(ev) => edit((x) => { x.experience[i].description = ev.target.value.split("\n"); })} />
                  </Labeled>
                </div>
                <div className="mt-3">
                  <Labeled label="Highlights (one per line)">
                    <textarea rows={3} className={areaCls} value={e.highlights.join("\n")} onChange={(ev) => edit((x) => { x.experience[i].highlights = ev.target.value.split("\n"); })} />
                  </Labeled>
                </div>
                <div className="mt-3">
                  <Labeled label="Stack (comma separated)">
                    <input className={inputCls} value={e.stack.join(", ")} onChange={(ev) => edit((x) => { x.experience[i].stack = ev.target.value.split(","); })} />
                  </Labeled>
                </div>
              </div>
            ))}
          </div>
          <button
            className={smallBtn + " mt-4"}
            onClick={() => edit((x) => {
              x.experience.push({
                slug: "",
                org: "New entry",
                role: "Your role",
                period: "2026",
                note: "One-line summary.",
                description: ["Describe it."],
                highlights: ["Highlight"],
                stack: ["Tool"],
              });
            })}
          >
            + Add experience
          </button>
        </section>

        {/* ACHIEVEMENTS */}
        <section className={cardCls}>
          <h2 className="mb-5 font-display text-xl font-semibold text-bone">Achievements</h2>
          <div className="flex flex-col gap-3">
            {d.achievements.map((a, i) => (
              <div key={i} className="rounded-xl border border-ink-line p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input className={inputCls} value={a.title} onChange={(e) => edit((x) => { x.achievements[i].title = e.target.value; })} />
                  <button className={smallBtn} onClick={() => edit((x) => { x.achievements.splice(i, 1); })}>Remove</button>
                </div>
                <textarea rows={2} className={areaCls} value={a.detail} onChange={(e) => edit((x) => { x.achievements[i].detail = e.target.value; })} />
              </div>
            ))}
          </div>
          <button className={smallBtn + " mt-3"} onClick={() => edit((x) => { x.achievements.push({ title: "New achievement", detail: "Details." }); })}>+ Add achievement</button>
        </section>

        {/* NOW PAGE */}
        <section className={cardCls}>
          <h2 className="mb-5 font-display text-xl font-semibold text-bone">Now page (/now)</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Labeled label="Updated label">
              <input className={inputCls} value={d.now.updated} onChange={(e) => edit((x) => { x.now.updated = e.target.value; })} />
            </Labeled>
          </div>
          <div className="mt-4">
            <Labeled label="Intro">
              <textarea rows={2} className={areaCls} value={d.now.intro} onChange={(e) => edit((x) => { x.now.intro = e.target.value; })} />
            </Labeled>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <span className={labelCls}>Items</span>
            {d.now.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputCls + " max-w-[160px]"} value={item.label} onChange={(e) => edit((x) => { x.now.items[i].label = e.target.value; })} />
                <input className={inputCls} value={item.text} onChange={(e) => edit((x) => { x.now.items[i].text = e.target.value; })} />
                <button className={smallBtn} onClick={() => edit((x) => { x.now.items.splice(i, 1); })}>Remove</button>
              </div>
            ))}
          </div>
          <button className={smallBtn + " mt-3"} onClick={() => edit((x) => { x.now.items.push({ label: "Label", text: "What you are up to." }); })}>+ Add item</button>
        </section>

        {/* SKILLS */}
        <section className={cardCls}>
          <h2 className="mb-5 font-display text-xl font-semibold text-bone">Capabilities</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {d.skills.map((g, i) => (
              <div key={i} className="rounded-xl border border-ink-line p-4">
                <input className={inputCls + " mb-2"} value={g.title} onChange={(e) => edit((x) => { x.skills[i].title = e.target.value; })} />
                <textarea rows={6} className={areaCls} value={g.items.join("\n")} onChange={(e) => edit((x) => { x.skills[i].items = e.target.value.split("\n"); })} />
              </div>
            ))}
          </div>
        </section>

        {/* PROFILE DOCUMENT (RAG KNOWLEDGE BASE) */}
        <section className={cardCls}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-bone">Profile document · chatbot knowledge</h2>
            <button className={smallBtn} onClick={exportPdf} data-hover>
              Export PDF
            </button>
          </div>
          <p className="mb-4 text-sm text-bone-dim">
            This is the full text AdarshAI reads to answer questions — the RAG knowledge base. It is automatically split
            into chunks at every line that starts with <span className="font-mono text-bone">##</span>. Edit it freely,
            press Save, then Export PDF to download an updated copy. The chatbot also reads your live projects,
            experience, achievements and contact details, so this doc is for anything extra you want it to know.
          </p>
          <textarea
            rows={18}
            className={areaCls + " font-mono text-xs"}
            value={d.profileDoc}
            onChange={(e) => edit((x) => { x.profileDoc = e.target.value; })}
          />
        </section>

        {/* CHATBOT */}
        <section className={cardCls}>
          <h2 className="mb-2 font-display text-xl font-semibold text-bone">AdarshAI chatbot</h2>
          <p className="mb-5 text-sm text-bone-dim">
            The bot answers about projects and your resume automatically. Add extra topics below: give each a few trigger
            words and the answer it should reply with.
          </p>
          <Labeled label="Intro message">
            <textarea rows={3} className={areaCls} value={d.chatbot.intro} onChange={(e) => edit((x) => { x.chatbot.intro = e.target.value; })} />
          </Labeled>
          <div className="mt-4">
            <span className={labelCls}>Suggested questions (quick buttons)</span>
            <div className="flex flex-col gap-2">
              {d.chatbot.suggestions.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputCls} value={s} onChange={(e) => edit((x) => { x.chatbot.suggestions[i] = e.target.value; })} />
                  <button className={smallBtn} onClick={() => edit((x) => { x.chatbot.suggestions.splice(i, 1); })}>Remove</button>
                </div>
              ))}
            </div>
            <button className={smallBtn + " mt-2"} onClick={() => edit((x) => { x.chatbot.suggestions.push("New question?"); })}>+ Add question</button>
          </div>
          <div className="mt-5">
            <span className={labelCls}>Knowledge — trigger words + answer</span>
            <div className="flex flex-col gap-3">
              {d.chatbot.knowledge.map((k, i) => (
                <div key={i} className="rounded-xl border border-ink-line p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone-mute">Trigger words (comma separated)</span>
                    <button className={smallBtn} onClick={() => edit((x) => { x.chatbot.knowledge.splice(i, 1); })}>Remove</button>
                  </div>
                  <input className={inputCls + " mb-2"} value={k.keywords.join(", ")} onChange={(e) => edit((x) => { x.chatbot.knowledge[i].keywords = e.target.value.split(","); })} />
                  <textarea rows={3} className={areaCls} value={k.answer} onChange={(e) => edit((x) => { x.chatbot.knowledge[i].answer = e.target.value; })} />
                </div>
              ))}
            </div>
            <button className={smallBtn + " mt-3"} onClick={() => edit((x) => { x.chatbot.knowledge.push({ keywords: ["topic"], answer: "Answer about this topic." }); })}>+ Add knowledge</button>
          </div>
          <div className="mt-4">
            <Labeled label="Fallback (when it doesn't know)">
              <textarea rows={2} className={areaCls} value={d.chatbot.fallback} onChange={(e) => edit((x) => { x.chatbot.fallback = e.target.value; })} />
            </Labeled>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={save}
            className="rounded-full bg-signal px-7 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-deep transition-transform hover:-translate-y-0.5"
            data-hover
          >
            Save changes
          </button>
        </div>
      </div>
    </main>
  );
}
