#!/usr/bin/env node
/**
 * SMTP Connection Test Script
 *
 * This script tests the SMTP connection independently to diagnose authentication issues.
 *
 * Usage: node test-smtp.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('='.repeat(60));
console.log('SMTP CONNECTION TEST');
console.log('='.repeat(60));
console.log();

// Display configuration (hiding password)
console.log('📧 Configuration:');
console.log('  Host:', process.env.EMAIL_HOST || 'NOT SET');
console.log('  Port:', process.env.EMAIL_PORT || 'NOT SET');
console.log('  User:', process.env.EMAIL_USER || 'NOT SET');
console.log('  Pass:', process.env.EMAIL_PASSWORD ? `${process.env.EMAIL_PASSWORD.substring(0, 10)}...` : 'NOT SET');
console.log('  From:', process.env.EMAIL_FROM || 'NOT SET');
console.log();

// Check if all required variables are set
if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ ERROR: Missing required environment variables!');
  console.error('   Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in your .env file');
  process.exit(1);
}

// Create transporter with detailed logging
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  debug: true, // Enable debug output
  logger: true  // Log to console
});

console.log('🔍 Testing SMTP connection...');
console.log();

// Test the connection
transporter.verify()
  .then(() => {
    console.log();
    console.log('='.repeat(60));
    console.log('✅ SUCCESS! SMTP connection is working correctly!');
    console.log('='.repeat(60));
    console.log();
    console.log('Your email configuration is valid and ready to use.');
    console.log();
    process.exit(0);
  })
  .catch((error) => {
    console.log();
    console.log('='.repeat(60));
    console.log('❌ SMTP CONNECTION FAILED');
    console.log('='.repeat(60));
    console.log();
    console.log('Error Details:');
    console.log('  Code:', error.code || 'UNKNOWN');
    console.log('  Message:', error.message);
    console.log('  Response:', error.response || 'N/A');
    console.log('  Response Code:', error.responseCode || 'N/A');
    console.log();

    // Provide specific troubleshooting advice
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.log('🔧 TROUBLESHOOTING: Authentication Failed');
      console.log('-'.repeat(60));
      console.log();
      console.log('This error means your credentials are incorrect. Here\'s what to check:');
      console.log();
      console.log('For Brevo (formerly Sendinblue):');
      console.log('  1. Log in to your Brevo account');
      console.log('  2. Go to: https://app.brevo.com/settings/keys/smtp');
      console.log('  3. Generate a NEW SMTP key if needed');
      console.log('  4. Copy the ENTIRE key (starts with "xsmtpsib-")');
      console.log('  5. Update EMAIL_PASSWORD in your .env file');
      console.log();
      console.log('Common mistakes:');
      console.log('  ✗ Using your account password instead of SMTP key');
      console.log('  ✗ Using an expired or revoked SMTP key');
      console.log('  ✗ Copying the key incorrectly (missing characters)');
      console.log('  ✗ Using the wrong email address for EMAIL_USER');
      console.log();
      console.log('Important notes:');
      console.log('  • EMAIL_USER should be your Brevo account email');
      console.log('  • EMAIL_PASSWORD should be the SMTP key (not account password)');
      console.log('  • The sender email (EMAIL_FROM) must be verified in Brevo');
      console.log();
    } else if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      console.log('🔧 TROUBLESHOOTING: Connection Failed');
      console.log('-'.repeat(60));
      console.log();
      console.log('Check the following:');
      console.log('  • Is EMAIL_HOST correct? (should be: smtp-relay.brevo.com)');
      console.log('  • Is EMAIL_PORT correct? (should be: 587)');
      console.log('  • Is your internet connection working?');
      console.log('  • Is there a firewall blocking port 587?');
      console.log();
    }

    console.log('='.repeat(60));
    console.log();
    process.exit(1);
  });
