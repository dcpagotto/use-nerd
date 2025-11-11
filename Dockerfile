# Multi-stage Dockerfile for Medusa v2.0 - USE Nerd E-commerce

# ============================================
# Base Stage - Common dependencies
# ============================================
FROM node:20-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    curl

# Configurar diretório de trabalho
WORKDIR /app

# Configurar variáveis de ambiente para otimização
ENV NODE_ENV=development \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# ============================================
# Dependencies Stage - Instalar dependências
# ============================================
FROM base AS dependencies

# Copiar apenas arquivos de dependências primeiro (cache layer)
COPY package.json package-lock.json* ./

# Instalar dependências (usar install ao invés de ci para maior flexibilidade)
RUN npm install --legacy-peer-deps

# ============================================
# Development Stage - Ambiente de desenvolvimento
# ============================================
FROM base AS development

# Copiar node_modules do stage anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY medusa-config.ts ./
COPY jest.config.js ./
COPY instrumentation.ts ./

# Copiar código fonte (será sobrescrito pelo volume em desenvolvimento)
COPY . .

# Criar diretórios necessários com permissões corretas
RUN mkdir -p /app/.medusa/client /app/.medusa/server && \
    chmod -R 777 /app/.medusa

# NOTA: Rodando como root no desenvolvimento para evitar problemas de permissão
# Em produção, usar usuário não-root (ver production stage)

# Expor portas
EXPOSE 9000 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:9000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando padrão
CMD ["npm", "run", "dev"]

# ============================================
# Build Stage - Build para produção
# ============================================
FROM dependencies AS builder

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# ============================================
# Production Stage - Imagem otimizada de produção
# ============================================
FROM node:20-alpine AS production

# Instalar apenas dependências runtime
RUN apk add --no-cache \
    libc6-compat \
    curl

WORKDIR /app

# Copiar apenas dependências de produção
COPY package.json package-lock.json* ./
RUN npm install --only=production --legacy-peer-deps && \
    npm cache clean --force

# Copiar build artifacts
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/dist ./dist
COPY medusa-config.ts ./

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expor porta do backend
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:9000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de produção
CMD ["npm", "run", "start"]
