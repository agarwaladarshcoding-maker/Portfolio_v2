"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";

const fade = { opacity: 0, y: 24 };
const fadeIn = { opacity: 1, y: 0 };
const trans = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };
const rowTrans = (i: number) => ({ duration: 0.55, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const });
const viewportOnce = { once: true, margin: "-40px" };

export default function NowPage() {
  const { content } = useContent();
  const now = content.now;
  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-28 pt-36">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute transition-colors hover:text-signal"
        data-hover
      >
        ← Home
      </Link>

      <motion.div initial={fade} animate={fadeIn} transition={trans} className="mt-8">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Updated {now.updated}</div>
        <h1 className="mt-4 font-display text-[16vw] font-bold leading-[0.9] tracking-tightest text-bone sm:text-8xl">
          Now
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone-dim">{now.intro}</p>
      </motion.div>

      <div className="mt-14 flex flex-col">
        {now.items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={fade}
            whileInView={fadeIn}
            viewport={viewportOnce}
            transition={rowTrans(i)}
            className="grid grid-cols-1 gap-2 border-b border-ink-line py-7 md:grid-cols-[200px_1fr] md:gap-8"
          >
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-signal">{item.label}</div>
            <div className="text-lg text-bone-dim">{item.text}</div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
