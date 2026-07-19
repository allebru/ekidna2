const SiteContent = require('../models/SiteContent');

// GET /api/content — all pages (public, used by website)
exports.getAll = async (req, res, next) => {
  try {
    const pages = ['home', 'chi_siamo', 'eventi', 'galleria', 'dove_siamo', 'contatti'];
    const content = {};
    for (const page of pages) {
      content[page] = await SiteContent.getPage(page);
    }
    res.json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
};

// GET /api/content/meta — full metadata (dashboard only, auth required)
exports.getMeta = async (req, res, next) => {
  try {
    const data = await SiteContent.getAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/content/:page — update fields for a page (auth required)
exports.updatePage = async (req, res, next) => {
  try {
    const { page } = req.params;
    const allowed = ['home', 'chi_siamo', 'eventi', 'galleria', 'dove_siamo', 'contatti'];
    if (!allowed.includes(page)) {
      return res.status(400).json({ success: false, error: 'Pagina non valida' });
    }
    await SiteContent.updatePage(page, req.body);
    const updated = await SiteContent.getPage(page);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
