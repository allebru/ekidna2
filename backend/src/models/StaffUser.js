const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class StaffUser {
  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM staff_users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, is_active, created_at FROM staff_users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async create(data) {
    const { email, password, name, role = 'staff' } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO staff_users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [email, passwordHash, name, role]
    );
    return { id: result.insertId, email, name, role };
  }

  static async update(id, data) {
    const { name, role, is_active } = data;
    await pool.execute(
      'UPDATE staff_users SET name = COALESCE(?, name), role = COALESCE(?, role), is_active = COALESCE(?, is_active) WHERE id = ?',
      [name ?? null, role ?? null, is_active ?? null, id]
    );
    return StaffUser.findById(id);
  }

  static async changePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.execute('UPDATE staff_users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
    return result.affectedRows > 0 ? { id } : null;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, is_active, created_at FROM staff_users ORDER BY created_at DESC'
    );
    return rows;
  }

  static async deactivate(id) {
    const [result] = await pool.execute('UPDATE staff_users SET is_active = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0 ? { id } : null;
  }
}

module.exports = StaffUser;
