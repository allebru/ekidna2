#!/usr/bin/env node

/**
 * Quick Fix: Add DEFAULT value to serial_number column
 *
 * This script fixes the serial_number column to have a DEFAULT value
 * so that new subscribers can be inserted without specifying serial_number.
 *
 * Usage:
 *   node fix_serial_number.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('./src/config/database');

async function fixSerialNumber() {
  try {
    console.log('🔧 Fixing serial_number column...\n');

    // Check if sequence exists
    const seqCheck = await pool.query(`
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_name = 'subscribers_serial_seq';
    `);

    // Create sequence if it doesn't exist
    if (seqCheck.rows.length === 0) {
      console.log('Creating sequence: subscribers_serial_seq');
      await pool.query(`CREATE SEQUENCE subscribers_serial_seq START 1;`);
      console.log('✅ Sequence created\n');
    } else {
      console.log('✓ Sequence already exists\n');
    }

    // Check current column definition
    console.log('Checking current serial_number column...');
    const columnCheck = await pool.query(`
      SELECT column_default
      FROM information_schema.columns
      WHERE table_name = 'subscribers' AND column_name = 'serial_number';
    `);

    if (columnCheck.rows.length === 0) {
      console.log('❌ serial_number column does not exist!');
      console.log('   Please run the full migrations: npm run migrate\n');
      process.exit(1);
    }

    const currentDefault = columnCheck.rows[0].column_default;
    console.log(`Current DEFAULT: ${currentDefault || '(none)'}\n`);

    // Add DEFAULT value if it's missing
    if (!currentDefault || !currentDefault.includes('nextval')) {
      console.log('Setting DEFAULT value...');
      await pool.query(`
        ALTER TABLE subscribers
        ALTER COLUMN serial_number SET DEFAULT nextval('subscribers_serial_seq');
      `);
      console.log('✅ DEFAULT value set successfully\n');
    } else {
      console.log('✓ DEFAULT value already set correctly\n');
    }

    // Update any rows that might have NULL serial_number
    console.log('Checking for NULL serial_numbers...');
    const nullCheck = await pool.query(`
      SELECT COUNT(*) as count FROM subscribers WHERE serial_number IS NULL;
    `);

    const nullCount = parseInt(nullCheck.rows[0].count);
    if (nullCount > 0) {
      console.log(`Found ${nullCount} rows with NULL serial_number`);
      console.log('Updating NULL values...');
      await pool.query(`
        UPDATE subscribers
        SET serial_number = nextval('subscribers_serial_seq')
        WHERE serial_number IS NULL;
      `);
      console.log('✅ NULL values updated\n');
    } else {
      console.log('✓ No NULL serial_numbers found\n');
    }

    console.log('✅ Fix completed successfully!\n');
    console.log('You can now try creating a new subscription.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixSerialNumber();
