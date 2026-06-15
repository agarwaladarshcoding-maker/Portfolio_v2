"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content";

const hidden = { opacity: 0, y: 40 };
const show = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-60px" };
const trans = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

export default function Contact() {
  const { content } = useContent();
  const site = content.site;
  return (
    <section id="contact" className="mx-auto max-w-shell px-[var(--shell-x)] py-24">
      <motion.div
        className="text-center"
        initial={hidden}
        whileInView={show}
        viewport={viewport}
        transition={trans}
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal">Let us talk</span>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[12vw] font-bold leading-[0.95] tracking-tightest text-bone lg:text-8xl">
          Let’s build something.
        </h2>
        <a
          href={`mailto:${site.email}`}
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-bone px-8 py-4 font-mono text-sm uppercase tracking-[0.15em] text-ink-deep transition-transform hover:-translate-y-1"
          data-hover
        >
          {site.email} <span>→</span>
        </a>
        <div className="mt-10 flex items-center justify-center gap-6">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone"
              data-hover
            >
              {s.label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
