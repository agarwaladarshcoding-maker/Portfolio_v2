"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/lib/content";

const links = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Now", href: "/now" },
];

const navInit = { y: -30, opacity: 0 };
const navShow = { y: 0, opacity: 1 };
const navTrans = { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const };
const menuInit = { opacity: 0 };
const menuShow = { opacity: 1 };
const itemInit = { opacity: 0, y: 20 };
const itemShow = { opacity: 1, y: 0 };
const itemTrans = (i: number) => ({ duration: 0.4, delay: 0.05 * i });

// Ask the floating chatbot to open (ChatDock listens for this event).
function openAdarshAI() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-adarsh-ai"));
  }
}

export default function Nav() {
  const { content } = useContent();
  const site = content.site;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const shell = scrolled
    ? "bg-ink-deep/80 backdrop-blur-md border-b border-ink-line"
    : "bg-transparent";
  const headerCls = `fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${shell}`;

  const onTalkToAI = () => {
    setOpen(false);
    openAdarshAI();
  };

  return (
    <motion.header className={headerCls} initial={navInit} animate={navShow} transition={navTrans}>
      <nav className="mx-auto flex max-w-shell items-center justify-between px-[var(--shell-x)] py-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tightest text-bone" data-hover>
          {site.initials}
          <span className="text-signal">.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative font-mono text-xs uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone"
              data-hover
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <button
            onClick={onTalkToAI}
            className="group relative font-mono text-xs uppercase tracking-[0.2em] text-mint transition-colors hover:text-mint-dim"
            data-hover
          >
            Talk to AdarshAI
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-mint transition-all duration-300 group-hover:w-full" />
          </button>
          <a
            href="/#contact"
            className="rounded-full border border-bone/30 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-bone transition-colors hover:border-signal hover:text-signal"
            data-hover
          >
            Let us talk
          </a>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="font-mono text-xs uppercase tracking-[0.2em] text-bone md:hidden"
          data-hover
          aria-label="Open menu"
        >
          Menu
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink-deep px-[var(--shell-x)] py-6 md:hidden"
            initial={menuInit}
            animate={menuShow}
            exit={menuInit}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-bone">
                {site.initials}
                <span className="text-signal">.</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-bone"
                data-hover
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-6">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={itemInit} animate={itemShow} transition={itemTrans(i)}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl font-bold tracking-tightest text-bone"
                    data-hover
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={itemInit}
                animate={itemShow}
                transition={itemTrans(links.length)}
                onClick={onTalkToAI}
                className="text-left font-display text-4xl font-bold tracking-tightest text-mint"
                data-hover
              >
                Talk to AdarshAI
              </motion.button>
            </div>
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-auto font-mono text-sm uppercase tracking-[0.15em] text-signal"
              data-hover
            >
              Let us talk →
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
