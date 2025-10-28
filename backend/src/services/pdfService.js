const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class PDFService {
  constructor() {
    // In Docker: __dirname = /app/src/services, so ../.. = /app
    // In local dev: __dirname = /path/to/backend/src/services, so ../.. = /path/to/backend
    // Then we add /pdf/tessera_ekidna.pdf to get to the template
    this.templatePath = path.join(__dirname, '../..', 'pdf', 'tessera_ekidna.pdf');
  }

  async generateMembershipCard(subscriberData) {
    try {
      const { name, serialNumber, year } = subscriberData;

      if (!name || !serialNumber || !year) {
        throw new Error('Missing required data: name, serialNumber, and year are required');
      }

      const templateBytes = await fs.readFile(this.templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const cursiveFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

      const textColor = rgb(0, 0, 0);

      const POSITIONS = {
        year: { x: 25.0, y: 132.3, fontSize: 8.0 },
        number: { x: 60.0, y: 132.3, fontSize: 8.0 },
        firstName: { x: 32.0, y: 45, fontSize: 12.0 },
        lastName: { x: 102.0, y: 45, fontSize: 12.0 }
      };

      firstPage.drawText(String(year), {
        x: POSITIONS.year.x,
        y: POSITIONS.year.y,
        size: POSITIONS.year.fontSize,
        font: regularFont,
        color: textColor,
      });

      const numberText = `N. ${String(serialNumber).padStart(5, '0')}`;
      firstPage.drawText(numberText, {
        x: POSITIONS.number.x,
        y: POSITIONS.number.y,
        size: POSITIONS.number.fontSize,
        font: regularFont,
        color: textColor,
      });

      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      if (firstName) {
        firstPage.drawText(firstName, {
          x: POSITIONS.firstName.x,
          y: POSITIONS.firstName.y,
          size: POSITIONS.firstName.fontSize,
          font: cursiveFont,
          color: textColor,
        });
      }

      if (lastName) {
        firstPage.drawText(lastName, {
          x: POSITIONS.lastName.x,
          y: POSITIONS.lastName.y,
          size: POSITIONS.lastName.fontSize,
          font: cursiveFont,
          color: textColor,
        });
      }

      const pdfBytes = await pdfDoc.save();

      console.log(`[PDFService] Generated membership card for ${name} (Serial: ${serialNumber}, Year: ${year})`);

      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('[PDFService] Error generating membership card:', error);
      throw new Error(`Failed to generate membership card: ${error.message}`);
    }
  }

  async templateExists() {
    try {
      await fs.access(this.templatePath);
      return true;
    } catch {
      return false;
    }
  }

  getTemplatePath() {
    return this.templatePath;
  }
}

const pdfService = new PDFService();
module.exports = pdfService;