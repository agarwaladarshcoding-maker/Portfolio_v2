"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const hidden = { opacity: 0, y: 24 };
const show = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-80px" };
const headTrans = { duration: 0.7, ease: EASE };

export default function SectionHeading({
  index,
  title,
  sub,
}: {
  index: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-12 flex items-end justify-between border-b border-ink-line pb-5">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm text-signal">{index}</span>
        <motion.h2
          className="font-display text-3xl font-bold tracking-tightest text-bone sm:text-5xl"
          initial={hidden}
          whileInView={show}
          viewport={viewport}
          transition={headTrans}
        >
          {title}
        </motion.h2>
      </div>
      {sub ? (
        <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-bone-mute sm:block">
          {sub}
        </span>
      ) : null}
    </div>
  );
}
