const pool = require('../config/database');

class ActivityLog {
  // Create activity log entry
  static async create(data) {
    const { staff_user_id, subscriber_id, action, details, ip_address } = data;

    const result = await pool.query(
      `INSERT INTO activity_logs (staff_user_id, subscriber_id, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [staff_user_id, subscriber_id || null, action, JSON.stringify(details) || null, ip_address || null]
    );

    return result.rows[0];
  }

  // Get logs with pagination
  static async findAll(filters = {}) {
    const { page = 1, limit = 50, subscriber_id, staff_user_id } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        al.*,
        su.name as staff_user_name,
        su.email as staff_user_email,
        s.name as subscriber_name
      FROM activity_logs al
      LEFT JOIN staff_users su ON al.staff_user_id = su.id
      LEFT JOIN subscribers s ON al.subscriber_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (subscriber_id) {
      query += ` AND al.subscriber_id = $${paramCount}`;
      params.push(subscriber_id);
      paramCount++;
    }

    if (staff_user_id) {
      query += ` AND al.staff_user_id = $${paramCount}`;
      params.push(staff_user_id);
      paramCount++;
    }

    // Get total count
    const countResult = await pool.query(
      query.replace('SELECT al.*, su.name as staff_user_name, su.email as staff_user_email, s.name as subscriber_name', 'SELECT COUNT(*) as total'),
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` ORDER BY al.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get logs for a specific subscriber
  static async getBySubscriber(subscriberId, limit = 20) {
    const result = await pool.query(
      `SELECT
        al.*,
        su.name as staff_user_name,
        su.email as staff_user_email
      FROM activity_logs al
      LEFT JOIN staff_users su ON al.staff_user_id = su.id
      WHERE al.subscriber_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2`,
      [subscriberId, limit]
    );

    return result.rows;
  }
}

module.exports = ActivityLog;
