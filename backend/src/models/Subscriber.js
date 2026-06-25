const pool = require('../config/database');

class Subscriber {
  // Aggiunge un campo "name" composto (per email/admin) mantenendo le colonne reali
  static withName(row) {
    if (row && (row.name == null || row.name === '')) {
      row.name = `${row.first_name || ''} ${row.last_name || ''}`.trim();
    }
    return row;
  }

  // Ricava first_name/last_name da campi separati o da un "name" combinato
  static splitName(data) {
    let first = (data.first_name || '').trim();
    let last = (data.last_name || '').trim();
    if (!first && data.name) {
      const t = String(data.name).trim();
      const i = t.indexOf(' ');
      first = i === -1 ? t : t.slice(0, i);
      if (!last) last = i === -1 ? '' : t.slice(i + 1).trim();
    }
    return { first_name: first, last_name: last };
  }

  static async create(data) {
    const { email, phone, birth_date, address, city, province, postal_code, subscription_year, notes } = data;
    const { first_name, last_name } = Subscriber.splitName(data);
    const [result] = await pool.execute(
      `INSERT INTO subscribers
        (first_name, last_name, email, phone, birth_date, address, city, province, postal_code, subscription_year, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name, last_name,
        email || null, phone || null, birth_date || null,
        address || null, city || null, province || null, postal_code || null,
        subscription_year, notes || null, 'active',
      ]
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
      data: rows.map((r) => Subscriber.withName(r)),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM subscribers WHERE id = ?', [id]);
    return rows[0] ? Subscriber.withName(rows[0]) : null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM subscribers WHERE email = ?', [email]);
    return rows[0] ? Subscriber.withName(rows[0]) : null;
  }

  static async update(id, data) {
    const { email, phone, birth_date, address, city, province, postal_code, subscription_year, notes } = data;
    const sn = Subscriber.splitName(data);
    const first_name = sn.first_name || null;
    const last_name = sn.last_name || null;
    await pool.execute(
      `UPDATE subscribers SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        birth_date = COALESCE(?, birth_date),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        province = COALESCE(?, province),
        postal_code = COALESCE(?, postal_code),
        subscription_year = COALESCE(?, subscription_year),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status != 'deleted'`,
      [first_name, last_name, email ?? null, phone ?? null, birth_date ?? null, address ?? null, city ?? null, province ?? null, postal_code ?? null, subscription_year ?? null, notes ?? null, id]
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
    return rows.map((r) => Subscriber.withName(r));
  }
}

module.exports = Subscriber;
