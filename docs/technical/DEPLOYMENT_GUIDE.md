# Deployment Guide - USE Nerd Platform

**Project**: USE Nerd E-commerce Platform
**Version**: 1.0
**Last Updated**: 2025-11-18
**Maintained By**: DevOps Team

[English](#english) | [Português](#português)

---

## English

### Table of Contents

1. [Infrastructure Requirements](#infrastructure-requirements)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment (AWS)](#cloud-deployment-aws)
5. [Database Management](#database-management)
6. [SSL/HTTPS Setup](#ssl-https-setup)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup & Restore](#backup--restore)
9. [Troubleshooting](#troubleshooting)
10. [Security Checklist](#security-checklist)

---

## Infrastructure Requirements

### Minimum Production Requirements

| Component | Specification | Notes |
|-----------|--------------|-------|
| **Application Server** | 2 vCPU, 4GB RAM | Node.js runtime |
| **Database (PostgreSQL)** | 2 vCPU, 8GB RAM, 100GB SSD | Production workload |
| **Cache (Redis)** | 1 vCPU, 2GB RAM | Session & queue management |
| **Storage** | 50GB+ | File uploads, logs |
| **Bandwidth** | 1TB/month minimum | API + storefront traffic |

### Network Requirements

- **Ports Required**:
  - 9000: Medusa backend API
  - 3000: Next.js storefront (optional)
  - 5432: PostgreSQL (internal only)
  - 6379: Redis (internal only)
  - 443/80: HTTPS/HTTP

- **Domain Configuration**:
  - Main API: `api.usenerd.com.br`
  - Admin Panel: `admin.usenerd.com.br`
  - Storefront: `www.usenerd.com.br`

### Recommended Cloud Providers

1. **AWS** (Full control, scalable)
2. **Railway** (Simple, cost-effective)
3. **Render** (Easy deployment)
4. **Digital Ocean** (Developer-friendly)

---

## Environment Configuration

### Critical Environment Variables

Create `.env.production` file with the following variables:

```bash
# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
NODE_ENV=production
PORT=9000
LOG_LEVEL=info

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
DATABASE_URL=postgresql://medusa_user:SECURE_PASSWORD@db.host:5432/medusa_production
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ==========================================
# REDIS CONFIGURATION
# ==========================================
REDIS_URL=redis://redis.host:6379
REDIS_TLS_URL=rediss://redis.host:6380  # If using TLS

# ==========================================
# SECURITY & AUTHENTICATION
# ==========================================
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long
COOKIE_SECRET=your-super-secure-cookie-secret-minimum-32-characters-long
SESSION_SECRET=your-super-secure-session-secret-minimum-32-characters-long

# ==========================================
# CORS CONFIGURATION
# ==========================================
STORE_CORS=https://www.usenerd.com.br
ADMIN_CORS=https://admin.usenerd.com.br
AUTH_CORS=https://admin.usenerd.com.br,https://www.usenerd.com.br

# ==========================================
# BRAZIL PAYMENT INTEGRATIONS
# ==========================================
# PIX Provider
PIX_PROVIDER=efi  # or 'mercadopago'
PIX_CLIENT_ID=your_pix_client_id
PIX_CLIENT_SECRET=your_pix_client_secret
PIX_CERTIFICATE_PATH=/app/certs/pix-production.p12
PIX_CERTIFICATE_PASSWORD=cert_password

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP-XXXXXXXXXXXXXXXXXXXX
MERCADO_PAGO_PUBLIC_KEY=APP_USR-XXXXXXXXXXXXXXXXXXXX

# ==========================================
# SHIPPING INTEGRATION (Melhor Envio)
# ==========================================
MELHOR_ENVIO_CLIENT_ID=your_melhor_envio_client_id
MELHOR_ENVIO_CLIENT_SECRET=your_melhor_envio_client_secret
MELHOR_ENVIO_SANDBOX=false

# ==========================================
# NFe FISCAL INTEGRATION
# ==========================================
NFE_PROVIDER=focus_nfe  # or 'nfe_io'
NFE_API_TOKEN=your_nfe_api_token
NFE_ENVIRONMENT=production
NFE_COMPANY_CNPJ=00000000000000

# ==========================================
# EMAIL CONFIGURATION
# ==========================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.XXXXXXXXXXXXXXXXXXXX
SMTP_FROM=noreply@usenerd.com.br

# ==========================================
# MONITORING & ERROR TRACKING
# ==========================================
SENTRY_DSN=https://xxxxxxxxxxxx@sentry.io/xxxxxxx
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1

# ==========================================
# FUTURE: BLOCKCHAIN CONFIGURATION
# ==========================================
# POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR-API-KEY
# POLYGON_PRIVATE_KEY=your_wallet_private_key_KEEP_SECRET
# CHAINLINK_VRF_COORDINATOR=0x...
# RAFFLE_CONTRACT_ADDRESS=0x...

# ==========================================
# RATE LIMITING
# ==========================================
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### Secret Management Best Practices

**NEVER commit secrets to Git**. Use one of these methods:

1. **AWS Secrets Manager** (Recommended for AWS)
```bash
aws secretsmanager create-secret \
  --name use-nerd/production \
  --secret-string file://secrets.json
```

2. **Environment Variables in CI/CD**
```yaml
# GitHub Actions example
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

3. **Docker Secrets**
```bash
echo "my-secret-value" | docker secret create jwt_secret -
```

---

## Docker Deployment

### Production-Ready Dockerfile

Create `Dockerfile`:

```dockerfile
# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --only=production

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Install PostgreSQL client for health checks
RUN apk add --no-cache postgresql-client

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa

# Copy production dependencies
COPY --from=deps --chown=medusa:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=medusa:nodejs /app/dist ./dist
COPY --from=builder --chown=medusa:nodejs /app/.medusa ./.medusa
COPY --chown=medusa:nodejs medusa-config.ts ./
COPY --chown=medusa:nodejs package.json ./

# Switch to non-root user
USER medusa

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
```

### Docker Compose for Production

Create `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  # ==========================================
  # PostgreSQL Database
  # ==========================================
  postgres:
    image: postgres:14-alpine
    container_name: use-nerd-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: medusa_production
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U medusa"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - use-nerd-network

  # ==========================================
  # Redis Cache
  # ==========================================
  redis:
    image: redis:7-alpine
    container_name: use-nerd-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "127.0.0.1:6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - use-nerd-network

  # ==========================================
  # Medusa Backend
  # ==========================================
  medusa:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: use-nerd-medusa
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    env_file:
      - .env.production
    environment:
      DATABASE_URL: postgresql://medusa:${DB_PASSWORD}@postgres:5432/medusa_production
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
    ports:
      - "9000:9000"
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - use-nerd-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G

  # ==========================================
  # Nginx Reverse Proxy (Optional)
  # ==========================================
  nginx:
    image: nginx:alpine
    container_name: use-nerd-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - medusa
    networks:
      - use-nerd-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  use-nerd-network:
    driver: bridge
```

### Deployment Commands

```bash
# 1. Build images
docker-compose -f docker-compose.production.yml build

# 2. Start services
docker-compose -f docker-compose.production.yml up -d

# 3. Run database migrations
docker-compose exec medusa npx medusa migrations run

# 4. Create admin user
docker-compose exec medusa npx medusa user -e admin@usenerd.com.br -p securepassword

# 5. Check logs
docker-compose logs -f medusa

# 6. Check health
curl http://localhost:9000/health
```

---

## Cloud Deployment (AWS)

### AWS Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Route 53 (DNS)                      │
│              api.usenerd.com.br → ALB                   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│    Application Load Balancer (ALB)                      │
│    - SSL Termination                                    │
│    - Health Checks                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              ECS Fargate Cluster                        │
│    ┌──────────────────────────────────────┐            │
│    │  Medusa Service (2 tasks)            │            │
│    │  - Auto-scaling enabled              │            │
│    │  - Rolling deployments               │            │
│    └──────────────────────────────────────┘            │
└─────────────────────┬───────────┬───────────────────────┘
                      │           │
        ┌─────────────▼───┐  ┌────▼──────────────┐
        │   RDS PostgreSQL │  │  ElastiCache      │
        │   - Multi-AZ     │  │  (Redis)          │
        │   - Automated    │  │  - Cluster mode   │
        │     backups      │  │  - Encryption     │
        └──────────────────┘  └───────────────────┘
```

### Step-by-Step AWS Deployment

#### 1. Create VPC and Networking

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=use-nerd-vpc}]'

# Create subnets (public and private)
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
```

#### 2. Create RDS PostgreSQL Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier use-nerd-db-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 14.7 \
  --master-username medusa \
  --master-user-password SECURE_PASSWORD_HERE \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --backup-retention-period 7 \
  --multi-az \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name use-nerd-db-subnet
```

#### 3. Create ElastiCache Redis

```bash
aws elasticache create-replication-group \
  --replication-group-id use-nerd-redis \
  --replication-group-description "USE Nerd Production Redis" \
  --engine redis \
  --cache-node-type cache.t3.medium \
  --num-cache-clusters 2 \
  --automatic-failover-enabled \
  --at-rest-encryption-enabled \
  --transit-encryption-enabled \
  --auth-token YOUR_REDIS_PASSWORD
```

#### 4. Create ECR Repository and Push Image

```bash
# Create repository
aws ecr create-repository --repository-name use-nerd/medusa

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t use-nerd/medusa:latest .
docker tag use-nerd/medusa:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/use-nerd/medusa:latest

# Push
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/use-nerd/medusa:latest
```

#### 5. Create ECS Task Definition

Save as `task-definition.json`:

```json
{
  "family": "use-nerd-medusa",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/use-nerd-task-role",
  "containerDefinitions": [
    {
      "name": "medusa",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/use-nerd/medusa:latest",
      "portMappings": [
        {
          "containerPort": 9000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "9000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:use-nerd/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:use-nerd/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/use-nerd/medusa",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "production"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:9000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### 6. Create ECS Service with Auto-Scaling

```bash
# Create service
aws ecs create-service \
  --cluster use-nerd-cluster \
  --service-name medusa-service \
  --task-definition use-nerd-medusa \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/use-nerd-medusa/xxx,containerName=medusa,containerPort=9000" \
  --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100,deploymentCircuitBreaker={enable=true,rollback=true}"

# Configure auto-scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/use-nerd-cluster/medusa-service \
  --min-capacity 2 \
  --max-capacity 10

# CPU-based scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/use-nerd-cluster/medusa-service \
  --policy-name cpu-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

---

## Database Management

### Running Migrations

```bash
# Development
npm run medusa migrations run

# Production (Docker)
docker-compose exec medusa npx medusa migrations run

# Production (ECS)
aws ecs run-task \
  --cluster use-nerd-cluster \
  --task-definition use-nerd-medusa \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=DISABLED}" \
  --overrides '{"containerOverrides": [{"name": "medusa", "command": ["npx", "medusa", "migrations", "run"]}]}'
```

### Database Backup Strategy

**Automated Daily Backups**:

```bash
#!/bin/bash
# backup-database.sh

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="medusa_production"
S3_BUCKET="s3://use-nerd-backups"

echo "Starting backup at $DATE"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Verify backup
if [ -f "$BACKUP_DIR/backup_$DATE.sql.gz" ]; then
  echo "Backup created successfully: backup_$DATE.sql.gz"

  # Upload to S3
  aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz $S3_BUCKET/daily/

  # Keep only last 30 days locally
  find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

  echo "Backup completed and uploaded to S3"
else
  echo "ERROR: Backup failed!"
  exit 1
fi
```

**Crontab Configuration**:
```bash
# Daily backup at 2 AM
0 2 * * * /app/scripts/backup-database.sh >> /var/log/backup.log 2>&1
```

### Restore from Backup

```bash
# Download from S3
aws s3 cp s3://use-nerd-backups/daily/backup_20251118_020000.sql.gz ./

# Restore
gunzip -c backup_20251118_020000.sql.gz | psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

---

## SSL/HTTPS Setup

### Option 1: Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.usenerd.com.br -d admin.usenerd.com.br

# Auto-renewal
sudo certbot renew --dry-run
```

### Option 2: AWS Certificate Manager

```bash
# Request certificate
aws acm request-certificate \
  --domain-name usenerd.com.br \
  --subject-alternative-names "*.usenerd.com.br" \
  --validation-method DNS

# Associate with ALB
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:loadbalancer/app/use-nerd-alb/xxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/xxx \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/use-nerd-medusa/xxx
```

### Nginx SSL Configuration

```nginx
server {
    listen 80;
    server_name api.usenerd.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.usenerd.com.br;

    ssl_certificate /etc/letsencrypt/live/api.usenerd.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.usenerd.com.br/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Monitoring & Logging

### Application Monitoring with Sentry

```typescript
// src/instrumentation.ts
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  integrations: [
    new ProfilingIntegration(),
  ],
});
```

### Structured Logging

```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'use-nerd-medusa',
    environment: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 10,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### CloudWatch Logs (AWS)

```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/use-nerd/medusa

# Set retention
aws logs put-retention-policy \
  --log-group-name /ecs/use-nerd/medusa \
  --retention-in-days 30
```

### Health Check Endpoint

```typescript
// src/api/health/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const manager = req.scope.resolve("manager");

    // Check database connection
    await manager.query("SELECT 1");

    // Check Redis connection
    const redisClient = req.scope.resolve("redisClient");
    await redisClient.ping();

    const health = {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: "connected",
      redis: "connected",
      version: process.env.npm_package_version || "1.0.0",
    };

    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
    });
  }
};
```

---

## Backup & Restore

### Complete Backup Strategy

**What to Backup**:
1. PostgreSQL database
2. Redis data (optional)
3. Uploaded files
4. Environment configuration
5. SSL certificates

**Backup Script**:

```bash
#!/bin/bash
# complete-backup.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_ROOT="/backups/$TIMESTAMP"
S3_BUCKET="s3://use-nerd-backups"

mkdir -p $BACKUP_ROOT

echo "=== Starting Complete Backup: $TIMESTAMP ==="

# 1. Database backup
echo "Backing up database..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_ROOT/database.sql.gz

# 2. Redis backup
echo "Backing up Redis..."
redis-cli --rdb $BACKUP_ROOT/redis-dump.rdb

# 3. File uploads
echo "Backing up uploads..."
tar -czf $BACKUP_ROOT/uploads.tar.gz /app/uploads

# 4. Configuration (sanitized)
echo "Backing up configuration..."
cp .env.production.example $BACKUP_ROOT/env.example

# 5. Upload to S3
echo "Uploading to S3..."
aws s3 sync $BACKUP_ROOT $S3_BUCKET/$TIMESTAMP/

# 6. Cleanup old backups (keep last 30 days)
find /backups -type d -mtime +30 -exec rm -rf {} +

echo "=== Backup Complete ==="
```

### Restore Procedure

```bash
#!/bin/bash
# restore.sh

BACKUP_TIMESTAMP=$1

if [ -z "$BACKUP_TIMESTAMP" ]; then
  echo "Usage: ./restore.sh <backup_timestamp>"
  exit 1
fi

S3_BUCKET="s3://use-nerd-backups"
RESTORE_DIR="/tmp/restore_$BACKUP_TIMESTAMP"

mkdir -p $RESTORE_DIR

# Download from S3
aws s3 sync $S3_BUCKET/$BACKUP_TIMESTAMP/ $RESTORE_DIR/

# Restore database
gunzip -c $RESTORE_DIR/database.sql.gz | psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# Restore uploads
tar -xzf $RESTORE_DIR/uploads.tar.gz -C /

# Restore Redis
redis-cli --rdb $RESTORE_DIR/redis-dump.rdb FLUSHALL
redis-cli --rdb $RESTORE_DIR/redis-dump.rdb

echo "Restore complete from backup: $BACKUP_TIMESTAMP"
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Symptom**: `ECONNREFUSED` or connection timeout

**Solutions**:
```bash
# Check database is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check network
docker network ls
docker network inspect use-nerd-network
```

#### 2. Redis Connection Errors

**Symptom**: `Redis connection error`

**Solutions**:
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -h localhost -p 6379 ping

# Check password
redis-cli -h localhost -p 6379 -a $REDIS_PASSWORD ping
```

#### 3. High Memory Usage

**Symptom**: Container OOM killed

**Solutions**:
```bash
# Check memory usage
docker stats

# Increase memory limit in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 4G

# Check for memory leaks
node --inspect medusa start
```

#### 4. Slow API Responses

**Symptom**: Response times > 1s

**Solutions**:
```bash
# Enable query logging
DATABASE_LOGGING=true

# Check slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

# Add database indexes
# Check N+1 queries
```

#### 5. Migration Failures

**Symptom**: Migration errors on deployment

**Solutions**:
```bash
# Check migration status
npx medusa migrations show

# Revert last migration
npx medusa migrations revert

# Force migration
npx medusa migrations run --force

# Check database schema
psql $DATABASE_URL -c "\dt"
```

### Logging for Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f medusa

# View last 100 lines
docker-compose logs --tail=100 medusa

# Search logs
docker-compose logs medusa | grep ERROR
```

---

## Security Checklist

### Pre-Deployment Security Audit

- [ ] **Environment Variables**
  - [ ] All secrets in environment variables (not hardcoded)
  - [ ] `.env` files in `.gitignore`
  - [ ] Production secrets in secure vault (AWS Secrets Manager, etc.)

- [ ] **Database Security**
  - [ ] Strong database password (min 32 characters)
  - [ ] Database not publicly accessible
  - [ ] SSL/TLS for database connections
  - [ ] Regular backups enabled
  - [ ] Prepared statements used (SQL injection prevention)

- [ ] **Network Security**
  - [ ] Firewall configured (only necessary ports open)
  - [ ] HTTPS enabled (SSL/TLS certificates)
  - [ ] CORS properly configured
  - [ ] Rate limiting enabled
  - [ ] DDoS protection (CloudFlare/AWS Shield)

- [ ] **Application Security**
  - [ ] JWT secrets minimum 32 characters
  - [ ] Session secrets rotated regularly
  - [ ] Input validation on all endpoints
  - [ ] XSS protection enabled
  - [ ] CSRF protection enabled
  - [ ] Security headers configured (HSTS, CSP, etc.)

- [ ] **Access Control**
  - [ ] Strong admin passwords enforced
  - [ ] Multi-factor authentication enabled
  - [ ] Role-based access control (RBAC) implemented
  - [ ] Audit logging enabled
  - [ ] Regular access reviews

- [ ] **Dependencies**
  - [ ] All dependencies up to date
  - [ ] No known vulnerabilities (`npm audit`)
  - [ ] Dependabot/Renovate configured
  - [ ] License compliance checked

- [ ] **Monitoring & Incident Response**
  - [ ] Error tracking configured (Sentry)
  - [ ] Logging centralized
  - [ ] Alerts configured for critical errors
  - [ ] Incident response plan documented
  - [ ] Regular security audits scheduled

- [ ] **Data Protection**
  - [ ] Encryption at rest enabled
  - [ ] Encryption in transit (HTTPS)
  - [ ] PII data handling compliant (LGPD/GDPR)
  - [ ] Regular penetration testing
  - [ ] Data retention policy enforced

---

## Português

### Sumário

1. [Requisitos de Infraestrutura](#requisitos-de-infraestrutura)
2. [Configuração de Ambiente](#configuração-de-ambiente)
3. [Deploy com Docker](#deploy-com-docker)
4. [Deploy na AWS](#deploy-na-aws)
5. [Gerenciamento de Banco de Dados](#gerenciamento-de-banco-de-dados)
6. [Configuração SSL/HTTPS](#configuração-ssl-https)
7. [Monitoramento e Logs](#monitoramento-e-logs)
8. [Backup e Restauração](#backup-e-restauração)
9. [Resolução de Problemas](#resolução-de-problemas)
10. [Checklist de Segurança](#checklist-de-segurança)

---

## Requisitos de Infraestrutura

### Requisitos Mínimos para Produção

| Componente | Especificação | Notas |
|-----------|--------------|-------|
| **Servidor de Aplicação** | 2 vCPU, 4GB RAM | Runtime Node.js |
| **Banco de Dados (PostgreSQL)** | 2 vCPU, 8GB RAM, 100GB SSD | Carga de produção |
| **Cache (Redis)** | 1 vCPU, 2GB RAM | Sessões e filas |
| **Armazenamento** | 50GB+ | Uploads e logs |
| **Largura de Banda** | 1TB/mês mínimo | Tráfego API + loja |

### Requisitos de Rede

- **Portas Necessárias**:
  - 9000: API backend Medusa
  - 3000: Loja Next.js (opcional)
  - 5432: PostgreSQL (apenas interno)
  - 6379: Redis (apenas interno)
  - 443/80: HTTPS/HTTP

- **Configuração de Domínios**:
  - API Principal: `api.usenerd.com.br`
  - Painel Admin: `admin.usenerd.com.br`
  - Loja: `www.usenerd.com.br`

---

## Configuração de Ambiente

### Variáveis de Ambiente Críticas

Criar arquivo `.env.production`:

```bash
# CONFIGURAÇÃO DA APLICAÇÃO
NODE_ENV=production
PORT=9000

# BANCO DE DADOS
DATABASE_URL=postgresql://medusa_user:SENHA_SEGURA@db.host:5432/medusa_production

# REDIS
REDIS_URL=redis://redis.host:6379

# SEGURANÇA
JWT_SECRET=seu-jwt-secret-super-seguro-minimo-32-caracteres
COOKIE_SECRET=seu-cookie-secret-super-seguro-minimo-32-caracteres

# CORS
STORE_CORS=https://www.usenerd.com.br
ADMIN_CORS=https://admin.usenerd.com.br

# INTEGRAÇÕES DE PAGAMENTO (BRASIL)
# PIX
PIX_CLIENT_ID=seu_pix_client_id
PIX_CLIENT_SECRET=seu_pix_client_secret

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP-XXXXXXXXXXXXXXXXXXXX
MERCADO_PAGO_PUBLIC_KEY=APP_USR-XXXXXXXXXXXXXXXXXXXX

# FRETE (Melhor Envio)
MELHOR_ENVIO_CLIENT_ID=seu_melhor_envio_client_id
MELHOR_ENVIO_CLIENT_SECRET=seu_melhor_envio_client_secret
MELHOR_ENVIO_SANDBOX=false

# NFe FISCAL
NFE_API_TOKEN=seu_nfe_api_token
NFE_COMPANY_CNPJ=00000000000000

# EMAIL
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.XXXXXXXXXXXXXXXXXXXX
SMTP_FROM=noreply@usenerd.com.br

# MONITORAMENTO
SENTRY_DSN=https://xxxxxxxxxxxx@sentry.io/xxxxxxx
```

### Melhores Práticas de Segurança

**NUNCA commitar secrets no Git**. Use:

1. **AWS Secrets Manager** (Recomendado para AWS)
2. **Variáveis de Ambiente no CI/CD**
3. **Docker Secrets**

---

## Deploy com Docker

### Comandos de Deploy

```bash
# 1. Construir imagens
docker-compose -f docker-compose.production.yml build

# 2. Iniciar serviços
docker-compose -f docker-compose.production.yml up -d

# 3. Executar migrações
docker-compose exec medusa npx medusa migrations run

# 4. Criar usuário admin
docker-compose exec medusa npx medusa user -e admin@usenerd.com.br -p senhasegura

# 5. Verificar logs
docker-compose logs -f medusa

# 6. Verificar saúde
curl http://localhost:9000/health
```

---

## Gerenciamento de Banco de Dados

### Executar Migrações

```bash
# Desenvolvimento
npm run medusa migrations run

# Produção (Docker)
docker-compose exec medusa npx medusa migrations run
```

### Estratégia de Backup

**Backups Diários Automatizados**:

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Criar backup
pg_dump -h $DB_HOST -U $DB_USER -d medusa_production | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Manter últimos 30 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

**Configuração Crontab**:
```bash
# Backup diário às 2h da manhã
0 2 * * * /app/scripts/backup-database.sh >> /var/log/backup.log 2>&1
```

### Restaurar do Backup

```bash
# Restaurar
gunzip -c backup_20251118_020000.sql.gz | psql -h $DB_HOST -U $DB_USER -d medusa_production
```

---

## Configuração SSL/HTTPS

### Opção 1: Let's Encrypt com Certbot

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d api.usenerd.com.br -d admin.usenerd.com.br

# Auto-renovação
sudo certbot renew --dry-run
```

---

## Monitoramento e Logs

### Monitoramento com Sentry

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Logs Estruturados

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

---

## Backup e Restauração

### O Que Fazer Backup

1. Banco de dados PostgreSQL
2. Dados do Redis (opcional)
3. Arquivos enviados (uploads)
4. Configurações de ambiente
5. Certificados SSL

---

## Resolução de Problemas

### Problemas Comuns

#### 1. Erros de Conexão com Banco de Dados

**Sintoma**: `ECONNREFUSED` ou timeout

**Soluções**:
```bash
# Verificar se banco está rodando
docker-compose ps postgres

# Testar conexão
psql $DATABASE_URL -c "SELECT 1"
```

#### 2. Erros de Conexão com Redis

**Sintoma**: `Redis connection error`

**Soluções**:
```bash
# Verificar se Redis está rodando
docker-compose ps redis

# Testar conexão
redis-cli -h localhost -p 6379 ping
```

---

## Checklist de Segurança

- [ ] **Variáveis de Ambiente**
  - [ ] Todos os secrets em variáveis de ambiente
  - [ ] Arquivos `.env` no `.gitignore`
  - [ ] Secrets de produção em cofre seguro

- [ ] **Segurança do Banco de Dados**
  - [ ] Senha forte (mínimo 32 caracteres)
  - [ ] Banco não acessível publicamente
  - [ ] SSL/TLS para conexões
  - [ ] Backups regulares habilitados

- [ ] **Segurança de Rede**
  - [ ] Firewall configurado
  - [ ] HTTPS habilitado
  - [ ] CORS configurado corretamente
  - [ ] Rate limiting habilitado

- [ ] **Segurança da Aplicação**
  - [ ] Secrets JWT mínimo 32 caracteres
  - [ ] Validação de input em todos endpoints
  - [ ] Proteção XSS habilitada
  - [ ] Proteção CSRF habilitada

- [ ] **Monitoramento**
  - [ ] Rastreamento de erros configurado
  - [ ] Logs centralizados
  - [ ] Alertas configurados

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18
**Contact**: DevOps Team - devops@usenerd.com.br
