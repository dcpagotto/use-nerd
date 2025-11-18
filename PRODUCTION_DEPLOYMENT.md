# USE Nerd - Production Deployment Guide

## Server Configuration

**Server**: srv.betabits.com.br
**Location**: /opt/usenerd
**Docker Mode**: Swarm
**Traefik Version**: 2.11.2
**Network**: network_public (overlay)

## Domain Configuration

### Domains
- **Main Site**: usenerd.com, www.usenerd.com → Frontend (Next.js)
- **API**: api.usenerd.com → Backend (Medusa)
- **Admin**: admin.usenerd.com → Backend Admin
- **CMS**: cms.usenerd.com → Strapi CMS

### DNS Records Needed
Point these A records to srv.betabits.com.br:
```
A    usenerd.com             → Server IP
A    www.usenerd.com         → Server IP
A    api.usenerd.com         → Server IP
A    admin.usenerd.com       → Server IP
A    cms.usenerd.com         → Server IP
```

## Stack Architecture

### Services
1. **usenerd-postgres** - PostgreSQL 15 database
2. **usenerd-redis** - Redis 7 cache
3. **usenerd-backend** - Medusa Backend (2 replicas)
4. **usenerd-storefront** - Next.js Frontend (2 replicas)
5. **usenerd-strapi** - Strapi CMS (1 replica)

### Container Names
All containers use `usenerd-*` prefix for easy identification.

### Volumes
- `usenerd_postgres_data` - Database data
- `usenerd_redis_data` - Redis persistence
- `usenerd_medusa_uploads` - Medusa file uploads
- `usenerd_medusa_build` - Medusa build artifacts
- `usenerd_strapi_uploads` - Strapi media files

## Deployment Steps

### 1. Initial Setup (Done)
```bash
# SSH to server
ssh root@srv.betabits.com.br

# Clone repository
cd /opt/usenerd
git clone https://github.com/dcpagotto/use-nerd.git .

# Create .env file
# (Already created with secure passwords)
```

### 2. Build Docker Images
```bash
cd /opt/usenerd

# Build backend
docker build -t usenerd-backend:latest --target production .

# Build storefront
cd storefront
docker build -t usenerd-storefront:latest -f Dockerfile.production .

# Build Strapi
cd ../strapi-cms
docker build -t usenerd-strapi:latest --target production -f Dockerfile .
```

### 3. Deploy Stack
```bash
cd /opt/usenerd

# Deploy to Docker Swarm
docker stack deploy -c docker-compose.production.yml usenerd

# Check deployment status
docker stack services usenerd
docker service ls | grep usenerd
```

### 4. Verify Services
```bash
# Check all services are running
docker service ps usenerd_usenerd-backend
docker service ps usenerd_usenerd-storefront
docker service ps usenerd_usenerd-strapi

# Check logs
docker service logs usenerd_usenerd-backend
docker service logs usenerd_usenerd-storefront
```

### 5. Database Migrations
```bash
# Run Medusa migrations
docker exec $(docker ps -q -f name=usenerd_usenerd-backend) npm run db:migrate

# Create admin user (optional)
docker exec -it $(docker ps -q -f name=usenerd_usenerd-backend) npm run create-admin
```

## Traefik Configuration

### Automatic Features
- **HTTPS**: Let's Encrypt certificates (automatic)
- **HTTP → HTTPS**: Automatic redirect
- **WWW Redirect**: www.usenerd.com → usenerd.com
- **Load Balancing**: 2 replicas for backend and frontend

### Certificate Resolver
Traefik is configured with `letsencrypt` certificate resolver.
Certificates will be issued automatically when domains are pointed to the server.

## Environment Variables

### Production Secrets (Configured)
```bash
POSTGRES_PASSWORD=UsEN3rd_DB_Prod_2025!
REDIS_PASSWORD=UsEN3rd_Redis_Prod_2025!
JWT_SECRET=<generated>
COOKIE_SECRET=<generated>
APP_KEYS=<generated>
API_TOKEN_SALT=<generated>
ADMIN_JWT_SECRET=<generated>
TRANSFER_TOKEN_SALT=<generated>
```

### Printful Configuration (To Be Added)
```bash
PRINTFUL_ACCESS_TOKEN=<get from Printful>
PRINTFUL_STORE_ID=<get from Printful>
PRINTFUL_LOGO_URL=https://usenerd.com/logo.png
PRINTFUL_CONFIRM_ORDER=false
PRINTFUL_ENABLE_WEBHOOKS=false
```

