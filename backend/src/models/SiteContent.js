const pool = require('../config/database');

class SiteContent {
  // Get all content for a page as { key: value } map
  static async getPage(page) {
    const [rows] = await pool.query(
      'SELECT section_key, value FROM site_content WHERE page = ? ORDER BY sort_order',
      [page]
    );
    return Object.fromEntries(rows.map(r => [r.section_key, r.value]));
  }

  // Get all pages with metadata (for dashboard)
  static async getAll() {
    const [rows] = await pool.query(
      `SELECT page, section_key, content_type, label, value, sort_order
       FROM site_content ORDER BY page, sort_order`
    );
    const result = {};
    for (const r of rows) {
      if (!result[r.page]) result[r.page] = {};
      result[r.page][r.section_key] = {
        content_type: r.content_type,
        label: r.label,
        value: r.value,
        sort_order: r.sort_order,
      };
    }
    return result;
  }

  // Upsert multiple fields for a page
  static async updatePage(page, fields) {
    for (const [key, value] of Object.entries(fields)) {
      await pool.query(
        `UPDATE site_content SET value = ?, updated_at = NOW()
         WHERE page = ? AND section_key = ?`,
        [value, page, key]
      );
    }
  }

  // Seed default content (only inserts missing rows)
  static async seedDefaults(defaults) {
    for (const row of defaults) {
      await pool.query(
        `INSERT IGNORE INTO site_content
           (page, section_key, content_type, label, value, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [row.page, row.key, row.type, row.label, row.value, row.order ?? 0]
      );
    }
  }
}

module.exports = SiteContent;
