"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";

const fade = { opacity: 0, y: 30 };
const fadeIn = { opacity: 1, y: 0 };
const trans = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

export default function ExperienceDetail({ slug }: { slug: string }) {
  const { content } = useContent();
  const item = content.experience.find((e) => e.slug === slug);

  if (!item) {
    return (
      <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-28 pt-36">
        <Link href="/#experience" className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute hover:text-signal" data-hover>
          ← Experience
        </Link>
        <h1 className="mt-8 font-display text-5xl font-bold tracking-tightest text-bone">Not found</h1>
        <p className="mt-4 text-bone-dim">This entry may have been renamed or removed.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-28 pt-36">
      <Link
        href="/#experience"
        className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute transition-colors hover:text-signal"
        data-hover
      >
        ← Experience
      </Link>

      <motion.div initial={fade} animate={fadeIn} transition={trans} className="mt-8">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{item.period}</div>
        <h1 className="mt-4 font-display text-[13vw] font-bold leading-[0.95] tracking-tightest text-bone sm:text-7xl">
          {item.org}
        </h1>
        <p className="mt-4 text-lg text-bone-dim sm:text-xl">{item.role}</p>
      </motion.div>

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_280px]">
        <div>
          {item.description.map((para, i) => (
            <p key={i} className="mb-5 text-lg leading-relaxed text-bone-dim">
              {para}
            </p>
          ))}
          <h2 className="mt-10 font-display text-2xl font-semibold text-bone">What I did</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-bone-dim">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-max rounded-2xl border border-ink-line p-6">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">Stack</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-ink-line px-3 py-1 font-mono text-[11px] text-bone-mute"
              >
                {s}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
