# ✅ Checklist de Configuração Docker - USE Nerd

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Pré-Instalação

- [ ] Docker Desktop instalado (versão 20.10+)
- [ ] Docker Compose instalado (versão 2.0+)
- [ ] Git instalado
- [ ] Editor de código instalado (VSCode recomendado)

### Verificar Versões

```bash
docker --version
docker-compose --version
git --version
```

---

## 📁 Arquivos de Configuração

- [ ] `docker-compose.yml` existe no diretório raiz
- [ ] `Dockerfile` existe no diretório raiz
- [ ] `.dockerignore` existe no diretório raiz
- [ ] `.env` existe e está configurado
- [ ] `Makefile` existe (opcional mas recomendado)
- [ ] `docker/README.md` existe (documentação)
- [ ] `docker/scripts/` contém scripts auxiliares

### Verificar Arquivos

```bash
ls -la docker-compose.yml Dockerfile .dockerignore .env Makefile
ls -la docker/
```

---

## ⚙️ Configuração do .env

- [ ] `DATABASE_URL` usa `postgres` como host (não `localhost`)
- [ ] `REDIS_URL` usa `redis` como host (não `localhost`)
- [ ] `JWT_SECRET` está definido
- [ ] `COOKIE_SECRET` está definido
- [ ] `STORE_CORS` está configurado
- [ ] `ADMIN_CORS` está configurado
- [ ] `AUTH_CORS` está configurado

### Exemplo de Configuração Correta

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/use-nerd
REDIS_URL=redis://redis:6379
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

---

## 🔍 Validação de Sintaxe

- [ ] `docker-compose config` executa sem erros
- [ ] Dockerfile tem sintaxe válida
- [ ] Não há erros de YAML

### Validar

```bash
# Validar docker-compose.yml
docker-compose config

# OU usar script de validação
bash docker/scripts/validate-setup.sh
```

---

## 🚀 Primeira Execução

- [ ] Build das imagens concluído com sucesso
- [ ] Containers iniciaram sem erros
- [ ] PostgreSQL está "healthy"
- [ ] Redis está "healthy"
- [ ] Backend está rodando

### Iniciar Serviços

```bash
# Build e start
docker-compose up -d

# OU usando Makefile
make up

# Verificar status
docker-compose ps
```

### Status Esperado

```
NAME                  IMAGE              STATUS
use-nerd-postgres     postgres:15-alpine Up (healthy)
use-nerd-redis        redis:7-alpine     Up (healthy)
use-nerd-backend      use-nerd-backend   Up
```

---

## 🗄️ Banco de Dados

- [ ] PostgreSQL está acessível na porta 5432
- [ ] Database `use-nerd` existe
- [ ] Migrations executadas com sucesso
- [ ] (Opcional) Seed executado com sucesso

### Executar Migrations

```bash
# Executar migrations
make migrate

# OU
docker-compose exec medusa-backend npm run medusa db:migrate
```

### Executar Seed (Opcional)

```bash
# Executar seed
make seed

# OU
docker-compose exec medusa-backend npm run seed
```

### Testar Conexão PostgreSQL

```bash
# Conectar ao PostgreSQL
make psql

# OU
docker-compose exec postgres psql -U postgres -d use-nerd

# Comandos úteis:
\l              # Listar databases
\dt             # Listar tabelas
\q              # Sair
```

---

## 🔴 Redis

- [ ] Redis está acessível na porta 6379
- [ ] Redis responde a comandos PING

### Testar Conexão Redis

```bash
# Conectar ao Redis
make redis-cli

# OU
docker-compose exec redis redis-cli

# Testar
PING
# Deve retornar: PONG

EXIT
```

---

## 🌐 Aplicação Web

- [ ] Backend API responde em http://localhost:9000
- [ ] Health check retorna status OK
- [ ] Admin Dashboard acessível em http://localhost:9000/app
- [ ] Hot reload está funcionando

### Testar Endpoints

```bash
# Health check
curl http://localhost:9000/health

# Deve retornar algo como:
# {"status":"ok"}
```

### Testar no Navegador

1. Abrir http://localhost:9000 - Deve retornar JSON da API
2. Abrir http://localhost:9000/app - Deve abrir Admin Dashboard
3. Abrir http://localhost:9000/health - Deve retornar status

