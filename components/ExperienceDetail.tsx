"use client";

import Link from "next/link";
import { useContent } from "@/lib/content";

export default function ExperienceDetail({ slug }: { slug: string }) {
  const { content } = useContent();
  const item = content.experience.find((e) => e.slug === slug);

  if (!item) {
    return (
      <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-24 pt-32">
        <Link href="/#record" className="font-mono text-micro uppercase text-bone-3 hover:text-amber">
          ← The record
        </Link>
        <h1 className="display mt-8 text-5xl">Not found</h1>
        <p className="mt-4 max-w-prose text-bone-2">This entry may have been renamed.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-24 pt-32">
      <Link href="/#record" className="font-mono text-micro uppercase text-bone-3 hover:text-amber">
        ← The record
      </Link>

      <header className="mt-8 border-b border-rule pb-10">
        <p className="label">{item.period}</p>
        <h1 className="display display-tight mt-4 text-[clamp(2.25rem,6vw,4.25rem)]">{item.org}</h1>
        <p className="mt-4 text-[1.15rem] text-bone-2">{item.role}</p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="max-w-prose space-y-5 text-[1.05rem] leading-relaxed text-bone-2">
          {item.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <aside>
          <h2 className="label border-b border-rule pb-3">What I did</h2>
          <ul className="mt-5 space-y-3">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-3 leading-relaxed text-bone-2">
                <span className="mt-[10px] h-1 w-3 shrink-0 bg-amber" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-rule pt-6">
            <p className="label mb-3">Built with</p>
            <p className="font-mono text-[12px] leading-relaxed text-bone-2">{item.stack.join(" · ")}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
