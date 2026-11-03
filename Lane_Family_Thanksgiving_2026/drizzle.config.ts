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
import { getDatabaseCredentials } from './src/server/db/config';

// Migration generation only needs the schema. Credentials are loaded when the
// legacy config file is present (e.g. for `drizzle-kit migrate`), and skipped
// otherwise so builds without that file don't fail.
function loadCredentials() {
  try {
    return getDatabaseCredentials();
  } catch {
    return undefined;
  }
}

const credentials = loadCredentials();

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  ...(credentials && {
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
  }),
  verbose: true,
  strict: false,
});
