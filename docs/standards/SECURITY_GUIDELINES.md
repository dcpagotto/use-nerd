# Security Guidelines - USE Nerd Platform

**Project**: USE Nerd E-commerce Platform
**Version**: 1.0
**Last Updated**: 2025-11-18
**Maintained By**: Security Team

[English](#english) | [Português](#português)

---

## English

### Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [API Security](#api-security)
3. [Database Security](#database-security)
4. [Secrets Management](#secrets-management)
5. [OWASP Top 10 Compliance](#owasp-top-10-compliance)
6. [Payment Security](#payment-security)
7. [Future: Blockchain Security](#future-blockchain-security)
8. [Audit Logs](#audit-logs)
9. [Password Policies](#password-policies)
10. [Security Incident Response](#security-incident-response)

---

## Authentication & Authorization

### JWT Token Security

**Token Configuration**:

```typescript
// medusa-config.ts
export default {
  projectConfig: {
    jwt_secret: process.env.JWT_SECRET, // MUST be minimum 32 characters
    cookie_secret: process.env.COOKIE_SECRET, // MUST be minimum 32 characters
  },
};
```

**CRITICAL**: Never use weak secrets in production:

```bash
# ❌ BAD - Weak secrets
JWT_SECRET=secret123
COOKIE_SECRET=mysecret

# ✅ GOOD - Strong secrets (minimum 32 characters)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
COOKIE_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4
```

**Generate secure secrets**:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### Token Expiration

```typescript
// src/api/middlewares/auth.ts
import jwt from 'jsonwebtoken';

const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: '15m',      // Short-lived access tokens
  REFRESH_TOKEN: '7d',      // Longer-lived refresh tokens
  ADMIN_TOKEN: '8h',        // Admin sessions expire faster
};

export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN }
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET!,
    { expiresIn: TOKEN_EXPIRATION.REFRESH_TOKEN }
  );
}
```

### Role-Based Access Control (RBAC)

```typescript
// src/api/middlewares/rbac.ts
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  MODERATOR = 'moderator',
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        'Authentication required'
      );
    }

    if (!allowedRoles.includes(userRole)) {
      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
}

// Usage in routes
export const POST = [
  requireRole(UserRole.ADMIN),
  async (req: MedusaRequest, res: MedusaResponse) => {
    // Admin-only endpoint
  }
];
```

### Multi-Factor Authentication (MFA)

**Future implementation planned**:

```typescript
// src/modules/auth/services/mfa.ts
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export class MFAService {
  async generateSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `USE Nerd (${email})`,
      issuer: 'USE Nerd',
    });

    // Store secret.base32 encrypted in database
    await this.storeSecret(userId, secret.base32);

    // Generate QR code for authenticator app
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
    };
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const secret = await this.getSecret(userId);

    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow 2 time steps tolerance
    });
  }
}
```

---

## API Security

### Rate Limiting

**Protect against brute force and DDoS attacks**:

```typescript
// src/api/middlewares/rate-limit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL);

// General API rate limit
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate_limit:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for authentication endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate_limit:auth:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

// Payment endpoints - strict limits
export const paymentLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate_limit:payment:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 payment attempts per hour
  message: 'Too many payment attempts, please contact support.',
});
```

**Apply to routes**:

```typescript
// medusa-config.ts
export default {
  projectConfig: {
    http: {
      authCors: process.env.AUTH_CORS,
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
    },
  },
  middlewares: {
    '/store/*': [apiLimiter],
    '/store/auth/*': [authLimiter],
    '/store/payment/*': [paymentLimiter],
  },
};
```

### CORS Configuration

```typescript
// medusa-config.ts
const ALLOWED_ORIGINS = {
  store: process.env.STORE_CORS?.split(',') || ['https://www.usenerd.com.br'],
  admin: process.env.ADMIN_CORS?.split(',') || ['https://admin.usenerd.com.br'],
};

export default {
  projectConfig: {
    http: {
      storeCors: ALLOWED_ORIGINS.store.join(','),
      adminCors: ALLOWED_ORIGINS.admin.join(','),
      authCors: [...ALLOWED_ORIGINS.store, ...ALLOWED_ORIGINS.admin].join(','),
    },
  },
};
```

**NEVER allow wildcard CORS in production**:

```typescript
// ❌ BAD
storeCors: '*'

// ✅ GOOD
storeCors: 'https://www.usenerd.com.br,https://staging.usenerd.com.br'
```

### Input Validation

**Always validate and sanitize user input**:

```typescript
// src/utils/validators.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Email validation
export const emailSchema = z.string().email().max(255);

// CPF validation (Brazilian tax ID)
export const cpfSchema = z.string().regex(/^\d{11}$/).refine(isValidCPF, {
  message: 'Invalid CPF',
});

function isValidCPF(cpf: string): boolean {
  // CPF validation algorithm
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Phone validation
export const phoneSchema = z.string().regex(/^\+55\d{10,11}$/);

// Sanitize HTML input
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

// Usage in API route
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const schema = z.object({
    email: emailSchema,
    cpf: cpfSchema,
    phone: phoneSchema,
    message: z.string().max(1000).transform(sanitizeHtml),
  });

  const validated = schema.parse(req.body);
  // Use validated data
};
```

### SQL Injection Prevention

**ALWAYS use parameterized queries**:

```typescript
// ✅ GOOD - Parameterized query
const user = await manager.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ BAD - String concatenation (SQL injection vulnerability)
const user = await manager.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

**Use ORM methods when possible**:

```typescript
// ✅ GOOD - TypeORM safe queries
const user = await userRepository.findOne({
  where: { email: email }
});

const users = await userRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .getMany();
```

### XSS Protection

**Content Security Policy (CSP) Headers**:

```typescript
// src/api/middlewares/security-headers.ts
import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.mercadopago.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});
```

**Escape output in templates**:

```typescript
// Next.js automatically escapes JSX
<div>{user.name}</div> // ✅ Safe

// For dangerouslySetInnerHTML, sanitize first
import DOMPurify from 'isomorphic-dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(htmlContent)
}} />
```

---

## Database Security

### Encryption at Rest

**PostgreSQL encryption**:

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive data
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  cpf VARCHAR, -- Encrypted
  phone VARCHAR, -- Encrypted
  password_hash VARCHAR NOT NULL
);

-- Encrypt before insert
INSERT INTO users (id, email, cpf, phone, password_hash)
VALUES (
  'user_123',
  'user@example.com',
  pgp_sym_encrypt('12345678901', 'encryption_key'),
  pgp_sym_encrypt('+5511999999999', 'encryption_key'),
  '$2b$10$...'
);

-- Decrypt on select
SELECT
  id,
  email,
  pgp_sym_decrypt(cpf::bytea, 'encryption_key') as cpf,
  pgp_sym_decrypt(phone::bytea, 'encryption_key') as phone
FROM users;
```

### Connection Security

**Always use SSL for database connections**:

```bash
# .env.production
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require

# Even more secure - verify certificate
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=verify-full&sslrootcert=/path/to/ca-cert.pem
```

**TypeORM SSL configuration**:

```typescript
// medusa-config.ts
export default {
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    database_extra: {
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_SSL_CA,
      },
    },
  },
};
```

### Database User Permissions

**Principle of least privilege**:

```sql
-- Create application user with limited permissions
CREATE USER medusa_app WITH PASSWORD 'strong_password';

-- Grant only necessary permissions
GRANT CONNECT ON DATABASE medusa_production TO medusa_app;
GRANT USAGE ON SCHEMA public TO medusa_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO medusa_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO medusa_app;

-- Revoke dangerous permissions
REVOKE CREATE ON SCHEMA public FROM medusa_app;
REVOKE DROP ON ALL TABLES IN SCHEMA public FROM medusa_app;
```

### Backup Encryption

```bash
#!/bin/bash
# Encrypted backup script

# Backup and encrypt
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | \
  gzip | \
  openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:$BACKUP_PASSWORD > \
  backup_$(date +%Y%m%d).sql.gz.enc

# Decrypt and restore
openssl enc -aes-256-cbc -d -pbkdf2 -pass pass:$BACKUP_PASSWORD -in backup.sql.gz.enc | \
  gunzip | \
  psql -h $DB_HOST -U $DB_USER $DB_NAME
```

---

## Secrets Management

### Environment Variables

**NEVER commit secrets to Git**:

```bash
# .gitignore
.env
.env.local
.env.production
.env.*.local
*.pem
*.key
*.p12
credentials.json
```

### AWS Secrets Manager

```typescript
// src/utils/secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

export async function getSecret(secretName: string): Promise<string> {
  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    return response.SecretString!;
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

// Usage
const dbPassword = await getSecret('use-nerd/production/db-password');
const jwtSecret = await getSecret('use-nerd/production/jwt-secret');
```

### Docker Secrets

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  medusa:
    image: use-nerd/medusa
    secrets:
      - db_password
      - jwt_secret
    environment:
      DATABASE_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret

secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
```

```typescript
// Load secrets from files
import fs from 'fs';

function loadSecret(name: string): string {
  const secretFile = process.env[`${name}_FILE`];
  if (secretFile) {
    return fs.readFileSync(secretFile, 'utf8').trim();
  }
  return process.env[name] || '';
}

const dbPassword = loadSecret('DATABASE_PASSWORD');
const jwtSecret = loadSecret('JWT_SECRET');
```

### Secret Rotation

```typescript
// src/scripts/rotate-secrets.ts
import { SecretsManagerClient, UpdateSecretCommand } from '@aws-sdk/client-secrets-manager';
import crypto from 'crypto';

async function rotateJwtSecret() {
  const client = new SecretsManagerClient({ region: 'us-east-1' });

  // Generate new secret
  const newSecret = crypto.randomBytes(32).toString('hex');

  // Update in AWS Secrets Manager
  await client.send(new UpdateSecretCommand({
    SecretId: 'use-nerd/production/jwt-secret',
    SecretString: newSecret,
  }));

  console.log('JWT secret rotated successfully');
  console.log('IMPORTANT: Restart all application instances to pick up new secret');
}

// Run monthly via cron job
```

---

## OWASP Top 10 Compliance

### 1. Broken Access Control

**Mitigation**:
- ✅ Implement RBAC (see Authentication section)
- ✅ Deny by default (require explicit permissions)
- ✅ Validate ownership (users can only access their own data)

```typescript
// Check ownership before allowing access
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const orderId = req.params.id;
  const userId = req.user!.id;

  const order = await orderService.retrieve(orderId);

  // Verify user owns this order
  if (order.customer_id !== userId && req.user!.role !== UserRole.ADMIN) {
    throw new MedusaError(
      MedusaError.Types.FORBIDDEN,
      'You do not have access to this order'
    );
  }

  res.json({ order });
};
```

### 2. Cryptographic Failures

**Mitigation**:
- ✅ Use strong encryption (AES-256, RSA-2048+)
- ✅ TLS 1.2+ for all connections
- ✅ Never store passwords in plain text
- ✅ Use bcrypt for password hashing (cost factor >= 10)

```typescript
import bcrypt from 'bcrypt';

// Hash password
const SALT_ROUNDS = 12;
const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(plainPassword, passwordHash);
```

### 3. Injection

**Mitigation**:
- ✅ Use parameterized queries (see Database Security)
- ✅ Validate all input (see Input Validation)
- ✅ Escape output
- ✅ Use ORM/query builders

### 4. Insecure Design

**Mitigation**:
- ✅ Threat modeling during design phase
- ✅ Security requirements in user stories
- ✅ Secure design patterns (defense in depth)
- ✅ Code review before deployment

### 5. Security Misconfiguration

**Mitigation**:
- ✅ Disable debug mode in production
- ✅ Remove default credentials
- ✅ Keep dependencies up to date
- ✅ Minimal attack surface (disable unused features)

```typescript
// medusa-config.ts
export default {
  projectConfig: {
    // ❌ BAD
    database_logging: true, // Exposes queries in logs

    // ✅ GOOD
    database_logging: process.env.NODE_ENV === 'development',
  },
};
```

### 6. Vulnerable and Outdated Components

**Mitigation**:
- ✅ Regular dependency updates
- ✅ Automated vulnerability scanning
- ✅ Remove unused dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# For unfixable vulnerabilities, evaluate risk
npm audit --production
```

**GitHub Dependabot configuration**:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
```

### 7. Identification and Authentication Failures

**Mitigation**:
- ✅ Strong password requirements
- ✅ Multi-factor authentication (planned)
- ✅ Secure session management
- ✅ Rate limiting on auth endpoints

### 8. Software and Data Integrity Failures

**Mitigation**:
- ✅ Verify dependencies (package-lock.json)
- ✅ Code signing
- ✅ CI/CD pipeline security
- ✅ Checksum verification

### 9. Security Logging and Monitoring Failures

**Mitigation**:
- ✅ Comprehensive audit logging (see Audit Logs section)
- ✅ Real-time alerting
- ✅ Centralized log management
- ✅ Regular log review

### 10. Server-Side Request Forgery (SSRF)

**Mitigation**:
- ✅ Whitelist allowed URLs
- ✅ Validate and sanitize URLs
- ✅ Network segmentation

```typescript
// Validate webhook URLs
const ALLOWED_WEBHOOK_DOMAINS = [
  'api.mercadopago.com',
  'webhook.efi.com.br',
];

function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_WEBHOOK_DOMAINS.some(domain => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
}
```

---

## Payment Security

### PCI DSS Compliance

**NEVER store credit card data**:

```typescript
// ❌ BAD - Never do this
interface Payment {
  card_number: string; // NEVER STORE
  cvv: string;         // NEVER STORE
  expiry: string;
}

// ✅ GOOD - Use payment gateway tokens
interface Payment {
  payment_method_id: string; // Token from Mercado Pago/Stripe
  last4: string;             // Only last 4 digits for display
  brand: string;             // Card brand (Visa, Mastercard)
}
```

### PIX Payment Security

```typescript
// src/modules/brazil/services/pix.ts
import crypto from 'crypto';

export class PixService {
  /**
   * Generate secure PIX QR Code with expiration
   */
  async generatePixQrCode(orderId: string, amount: number): Promise<string> {
    // Generate unique transaction ID
    const txId = crypto.randomBytes(16).toString('hex');

    const pixPayload = {
      txid: txId,
      valor: {
        original: (amount / 100).toFixed(2), // Convert cents to reais
      },
      chave: process.env.PIX_KEY,
      solicitacaoPagador: `Pedido #${orderId}`,
      infoAdicionais: [
        {
          nome: 'Order ID',
          valor: orderId,
        },
      ],
      calendario: {
        expiracao: 3600, // 1 hour expiration
      },
    };

    // Call PIX provider API
    const response = await this.pixProvider.createCharge(pixPayload);

    // Store txid for webhook verification
    await this.storePixTransaction(txId, orderId, amount);

    return response.qrcode;
  }

  /**
   * Verify PIX webhook authenticity
   */
  async verifyPixWebhook(signature: string, payload: any): Promise<boolean> {
    const secret = process.env.PIX_WEBHOOK_SECRET!;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}
```

### Payment Idempotency

```typescript
// Prevent duplicate payments
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'Idempotency-Key header required'
    );
  }

  // Check if request already processed
  const existingPayment = await paymentRepository.findOne({
    where: { idempotency_key: idempotencyKey }
  });

  if (existingPayment) {
    // Return cached response
    return res.json({ payment: existingPayment });
  }

  // Process payment
  const payment = await paymentService.create({
    ...req.body,
    idempotency_key: idempotencyKey,
  });

  res.json({ payment });
};
```

---

## Future: Blockchain Security

**Smart contract security best practices** (for when blockchain module is implemented):

### Smart Contract Auditing

```solidity
// contracts/Raffle.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Raffle is ReentrancyGuard, Ownable, Pausable {
    // ✅ Use ReentrancyGuard to prevent reentrancy attacks
    // ✅ Use Ownable for access control
    // ✅ Use Pausable for emergency stops

    // ✅ Check-Effects-Interactions pattern
    function purchaseTicket() external payable nonReentrant whenNotPaused {
        // 1. Checks
        require(msg.value == ticketPrice, "Incorrect payment");
        require(ticketsSold < totalTickets, "Sold out");

        // 2. Effects (update state BEFORE external calls)
        ticketsSold++;
        tickets[msg.sender]++;

        // 3. Interactions (external calls LAST)
        emit TicketPurchased(msg.sender, msg.value);
    }

    // ✅ Use pull over push for payments
    mapping(address => uint256) public pendingWithdrawals;

    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingWithdrawals[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }
}
```

### Private Key Management

```typescript
// NEVER commit private keys to Git
// Store in AWS Secrets Manager or hardware wallet

// For server-side signing (use with caution)
import { Wallet } from 'ethers';

const privateKey = await getSecret('use-nerd/production/polygon-private-key');
const wallet = new Wallet(privateKey);

// For user wallets - NEVER store private keys
// Use WalletConnect or similar
```

---

## Audit Logs

### Comprehensive Event Logging

```typescript
// src/utils/audit-logger.ts
import winston from 'winston';

interface AuditLogEntry {
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  metadata?: any;
}

export class AuditLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/audit.log' }),
        // Send to centralized logging (CloudWatch, Datadog, etc.)
      ],
    });
  }

  log(entry: AuditLogEntry): void {
    this.logger.info('AUDIT', entry);
  }
}

