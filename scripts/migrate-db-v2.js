import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Migrating database schema (v2)...');
  try {
    await sql`
      ALTER TABLE performance_entries 
      ADD COLUMN IF NOT EXISTS priority_completion_text TEXT
    `;
    console.log('Column "priority_completion_text" added successfully.');
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
}

migrate();
