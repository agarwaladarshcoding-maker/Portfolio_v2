"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const springCfg = { stiffness: 150, damping: 18, mass: 0.4 };

/** Reusable 3D tilt wrapper with a soft light glare that follows the pointer. */
export default function Tilt({
  children,
  className,
  max = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]: string[]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.16), transparent 55%)`,
  );

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const outerStyle = { perspective: 900 };
  const innerStyle = { rotateX, rotateY, transformStyle: "preserve-3d" as const };
  const glareStyle = { background: glareBg };

  return (
    <div ref={ref} className={className} style={outerStyle} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="relative h-full w-full" style={innerStyle}>
        {children}
        {glare ? (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={glareStyle}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
