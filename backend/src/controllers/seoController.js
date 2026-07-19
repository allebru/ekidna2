const PageSeo = require('../models/PageSeo');
const ssrCache = require('../services/ssrCache');

// GET /api/seo — all pages (public, used by SSR + website)
exports.getAll = async (req, res, next) => {
  try {
    const data = await PageSeo.getAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/seo/:page — update meta title/description/og_image (auth required)
exports.updatePage = async (req, res, next) => {
  try {
    const { page } = req.params;
    const { meta_title, meta_description, og_image } = req.body;
    if (!meta_title || !meta_description) {
      return res.status(400).json({ success: false, error: 'Titolo e descrizione sono obbligatori' });
    }
    const updated = await PageSeo.updatePage(page, { meta_title, meta_description, og_image });
    ssrCache.invalidateAll();
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
