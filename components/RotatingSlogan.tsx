"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/lib/content";

const enter = { y: "110%", opacity: 0 };
const center = { y: "0%", opacity: 1 };
const leave = { y: "-110%", opacity: 0 };
const sloganTrans = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

export default function RotatingSlogan() {
  const { content } = useContent();
  const slogans = content.slogans;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slogans.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % slogans.length), 2600);
    return () => clearInterval(id);
  }, [slogans.length]);

  const current = slogans[i % slogans.length] ?? "";

  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="block whitespace-nowrap text-signal"
          initial={enter}
          animate={center}
          exit={leave}
          transition={sloganTrans}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
