import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import EmbeddedPostgres from 'embedded-postgres';

const databaseDir = path.resolve(__dirname, '../../.pgsql-data');
const port = 5432;
const user = 'postgres';
const password = 'postgres';
const databaseName = 'medical_dashboard';

/** Windows initdb often uses WIN1252; recreate as UTF8 so Arabic seed data works. */
async function ensureUtf8Database(): Promise<void> {
  const admin = new Client({
    host: 'localhost',
    port,
    user,
    password,
    database: 'postgres',
  });
  await admin.connect();
  try {
    const existing = await admin.query(
      'SELECT pg_encoding_to_char(encoding) AS encoding FROM pg_database WHERE datname = $1',
      [databaseName]
    );

    const encoding = existing.rows[0]?.encoding as string | undefined;
    if (encoding === 'UTF8') {
      console.log(`Database "${databaseName}" is UTF8.`);
      return;
    }

    if (encoding) {
      console.log(
        `Database "${databaseName}" is ${encoding}; recreating as UTF8 for Arabic names...`
      );
      await admin.query(
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
        [databaseName]
      );
      await admin.query(`DROP DATABASE IF EXISTS ${databaseName}`);
    }

    await admin.query(
      `CREATE DATABASE ${databaseName} WITH ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0`
    );
    console.log(`Database "${databaseName}" created with UTF8 encoding.`);
  } finally {
    await admin.end();
  }
}

async function startLocalDatabase(): Promise<void> {
  fs.mkdirSync(databaseDir, { recursive: true });

  const pg = new EmbeddedPostgres({
    databaseDir,
    user,
    password,
    port,
    persistent: true,
  });

  const alreadyInitialized = fs.existsSync(path.join(databaseDir, 'PG_VERSION'));

  if (!alreadyInitialized) {
    console.log('Initializing local PostgreSQL cluster...');
    await pg.initialise();
  }

  console.log(`Starting local PostgreSQL on port ${port}...`);
  await pg.start();

  await ensureUtf8Database();

  console.log('Local PostgreSQL is ready.');
  console.log(`DATABASE_URL=postgresql://${user}:${password}@localhost:${port}/${databaseName}`);
  console.log('Keep this process running while using the dashboard.');

  const shutdown = async (): Promise<void> => {
    console.log('Stopping local PostgreSQL...');
    await pg.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
}

startLocalDatabase().catch((error) => {
  console.error('Failed to start local PostgreSQL:', error);
  process.exit(1);
});
