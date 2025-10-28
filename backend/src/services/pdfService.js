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

      // Embed font - using Helvetica Oblique (italic) as cursive alternative
      // Note: pdf-lib standard fonts don't include true cursive fonts
      // For actual cursive fonts, you would need to embed a custom TTF font
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      // Text color: black
      const textColor = rgb(0, 0, 0);

      // TOP ZONE: Year and Serial Number
      // Format: "2025 - N. 00123"
      const topText = `${year} - N. ${String(serialNumber).padStart(5, '0')}`;
      const topFontSize = 16;
      const topTextWidth = font.widthOfTextAtSize(topText, topFontSize);

      // Position for top zone (centered in the smaller blank area at top)
      const topX = (width - topTextWidth) / 2;
      const topY = height - 145; // Adjusted based on template layout

      firstPage.drawText(topText, {
        x: topX,
        y: topY,
        size: topFontSize,
        font: font,
        color: textColor,
      });

      // BOTTOM ZONE: Name and Surname
      // Format: "NOME COGNOME"
      const bottomText = name.toUpperCase();
      const bottomFontSize = 22;
      const bottomTextWidth = font.widthOfTextAtSize(bottomText, bottomFontSize);

      // Position for bottom zone (centered in the larger blank area at bottom)
      const bottomX = (width - bottomTextWidth) / 2;
      const bottomY = height - 600; // Adjusted based on template layout

      firstPage.drawText(bottomText, {
        x: bottomX,
        y: bottomY,
        size: bottomFontSize,
        font: font,
        color: textColor,
      });

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
