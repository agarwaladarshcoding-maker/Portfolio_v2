// Codeforces stats for AdarshAg, fetched live.
//
// The site shows the trajectory — problems solved, contests, the climb — not
// the absolute rating. That's a rendering decision made in Practice.tsx; this
// module just gets the numbers right and must never throw: a portfolio
// cannot 500 because Codeforces is slow, rate-limiting, or down.

const HANDLE = "AdarshAg";

export type CpStats = {
  solved: number;
  submissions: number;
  contests: number;
  ratedUp: number;
  climb: number;
  points: { date: string; rating: number }[];
  asOf: string;
  fallback: boolean;
};

// The real snapshot, queried directly against the public API and hand-verified.
// Served whenever the live fetch fails, times out, or comes back in a shape
// we don't trust.
const FALLBACK: CpStats = {
  solved: 385,
  submissions: 751,
  contests: 6,
  ratedUp: 6,
  climb: 647,
  points: [
    { date: "2026-02-27", rating: 374 },
    { date: "2026-04-04", rating: 650 },
    { date: "2026-05-30", rating: 788 },
    { date: "2026-06-28", rating: 864 },
    { date: "2026-06-30", rating: 963 },
    { date: "2026-08-04", rating: 1021 },
  ],
  asOf: "2026-08-13",
  fallback: true,
};

type RatingChange = {
  contestId: number;
  contestName: string;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
};

type Submission = {
  verdict?: string;
  problem?: { contestId?: number; index?: string };
};

async function fetchResult<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(5000),
  });
  const body = (await res.json()) as { status?: string; result?: T };
  if (body.status !== "OK" || body.result === undefined) {
    throw new Error(`Codeforces API status: ${body.status ?? "unknown"}`);
  }
  return body.result;
}

export async function getCpStats(): Promise<CpStats> {
  try {
    const [ratings, submissions] = await Promise.all([
      fetchResult<RatingChange[]>(`https://codeforces.com/api/user.rating?handle=${HANDLE}`),
      fetchResult<Submission[]>(
        `https://codeforces.com/api/user.status?handle=${HANDLE}&from=1&count=10000`,
      ),
    ]);

    if (!Array.isArray(ratings) || ratings.length === 0 || !Array.isArray(submissions)) {
      return FALLBACK;
    }

    // Unique (contestId, index) pairs where the verdict is OK. The same
    // problem is often solved more than once, which is why 751 submissions
    // collapse to 385 solved.
    const solved = new Set<string>();
    for (const s of submissions) {
      if (s.verdict === "OK" && s.problem && s.problem.index) {
        solved.add(`${s.problem.contestId}_${s.problem.index}`);
      }
    }

    const ratedUp = ratings.filter((r) => r.newRating > r.oldRating).length;
    // Baselined at the first contest's *new* rating, not its oldRating — a
    // brand-new account's oldRating is 0 (unrated), not a real prior score,
    // and last.newRating minus 0 would equal the absolute rating itself,
    // which this module exists to never expose.
    const climb = ratings[ratings.length - 1].newRating - ratings[0].newRating;
    const points = ratings.map((r) => ({
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
      rating: r.newRating,
    }));

    return {
      solved: solved.size,
      submissions: submissions.length,
      contests: ratings.length,
      ratedUp,
      climb,
      points,
      asOf: new Date().toISOString().slice(0, 10),
      fallback: false,
    };
  } catch {
    return FALLBACK;
  }
}
