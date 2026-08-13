"use client";

// A colophon rather than a footer: what the document is made of. It suits the
// preprint framing, and on a site arguing for verifiable claims it would be odd
// to hide how the page itself is built.

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/data";

export default function Colophon() {
  // Empty until mount — the server has no client timezone, and rendering a
  // placeholder here is a hydration-mismatch source.
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: site.timezone,
          }).format(new Date()),
        );
      } catch {
        setClock("");
      }
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [site.timezone]);

  return (
    <footer className="px-[var(--shell-x)] py-14">
      <div className="mx-auto max-w-shell">
        <div className="grid gap-8 border-t border-rule pt-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display text-[1.4rem] leading-none">{site.name}</p>
            <p className="mt-2 font-mono text-micro uppercase text-bone-3">
              {site.location}
              {clock && ` · ${clock} IST`}
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            <span className="label mb-1">Pages</span>
            {[
              { href: "/work", label: "Work" },
              { href: "/now", label: "Now" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-[15px] text-bone-2 hover:text-amber">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <span className="label mb-1">Elsewhere</span>
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-bone-2 hover:text-amber"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-10 max-w-prose font-mono text-[10px] leading-relaxed text-bone-3">
          Set in Bodoni Moda and IBM Plex. Built with Next.js and Tailwind, deployed on
          Vercel. Figures are drawn from each project&apos;s own method — they illustrate
          the mechanism, not a benchmark run. Source for this site is on GitHub.
        </p>
      </div>
    </footer>
  );
}
