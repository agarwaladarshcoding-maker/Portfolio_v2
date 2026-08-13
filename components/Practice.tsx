// Practice: live Codeforces stats.
//
// A deliberate framing decision, not an oversight: the audience here is
// AI/ML and quant recruiters, for whom a "newbie" rating badge would read as
// "barely started" even though the trajectory — rated up in every one of six
// contests, +647 total — says the opposite. So this section shows the climb,
// never the absolute number, and the y-axis carries no scale. The profile
// link is what keeps that honest: the full record is one click away, not hidden.

import { getCpStats } from "@/lib/codeforces";
import { achievements } from "@/lib/data";

const AQUA = "#7BD3C0";
const BONE = "#F0E9DD";
const RULE = "#24434E";

function monthLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function Practice() {
  const stats = await getCpStats();
  const win = achievements[2];

  const w = 560;
  const h = 160;
  const pad = { l: 14, r: 14, t: 16, b: 26 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const last = stats.points.length - 1;
  const ratings = stats.points.map((p) => p.rating);
  const lo = Math.min(...ratings);
  const hi = Math.max(...ratings);
  const x = (i: number) => pad.l + (i / last) * iw;
  const y = (r: number) => pad.t + (hi === lo ? ih / 2 : ((hi - r) / (hi - lo)) * ih);
  const d = stats.points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.rating).toFixed(1)}`)
    .join("");
  // Rough path length for the draw-on dash array — it only needs to cover
  // the stroke, not match it exactly.
  const pathLen = Math.round(iw * 1.3);

  return (
    <section id="practice" className="border-b border-rule px-[var(--shell-x)] py-20 sm:py-28">
      <div className="mx-auto max-w-shell">
        <header className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
          <div>
            <p className="label mb-3 flex items-center gap-2.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-aqua" />
              Competitive programming
            </p>
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">Practice</h2>
          </div>
          <a
            href="https://codeforces.com/profile/AdarshAg"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-label uppercase text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua"
          >
            Full record on Codeforces ↗
          </a>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* The sparkline. Endpoints are dated, not numbered — the shape of
              the climb is the claim, not the level it starts or ends at. */}
          <figure className="figure h-max border border-rule bg-ground-2">
            <div className="border-b border-rule px-4 py-2.5">
              <span className="font-mono text-[11px] tracking-[0.06em] text-bone-3">
                Fig. — Codeforces rating, six rated contests
              </span>
            </div>
            <div className="p-4">
              <svg
                viewBox={`0 0 ${w} ${h}`}
                className="w-full"
                role="img"
                aria-label={`Codeforces rating rising across ${stats.contests} rated contests, from ${monthLabel(stats.points[0].date)} to ${monthLabel(stats.points[last].date)}`}
              >
                <line x1={pad.l} x2={w - pad.r} y1={pad.t + ih} y2={pad.t + ih} stroke={RULE} strokeWidth="1" />
                <path
                  d={d}
                  fill="none"
                  stroke={AQUA}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  className="draw"
                  style={{ ["--len" as string]: pathLen }}
                />
                {stats.points.map((p, i) => (
                  <circle key={p.date} cx={x(i)} cy={y(p.rating)} r="2.6" fill={i === last ? BONE : AQUA} />
                ))}
                {/* No numeric axis by design — the endpoints are dated instead. */}
                <text x={x(0)} y={h - 8} textAnchor="start">
                  {monthLabel(stats.points[0].date)}
                </text>
                <text x={x(last)} y={h - 8} textAnchor="end">
                  {monthLabel(stats.points[last].date)}
                </text>
              </svg>
            </div>
          </figure>

          <div>
            <p className="max-w-prose font-mono text-[13px] uppercase tracking-[0.04em] text-bone-2">
              <span className="text-aqua">{stats.solved}</span> solved{" "}
              <span aria-hidden className="text-bone-3">
                ·
              </span>{" "}
              <span className="text-aqua">{stats.contests}</span> contests{" "}
              <span aria-hidden className="text-bone-3">
                ·
              </span>{" "}
              rated up in all {stats.contests}{" "}
              <span aria-hidden className="text-bone-3">
                ·
              </span>{" "}
              <span className="text-aqua">
                {stats.climb >= 0 ? "+" : ""}
                {stats.climb}
              </span>
            </p>

            {/* The daily log rather than a restatement of the numbers above:
                the commit history is the part a reader can actually check. */}
            <p className="mt-5 max-w-prose leading-relaxed text-bone-2">
              Practised daily and pushed publicly, whether the day went well or not — the
              gap is visible when it isn&apos;t.{" "}
              <a
                href="https://github.com/agarwaladarshcoding-maker/Becoming-God"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua"
              >
                The daily log ↗
              </a>
            </p>

            <div className="mt-7 border-t border-rule pt-5">
              <span className="text-[1.05rem] font-medium text-bone">{win.title}</span>
              <p className="mt-1.5 leading-relaxed text-bone-2">{win.detail}</p>
            </div>

            {stats.fallback && (
              <p className="mt-7 font-mono text-[10px] leading-relaxed text-bone-3">
                Codeforces didn&apos;t respond — figures shown are a snapshot as of {stats.asOf},
                not a live read.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
