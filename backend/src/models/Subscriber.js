const pool = require('../config/database');

class Subscriber {
  // Create a new subscriber
  static async create(data) {
    const { name, email, phone, address, subscription_year, notes } = data;

    const result = await pool.query(
      `INSERT INTO subscribers (name, email, phone, address, subscription_year, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, email || null, phone || null, address || null, subscription_year, notes || null, 'active']
    );

    return result.rows[0];
  }

  // Get all subscribers with pagination and filters
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 50,
      status = 'active',
      subscription_year,
      search
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT *
      FROM subscribers
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filter by status
    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    // Filter by subscription year
    if (subscription_year) {
      query += ` AND subscription_year = $${paramCount}`;
      params.push(subscription_year);
      paramCount++;
    }

    // Search by name or email
    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Get total count
    const countResult = await pool.query(
      query.replace('SELECT *', 'SELECT COUNT(*) as total'),
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
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

  // Get subscriber by ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM subscribers WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  // Get subscriber by email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM subscribers WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  // Update subscriber
  static async update(id, data) {
    const { name, email, phone, address, subscription_year, notes } = data;

    const result = await pool.query(
      `UPDATE subscribers
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address),
           subscription_year = COALESCE($5, subscription_year),
           notes = COALESCE($6, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND status != 'deleted'
       RETURNING *`,
      [name, email, phone, address, subscription_year, notes, id]
    );

    return result.rows[0] || null;
  }

  // Soft delete subscriber
  static async softDelete(id, deletedBy) {
    const result = await pool.query(
      `UPDATE subscribers
       SET status = 'deleted',
           deleted_at = CURRENT_TIMESTAMP,
           deleted_by = $1
       WHERE id = $2 AND status != 'deleted'
       RETURNING *`,
      [deletedBy, id]
    );

    return result.rows[0] || null;
  }

  // Restore deleted subscriber
  static async restore(id) {
    const result = await pool.query(
      `UPDATE subscribers
       SET status = 'active',
           deleted_at = NULL,
           deleted_by = NULL
       WHERE id = $1 AND status = 'deleted'
       RETURNING *`,
      [id]
    );

    return result.rows[0] || null;
  }

  // Hard delete subscriber (permanent)
  static async hardDelete(id) {
    const result = await pool.query(
      'DELETE FROM subscribers WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows[0] || null;
  }

  // Get statistics
  static async getStats() {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'active') as active_count,
        COUNT(*) FILTER (WHERE status = 'deleted') as deleted_count,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(DISTINCT subscription_year) as total_years,
        MAX(subscription_year) as latest_year,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as last_30_days
      FROM subscribers
    `);

    return result.rows[0];
  }

  // Get subscribers by year
  static async getByYear(year) {
    const result = await pool.query(
      `SELECT * FROM subscribers
       WHERE subscription_year = $1 AND status = 'active'
       ORDER BY created_at DESC`,
      [year]
    );

    return result.rows;
  }
}

module.exports = Subscriber;
