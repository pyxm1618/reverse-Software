import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function runMigrate() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('BLOCKED: DATABASE_URL not provided');
    process.exit(1);
  }

  console.log('Connecting to Neon PostgreSQL to apply migrations...');
  const sql = neon(dbUrl);
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Database migrations applied successfully.');
}

runMigrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
