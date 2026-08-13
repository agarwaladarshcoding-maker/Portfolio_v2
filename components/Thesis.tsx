"use client";

// The hero, and the argument the whole page rests on.
//
// A portfolio is a page of claims about a person, and normally none of them can
// be checked. This one annotates its own prose: every load-bearing phrase
// carries a marker that points to a source in the rail beneath it. Hovering a
// claim raises its evidence; hovering the evidence raises the claim. It is the
// same move the medical RAG makes on its own answers, applied here.

import { useState } from "react";
import { thesis, evidence, site } from "@/lib/data";

export default function Thesis() {
  const [active, setActive] = useState<string | null>(null);

  const indexOf = (ref: string) => evidence.findIndex((e) => e.id === ref) + 1;

  return (
    <section id="main" className="border-b border-rule px-[var(--shell-x)] pb-14 pt-28 sm:pb-20 sm:pt-32">
      <div className="mx-auto max-w-shell">
        <p className="label mb-8 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" />
          {site.role} · {site.location}
        </p>

        {/* Sized so the claim and its evidence share the first screen — the
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

        <div className="mt-12 grid items-start gap-x-16 gap-y-10 lg:grid-cols-[1.15fr_1fr]">
          {/* The claim. */}
          <p className="max-w-prose text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.65] text-bone-2">
            {/* Anchors, not buttons: a footnote points at its source, and an
                inline anchor wraps across lines where a button cannot. */}
            {thesis.lede.map((seg, i) =>
              seg.ref ? (
                <a
                  key={i}
                  href={`#ev-${seg.ref}`}
                  className="claim text-bone [box-decoration-break:clone]"
                  data-active={active === seg.ref}
                  onMouseEnter={() => setActive(seg.ref ?? null)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(seg.ref ?? null)}
                  onBlur={() => setActive(null)}
                >
                  {seg.text}
                  <span className="marker">{indexOf(seg.ref)}</span>
                </a>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </p>

          {/* The evidence. */}
          <div>
            <p className="label mb-4 border-b border-rule pb-3">Sources</p>
            <ol className="space-y-px">
              {evidence.map((e, i) => {
                const on = active === e.id;
                return (
                  <li
                    key={e.id}
                    id={`ev-${e.id}`}
                    onMouseEnter={() => setActive(e.id)}
                    onMouseLeave={() => setActive(null)}
                    className={`border-l-2 py-3 pl-4 transition-colors duration-200 ${
                      on ? "border-amber bg-amber-wash/60" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-amber">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-[15px] font-medium text-bone">{e.claim}</span>
                          <span className="font-mono text-micro uppercase text-bone-3">
                            {e.kind === "source" ? "code" : "self-reported"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-bone-2">{e.detail}</p>
                        {e.href && (
                          <a
                            href={e.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
                          >
                            {e.hrefLabel} <span aria-hidden>↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
