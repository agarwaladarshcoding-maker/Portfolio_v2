"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { heroChips, heroChipSlots, type HeroChip } from "@/lib/data";
import { useContent } from "@/lib/content";
import RotatingSlogan from "./RotatingSlogan";
import NeuralNet from "./NeuralNet";

const EASE = [0.22, 1, 0.36, 1] as const;
const stageSpring = { stiffness: 60, damping: 18, mass: 0.6 };
const fadeInit = { opacity: 0, y: 16 };
const fadeShow = { opacity: 1, y: 0 };
const statusTrans = { duration: 0.6, delay: 0.15, ease: EASE };
const subTrans = { duration: 0.8, delay: 0.55, ease: EASE };
const summaryTrans = { duration: 0.8, delay: 0.65, ease: EASE };
const ctaTrans = { duration: 0.8, delay: 0.75, ease: EASE };
const factsTrans = { duration: 0.8, delay: 0.85, ease: EASE };
const lineHidden = { y: "115%" };
const lineShow = { y: "0%" };
const lineTrans = (i: number) => ({ duration: 0.9, delay: 0.2 + i * 0.1, ease: EASE });
const visualInit = { opacity: 0, scale: 0.92 };
const visualShow = { opacity: 1, scale: 1 };
const visualTrans = { duration: 1, delay: 0.35, ease: EASE };
const chipInit = { opacity: 0, scale: 0.6 };
const chipShow = { opacity: 1, scale: 1 };
const chipTrans = (d: number) => ({ duration: 0.6, delay: d, ease: EASE });

// Hero chips rotate one-by-one through the quant / ML / AI pool in lib/data.ts.
// Set SWAP_EVERY_MS to 3600000 to literally rotate one chip every hour.
const SWAP_EVERY_MS = 3500;
const swapIn = { opacity: 0, scale: 0.7 };
const swapShow = { opacity: 1, scale: 1 };
const swapOut = { opacity: 0, scale: 0.7 };
const swapTrans = { duration: 0.4, ease: EASE };

const gridStyle = {
  backgroundImage:
    "linear-gradient(#262833 1px, transparent 1px), linear-gradient(90deg, #262833 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

function FloatChip({
  sx,
  sy,
  pos,
  chip,
  i,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  pos: { top: string; left: string };
  chip: HeroChip;
  i: number;
}) {
  const depth = 18 + (i % 4) * 10;
  const tx = useTransform(sx, [0, 1], [depth, -depth]);
  const ty = useTransform(sy, [0, 1], [depth * 0.6, -depth * 0.6]);
  const wrapStyle = { top: pos.top, left: pos.left, x: tx, y: ty };
  const delay = 0.6 + i * 0.08;
  return (
    <motion.div
      className="animate-floaty absolute z-20"
      style={wrapStyle}
      initial={chipInit}
      animate={chipShow}
      transition={chipTrans(delay)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={chip.label}
          className="flex items-center gap-2 rounded-2xl border border-ink-line bg-ink-soft/80 px-3 py-2 backdrop-blur-sm"
          initial={swapIn}
          animate={swapShow}
          exit={swapOut}
          transition={swapTrans}
        >
          <span className="font-display text-sm font-bold text-signal">{chip.label}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-bone-mute">{chip.sub}</span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function Hero() {
  const { content } = useContent();
  const site = content.site;
  const facts = content.facts;
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, stageSpring);
  const sy = useSpring(py, stageSpring);

  const [order, setOrder] = useState<number[]>(() =>
    heroChipSlots.map((_, i) => i % heroChips.length),
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const slotCount = heroChipSlots.length;
    let slot = 0;
    let nextPool = slotCount % heroChips.length;
    const id = setInterval(() => {
      setOrder((prev) => {
        const updated = [...prev];
        let candidate = nextPool % heroChips.length;
        let guard = 0;
        while (updated.includes(candidate) && guard < heroChips.length) {
          candidate = (candidate + 1) % heroChips.length;
          guard += 1;
        }
        updated[slot % slotCount] = candidate;
        nextPool = (candidate + 1) % heroChips.length;
        slot = (slot + 1) % slotCount;
        return updated;
      });
    }, SWAP_EVERY_MS);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <section
      id="top"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-h-screen items-center overflow-hidden px-[var(--shell-x)] pb-16 pt-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-[55vw] w-[55vw] -translate-x-1/2 rounded-full bg-signal/10 blur-[130px]" />
        <div className="absolute bottom-[6%] right-[4%] h-[30vw] w-[30vw] rounded-full bg-mint/10 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.05]" style={gridStyle} />
      </div>

      <div className="mx-auto grid w-full max-w-shell grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div className="mb-6 flex items-center gap-3" initial={fadeInit} animate={fadeShow} transition={statusTrans}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-bone-dim">
              {site.available ? "Open to work" : "Currently building"} · {site.location}
            </span>
          </motion.div>

          <h1 className="font-display text-[15vw] font-bold leading-[0.9] tracking-tightest text-bone sm:text-[8.5vw] lg:text-[5.5rem]">
            {site.headline.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span className="inline-block" initial={lineHidden} animate={lineShow} transition={lineTrans(i)}>
                  {i === 0 ? <span className="text-signal">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-6 font-display text-xl font-medium text-bone sm:text-2xl"
            initial={fadeInit}
            animate={fadeShow}
            transition={subTrans}
          >
            <RotatingSlogan />
          </motion.div>

          <motion.p
            className="mt-5 max-w-xl text-base leading-relaxed text-bone-dim"
            initial={fadeInit}
            animate={fadeShow}
            transition={summaryTrans}
          >
            {site.summary}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={fadeInit}
            animate={fadeShow}
            transition={ctaTrans}
          >
            <a
              href="#work"
              className="group flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-deep transition-transform hover:-translate-y-0.5"
              data-hover
            >
              View work <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#about"
              className="font-mono text-xs uppercase tracking-[0.15em] text-bone-dim underline-offset-4 transition-colors hover:text-bone hover:underline"
              data-hover
            >
              More about me ↓
            </a>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line sm:grid-cols-4"
            initial={fadeInit}
            animate={fadeShow}
            transition={factsTrans}
          >
            {facts.map((f) => (
              <div key={f.label} className="bg-ink-deep px-4 py-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-mute">{f.label}</div>
                <div className="mt-1 font-display text-sm font-semibold text-bone">{f.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative h-[280px] sm:h-[360px] lg:h-[460px]">
          <motion.div className="absolute inset-0" initial={visualInit} animate={visualShow} transition={visualTrans}>
            <NeuralNet />
          </motion.div>
          <div className="hidden lg:block">
            {heroChipSlots.map((pos, i) => (
              <FloatChip key={i} sx={sx} sy={sy} pos={pos} chip={heroChips[order[i]]} i={i} />
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-bone-mute">
            self-attention · softmax(QKᵀ / √dₖ) · V
          </div>
        </div>
      </div>
    </section>
  );
}
