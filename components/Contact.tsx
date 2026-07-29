"use client";

import { useContent } from "@/lib/content";

export default function Contact() {
  const { content } = useContent();
  const { site } = content;

  return (
    <section id="contact" className="border-b border-rule px-[var(--shell-x)] py-20 sm:py-28">
      <div className="mx-auto max-w-shell">
        <p className="label mb-8 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" />
          Open to AI/ML and quant internships
        </p>

        <a
          href={`mailto:${site.email}`}
          className="display block break-words text-[clamp(1.6rem,5.5vw,4.5rem)] leading-[1.05] transition-colors hover:text-amber"
        >
          {site.email}
        </a>

        <p className="mt-8 max-w-prose leading-relaxed text-bone-2">
          If you are hiring and want to check something on this page, ask. The sources are
          linked throughout, and I would rather answer a hard question about the code than
          a soft one about the summary.
        </p>
      </div>
    </section>
  );
}
