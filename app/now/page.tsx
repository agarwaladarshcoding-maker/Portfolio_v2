"use client";

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
          <div key={item.label} className="grid gap-2 border-b border-rule py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
            <dt className="label pt-1">{item.label}</dt>
            <dd className="max-w-prose leading-relaxed text-bone">{item.text}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