// Usage
export const auditLogger = new AuditLogger();
```

**Log critical actions**:

```typescript
// src/modules/raffle/services/raffle.ts
export class RaffleService {
  async purchaseTicket(raffleId: string, customerId: string, quantity: number) {
    try {
      // Process purchase
      const result = await this.processPurchase(raffleId, customerId, quantity);

      // Audit log
      auditLogger.log({
        timestamp: new Date(),
        userId: customerId,
        userEmail: result.customer.email,
        action: 'PURCHASE_RAFFLE_TICKETS',
        resource: 'raffle',
        resourceId: raffleId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        success: true,
        metadata: {
          quantity,
          totalPrice: quantity * result.raffle.ticket_price,
        },
      });

      return result;
    } catch (error) {
      // Log failed attempt
      auditLogger.log({
        timestamp: new Date(),
        userId: customerId,
        action: 'PURCHASE_RAFFLE_TICKETS',
        resource: 'raffle',
        resourceId: raffleId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        success: false,
        metadata: { error: error.message },
      });

      throw error;
    }
  }
}
```

### Events to Always Log

- ✅ Authentication (login, logout, failed attempts)
- ✅ Authorization failures
- ✅ Password changes
- ✅ User creation/deletion
- ✅ Payment transactions
- ✅ Raffle ticket purchases
- ✅ Admin actions
- ✅ Data exports
- ✅ Configuration changes
- ✅ API key usage

---

## Password Policies

### Password Requirements

```typescript
// src/utils/password-validator.ts
import zxcvbn from 'zxcvbn';

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minStrengthScore: number; // 0-4 (zxcvbn score)
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minStrengthScore: 3, // Good strength
};

