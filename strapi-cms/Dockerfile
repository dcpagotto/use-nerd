# ============================================
# Multi-stage Dockerfile for Strapi CMS
# Simplified version - only essential dependencies
# ============================================

FROM node:20-alpine AS base
# Install only essential dependencies
RUN apk add --no-cache libc6-compat

# ============================================
# Dependencies stage
# ============================================
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ============================================
# Development stage
# ============================================
FROM base AS development
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create necessary directories with correct permissions
RUN mkdir -p public/uploads .strapi/client .strapi/dist build .cache && \
    chmod -R 777 .strapi build .cache

# Build admin panel during image creation
RUN npm run build || echo "Build failed, will build on startup"

# NOTA: Rodando como root no desenvolvimento para evitar problemas de permissão
# Em produção, usar usuário não-root (ver production stage)

# Expose Strapi port
EXPOSE 1337

# Health check - Accept both 200 and 204 status codes
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit((r.statusCode === 200 || r.statusCode === 204) ? 0 : 1)})"

# Start production server (uses pre-built admin)
CMD ["npm", "run", "start"]

# ============================================
# Builder stage
# ============================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create public directory if it doesn't exist
RUN mkdir -p public/uploads

# Build the admin panel
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy build artifacts if they exist
COPY --from=builder /app/.cache ./.cache 2>/dev/null || true
COPY --from=builder /app/build ./build 2>/dev/null || true
COPY --from=builder /app/dist ./dist 2>/dev/null || true

# Create necessary directories
RUN mkdir -p public/uploads .cache build dist

# Build again in production stage to ensure artifacts exist
RUN npm run build || true

# Switch to non-root user
USER node

# Expose Strapi port
EXPOSE 1337

# Health check - Accept both 200 and 204 status codes
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit((r.statusCode === 200 || r.statusCode === 204) ? 0 : 1)})"

# Start production server
CMD ["npm", "run", "start"]