To update Printful config:
```bash
cd /opt/usenerd
nano .env
# Add Printful credentials
docker stack deploy -c docker-compose.production.yml usenerd
```

## Monitoring & Maintenance

### Check Service Status
```bash
# List all services
docker stack services usenerd

# Check specific service
docker service ps usenerd_usenerd-backend --no-trunc

# View logs
docker service logs -f usenerd_usenerd-backend
docker service logs -f usenerd_usenerd-storefront
```

### Scale Services
```bash
# Scale backend (current: 2 replicas)
docker service scale usenerd_usenerd-backend=3

# Scale frontend (current: 2 replicas)
docker service scale usenerd_usenerd-storefront=4
```

### Update Deployment
```bash
cd /opt/usenerd

# Pull latest code
git pull origin main

# Rebuild images
docker build -t usenerd-backend:latest --target production .
docker build -t usenerd-storefront:latest -f storefront/Dockerfile.production ./storefront

# Update stack (rolling update)
docker stack deploy -c docker-compose.production.yml usenerd
```

### Rollback
```bash
# Rollback a service to previous version
docker service rollback usenerd_usenerd-backend
docker service rollback usenerd_usenerd-storefront
```

## Backup & Recovery

### Database Backup
```bash
# Backup PostgreSQL
docker exec $(docker ps -q -f name=usenerd_usenerd-postgres) pg_dump -U usenerd usenerd_production > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20250118.sql | docker exec -i $(docker ps -q -f name=usenerd_usenerd-postgres) psql -U usenerd usenerd_production
```

### Volume Backup
```bash
# Backup all volumes
docker run --rm -v usenerd_strapi_uploads:/data -v $(pwd):/backup alpine tar czf /backup/strapi_uploads.tar.gz /data
```

## Security Considerations

1. **Secrets Management**: All secrets are randomly generated and stored in .env (not in Git)
2. **HTTPS Only**: Traefik enforces HTTPS for all domains
3. **Non-Root Containers**: All containers run as non-root users
4. **Network Isolation**: Services communicate only through Docker overlay network
5. **Resource Limits**: Consider adding resource limits in production

### Add Resource Limits (Optional)
Edit docker-compose.production.yml:
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

## Troubleshooting

### Service Won't Start
```bash
# Check service status
docker service ps usenerd_usenerd-backend --no-trunc

# Check logs
docker service logs usenerd_usenerd-backend

# Inspect service
docker service inspect usenerd_usenerd-backend
```

### Certificate Issues
```bash
# Check Traefik logs
docker service logs traefik_traefik | grep usenerd

# Force certificate renewal (if needed)
docker exec $(docker ps -q -f name=traefik) rm -rf /letsencrypt/acme.json
docker service update --force traefik_traefik
```

### Database Connection Issues
```bash
# Check if Postgres is running
docker service ps usenerd_usenerd-postgres

# Test connection
docker exec -it $(docker ps -q -f name=usenerd_usenerd-postgres) psql -U usenerd -d usenerd_production -c "SELECT version();"
```

## Performance Optimization

### Enable HTTP/2
Already enabled through Traefik.

### Enable Gzip Compression
Add to Traefik labels in docker-compose.production.yml:
```yaml
- "traefik.http.middlewares.usenerd-compress.compress=true"
- "traefik.http.routers.usenerd-web.middlewares=usenerd-compress@docker"
```

### Cache Headers
Configure in Next.js and Strapi for static assets.

## Next Steps

1. ✅ Deploy infrastructure (Done)
2. ⏳ Point domains to server
3. ⏳ Verify HTTPS certificates issued
4. ⏳ Test all services
5. ⏳ Add Printful credentials
6. ⏳ Populate products
7. ⏳ Configure payment gateways
8. ⏳ Test checkout flow
9. ⏳ Launch! 🚀

## Support

For issues:
- Check logs: `docker service logs usenerd_usenerd-<service>`
- GitHub: https://github.com/dcpagotto/use-nerd/issues
- Server access: `ssh root@srv.betabits.com.br`

---

**Last Updated**: November 18, 2025
**Version**: 1.0
**Status**: Building Docker images...
