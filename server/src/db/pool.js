import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}

// Most hosted Postgres providers (Render, Neon, Supabase, Heroku) require SSL.
// We allow turning it off locally with PGSSL=disable.
const useSsl = process.env.PGSSL !== 'disable';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

export function query(text, params) {
  return pool.query(text, params);
}
