# Runic CMS - All-in-One Docker Container

This Docker container includes everything needed to run Runic CMS:
- Next.js Frontend
- Express.js Backend API
- PostgreSQL Database

All services run in a single container for easy deployment.

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start the container:**
```bash
docker-compose up -d
```

2. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin Dashboard: http://localhost:3000/admin

3. **View logs:**
```bash
docker-compose logs -f
```

4. **Stop the container:**
```bash
docker-compose down
```

### Using Docker directly

1. **Build the image:**
```bash
docker build -f docker-aio/Dockerfile -t runic-cms:latest .
```

2. **Run the container:**
```bash
docker run -d \
  --name runic-cms \
  -p 3000:3000 \
  -p 3001:3001 \
  -v runic-data:/var/lib/postgresql/data \
  -v runic-uploads:/app/uploads \
  -e DB_PASSWORD=your-secure-password \
  -e JWT_SECRET=your-secret-key \
  runic-cms:latest
```

3. **View logs:**
```bash
docker logs -f runic-cms
```

4. **Stop the container:**
```bash
docker stop runic-cms
```

## Environment Variables

You can customize the deployment with these environment variables:

- `DB_PASSWORD` - PostgreSQL password (default: runic_password)
- `JWT_SECRET` - Secret key for JWT tokens (CHANGE THIS!)
- `NODE_ENV` - Environment mode (default: production)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)

Example with custom variables:
```bash
docker run -d \
  --name runic-cms \
  -p 3000:3000 \
  -p 3001:3001 \
  -v runic-data:/var/lib/postgresql/data \
  -v runic-uploads:/app/uploads \
  -e DB_PASSWORD=my-secure-password \
  -e JWT_SECRET=my-super-secret-key \
  -e NODE_ENV=production \
  runic-cms:latest
```

## Persistent Data

The container uses Docker volumes for persistent data:

- `runic-data` - PostgreSQL database
- `runic-uploads` - Uploaded media files

To back up your data:
```bash
# Backup database
docker exec runic-cms pg_dump -U runic runic_cms > backup.sql

# Backup uploads
docker cp runic-cms:/app/uploads ./uploads-backup
```

To restore from backup:
```bash
# Restore database
docker exec -i runic-cms psql -U runic runic_cms < backup.sql

# Restore uploads
docker cp ./uploads-backup runic-cms:/app/uploads
```

## Updating

To update to a new version:

1. **Stop the container:**
```bash
docker-compose down
```

2. **Pull latest code and rebuild:**
```bash
git pull
docker-compose build --no-cache
```

3. **Start the container:**
```bash
docker-compose up -d
```

## Custom Port Mapping

To use different ports:

```yaml
# docker-compose.yml
services:
  runic-cms:
    ports:
      - "8080:3000"  # Access frontend on port 8080
      - "8081:3001"  # Access backend on port 8081
```

Or with Docker run:
```bash
docker run -d \
  --name runic-cms \
  -p 8080:3000 \
  -p 8081:3001 \
  runic-cms:latest
```

## Behind a Reverse Proxy

If running behind Nginx or Apache:

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    
    ProxyPreserveHost On
    
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check if ports are already in use
netstat -tulpn | grep -E '3000|3001|5432'
```

### Database connection issues
```bash
# Check PostgreSQL is running
docker exec runic-cms ps aux | grep postgres

# Check database exists
docker exec runic-cms psql -U runic -l
```

### Reset everything
```bash
# Stop and remove container
docker-compose down -v

# Remove volumes (WARNING: This deletes all data!)
docker volume rm docker-aio_runic-data docker-aio_runic-uploads

# Rebuild and start
docker-compose up -d --build
```

## Production Deployment

For production:

1. **Use strong passwords:**
```bash
export DB_PASSWORD=$(openssl rand -base64 32)
export JWT_SECRET=$(openssl rand -base64 32)
```

2. **Use HTTPS** with a reverse proxy (Nginx/Apache with SSL)

3. **Set up automatic backups:**
```bash
# Add to crontab
0 2 * * * docker exec runic-cms pg_dump -U runic runic_cms > /backups/runic-$(date +\%Y\%m\%d).sql
```

4. **Monitor logs:**
```bash
docker-compose logs -f --tail=100
```

5. **Set resource limits:**
```yaml
# docker-compose.yml
services:
  runic-cms:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/runic-cms/issues
- Documentation: https://docs.runic-cms.com
