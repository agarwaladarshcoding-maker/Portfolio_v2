// ──────────────────────────────────────────────────────────
// DEFAULT SITE CONTENT. This is the seed used on first load.
// You can also edit everything live from /admin (it saves to your browser).
// ──────────────────────────────────────────────────────────

export const site = {
  name: "Adarsh Agarwala",
  initials: "AA",
  role: "AI-ML / Quant",
  location: "Pune, India",
  timezone: "Asia/Kolkata",
  available: true,
  // The big hero headline, one array entry per line. First line is accented.
  headline: ["AI, ML", "& quant", "engineer."],
  summary:
    "Computer Science undergrad at IIIT Pune building production-grade ML systems, CUDA tensor engines, and LLM/RAG pipelines — plus low-latency C++ for quantitative finance, all on a strong maths foundation.",
  email: "agarwalaadarsh.work@gmail.com",
  resumeUrl: "#",
  socials: [
    { label: "GitHub", href: "https://github.com/agarwaladarshcoding-maker" },
    { label: "LinkedIn", href: "https://linkedin.com/in/adarsh-agarwala" },
    { label: "Email", href: "mailto:agarwalaadarsh.work@gmail.com" },
  ],
};

// Rotating slogans shown in the hero.
export const slogans = [
  "I figure out things.",
  "Jack of all trades, master of none — but often better than most.",
  "I only see my goals.",
  "AI / Quant is maths, and I love maths.",
];

// Small facts strip under the hero.
export const facts = [
  { label: "Focus", value: "AI / ML · Quant" },
  { label: "Stack", value: "Python · C++ · PyTorch" },
  { label: "Status", value: "Freelance / Contract / Intern" },
  { label: "Base", value: "Pune, India" },
];

// 8 fixed anchor positions for the floating chips (percentages in the panel).
export const heroChipSlots = [
  { top: "1%", left: "6%" },
  { top: "-2%", left: "58%" },
  { top: "24%", left: "76%" },
  { top: "68%", left: "78%" },
  { top: "90%", left: "54%" },
  { top: "92%", left: "2%" },
  { top: "62%", left: "-4%" },
  { top: "32%", left: "-6%" },
];

// Quant / ML / AI chip pool. The hero shows 8 at a time and rotates one-by-one.
export type HeroChip = { label: string; sub: string };
export const heroChips: HeroChip[] = [
  { label: "LLM", sub: "agents" },
  { label: "RAG", sub: "retrieval" },
  { label: "PyTorch", sub: "training" },
  { label: "Transformers", sub: "attention" },
  { label: "Alpha", sub: "signals" },
  { label: "Backtest", sub: "strategies" },
  { label: "Stochastic", sub: "calculus" },
  { label: "Cointegration", sub: "ADF test" },
  { label: "Monte Carlo", sub: "simulation" },
  { label: "Vectors", sub: "embeddings" },
  { label: "CUDA", sub: "kernels" },
  { label: "Order Book", sub: "low-latency" },
  { label: "Options", sub: "pricing" },
  { label: "C++", sub: "systems" },
];

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
  stack: string[];
  metrics: { value: string; label: string }[];
  github?: string;
  live?: string;
  featured?: boolean;
};

