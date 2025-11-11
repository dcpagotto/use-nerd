# USE Nerd - E-commerce Platform with Blockchain Raffle System

[English](#english) | [Portugues](#portugues)

---

## English

### Overview

USE Nerd is a modern e-commerce platform built for the Brazilian market, featuring an innovative blockchain-based raffle system. The platform combines the power of Medusa v2.0's commerce modules with Next.js 14 for the storefront and Polygon blockchain for transparent, verifiable raffle mechanics.

### Key Features

- Full-featured e-commerce platform powered by Medusa v2.0
- Blockchain-based raffle system using Polygon network
- Modern, responsive storefront built with Next.js 14
- Customizable admin dashboard
- Multi-payment gateway support
- Inventory management
- Order tracking and fulfillment
- Brazilian market optimizations (BRL currency, local payment methods)

### Tech Stack

- **Backend:** Medusa v2.0 (Node.js + TypeScript)
- **Frontend:** Next.js 14 (planned)
- **Blockchain:** Polygon (Matic)
- **Database:** PostgreSQL
- **Cache/Queue:** Redis
- **Testing:** Jest with 80% coverage target
- **Code Quality:** SOLID principles, Clean Code practices

### Project Status

This project is in active development. See [ROADMAP.md](./docs/ROADMAP.md) for current status and upcoming features.

### Quick Start

#### Prerequisites

- Node.js >= 20.x
- PostgreSQL 14+
- Redis 6+
- npm or yarn

#### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd use-nerd
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.template .env
# Edit .env with your database credentials and configuration
```

4. Run database migrations:
```bash
npx medusa migrations run
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The Medusa backend will be available at `http://localhost:9000`

### Project Structure

```
use-nerd/
├── src/
│   ├── admin/           # Custom admin UI components
│   ├── api/             # API routes (admin & store)
│   ├── jobs/            # Background jobs
│   ├── links/           # Module links
│   ├── modules/         # Custom modules (blockchain, raffle, etc.)
│   ├── scripts/         # Utility scripts
│   ├── subscribers/     # Event subscribers
│   └── workflows/       # Custom workflows
├── integration-tests/   # Integration test suites
├── docs/                # Project documentation
├── medusa-config.ts     # Medusa configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the production application
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run test:unit` - Run unit tests
- `npm run test:integration:http` - Run HTTP integration tests
- `npm run test:integration:modules` - Run module integration tests

### Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Module Documentation](./docs/modules/README.md)
- [Development Guide](./docs/development/README.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

### Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting pull requests.

Key points:
- Follow SOLID and Clean Code principles
- Write tests (minimum 80% coverage)
- Use conventional commits
- Update documentation

### License

MIT License - see [LICENSE](./LICENSE) file for details

### Support

- Documentation: [docs/](./docs)
- Issues: [GitHub Issues](https://github.com/your-org/use-nerd/issues)
- Discussions: [GitHub Discussions](https://github.com/your-org/use-nerd/discussions)

---

## Portugues

### Visao Geral

USE Nerd e uma plataforma de e-commerce moderna construida para o mercado brasileiro, apresentando um sistema inovador de sorteios baseado em blockchain. A plataforma combina o poder dos modulos de comercio do Medusa v2.0 com Next.js 14 para a loja virtual e blockchain Polygon para mecanicas de sorteio transparentes e verificaveis.

### Principais Funcionalidades

- Plataforma de e-commerce completa alimentada pelo Medusa v2.0
- Sistema de sorteios baseado em blockchain usando a rede Polygon
- Loja virtual moderna e responsiva construida com Next.js 14
- Painel administrativo customizavel
- Suporte a multiplos gateways de pagamento
- Gestao de inventario
- Rastreamento e fulfillment de pedidos
- Otimizacoes para o mercado brasileiro (moeda BRL, metodos de pagamento locais)

### Stack Tecnologico

- **Backend:** Medusa v2.0 (Node.js + TypeScript)
- **Frontend:** Next.js 14 (planejado)
- **Blockchain:** Polygon (Matic)
- **Banco de Dados:** PostgreSQL
- **Cache/Fila:** Redis
- **Testes:** Jest com meta de 80% de cobertura
- **Qualidade de Codigo:** Principios SOLID, praticas Clean Code

### Status do Projeto

Este projeto esta em desenvolvimento ativo. Veja [ROADMAP.md](./docs/ROADMAP.md) para status atual e funcionalidades futuras.

### Inicio Rapido

#### Pre-requisitos

- Node.js >= 20.x
- PostgreSQL 14+
- Redis 6+
- npm ou yarn

#### Instalacao

1. Clone o repositorio:
```bash
git clone <repository-url>
cd use-nerd
```

2. Instale as dependencias:
```bash
npm install
```

3. Configure as variaveis de ambiente:
```bash
cp .env.template .env
# Edite .env com suas credenciais de banco de dados e configuracao
```

4. Execute as migracoes do banco de dados:
```bash
npx medusa migrations run
```

5. Popule o banco de dados (opcional):
```bash
npm run seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O backend Medusa estara disponivel em `http://localhost:9000`

### Estrutura do Projeto

```
use-nerd/
├── src/
│   ├── admin/           # Componentes customizados da UI admin
│   ├── api/             # Rotas de API (admin & loja)
│   ├── jobs/            # Jobs em background
│   ├── links/           # Links de modulos
│   ├── modules/         # Modulos customizados (blockchain, sorteio, etc.)
│   ├── scripts/         # Scripts utilitarios
│   ├── subscribers/     # Subscribers de eventos
│   └── workflows/       # Workflows customizados
├── integration-tests/   # Suites de testes de integracao
├── docs/                # Documentacao do projeto
├── medusa-config.ts     # Configuracao do Medusa
├── tsconfig.json        # Configuracao do TypeScript
└── package.json         # Dependencias e scripts
```

### Scripts Disponiveis

- `npm run dev` - Inicia servidor de desenvolvimento com hot reload
- `npm run build` - Compila a aplicacao para producao
- `npm start` - Inicia servidor de producao
- `npm run seed` - Popula banco de dados com dados de exemplo
- `npm run test:unit` - Executa testes unitarios
- `npm run test:integration:http` - Executa testes de integracao HTTP
- `npm run test:integration:modules` - Executa testes de integracao de modulos

### Documentacao

- [Visao Geral da Arquitetura](./docs/ARCHITECTURE.md)
- [Referencia da API](./docs/API.md)
- [Documentacao de Modulos](./docs/modules/README.md)
- [Guia de Desenvolvimento](./docs/development/README.md)
- [Guia de Deploy](./docs/DEPLOYMENT.md)
- [Diretrizes de Contribuicao](./CONTRIBUTING.md)

### Contribuindo

Contribuicoes sao bem-vindas! Por favor, leia nossas [Diretrizes de Contribuicao](./CONTRIBUTING.md) antes de submeter pull requests.

Pontos principais:
- Siga os principios SOLID e Clean Code
- Escreva testes (minimo 80% de cobertura)
- Use commits convencionais
- Atualize a documentacao

### Licenca

Licenca MIT - veja o arquivo [LICENSE](./LICENSE) para detalhes

### Suporte

- Documentacao: [docs/](./docs)
- Issues: [GitHub Issues](https://github.com/your-org/use-nerd/issues)
- Discussoes: [GitHub Discussions](https://github.com/your-org/use-nerd/discussions)
