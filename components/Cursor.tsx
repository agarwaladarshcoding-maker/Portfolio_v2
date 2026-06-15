"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** matveyan-style ambient cursor with live XY readout. */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-hover]"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  const dotStyle = { x: sx, y: sy, scale: hover ? 2.6 : 1 };
  const labelStyle = { x: sx, y: sy };

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] -ml-[5px] -mt-[5px] h-[10px] w-[10px] rounded-full bg-signal mix-blend-difference"
        style={dotStyle}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden font-mono text-[10px] uppercase tracking-[0.15em] text-bone-mute md:block"
        style={labelStyle}
      >
        <span className="ml-4 mt-2 inline-block">
          x{String(pos.x).padStart(4, "0")} y{String(pos.y).padStart(4, "0")}
        </span>
      </motion.div>
    </>
  );
}
