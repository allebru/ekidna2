const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class StaffUser {
  // Find user by email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM staff_users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, name, role, is_active, created_at FROM staff_users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create new staff user (admin only)
  static async create(data) {
    const { email, password, name, role = 'staff' } = data;

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO staff_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email, passwordHash, name, role]
    );

    return result.rows[0];
  }

  // Update user
  static async update(id, data) {
    const { name, role, is_active } = data;

    const result = await pool.query(
      `UPDATE staff_users
       SET name = COALESCE($1, name),
           role = COALESCE($2, role),
           is_active = COALESCE($3, is_active)
       WHERE id = $4
       RETURNING id, email, name, role, is_active`,
      [name, role, is_active, id]
    );

    return result.rows[0] || null;
  }

  // Change password
  static async changePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      'UPDATE staff_users SET password_hash = $1 WHERE id = $2 RETURNING id',
      [passwordHash, id]
    );

    return result.rows[0] || null;
  }

  // Get all staff users
  static async findAll() {
    const result = await pool.query(
      'SELECT id, email, name, role, is_active, created_at FROM staff_users ORDER BY created_at DESC'
    );

    return result.rows;
  }

  // Deactivate user
  static async deactivate(id) {
    const result = await pool.query(
      'UPDATE staff_users SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows[0] || null;
  }
}

module.exports = StaffUser;
