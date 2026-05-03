import { pool } from "./db";

export async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS novels (
        id SERIAL PRIMARY KEY,
        author_id INTEGER,
        title TEXT NOT NULL,
        genre TEXT NOT NULL,
        synopsis TEXT,
        cover_url TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        status TEXT DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS characters (
        id SERIAL PRIMARY KEY,
        novel_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        traits TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        novel_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        sequence_number INTEGER NOT NULL,
        content TEXT,
        outline TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS user_interactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        novel_id INTEGER NOT NULL,
        viewed BOOLEAN DEFAULT FALSE,
        liked BOOLEAN DEFAULT FALSE,
        disliked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS follows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER NOT NULL,
        following_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("[migrate] Database tables ready");
  } catch (err) {
    console.error("[migrate] Migration error:", err);
    throw err;
  } finally {
    client.release();
  }
}
