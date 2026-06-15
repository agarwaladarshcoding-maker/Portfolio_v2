"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";

const fade = { opacity: 0, y: 30 };
const fadeIn = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-40px" };
const trans = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const transDelayed = { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const };

export default function ProjectDetail({ slug }: { slug: string }) {
  const { content } = useContent();
  const projects = content.projects;
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = idx >= 0 ? projects[idx] : undefined;

  if (!project) {
    return (
      <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-28 pt-36">
        <Link href="/work" className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute hover:text-signal" data-hover>
          ← All work
        </Link>
        <h1 className="mt-8 font-display text-5xl font-bold tracking-tightest text-bone">Project not found</h1>
        <p className="mt-4 text-bone-dim">This project may have been renamed or removed. Head back to all work.</p>
      </main>
    );
  }

  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-28 pt-36">
      <Link
        href="/work"
        className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute transition-colors hover:text-signal"
        data-hover
      >
        ← All work
      </Link>

      <motion.div initial={fade} animate={fadeIn} transition={trans} className="mt-8">
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">
          <span className="text-signal">{project.index}</span>
          <span>{project.year}</span>
          <span>{project.role}</span>
        </div>
        <h1 className="mt-5 font-display text-[14vw] font-bold leading-[0.95] tracking-tightest text-bone sm:text-7xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-bone-dim sm:text-xl">{project.tagline}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-deep transition-transform hover:-translate-y-0.5"
              data-hover
            >
              GitHub →
            </a>
          ) : null}
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-bone/30 px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-bone transition-colors hover:border-signal hover:text-signal"
              data-hover
            >
              Live site →
            </a>
          ) : null}
        </div>
      </motion.div>

      <motion.div
        initial={fade}
        whileInView={fadeIn}
        viewport={viewport}
        transition={transDelayed}
        className="mt-16 grid gap-12 md:grid-cols-[1fr_300px]"
      >
        <div>
          {project.description.map((para, i) => (
            <p key={i} className="mb-5 text-lg leading-relaxed text-bone-dim">
              {para}
            </p>
          ))}
          <h2 className="mt-10 font-display text-2xl font-semibold text-bone">Highlights</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-bone-dim">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <aside className="flex h-max flex-col gap-6 rounded-2xl border border-ink-line p-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">Stack</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink-line px-3 py-1 font-mono text-[11px] text-bone-mute"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          {project.metrics.length > 0 ? (
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">Impact</div>
              <div className="mt-3 flex flex-col gap-4">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl font-bold text-bone">{m.value}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-bone-mute">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </motion.div>

      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="group mt-20 flex items-center justify-between border-t border-ink-line pt-8"
          data-hover
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">Next project</span>
          <span className="font-display text-2xl font-semibold text-bone transition-colors group-hover:text-signal">
            {next.title} →
          </span>
        </Link>
      ) : null}
    </main>
  );
}
