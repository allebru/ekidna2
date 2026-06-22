// Migration runner for MySQL (Hostinger-friendly: no shell access needed,
// run with `npm run migrate`).
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    database: process.env.DB_NAME || 'ekidna_db',
    user: process.env.DB_USER || 'ekidna_user',
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    console.log('🚀 Running database migration...');

    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await connection.query(sql);
    console.log('✓ Schema created/verified');

    // Seed default admin user (only if it does not exist yet)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ekidna.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const [rows] = await connection.query(
      'SELECT id FROM staff_users WHERE email = ?',
      [adminEmail]
    );

    if (rows.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await connection.query(
        `INSERT INTO staff_users (email, password_hash, name, role)
         VALUES (?, ?, ?, 'admin')`,
        [adminEmail, hash, 'Administrator']
      );
      console.log(`✓ Default admin created: ${adminEmail}`);
      console.log('⚠️  Change the admin password after first login!');
    } else {
      console.log(`✓ Admin user already exists: ${adminEmail}`);
    }

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

run();
