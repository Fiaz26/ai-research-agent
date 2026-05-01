import { z } from "zod";
import {
  bios,
  generateBioRequestSchema,
  researchQueries,
  researchQARequestSchema,
  researchSummarizeRequestSchema,
  researchReportRequestSchema,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  bios: {
    generate: {
      method: "POST" as const,
      path: "/api/bios/generate" as const,
      input: generateBioRequestSchema,
      responses: {
        200: z.custom<typeof bios.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/bios" as const,
      responses: {
        200: z.array(z.custom<typeof bios.$inferSelect>()),
      },
    },
  },
  research: {
    qa: {
      method: "POST" as const,
      path: "/api/research/qa" as const,
      input: researchQARequestSchema,
      responses: {
        200: z.custom<typeof researchQueries.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    summarize: {
      method: "POST" as const,
      path: "/api/research/summarize" as const,
      input: researchSummarizeRequestSchema,
      responses: {
        200: z.custom<typeof researchQueries.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    report: {
      method: "POST" as const,
      path: "/api/research/report" as const,
      input: researchReportRequestSchema,
      responses: {
        200: z.custom<typeof researchQueries.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/research" as const,
      responses: {
        200: z.array(z.custom<typeof researchQueries.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type GenerateBioInput = z.infer<typeof api.bios.generate.input>;
export type BioResponse = z.infer<typeof api.bios.generate.responses[200]>;
export type BiosListResponse = z.infer<typeof api.bios.list.responses[200]>;

export type ResearchQAInput = z.infer<typeof api.research.qa.input>;
export type ResearchSummarizeInput = z.infer<typeof api.research.summarize.input>;
export type ResearchReportInput = z.infer<typeof api.research.report.input>;
export type ResearchResponse = z.infer<typeof api.research.qa.responses[200]>;
export type ResearchListResponse = z.infer<typeof api.research.list.responses[200]>;
