import fs from 'fs';
import path from 'path';
import EmbeddedPostgres from 'embedded-postgres';

const databaseDir = path.resolve(__dirname, '../../.pgsql-data');
const port = 5432;
const user = 'postgres';
const password = 'postgres';
const databaseName = 'medical_dashboard';

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

  try {
    await pg.createDatabase(databaseName);
    console.log(`Database "${databaseName}" created.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes('already exists')) {
      console.log(`Database "${databaseName}" already exists.`);
    } else {
      // createDatabase may throw differently across versions; continue if DB is usable
      console.warn('createDatabase note:', message);
    }
  }

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