export function validatePassword(
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check password strength
  const strength = zxcvbn(password);
  if (strength.score < policy.minStrengthScore) {
    errors.push(`Password is too weak. ${strength.feedback.warning || ''}`);
    if (strength.feedback.suggestions.length > 0) {
      errors.push(`Suggestions: ${strength.feedback.suggestions.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Password Hashing

```typescript
import bcrypt from 'bcrypt';

// Always use high cost factor (12+ recommended)
const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Timing-safe comparison to prevent timing attacks
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(a),
    Buffer.from(b)
  );
}
```

---

## Security Incident Response

### Incident Response Plan

**Phase 1: Detection & Analysis**

1. Monitor alerts (Sentry, CloudWatch, etc.)
2. Verify incident is legitimate (not false positive)
3. Assess severity (Critical, High, Medium, Low)
4. Notify security team

**Phase 2: Containment**

```typescript
// Emergency: Pause all operations
async function emergencyPause() {
  // Pause payment processing
  await setFeatureFlag('payments_enabled', false);

  // Pause raffle purchases
  await setFeatureFlag('raffle_purchases_enabled', false);

  // Rate limit to minimum
  await setRateLimit('global', 10); // 10 req/min

  // Notify team
  await sendAlert('EMERGENCY_PAUSE_ACTIVATED', {
    timestamp: new Date(),
    triggeredBy: 'security_team',
  });
}
```

**Phase 3: Eradication**

- Remove malicious code
- Patch vulnerabilities
- Update credentials
- Apply security updates

**Phase 4: Recovery**

- Restore from clean backups
- Gradually restore services
- Monitor closely

**Phase 5: Post-Incident**

- Write incident report
- Update security measures
- Team training
- Process improvements

### Contact Information

```
Security Team: security@usenerd.com.br
Emergency Hotline: +55 11 9999-9999
PGP Key: [Public key for encrypted communication]
```

---

## Português

### Sumário

1. [Autenticação e Autorização](#autenticação-e-autorização)
2. [Segurança da API](#segurança-da-api)
3. [Segurança do Banco de Dados](#segurança-do-banco-de-dados)
4. [Gerenciamento de Secrets](#gerenciamento-de-secrets)
5. [Conformidade OWASP Top 10](#conformidade-owasp-top-10)
6. [Segurança de Pagamentos](#segurança-de-pagamentos)
7. [Logs de Auditoria](#logs-de-auditoria)
8. [Políticas de Senha](#políticas-de-senha)

---

## Autenticação e Autorização

### Segurança de Tokens JWT

**CRÍTICO**: Nunca use secrets fracos em produção:

```bash
# ❌ RUIM - Secrets fracos
JWT_SECRET=secret123
COOKIE_SECRET=meusegredo

# ✅ BOM - Secrets fortes (mínimo 32 caracteres)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
COOKIE_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4
```

**Gerar secrets seguros**:

```bash
# Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Usando OpenSSL
openssl rand -hex 32
```

### Expiração de Tokens

```typescript
const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: '15m',      // Tokens de acesso de curta duração
  REFRESH_TOKEN: '7d',      // Tokens de refresh de longa duração
  ADMIN_TOKEN: '8h',        // Sessões admin expiram mais rápido
};
```

---

## Segurança da API

### Rate Limiting

**Proteção contra força bruta e ataques DDoS**:

```typescript
// Limite geral da API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por 15 minutos
  message: 'Muitas requisições, tente novamente mais tarde.',
});

