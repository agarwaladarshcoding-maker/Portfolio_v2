"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import SectionHeading from "./SectionHeading";

const hidden = { opacity: 0, y: 30 };
const show = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-60px" };
const trans = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

export default function About() {
  const { content } = useContent();
  const site = content.site;
  const about = content.about;
  return (
    <section id="about" className="mx-auto max-w-shell px-[var(--shell-x)] py-20">
      <SectionHeading index="01" title="About" sub="The short version" />
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_360px]">
        <motion.div initial={hidden} whileInView={show} viewport={viewport} transition={trans}>
          <p className="font-display text-2xl font-medium leading-snug text-bone sm:text-3xl">
            {about.lead}
          </p>
          {about.paragraphs.map((para, i) => (
            <p key={i} className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-dim">
              {para}
            </p>
          ))}
        </motion.div>
        <motion.div
          className="flex flex-col gap-4"
          initial={hidden}
          whileInView={show}
          viewport={viewport}
          transition={trans}
        >
          {about.cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-ink-line p-6">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">{card.label}</div>
              <div className="mt-2 text-bone">{card.value}</div>
            </div>
          ))}
          <div className="rounded-2xl border border-ink-line p-6">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute">Find me</div>
            <div className="mt-3 flex flex-col gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex items-center justify-between text-bone-dim transition-colors hover:text-signal"
                  data-hover
                >
                  {s.label} <span>→</span>
                </a>
              ))}
            </div>
          </div>
          <a
            href={site.resumeUrl}
            className="flex items-center justify-between rounded-2xl border border-signal/40 bg-signal/10 p-6 text-bone transition-colors hover:border-signal hover:bg-signal/20"
            data-hover
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Resume / CV</span>
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
