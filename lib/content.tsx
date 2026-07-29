"use client";

// Content layer. Defaults come from data.ts and every section reads them via
// useContent(); overrides previously saved to localStorage are still honoured.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  site as defaultSite,
  slogans as defaultSlogans,
  facts as defaultFacts,
  about as defaultAbout,
  projects as defaultProjects,
  experience as defaultExperience,
  skills as defaultSkills,
  achievements as defaultAchievements,
  now as defaultNow,
  chatbot as defaultChatbot,
  profileDoc as defaultProfileDoc,
} from "./data";

export type SiteContent = {
  site: typeof defaultSite;
  slogans: typeof defaultSlogans;
  facts: typeof defaultFacts;
  about: typeof defaultAbout;
  projects: typeof defaultProjects;
  experience: typeof defaultExperience;
  skills: typeof defaultSkills;
  achievements: typeof defaultAchievements;
  now: typeof defaultNow;
  chatbot: typeof defaultChatbot;
  profileDoc: string;
};

export const defaultContent: SiteContent = {
  site: defaultSite,
  slogans: defaultSlogans,
  facts: defaultFacts,
  about: defaultAbout,
  projects: defaultProjects,
  experience: defaultExperience,
  skills: defaultSkills,
  achievements: defaultAchievements,
  now: defaultNow,
  chatbot: defaultChatbot,
  profileDoc: defaultProfileDoc,
};

const STORAGE_KEY = "adarsh.content.v1";

type Ctx = {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
  reset: () => void;
  loaded: boolean;
};

const ContentContext = createContext<Ctx | null>(null);

function readStored(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...defaultContent, ...parsed };
  } catch {
    return null;
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  // Start from defaults so server and first client render match (no hydration mismatch).
  const [content, setContentState] = useState<SiteContent>(defaultContent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) setContentState(stored);
    setLoaded(true);
  }, []);

  const setContent = (next: SiteContent) => {
    setContentState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write failures (e.g. private mode)
    }
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setContentState(defaultContent);
  };

  const value: Ctx = { content, setContent, reset, loaded };
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): Ctx {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    return { content: defaultContent, setContent: () => {}, reset: () => {}, loaded: true };
  }
  return ctx;
}
