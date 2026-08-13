"use client";

// A running head, not a nav bar. It states what the document is and where you
// are in it — the section indicator updates as you scroll, the way a header
// tells you which chapter you are in.

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/data";

const sections = [
  { id: "work", label: "Work" },
  { id: "record", label: "Record" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Masthead() {
  const [here, setHere] = useState<string | null>(null);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setHere(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b bg-ground/85 backdrop-blur transition-[border-color,padding] duration-300 ${
        condensed ? "border-rule py-2.5" : "border-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-shell items-center justify-between gap-6 px-[var(--shell-x)]">
        <Link href="/" className="group flex min-w-0 items-baseline gap-3">
          <span className="display truncate text-[17px] leading-none sm:text-[19px]">{site.name}</span>
          <span className="hidden font-mono text-micro uppercase text-bone-3 sm:inline">{site.role}</span>
        </Link>

        {/* Below sm the section links are dropped rather than wrapped: a fixed
            header that reflows changes height mid-scroll, and the page is one
            document you can simply scroll. */}
        <nav className="flex items-center gap-5 sm:gap-7">
          <span className="hidden items-center gap-5 sm:flex sm:gap-7">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`/#${s.id}`}
                className={`font-mono text-micro uppercase transition-colors ${
                  here === s.id ? "text-amber" : "text-bone-3 hover:text-bone"
                }`}
              >
                {s.label}
              </a>
            ))}
          </span>
          {site.resumeUrl && (
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap border border-bone px-3 py-1.5 font-mono text-micro uppercase text-bone transition-colors hover:bg-bone hover:text-ground"
            >
              Resume
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
