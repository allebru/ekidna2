# Fix for Subscription Error: "Database error"

## Problem

When trying to subscribe through the website form, you get:
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Subscription error: Error: Database error
```

## Root Cause

The `serial_number` column in the `subscribers` table is missing a DEFAULT value. The migration `002_add_serial_number.sql` added the column but didn't set a default, so when the INSERT statement tries to create a new subscriber without specifying `serial_number`, PostgreSQL fails.

## Solution

There are two ways to fix this:

### Option 1: Quick Fix (Recommended if database is already set up)

Run the quick-fix script to add the DEFAULT value:

```bash
cd backend
node fix_serial_number.js
```

This script will:
1. Check if the sequence exists (create it if needed)
2. Add the DEFAULT value to the serial_number column
3. Update any existing rows with NULL serial_number

### Option 2: Full Migration (For fresh setup or if quick fix doesn't work)

Run all migrations from scratch:

```bash
cd backend
npm run migrate
```

This will run all SQL files in the `migrations/` directory in order.

## Files Modified

1. **`backend/migrations/002_add_serial_number.sql`**
   - Added: `ALTER COLUMN serial_number SET DEFAULT nextval('subscribers_serial_seq')`
   - This ensures new inserts automatically get a serial number

2. **`backend/migrations/run.js`** (NEW)
   - Migration runner script that executes all .sql files in order
   - Handles errors gracefully (skips already-applied migrations)

3. **`backend/fix_serial_number.js`** (NEW)
   - Quick-fix script specifically for the serial_number DEFAULT issue
   - Safe to run on existing databases

## Verification

After running the fix, test the subscription form:

1. Open the website: http://localhost:3000
2. Go to the "Iscriviti" page
3. Fill out the form and submit
4. You should see: "Grazie! Ti contatteremo presto."

## Database Schema Check

To verify the fix was applied, you can check the column definition:

```sql
SELECT column_default
FROM information_schema.columns
WHERE table_name = 'subscribers' AND column_name = 'serial_number';
```

Expected result: `nextval('subscribers_serial_seq'::regclass)`

## Prevention

The migration file has been updated to include the DEFAULT constraint, so future database setups will not have this issue.

## Need Help?

If the quick fix doesn't work:
1. Check that the database is accessible
2. Verify environment variables in `.env` (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
3. Try the full migration: `npm run migrate`
4. Check server logs for more detailed error messages
