#!/usr/bin/env node
/**
 * Brevo HTTP API Test Script
 *
 * This script tests the Brevo HTTP API connection to diagnose email issues.
 * Use this when SMTP is blocked by firewall/proxy.
 *
 * Usage: node test-brevo-api.js
 */

const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Determine .env file location
const envPath = path.join(__dirname, '..', '.env');

console.log('='.repeat(60));
console.log('BREVO HTTP API CONNECTION TEST');
console.log('='.repeat(60));
console.log();
console.log('🔍 Debug Information:');
console.log('  Current directory (__dirname):', __dirname);
console.log('  Looking for .env at:', envPath);
console.log('  .env file exists:', fs.existsSync(envPath));
console.log();

// Load .env from parent directory (project root)
const result = require('dotenv').config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error.message);
  console.log();
  console.log('💡 Troubleshooting:');
  console.log('  1. Make sure you have a .env file in the project root');
  console.log('  2. The .env file should be at:', envPath);
  console.log('  3. Try creating it by copying .env.example:');
  console.log('     cp .env.example .env');
  console.log();
  process.exit(1);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('  Variables loaded:', Object.keys(result.parsed || {}).length);
  console.log('  BREVO_API_KEY found:', !!result.parsed?.BREVO_API_KEY);
  console.log();
}

console.log('='.repeat(60));
console.log('BREVO HTTP API TEST');
console.log('='.repeat(60));
console.log();

// Display configuration (hiding API key)
console.log('📧 Configuration:');
console.log('  API Key:', process.env.BREVO_API_KEY ? `${process.env.BREVO_API_KEY.substring(0, 15)}...` : 'NOT SET');
console.log('  From:', process.env.EMAIL_FROM || 'NOT SET');
console.log();

// Check if API key is set
if (!process.env.BREVO_API_KEY) {
  console.error('❌ ERROR: BREVO_API_KEY not set in .env file!');
  console.log();
  console.log('📋 How to get your Brevo API key:');
  console.log('  1. Log in to your Brevo account');
  console.log('  2. Go to: https://app.brevo.com/settings/keys/api');
  console.log('  3. Click "Generate a new API key" or "Create a new API key"');
  console.log('  4. Give it a name (e.g., "Ekidna Production")');
  console.log('  5. Copy the entire key');
  console.log('  6. Add to your .env file:');
  console.log('     BREVO_API_KEY=your-api-key-here');
  console.log();
  process.exit(1);
}

// Test the API connection
async function testBrevoAPI() {
  try {
    console.log('🔍 Testing Brevo HTTP API connection...');
    console.log('  Endpoint: https://api.brevo.com/v3/account');
    console.log();

    const response = await axios.get('https://api.brevo.com/v3/account', {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log();
    console.log('='.repeat(60));
    console.log('✅ SUCCESS! Brevo HTTP API connection is working!');
    console.log('='.repeat(60));
    console.log();
    console.log('📊 Account Information:');
    console.log('  Email:', response.data.email);
    console.log('  Name:', `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim() || 'N/A');
    console.log('  Company:', response.data.companyName || 'N/A');
    console.log();
    console.log('Your Brevo HTTP API is configured correctly and ready to send emails!');
    console.log();
    console.log('✅ This method works even when SMTP ports are blocked by firewall/proxy.');
    console.log();
    process.exit(0);
  } catch (error) {
    console.log();
    console.log('='.repeat(60));
    console.log('❌ BREVO HTTP API CONNECTION FAILED');
    console.log('='.repeat(60));
    console.log();

    if (error.response) {
      console.log('Error Details:');
      console.log('  Status:', error.response.status);
      console.log('  Status Text:', error.response.statusText);
      console.log('  Message:', error.response.data?.message || 'N/A');
      console.log('  Code:', error.response.data?.code || 'N/A');
      console.log();

      if (error.response.status === 401) {
        console.log('🔧 TROUBLESHOOTING: Authentication Failed');
        console.log('-'.repeat(60));
        console.log();
        console.log('Your API key is invalid or expired. Here\'s what to do:');
        console.log();
        console.log('1. Log in to your Brevo account');
        console.log('2. Go to: https://app.brevo.com/settings/keys/api');
        console.log('3. Check if your current API key is still valid');
        console.log('4. If expired or invalid, generate a NEW API key');
        console.log('5. Copy the ENTIRE key');
        console.log('6. Update BREVO_API_KEY in your .env file');
        console.log('7. Run this test again');
        console.log();
        console.log('Common mistakes:');
        console.log('  ✗ API key copied incorrectly (missing characters)');
        console.log('  ✗ Using an old/expired API key');
        console.log('  ✗ Extra spaces or quotes in the .env file');
        console.log();
      } else if (error.response.status === 403) {
        console.log('🔧 TROUBLESHOOTING: Access Forbidden');
        console.log('-'.repeat(60));
        console.log();
        console.log('Your API key doesn\'t have the required permissions.');
        console.log();
        console.log('1. Go to: https://app.brevo.com/settings/keys/api');
        console.log('2. Generate a new API key with full permissions');
        console.log('3. Update BREVO_API_KEY in your .env file');
        console.log();
      }
    } else if (error.request) {
      console.log('Error Details:');
      console.log('  Code:', error.code || 'UNKNOWN');
      console.log('  Message:', error.message);
      console.log();
      console.log('🔧 TROUBLESHOOTING: Network Error');
      console.log('-'.repeat(60));
      console.log();
      console.log('Could not reach Brevo API servers. Check:');
      console.log('  • Is your internet connection working?');
      console.log('  • Can you access https://api.brevo.com in a browser?');
      console.log('  • Is there a firewall blocking HTTPS traffic?');
      console.log();
    } else {
      console.log('Error Details:');
      console.log('  Message:', error.message);
      console.log();
    }

    console.log('='.repeat(60));
    console.log();
    process.exit(1);
  }
}

testBrevoAPI();
