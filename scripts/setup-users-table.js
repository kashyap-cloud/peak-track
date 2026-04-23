import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_9KYiFveEM7Ck@ep-shiny-tree-ama4j3sa-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function setup() {
  console.log('Setting up users identity table...');
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        initialized_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Table "users" created or already exists.');

    // Add foreign key or at least ensure user_id column in performance_entries is ready
    // We'll keep it as TEXT/BIGINT comparison compatible
    console.log('Ensuring performance_entries uses the new identity model...');
    
    // In a real RLS scenario, we would alter the table here.
    // For now, we just ensure the indices are efficient.
    await sql`CREATE INDEX IF NOT EXISTS idx_performance_entries_user_id ON performance_entries(user_id)`;
    
    console.log('Setup completed successfully.');
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  }
}

setup();
