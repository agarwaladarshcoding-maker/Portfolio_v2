"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import SectionHeading from "./SectionHeading";

const hidden = { opacity: 0, y: 24 };
const show = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-60px" };
const rowTrans = (i: number) => ({ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const });

export default function Achievements() {
  const { content } = useContent();
  const achievements = content.achievements;
  if (!achievements || achievements.length === 0) return null;
  return (
    <section id="achievements" className="mx-auto max-w-shell px-[var(--shell-x)] py-20">
      <SectionHeading index="04" title="Achievements" sub="Selected honours" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={hidden}
            whileInView={show}
            viewport={viewport}
            transition={rowTrans(i)}
            className="flex gap-5 rounded-2xl border border-ink-line bg-ink-soft/30 p-6 transition-colors hover:border-signal/50"
          >
            <span className="font-mono text-sm text-signal">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-display text-lg font-semibold text-bone">{a.title}</h3>
              <p className="mt-2 text-bone-dim">{a.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
