#!/usr/bin/env node

/**
 * Database Migration Runner
 *
 * This script runs all SQL migration files in the migrations directory.
 * Migrations are executed in alphabetical order.
 *
 * Usage:
 *   npm run migrate
 *   or
 *   node migrations/run.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ekidna_db',
  user: process.env.DB_USER || 'ekidna_user',
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting database migrations...\n');

    // Get all .sql files in migrations directory
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Run migrations in alphabetical order

    if (files.length === 0) {
      console.log('📭 No migration files found.');
      return;
    }

    console.log(`Found ${files.length} migration file(s):\n`);

    // Run each migration
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`▶ Running: ${file}`);

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`✅ Success: ${file}\n`);
      } catch (error) {
        await client.query('ROLLBACK');

        // Check if error is due to object already existing
        if (error.code === '42P07' || error.code === '42710' || error.code === '42P16') {
          console.log(`⏭️  Skipped: ${file} (already applied)\n`);
        } else {
          console.error(`❌ Failed: ${file}`);
          console.error(`   Error: ${error.message}\n`);
          throw error; // Re-throw to stop migration process
        }
      }
    }

    console.log('✅ All migrations completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration process failed:');
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations
runMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
