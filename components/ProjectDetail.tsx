import Link from "next/link";
import { projects } from "@/lib/data";
import Figure from "./Figures";

export default function ProjectDetail({ slug }: { slug: string }) {
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = idx >= 0 ? projects[idx] : undefined;

  if (!project) {
    return (
      <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-24 pt-32">
        <Link href="/work" className="font-mono text-micro uppercase text-bone-3 hover:text-amber">
          ← All work
        </Link>
        <h1 className="display mt-8 text-5xl">Not found</h1>
        <p className="mt-4 max-w-prose text-bone-2">
          That project may have been renamed. The full list is on the work page.
        </p>
      </main>
    );
  }

  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="mx-auto max-w-shell px-[var(--shell-x)] pb-24 pt-32">
      <Link href="/work" className="font-mono text-micro uppercase text-bone-3 hover:text-amber">
        ← All work
      </Link>

      <header className="mt-8 border-b border-rule pb-10">
        <p className="label">
          {project.domain} · {project.year} · {project.role}
        </p>
        <h1 className="display display-tight mt-4 text-[clamp(2.25rem,6.5vw,4.75rem)]">{project.title}</h1>
        <p className="mt-5 max-w-prose text-[1.15rem] leading-relaxed text-bone-2">{project.tagline}</p>

        <p className="mt-7 max-w-prose border-l-2 border-amber pl-4 text-[1.05rem] leading-relaxed text-bone">
          {project.result}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-bone px-4 py-2 font-mono text-micro uppercase transition-colors hover:bg-bone hover:text-ground"
            >
              Read the source ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-micro uppercase text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
            >
              Live ↗
            </a>
          )}
        </div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <div className="max-w-prose space-y-5 text-[1.05rem] leading-relaxed text-bone-2">
            {project.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <h2 className="label mt-12 border-b border-rule pb-3">What it does</h2>
          <ul className="mt-5 space-y-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 leading-relaxed text-bone-2">
                <span className="mt-[10px] h-1 w-3 shrink-0 bg-amber" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <aside>
          <Figure kind={project.figure} />

          <dl className="mt-8 border-t border-rule pt-6">
            {project.metrics.map((m) => (
              <div key={m.label} className="mb-5">
                <dt className="display text-[1.75rem] leading-none">{m.value}</dt>
                <dd className="label mt-1.5">{m.label}</dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-rule pt-6">
            <p className="label mb-3">Built with</p>
            <p className="font-mono text-[12px] leading-relaxed text-bone-2">{project.stack.join(" · ")}</p>
          </div>
        </aside>
      </div>

      {next && (
        <Link href={`/work/${next.slug}`} className="group mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-8">
          <span className="label">Next</span>
          <span className="display text-[1.6rem] group-hover:text-amber">{next.title} →</span>
        </Link>
      )}
    </main>
  );
}