// Limite mais rigoroso para endpoints de autenticação
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Máximo 5 tentativas de login por 15 minutos
  message: 'Muitas tentativas de login, tente novamente mais tarde.',
});
```

### Configuração CORS

```typescript
const ALLOWED_ORIGINS = {
  store: ['https://www.usenerd.com.br'],
  admin: ['https://admin.usenerd.com.br'],
};
```

**NUNCA permitir CORS wildcard em produção**:

```typescript
// ❌ RUIM
storeCors: '*'

// ✅ BOM
storeCors: 'https://www.usenerd.com.br'
```

### Validação de Input

**Sempre validar e sanitizar entrada do usuário**:

```typescript
// Validação de CPF (documento brasileiro)
export const cpfSchema = z.string().regex(/^\d{11}$/).refine(isValidCPF, {
  message: 'CPF inválido',
});

function isValidCPF(cpf: string): boolean {
  // Algoritmo de validação de CPF
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  // ... implementação completa
  return true;
}
```

---

## Segurança do Banco de Dados

### Criptografia em Repouso

**Criptografia PostgreSQL**:

```sql
-- Habilitar extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criptografar dados sensíveis
INSERT INTO users (cpf)
VALUES (pgp_sym_encrypt('12345678901', 'encryption_key'));

-- Descriptografar ao selecionar
SELECT pgp_sym_decrypt(cpf::bytea, 'encryption_key') as cpf FROM users;
```

### Segurança de Conexão

**Sempre use SSL para conexões de banco de dados**:

```bash
# .env.production
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
```

---

## Gerenciamento de Secrets

### Variáveis de Ambiente

**NUNCA commitar secrets no Git**:

```bash
# .gitignore
.env
.env.local
.env.production
*.pem
*.key
credentials.json
```

### AWS Secrets Manager

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({ region: 'us-east-1' });

  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );

  return response.SecretString!;
}
```

