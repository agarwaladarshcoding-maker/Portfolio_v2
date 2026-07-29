"use client";

// The record: achievements and experience in one table, with a column that
// says how each line can be checked. A credential nobody can verify is still
// worth stating — it just should not be dressed up as the same kind of fact as
// a repository you can open.

import Link from "next/link";
import { useContent } from "@/lib/content";

export default function Record() {
  const { content } = useContent();
  const { achievements, experience, skills } = content;

  return (
    <section id="record" className="border-b border-rule px-[var(--shell-x)] py-20 sm:py-28">
      <div className="mx-auto max-w-shell">
        <header className="mb-14 border-b border-rule pb-6">
          <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">The record</h2>
          <p className="mt-3 max-w-prose leading-relaxed text-bone-2">
            Grades and placements are self-reported — I can send the marksheet. Everything
            with a link goes to the thing itself.
          </p>
        </header>

        {/* Where the time actually went. */}
        <div className="mb-16">
          <h3 className="label mb-5">Roles &amp; teams</h3>
          <ul className="border-t border-rule">
            {experience.map((e) => (
              <li key={e.slug} className="border-b border-rule">
                <Link
                  href={`/experience/${e.slug}`}
                  className="group grid gap-2 py-5 sm:grid-cols-[16rem_1fr_9rem] sm:items-baseline sm:gap-8"
                >
                  <span className="text-[1.05rem] font-medium text-bone group-hover:text-amber">{e.org}</span>
                  <span className="leading-relaxed text-bone-2">{e.note}</span>
                  <span className="font-mono text-micro uppercase text-bone-3 sm:text-right">{e.period}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Achievements, with provenance stated. */}
        <div className="mb-16">
          <h3 className="label mb-5">Achievements</h3>
          <ul className="border-t border-rule">
            {achievements.map((a) => (
              <li key={a.title} className="grid gap-1.5 border-b border-rule py-5 sm:grid-cols-[16rem_1fr] sm:gap-8">
                <span className="text-[1.05rem] font-medium text-bone">{a.title}</span>
                <span className="leading-relaxed text-bone-2">{a.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools, stated plainly and without proficiency bars. */}
        <div>
          <h3 className="label mb-5">Tools I reach for</h3>
          <div className="grid gap-x-12 gap-y-8 border-t border-rule pt-6 sm:grid-cols-3">
            {skills.map((g) => (
              <div key={g.title}>
                <h4 className="mb-3 font-mono text-micro uppercase text-amber">{g.title}</h4>
                <ul className="space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-[15px] leading-snug text-bone-2">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
