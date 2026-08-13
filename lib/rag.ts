// Vectorless, hybrid RAG retrieval engine (runs in the browser, no API needed).
//
// HYBRID = two retrieval signals combined:
//   1. Structured retrieval: each project / experience / achievement / contact
//      block is turned into its own clean chunk straight from the typed data.
//   2. Lexical (vectorless) retrieval: a TF-IDF keyword score over every chunk,
//      so exact terms like "AgentWatch", "pairs trading" or "resume" rank high
//      without needing any embedding model or vector database.
// The free-form profile document is chunked by its ## headings
// and folded into the same pool. retrieve() returns the top-k chunks, which the
// API route then hands to the LLM as grounding context.

// SiteContent used to live in the now-deleted lib/content.tsx (a
// localStorage-backed override layer with no writers left — see
// lib/content.tsx's removal). It is redefined here, sourced straight from
// lib/data.ts, since buildCorpus's shape is otherwise unchanged.
import type {
  site,
  thesis,
  evidence,
  facts,
  about,
  projects,
  experience,
  skills,
  achievements,
  now,
  chatbot,
} from "./data";

export type SiteContent = {
  site: typeof site;
  thesis: typeof thesis;
  evidence: typeof evidence;
  facts: typeof facts;
  about: typeof about;
  projects: typeof projects;
  experience: typeof experience;
  skills: typeof skills;
  achievements: typeof achievements;
  now: typeof now;
  chatbot: typeof chatbot;
  profileDoc: string;
};

export type Chunk = { id: string; title: string; text: string };

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are",
  "was", "were", "be", "with", "at", "by", "it", "this", "that", "his", "her",
  "he", "she", "they", "you", "i", "me", "my", "do", "does", "what", "which",
  "how", "who", "whom", "about", "tell", "give", "can", "your", "please",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

// Split the free-form profile document into chunks at each markdown heading.
export function chunkText(doc: string): Chunk[] {
  const out: Chunk[] = [];
  if (!doc) return out;
  const lines = doc.split("\n");
  let title = "Profile";
  let buf: string[] = [];
  let n = 0;
  const flush = () => {
    const text = buf.join(" ").trim();
    if (text.length > 0) {
      out.push({ id: "doc-" + n, title, text });
      n += 1;
    }
    buf = [];
  };
  for (const line of lines) {
    const h = line.match(/^#{1,3}\s+(.*)/);
    if (h) {
      flush();
      title = h[1].trim();
    } else {
      buf.push(line);
    }
  }
  flush();
  return out;
}

// Build the full corpus: structured chunks + the editable profile document.
export function buildCorpus(c: SiteContent): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: "about",
    title: "About " + c.site.name,
    text: c.about.lead + " " + c.about.paragraphs.join(" "),
  });

  chunks.push({
    id: "facts",
    title: "Quick facts",
    text: c.facts.map((f) => f.label + ": " + f.value).join(". "),
  });

  for (const p of c.projects) {
    chunks.push({
      id: "project-" + p.slug,
      title: "Project: " + p.title,
      text: [
        p.title,
        p.tagline,
        p.blurb,
        p.description.join(" "),
        "Highlights: " + p.highlights.join("; "),
        "Tech stack: " + p.stack.join(", "),
        p.domain ? "Domain: " + p.domain : "",
        p.github ? "GitHub: " + p.github : "",
        p.live ? "Live: " + p.live : "",
      ]
        .filter(Boolean)
        .join(". "),
    });
  }

  for (const e of c.experience) {
    chunks.push({
      id: "exp-" + e.slug,
      title: "Experience: " + e.org,
      text: [
        e.org,
        e.role,
        e.period,
        e.note,
        e.description.join(" "),
        "Did: " + e.highlights.join("; "),
        "Stack: " + e.stack.join(", "),
      ]
        .filter(Boolean)
        .join(". "),
    });
  }

  chunks.push({
    id: "achievements",
    title: "Achievements",
    text: c.achievements.map((a) => a.title + " - " + a.detail).join(". "),
  });

  chunks.push({
    id: "now",
    title: "Now (" + c.now.updated + ")",
    text: c.now.intro + " " + c.now.items.map((i) => i.label + ": " + i.text).join(". "),
  });

  chunks.push({
    id: "skills",
    title: "Skills",
    text: c.skills.map((g) => g.title + ": " + g.items.join(", ")).join(". "),
  });

  chunks.push({
    id: "contact",
    title: "Contact and links",
    text:
      "Email: " + c.site.email + ". " +
      c.site.socials.map((s) => s.label + " " + s.href).join(". ") +
      (c.site.resumeUrl
        ? ". Resume / CV: " + c.site.resumeUrl + "."
        : ". Resume / CV: available on request by email."),
  });

  for (const dc of chunkText(c.profileDoc)) chunks.push(dc);

  return chunks;
}

// TF-IDF lexical scoring across all chunks. No embeddings, no network.
export function retrieve(query: string, chunks: Chunk[], k = 5): Chunk[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return chunks.slice(0, k);

  const df: Record<string, number> = {};
  const docTokens = chunks.map((c) => {
    const t = tokenize(c.title + " " + c.text);
    for (const w of new Set(t)) df[w] = (df[w] || 0) + 1;
    return t;
  });
  const N = chunks.length;

  const scored = chunks.map((c, i) => {
    const toks = docTokens[i];
    const tf: Record<string, number> = {};
    for (const w of toks) tf[w] = (tf[w] || 0) + 1;
    const len = toks.length || 1;
    let score = 0;
    for (const q of qTokens) {
      if (tf[q]) {
        const idf = Math.log(1 + N / (1 + (df[q] || 0)));
        score += (tf[q] / len) * idf * 10;
      }
      if (c.title.toLowerCase().includes(q)) score += 2;
    }
    return { c, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.c);
}
