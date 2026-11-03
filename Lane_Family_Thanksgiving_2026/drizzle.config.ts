/** TREAT AS IMMUTABLE - This file is protected by the file-edit tool
 *
 * Drizzle Kit configuration for database migrations
 *
 * Usage:
 * - Generate migrations: npx drizzle-kit generate
 * - Apply migrations: npx drizzle-kit migrate
 *
 * Configuration source:
 * - Reads from $NOMAD_TASK_DIR/config.json (defaults to /local/config.json)
 * - Throws error if config file not found or invalid
 */
import { defineConfig } from 'drizzle-kit';
import { getDatabaseCredentials, type DatabaseCredentials } from './src/server/db/config';

// `drizzle-kit generate` only reads the schema and never connects, so fall back
// to placeholder credentials when the config file isn't present (e.g. in CI/Netlify builds).
function loadCredentials(): DatabaseCredentials {
  try {
    return getDatabaseCredentials();
  } catch {
    return { host: 'localhost', port: 3306, user: '', password: '', database: '' };
  }
}

const credentials = loadCredentials();

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: credentials.host,
    port: credentials.port,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    ssl: {
      rejectUnauthorized: false,
    }
  },
  verbose: true,
  strict: false,
});
