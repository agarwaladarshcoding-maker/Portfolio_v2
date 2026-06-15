"use client";

import Link from "next/link";
import { useContent } from "@/lib/content";
import ProjectCard from "@/components/ProjectCard";

export default function WorkPage() {
  const { content } = useContent();
  const projects = content.projects;
  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-28 pt-36">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.2em] text-bone-mute transition-colors hover:text-signal"
        data-hover
      >
        ← Home
      </Link>
      <h1 className="mt-8 font-display text-[16vw] font-bold leading-[0.9] tracking-tightest text-bone sm:text-8xl">
        Work
      </h1>
      <p className="mt-4 max-w-xl text-lg text-bone-dim">
        Every project here has a GitHub link. Click any one for the full story.
      </p>
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} i={i} />
        ))}
      </div>
    </main>
  );
}
