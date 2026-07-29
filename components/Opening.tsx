"use client";

// The opening screen.
//
// It sets the thesis line before the site does, so the first thing you read is
// the argument rather than a spinner. Three rules draw across, the headline
// lands a line at a time, a counter runs underneath, and the whole thing lifts
// away. About two seconds.
//
// Three rules it follows, because intros are the easiest thing on a site to get
// wrong:
//
//   1. Once per session. An animation you cannot skip is charming the first
//      time and an obstacle the second, so sessionStorage remembers.
//   2. Reduced motion is respected properly — not a faster animation, no
//      animation. It shows the headline, holds briefly, and leaves.
//   3. It never traps you. Scroll is locked while it plays and restored in a
//      cleanup that runs whatever happens, plus a wall-clock timeout that ends
//      it even if the animation frames never arrive — requestAnimationFrame is
//      throttled to nothing in a background tab, and without the timeout a site
//      opened in one would sit behind a frozen overlay with scroll disabled.
//   4. It only plays at the front door. Landing on /work or /now from a link
//      means you were sent to that page, and an intro would be in the way.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { thesis } from "@/lib/data";

// useLayoutEffect runs before paint, which is what stops returning visitors
// seeing a flash of the overlay before it removes itself. On the server there
// is no layout pass, so fall back to useEffect to avoid React's warning.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Phase = "checking" | "playing" | "leaving" | "done";

const DURATION = 1750;

export default function Opening() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("checking");
  const [progress, setProgress] = useState(0);
  const frame = useRef<number>();

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Deep links go straight to what they asked for.
    if (pathname !== "/") {
      setPhase("done");
      return;
    }

    // Seen it already this session — skip entirely, before anything paints.
    if (sessionStorage.getItem("openingSeen")) {
      setPhase("done");
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    setPhase("playing");

    const finish = () => {
      sessionStorage.setItem("openingSeen", "1");
      window.scrollTo(0, 0);
      setPhase("leaving");
      window.setTimeout(() => setPhase("done"), 700);
    };

    let timer: number;
    let done = false;
    const finishOnce = () => {
      if (done) return;
      done = true;
      finish();
    };

    if (reduce) {
      setProgress(1);
      timer = window.setTimeout(finishOnce, 700);
    } else {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        setProgress(t);
        if (t < 1) {
          frame.current = requestAnimationFrame(tick);
        } else {
          finishOnce();
        }
      };
      frame.current = requestAnimationFrame(tick);
      // Safety net: rAF stops firing entirely in a background tab, so without
      // this the overlay would still be there — with scroll locked — whenever
      // the visitor came back.
      timer = window.setTimeout(finishOnce, DURATION + 1200);
    }

    // Runs on unmount too, so a fast navigation cannot leave the page unable
    // to scroll.
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    };
  }, [pathname]);

  if (phase === "done") return null;

  const count = Math.round(progress * 100);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-ground px-[var(--shell-x)] py-10 transition-opacity duration-700 ease-out ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Top rule, drawn left to right as the counter runs. */}
      <div className="h-px w-full bg-rule">
        <div
          className="h-px bg-amber transition-none"
          style={{ width: `${count}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-shell flex-1 flex-col justify-center">
        <h1 className="display display-tight text-[clamp(2.25rem,7vw,5.5rem)]">
          {thesis.headline.map((line, i) => {
            // Each line arrives a third of the way through the run.
            const shown = progress > i * 0.22;
            return (
              <span key={line} className="block overflow-hidden">
                <span
                  className="block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: shown ? "translateY(0)" : "translateY(100%)",
                    opacity: shown ? 1 : 0,
                  }}
                >
                  {line}
                </span>
              </span>
            );
          })}
        </h1>
      </div>

      <div className="mx-auto flex w-full max-w-shell items-end justify-between gap-6">
        <p className="label">Adarsh Agarwala — AI / ML Engineer</p>
        <p className="font-mono text-[clamp(1.5rem,4vw,2.5rem)] leading-none text-amber tabular-nums">
          {String(count).padStart(3, "0")}
        </p>
      </div>
    </div>
  );
}
