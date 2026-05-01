# AI Digital Tools Hub

A multi-tool web app intended for embedding (via iframe) into the user's WordPress site at www.aidigitaltoolshub.com.

## Tools

### 1. AI Research Agent (primary, route: `/` and `/research`)
- **Ask a Question** — Q&A on any topic, structured Markdown answers.
- **Summarize URL** — Server fetches the URL, extracts main text with cheerio, returns TL;DR + key points + quotes.
- **Research Report** — User supplies a topic and 1–8 source URLs. Server fetches each, then the model writes a structured report citing sources inline as [1], [2], etc.

### 2. Instagram Bio Generator (route: `/bio`)
- Generates short catchy IG bios from niche + tone.

## Stack
- Express + tsx, Vite, React, wouter, TanStack Query v5
- Drizzle ORM + PostgreSQL
- shadcn UI + Tailwind, framer-motion, lucide-react
- OpenAI via Replit AI Integrations (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`), model `gpt-5.1`
- cheerio for HTML extraction; react-markdown + remark-gfm for rendering

## Data
- `bios` — id, niche, tone, content, createdAt
- `research_queries` — id, type ('qa'|'summary'|'report'), title, input, result (markdown), sources (jsonb [{title, url}]), createdAt

## API contract (`shared/routes.ts`)
- `GET  /api/bios`, `POST /api/bios/generate`
- `GET  /api/research`
- `POST /api/research/qa`           { question }
- `POST /api/research/summarize`    { url }
- `POST /api/research/report`       { topic, urls[] }

## Frontend layout
- `client/src/components/TopNav.tsx` — shared top nav between Research and Bio
- `client/src/pages/Research.tsx` — main hero + tabs + history
- `client/src/components/ResearchTabs.tsx` — Q&A / Summary / Report forms
- `client/src/components/ResearchResult.tsx` — Markdown result + sources list
- `client/src/components/MarkdownView.tsx` — themed markdown renderer
- `client/src/pages/Home.tsx` — Bio generator (kept intact, reachable at `/bio`)

## WordPress embedding
After deploying, embed in any WordPress page using a Custom HTML block:
```html
<iframe src="https://YOUR-REPLIT-DOMAIN/" width="100%" height="1200" style="border:0;"></iframe>
```
Use `/research` for the agent specifically, or `/bio` for the bio generator.
