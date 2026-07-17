import fs from 'fs';
import path from 'path';
import { pool } from './pool';

async function initDatabase(): Promise<void> {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  const seedSql = fs.readFileSync(seedPath, 'utf-8');

  const client = await pool.connect();

  try {
    console.log('Applying schema...');
    await client.query(schemaSql);
    console.log('Schema applied.');

    console.log('Seeding data...');
    await client.query(seedSql);
    console.log('Seed data inserted.');

    console.log('Database initialization complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});