// About section copy.
export const about = {
  lead:
    "I'm a CS undergrad at IIIT Pune who builds across the stack — from CUDA kernels and RAG pipelines to statistical-arbitrage engines and full-stack web apps. If it involves maths and systems, I'm in.",
  paragraphs: [
    "I like going to first principles. I've written a tensor compute engine in CUDA C, a dual-mode medical RAG pipeline with hallucination detection, and a low-latency limit order book in modern C++ — usually because I wanted to understand how the thing actually works.",
    "Outside of building, I compete on Codeforces and write a daily 'Day X of Infinity' series on C++ internals and quant finance. Strong foundations in linear algebra, probability, and stochastic calculus run through everything I do.",
  ],
  cards: [
    { label: "Currently", value: "B.Tech CSE @ IIIT Pune · building quant + ML systems" },
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
    tagline: "Dual-mode retrieval with hallucination detection",
    blurb:
      "A production-grade medical RAG pipeline that does both dense and vectorless retrieval, then verifies every generated claim against its sources.",
    description: [
      "Engineered a dual-mode RAG pipeline supporting dense embedding retrieval via ChromaDB and a vectorless BM25 path, so it can fall back to lightweight retrieval in zero-GPU environments with no vector index dependency.",
      "Layered hybrid retrieval fusion (BM25 + dense, combined via Reciprocal Rank Fusion and cross-encoder reranking), an NLI-based hallucination detector that checks each claim at the sentence level, and LoRA fine-tuning for factual strictness with exact source attribution.",
    ],
    highlights: [
      "Dual-mode (vector + vectorless) retrieval with graceful zero-GPU fallback",
      "NLI hallucination detection flags ungrounded claims before output",
      "LoRA cut trainable parameters by ~90% while keeping factual strictness",
      "Sentence-level source attribution for full clinical traceability",
    ],
    year: "2026",
    role: "Solo build",
    stack: ["Python", "PyTorch", "LangChain", "HuggingFace", "ChromaDB"],
    metrics: [
      { value: "~90%", label: "fewer trainable params" },
      { value: "2-mode", label: "retrieval" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker",
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
    stack: ["Python", "Pandas", "statsmodels", "scikit-learn", "yfinance"],
    metrics: [
      { value: "3 yrs", label: "market data" },
      { value: "2 sigma", label: "signal band" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker",
    featured: true,
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
    year: "2026 · Active",
    role: "Solo build",
    stack: ["C++17/20", "STL", "Smart Pointers"],
    metrics: [{ value: "O(1)", label: "order lookup" }],
    github: "https://github.com/agarwaladarshcoding-maker",
    featured: true,
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
    stack: ["Python", "scikit-learn", "WebSockets"],
    metrics: [
      { value: "~99%", label: "classifier accuracy" },
      { value: "7", label: "event types" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker",
    featured: false,
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
    stack: ["C++", "Python", "Pandas", "Matplotlib"],
    metrics: [
      { value: "100k", label: "sim paths" },
      { value: "<1.8s", label: "runtime" },
    ],
    github: "https://github.com/agarwaladarshcoding-maker",
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
    stack: ["Python", "NumPy", "Pandas", "Matplotlib"],
    metrics: [{ value: "95%+", label: "variance kept" }],
    github: "https://github.com/agarwaladarshcoding-maker",
    featured: false,
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
export const achievements: Achievement[] = [
  {
    title: "JEE Main 2025 — AIR 17,517",
    detail: "99th percentile across 1.2M candidates; 97th percentile in Mathematics.",
  },
  {
    title: "Top 5% at IIIT Pune",
    detail: "CGPA 9.38/10 (SGPA 9.6), Semester 1 — Institute of National Importance.",
  },
  {
    title: "Competitive Programming Champion",
    detail:
      "1st place in the First-Year Competitive Programming Competition at IIIT Pune; active Codeforces competitor.",
  },
  {
    title: "Team Lead — India Innovates 2025",
    detail: "Led Team SHA256; architecture independently converged with Miro's product approach.",
  },
  {
    title: "'Day X of Infinity' Series",
    detail: "Daily LinkedIn writing on C++ internals, HFT, and quantitative finance.",
  },
];

export type NowItem = { label: string; text: string };
export type Now = { updated: string; intro: string; items: NowItem[] };

// The /now page — a snapshot of what you're focused on right now.
export const now: Now = {
  updated: "June 2026",
  intro:
    "A snapshot of what I'm focused on right now — inspired by the /now page movement. Updated from time to time.",
  items: [
    { label: "Building", text: "A low-latency limit order book in C++ and an evidence-aware medical RAG pipeline." },
    { label: "Learning", text: "Stochastic calculus, market microstructure, and the LMAX Disruptor pattern for lock-free queues." },
    { label: "Writing", text: "The daily 'Day X of Infinity' series on C++ internals, HFT, and quant finance." },
    { label: "Studying", text: "B.Tech CSE at IIIT Pune — deep into linear algebra, probability, and DSA." },
    { label: "Open to", text: "AI/ML and quant internships, freelance, and contract work." },
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
    items: ["C++17/20", "CUDA C", "Statistical arbitrage", "Monte Carlo / GBM", "Limit order books", "NumPy / Pandas"],
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
        "Adarsh Agarwala is a CS undergrad at IIIT Pune working at the intersection of AI/ML and quantitative finance. He builds production-grade ML systems, CUDA tensor engines, RAG pipelines, and low-latency C++ — all on a strong maths foundation.",
    },
    {
      keywords: ["stack", "tech", "tools", "language", "languages", "build", "builds"],
      answer:
        "Day to day: Python and PyTorch for ML; C++17/20 and CUDA for systems and quant; NumPy, Pandas, statsmodels and scikit-learn for data; and React, Node, Express and MongoDB on the web side.",
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
// It is fully editable from the /admin panel, and can be exported to PDF there.
// =============================================================================
export const profileDoc = [
  "# Adarsh Agarwala — Profile Knowledge Base",
  "",
  "## Who is Adarsh",
  "Adarsh Agarwala is a Computer Science undergraduate (B.Tech CSE, 2025-2029) at IIIT Pune, working at the intersection of AI/ML and quantitative finance. He builds production-grade ML systems, CUDA tensor engines, RAG pipelines, and low-latency C++ - all on a strong mathematics foundation in linear algebra, probability, and stochastic calculus. He is based in Pune, India (Asia/Kolkata).",
  "",
  "## Focus and interests",
  "AI / ML: retrieval-augmented generation, hallucination detection, LoRA fine-tuning, and AI agents.",
  "Quant: statistical arbitrage, options pricing, factor models, and low-latency trading systems.",
  "Systems: modern C++ (17/20), CUDA, and performance engineering.",
  "Adarsh is open to AI/ML and quant internships, freelance, and contract work.",
  "",
  "## Tech stack",
  "Python and PyTorch for ML; C++17/20 and CUDA for systems and quant; NumPy, Pandas, statsmodels, and scikit-learn for data; React, Node, Express, and MongoDB on the web side.",
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
  "Languages: Python, C++ (17/20), and some JavaScript/TypeScript. ML: PyTorch, scikit-learn, RAG pipelines, LoRA fine-tuning, and NLI-based hallucination detection. Quant: NumPy, Pandas, statsmodels, cointegration and statistical arbitrage, options pricing, Monte Carlo methods, and PCA factor models. Systems: CUDA, low-latency data structures, and performance engineering. Web: React, Node, Express, and MongoDB. Competitive programming on Codeforces (handle AdarshAg).",
  "",
  "## Contact and links",
  "Email: agarwalaadarsh.work@gmail.com. GitHub: https://github.com/agarwaladarshcoding-maker. LinkedIn: https://linkedin.com/in/adarsh-agarwala. Codeforces handle: AdarshAg. Resume / CV is available on request and from the About section of this site.",
].join("\n");
