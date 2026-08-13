// The hero, and the argument the whole page rests on.
//
// The claim used to be a paragraph of annotated prose pointing down at a rail
// of sources — the same move the medical RAG makes on its own answers,
// applied to a page. That move survives, but as a strip of numbers instead of
// footnotes: a short lede states the claim, three chips name the tracks, and
// every stat below is an anchor straight to where a reader can go check it.
// The portrait sits beside the claim as itself — the person the numbers
// describe, not a footnote either.

import Portrait from "./Portrait";
import { thesis, evidence, site } from "@/lib/data";

export default function Thesis() {
  return (
    <section id="main" className="border-b border-rule px-[var(--shell-x)] pb-14 pt-28 sm:pb-20 sm:pt-32">
      <div className="mx-auto max-w-shell">
        <p className="label mb-8 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" />
          {site.role} · {site.location}
        </p>

        {/* Sized so the claim and the portrait share the first screen — the
            pairing is the point, and a bigger headline buries it. */}
        <h1 className="display display-tight text-[clamp(2.75rem,8vw,6.5rem)]">
          {thesis.headline.map((line, i) => (
            <span key={line} className="block rise" style={{ animationDelay: `${i * 90}ms` }}>
              {i === thesis.headline.length - 1 ? (
                <>
                  {line.replace(/\.$/, "")}
                  <span className="text-amber">.</span>
                </>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        <div className="mt-12 grid items-start gap-x-16 gap-y-10 lg:grid-cols-[1fr_300px]">
          {/* Above the type on mobile, beside it on lg — fixed to a narrow
              column at every breakpoint (never full-bleed) and the aspect
              ratio matches the source image, so the space is reserved before
              it loads and nothing shifts. */}
          <Portrait
            variant="hero"
            priority
            className="order-first mx-auto aspect-[639/853] w-full max-w-[220px] sm:max-w-[280px] lg:order-last lg:mx-0 lg:w-[300px] lg:max-w-none"
          />

          <div className="order-last lg:order-first">
            <p className="max-w-prose text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.65] text-bone-2">
              {thesis.lede}
            </p>

            {/* The three identities the rest of the site backs up. Labels,
                not links — the site itself is the evidence for these. */}
            <ul className="mt-6 flex flex-wrap gap-3">
              {thesis.tracks.map((t) => (
                <li key={t} className="label border border-rule px-3 py-1.5">
                  {t}
                </li>
              ))}
            </ul>

            {/* The stat strip. Every number is an anchor to where it can be
                checked — a profile, a repo, or a section of this page. */}
            <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-8 sm:grid-cols-4">
              {evidence.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group block"
                  >
                    <span className="display block text-[1.75rem] leading-none text-bone transition-colors group-hover:text-amber">
                      {s.value}
                    </span>
                    <span className="label mt-2 block leading-[1.5] text-bone-3 transition-colors group-hover:text-amber">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
