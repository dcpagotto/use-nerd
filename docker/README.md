# Documentação Docker - USE Nerd E-commerce Platform

Esta documentação explica como usar o ambiente Docker para desenvolvimento do USE Nerd.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Início Rápido](#início-rápido)
- [Serviços Disponíveis](#serviços-disponíveis)
- [Comandos Principais](#comandos-principais)
- [Desenvolvimento](#desenvolvimento)
- [Migrations e Seed](#migrations-e-seed)
- [Troubleshooting](#troubleshooting)
- [Boas Práticas](#boas-práticas)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker Desktop**: versão 20.10 ou superior
  - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - Mac: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/)

- **Docker Compose**: versão 2.0 ou superior (incluído no Docker Desktop)

- **Git**: para controle de versão

### Verificar Instalação

```bash
docker --version
# Docker version 24.0.0 ou superior

docker-compose --version
# Docker Compose version v2.20.0 ou superior
```

---

## 🚀 Início Rápido

### 1. Clonar o Repositório (se ainda não fez)

```bash
git clone <url-do-repositorio>
cd use-nerd
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado para Docker. Verifique se os valores estão corretos:

```bash
# Verificar configuração
cat .env
```

**Importante**: Para Docker, certifique-se de que:
- `DATABASE_URL` usa `postgres` como host (não `localhost`)
- `REDIS_URL` usa `redis` como host (não `localhost`)

### 3. Iniciar os Serviços

```bash
# Usando docker-compose diretamente
docker-compose up -d

# OU usando o Makefile (recomendado)
make up
```

Aguarde alguns segundos para os serviços iniciarem. Você verá:

```
✓ Network use-nerd-network        Created
✓ Volume use-nerd-postgres-data   Created
✓ Volume use-nerd-redis-data      Created
✓ Container use-nerd-postgres     Healthy
✓ Container use-nerd-redis        Healthy
✓ Container use-nerd-backend      Started
```

### 4. Executar Migrations

```bash
# Executar migrations do banco de dados
make migrate

# OU
docker-compose exec medusa-backend npm run medusa db:migrate
```

### 5. (Opcional) Executar Seed de Dados

```bash
# Popula o banco com dados de exemplo
make seed

# OU
docker-compose exec medusa-backend npm run seed
```

### 6. Acessar a Aplicação

Abra seu navegador e acesse:

- **Backend API**: http://localhost:9000
- **Admin Dashboard**: http://localhost:9000/app
- **Health Check**: http://localhost:9000/health

---

## 🐳 Serviços Disponíveis

### PostgreSQL (Database)
- **Container**: `use-nerd-postgres`
- **Imagem**: `postgres:15-alpine`
- **Porta**: `5432:5432`
- **Database**: `use-nerd`
- **Usuário**: `postgres`
- **Senha**: `postgres`
- **Volume**: Dados persistidos em `use-nerd-postgres-data`

### Redis (Cache & Queue)
- **Container**: `use-nerd-redis`
- **Imagem**: `redis:7-alpine`
- **Porta**: `6379:6379`
- **Volume**: Dados persistidos em `use-nerd-redis-data`

### Medusa Backend
- **Container**: `use-nerd-backend`
- **Build**: Dockerfile multi-stage
- **Portas**:
  - `9000:9000` - Backend API
  - `5173:5173` - Admin Dev Server
- **Volumes**:
  - Bind mount do código fonte (hot reload)
  - Volume isolado para `node_modules` (performance)
  - Volume para build artifacts (`.medusa`)

### Network
- **Nome**: `use-nerd-network`
- **Driver**: bridge
- **Permite comunicação entre todos os containers**

---

## 📝 Comandos Principais

### Usando Makefile (Recomendado)

```bash
# Listar todos os comandos disponíveis
make help

# Iniciar serviços
make up

# Parar serviços
make down

# Reiniciar serviços
make restart

# Ver logs de todos os serviços
make logs

# Ver logs apenas do backend
make logs-backend

# Executar migrations
make migrate

# Executar seed
make seed

# Abrir shell no backend
make shell

# Conectar ao PostgreSQL
make psql

# Conectar ao Redis
make redis-cli

# Executar testes
make test

# Ver status dos containers
make status

# Verificar health dos serviços
make health

# Limpar tudo (volumes, containers)
make clean
```

### Usando Docker Compose Diretamente

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f medusa-backend

# Executar comando em um container
docker-compose exec medusa-backend <comando>

# Rebuild de imagens
docker-compose up -d --build

# Remover volumes
docker-compose down -v
```

---

## 💻 Desenvolvimento

### Hot Reload

O código fonte está montado como volume bind no container. Qualquer alteração nos arquivos locais será refletida automaticamente no container graças ao `npm run dev` do Medusa.

**Arquivos monitorados:**
- `src/**/*.ts` - Código TypeScript
- `medusa-config.ts` - Configuração do Medusa

### Instalar Novas Dependências

```bash
# Entrar no container
make shell

# Instalar pacote
npm install <pacote>

# Sair
exit

# OU executar diretamente
docker-compose exec medusa-backend npm install <pacote>
```

### Executar Comandos npm

```bash
# Usar o Makefile
make npm cmd="install express"
make npm cmd="run build"

# OU diretamente
docker-compose exec medusa-backend npm <comando>
```

### Acessar Shell dos Containers

```bash
# Backend (Node.js)
make shell
# OU
docker-compose exec medusa-backend sh

# PostgreSQL
make shell-db
# OU
docker-compose exec postgres sh

# Redis
docker-compose exec redis sh
```

### Conectar a Bancos de Dados

#### PostgreSQL (psql)

```bash
# Usando Makefile
make psql

# OU diretamente
docker-compose exec postgres psql -U postgres -d use-nerd

# Comandos úteis no psql:
\l              # Listar databases
\c use-nerd     # Conectar ao database
\dt             # Listar tabelas
\d+ <tabela>    # Descrever tabela
\q              # Sair
```

#### Redis (redis-cli)

```bash
# Usando Makefile
make redis-cli

# OU diretamente
docker-compose exec redis redis-cli

# Comandos úteis no redis-cli:
PING                # Testar conexão
KEYS *              # Listar todas as keys
GET <key>           # Obter valor
SET <key> <value>   # Definir valor
FLUSHALL            # Limpar tudo
EXIT                # Sair
```

---

## 🗄️ Migrations e Seed

### Migrations

Migrations são usados para criar/alterar estrutura do banco de dados.

```bash
# Executar migrations pendentes
make migrate

# OU
docker-compose exec medusa-backend npm run medusa db:migrate

# Criar nova migration (apenas em desenvolvimento local)
# Altere o código primeiro, depois execute:
npm run medusa db:generate <nome-da-migration>
```

### Seed de Dados

Seed popula o banco com dados iniciais para desenvolvimento.

```bash
# Executar seed
make seed

# OU
docker-compose exec medusa-backend npm run seed
```

**Nota**: O script de seed está localizado em `src/scripts/seed.ts`

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
make test

# Testes unitários
make test-unit

# Testes de integração HTTP
docker-compose exec medusa-backend npm run test:integration:http

# Testes de integração de módulos
docker-compose exec medusa-backend npm run test:integration:modules
```

### Ambiente de Testes

Os testes usam um banco de dados separado automaticamente. Não é necessário configurar nada adicional.

---

## 🔧 Troubleshooting

### Problema: Containers não iniciam

**Sintomas**: `docker-compose up` falha ou containers ficam em loop.

**Soluções**:

1. Verificar logs:
   ```bash
   docker-compose logs
   ```

2. Verificar se as portas estão ocupadas:
   ```bash
   # Windows
   netstat -ano | findstr :9000
   netstat -ano | findstr :5432
   netstat -ano | findstr :6379

   # Linux/Mac
   lsof -i :9000
   lsof -i :5432
   lsof -i :6379
   ```

3. Limpar e reiniciar:
   ```bash
   make clean
   make up
   ```

### Problema: "Cannot connect to database"

**Sintomas**: Backend não consegue conectar ao PostgreSQL.

**Soluções**:

1. Verificar se PostgreSQL está healthy:
   ```bash
   docker-compose ps
   ```

2. Verificar DATABASE_URL no `.env`:
   ```bash
   # Deve usar 'postgres' como host, não 'localhost'
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/use-nerd
   ```

3. Reiniciar serviços:
   ```bash
   make restart
   ```

4. Verificar logs do PostgreSQL:
   ```bash
   make logs-db
   ```

### Problema: "Cannot connect to Redis"

**Sintomas**: Erros relacionados ao Redis nos logs.

**Soluções**:

1. Verificar se Redis está rodando:
   ```bash
   docker-compose ps redis
   ```

2. Verificar REDIS_URL no `.env`:
   ```bash
   # Deve usar 'redis' como host, não 'localhost'
   REDIS_URL=redis://redis:6379
   ```

3. Testar conexão Redis:
   ```bash
   make redis-cli
   PING
   # Deve retornar: PONG
   ```

### Problema: Hot reload não funciona

**Sintomas**: Alterações no código não refletem no container.

**Soluções**:

1. Verificar se o volume está montado corretamente:
   ```bash
   docker-compose exec medusa-backend ls -la /app
   # Deve listar seus arquivos
   ```

2. No Windows, habilitar "Use the WSL 2 based engine" no Docker Desktop

3. Reiniciar o container do backend:
   ```bash
   docker-compose restart medusa-backend
   ```

### Problema: Permissões de arquivos (Linux/Mac)

**Sintomas**: Erros de permissão ao acessar arquivos.

**Soluções**:

1. O Dockerfile usa usuário `nodejs` (UID 1001). Ajustar permissões:
   ```bash
   sudo chown -R 1001:1001 .
   ```

2. OU executar container como seu usuário:
   ```bash
   # Editar docker-compose.yml
   user: "${UID}:${GID}"
   ```

### Problema: Lentidão no Windows

**Sintomas**: Hot reload muito lento, build demora muito.

**Soluções**:

1. Usar WSL 2 (recomendado):
   - Instalar WSL 2
   - Mover projeto para sistema de arquivos Linux: `/home/usuario/projetos/`
   - Docker Desktop automaticamente detecta WSL 2

2. Ajustar configurações Docker Desktop:
   - Resources > Advanced
   - Aumentar CPU e Memory

3. Usar volume para `node_modules` (já configurado):
   ```yaml
   volumes:
     - .:/app
     - /app/node_modules  # Volume isolado
   ```

### Problema: "Port already in use"

**Sintomas**: Erro ao iniciar serviços.

**Soluções**:

1. Identificar processo usando a porta:
   ```bash
   # Windows
   netstat -ano | findstr :9000

   # Linux/Mac
   lsof -i :9000
   ```

2. Matar processo ou alterar porta no `docker-compose.yml`:
   ```yaml
   ports:
     - "9001:9000"  # Usar porta 9001 no host
   ```

### Problema: Migrations falham

**Sintomas**: Erro ao executar `make migrate`.

**Soluções**:

1. Verificar se banco está acessível:
   ```bash
   make psql
   ```

2. Verificar migrations existentes:
   ```bash
   docker-compose exec medusa-backend ls -la .medusa/migrations
   ```

3. Resetar banco (CUIDADO: apaga todos os dados):
   ```bash
   make clean
   make up
   make migrate
   make seed
   ```

### Problema: Erro "ENOSPC: System limit for file watchers reached"

**Sintomas**: (Linux) Hot reload para de funcionar.

**Soluções**:

```bash
# Aumentar limite de file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Verificar Health dos Serviços

```bash
# Comando rápido para verificar tudo
make health

# Verificar individualmente
curl http://localhost:9000/health
docker-compose exec postgres pg_isready
docker-compose exec redis redis-cli ping
```

---

## 📊 Monitoramento e Logs

### Ver Logs em Tempo Real

```bash
# Todos os serviços
make logs

# Apenas backend
make logs-backend

# Apenas database
make logs-db

# Apenas redis
make logs-redis
```

### Verificar Uso de Recursos

```bash
# Estatísticas de CPU, memória, I/O
make stats

# OU
docker stats use-nerd-backend use-nerd-postgres use-nerd-redis
```

### Inspecionar Containers

```bash
# Informações detalhadas
docker inspect use-nerd-backend

# Processos rodando no container
docker top use-nerd-backend

# Listar volumes
docker volume ls
```

---

## 💾 Backup e Restore

### Backup do Banco de Dados

```bash
# Criar backup
make backup-db

# OU manualmente
docker-compose exec -T postgres pg_dump -U postgres use-nerd | gzip > backup.sql.gz
```

Os backups são salvos em `backups/backup-YYYYMMDD-HHMMSS.sql.gz`

### Restore do Banco de Dados

```bash
# Restaurar backup
make restore-db file=backups/backup-20231210-143022.sql.gz

# OU manualmente
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U postgres -d use-nerd
```

**Atenção**: Restore sobrescreve dados existentes!

---

## 🧹 Limpeza

### Limpar Containers e Volumes

```bash
# Parar e remover containers + volumes
make clean

# Parar, remover containers, volumes E imagens
make clean-all
```

### Limpar Docker System (Global)

```bash
# Remover tudo não utilizado
docker system prune -a --volumes

# Espaço em disco usado pelo Docker
docker system df
```

---

## 🏗️ Build e Rebuild

### Rebuild de Imagens

```bash
# Rebuild completo
make rebuild

# OU
docker-compose up -d --build

# Build sem cache
docker-compose build --no-cache
```

### Build para Produção

```bash
# Build production target
docker build -t use-nerd-backend:prod --target production .

# Run production
docker run -d \
  -p 9000:9000 \
  -e DATABASE_URL=<url> \
  -e REDIS_URL=<url> \
  use-nerd-backend:prod
```

---

## 🔐 Boas Práticas

### Segurança

1. **Nunca commite o arquivo `.env`** com credenciais reais
2. Use `.env.example` como template
3. Em produção, use secrets managers (AWS Secrets Manager, Azure Key Vault)
4. Altere as senhas padrão (`JWT_SECRET`, `COOKIE_SECRET`)
5. Use HTTPS em produção

### Performance

1. Use volumes para `node_modules` (já configurado)
2. No Windows, prefira WSL 2
3. Limite recursos no Docker Desktop se necessário
4. Monitore uso de memória com `make stats`

### Desenvolvimento

1. **Sempre rode migrations** após pull de código novo
2. Use `make help` para descobrir comandos úteis
3. Verifique logs regularmente: `make logs-backend`
4. Teste localmente antes de comitar: `make test`
5. Mantenha containers atualizados: `docker-compose pull`

### Backup

1. Faça backup antes de migrations grandes
2. Automatize backups em produção
3. Teste restore periodicamente

---

## 🆘 Suporte

### Recursos Úteis

- **Medusa Docs**: https://docs.medusajs.com
- **Docker Docs**: https://docs.docker.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Redis Docs**: https://redis.io/docs

### Comandos de Emergência

```bash
# Parar tudo imediatamente
docker-compose down --remove-orphans

# Resetar tudo (CUIDADO: apaga dados!)
docker-compose down -v
docker volume rm use-nerd-postgres-data use-nerd-redis-data use-nerd-medusa-build

# Verificar o que está consumindo recursos
docker system df
docker stats --no-stream

# Ver todos os containers (inclusive parados)
docker ps -a
```

---

## 📚 Fluxo de Trabalho Recomendado

### Dia a Dia

```bash
# 1. Iniciar desenvolvimento
make up

# 2. Verificar se tudo está OK
make health

# 3. Ver logs em outra janela do terminal
make logs-backend

# 4. Desenvolver normalmente (hot reload ativo)
# Edite arquivos em src/

# 5. Se adicionar dependências
make npm cmd="install <pacote>"

# 6. Se alterar models/schema
make migrate

# 7. Executar testes
make test

# 8. Ao fim do dia
make down
```

### Após Pull de Código

```bash
# 1. Atualizar imagens se necessário
docker-compose pull

# 2. Rebuild se Dockerfile mudou
make rebuild

# 3. Executar novas migrations
make migrate

# 4. Verificar se tudo funciona
make health
make test
```

---

## 📝 Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Docker Desktop está rodando?
- [ ] Portas 9000, 5432, 6379 estão livres?
- [ ] Arquivo `.env` existe e está correto?
- [ ] Containers estão "Healthy"? (`docker-compose ps`)
- [ ] Logs mostram erros? (`make logs`)
- [ ] Migrations foram executadas? (`make migrate`)
- [ ] Espaço em disco suficiente? (`docker system df`)

---

**Última atualização**: 2025-11-11
**Versão da documentação**: 1.0
**Projeto**: USE Nerd E-commerce Platform
