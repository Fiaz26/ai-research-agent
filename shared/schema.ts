import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bios = pgTable("bios", {
  id: serial("id").primaryKey(),
  niche: text("niche").notNull(),
  tone: text("tone").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBioSchema = createInsertSchema(bios).omit({ id: true, createdAt: true });

export type Bio = typeof bios.$inferSelect;
export type InsertBio = z.infer<typeof insertBioSchema>;

export const generateBioRequestSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
  tone: z.string().min(1, "Tone is required"),
});

export type GenerateBioRequest = z.infer<typeof generateBioRequestSchema>;

// === Research Agent ===

export const sourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  snippet: z.string().optional(),
});
export type ResearchSource = z.infer<typeof sourceSchema>;

export const researchQueries = pgTable("research_queries", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'qa' | 'summary' | 'report'
  title: text("title").notNull(),
  input: text("input").notNull(),
  result: text("result").notNull(),
  sources: jsonb("sources").$type<ResearchSource[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ResearchQuery = typeof researchQueries.$inferSelect;

export const researchQARequestSchema = z.object({
  question: z.string().min(3, "Please enter a question"),
});
export type ResearchQARequest = z.infer<typeof researchQARequestSchema>;

export const researchSummarizeRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});
export type ResearchSummarizeRequest = z.infer<typeof researchSummarizeRequestSchema>;

export const researchReportRequestSchema = z.object({
  topic: z.string().min(3, "Please enter a topic"),
  urls: z
    .array(z.string().url("Each source must be a valid URL"))
    .min(1, "Add at least one source URL")
    .max(8, "Up to 8 sources are allowed"),
});
export type ResearchReportRequest = z.infer<typeof researchReportRequestSchema>;
