-- Ekidna Database Schema
-- PostgreSQL 16+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Staff users table (for MVP authentication)
CREATE TABLE IF NOT EXISTS staff_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sequence for membership card serial numbers
CREATE SEQUENCE IF NOT EXISTS subscribers_serial_seq START 1;

-- Subscribers table (main data from website subscription form)
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    subscription_year INTEGER NOT NULL,
    serial_number INTEGER UNIQUE NOT NULL DEFAULT nextval('subscribers_serial_seq'),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'pending')),
    email_confirmed BOOLEAN DEFAULT false,
    email_confirmation_token VARCHAR(255),
    email_confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES staff_users(id)
);

-- Activity log table (track changes for audit)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_user_id UUID REFERENCES staff_users(id),
    subscriber_id UUID REFERENCES subscribers(id),
    action VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscription_year ON subscribers(subscription_year);
CREATE INDEX IF NOT EXISTS idx_subscribers_serial_number ON subscribers(serial_number);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_users_email ON staff_users(email);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_subscriber_id ON activity_logs(subscriber_id);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_staff_users_updated_at
    BEFORE UPDATE ON staff_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- IMPORTANT: Change this password in production!
INSERT INTO staff_users (email, password_hash, name, role)
VALUES (
    'admin@ekidna.org',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123
    'Administrator',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data for testing (optional, can be removed in production)
INSERT INTO subscribers (name, email, phone, address, subscription_year, status, email_confirmed)
VALUES
    ('Marco Rossi', 'marco.rossi@example.com', '+39 333 1234567', 'Via Roma 1, Milano, 20121', 2025, 'active', true),
    ('Giulia Bianchi', 'giulia.bianchi@example.com', '+39 333 2345678', 'Corso Italia 45, Roma, 00100', 2025, 'active', true),
    ('Luca Ferrari', 'luca.ferrari@example.com', '+39 333 3456789', 'Via Garibaldi 23, Torino, 10121', 2024, 'active', false),
    ('Sara Russo', 'sara.russo@example.com', '+39 333 4567890', 'Piazza Navona 12, Roma, 00186', 2025, 'active', true)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ekidna_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ekidna_user;
