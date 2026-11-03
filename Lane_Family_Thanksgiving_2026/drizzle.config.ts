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

// `drizzle-kit generate` only needs the schema and dialect. Credentials are
// required only for commands that connect to the database (migrate, push), so
// don't fail when the credentials file isn't present (e.g. on Netlify builds).
let credentials: DatabaseCredentials | null = null;
try {
  credentials = getDatabaseCredentials();
} catch {
  credentials = null;
}

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  ...(credentials
    ? {
        dbCredentials: {
          host: credentials.host,
          port: credentials.port,
          user: credentials.user,
          password: credentials.password,
          database: credentials.database,
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : {}),
  verbose: true,
  strict: false,
});
