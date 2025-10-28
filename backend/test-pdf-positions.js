/**
 * Test script to help find correct positioning for PDF text
 * Run: node test-pdf-positions.js [topY] [bottomY]
 * Example: node test-pdf-positions.js 145 600
 */

const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function testPositions(topY, bottomY) {
  try {
    const templatePath = path.join(__dirname, '..', 'pdf', 'tessera_ekidna.pdf');

    // Load template
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    console.log(`📄 PDF dimensions: ${width} x ${height}`);
    console.log(`📍 Testing positions:`);
    console.log(`   Top Y: ${height} - ${topY} = ${height - topY}`);
    console.log(`   Bottom Y: ${height} - ${bottomY} = ${height - bottomY}`);

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const textColor = rgb(0, 0, 0);

    // Top text: Year and Serial
    const topText = `2025 - N. 99999`;
    const topFontSize = 16;
    const topTextWidth = font.widthOfTextAtSize(topText, topFontSize);
    const topX = (width - topTextWidth) / 2;
    const calculatedTopY = height - topY;

    firstPage.drawText(topText, {
      x: topX,
      y: calculatedTopY,
      size: topFontSize,
      font: font,
      color: textColor,
    });

    // Bottom text: Name
    const bottomText = 'NOME COGNOME';
    const bottomFontSize = 22;
    const bottomTextWidth = font.widthOfTextAtSize(bottomText, bottomFontSize);
    const bottomX = (width - bottomTextWidth) / 2;
    const calculatedBottomY = height - bottomY;

    firstPage.drawText(bottomText, {
      x: bottomX,
      y: calculatedBottomY,
      size: bottomFontSize,
      font: font,
      color: textColor,
    });

    // Save to test file
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, 'test_tessera_positions.pdf');
    await fs.writeFile(outputPath, pdfBytes);

    console.log(`✅ Test PDF generated: ${outputPath}`);
    console.log(`   Open this file to check if positioning is correct`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get positions from command line or use defaults
const topY = parseInt(process.argv[2]) || 145;
const bottomY = parseInt(process.argv[3]) || 600;

testPositions(topY, bottomY);
