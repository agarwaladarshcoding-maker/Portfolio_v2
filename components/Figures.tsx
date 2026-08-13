// Figures.
//
// One per project, each drawn from the thing the project actually does. They
// are method diagrams, and the caption says so — a chart that implies a live
// backtest it cannot produce would be exactly the kind of unchecked claim this
// site is arguing against.

import {
  spread,
  spreadEntries,
  paths,
  BARRIER,
  varianceSpectrum,
  cumulativeVariance,
  book,
  verdicts,
  traceEvents,
  type Verdict,
} from "@/lib/figures";
import type { FigureKind } from "@/lib/data";

const BONE = "#F0E9DD";
const AMBER = "#FFB870";
const AQUA = "#7BD3C0";
const RULE = "#24434E";
const MUTE = "#8298A0";

// Captions stay in sentence case: uppercasing them would mangle the notation
// (±2σ becomes ±2Σ) and a figure caption should read quietly anyway.
function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <figure className="figure h-max border border-rule bg-ground-2">
      <div className="border-b border-rule px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.06em] text-bone-3">{label}</span>
      </div>
      <div className="p-4">{children}</div>
    </figure>
  );
}

/* ── Spread: z-score with ±2σ bands ─────────────────────────────────────── */
function SpreadFigure() {
  const w = 560;
  const h = 200;
  const pad = { l: 26, r: 10, t: 10, b: 18 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / (spread.length - 1)) * iw;
  const y = (z: number) => pad.t + ((3.5 - z) / 7) * ih;
  const d = spread.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.i).toFixed(1)},${y(p.z).toFixed(1)}`).join("");

  return (
    <Frame label="Fig. — spread z-score, ±2σ entry band">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Mean-reverting spread z-score crossing plus and minus two sigma bands">
        {/* Bands. The trade only exists outside them. */}
        <rect x={pad.l} y={y(2)} width={iw} height={y(-2) - y(2)} fill={AQUA} opacity="0.045" />
        {[2, -2].map((z) => (
          <line key={z} x1={pad.l} x2={w - pad.r} y1={y(z)} y2={y(z)} stroke={AQUA} strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />
        ))}
        <line x1={pad.l} x2={w - pad.r} y1={y(0)} y2={y(0)} stroke={RULE} strokeWidth="1" />
        {[3, 2, 0, -2, -3].map((z) => (
          <text key={z} x={pad.l - 6} y={y(z) + 3} textAnchor="end">
            {z > 0 ? `+${z}` : z}
          </text>
        ))}
        <path d={d} fill="none" stroke={BONE} strokeWidth="1.4" strokeLinejoin="round" className="draw" style={{ ["--len" as string]: 3000 }} />
        {spreadEntries.map((p) => (
          <circle key={p.i} cx={x(p.i)} cy={y(p.z)} r="3.2" fill={AQUA} />
        ))}
        <text x={w - pad.r} y={h - 4} textAnchor="end">
          {spreadEntries.length} band crossings · 200 sessions
        </text>
      </svg>
    </Frame>
  );
}

/* ── Paths: GBM under a knock-out barrier ──────────────────────────────── */
function PathsFigure() {
  const w = 560;
  const h = 200;
  const pad = { l: 30, r: 10, t: 10, b: 18 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const lo = 0.74;
  const hi = 1.24;
  const steps = 64;
  const x = (i: number) => pad.l + (i / steps) * iw;
  const y = (v: number) => pad.t + ((hi - v) / (hi - lo)) * ih;
  const knocked = paths.filter((p) => p.knockedOutAt !== null).length;

  return (
    <Frame label="Fig. — GBM paths, down-and-out barrier">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Simulated price paths, with paths that touch the barrier abandoned at the point of breach">
        {[1.2, 1.0, 0.8].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke={RULE} strokeWidth="1" />
            <text x={pad.l - 6} y={y(v) + 3} textAnchor="end">
              {v.toFixed(2)}
            </text>
          </g>
        ))}
        {paths.map((p, idx) => {
          const out = p.knockedOutAt !== null;
          const d = p.pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
          return (
            <g key={idx}>
              <path d={d} fill="none" stroke={out ? MUTE : AQUA} strokeWidth={out ? 0.7 : 0.9} opacity={out ? 0.42 : 0.55} />
              {out && <circle cx={x(p.knockedOutAt as number)} cy={y(p.pts[p.pts.length - 1])} r="2" fill={BONE} />}
            </g>
          );
        })}
        {/* The barrier. Everything below it stops existing. */}
        <line x1={pad.l} x2={w - pad.r} y1={y(BARRIER)} y2={y(BARRIER)} stroke={BONE} strokeWidth="1.4" />
        <text x={pad.l + 4} y={y(BARRIER) - 5} fill={BONE}>
          BARRIER {BARRIER.toFixed(2)}
        </text>
        <text x={w - pad.r} y={h - 4} textAnchor="end">
          {knocked} of {paths.length} knocked out — abandoned at breach, not at expiry
        </text>
      </svg>
    </Frame>
  );
}

/* ── Variance: scree + cumulative ──────────────────────────────────────── */
function VarianceFigure() {
  const w = 560;
  const h = 200;
  const pad = { l: 30, r: 30, t: 12, b: 24 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const n = varianceSpectrum.length;
  const bw = iw / n;
  const y = (v: number) => pad.t + (1 - v) * ih;
  const cum = cumulativeVariance
    .map((v, i) => `${i === 0 ? "M" : "L"}${(pad.l + bw * (i + 0.5)).toFixed(1)},${y(v).toFixed(1)}`)
    .join("");
  const crossing = cumulativeVariance.findIndex((v) => v >= 0.95) + 1;

  return (
    <Frame label="Fig. — explained variance per component">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Scree plot of explained variance with a cumulative curve crossing ninety-five percent">
        {[0, 0.5, 0.95].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke={v === 0.95 ? AQUA : RULE} strokeWidth="1" strokeDasharray={v === 0.95 ? "3 3" : undefined} opacity={v === 0.95 ? 0.6 : 1} />
            <text x={w - pad.r + 5} y={y(v) + 3} fill={v === 0.95 ? AQUA : MUTE}>
              {Math.round(v * 100)}%
            </text>
          </g>
        ))}
        {varianceSpectrum.map((v, i) => (
          <rect key={i} x={pad.l + bw * i + bw * 0.22} y={y(v)} width={bw * 0.56} height={ih - (y(v) - pad.t)} fill={BONE} opacity={i === 0 ? 0.85 : 0.28} />
        ))}
        <path d={cum} fill="none" stroke={AQUA} strokeWidth="1.6" className="draw" style={{ ["--len" as string]: 900 }} />
        {cumulativeVariance.map((v, i) => (
          <circle key={i} cx={pad.l + bw * (i + 0.5)} cy={y(v)} r="2.4" fill={AQUA} />
        ))}
        <text x={pad.l} y={h - 6}>
          PC1 carries {Math.round(varianceSpectrum[0] * 100)}% — the market factor
        </text>
        <text x={w - pad.r} y={h - 6} textAnchor="end">
          95% by PC{crossing}
        </text>
      </svg>
    </Frame>
  );
}

/* ── Ladder: price-time priority book ──────────────────────────────────── */
function LadderFigure() {
  const max = Math.max(...book.bids.map((l) => l.size), ...book.asks.map((l) => l.size));
  const Row = ({ level, side }: { level: { price: string; size: number }; side: "bid" | "ask" }) => (
    <div className="flex items-center gap-3 py-[3px] font-mono text-[11px]">
      <span className={side === "ask" ? "w-14 text-bone" : "w-14 text-aqua"}>{level.price}</span>
      <span className="relative h-3 flex-1 bg-ground-3">
        <span
          className={`absolute inset-y-0 ${side === "ask" ? "right-0 bg-bone/25" : "right-0 bg-aqua/35"}`}
          style={{ width: `${(level.size / max) * 100}%` }}
        />
      </span>
      <span className="w-10 text-right text-bone-3">{level.size}</span>
    </div>
  );

  return (
    <Frame label="Fig. — limit order book, price-time priority">
      <div className="px-1">
        <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-bone-3">
          <span>price</span>
          <span>resting size</span>
        </div>
        {book.asks.map((l) => (
          <Row key={l.price} level={l} side="ask" />
        ))}
        <div className="my-2 flex items-center gap-3 border-y border-rule py-1.5 font-mono text-[11px]">
          <span className="w-14 font-medium text-bone">{book.mid}</span>
          <span className="label">mid · spread 0.02</span>
        </div>
        {book.bids.map((l) => (
          <Row key={l.price} level={l} side="bid" />
        ))}
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-bone-3">
          A marketable buy lifts 101.01 first, then 101.02. Within a price level, the order
          that arrived first fills first — O(1) to find the level, FIFO inside it.
        </p>
      </div>
    </Frame>
  );
}

/* ── Claims: the verification layer ────────────────────────────────────── */
// Reads light to dark: the better the verdict, the more of the accent it
// carries. A contradicted claim must not be the brightest mark in the figure.
const verdictStyle: Record<Verdict, string> = {
  SUPPORTED: "bg-amber",
  WEAK: "bg-amber/45",
  UNSUPPORTED: "bg-bone/20",
  CONTRADICTED: "bg-ground-3 ring-1 ring-inset ring-rule-strong",
};

function ClaimsFigure() {
  return (
    <Frame label="Fig. — per-claim verdicts against retrieved passages">
      <div className="px-1">
        {/* The answer is split into atomic claims; each gets its own verdict. */}
        <div className="mb-4 flex h-3 w-full overflow-hidden">
          {verdicts.map((v) => (
            <div key={v.verdict} className={verdictStyle[v.verdict]} style={{ width: `${v.share * 100}%` }} />
          ))}
        </div>
        <dl className="space-y-2">
          {verdicts.map((v) => (
            <div key={v.verdict} className="flex items-baseline gap-3">
              <span className={`mt-[5px] h-2 w-2 shrink-0 ${verdictStyle[v.verdict]}`} />
              <dt className="w-32 shrink-0 font-mono text-[11px] tracking-[0.08em] text-bone">{v.verdict}</dt>
              <dd className="text-[13px] leading-snug text-bone-2">{v.note}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[10px] leading-relaxed text-bone-3">
          Proportions illustrate the scheme, not a benchmark run. The point is that an
          unsupported sentence is labelled instead of silently shipped.
        </p>
      </div>
    </Frame>
  );
}

/* ── Grounding: a cited claim reaches the reply, an uncited one does not ── */
function GroundingFigure() {
  const w = 560;
  const h = 178;
  const agent = { x: 128, y: 64, w: 96, h: 52 };
  const endpointYs = [30, 60, 90, 120, 150];
  const factsX = 370;
  const centerY = 90;

  return (
    <Frame label="Fig. — grounding loop, cited claims reach the reply">
      <div className="px-1">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          role="img"
          aria-label="A tool-calling agent loop: the query goes to the agent, the agent calls five live endpoints, and only a claim carrying a citation from those endpoints reaches the reply — an uncited claim is dropped before it does"
        >
          <text x={312} y={12} textAnchor="middle">5 LIVE ENDPOINTS</text>

          {/* query into the agent */}
          <rect x={16} y={76} width={68} height={28} fill="none" stroke={RULE} strokeWidth="1" />
          <text x={50} y={94} textAnchor="middle" fill={BONE}>QUERY</text>
          <line x1={84} y1={centerY} x2={agent.x} y2={centerY} stroke={RULE} strokeWidth="1" />

          {/* the agent, split across a 70B agent and an 8B router */}
          <rect x={agent.x} y={agent.y} width={agent.w} height={agent.h} fill="none" stroke={AMBER} strokeWidth="1.2" />
          <text x={176} y={87} textAnchor="middle" fill={BONE}>AGENT</text>
          <text x={176} y={101} textAnchor="middle">70B + 8B</text>

          {/* one tool call out per live endpoint */}
          {endpointYs.map((cy) => (
            <line
              key={`out-${cy}`}
              x1={agent.x + agent.w}
              y1={centerY}
              x2={290}
              y2={cy}
              stroke={RULE}
              strokeWidth="0.75"
              opacity="0.7"
            />
          ))}
          {endpointYs.map((cy, i) => (
            <g key={`ep-${cy}`}>
              <rect x={290} y={cy - 8} width={44} height={16} fill="none" stroke={RULE} strokeWidth="1" />
              <text x={312} y={cy + 3} textAnchor="middle">{`0${i + 1}`}</text>
            </g>
          ))}
          {/* facts return, each one carrying a citation back to its endpoint */}
          {endpointYs.map((cy) => (
            <line
              key={`in-${cy}`}
              x1={334}
              y1={cy}
              x2={factsX}
              y2={centerY}
              stroke={AQUA}
              strokeWidth="0.75"
              opacity="0.55"
            />
          ))}
          <circle cx={factsX} cy={centerY} r="3" fill={AQUA} />

          {/* the gate: a cited claim reaches the reply, an uncited one is a dead end */}
          <path
            d={`M${factsX},${centerY} L410,50 L470,50`}
            fill="none"
            stroke={AMBER}
            strokeWidth="1.4"
            strokeLinejoin="round"
            className="draw"
            style={{ ["--len" as string]: 200 }}
          />
          <path d="M453,50 L458,55 L466,42" fill="none" stroke={AMBER} strokeWidth="1.4" />
          <text x={440} y={42} textAnchor="middle" fill={AMBER}>cited claim</text>

          <path
            d={`M${factsX},${centerY} L410,130 L432,130`}
            fill="none"
            stroke={MUTE}
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.6"
          />
          <path d="M427,125 L437,135" stroke={MUTE} strokeWidth="1.2" />
          <path d="M437,125 L427,135" stroke={MUTE} strokeWidth="1.2" />
          <text x={401} y={148} textAnchor="middle">dropped — no citation</text>

          <rect x={470} y={36} width={74} height={28} fill="none" stroke={BONE} strokeWidth="1.2" />
          <text x={507} y={53} textAnchor="middle" fill={BONE}>REPLY</text>
        </svg>
        <p className="mt-4 font-mono text-[10px] leading-relaxed text-bone-3">
          Every claim in the reply is traced to the tool call that returned it. A claim
          that arrives without a citation is dropped before assembly — it never reaches
          the user.
        </p>
      </div>
    </Frame>
  );
}

/* ── Trace: classified agent activity ──────────────────────────────────── */
function TraceFigure() {
  const total = traceEvents.reduce((a, e) => a + e.span, 0);
  return (
    <Frame label="Fig. — classified agent activity, one stdout stream">
      <div className="px-1">
        <div className="mb-4 flex h-8 w-full overflow-hidden border border-rule">
          {traceEvents.map((e, i) => (
            <div
              key={i}
              className={`flex items-center justify-center border-r border-ground-2 last:border-r-0 ${
                e.state === "waiting" ? "bg-ground-3" : e.state === "done" ? "bg-bone" : "bg-amber"
              }`}
              style={{ width: `${(e.span / total) * 100}%`, opacity: e.state === "thinking" ? 0.55 : e.state === "reading" ? 0.75 : 1 }}
            />
          ))}
        </div>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
          {traceEvents.map((e, i) => (
            <li key={i} className="flex items-baseline gap-2 font-mono text-[11px]">
              <span className="text-bone-3">{e.t}</span>
              <span className="text-bone">{e.state}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 font-mono text-[10px] leading-relaxed text-bone-3">
          A TF-IDF + LinearSVC classifier reads the raw output stream and assigns one of
          seven states — replacing regex rules that broke whenever an agent changed its
          wording.
        </p>
      </div>
    </Frame>
  );
}

const figures: Record<FigureKind, () => JSX.Element> = {
  spread: SpreadFigure,
  paths: PathsFigure,
  variance: VarianceFigure,
  ladder: LadderFigure,
  claims: ClaimsFigure,
  trace: TraceFigure,
  grounding: GroundingFigure,
};

export default function Figure({ kind }: { kind: FigureKind }) {
  const Component = figures[kind];
  return <Component />;
}
