// ──────────────────────────────────────────────────────────
// SITE CONTENT. Everything the site renders is defined here.
// ──────────────────────────────────────────────────────────

export const site = {
  name: "Adarsh Agarwala",
  initials: "AA",
  role: "AI / ML Engineer",
  location: "Pune, India",
  timezone: "Asia/Kolkata",
  available: true,
  summary:
    "AI/ML engineer and CS undergrad at IIIT Pune. I build retrieval and agent systems that verify their own output — RAG with claim-level hallucination detection, tool-calling agents grounded in live data — with a quantitative-finance background underneath.",
  email: "agarwalaadarsh.work@gmail.com",
  // Served from public/. Leave this empty to hide the Resume / CV link entirely
  // rather than render a dead one.
  resumeUrl: "/adarsh-agarwala-resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/agarwaladarshcoding-maker" },
    { label: "LinkedIn", href: "https://linkedin.com/in/adarsh-agarwala" },
    { label: "Email", href: "mailto:agarwalaadarsh.work@gmail.com" },
  ],
};

// ── The thesis ────────────────────────────────────────────────────────────
// The page opens with a claim and then backs it up, because that is what the
// work itself does: the medical RAG labels every sentence it writes against
// its sources, the pairs strategy tests its spread for stationarity before
// trading it, the PCA is written from scratch to check what the library says.
//
// `lede` is prose split into segments. A segment with a `ref` is a claim, and
// it points at an entry in `evidence` below. Nothing on this page asserts
// something the reader cannot go and check.

export type LedeSegment = { text: string; ref?: string };

export const thesis = {
  headline: ["Systems that", "check their", "own work."],
  lede: [
    { text: "I'm Adarsh. I build " },
    { text: "retrieval and agent systems that grade their own answers", ref: "rag" },
    { text: " — RAG with claim-level hallucination detection, agents that cannot cite a source they never retrieved. I read for a " },
    { text: "B.Tech in CS at IIIT Pune", ref: "iiit" },
    { text: ", and the same discipline runs through my " },
    { text: "quantitative work", ref: "quant" },
    { text: ", where an untested model is just an opinion. When I want to know how something works I " },
    { text: "write it from scratch", ref: "scratch" },
    { text: "." },
  ] as LedeSegment[],
};

// Two kinds of evidence, and the page is honest about which is which.
//   source — you can open it and read the code.
//   record — a credential I am reporting; take my word or ask for the marksheet.
export type Evidence = {
  id: string;
  kind: "source" | "record";
  claim: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

export const evidence: Evidence[] = [
  {
    id: "iiit",
    kind: "record",
    claim: "B.Tech CSE, 2025–29",
    detail:
      "Indian Institute of Information Technology, Pune. CGPA 9.38/10 — top 5% of the cohort. JEE Main 2025: AIR 17,517, 97th percentile in Mathematics.",
  },
  {
    id: "rag",
    kind: "source",
    claim: "Medical RAG, trust-aware",
    detail:
      "Splits its own answer into atomic claims and labels each one SUPPORTED, WEAK, UNSUPPORTED or CONTRADICTED against the retrieved passages, using an NLI model. Hallucinations become measurable instead of invisible. Open the demo and it will show you the verdict for every sentence it writes.",
    href: "https://medical-rag-demo.vercel.app",
    hrefLabel: "Try the live demo",
  },
  {
    id: "quant",
    kind: "source",
    claim: "Quant: stationarity-tested",
    detail:
      "A spread is only tradeable if it mean-reverts. Rolling OLS gives the hedge ratio; an Augmented Dickey–Fuller test decides whether the residual is stationary enough to act on. The test can say no.",
    href: "https://github.com/agarwaladarshcoding-maker/Project-Section/tree/main/Quant-Finance-Project/Mean%20Reverting%20Pairs",
    hrefLabel: "Mean Reverting Pairs",
  },
  {
    id: "scratch",
    kind: "source",
    claim: "Written from scratch",
    detail:
      "PCA implemented from the SVD up in NumPy with no ML library, a limit order book in C++17, and linear regression rebuilt to check the textbook. The point is to find out where the abstraction leaks.",
    href: "https://github.com/agarwaladarshcoding-maker/High-Frequency-Order-Book",
    hrefLabel: "High-Frequency-Order-Book",
  },
];

// Masthead / colophon facts.
export const facts = [
  { label: "Reading", value: "B.Tech CSE '29, IIIT Pune" },
  { label: "Focus", value: "RAG · agents · evaluation" },
  { label: "Languages", value: "Python · C++17/20 · TypeScript" },
  { label: "Open to", value: "AI/ML internships · quant as a second track" },
];

// Which figure a project renders. Each is a real diagram of the method, drawn
// from the project's own logic — not a stock illustration.
export type FigureKind =
  | "claims"
  | "spread"
  | "ladder"
  | "paths"
  | "variance"
  | "trace";

export type Project = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  blurb: string;
  description: string[];
  highlights: string[];
  year: string;
  role: string;
  domain?: string;
  figure: FigureKind;
  // One sentence naming the thing the project proves it can do.
  result: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  github?: string;
  live?: string;
  featured?: boolean;
};

