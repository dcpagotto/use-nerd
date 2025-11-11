# Deployment Guide

[English](#english) | [Portugues](#portugues)

---

## English

### Overview

This guide covers deployment strategies for USE Nerd platform across different environments.

### Prerequisites

- Node.js >= 20.x
- PostgreSQL 14+ database
- Redis 6+ instance
- Domain name with SSL certificate
- Cloud provider account (AWS, GCP, or Azure)

### Environment Variables

Required environment variables for production:

```bash
# Application
NODE_ENV=production
PORT=9000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis
REDIS_URL=redis://host:6379

# Security
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
COOKIE_SECRET=your-super-secure-cookie-secret-min-32-chars

# CORS
STORE_CORS=https://your-store.com
ADMIN_CORS=https://admin.your-store.com
AUTH_CORS=https://admin.your-store.com,https://your-store.com

# Blockchain
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_PRIVATE_KEY=your-wallet-private-key
CHAINLINK_VRF_COORDINATOR=0x...
CHAINLINK_KEY_HASH=0x...

# Payment Gateways (Brazil)
PIX_PROVIDER_API_KEY=your-pix-api-key
PIX_PROVIDER_SECRET=your-pix-secret
CREDIT_CARD_ACQUIRER_KEY=your-cc-key
BOLETO_PROVIDER_KEY=your-boleto-key

# Email
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-smtp-password

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info
```

---

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### 1. Build Docker Images

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/dist ./dist
COPY medusa-config.ts ./

EXPOSE 9000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: medusa_password
      POSTGRES_DB: medusa_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  medusa:
    build: .
    depends_on:
      - postgres
      - redis
    ports:
      - "9000:9000"
    environment:
      DATABASE_URL: postgresql://medusa:medusa_password@postgres:5432/medusa_db
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    env_file:
      - .env
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### 2. Deploy

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec medusa npx medusa migrations run

# View logs
docker-compose logs -f medusa
```

---

### Option 2: AWS Deployment

#### Architecture

```
┌─────────────┐
│   Route 53  │ (DNS)
└──────┬──────┘
       │
┌──────▼──────┐
│     ALB     │ (Load Balancer)
└──────┬──────┘
       │
┌──────▼──────────────────┐
│    ECS Fargate          │
│  ┌─────────────────┐    │
│  │  Medusa Tasks   │    │
│  └─────────────────┘    │
└─────────────────────────┘
       │             │
┌──────▼──────┐ ┌───▼──────┐
│     RDS     │ │ElastiCache│
│ (PostgreSQL)│ │  (Redis)  │
└─────────────┘ └───────────┘
```

#### Step-by-Step Deployment

1. **Create RDS PostgreSQL Instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier use-nerd-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 14.7 \
  --master-username medusa \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 100
```

2. **Create ElastiCache Redis**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id use-nerd-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --num-cache-nodes 1
```

3. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name use-nerd
```

4. **Build and Push Docker Image**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t use-nerd .

# Tag
docker tag use-nerd:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/use-nerd:latest

# Push
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/use-nerd:latest
```

5. **Create ECS Task Definition**

`task-definition.json`:
```json
{
  "family": "use-nerd",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "medusa",
      "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/use-nerd:latest",
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
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:..."
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/use-nerd",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "medusa"
        }
      }
    }
  ]
}
```

6. **Create ECS Service**
```bash
aws ecs create-service \
  --cluster use-nerd-cluster \
  --service-name medusa \
  --task-definition use-nerd \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}"
```

---

### Option 3: Railway / Render Deployment (Simple)

#### Railway

1. Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Deploy:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add services
railway add postgresql
railway add redis

# Deploy
railway up
```

#### Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: use-nerd-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
    autoDeploy: true

databases:
  - name: use-nerd-db
    databaseName: medusa
    user: medusa

  - name: use-nerd-redis
    plan: starter
```

2. Connect repository and deploy via Render dashboard

---

## Database Migrations

### Production Migration Strategy

```bash
# 1. Backup database
pg_dump -h HOST -U USER -d DATABASE > backup_$(date +%Y%m%d).sql

# 2. Run migrations
npx medusa migrations run

# 3. Verify
psql -h HOST -U USER -d DATABASE -c "SELECT * FROM migrations;"
```

### Rollback Plan

```bash
# Restore from backup if needed
psql -h HOST -U USER -d DATABASE < backup_YYYYMMDD.sql
```

---

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring & Logging

### Setup Application Monitoring

```typescript
// instrumentation.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Structured Logging

```typescript
// logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## Health Checks

Create health check endpoint:

```typescript
// src/api/health/route.ts
export const GET = async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: await checkDatabase(),
    redis: await checkRedis(),
  };

  res.status(200).json(health);
};
```

---

## Backup Strategy

### Automated Database Backups

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="medusa_db"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-backup-bucket/
```

### Cron Schedule
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## Security Checklist

- [ ] Environment variables secured (not in code)
- [ ] SSL/TLS enabled
- [ ] Database connections encrypted
- [ ] Firewall configured (only necessary ports open)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Private keys in HSM/KMS
- [ ] Regular security updates
- [ ] Monitoring and alerting setup
- [ ] Backup and recovery tested

---

## Portugues

### Visao Geral

Este guia cobre estrategias de deployment para a plataforma USE Nerd em diferentes ambientes.

### Pre-requisitos

- Node.js >= 20.x
- Banco de dados PostgreSQL 14+
- Instancia Redis 6+
- Nome de dominio com certificado SSL
- Conta de provedor cloud (AWS, GCP ou Azure)

### Variaveis de Ambiente

Variaveis de ambiente necessarias para producao:

```bash
# Aplicacao
NODE_ENV=production
PORT=9000

# Banco de Dados
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis
REDIS_URL=redis://host:6379

# Seguranca
JWT_SECRET=seu-jwt-secret-super-seguro-min-32-chars
COOKIE_SECRET=seu-cookie-secret-super-seguro-min-32-chars
```

---

## Opcoes de Deployment

### Opcao 1: Deployment Docker (Recomendado)

Ver secao em Ingles acima para detalhes completos.

### Opcao 2: Deployment AWS

Ver secao em Ingles acima para arquitetura e passos detalhados.

### Opcao 3: Railway / Render Deployment (Simples)

Ver secao em Ingles acima para configuracao.

---

## Migracoes de Banco de Dados

### Estrategia de Migracao em Producao

```bash
# 1. Backup do banco de dados
pg_dump -h HOST -U USER -d DATABASE > backup_$(date +%Y%m%d).sql

# 2. Executar migracoes
npx medusa migrations run

# 3. Verificar
psql -h HOST -U USER -d DATABASE -c "SELECT * FROM migrations;"
```

---

## Checklist de Seguranca

- [ ] Variaveis de ambiente seguras (nao no codigo)
- [ ] SSL/TLS habilitado
- [ ] Conexoes de banco de dados criptografadas
- [ ] Firewall configurado (apenas portas necessarias abertas)
- [ ] Rate limiting habilitado
- [ ] CORS configurado corretamente
- [ ] Chaves privadas em HSM/KMS
- [ ] Atualizacoes de seguranca regulares
- [ ] Monitoramento e alertas configurados
- [ ] Backup e recuperacao testados
