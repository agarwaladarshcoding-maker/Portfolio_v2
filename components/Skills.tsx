"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import Tilt from "./Tilt";

const hidden = { opacity: 0, y: 30 };
const show = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-60px" };
const colTrans = (i: number) => ({ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const });

export default function Skills() {
  const { content } = useContent();
  const skills = content.skills;
  return (
    <section id="skills" className="mx-auto max-w-shell px-[var(--shell-x)] py-20">
      <SectionHeading index="05" title="Capabilities" sub="Tools and craft" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {skills.map((group, i) => (
          <motion.div key={group.title} initial={hidden} whileInView={show} viewport={viewport} transition={colTrans(i)}>
            <Tilt className="h-full" max={9}>
              <div className="group h-full rounded-2xl border border-ink-line bg-ink-soft/30 p-7 transition-colors duration-300 hover:border-signal/50 hover:bg-ink-soft/60">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-bone">{group.title}</h3>
                  <span className="font-mono text-xs text-bone-mute">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-bone-dim transition-colors group-hover:text-bone">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
