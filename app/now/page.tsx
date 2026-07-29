"use client";

// /now — what I'm doing at the moment.
//
// Same rule as the rest of the site: where a line can be checked, it links to
// the thing that checks it. The date is set in large type because a /now page
// with a stale date is worse than no /now page at all.

import Link from "next/link";
import { useContent } from "@/lib/content";

export default function NowPage() {
  const { content } = useContent();
  const now = content.now;

  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-24 pt-32">
      <Link href="/" className="font-mono text-micro uppercase text-bone-3 hover:text-amber">
        ← Index
      </Link>

      <p className="label mt-8">Updated {now.updated}</p>
      <h1 className="display display-tight mt-4 text-[clamp(2.5rem,8vw,6rem)]">Now</h1>
      <p className="mt-5 max-w-prose leading-relaxed text-bone-2">{now.intro}</p>

      <dl className="mt-16 border-t border-rule">
        {now.items.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 border-b border-rule py-7 sm:grid-cols-[180px_1fr] sm:gap-8"
          >
            <dt className="label pt-1">{item.label}</dt>
            <dd className="max-w-prose leading-relaxed text-bone">
              {item.text}
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 whitespace-nowrap font-mono text-micro uppercase text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
                >
                  {item.hrefLabel ?? "Source"} ↗
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 max-w-prose font-mono text-micro leading-relaxed text-bone-3">
        Inspired by <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="underline decoration-rule-strong underline-offset-4 hover:text-amber">Derek Sivers&rsquo; /now page</a> idea.
      </p>
    </main>
  );
}
