#!/usr/bin/env node

/**
 * Test script for PDF membership card generation
 * Tests the pdfService without needing a database connection
 */

const fs = require('fs').promises;
const path = require('path');
const pdfService = require('./src/services/pdfService');

async function testPdfGeneration() {
  console.log('🧪 Testing PDF Membership Card Generation');
  console.log('==========================================\n');

  try {
    // Test 1: Check if template exists
    console.log('1️⃣  Checking template file...');
    const templateExists = await pdfService.templateExists();
    if (!templateExists) {
      console.error('❌ Template file not found:', pdfService.getTemplatePath());
      console.log('   Please ensure pdf/tessera_ekidna.pdf exists');
      process.exit(1);
    }
    console.log('✅ Template file found:', pdfService.getTemplatePath());
    console.log();

    // Test 2: Generate sample membership card
    console.log('2️⃣  Generating sample membership card...');
    const testData = {
      name: 'Marco Rossi',
      serialNumber: 123,
      year: 2025
    };

    console.log('   Test data:', testData);

    const pdfBuffer = await pdfService.generateMembershipCard(testData);

    console.log('✅ PDF generated successfully!');
    console.log('   Size:', (pdfBuffer.length / 1024).toFixed(2), 'KB');
    console.log();

    // Test 3: Save test PDF
    console.log('3️⃣  Saving test PDF...');
    const outputPath = path.join(__dirname, 'test_tessera_output.pdf');
    await fs.writeFile(outputPath, pdfBuffer);
    console.log('✅ Test PDF saved:', outputPath);
    console.log('   You can open this file to verify the output');
    console.log();

    // Test 4: Generate another card with different data
    console.log('4️⃣  Generating card with different data...');
    const testData2 = {
      name: 'Giulia Bianchi',
      serialNumber: 1,
      year: 2024
    };

    console.log('   Test data:', testData2);

    const pdfBuffer2 = await pdfService.generateMembershipCard(testData2);
    const outputPath2 = path.join(__dirname, 'test_tessera_output_2.pdf');
    await fs.writeFile(outputPath2, pdfBuffer2);

    console.log('✅ Second PDF generated and saved:', outputPath2);
    console.log();

    // Test 5: Test with long name
    console.log('5️⃣  Testing with long name...');
    const testData3 = {
      name: 'Alessandro De Benedictis Della Montagna',
      serialNumber: 9999,
      year: 2025
    };

    console.log('   Test data:', testData3);

    const pdfBuffer3 = await pdfService.generateMembershipCard(testData3);
    const outputPath3 = path.join(__dirname, 'test_tessera_output_3.pdf');
    await fs.writeFile(outputPath3, pdfBuffer3);

    console.log('✅ Long name PDF generated:', outputPath3);
    console.log();

    // Summary
    console.log('🎉 All tests passed!');
    console.log();
    console.log('📋 Test files created:');
    console.log('   -', outputPath);
    console.log('   -', outputPath2);
    console.log('   -', outputPath3);
    console.log();
    console.log('👉 Please review these PDFs to verify:');
    console.log('   ✓ Text is visible and readable');
    console.log('   ✓ Text is in cursive/italic style');
    console.log('   ✓ Year and serial number are in the top zone');
    console.log('   ✓ Name is in the bottom zone');
    console.log('   ✓ Text is properly centered');
    console.log('   ✓ Text color is black');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error();
    console.error('Stack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
testPdfGeneration();
