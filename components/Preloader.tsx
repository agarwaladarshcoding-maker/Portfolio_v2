"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/data";

// Run layout effects before paint on the client, plain effects on the server.
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE = [0.22, 1, 0.36, 1] as const;
const visible = { opacity: 1 };
const hiddenOpacity = { opacity: 0 };
const fadeTrans = { duration: 0.7, ease: EASE };

/**
 * Minimal matveyan-style intro: a single clean counter (000 → 100) with a thin
 * progress line, then a soft fade into the site.
 * Plays only once per session (first arrival) and never replays during in-app
 * navigation. Always lands the visitor at the top of the first section.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"check" | "play" | "out" | "done">("check");
  const raf = useRef<number>();

  useIso(() => {
    if (typeof window === "undefined") return;

    // Already seen this session → skip the intro entirely (no flash, no replay).
    if (sessionStorage.getItem("introSeen")) {
      setPhase("done");
      return;
    }

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    setPhase("play");

    const finish = () => {
      sessionStorage.setItem("introSeen", "1");
      window.scrollTo(0, 0);
      setPhase("out");
    };

    if (reduce) {
      setCount(100);
      const t = setTimeout(finish, 400);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }

    const start = performance.now();
    const duration = 1700;
    const loop = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf.current = requestAnimationFrame(loop);
      } else {
        setTimeout(finish, 300);
      }
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  const onFadeDone = () => {
    if (phase !== "out") return;
    document.body.style.overflow = "";
    onDone?.();
    setPhase("done");
  };

  if (phase === "check" || phase === "done") return null;

  const progressStyle = { transform: `scaleX(${count / 100})` };
  const animateTo = phase === "out" ? hiddenOpacity : visible;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink-deep px-[var(--shell-x)] py-8"
      initial={visible}
      animate={animateTo}
      transition={fadeTrans}
      onAnimationComplete={onFadeDone}
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-bone-mute">
        <span>{site.name}</span>
        <span className="hidden sm:block">{site.location}</span>
        <span>v1.0</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <span className="font-display text-[34vw] font-bold leading-none tracking-tightest text-bone sm:text-[15rem]">
          {String(count).padStart(3, "0")}
        </span>
      </div>

      <div>
        <div className="h-px w-full bg-ink-line">
          <div className="h-px w-full origin-left bg-signal" style={progressStyle} />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-bone-mute">
          <span>{site.role}</span>
          <span>{count}%</span>
        </div>
      </div>
    </motion.div>
  );
}
