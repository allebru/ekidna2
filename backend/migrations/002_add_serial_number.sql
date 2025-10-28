-- Migration: Add serial_number field to subscribers table
-- Purpose: Track progressive subscription numbers for membership cards
-- Date: 2025-10-28

-- Add serial_number column
ALTER TABLE subscribers
ADD COLUMN serial_number INTEGER UNIQUE;

-- Create a sequence for auto-generating serial numbers
CREATE SEQUENCE IF NOT EXISTS subscribers_serial_seq START 1;

-- Update existing subscribers with sequential numbers (if any exist)
UPDATE subscribers
SET serial_number = nextval('subscribers_serial_seq')
WHERE serial_number IS NULL;

-- Make serial_number NOT NULL after populating existing records
ALTER TABLE subscribers
ALTER COLUMN serial_number SET NOT NULL;

-- Create index for faster lookups
CREATE INDEX idx_subscribers_serial_number ON subscribers(serial_number);

-- Add comment for documentation
COMMENT ON COLUMN subscribers.serial_number IS 'Progressive subscription number used for membership card identification';
