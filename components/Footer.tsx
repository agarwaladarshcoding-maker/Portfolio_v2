"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/lib/content";

export default function Footer() {
  const { content } = useContent();
  const site = content.site;
  const [clock, setClock] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: site.timezone,
          }).format(new Date()),
        );
      } catch {
        setClock(new Date().toLocaleTimeString());
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [site.timezone]);

  return (
    <footer className="relative z-10 border-t border-ink-line px-[var(--shell-x)] py-8">
      <div className="mx-auto flex max-w-shell flex-col items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-mute sm:flex-row">
        <span>{"\u00A9"} {new Date().getFullYear()} {site.name}</span>
        <span>{site.location} {"\u00B7"} {clock}</span>
        <div className="flex items-center gap-5">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="transition-colors hover:text-bone"
              data-hover
            >
              {s.label}
            </a>
          ))}
          <a href="/admin" className="transition-colors hover:text-bone" data-hover>
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
