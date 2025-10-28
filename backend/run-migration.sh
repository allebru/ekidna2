#!/bin/bash

# Migration script for adding serial_number field to subscribers table
# This script will apply the 002_add_serial_number.sql migration

set -e

echo "🔄 Running database migration: Add serial_number field"
echo "=================================================="

# Load environment variables from .env file
if [ -f "../.env" ]; then
    export $(grep -v '^#' ../.env | xargs)
elif [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Set defaults if not set by .env
DB_USER=${DB_USER:-ekidna}
DB_NAME=${DB_NAME:-ekidna_db}

# Check if docker-compose is available
if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
    echo "📦 Running migration via Docker..."

    # Try docker-compose first
    if command -v docker-compose &> /dev/null; then
        docker-compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" < migrations/002_add_serial_number.sql
    else
        # Try docker compose (newer syntax)
        docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" < migrations/002_add_serial_number.sql
    fi

    echo "✅ Migration completed successfully!"
elif command -v psql &> /dev/null; then
    echo "🗄️  Running migration via psql..."

    if [ -z "$DATABASE_URL" ]; then
        # Use .env values if available, otherwise prompt
        if [ -z "$DB_HOST" ]; then
            echo "⚠️  DATABASE_URL environment variable not set"
            echo "Please provide database connection details:"
            read -p "Database host [localhost]: " DB_HOST
            DB_HOST=${DB_HOST:-localhost}
            read -p "Database port [5432]: " DB_PORT
            DB_PORT=${DB_PORT:-5432}
            read -p "Database name [$DB_NAME]: " INPUT_DB_NAME
            DB_NAME=${INPUT_DB_NAME:-$DB_NAME}
            read -p "Database user [$DB_USER]: " INPUT_DB_USER
            DB_USER=${INPUT_DB_USER:-$DB_USER}
        fi

        PGPASSWORD="$DB_PASSWORD" psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -f migrations/002_add_serial_number.sql
    else
        psql "$DATABASE_URL" -f migrations/002_add_serial_number.sql
    fi

    echo "✅ Migration completed successfully!"
else
    echo "❌ Error: Neither docker-compose nor psql is available"
    echo ""
    echo "Please run the migration manually using one of these methods:"
    echo ""
    echo "Method 1 - Docker:"
    echo "  docker-compose exec db psql -U $DB_USER -d $DB_NAME -f /app/migrations/002_add_serial_number.sql"
    echo ""
    echo "Method 2 - Direct psql:"
    echo "  PGPASSWORD=your_password psql -h localhost -U $DB_USER -d $DB_NAME -f migrations/002_add_serial_number.sql"
    echo ""
    exit 1
fi

echo ""
echo "🎉 Database migration completed!"
echo "The subscribers table now includes a serial_number field for membership cards."
