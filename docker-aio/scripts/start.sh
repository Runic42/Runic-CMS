#!/bin/sh

set -e

echo "Starting Runic CMS All-in-One Container..."

# Initialize PostgreSQL if needed
if [ ! -d "/var/lib/postgresql/data/base" ]; then
    echo "Initializing PostgreSQL database..."
    su - postgres -c "initdb -D /var/lib/postgresql/data"
    
    # Configure PostgreSQL
    echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
    echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
su - postgres -c "pg_ctl -D /var/lib/postgresql/data -l /var/log/postgresql.log start"

# Wait for PostgreSQL to be ready
sleep 5

# Create database and user if they don't exist
echo "Setting up database..."
su - postgres -c "psql -c \"CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';\" || true"
su - postgres -c "psql -c \"CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};\" || true"
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};\" || true"

# Run database migrations
echo "Running database migrations..."
cd /app/backend
su - postgres -c "psql -d ${DB_NAME} -f /app/backend/schema.sql" || true

# Start backend
echo "Starting backend server..."
cd /app/backend
node dist/index.js &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Start frontend
echo "Starting frontend server..."
cd /app/frontend
npm start &
FRONTEND_PID=$!

echo "✓ Runic CMS is running!"
echo "✓ Frontend: http://localhost:3000"
echo "✓ Backend API: http://localhost:3001"
echo "✓ PostgreSQL: localhost:5432"

# Keep container running and handle shutdown gracefully
trap "kill $BACKEND_PID $FRONTEND_PID; su - postgres -c 'pg_ctl -D /var/lib/postgresql/data stop'; exit" SIGTERM SIGINT

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
