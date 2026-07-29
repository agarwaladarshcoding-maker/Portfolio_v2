// Data behind the figures.
//
// Each series is generated once, at module load, from a fixed seed — so the
// server and the browser draw byte-identical curves and nothing hydrates
// wrong. These are diagrams of the method, not results pulled from a run; the
// figures say so on the page rather than implying live data.

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box–Muller, so the shocks are actually normal rather than uniform noise.
function normals(rand: () => number, n: number): number[] {
  const out: number[] = [];
  while (out.length < n) {
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    const r = Math.sqrt(-2 * Math.log(u));
    out.push(r * Math.cos(2 * Math.PI * v));
    out.push(r * Math.sin(2 * Math.PI * v));
  }
  return out.slice(0, n);
}

// ── Spread ────────────────────────────────────────────────────────────────
// An Ornstein–Uhlenbeck process: the shape a cointegrated spread has when the
// ADF test passes. Pulls back toward zero, which is the whole trade.
export type SpreadPoint = { i: number; z: number };

export const spread: SpreadPoint[] = (() => {
  const rand = mulberry32(7);
  const shocks = normals(rand, 200);
  const theta = 0.055; // pull toward the mean
  const sigma = 0.42;
  let z = 0.6;
  const out: SpreadPoint[] = [];
  for (let i = 0; i < 200; i += 1) {
    z = z - theta * z + sigma * shocks[i];
    out.push({ i, z: Math.max(-3.4, Math.min(3.4, z)) });
  }
  return out;
})();

// Entry marks: the first bar of each excursion beyond ±2σ. Consecutive bars
// past the band are the same trade, so they are not marked twice.
export const spreadEntries: SpreadPoint[] = spread.filter(
  (p, i) => Math.abs(p.z) >= 2 && (i === 0 || Math.abs(spread[i - 1].z) < 2),
);

// ── Monte Carlo paths ─────────────────────────────────────────────────────
// Geometric Brownian motion under a down-and-out barrier. A path that touches
// the barrier is knocked out and abandoned at that step — which is the
// optimisation the project is about, so the figure has to show the stop.
export type Path = { pts: number[]; knockedOutAt: number | null };

export const BARRIER = 0.82;

export const paths: Path[] = (() => {
  const rand = mulberry32(21);
  const steps = 64;
  const mu = 0.05 / 252;
  const vol = 0.0165;
  const out: Path[] = [];
  for (let p = 0; p < 34; p += 1) {
    const shocks = normals(rand, steps);
    const pts: number[] = [1];
    let s = 1;
    let knockedOutAt: number | null = null;
    for (let t = 0; t < steps; t += 1) {
      s = s * Math.exp(mu - 0.5 * vol * vol + vol * shocks[t]);
      pts.push(s);
      if (s <= BARRIER) {
        knockedOutAt = t + 1;
        break;
      }
    }
    out.push({ pts, knockedOutAt });
  }
  return out;
})();

// ── PCA variance ──────────────────────────────────────────────────────────
// Eigenvalue spectrum of a correlated multi-asset return matrix: one dominant
// market factor, then a fast decay. Cumulative crosses 95% at component 6.
export const varianceSpectrum = [0.541, 0.187, 0.093, 0.061, 0.042, 0.031, 0.019, 0.013, 0.008, 0.005];

export const cumulativeVariance: number[] = varianceSpectrum.reduce<number[]>(
  (acc, v) => [...acc, (acc[acc.length - 1] ?? 0) + v],
  [],
);

// ── Order book ────────────────────────────────────────────────────────────
// A depth ladder around a 101.00 mid. Price-time priority means the top of
// each side is what a marketable order hits first.
export type Level = { price: string; size: number };

export const book: { bids: Level[]; asks: Level[]; mid: string } = {
  asks: [
    { price: "101.04", size: 180 },
    { price: "101.03", size: 420 },
    { price: "101.02", size: 260 },
    { price: "101.01", size: 640 },
  ],
  bids: [
    { price: "100.99", size: 700 },
    { price: "100.98", size: 310 },
    { price: "100.97", size: 480 },
    { price: "100.96", size: 150 },
  ],
  mid: "101.00",
};

// ── Claim verification ────────────────────────────────────────────────────
// The four verdicts the medical RAG assigns to each atomic claim in its own
// answer. Wording matches the labels in the repo.
export type Verdict = "SUPPORTED" | "WEAK" | "UNSUPPORTED" | "CONTRADICTED";

export const verdicts: { verdict: Verdict; share: number; note: string }[] = [
  { verdict: "SUPPORTED", share: 0.62, note: "entailed by a retrieved passage" },
  { verdict: "WEAK", share: 0.21, note: "partially entailed, low confidence" },
  { verdict: "UNSUPPORTED", share: 0.12, note: "no passage entails it" },
  { verdict: "CONTRADICTED", share: 0.05, note: "a passage says otherwise" },
];

// ── Agent trace ───────────────────────────────────────────────────────────
// The event types AgentWatch classifies out of a CLI agent's stdout.
export const traceEvents: { t: string; state: string; span: number }[] = [
  { t: "00:00", state: "thinking", span: 3 },
  { t: "00:04", state: "reading", span: 2 },
  { t: "00:07", state: "writing", span: 4 },
  { t: "00:12", state: "waiting", span: 2 },
  { t: "00:15", state: "writing", span: 3 },
  { t: "00:19", state: "done", span: 1 },
];
