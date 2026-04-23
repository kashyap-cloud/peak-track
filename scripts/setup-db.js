import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function setup() {
  console.log('Setting up Neon database schema...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS performance_entries (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT 'local-user',
        date DATE NOT NULL,
        execution_score INTEGER NOT NULL,
        mental_clarity INTEGER NOT NULL,
        priority_completed BOOLEAN NOT NULL,
        primary_blocker TEXT NOT NULL,
        custom_blocker_text TEXT,
        productivity_depth TEXT,
        custom_work_depth_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      )
    `;
    console.log('Table "performance_entries" created or already exists.');
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setup();
