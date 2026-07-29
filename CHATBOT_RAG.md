# AdarshAI — Hybrid, Vectorless RAG chatbot

This portfolio ships a retrieval-augmented (RAG) assistant called **AdarshAI**. This
doc explains what it is, how it works, and how to turn on the LLM.

## What is RAG (and the two flavours used here)

**RAG = Retrieval-Augmented Generation.** Instead of hoping a language model already
"knows" you, you (1) **retrieve** the most relevant facts from your own knowledge
base, then (2) hand those facts to the model as context so it can **generate** a
grounded answer. This stops hallucination and keeps answers accurate and current.

### Vectorless RAG
Classic RAG converts text into **embeddings** (vectors) and searches a vector
database by cosine similarity. That needs an embedding model, infra, and cost.
**Vectorless RAG** skips all of that: for a small corpus (one person's profile),
you retrieve with plain **lexical scoring** — here a **TF-IDF keyword match** over
the chunks. Zero embeddings, zero vector DB, instant, free, and runs in the browser.

### Hybrid RAG
**Hybrid RAG** fuses more than one retrieval signal so you get the best of each:
- **Structured retrieval** — each project / experience / achievement / contact is
  a clean, typed chunk straight from `lib/data.ts`.
- **Lexical retrieval** — TF-IDF over every chunk (including the free-form profile
  document), so exact terms like "AgentWatch", "pairs trading", "resume" rank high.
The two pools are merged, scored, and the top 5 chunks become the LLM context.

## How it works in this repo

```
User question
   │
   ▼  (browser)
buildCorpus(content)      lib/rag.ts  → structured chunks + profileDoc chunks
retrieve(question, 5)     lib/rag.ts  → TF-IDF top-k (vectorless)
   │  POST { question, context, links }
   ▼  (server)
app/api/chat/route.ts     → adds system prompt, calls the LLM (Groq/xAI/OpenAI)
   │
   ▼
Grounded answer  (falls back to the offline rule-based engine if no key)
```

- **Knowledge base:** `profileDoc` in `lib/data.ts` — edit that file to change what
  AdarshAI knows.
- **Chunking / retrieval:** `lib/rag.ts` (`buildCorpus`, `chunkText`, `retrieve`).
- **LLM call:** `app/api/chat/route.ts` (OpenAI-compatible).
- **Widget + voice:** `components/ChatDock.tsx` — speech-to-text (mic) and
  text-to-speech (Voice on/off) via the browser Web Speech API.
- **Graceful fallback:** with no API key the bot still answers using the built-in
  rule-based engine, so the site never breaks.

## Turn on the LLM (free)

1. `cp .env.local.example .env.local`
2. Get a free key from Groq: https://console.groq.com/keys
3. Put it in `.env.local` as `CHAT_API_KEY=...` (Groq is the default base + model).
4. `npm run dev` and ask AdarshAI anything.

Want xAI Grok / OpenAI / OpenRouter instead? Just change `CHAT_API_BASE` and
`CHAT_MODEL` in `.env.local` (examples are in the file).
