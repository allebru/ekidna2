const pool = require('../config/database');

class PageSeo {
  // All pages, as { page: { meta_title, meta_description, og_image } }
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT page, meta_title, meta_description, og_image FROM page_seo'
    );
    return Object.fromEntries(rows.map(r => [r.page, {
      meta_title: r.meta_title,
      meta_description: r.meta_description,
      og_image: r.og_image,
    }]));
  }

  static async getPage(page) {
    const [rows] = await pool.query(
      'SELECT page, meta_title, meta_description, og_image FROM page_seo WHERE page = ?',
      [page]
    );
    return rows[0] ?? null;
  }

  static async updatePage(page, { meta_title, meta_description, og_image }) {
    await pool.query(
      `INSERT INTO page_seo (page, meta_title, meta_description, og_image)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         meta_title = VALUES(meta_title),
         meta_description = VALUES(meta_description),
         og_image = VALUES(og_image),
         updated_at = NOW()`,
      [page, meta_title, meta_description, og_image ?? null]
    );
    return PageSeo.getPage(page);
  }
}

module.exports = PageSeo;