---

## Segurança de Pagamentos

### Conformidade PCI DSS

**NUNCA armazenar dados de cartão de crédito**:

```typescript
// ❌ RUIM - Nunca faça isso
interface Pagamento {
  numero_cartao: string; // NUNCA ARMAZENAR
  cvv: string;           // NUNCA ARMAZENAR
}

// ✅ BOM - Use tokens do gateway de pagamento
interface Pagamento {
  payment_method_id: string; // Token do Mercado Pago/Stripe
  ultimos4: string;          // Apenas últimos 4 dígitos para exibição
  bandeira: string;          // Bandeira do cartão (Visa, Mastercard)
}
```

### Segurança de Pagamento PIX

```typescript
export class PixService {
  /**
   * Gerar QR Code PIX seguro com expiração
   */
  async generatePixQrCode(pedidoId: string, valor: number): Promise<string> {
    // Gerar ID único de transação
    const txId = crypto.randomBytes(16).toString('hex');

    const pixPayload = {
      txid: txId,
      valor: {
        original: (valor / 100).toFixed(2), // Converter centavos para reais
      },
      chave: process.env.PIX_KEY,
      solicitacaoPagador: `Pedido #${pedidoId}`,
      calendario: {
        expiracao: 3600, // Expiração de 1 hora
      },
    };

    // Chamar API do provedor PIX
    const response = await this.pixProvider.createCharge(pixPayload);

    return response.qrcode;
  }

  /**
   * Verificar autenticidade do webhook PIX
   */
  async verifyPixWebhook(assinatura: string, payload: any): Promise<boolean> {
    const secret = process.env.PIX_WEBHOOK_SECRET!;

    const assinaturaEsperada = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(assinatura),
      Buffer.from(assinaturaEsperada)
    );
  }
}
```

---

## Logs de Auditoria

### Registro Abrangente de Eventos

```typescript
interface EntradaLogAuditoria {
  timestamp: Date;
  usuarioId: string;
  usuarioEmail: string;
  acao: string;
  recurso: string;
  recursoId: string;
  enderecoIP: string;
  userAgent: string;
  sucesso: boolean;
  metadados?: any;
}

