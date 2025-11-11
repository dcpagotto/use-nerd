# Makefile para USE Nerd E-commerce Platform
# Facilita comandos Docker comuns

.PHONY: help build up down restart logs clean migrate seed shell psql redis test

# Configurações
COMPOSE = docker-compose
SERVICE_BACKEND = medusa-backend
SERVICE_DB = postgres
SERVICE_REDIS = redis

# Cores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Exibe esta mensagem de ajuda
	@echo "$(BLUE)=========================================$(NC)"
	@echo "$(BLUE)    USE Nerd - Comandos Docker$(NC)"
	@echo "$(BLUE)=========================================$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

build: ## Faz build das imagens Docker
	@echo "$(BLUE)Fazendo build das imagens...$(NC)"
	$(COMPOSE) build

up: ## Inicia todos os serviços
	@echo "$(GREEN)Iniciando serviços...$(NC)"
	$(COMPOSE) up -d
	@echo "$(GREEN)Aguardando serviços ficarem prontos...$(NC)"
	@sleep 5
	@echo "$(GREEN)✓ Serviços iniciados!$(NC)"
	@echo ""
	@echo "$(YELLOW)Serviços disponíveis:$(NC)"
	@echo "  - Backend API: http://localhost:9000"
	@echo "  - Admin Dashboard: http://localhost:9000/app"
	@echo "  - PostgreSQL: localhost:5432"
	@echo "  - Redis: localhost:6379"
	@echo ""

down: ## Para todos os serviços
	@echo "$(RED)Parando serviços...$(NC)"
	$(COMPOSE) down

restart: down up ## Reinicia todos os serviços

logs: ## Exibe logs de todos os serviços
	$(COMPOSE) logs -f

logs-backend: ## Exibe logs apenas do backend
	$(COMPOSE) logs -f $(SERVICE_BACKEND)

logs-db: ## Exibe logs apenas do PostgreSQL
	$(COMPOSE) logs -f $(SERVICE_DB)

logs-redis: ## Exibe logs apenas do Redis
	$(COMPOSE) logs -f $(SERVICE_REDIS)

clean: down ## Para serviços e remove volumes
	@echo "$(RED)Removendo volumes...$(NC)"
	$(COMPOSE) down -v
	@echo "$(GREEN)✓ Limpeza concluída!$(NC)"

clean-all: clean ## Remove tudo (volumes, imagens, networks)
	@echo "$(RED)Removendo imagens...$(NC)"
	docker rmi use-nerd-backend 2>/dev/null || true
	@echo "$(GREEN)✓ Limpeza completa concluída!$(NC)"

rebuild: clean build up ## Rebuild completo

migrate: ## Executa migrations do banco de dados
	@echo "$(BLUE)Executando migrations...$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) npm run medusa db:migrate
	@echo "$(GREEN)✓ Migrations concluídas!$(NC)"

seed: ## Executa seed de dados
	@echo "$(BLUE)Executando seed...$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) npm run seed
	@echo "$(GREEN)✓ Seed concluído!$(NC)"

shell: ## Abre shell no container do backend
	@echo "$(BLUE)Abrindo shell no backend...$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) sh

shell-db: ## Abre shell no container do PostgreSQL
	@echo "$(BLUE)Abrindo shell no PostgreSQL...$(NC)"
	$(COMPOSE) exec $(SERVICE_DB) sh

psql: ## Conecta ao PostgreSQL via psql
	@echo "$(BLUE)Conectando ao PostgreSQL...$(NC)"
	$(COMPOSE) exec $(SERVICE_DB) psql -U postgres -d use-nerd

redis-cli: ## Conecta ao Redis via redis-cli
	@echo "$(BLUE)Conectando ao Redis...$(NC)"
	$(COMPOSE) exec $(SERVICE_REDIS) redis-cli

test: ## Executa testes
	@echo "$(BLUE)Executando testes...$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) npm test

test-unit: ## Executa testes unitários
	@echo "$(BLUE)Executando testes unitários...$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) npm run test:unit

test-integration: ## Executa testes de integração
	@echo "$(BLUE)Executando testes de integração...$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) npm run test:integration:http

status: ## Mostra status dos containers
	@echo "$(BLUE)Status dos containers:$(NC)"
	@$(COMPOSE) ps

health: ## Verifica health dos serviços
	@echo "$(BLUE)Verificando health dos serviços...$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend:$(NC)"
	@curl -f http://localhost:9000/health 2>/dev/null && echo " $(GREEN)✓ OK$(NC)" || echo " $(RED)✗ Erro$(NC)"
	@echo ""
	@echo "$(YELLOW)PostgreSQL:$(NC)"
	@$(COMPOSE) exec $(SERVICE_DB) pg_isready -U postgres && echo " $(GREEN)✓ OK$(NC)" || echo " $(RED)✗ Erro$(NC)"
	@echo ""
	@echo "$(YELLOW)Redis:$(NC)"
	@$(COMPOSE) exec $(SERVICE_REDIS) redis-cli ping 2>/dev/null && echo " $(GREEN)✓ OK$(NC)" || echo " $(RED)✗ Erro$(NC)"
	@echo ""

install: ## Instala dependências
	@echo "$(BLUE)Instalando dependências...$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) npm install

npm: ## Executa comando npm (use: make npm cmd="install express")
	@echo "$(BLUE)Executando: npm $(cmd)$(NC)"
	$(COMPOSE) exec $(SERVICE_BACKEND) npm $(cmd)

stats: ## Mostra estatísticas de recursos
	docker stats use-nerd-backend use-nerd-postgres use-nerd-redis --no-stream

backup-db: ## Cria backup do banco de dados
	@echo "$(BLUE)Criando backup do banco...$(NC)"
	@mkdir -p backups
	$(COMPOSE) exec -T $(SERVICE_DB) pg_dump -U postgres use-nerd | gzip > backups/backup-$$(date +%Y%m%d-%H%M%S).sql.gz
	@echo "$(GREEN)✓ Backup criado em backups/$(NC)"

restore-db: ## Restaura backup do banco (use: make restore-db file=backup.sql.gz)
	@echo "$(BLUE)Restaurando backup: $(file)$(NC)"
	@gunzip < $(file) | $(COMPOSE) exec -T $(SERVICE_DB) psql -U postgres -d use-nerd
	@echo "$(GREEN)✓ Backup restaurado!$(NC)"

.DEFAULT_GOAL := help
