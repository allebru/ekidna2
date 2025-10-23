# Email Configuration Guide

This guide will help you configure email functionality for the Ekidna application using Brevo (formerly Sendinblue) SMTP service.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Brevo Account Setup](#brevo-account-setup)
- [Getting Your SMTP Credentials](#getting-your-smtp-credentials)
- [Configuring the Application](#configuring-the-application)
- [Testing the Configuration](#testing-the-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

1. A Brevo account (free plan available at [https://www.brevo.com](https://www.brevo.com))
2. A verified sender email address in your Brevo account

## Brevo Account Setup

### Step 1: Create a Brevo Account

1. Go to [https://www.brevo.com](https://www.brevo.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Verify Your Sender Domain/Email

Before you can send emails, you need to verify your sender email address or domain.

#### Option A: Verify a Single Email Address
1. Go to **Senders & IP** → **Senders**
2. Click **Add a sender**
3. Enter your email address (e.g., `noreply@ekidna.org`)
4. Check your inbox for the verification email
5. Click the verification link

#### Option B: Verify Your Entire Domain (Recommended)
1. Go to **Senders & IP** → **Domains**
2. Click **Add a domain**
3. Enter your domain (e.g., `ekidna.org`)
4. Add the required DNS records to your domain's DNS settings
5. Wait for verification (can take up to 72 hours)

## Getting Your SMTP Credentials

### Step 1: Navigate to SMTP Settings

1. Log in to your Brevo account
2. Go to **Settings** (top right corner)
3. Select **SMTP & API**
4. Click on **SMTP** tab

Or directly visit: [https://app.brevo.com/settings/keys/smtp](https://app.brevo.com/settings/keys/smtp)

### Step 2: Generate SMTP Key

1. You'll see your SMTP server details:
   - **Server**: `smtp-relay.brevo.com`
   - **Port**: `587` (recommended)
   - **Login**: Your Brevo account email

2. Click **Generate a new SMTP key** or **Create SMTP key**
3. Give it a name (e.g., "Ekidna Production")
4. **IMPORTANT**: Copy the entire SMTP key immediately!
   - The key starts with `xsmtpsib-`
   - It's a long string of random characters
   - You won't be able to see it again after closing the dialog

### Important Notes About SMTP Keys

- ✅ The SMTP key is NOT your account password
- ✅ Each key can be used for multiple applications
- ✅ You can create multiple keys and revoke them individually
- ✅ Keep your keys secure and never commit them to git
- ❌ Never use your Brevo account password as EMAIL_PASSWORD

## Configuring the Application

### Step 1: Update Your .env File

Open your `.env` file in the backend directory and update these variables:

```bash
# Email Configuration (Brevo)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-brevo-account-email@example.com
EMAIL_PASSWORD=xsmtpsib-your-long-smtp-key-here
EMAIL_FROM=noreply@ekidna.org
```

**Replace:**
- `EMAIL_USER`: Your Brevo account email (the one you use to log in)
- `EMAIL_PASSWORD`: The SMTP key you generated (starts with `xsmtpsib-`)
- `EMAIL_FROM`: A verified sender email address (must be verified in Brevo)

### Step 2: Verify Configuration

Example of a correctly configured `.env` file:

```bash
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=alessandro@bruxstudio.it
EMAIL_PASSWORD=xsmtpsib-df99787c74a234706134c2b760082e51ce2f9e1ceedc35244cd67dad840540d1-DB2pGEkd4xafo5ks
EMAIL_FROM=noreply@ekidna.org
```

⚠️ **Security Note**: Never commit your `.env` file to git! It should be in `.gitignore`.

## Testing the Configuration

### Method 1: Using the Test Script

We've provided a dedicated test script to validate your SMTP configuration:

```bash
cd backend
node test-smtp.js
```

**Expected Output (Success):**
```
============================================================
SMTP CONNECTION TEST
============================================================

📧 Configuration:
  Host: smtp-relay.brevo.com
  Port: 587
  User: your-email@example.com
  Pass: xsmtpsib-...
  From: noreply@ekidna.org

🔍 Testing SMTP connection...

============================================================
✅ SUCCESS! SMTP connection is working correctly!
============================================================

Your email configuration is valid and ready to use.
```

**Expected Output (Failure):**
The script will provide detailed troubleshooting steps based on the error.

### Method 2: Restart the Server

After updating your `.env` file:

1. Stop the current server (Ctrl+C)
2. Restart using Docker:
   ```bash
   docker compose down
   docker compose up --build
   ```

3. Check the logs for:
   ```
   ✅ Email service initialized successfully
   📮 Ready to send emails via: smtp-relay.brevo.com
   ```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Authentication failed: 535 5.7.8"

**Cause**: Wrong credentials

**Solution**:
1. Verify you're using your Brevo account email for `EMAIL_USER`
2. Verify you're using the SMTP key (not your account password) for `EMAIL_PASSWORD`
3. Generate a NEW SMTP key from Brevo dashboard
4. Make sure you copied the entire key (they're quite long!)
5. Check for extra spaces or line breaks in the .env file

#### Issue 2: "self-signed certificate in certificate chain"

**Cause**: TLS certificate validation issue

**Solution**: This should be automatically handled by our configuration. If you still see this error, ensure you're using the latest version of the code.

#### Issue 3: "Connection timeout" or "ESOCKET"

**Cause**: Cannot reach SMTP server

**Solution**:
1. Check your internet connection
2. Verify EMAIL_HOST is exactly: `smtp-relay.brevo.com`
3. Verify EMAIL_PORT is: `587`
4. Check if your firewall is blocking port 587
5. Try from a different network

#### Issue 4: "Sender email not verified"

**Cause**: The EMAIL_FROM address is not verified in Brevo

**Solution**:
1. Go to Brevo → Senders & IP → Senders
2. Verify the sender email address you're using
3. Or use an already verified email address

#### Issue 5: Email service disabled but server runs

**Behavior**: Server starts successfully but shows "Email functionality will be disabled"

**Impact**: The application will work normally, but no emails will be sent (subscription confirmations, notifications, etc.)

**Solution**: Follow this guide to configure email properly, then restart the server.

### Debug Checklist

Use this checklist to verify your configuration:

- [ ] Brevo account created and email verified
- [ ] Sender email/domain verified in Brevo
- [ ] SMTP key generated from Brevo dashboard
- [ ] `.env` file updated with correct values
- [ ] EMAIL_USER matches your Brevo account email
- [ ] EMAIL_PASSWORD is the SMTP key (starts with `xsmtpsib-`)
- [ ] EMAIL_FROM is a verified sender address
- [ ] No extra spaces or quotes in .env values
- [ ] Server restarted after updating .env
- [ ] `test-smtp.js` runs successfully

### Getting Help

1. **Run the test script first**: `node test-smtp.js`
   - It provides detailed diagnostics
   - It tests the connection independently

2. **Check server logs** for specific error messages

3. **Verify Brevo account status**:
   - Login to Brevo dashboard
   - Check if your account is active
   - Check if you've exceeded your sending limits

4. **Check Brevo documentation**:
   - [SMTP Setup Guide](https://help.brevo.com/hc/en-us/articles/209467485)
   - [Sender Authentication](https://help.brevo.com/hc/en-us/articles/208846169)

## Free Tier Limitations

Brevo's free tier includes:
- ✅ 300 emails per day
- ✅ SMTP access
- ✅ Email templates
- ✅ Contact management

This should be sufficient for most small to medium-sized applications.

## Alternative SMTP Providers

While this guide focuses on Brevo, the application can work with any SMTP provider. Just update the `.env` file with the appropriate settings:

- **Gmail**: Requires app-specific password
- **SendGrid**: Similar setup to Brevo
- **Amazon SES**: More complex setup but very scalable
- **Mailgun**: Good for developers

## Security Best Practices

1. ✅ Keep SMTP keys in `.env` file (not in code)
2. ✅ Add `.env` to `.gitignore`
3. ✅ Rotate SMTP keys periodically
4. ✅ Use different keys for development and production
5. ✅ Never share SMTP keys in public channels
6. ✅ Revoke keys immediately if compromised

---

Last updated: 2025-10-23
