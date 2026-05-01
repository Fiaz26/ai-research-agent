import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { fetchAndExtract, fetchManyAndExtract } from "./research";

// ── AI provider detection ──────────────────────────────────────────────────
// Priority: Replit AI Integration → Google Gemini → OpenAI / any compatible API
function createAIClient(): OpenAI {
  if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  if (process.env.GEMINI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
  }
  if (process.env.OPENAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL, // optional custom endpoint
    });
  }
  throw new Error(
    "No AI provider configured. Set OPENAI_API_KEY, GEMINI_API_KEY, or AI_INTEGRATIONS_OPENAI_API_KEY."
  );
}

function getModelName(): string {
  if (process.env.AI_MODEL) return process.env.AI_MODEL;
  if (process.env.GEMINI_API_KEY) return "gemini-2.0-flash";
  if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) return "gpt-5.1";
  return "gpt-4o";
}

const openai = createAIClient();

async function chat(prompt: string, system?: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: getModelName(),
    messages: [
      ...(system ? [{ role: "system" as const, content: system }] : []),
      { role: "user" as const, content: prompt },
    ],
    max_tokens: 8192,
  });
  return response.choices[0]?.message?.content?.trim() || "";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ===== Bios =====
  app.get(api.bios.list.path, async (_req, res) => {
    try {
      const allBios = await storage.getBios();
      res.json(allBios);
    } catch (err) {
      console.error("Error fetching bios:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.bios.generate.path, async (req, res) => {
    try {
      const input = api.bios.generate.input.parse(req.body);

      const prompt = `Write a short, catchy, and creative Instagram bio for a ${input.niche} account with a ${input.tone} tone. Use emojis if appropriate. Max 150 characters. Just return the bio, no extra text.`;

      const generatedText = (await chat(prompt)) || "Failed to generate bio.";

      const newBio = await storage.createBio({
        niche: input.niche,
        tone: input.tone,
        content: generatedText,
      });

      res.status(200).json(newBio);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Error generating bio:", err);
      res.status(500).json({ message: "Failed to generate bio" });
    }
  });

  // ===== Research =====
  app.get(api.research.list.path, async (_req, res) => {
    try {
      const items = await storage.getResearchQueries();
      res.json(items);
    } catch (err) {
      console.error("Error fetching research history:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.research.qa.path, async (req, res) => {
    try {
      const { question } = api.research.qa.input.parse(req.body);

      const system = `You are a knowledgeable research assistant. Answer the user's question clearly and accurately.
- Use Markdown formatting (headings, bullet lists, bold).
- Be concise but thorough.
- If you are uncertain or the topic depends on recent events, clearly say so.
- Do not invent URLs or sources you can't verify.`;

      const result = await chat(question, system);

      const saved = await storage.createResearchQuery({
        type: "qa",
        title: question.slice(0, 120),
        input: question,
        result,
        sources: [],
      });

      res.status(200).json(saved);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Error answering research question:", err);
      res.status(500).json({ message: "Failed to answer question" });
    }
  });

  app.post(api.research.summarize.path, async (req, res) => {
    try {
      const { url } = api.research.summarize.input.parse(req.body);

      const page = await fetchAndExtract(url);
      if (!page.ok || !page.text) {
        return res.status(400).json({
          message: `Could not read this URL: ${page.error ?? "no readable content"}`,
        });
      }

      const system = `You summarize web pages for a researcher. Use Markdown.
Always include these sections:
## TL;DR
A 2–3 sentence summary.
## Key Points
A bullet list of the most important takeaways.
## Notable Quotes
Up to 3 short notable quotes from the article (if any).
## Topics
A short comma-separated list of key topics.
Be faithful to the source. Do not invent facts.`;

      const prompt = `URL: ${page.url}
Title: ${page.title}

Article content (may be truncated):
"""
${page.text}
"""`;

      const result = await chat(prompt, system);

      const saved = await storage.createResearchQuery({
        type: "summary",
        title: page.title,
        input: url,
        result,
        sources: [{ title: page.title, url: page.url }],
      });

      res.status(200).json(saved);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Error summarizing URL:", err);
      res.status(500).json({ message: "Failed to summarize URL" });
    }
  });

  app.post(api.research.report.path, async (req, res) => {
    try {
      const { topic, urls } = api.research.report.input.parse(req.body);

      const pages = await fetchManyAndExtract(urls);
      const usable = pages.filter((p) => p.ok && p.text.length > 200);

      if (usable.length === 0) {
        return res.status(400).json({
          message:
            "None of the provided URLs returned readable content. Try different sources.",
        });
      }

      const sourcesBlock = usable
        .map(
          (p, i) =>
            `### Source [${i + 1}] — ${p.title}
URL: ${p.url}
Content (may be truncated):
"""
${p.text}
"""`
        )
        .join("\n\n");

      const system = `You are a senior research analyst. Produce a well-structured research report in Markdown.
Strict rules:
- Use ONLY information that appears in the provided sources.
- Cite sources inline using bracketed numbers like [1], [2] that map to the numbered sources.
- If a claim isn't supported by the sources, omit it or say it's unclear.
- Do not invent URLs.

The report MUST include:
# {Report Title}
## Executive Summary
2–4 sentences.
## Key Findings
Bullet list with inline citations.
## Detailed Analysis
Several paragraphs of analysis with inline citations.
## Conflicting Views or Gaps
Note any disagreements between sources or missing information.
## References
A numbered list of the sources, each formatted as: [n] Title — URL`;

      const prompt = `Topic: ${topic}

Numbered sources to use:
${sourcesBlock}`;

      const result = await chat(prompt, system);

      const sources = usable.map((p) => ({ title: p.title, url: p.url }));
      const saved = await storage.createResearchQuery({
        type: "report",
        title: topic.slice(0, 120),
        input: topic,
        result,
        sources,
      });

      res.status(200).json(saved);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Error generating report:", err);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Seed with sample bios on first run
  try {
    const existing = await storage.getBios();
    if (existing.length === 0) {
      await storage.createBio({
        niche: "Fitness",
        tone: "Inspirational",
        content:
          "🏋️‍♀️ Sweat now, shine later.\n💪 Helping you build the best version of yourself.\n🥗 Workouts & Meal plans here 👇",
      });
      await storage.createBio({
        niche: "Tech",
        tone: "Professional",
        content:
          "💻 Coding the future, one line at a time.\n🚀 Full-stack developer & tech enthusiast.\n🔗 Check out my latest projects below.",
      });
    }
  } catch (err) {
    console.error("Failed to seed database", err);
  }

  return httpServer;
}