---

## 🔥 Hot Reload

- [ ] Volumes estão montados corretamente
- [ ] Alterações no código refletem automaticamente
- [ ] `npm run dev` está rodando no container

### Testar Hot Reload

1. Editar um arquivo em `src/`
2. Verificar logs: `make logs-backend`
3. Deve ver mensagem de reload
4. Verificar se mudança está refletida

---

## 🧪 Testes

- [ ] Testes unitários executam sem erros
- [ ] Testes de integração executam sem erros

### Executar Testes

```bash
# Todos os testes
make test

# Testes unitários
make test-unit

# Testes de integração
docker-compose exec medusa-backend npm run test:integration:http
```

---

## 📊 Logs e Monitoramento

- [ ] Logs do backend estão acessíveis
- [ ] Logs do PostgreSQL estão acessíveis
- [ ] Logs do Redis estão acessíveis
- [ ] Não há erros críticos nos logs

### Ver Logs

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

---

## 🔧 Comandos Úteis

- [ ] `make help` funciona e lista comandos
- [ ] `make shell` abre shell no backend
- [ ] `make psql` conecta ao PostgreSQL
- [ ] `make redis-cli` conecta ao Redis
- [ ] `make down` para os serviços
- [ ] `make restart` reinicia os serviços

### Testar Comandos

```bash
# Ajuda
make help

# Status
make status

# Health
make health

# Shell
make shell
# Dentro do shell:
pwd
ls -la
exit
```

---

## 🛡️ Segurança (Importante!)

- [ ] `.env` NÃO está commitado no Git
- [ ] `.env` está no `.gitignore`
- [ ] Senhas padrão foram alteradas (para produção)
- [ ] Secrets não estão expostos

### Verificar

```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep .env

# Verificar se .env não está sendo tracked
git status | grep .env
# Não deve aparecer
```

---

## 📚 Documentação

- [ ] `docker/README.md` foi lida
- [ ] `DOCKER_QUICK_START.md` foi consultado
- [ ] Scripts auxiliares foram explorados

---

## ✅ Verificação Final

Execute o script de validação automática:

```bash
bash docker/scripts/validate-setup.sh
```

Este script verifica:
- ✓ Pré-requisitos instalados
- ✓ Arquivos existem
- ✓ Sintaxe YAML válida
- ✓ Configurações corretas no .env
- ✓ Portas disponíveis
- ✓ Containers rodando
- ✓ Serviços respondendo

---

## 🚨 Troubleshooting

Se algum item falhou, consulte:

1. **docker/README.md** - Seção "Troubleshooting"
2. **Logs dos serviços**: `make logs`
3. **Status dos containers**: `make status`
4. **Health dos serviços**: `make health`

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| Porta ocupada | Ver `docker/README.md` - "Port already in use" |
| Database não conecta | Verificar DATABASE_URL no .env |
| Hot reload não funciona | Reiniciar backend: `docker-compose restart medusa-backend` |
| Migrations falham | Resetar: `make clean && make up && make migrate` |

---

## 📝 Notas Adicionais

### Para Windows

- [ ] WSL 2 está habilitado (recomendado para performance)
- [ ] Docker Desktop está configurado para usar WSL 2
- [ ] Projeto está no sistema de arquivos Linux (opcional, melhora performance)

### Para Linux/Mac

- [ ] Scripts têm permissão de execução (`chmod +x`)
- [ ] Docker pode ser executado sem sudo (opcional)

---

## 🎉 Conclusão

Se todos os itens estão marcados, sua configuração Docker está completa!

### Próximos Passos

1. **Começar a desenvolver**: Código em `src/`
2. **Explorar comandos**: `make help`
3. **Ler documentação Medusa**: https://docs.medusajs.com
4. **Configurar IDE**: Extensões Docker, TypeScript

### Comandos para o Dia a Dia

```bash
# Manhã
make up

# Durante o dia
make logs-backend  # Em outra janela

# Noite
make down
```

---

**Última atualização**: 2025-11-11
**Versão**: 1.0
**Projeto**: USE Nerd E-commerce Platform
