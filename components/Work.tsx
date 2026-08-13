"use client";

// Selected work.
//
// Images and numbers lead here, prose recedes. Tier 1 opens with a picture —
// the real demo screenshot where one exists, otherwise the project's own
// method diagram — followed by the result line and the metrics that back it.
// The blurb stays out: `result` plus three `metrics` already say what the
// project proves, and repeating the pitch in a paragraph is exactly the essay
// shape this layout exists to cut.
//
// The chips filter on `track`, not `tier` — tier is a curation call the
// visitor doesn't need to make, track is a genuine "what am I looking for".

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projects, type Project } from "@/lib/data";
import Figure from "./Figures";

type Track = "all" | "ai" | "quant";

// Colour carries meaning (tailwind.config.ts:10-13): amber for AI/ML and
// agentic work, aqua for quant and systems. Every field below is a complete,
// literal class-name string — even though it's assembled into a className via
// a variable, Tailwind's static scan reads the raw file text, so the literal
// has to appear somewhere in this file for the CSS to exist.
function accent(track: Project["track"]) {
  return track === "ai"
    ? {
        dot: "bg-amber",
        hoverText: "hover:text-amber",
        groupHoverText: "group-hover:text-amber",
        border: "border-amber",
        underline: "text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber",
        liveBtn:
          "border border-amber px-4 py-2 font-mono text-micro uppercase text-amber transition-colors hover:bg-amber hover:text-ground",
        liveBtnTight:
          "border border-amber px-3 py-1.5 font-mono text-micro uppercase text-amber transition-colors hover:bg-amber hover:text-ground",
      }
    : {
        dot: "bg-aqua",
        hoverText: "hover:text-aqua",
        groupHoverText: "group-hover:text-aqua",
        border: "border-aqua",
        underline: "text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua",
        liveBtn:
          "border border-aqua px-4 py-2 font-mono text-micro uppercase text-aqua transition-colors hover:bg-aqua hover:text-ground",
        liveBtnTight:
          "border border-aqua px-3 py-1.5 font-mono text-micro uppercase text-aqua transition-colors hover:bg-aqua hover:text-ground",
      };
}

function chipClass(active: boolean, kind: Track) {
  const base = "border px-4 py-2 font-mono text-micro uppercase transition-colors";
  if (!active) {
    if (kind === "ai") return `${base} border-rule text-bone-2 hover:border-amber hover:text-amber`;
    if (kind === "quant") return `${base} border-rule text-bone-2 hover:border-aqua hover:text-aqua`;
    return `${base} border-rule text-bone-2 hover:border-bone hover:text-bone`;
  }
  if (kind === "ai") return `${base} border-amber bg-amber text-ground`;
  if (kind === "quant") return `${base} border-aqua bg-aqua text-ground`;
  return `${base} border-bone bg-bone text-ground`;
}

