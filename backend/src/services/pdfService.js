/**
 * PDF Service
 * Handles membership card (tessera) generation by filling template PDF
 */

const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class PDFService {
  constructor() {
    this.templatePath = path.join(__dirname, '../../..', 'pdf', 'tessera_ekidna.pdf');
  }

  /**
   * Generate membership card PDF with subscriber information
   * @param {Object} subscriberData - Subscriber information
   * @param {string} subscriberData.name - Full name of subscriber
   * @param {number} subscriberData.serialNumber - Sequential subscription number
   * @param {number} subscriberData.year - Subscription year
   * @returns {Promise<Buffer>} PDF file as buffer
   */
  async generateMembershipCard(subscriberData) {
    try {
      const { name, serialNumber, year } = subscriberData;

      // Validate input data
      if (!name || !serialNumber || !year) {
        throw new Error('Missing required data: name, serialNumber, and year are required');
      }

      // Load the template PDF
      const templateBytes = await fs.readFile(this.templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);

      // Get the first page
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Embed fonts
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      // Using TimesRomanItalic for a more elegant/cursive look for names
      const cursiveFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

      // Text color: black
      const textColor = rgb(0, 0, 0);

      // PDF positioning coordinates (from bottom-left origin)
      // Coordinates extracted from tessera_compilata.pdf
      const POSITIONS = {
        year: { x: 25.0, y: 24.776, fontSize: 7.4 },
        number: { x: 75.0, y: 24.776, fontSize: 7.4 },
        firstName: { x: 35.0, y: 97.020, fontSize: 26.64 },
        lastName: { x: 96.218, y: 97.020, fontSize: 26.64 }
      };

      // BOTTOM ZONE: Year and Membership Number
      // Year text (e.g., "2025")
      firstPage.drawText(String(year), {
        x: POSITIONS.year.x,
        y: POSITIONS.year.y,
        size: POSITIONS.year.fontSize,
        font: regularFont,
        color: textColor,
      });

      // Membership number (e.g., "N. 00123")
      const numberText = `N. ${String(serialNumber).padStart(5, '0')}`;
      firstPage.drawText(numberText, {
        x: POSITIONS.number.x,
        y: POSITIONS.number.y,
        size: POSITIONS.number.fontSize,
        font: regularFont,
        color: textColor,
      });

      // MIDDLE ZONE: Name and Surname (in cursive style)
      // Split the full name into first and last name
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // First name
      if (firstName) {
        firstPage.drawText(firstName, {
          x: POSITIONS.firstName.x,
          y: POSITIONS.firstName.y,
          size: POSITIONS.firstName.fontSize,
          font: cursiveFont,
          color: textColor,
        });
      }

      // Last name
      if (lastName) {
        firstPage.drawText(lastName, {
          x: POSITIONS.lastName.x,
          y: POSITIONS.lastName.y,
          size: POSITIONS.lastName.fontSize,
          font: cursiveFont,
          color: textColor,
        });
      }

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();

      console.log(`[PDFService] Generated membership card for ${name} (Serial: ${serialNumber}, Year: ${year})`);

      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('[PDFService] Error generating membership card:', error);
      throw new Error(`Failed to generate membership card: ${error.message}`);
    }
  }

  /**
   * Check if template file exists
   * @returns {Promise<boolean>}
   */
  async templateExists() {
    try {
      await fs.access(this.templatePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get template file path
   * @returns {string}
   */
  getTemplatePath() {
    return this.templatePath;
  }
}

// Export singleton instance
const pdfService = new PDFService();
module.exports = pdfService;
