"use client";

// Selected work.
//
// Each project is laid out as a figure with a caption, because that is the
// honest shape: a claim, the diagram of the mechanism behind it, and a link to
// the code. Figures are numbered — not as decoration, but because they are
// genuinely figures and the numbering is how the prose refers to them.

import Link from "next/link";
import { useContent } from "@/lib/content";
import Figure from "./Figures";

export default function Work() {
  const { content } = useContent();
  // AI/ML leads. The quant work follows as a named second track rather than
  // competing with it for the same slot.
  const featured = content.projects.filter((p) => p.featured);
  const secondTrack = content.projects.filter((p) => !p.featured);

  return (
    <section id="work" className="border-b border-rule px-[var(--shell-x)] py-20 sm:py-28">
      <div className="mx-auto max-w-shell">
        <header className="mb-16 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
          <div>
            <p className="label mb-3 flex items-center gap-2.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" />
              AI / ML
            </p>
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">Selected work</h2>
          </div>
          <Link
            href="/work"
            className="font-mono text-label uppercase text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
          >
            All {content.projects.length} projects ↗
          </Link>
        </header>

        <div className="space-y-24">
          {featured.map((p, i) => (
            <article key={p.slug} className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              {/* Caption side. */}
              <div className="lg:pt-2">
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-mono text-label uppercase text-bone">Fig. {i + 1}</span>
                  <span className="h-px flex-1 bg-rule" />
                  <span className="font-mono text-micro uppercase text-bone-3">
                    {p.domain} · {p.year}
                  </span>
                </div>

                <h3 className="display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05]">
                  <Link href={`/work/${p.slug}`} className="hover:text-amber">
                    {p.title}
                  </Link>
                </h3>

                {/* The one sentence that says what it proves. */}
                <p className="mt-5 max-w-prose border-l-2 border-amber pl-4 text-[1.05rem] leading-relaxed text-bone">
                  {p.result}
                </p>

                <p className="mt-5 max-w-prose leading-relaxed text-bone-2">{p.blurb}</p>

                {/* Fixed columns so the numbers line up as a row of readings
                    rather than reflowing into a ragged block. */}
                <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-rule pt-5 sm:grid-cols-3">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="display text-[1.6rem] leading-none">{m.value}</dt>
                      <dd className="label mt-1.5 leading-[1.5]">{m.label}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Link
                    href={`/work/${p.slug}`}
                    className="border border-bone px-4 py-2 font-mono text-micro uppercase transition-colors hover:bg-bone hover:text-ground"
                  >
                    Read the write-up
                  </Link>
                  {/* A project you can actually open outranks one you can only
                      read about, so the live link leads. */}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-amber px-4 py-2 font-mono text-micro uppercase text-amber transition-colors hover:bg-amber hover:text-ground"
                    >
                      Try it live ↗
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-micro uppercase text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
                    >
                      Source ↗
                    </a>
                  )}
                  <span className="font-mono text-micro uppercase text-bone-3">{p.stack.slice(0, 4).join(" · ")}</span>
                </div>
              </div>

              <Figure kind={p.figure} />
            </article>
          ))}
        </div>

        {/* Second track. Aqua throughout, so the hierarchy is legible before
            you read a word of it. */}
        <div className="mt-28 border-t border-rule pt-10">
          <header className="mb-8">
            <p className="label mb-3 flex items-center gap-2.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-aqua" />
              Quantitative &amp; systems — second track
            </p>
            <p className="max-w-prose leading-relaxed text-bone-2">
              Where I learned to distrust a result until it has been tested. Each one has
              source you can read.
            </p>
          </header>

          <ul className="border-t border-rule">
            {secondTrack.map((p) => (
              <li key={p.slug} className="border-b border-rule">
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid gap-2 py-5 sm:grid-cols-[18rem_1fr_9rem] sm:items-baseline sm:gap-8"
                >
                  <span className="text-[1.05rem] font-medium text-bone group-hover:text-aqua">{p.title}</span>
                  <span className="leading-relaxed text-bone-2">{p.tagline}</span>
                  <span className="font-mono text-micro uppercase text-bone-3 sm:text-right">{p.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