// One card shape, two sizes. `lg` (tier 1) leads with the real screenshot
// when a project has one; `md` (tier 2) is always figure-led, tighter.
function ProjectCard({ p, size }: { p: Project; size: "lg" | "md" }) {
  const a = accent(p.track);
  const tight = size === "md";

  return (
    <article>
      <div className="mb-5">
        {size === "lg" && p.shot ? (
          <div className="border border-rule bg-ground-2">
            <Image
              src={p.shot.src}
              alt={p.shot.alt}
              width={1200}
              height={616}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="block h-auto w-full"
            />
          </div>
        ) : (
          <Figure kind={p.figure} />
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${a.dot}`} />
        <span className="font-mono text-micro uppercase text-bone-3">
          {p.domain} · {p.year}
        </span>
      </div>

      <h3
        className={`display mt-2 leading-[1.05] ${
          tight ? "text-[clamp(1.2rem,1.8vw,1.5rem)]" : "text-[clamp(1.5rem,2.6vw,2.1rem)]"
        }`}
      >
        <Link href={`/work/${p.slug}`} className={a.hoverText}>
          {p.title}
        </Link>
      </h3>

      <p
        className={`max-w-prose border-l-2 ${a.border} pl-4 leading-relaxed text-bone ${
          tight ? "mt-3 text-[0.92rem]" : "mt-4 text-[1.02rem]"
        }`}
      >
        {p.result}
      </p>

      {/* Fixed columns so the numbers line up as a row of readings rather
          than reflowing into a ragged block. */}
      <dl className={`grid grid-cols-3 gap-x-5 border-t border-rule ${tight ? "mt-5 gap-y-3 pt-4" : "mt-6 gap-y-5 pt-5"}`}>
        {p.metrics.map((m) => (
          <div key={m.label}>
            <dt className={`display leading-none ${tight ? "text-[1.15rem]" : "text-[1.6rem]"}`}>{m.value}</dt>
            <dd className="label mt-1.5 leading-[1.5]">{m.label}</dd>
          </div>
        ))}
      </dl>

      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${tight ? "mt-5" : "mt-6"}`}>
        {/* A project you can open beats one you can only read about, so the
            live link leads. */}
        {p.live && (
          <a href={p.live} target="_blank" rel="noopener noreferrer" className={tight ? a.liveBtnTight : a.liveBtn}>
            Try it live ↗
          </a>
        )}
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener noreferrer" className={`font-mono text-micro uppercase ${a.underline}`}>
            Source ↗
          </a>
        )}
        <span className="font-mono text-micro uppercase text-bone-3">{p.stack.slice(0, tight ? 3 : 4).join(" · ")}</span>
      </div>
    </article>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<Track>("all");

  const aiCount = projects.filter((p) => p.track === "ai").length;
  const quantCount = projects.filter((p) => p.track === "quant").length;
  const chips: { key: Track; label: string }[] = [
    { key: "all", label: `All (${projects.length})` },
    { key: "ai", label: `AI & Agents (${aiCount})` },
    { key: "quant", label: `Quant & Systems (${quantCount})` },
  ];

  const visible = filter === "all" ? projects : projects.filter((p) => p.track === filter);
  const tier1 = visible.filter((p) => p.tier === 1);
  const tier2 = visible.filter((p) => p.tier === 2);
  const tier3 = visible.filter((p) => p.tier === 3);

  return (
    <section id="work" className="border-b border-rule px-[var(--shell-x)] py-20 sm:py-28">
      <div className="mx-auto max-w-shell">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
          <div>
            <p className="label mb-3">Work</p>
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">Selected work</h2>
          </div>
          <Link
            href="/work"
            className="font-mono text-label uppercase text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
          >
            All {projects.length} projects ↗
          </Link>
        </header>

        <div role="group" aria-label="Filter projects by track" className="mb-14 flex flex-wrap gap-3">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={filter === c.key}
              onClick={() => setFilter(c.key)}
              className={chipClass(filter === c.key, c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="space-y-20">
          {tier1.length > 0 && (
            <div className="grid gap-x-12 gap-y-16 lg:grid-cols-2">
              {tier1.map((p) => (
                <ProjectCard key={p.slug} p={p} size="lg" />
              ))}
            </div>
          )}

          {tier2.length > 0 && (
            <div>
              <p className="label mb-8 border-t border-rule pt-8">More work</p>
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {tier2.map((p) => (
                  <ProjectCard key={p.slug} p={p} size="md" />
                ))}
              </div>
            </div>
          )}

          {tier3.length > 0 && (
            <div>
              <p className="label mb-6 border-t border-rule pt-8">Also built</p>
              <ul className="border-t border-rule">
                {tier3.map((p) => {
                  const a = accent(p.track);
                  return (
                    <li key={p.slug} className="border-b border-rule">
                      <Link
                        href={`/work/${p.slug}`}
                        className="group grid gap-2 py-5 sm:grid-cols-[18rem_1fr_9rem] sm:items-baseline sm:gap-8"
                      >
                        <span className={`flex items-center gap-2.5 text-[1.05rem] font-medium text-bone ${a.groupHoverText}`}>
                          <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
                          {p.title}
                        </span>
                        <span className="leading-relaxed text-bone-2">{p.tagline}</span>
                        <span className="font-mono text-micro uppercase text-bone-3 sm:text-right">{p.year}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
