import { db } from "./db";
import {
  bios,
  type InsertBio,
  type Bio,
  researchQueries,
  type ResearchQuery,
  type ResearchSource,
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getBios(): Promise<Bio[]>;
  createBio(bio: InsertBio): Promise<Bio>;
  getResearchQueries(): Promise<ResearchQuery[]>;
  createResearchQuery(input: {
    type: "qa" | "summary" | "report";
    title: string;
    input: string;
    result: string;
    sources?: ResearchSource[];
  }): Promise<ResearchQuery>;
}

export class DatabaseStorage implements IStorage {
  async getBios(): Promise<Bio[]> {
    return await db.select().from(bios).orderBy(desc(bios.createdAt));
  }

  async createBio(bio: InsertBio): Promise<Bio> {
    const [inserted] = await db.insert(bios).values(bio).returning();
    return inserted;
  }

  async getResearchQueries(): Promise<ResearchQuery[]> {
    return await db
      .select()
      .from(researchQueries)
      .orderBy(desc(researchQueries.createdAt));
  }

  async createResearchQuery(input: {
    type: "qa" | "summary" | "report";
    title: string;
    input: string;
    result: string;
    sources?: ResearchSource[];
  }): Promise<ResearchQuery> {
    const [inserted] = await db
      .insert(researchQueries)
      .values({
        type: input.type,
        title: input.title,
        input: input.input,
        result: input.result,
        sources: input.sources ?? [],
      })
      .returning();
    return inserted;
  }
}

export const storage = new DatabaseStorage();
