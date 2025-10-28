#!/usr/bin/env node
/**
 * Test Email Attachment Script
 *
 * This script tests sending an email with a PDF attachment using the email service.
 * It helps diagnose issues with PDF attachments not being sent.
 *
 * Usage: node test-email-attachment.js <email-address>
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

// Import services
const emailService = require('./src/services/emailService');
const pdfService = require('./src/services/pdfService');

async function testEmailWithAttachment() {
  const testEmail = process.argv[2];

  if (!testEmail) {
    console.error('❌ Error: Please provide an email address');
    console.log('Usage: node test-email-attachment.js <email-address>');
    process.exit(1);
  }

  console.log('='.repeat(70));
  console.log('EMAIL ATTACHMENT TEST');
  console.log('='.repeat(70));
  console.log();
  console.log('Test email address:', testEmail);
  console.log();

  try {
    // Initialize email service
    console.log('Step 1: Initializing email service...');
    const initialized = await emailService.initialize();

    if (!initialized) {
      console.error('❌ Email service failed to initialize');
      console.log('Please check your email configuration in .env file');
      process.exit(1);
    }
    console.log('✅ Email service initialized');
    console.log();

    // Generate test PDF
    console.log('Step 2: Generating test membership card PDF...');
    const testSubscriber = {
      name: 'Test User',
      serialNumber: 99999,
      year: new Date().getFullYear()
    };

    const pdfBuffer = await pdfService.generateMembershipCard(testSubscriber);
    console.log('✅ PDF generated successfully');
    console.log('   - Size:', pdfBuffer.length, 'bytes');
    console.log('   - Size (MB):', (pdfBuffer.length / 1024 / 1024).toFixed(2), 'MB');
    console.log('   - Is Buffer:', Buffer.isBuffer(pdfBuffer));
    console.log();

    // Prepare attachment
    console.log('Step 3: Preparing attachment...');
    const filename = `Test_Tessera_${testSubscriber.year}_${String(testSubscriber.serialNumber).padStart(5, '0')}.pdf`;
    const attachments = [{
      filename: filename,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }];
    console.log('✅ Attachment prepared:', filename);
    console.log();

    // Send email
    console.log('Step 4: Sending test email...');
    console.log('-'.repeat(70));
    const result = await emailService.sendSubscriptionConfirmation({
      id: 'test-id',
      name: testSubscriber.name,
      email: testEmail,
      subscription_year: testSubscriber.year,
      serial_number: testSubscriber.serialNumber
    }, attachments);

    console.log('-'.repeat(70));
    console.log();

    if (result.success) {
      console.log('='.repeat(70));
      console.log('✅ SUCCESS! Test email sent with attachment');
      console.log('='.repeat(70));
      console.log();
      console.log('Message ID:', result.messageId);
      console.log();
      console.log('Please check the email at:', testEmail);
      console.log('The email should have a PDF attachment named:', filename);
      console.log();
      console.log('If the attachment is missing, review the logs above to see where it failed.');
      console.log();
    } else {
      console.log('='.repeat(70));
      console.log('❌ FAILED: Email sending failed');
      console.log('='.repeat(70));
      console.log();
      console.log('Error:', result.message);
      console.log();
      console.log('Please review the logs above for details.');
      console.log();
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testEmailWithAttachment();
