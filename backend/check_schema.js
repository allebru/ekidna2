// Check database schema for debugging
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('./src/config/database');

async function checkSchema() {
  try {
    console.log('Checking subscribers table schema...\n');

    const result = await pool.query(`
      SELECT
        column_name,
        data_type,
        column_default,
        is_nullable,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'subscribers'
      ORDER BY ordinal_position;
    `);

    console.log('Columns:');
    console.table(result.rows);

    // Check if sequence exists
    const seqCheck = await pool.query(`
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_name = 'subscribers_serial_seq';
    `);

    console.log('\nSequence exists:', seqCheck.rows.length > 0 ? 'YES' : 'NO');
    if (seqCheck.rows.length > 0) {
      const seqValue = await pool.query(`SELECT last_value FROM subscribers_serial_seq;`);
      console.log('Current sequence value:', seqValue.rows[0].last_value);
    }

    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkSchema();
