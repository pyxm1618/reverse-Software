import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Please provide a valid Neon PostgreSQL connection string in .env.local.');
  }
  const client = neon(connectionString);
  return drizzle(client, { schema });
}

export { schema };
