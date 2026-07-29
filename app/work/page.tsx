"use client";

import Link from "next/link";
import { useContent } from "@/lib/content";

export default function WorkPage() {
  const { content } = useContent();
  const projects = content.projects;

  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-24 pt-32">
      <Link href="/" className="font-mono text-micro uppercase text-bone-3 hover:text-amber">
        ← Index
      </Link>

      <h1 className="display display-tight mt-8 text-[clamp(2.5rem,8vw,6rem)]">Work</h1>
      <p className="mt-5 max-w-prose leading-relaxed text-bone-2">
        Seven projects, every one with source you can read. Two are in progress and say so.
      </p>

      {/* A contents list, not a card grid — it is a document. */}
      <ol className="mt-16 border-t border-rule">
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-rule">
            <Link href={`/work/${p.slug}`} className="group block py-7">
              <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-8">
                <span className="font-mono text-micro uppercase text-bone-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="display text-[clamp(1.35rem,2.6vw,2rem)] leading-tight group-hover:text-amber">
                    {p.title}
                  </h2>
                  <p className="mt-2 max-w-prose leading-relaxed text-bone-2">{p.tagline}</p>
                  <p className="mt-3 font-mono text-micro uppercase text-bone-3">{p.stack.join(" · ")}</p>
                </div>
                <span className="font-mono text-micro uppercase text-bone-3">
                  {p.domain} · {p.year}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
