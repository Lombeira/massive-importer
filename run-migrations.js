import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Client } = pg;

const client = new Client({
  user: 'admin',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'sf_transportation'
});

async function runMigrations(direction = 'up') {
  await client.connect();

  await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            executed_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  const executedMigrations = await client.query(`SELECT name FROM migrations`);
  const executedNames = new Set(executedMigrations.rows.map(row => row.name));

  const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'))
    .filter(file => file.endsWith('.js'))
    .sort();

  if (direction === 'up') {
    for (const file of migrationFiles) {
      if (!executedNames.has(file)) {
        const migration = await import(`file://${path.join(__dirname, 'migrations', file)}`);
        console.log(`🔄 Executing migration: ${file}`);
        await migration.up(client);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
      }
    }
  } else if (direction === 'down') {
    for (const file of migrationFiles.reverse()) {
      if (executedNames.has(file)) {
        const migration = await import(`file://${path.join(__dirname, 'migrations', file)}`);
        console.log(`⏪ Reverting migration: ${file}`);
        await migration.down(client);
        await client.query('DELETE FROM migrations WHERE name = $1', [file]);
      }
    }
  }

  console.log(`✅ Migrations ${direction} executed.`);
  await client.end();
}

const direction = process.argv[2] || 'up';
runMigrations(direction).catch(err => console.error('Error while running migrations:', err));