// About section copy.
export const about = {
  lead:
    "A language model that cannot cite its source fails the same way an untested spread does — confidently. Most of my work is about making that failure visible before a user ever sees it.",
  paragraphs: [
    "I work mainly on applied ML: retrieval pipelines, tool-calling agents, and the evaluation harnesses that say whether either is actually working — recall@k, MRR, nDCG, groundedness, hallucination rate. The medical RAG is the clearest example, and the retrieval engine behind the assistant on this page is 180 lines I can explain end to end.",
    "Quantitative finance is my second track, and the reason the first one works: cointegration, options pricing and factor models are where I learned to distrust a result until it has been tested. I write daily on C++ internals and quant in the 'Day X of Infinity' series, and compete on Codeforces as AdarshAg.",
  ],
  cards: [
    { label: "Reading", value: "B.Tech CSE at IIIT Pune, 2025–29" },
    { label: "Based in", value: "Pune, India (Asia/Kolkata)" },
  ],
};

// Projects with a GitHub link. First 3 (featured) show on the home page.
export const projects: Project[] = [
  {
    slug: "medical-rag",
    index: "01",
    domain: "AI/ML",
    title: "Evidence-Aware Medical RAG",
    tagline: "Hybrid retrieval with claim-level hallucination detection",
    blurb:
      "A local-first medical RAG pipeline that answers only from its documents, then splits its own answer into claims and tests each one against the passages it retrieved.",
    description: [
      "Hybrid retrieval: a dense index in ChromaDB for meaning and BM25 for exact tokens, fused by Reciprocal Rank Fusion and narrowed by a cross-encoder reranker. Both halves are needed — embeddings put 'metformin' and 'metoprolol' next to each other, and they are different drugs.",
      "The verification layer is the point. After the model writes an answer, each sentence is checked against the retrieved evidence by an NLI model and labelled SUPPORTED, WEAK, UNSUPPORTED or CONTRADICTED, then rolled into a single grounding score. Hallucination stops being a worry and becomes a number.",
      "Hardened in July 2026. The claim splitter was breaking sentences at 'e.g.' and 'i.e.', discarding real claims and verifying the fragments left behind — silently corrupting the hallucination metric the project exists to report. The safety filter refused every question about strokes while the corpus contained a document about strokes. Both fixed, with a 96-test suite pinning them.",
    ],
    highlights: [
      "Every claim labelled against its evidence, with a grounding score",
      "Hybrid BM25 + dense retrieval fused by rank, not by rescaled scores",
      "Runs entirely on your machine — no query leaves it",
      "96 tests; found and fixed four bugs that were silently wrong, not broken",
    ],
    year: "2026",
    role: "Solo build",
    figure: "claims",
    result:
      "Every sentence the model writes is checked against the passages it retrieved, and labelled.",
    stack: ["Python", "PyTorch", "ChromaDB", "BM25", "FastAPI", "Ollama"],
    metrics: [
      { value: "4", label: "claim verdicts" },
      { value: "96", label: "tests" },
      { value: "0", label: "data leaving the machine" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker/Advanced-Medical-Based-RAG-System",
    live: "https://medical-rag-demo.vercel.app",
    featured: true,
  },
  {
    slug: "pairs-trading",
    index: "02",
    domain: "Quant",
    title: "Mean-Reverting Pairs Trading",
    tagline: "Statistical arbitrage on real market data",
    blurb:
      "A full stat-arb pipeline on GOOGL/MSFT — cointegration testing, rolling hedge ratios, and z-score signals over three years of real data.",
    description: [
      "Built a complete statistical-arbitrage pipeline on GOOGL/MSFT using three years of real market data via yfinance, with log-price transformation to stabilise variance and linearise the cointegration relationship.",
      "A rolling 90-day OLS regression computes dynamic hedge ratios and the residual spread; stationarity is validated with the Augmented Dickey-Fuller test, and z-score signals fire at plus/minus 2 standard deviations, visualised in a dual-panel dashboard.",
    ],
    highlights: [
      "3 years of real GOOGL/MSFT data via yfinance",
      "Rolling 90-day OLS hedge ratios + ADF cointegration test",
      "Z-score entry/exit at plus/minus 2 sigma with a dual-panel dashboard",
    ],
    year: "2025-26",
    role: "Solo build",
    figure: "spread",
    result:
      "The spread has to pass an ADF stationarity test before a single signal is allowed to fire.",
    stack: ["Python", "Pandas", "statsmodels", "yfinance"],
    metrics: [
      { value: "3 yrs", label: "GOOGL/MSFT daily data" },
      { value: "90d", label: "rolling hedge-ratio window" },
      { value: "±2σ", label: "entry band" },
    ],
    github:
      "https://github.com/agarwaladarshcoding-maker/Project-Section/tree/main/Quant-Finance-Project/Mean%20Reverting%20Pairs",
    featured: false,
  },
  {
    slug: "order-matching-engine",
    index: "03",
    domain: "Systems",
    title: "HFT Order Matching Engine",
    tagline: "Low-latency limit order book in modern C++",
    blurb:
      "A low-latency limit order book with price-time priority matching, O(1) lookups, and a cache-optimised memory layout.",
    description: [
      "Building a low-latency limit order book (LOB) in C++17/20 with price-time priority matching, O(1) hash-map lookups, and a cache-line-optimised memory layout, using smart pointers for memory safety.",
      "Researching the LMAX Disruptor pattern for a lock-free queue design to push throughput further. An ongoing systems project about understanding market microstructure from the metal up.",
    ],
    highlights: [
      "Price-time priority matching with O(1) lookups",
      "Cache-line-optimised memory layout + smart-pointer safety",
      "Researching LMAX Disruptor lock-free queues",
    ],
    year: "2026 · in progress",
    role: "Solo build",
    figure: "ladder",
    result:
      "Price-time priority, resolved against the book in constant time per lookup.",
    stack: ["C++17/20", "STL", "CMake"],
    metrics: [
      { value: "O(1)", label: "order lookup" },
      { value: "price-time", label: "matching priority" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker/High-Frequency-Order-Book",
    featured: false,
  },
  {
    slug: "agentwatch",
    index: "04",
    domain: "AI/ML",
    title: "AgentWatch",
    tagline: "ML-powered AI agent activity monitor",
    blurb:
      "A macOS monitor that intercepts CLI AI tools in real time and classifies their activity with a custom ML model at ~99% accuracy.",
    description: [
      "Built a macOS system-level monitor that intercepts real-time stdout from CLI AI tools (Gemini CLI, Claude Code) via a custom PTY wrapper, enabling programmatic session tracking across concurrent agent processes.",
      "A custom TF-IDF + LinearSVC classifier hits ~99% accuracy across 7 event types, replacing fragile regex detection; a WebSocket notification and reply-injection layer plus a companion Chrome extension support live multi-session monitoring.",
    ],
    highlights: [
      "PTY wrapper intercepts CLI agents in real time",
      "TF-IDF + LinearSVC classifier at ~99% across 7 event types",
      "WebSocket notifications + Chrome extension for multi-session monitoring",
    ],
    year: "2026",
    role: "Solo build",
    figure: "trace",
    result:
      "Watches a CLI agent's output stream and says what it is doing, without changing how it behaves.",
    stack: ["Electron", "TypeScript", "node-pty", "scikit-learn", "SQLite"],
    metrics: [
      { value: "~99%", label: "classifier accuracy" },
      { value: "7", label: "event types" },
      { value: "20+", label: "browser agents monitored" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker/AgentWatcher",
    featured: true,
  },
  {
    slug: "monte-carlo-option-pricer",
    index: "05",
    domain: "Quant",
    title: "Monte Carlo Option Pricer",
    tagline: "Exotic barrier options via simulated GBM",
    blurb:
      "Prices down-and-out barrier options over 100k simulated GBM paths in under 1.8s, with early-exit optimisation.",
    description: [
      "Priced down-and-out barrier options via discretised Geometric Brownian Motion over 252 daily steps across 100,000 simulation paths, completing in under 1.8 seconds using a Mersenne Twister PRNG for high-quality normal variates.",
      "Early-exit branch logic terminates knocked-out paths on barrier breach, cutting CPU cycles by ~30%; paths export to CSV for downstream volatility-surface analysis.",
    ],
    highlights: [
      "100,000 GBM paths in under 1.8 seconds",
      "~30% fewer CPU cycles via early-exit on barrier breach",
      "CSV export for volatility-surface analysis",
    ],
    year: "2026",
    role: "Solo build",
    figure: "paths",
    result:
      "Paths that breach the barrier are abandoned the moment they breach it, not at expiry.",
    stack: ["C++", "Python", "Pandas", "Matplotlib"],
    metrics: [
      { value: "100k", label: "GBM paths" },
      { value: "<1.8s", label: "runtime" },
      { value: "~30%", label: "CPU cycles saved by early exit" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker/Monte-Carlo-Project-Simulator",
    featured: false,
  },
  {
    slug: "pca-factor-model",
    index: "06",
    domain: "Quant",
    title: "PCA Factor Model",
    tagline: "Principal components from scratch with SVD",
    blurb:
      "A from-scratch PCA factor model using SVD in NumPy — no ML libraries — preserving 95%+ of variance across multi-asset returns.",
    description: [
      "Built Principal Component Analysis from scratch using Singular Value Decomposition in NumPy with no ML libraries, applied to multi-asset financial return data.",
      "The model preserves over 95% of explained variance, surfacing dominant market-factor loadings and cumulative-variance plots.",
    ],
    highlights: [
      "PCA via raw SVD in NumPy, no ML libraries",
      "Preserves 95%+ of explained variance",
      "Visualises dominant market-factor loadings",
    ],
    year: "2025",
    role: "Solo build",
    figure: "variance",
    result:
      "No sklearn. The decomposition is the SVD, written out, so the maths is inspectable.",
    stack: ["Python", "NumPy", "Pandas", "Matplotlib"],
    metrics: [
      { value: "95%+", label: "variance retained" },
      { value: "0", label: "ML libraries used" },
    ],
    github:
      "https://github.com/agarwaladarshcoding-maker/Project-Section/tree/main/Quant-Finance-Project/portfolio-manger-v2",
    featured: false,
  },
  {
    slug: "amber-copilot",
    index: "07",
    domain: "AI/ML",
    title: "amber Copilot",
    tagline: "A booking assistant grounded in live inventory",
    blurb:
      "A conversational housing assistant for international students that answers from five live API endpoints and cites each one, replacing a rigid form-based flow.",
    description: [
      "amberstudent.com's accommodation flow was a manual, form-driven search. I built an LLM-driven booking assistant that lets students search, compare, and book housing across every supported city in natural language.",
      "A tool-calling agent loop grounds every reply in live data from five amber API endpoints with citation tracking, so the assistant cannot invent a property or a price. A four-layer conversational memory — turn buffer, rolling summary, structured search slots, and a property shortlist — keeps multi-turn booking coherent under a token budget.",
    ],
    highlights: [
      "Tool-calling agent loop grounded in 5 live API endpoints, with citations",
      "Four-layer memory: turn buffer, rolling summary, search slots, shortlist",
      "Deterministic slot extraction and reference resolution ('compare the top 2')",
      "SSE streaming into an embeddable React widget in a Shadow DOM",
    ],
    year: "2026",
    role: "Solo build",
    figure: "trace",
    result:
      "Grounding guardrails mean a hallucinated property or price cannot reach the user.",
    stack: ["Python", "FastAPI", "Groq / Llama 3.3", "Redis", "React", "Docker"],
    metrics: [
      { value: "5", label: "live endpoints grounded against" },
      { value: "4", label: "memory layers" },
      { value: "70B + 8B", label: "agent + router split" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker/Amber-Student-Chatbot",
    featured: true,
  },
];

export type Experience = {
  slug: string;
  org: string;
  role: string;
  period: string;
  note: string;
  description: string[];
  highlights: string[];
  stack: string[];
};

// No formal jobs yet — these are hackathons and leadership. Each row links out.
export const experience: Experience[] = [
  {
    slug: "smart-india-hackathon",
    org: "Smart India Hackathon",
    role: "Team Mentor & Builder",
    period: "2025",
    note: "Mentored and built a civic infrastructure platform under national-level constraints.",
    description: [
      "Mentored a competitive team through ideation and full development of a national-level hackathon project, coordinating cross-functional work under tight time and resource constraints.",
      "Built the Civic Infrastructure Reporting Platform — a MERN-stack app with a REST API for citizen issue submissions, role-based dashboards, and geolocation-based routing.",
    ],
    highlights: [
      "Mentored the team end-to-end through ideation and build",
      "MERN-stack civic platform with role-based access control",
      "Geolocation-tagged issue routing for admins",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
  },
  {
    slug: "india-innovates",
    org: "India Innovates Challenge",
    role: "Team Lead — Team SHA256",
    period: "2025",
    note: "Led backend architecture for a real-time collaborative workspace in a 48-hour sprint.",
    description: [
      "Led Team SHA256 through a high-pressure 48-hour engineering sprint, architecting an optimised backend for a real-time collaborative workspace platform.",
      "Our architecture independently converged with Miro's product approach — a validation of the team's design instincts under pressure.",
    ],
    highlights: [
      "Led a team through a 48-hour build sprint",
      "Designed an optimised real-time backend",
      "Architecture independently converged with Miro's approach",
    ],
    stack: ["Node.js", "WebSockets", "System Design"],
  },
  {
    slug: "coding-club-iiit-pune",
    org: "Coding & Technical Club, IIIT Pune",
    role: "Member & Technical Writer",
    period: "2025 — Present",
    note: "Compete in contests and write the daily 'Day X of Infinity' series.",
    description: [
      "Active member of the Coding and Technical Club at IIIT Pune — competing in programming contests and contributing C++ and systems-design walkthroughs.",
      "Author the 'Day X of Infinity' LinkedIn series, writing daily on C++ internals, HFT, and quantitative finance.",
    ],
    highlights: [
      "1st place, First-Year Competitive Programming Competition",
      "Daily 'Day X of Infinity' technical writing series",
      "C++ and systems-design walkthroughs for peers",
    ],
    stack: ["C++", "Competitive Programming", "Technical Writing"],
  },
];

export type Achievement = { title: string; detail: string };

// Achievements / honours.
// Ordered by what an AI/ML or quant reader actually weighs: maths first,
// then demonstrated problem-solving under time pressure, then the rest.
export const achievements: Achievement[] = [
  {
    title: "97th percentile in Mathematics",
    detail:
      "JEE Main 2025 — All India Rank 17,517, 99th percentile overall across 1.2M candidates.",
  },
  {
    title: "Top 5% at IIIT Pune",
    detail: "CGPA 9.38/10 (SGPA 9.6) — Institute of National Importance.",
  },
  {
    title: "1st, first-year competitive programming",
    detail:
      "Institute-wide competition at IIIT Pune. Active on Codeforces as AdarshAg — graphs, DP, and data structures in C++.",
  },
  {
    title: "Team lead — India Innovates 2025",
    detail: "Led Team SHA256 on backend architecture through a 48-hour sprint.",
  },
  {
    title: "'Day X of Infinity'",
    detail: "A daily writing series on C++ internals, HFT, and quantitative finance.",
  },
];

export type NowItem = { label: string; text: string; href?: string; hrefLabel?: string };
export type Now = { updated: string; intro: string; items: NowItem[] };

// The /now page — what I'm actually doing at the moment.
//
// The rest of this site links each claim to something you can open, so this
// page does the same. A /now page that says the same thing for six months is
// just an About page with a worse name.
export const now: Now = {
  updated: "29 July 2026",
  intro:
    "What I'm working on at the moment, rather than a summary of everything I've ever done. Most lines link to the repository, so you can check the dates against the claims.",
  items: [
    {
      label: "This week",
      text: "Going back through my own projects one at a time and fixing what I got wrong the first time. Started with the medical RAG system: found that its sentence splitter was breaking claims at 'e.g.' and 'i.e.', which quietly corrupted the hallucination metric the whole project reports, and that its safety filter refused to answer questions about strokes — while shipping a document about strokes. Both fixed, with 96 tests, and the pipeline is now live as a demo you can use.",
      href: "https://medical-rag-demo.vercel.app",
      hrefLabel: "Try the demo",
    },
    {
      label: "Learning",
      text: "Rebuilding machine learning algorithms from scratch, one at a time, with no framework doing the derivative for me. Linear regression is done; I'm working forward from there. It is slower than importing scikit-learn and that is the entire point.",
      href: "https://github.com/agarwaladarshcoding-maker/ml-from-scratch",
      hrefLabel: "ml-from-scratch",
    },
    {
      label: "Practising",
      text: "Daily competitive programming for ICPC, in C++, pushed every day whether the day went well or not. The public commit history is deliberate: it is harder to skip when the gap is visible.",
      href: "https://github.com/agarwaladarshcoding-maker/Becoming-God",
      hrefLabel: "The daily log",
    },
    {
      label: "Studying",
      text: "B.Tech in Computer Science at IIIT Pune. Linear algebra and probability, mostly — the parts that keep turning up underneath everything else I build.",
    },
    {
      label: "Open to",
      text: "AI/ML engineering internships and roles, particularly anything involving retrieval, evaluation, or making model output verifiable. Quantitative work is the second track, not the first.",
    },
  ],
};

// Skills / capabilities. Three groups.
export const skills = [
  {
    title: "AI / ML",
    items: ["PyTorch", "RAG (dense + vectorless)", "LoRA fine-tuning", "Transformers / HuggingFace", "scikit-learn", "OpenCV"],
  },
  {
    title: "Quant / Systems",
    items: ["C++17/20", "Statistical arbitrage", "Monte Carlo / GBM", "Limit order books", "NumPy / Pandas"],
  },
  {
    title: "Full-Stack / Web",
    items: ["React.js", "Node.js / Express", "MongoDB", "REST APIs / WebSockets", "TypeScript", "Tailwind CSS"],
  },
];

// Built-in "AdarshAI" chatbot knowledge (rule-based, no API needed).
export const chatbot = {
  intro:
    "Hey — I'm AdarshAI, a little assistant that knows about Adarsh Agarwala. Ask me about his projects, the tech he uses, his achievements, or how to reach him.",
  suggestions: ["Who is Adarsh?", "What does he build?", "Best projects?", "How do I reach him?"],
  knowledge: [
    {
      keywords: ["who", "about", "yourself", "background", "adarsh", "name"],
      answer:
        "Adarsh Agarwala is a CS undergrad at IIIT Pune working at the intersection of AI/ML and quantitative finance. He builds retrieval pipelines that verify their own answers, statistical-arbitrage models, and low-latency C++ — all on a strong maths foundation.",
    },
    {
      keywords: ["stack", "tech", "tools", "language", "languages", "build", "builds"],
      answer:
        "Day to day: Python and PyTorch for ML; C++17/20 for systems and quant; NumPy, Pandas, statsmodels and scikit-learn for data; and React, Node, Express and MongoDB on the web side.",
    },
    {
      keywords: ["project", "projects", "work", "built", "best", "portfolio"],
      answer:
        "Highlights: an Evidence-Aware Medical RAG with hallucination detection, a Mean-Reverting Pairs Trading stat-arb pipeline, and a low-latency HFT Order Matching Engine in C++. Open the Work section for the full case studies.",
    },
    {
      keywords: ["quant", "trading", "finance", "hft", "market", "options", "monte"],
      answer:
        "On the quant side: statistical arbitrage (cointegration, rolling OLS, z-score signals), Monte Carlo barrier-option pricing over 100k GBM paths, a PCA factor model from scratch, and a low-latency limit order book.",
    },
    {
      keywords: ["ai", "ml", "machine", "learning", "model", "llm", "rag", "agent"],
      answer:
        "On the AI side: a dual-mode (dense + vectorless) medical RAG with NLI hallucination detection and LoRA fine-tuning, plus AgentWatch — an ML-powered monitor that classifies CLI AI-agent activity at ~99% accuracy.",
    },
    {
      keywords: ["experience", "hackathon", "team", "lead", "club", "role"],
      answer:
        "No formal jobs yet — the experience is hackathons and leadership: mentoring at Smart India Hackathon, leading Team SHA256 at India Innovates, and an active role in the IIIT Pune Coding Club writing the 'Day X of Infinity' series.",
    },
    {
      keywords: ["achievement", "achievements", "jee", "rank", "award", "gpa", "cgpa"],
      answer:
        "A few: JEE Main 2025 AIR 17,517 (99th percentile, 97th in Maths), Top 5% at IIIT Pune (CGPA 9.38), and 1st place in the First-Year Competitive Programming Competition.",
    },
    {
      keywords: ["contact", "email", "reach", "hire", "available", "touch", "connect"],
      answer:
        "Email agarwalaadarsh.work@gmail.com, or use the GitHub and LinkedIn links in the footer. Adarsh is open to AI/ML and quant internships, freelance, and contract work.",
    },
    {
      keywords: ["hello", "hi", "hey", "yo", "greetings"],
      answer: "Hey! Ask me about Adarsh's projects, tech stack, achievements, or how to get in touch.",
    },
  ],
  fallback:
    "I'm a small built-in assistant, so I stick to the basics — try asking about projects, the quant or AI work, achievements, the tech stack, or how to get in touch.",
};

// =============================================================================
// PROFILE DOCUMENT — the chatbot's RAG knowledge base.
// This long-form text is chunked (by ## headings) and retrieved at query time.
// =============================================================================
export const profileDoc = [
  "# Adarsh Agarwala — Profile Knowledge Base",
  "",
  "## Who is Adarsh",
  "Adarsh Agarwala is a Computer Science undergraduate (B.Tech CSE, 2025-2029) at IIIT Pune, working at the intersection of AI/ML and quantitative finance. He builds retrieval pipelines that verify their own answers, statistical-arbitrage models, and low-latency C++ - all on a strong mathematics foundation in linear algebra, probability, and stochastic calculus. He is based in Pune, India (Asia/Kolkata).",
  "",
  "## Focus and interests",
  "AI / ML: retrieval-augmented generation, hallucination detection, LoRA fine-tuning, and AI agents.",
  "Quant: statistical arbitrage, options pricing, factor models, and low-latency trading systems.",
  "Systems: modern C++ (17/20) and performance engineering.",
  "Adarsh is open to AI/ML and quant internships, freelance, and contract work.",
  "",
  "## Tech stack",
  "Python and PyTorch for ML; C++17/20 for systems and quant; NumPy, Pandas, statsmodels, and scikit-learn for data; React, Node, Express, and MongoDB on the web side.",
  "",
  "## Project: Evidence-Aware Medical RAG (AI/ML)",
  "A production-grade medical RAG pipeline doing both dense and vectorless retrieval, then verifying every generated claim against its sources with an NLI-based hallucination detector and LoRA fine-tuning. GitHub: https://github.com/agarwaladarshcoding-maker",
  "",
  "## Project: Mean-Reverting Pairs Trading (Quant)",
  "A full statistical-arbitrage pipeline on GOOGL/MSFT - cointegration testing, rolling hedge ratios, and z-score signals over three years of real market data. GitHub: https://github.com/agarwaladarshcoding-maker",
  "",
  "## Project: HFT Order Matching Engine (Systems)",
  "A low-latency limit order book in modern C++ with price-time priority matching, O(1) lookups, and a cache-optimised memory layout. GitHub: https://github.com/agarwaladarshcoding-maker",
  "",
  "## Project: AgentWatch (AI/ML)",
  "A macOS monitor that intercepts CLI AI tools in real time and classifies their activity with a custom ML model at about 99% accuracy. GitHub: https://github.com/agarwaladarshcoding-maker",
  "",
  "## Project: Monte Carlo Option Pricer (Quant)",
  "Prices down-and-out barrier options over 100k simulated geometric-Brownian-motion paths in under 1.8s, with early-exit optimisation. GitHub: https://github.com/agarwaladarshcoding-maker",
  "",
  "## Project: PCA Factor Model (Quant)",
  "A from-scratch PCA factor model using SVD in NumPy, with no ML libraries, preserving 95%+ of variance across multi-asset returns. GitHub: https://github.com/agarwaladarshcoding-maker",
  "",
  "## Experience: Smart India Hackathon",
  "Mentored and contributed at Smart India Hackathon, helping teams turn ideas into working prototypes under tight deadlines.",
  "",
  "## Experience: India Innovates 2025",
  "Led Team SHA256 at India Innovates 2025, owning architecture and coordination for the build.",
  "",
  "## Experience: IIIT Pune Coding Club",
  "Active member of the IIIT Pune Coding Club, writing the daily 'Day X of Infinity' series on C++ internals and quant finance.",
  "",
  "## Achievements",
  "JEE Main 2025 All India Rank 17,517 (99th percentile, 97th percentile in Maths). Top 5% at IIIT Pune with a CGPA of 9.38. First place in the First-Year Competitive Programming Competition. Team Lead at India Innovates 2025. Author of the 'Day X of Infinity' writing series.",
  "",
  "## Education",
  "B.Tech in Computer Science and Engineering at IIIT Pune, 2025-2029. Current CGPA 9.38 (top 5% of the cohort). JEE Main 2025 All India Rank 17,517 - 99th percentile overall and 97th percentile in Mathematics. Strong theoretical base in linear algebra, probability, statistics, and stochastic calculus that underpins both his ML and quant work.",
  "",
  "## What Adarsh is looking for",
  "Adarsh is actively open to internships, freelance, and contract work in AI/ML and quantitative finance. He is most excited by applied machine learning, LLM and RAG systems, quantitative research and trading, and low-latency systems engineering. He is comfortable working remotely across time zones from Pune, India (IST, Asia/Kolkata).",
  "",
  "## How Adarsh works",
  "Adarsh builds end to end and from first principles - for example implementing PCA from scratch with SVD instead of calling a library. He cares about correctness and verification (his medical RAG checks every claim against its sources) and about performance (cache-aware C++, early-exit Monte Carlo). He documents and teaches what he learns through his daily 'Day X of Infinity' writing series.",
  "",
  "## Guiding ideas",
  "A few principles Adarsh lives by: 'I figure things out.' 'Jack of all trades, master of none, but often better than most.' 'I only see my goals.' And: 'AI and quant are really just maths, and I love maths.'",
  "",
  "## Skills in detail",
  "Languages: Python, C++ (17/20), and some JavaScript/TypeScript. ML: PyTorch, scikit-learn, RAG pipelines, LoRA fine-tuning, and NLI-based hallucination detection. Quant: NumPy, Pandas, statsmodels, cointegration and statistical arbitrage, options pricing, Monte Carlo methods, and PCA factor models. Systems: low-latency data structures and performance engineering. Web: React, Node, Express, and MongoDB. Competitive programming on Codeforces (handle AdarshAg).",
  "",
  "## Contact and links",
  "Email: agarwalaadarsh.work@gmail.com. GitHub: https://github.com/agarwaladarshcoding-maker. LinkedIn: https://linkedin.com/in/adarsh-agarwala. Codeforces handle: AdarshAg. Resume / CV is available on request and from the About section of this site.",
].join("\n");
