"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import SectionHeading from "./SectionHeading";

const hidden = { opacity: 0, x: -20 };
const show = { opacity: 1, x: 0 };
const viewport = { once: true, margin: "-60px" };
const rowTrans = (i: number) => ({ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const });

export default function Experience() {
  const { content } = useContent();
  const experience = content.experience;
  return (
    <section id="experience" className="mx-auto max-w-shell px-[var(--shell-x)] py-20">
      <SectionHeading index="03" title="Experience" sub="Hackathons & leadership" />
      <div className="flex flex-col">
        {experience.map((e, i) => (
          <motion.div key={e.slug} initial={hidden} whileInView={show} viewport={viewport} transition={rowTrans(i)}>
            <Link
              href={`/experience/${e.slug}`}
              className="group grid grid-cols-1 gap-2 border-b border-ink-line py-8 transition-colors hover:bg-ink-soft/40 md:grid-cols-[260px_1fr_220px] md:gap-8 md:px-4"
              data-hover
            >
              <div className="font-display text-xl font-semibold text-bone transition-colors group-hover:text-signal">
                {e.org}
              </div>
              <div className="text-bone-dim">{e.note}</div>
              <div className="font-mono text-xs uppercase tracking-[0.15em] text-bone-mute md:text-right">
                <div className="text-signal">{e.role}</div>
                <div className="mt-1 flex items-center gap-2 md:justify-end">
                  {e.period}
                  <span className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">→</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
