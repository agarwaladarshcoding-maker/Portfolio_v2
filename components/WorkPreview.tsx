"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";

const btnHidden = { opacity: 0, y: 20 };
const btnShow = { opacity: 1, y: 0 };
const viewport = { once: true, margin: "-40px" };
const btnTrans = { duration: 0.5, delay: 0.1 };

export default function WorkPreview() {
  const { content } = useContent();
  const featured = content.projects.filter((p) => p.featured).slice(0, 3);
  const list = featured.length > 0 ? featured : content.projects.slice(0, 3);
  return (
    <section id="work" className="mx-auto max-w-shell px-[var(--shell-x)] py-20">
      <SectionHeading index="02" title="Selected work" sub="Top three" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {list.map((p, i) => (
          <ProjectCard key={p.slug} project={p} i={i} />
        ))}
      </div>
      <motion.div
        className="mt-12 flex justify-center"
        initial={btnHidden}
        whileInView={btnShow}
        viewport={viewport}
        transition={btnTrans}
      >
        <Link
          href="/work"
          className="group flex items-center gap-3 rounded-full border border-bone/30 px-7 py-3 font-mono text-xs uppercase tracking-[0.15em] text-bone transition-colors hover:border-signal hover:text-signal"
          data-hover
        >
          View all work <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>
    </section>
  );
}
