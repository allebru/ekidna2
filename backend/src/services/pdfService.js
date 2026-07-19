const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const ASSETS_DIR = path.join(__dirname, '../../assets');
const TMP_DIR = path.join(__dirname, '../../tmp');

const TEMPLATE_PATH = path.join(ASSETS_DIR, 'TESSERA_ONLINE.pdf');
const CARD_FONT_PATH = path.join(ASSETS_DIR, 'BethEllen-Regular.ttf');

function ensureTmpDir() {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

/**
 * Generate the membership card PDF for a subscriber.
 *
 * Replicates OLD_PROJECT/tools.py make_card():
 *   can.setFontSize(8)
 *   can.drawString(25, 131, year)      ← left of "n."
 *   can.drawString(75, 131, card_n)    ← right of "n."
 *   can.setFont("CardFont", 12)
 *   can.drawString(35, 45, name)       ← name box
 *
 * Template page: 246.72 × 161.52 pt (landscape, origin bottom-left).
 *
 * @param {Object} p
 * @param {string|number} p.cardNumber  card number string e.g. "O00001"
 * @param {string} p.name              full name to print
 * @param {number} [p.year]            subscription year (default: current)
 * @returns {Promise<string>} absolute path to the generated PDF
 */
async function generateTessera({ cardNumber, name, year }) {
  ensureTmpDir();

  const subscriptionYear = String(year || new Date().getFullYear());
  const filePath = path.join(TMP_DIR, `TESSERA_ONLINE_${cardNumber}.pdf`);

  // Load template
  const templateBytes = fs.readFileSync(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);

  // Register fontkit so we can embed custom TTF fonts
  pdfDoc.registerFontkit(fontkit);

  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const cardFontBytes = fs.readFileSync(CARD_FONT_PATH);
  const cardFont = await pdfDoc.embedFont(cardFontBytes);

  const page = pdfDoc.getPages()[0];
  const { height } = page.getSize();

  // Helper: convert reportlab y (from bottom) → pdf-lib y (from bottom — same!)
  // pdf-lib uses the same bottom-left origin as reportlab, so no conversion needed.
  const y = (rlY) => rlY;

  // Year (left of "n.") — Helvetica 8pt, black
  page.drawText(subscriptionYear, {
    x: 25,
    y: y(131),
    size: 8,
    font: helvetica,
    color: rgb(0, 0, 0),
  });

  // Card number (right of "n.") — Helvetica 8pt, black
  page.drawText(String(cardNumber), {
    x: 75,
    y: y(131),
    size: 8,
    font: helvetica,
    color: rgb(0, 0, 0),
  });

  // Name — BethEllen 12pt, black
  page.drawText(name || '', {
    x: 35,
    y: y(45),
    size: 12,
    font: cardFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}

module.exports = { generateTessera, TMP_DIR };
