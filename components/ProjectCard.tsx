"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Tilt from "./Tilt";
import type { Project } from "@/lib/data";

const cardHidden = { opacity: 0, y: 40 };
const cardShow = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-60px" };
const cardTrans = (i: number) => ({ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const });

export default function ProjectCard({ project, i }: { project: Project; i: number }) {
  const metric = project.metrics[0];
  const metricText = metric ? `${metric.value} ${metric.label}` : "Case study";
  return (
    <motion.div
      className="h-full"
      initial={cardHidden}
      whileInView={cardShow}
      viewport={viewport}
      transition={cardTrans(i)}
    >
      <Tilt className="h-full" max={8}>
        <Link
          href={`/work/${project.slug}`}
          className="group flex h-full flex-col justify-between rounded-2xl border border-ink-line bg-ink-soft/30 p-7 transition-colors duration-300 hover:border-signal/50 hover:bg-ink-soft/60"
          data-hover
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-signal">{project.index}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-bone-mute">{project.year}</span>
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-bone transition-colors group-hover:text-signal">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-bone-mute">{project.tagline}</p>
            <p className="mt-4 text-bone-dim">{project.blurb}</p>
          </div>
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-bone-mute"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-bone-mute">
              <span>{metricText}</span>
              <span className="text-bone transition-transform group-hover:translate-x-1">View →</span>
            </div>
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}
