const pool = require('../config/database');

class Subscriber {
  static async create(data) {
    const { name, email, phone, address, subscription_year, notes } = data;
    const [result] = await pool.execute(
      'INSERT INTO subscribers (name, email, phone, address, subscription_year, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email || null, phone || null, address || null, subscription_year, notes || null, 'active']
    );
    return Subscriber.findById(result.insertId);
  }

  static async findAll(filters = {}) {
    const { page = 1, limit = 50, status = 'active', subscription_year, search } = filters;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = 'WHERE 1=1';
    const params = [];

    if (status && status !== 'all') { where += ' AND status = ?'; params.push(status); }
    if (subscription_year) { where += ' AND subscription_year = ?'; params.push(subscription_year); }
    if (search) { where += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM subscribers ${where}`, params);
    const total = parseInt(countRows[0].total);

    const lim = parseInt(limit);
    const off = parseInt(page) >= 1 ? (parseInt(page) - 1) * lim : 0;
    const [rows] = await pool.query(
      `SELECT * FROM subscribers ${where} ORDER BY created_at DESC LIMIT ${lim} OFFSET ${off}`,
      params
    );

    return {
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM subscribers WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM subscribers WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async update(id, data) {
    const { name, email, phone, address, subscription_year, notes } = data;
    await pool.execute(
      `UPDATE subscribers SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address),
        subscription_year = COALESCE(?, subscription_year),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status != 'deleted'`,
      [name ?? null, email ?? null, phone ?? null, address ?? null, subscription_year ?? null, notes ?? null, id]
    );
    return Subscriber.findById(id);
  }

  static async softDelete(id, deletedBy) {
    await pool.execute(
      "UPDATE subscribers SET status = 'deleted', deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id = ? AND status != 'deleted'",
      [deletedBy, id]
    );
    return Subscriber.findById(id);
  }

  static async restore(id) {
    await pool.execute(
      "UPDATE subscribers SET status = 'active', deleted_at = NULL, deleted_by = NULL WHERE id = ? AND status = 'deleted'",
      [id]
    );
    return Subscriber.findById(id);
  }

  static async hardDelete(id) {
    const [result] = await pool.execute('DELETE FROM subscribers WHERE id = ?', [id]);
    return result.affectedRows > 0 ? { id } : null;
  }

  static async getStats() {
    const [rows] = await pool.execute(`
      SELECT
        SUM(status = 'active') AS active_count,
        SUM(status = 'deleted') AS deleted_count,
        SUM(status = 'pending') AS pending_count,
        COUNT(DISTINCT subscription_year) AS total_years,
        MAX(subscription_year) AS latest_year,
        SUM(created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) AS last_30_days
      FROM subscribers
    `);
    return rows[0];
  }

  static async getByYear(year) {
    const [rows] = await pool.execute(
      "SELECT * FROM subscribers WHERE subscription_year = ? AND status = 'active' ORDER BY created_at DESC",
      [year]
    );
    return rows;
  }
}

module.exports = Subscriber;
