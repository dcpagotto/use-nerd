#!/bin/bash
# init-db.sh - Script de inicialização do banco de dados
# Executa migrations e seed (opcional)

set -e

echo "=========================================="
echo "Inicializando Banco de Dados - USE Nerd"
echo "=========================================="

# Aguardar PostgreSQL estar pronto
echo "Aguardando PostgreSQL..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "PostgreSQL ainda não está pronto - aguardando..."
  sleep 2
done

echo "✓ PostgreSQL está pronto!"

# Aguardar Redis estar pronto
echo "Aguardando Redis..."
until redis-cli -h "$REDIS_HOST" ping 2>/dev/null | grep -q PONG; do
  echo "Redis ainda não está pronto - aguardando..."
  sleep 2
done

echo "✓ Redis está pronto!"

# Executar migrations
echo ""
echo "Executando migrations do Medusa..."
npm run medusa db:migrate

if [ $? -eq 0 ]; then
    echo "✓ Migrations executadas com sucesso!"
else
    echo "✗ Erro ao executar migrations!"
    exit 1
fi

# Executar seed (opcional, apenas em desenvolvimento)
if [ "$NODE_ENV" = "development" ] && [ "$RUN_SEED" = "true" ]; then
    echo ""
    echo "Executando seed de dados..."
    npm run seed

    if [ $? -eq 0 ]; then
        echo "✓ Seed executado com sucesso!"
    else
        echo "✗ Erro ao executar seed!"
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo "✓ Inicialização concluída com sucesso!"
echo "=========================================="
echo ""
echo "Serviços disponíveis:"
echo "  - Backend API: http://localhost:9000"
echo "  - Admin Dashboard: http://localhost:9000/app"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "=========================================="