export class AuditoriaLogger {
  log(entrada: EntradaLogAuditoria): void {
    this.logger.info('AUDITORIA', entrada);
  }
}
```

### Eventos para Sempre Registrar

- ✅ Autenticação (login, logout, tentativas falhadas)
- ✅ Falhas de autorização
- ✅ Mudanças de senha
- ✅ Criação/exclusão de usuário
- ✅ Transações de pagamento
- ✅ Compras de bilhetes de rifa
- ✅ Ações administrativas
- ✅ Exportações de dados
- ✅ Mudanças de configuração

---

## Políticas de Senha

### Requisitos de Senha

```typescript
export const POLITICA_SENHA_PADRAO: PoliticaSenha = {
  comprimentoMinimo: 12,
  requerMaiuscula: true,
  requerMinuscula: true,
  requerNumeros: true,
  requerCaracteresEspeciais: true,
  forcaMinimaScore: 3, // Força boa
};
```

### Hash de Senha

```typescript
import bcrypt from 'bcrypt';

// Sempre use fator de custo alto (12+ recomendado)
const SALT_ROUNDS = 12;

export async function hashPassword(senhaTexto: string): Promise<string> {
  return bcrypt.hash(senhaTexto, SALT_ROUNDS);
}

export async function verificarSenha(
  senhaTexto: string,
  senhaHash: string
): Promise<boolean> {
  return bcrypt.compare(senhaTexto, senhaHash);
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18
**Maintained By**: Security Team
**Contact**: security@usenerd.com.br
