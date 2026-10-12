import { eq, desc } from 'drizzle-orm';
import { getDb, schema } from './index';
import type { Project } from './schema';

export async function getAllProjects(): Promise<Project[]> {
  const db = getDb();
  return await db.select().from(schema.projects).orderBy(schema.projects.name);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const db = getDb();
  return await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.featured, true))
    .orderBy(desc(schema.projects.createdAt));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}
