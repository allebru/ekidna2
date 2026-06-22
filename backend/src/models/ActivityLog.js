const pool = require('../config/database');

class ActivityLog {
  static async create(data) {
    const { staff_user_id, subscriber_id, action, details, ip_address } = data;
    await pool.execute(
      'INSERT INTO activity_logs (staff_user_id, subscriber_id, action, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      [staff_user_id, subscriber_id || null, action, details ? JSON.stringify(details) : null, ip_address || null]
    );
  }

  static async findAll(filters = {}) {
    const { page = 1, limit = 50, subscriber_id, staff_user_id } = filters;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = 'WHERE 1=1';
    const params = [];

    if (subscriber_id) { where += ' AND al.subscriber_id = ?'; params.push(subscriber_id); }
    if (staff_user_id) { where += ' AND al.staff_user_id = ?'; params.push(staff_user_id); }

    const baseQuery = `
      SELECT al.*, su.name AS staff_user_name, su.email AS staff_user_email, s.name AS subscriber_name
      FROM activity_logs al
      LEFT JOIN staff_users su ON al.staff_user_id = su.id
      LEFT JOIN subscribers s ON al.subscriber_id = s.id
      ${where}
    `;

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM activity_logs al LEFT JOIN staff_users su ON al.staff_user_id = su.id LEFT JOIN subscribers s ON al.subscriber_id = s.id ${where}`,
      params
    );
    const total = parseInt(countRows[0].total);

    const [rows] = await pool.execute(
      `${baseQuery} ORDER BY al.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    return {
      data: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
    };
  }

  static async getBySubscriber(subscriberId, limit = 20) {
    const [rows] = await pool.execute(
      `SELECT al.*, su.name AS staff_user_name, su.email AS staff_user_email
       FROM activity_logs al
       LEFT JOIN staff_users su ON al.staff_user_id = su.id
       WHERE al.subscriber_id = ?
       ORDER BY al.created_at DESC LIMIT ?`,
      [subscriberId, limit]
    );
    return rows;
  }
}

module.exports = ActivityLog;
