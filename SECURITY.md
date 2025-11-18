# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in USE Nerd, please report it by emailing the maintainers directly. **Do not** open a public GitHub issue for security vulnerabilities.

## Secure Development Practices

### Environment Variables

**NEVER commit `.env` files to the repository!** Always use `.env.example` as a template.

#### Required Environment Variables (Local Development)

```bash
# Backend (Medusa)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/use-nerd
REDIS_URL=redis://localhost:6379
JWT_SECRET=[GENERATE_SECURE_RANDOM_STRING]
COOKIE_SECRET=[GENERATE_SECURE_RANDOM_STRING]

# Admin Credentials (SET YOUR OWN!)
ADMIN_EMAIL=[YOUR_ADMIN_EMAIL]
ADMIN_PASSWORD=[YOUR_SECURE_PASSWORD]

# Strapi CMS
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=[GENERATE_FROM_STRAPI_ADMIN]

# Payment Gateways
STRIPE_API_KEY=[YOUR_STRIPE_KEY]
STRIPE_WEBHOOK_SECRET=[YOUR_STRIPE_WEBHOOK_SECRET]
COINBASE_COMMERCE_API_KEY=[YOUR_COINBASE_KEY]
COINBASE_WEBHOOK_SECRET=[YOUR_COINBASE_WEBHOOK]

# Blockchain (Phase 2)
ALCHEMY_API_KEY=[YOUR_ALCHEMY_KEY]
CHAINLINK_VRF_SUBSCRIPTION_ID=[YOUR_SUBSCRIPTION_ID]
POLYGON_RPC_URL=[YOUR_POLYGON_RPC]
```

### Credentials Management

1. **Never hardcode credentials** in source code or documentation
2. Use environment variables for all secrets
3. Use secure password managers for storing credentials
4. Rotate API keys regularly
5. Use different credentials for development, staging, and production

### Docker Secrets (Production)

For production deployments, use Docker secrets or your cloud provider's secret management:

```bash
# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id use-nerd/production

# Azure Key Vault
az keyvault secret show --vault-name use-nerd-vault --name db-password

# Google Cloud Secret Manager
gcloud secrets versions access latest --secret="database-password"
```

### Database Security

1. **Never expose PostgreSQL port** (5432) publicly
2. Use strong passwords (min 16 characters, mixed case, numbers, symbols)
3. Enable SSL/TLS for database connections in production
4. Implement database backups with encryption
5. Use read-only database users for reporting/analytics

### API Security

1. **Rate limiting**: 100 requests/minute per IP (configurable)
2. **CORS**: Only allow trusted origins
3. **JWT tokens**: Short-lived (1 hour), refresh tokens (7 days)
4. **API keys**: Rotate every 90 days
5. **HTTPS only** in production

### Password Requirements

Minimum requirements for user passwords:
- 12 characters minimum
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot match common password lists

### Smart Contract Security (Phase 2)

1. **Audit all smart contracts** before deployment
2. Use OpenZeppelin audited contracts as base
3. Implement upgrade patterns (Proxy contracts)
4. Test on testnets (Mumbai) before mainnet
5. Use multi-signature wallets for contract ownership

### Vulnerability Scanning

Run security scans regularly:

```bash
# NPM audit
npm audit

# Snyk scanning
npx snyk test

# OWASP Dependency Check
docker run --rm -v $(pwd):/src owasp/dependency-check --scan /src
```

### Security Headers

Ensure these headers are set in production:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: no-referrer-when-downgrade
```

### OWASP Top 10 Compliance

This project follows OWASP Top 10 security standards:

1. ✅ **Injection Prevention**: Parameterized queries, input validation
2. ✅ **Broken Authentication**: JWT with refresh tokens, rate limiting
3. ✅ **Sensitive Data Exposure**: Encryption at rest and in transit
4. ✅ **XML External Entities (XXE)**: Not using XML parsers
5. ✅ **Broken Access Control**: RBAC implemented
6. ✅ **Security Misconfiguration**: Secure defaults, no debug in production
7. ✅ **Cross-Site Scripting (XSS)**: Input sanitization, CSP headers
8. ✅ **Insecure Deserialization**: Validation of all deserialized data
9. ✅ **Using Components with Known Vulnerabilities**: Regular updates
10. ✅ **Insufficient Logging & Monitoring**: Comprehensive audit logs

## Security Checklist for Contributors

Before submitting a PR, ensure:

- [ ] No credentials in code or documentation
- [ ] All secrets use environment variables
- [ ] Input validation on all user inputs
- [ ] SQL queries use parameterized statements
- [ ] Authentication required for sensitive endpoints
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive information
- [ ] All dependencies are up to date
- [ ] Security tests pass

## Incident Response

In case of a security incident:

1. **Contain**: Disable affected services immediately
2. **Assess**: Determine scope and impact
3. **Notify**: Inform users if data breach occurred
4. **Remediate**: Fix vulnerability and deploy patch
5. **Document**: Write post-mortem and update security policies

## Security Contacts

- **Security Email**: security@[YOUR_DOMAIN]
- **PGP Key**: [PROVIDE_PGP_KEY]

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Acknowledgments

We thank security researchers who responsibly disclose vulnerabilities to us.

---

**Last Updated**: November 2025
**Version**: 1.0
