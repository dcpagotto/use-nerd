# 🚀 Guia Rápido - Docker (USE Nerd)

## Início Rápido (5 minutos)

### Primeira Vez

```bash
# 1. Iniciar serviços
docker-compose up -d

# 2. Executar migrations
docker-compose exec medusa-backend npm run medusa db:migrate

# 3. (Opcional) Carregar dados de exemplo
docker-compose exec medusa-backend npm run seed

# 4. Acessar aplicação
# http://localhost:9000
```

### Usando Makefile (Recomendado)

```bash
# Ver todos os comandos
make help

# Iniciar
make up

# Migrations
make migrate

# Seed
make seed

# Parar
make down
```

---

## Comandos Mais Usados

```bash
# Iniciar serviços
make up                  # docker-compose up -d

# Ver logs
make logs                # docker-compose logs -f
make logs-backend        # Apenas backend

# Parar serviços
make down                # docker-compose down

# Reiniciar
make restart             # down + up

# Migrations e Seed
make migrate             # Executar migrations
make seed                # Carregar dados de exemplo

# Acesso a shells
make shell               # Shell do backend
make psql                # PostgreSQL CLI
make redis-cli           # Redis CLI

# Testes
make test                # Executar todos os testes
make test-unit           # Apenas testes unitários

# Status
make status              # Ver status dos containers
make health              # Verificar health dos serviços

# Limpeza
make clean               # Parar e remover volumes
make clean-all           # Remover tudo
```

---

## Serviços e Portas

| Serviço | URL/Porta | Descrição |
|---------|-----------|-----------|
| Backend API | http://localhost:9000 | API REST do Medusa |
| Admin Dashboard | http://localhost:9000/app | Dashboard administrativo |
| PostgreSQL | localhost:5432 | Banco de dados |
| Redis | localhost:6379 | Cache e filas |

**Credenciais PostgreSQL:**
- Usuário: `postgres`
- Senha: `postgres`
- Database: `use-nerd`

---

## Troubleshooting Rápido

### Problema: Container não inicia

```bash
# Ver logs
make logs

# Reiniciar tudo
make restart

# Se persistir, limpar e reiniciar
make clean
make up
make migrate
```

### Problema: Porta já está em uso

```bash
# Windows - verificar porta 9000
netstat -ano | findstr :9000

# Linux/Mac
lsof -i :9000

# Matar processo ou alterar porta no docker-compose.yml
```

### Problema: Migrations falham

```bash
# Verificar se PostgreSQL está OK
make psql

# Se conectar, executar migrations novamente
make migrate

# Se não funcionar, resetar banco (CUIDADO: apaga dados)
make clean
make up
make migrate
make seed
```

### Problema: Hot reload não funciona

```bash
# Reiniciar apenas o backend
docker-compose restart medusa-backend

# Ver se arquivos estão montados
docker-compose exec medusa-backend ls -la /app
```

---

## Fluxo de Trabalho Diário

```bash
# Manhã - Iniciar desenvolvimento
make up

# Verificar se está tudo OK
make health

# Abrir logs em outra janela
make logs-backend

# Desenvolver normalmente...
# (hot reload está ativo)

# Noite - Parar serviços
make down
```

---

## Variáveis de Ambiente Importantes

Arquivo `.env` (já configurado para Docker):

```env
# Database (use 'postgres' como host, não 'localhost')
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/use-nerd

# Redis (use 'redis' como host, não 'localhost')
REDIS_URL=redis://redis:6379

# CORS
STORE_CORS=http://localhost:8000,http://localhost:3000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
AUTH_CORS=http://localhost:9000,http://localhost:5173

# Secrets (altere em produção!)
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

---

## Arquivos Importantes

```
use-nerd/
├── docker-compose.yml           # Configuração Docker
├── Dockerfile                   # Imagem do backend
├── .dockerignore                # Arquivos ignorados no build
├── Makefile                     # Comandos facilitados
├── .env                         # Variáveis de ambiente
├── docker/
│   ├── README.md               # Documentação completa
│   └── scripts/
│       ├── init-db.sh          # Script de inicialização
│       ├── wait-for-it.sh      # Aguardar serviços
│       └── first-time-setup.sh # Setup inicial
```

---

## Próximos Passos

1. **Ler documentação completa**: `docker/README.md`
2. **Explorar comandos**: `make help`
3. **Configurar IDE**: VSCode com Docker extension
4. **Começar a desenvolver**: Código em `src/`

---

## Links Úteis

- [Documentação Completa Docker](docker/README.md)
- [Medusa v2 Docs](https://docs.medusajs.com)
- [Docker Docs](https://docs.docker.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

**Dúvidas?** Consulte `docker/README.md` para troubleshooting detalhado.

**Versão**: 1.0 | **Data**: 2025-11-11
