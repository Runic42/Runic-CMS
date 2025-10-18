# Multi-stage Docker build for Runic CMS
# Includes frontend, backend, and PostgreSQL database

FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Backend builder
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
RUN npm ci

# Copy backend source
COPY backend/src ./src

# Build backend
RUN npm run build

# Final production image
FROM node:18-alpine

# Install PostgreSQL
RUN apk add --no-cache postgresql postgresql-contrib

# Create app directory
WORKDIR /app

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY backend/src/db/schema.sql ./backend/schema.sql

# Copy built frontend
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-builder /app/frontend/package.json ./frontend/
COPY --from=frontend-builder /app/frontend/next.config.js ./frontend/

# Copy startup script
COPY docker-aio/scripts/start.sh /start.sh
RUN chmod +x /start.sh

# Create data directory for PostgreSQL
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose ports
EXPOSE 3000 3001 5432

# Set environment variables
ENV NODE_ENV=production
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_NAME=runic_cms
ENV DB_USER=runic
ENV DB_PASSWORD=runic_password
ENV FRONTEND_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=http://localhost:3001

# Start services
CMD ["/start.sh"]
