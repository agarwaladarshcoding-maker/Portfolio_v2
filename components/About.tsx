"use client";

import { useContent } from "@/lib/content";

export default function About() {
  const { content } = useContent();
  const { about, site, facts } = content;

  return (
    <section id="about" className="border-b border-rule px-[var(--shell-x)] py-20 sm:py-28">
      <div className="mx-auto max-w-shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">Why both halves</h2>
            <dl className="mt-10 space-y-5 border-t border-rule pt-6">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="label">{f.label}</dt>
                  <dd className="mt-1 text-[15px] leading-snug text-bone">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            {/* The lead paragraph carries the argument; Bodoni gives it weight. */}
            <p className="display max-w-[34ch] text-[clamp(1.4rem,2.3vw,1.9rem)] leading-[1.3]">
              {about.lead}
            </p>
            <div className="mt-8 max-w-prose space-y-5 leading-relaxed text-bone-2">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
              {site.resumeUrl && (
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-bone px-4 py-2 font-mono text-micro uppercase transition-colors hover:bg-bone hover:text-ground"
                >
                  Resume (PDF)
                </a>
              )}
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-micro uppercase text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
