# USE Nerd - Visão Geral do Projeto

**Projeto**: USE Nerd
**Versão**: 1.0
**Data**: 17 de Novembro de 2025
**Status**: Approved
**Autor**: Documentation Team

---

## Índice

1. [Resumo Executivo](#resumo-executivo)
2. [Objetivos do Projeto](#objetivos-do-projeto)
3. [Funcionalidades Atuais](#funcionalidades-atuais)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Arquitetura de Alto Nível](#arquitetura-de-alto-nível)
6. [Métricas de Sucesso](#métricas-de-sucesso)
7. [Time e Stakeholders](#time-e-stakeholders)

---

## Resumo Executivo

**USE Nerd** é uma plataforma de e-commerce moderna e inovadora construída especificamente para o mercado brasileiro, com foco em produtos geek/nerd e um diferencial competitivo único: um sistema de rifas verificado por blockchain. A plataforma combina a robustez do Medusa v2.0 como backend de e-commerce com Next.js 14 para uma experiência de usuário moderna e responsiva, além de integração com a blockchain Polygon para transparência e verificação de sorteios.

O projeto está atualmente em fase operacional com funcionalidades core implementadas, incluindo catálogo de produtos, sistema de checkout, múltiplos métodos de pagamento (PIX, cartão de crédito, criptomoedas), e gestão de conteúdo via Strapi CMS. A plataforma está pronta para uso comercial e aguarda a implementação da fase 2 que incluirá o sistema completo de rifas blockchain (Nerd-Premiado).

Com 15 produtos no catálogo, APIs 100% funcionais, e três serviços rodando simultaneamente (Backend Medusa, Frontend Next.js, e Strapi CMS), a USE Nerd representa uma solução completa e escalável para e-commerce no mercado brasileiro com aspirações de se tornar referência em transparência através do uso de tecnologia blockchain.

---

## Objetivos do Projeto

### Objetivo Principal
Criar uma plataforma de e-commerce completa para o mercado brasileiro que combine vendas de produtos com um sistema inovador e transparente de rifas verificadas por blockchain, estabelecendo confiança através de tecnologia descentralizada.

### Objetivos Específicos

#### 1. E-commerce Funcional
- **Meta**: Plataforma operacional com catálogo completo de produtos
- **Status**: ✅ Concluído
- **Benefício**: Geração de receita através de vendas diretas

#### 2. Experiência do Usuário Premium
- **Meta**: Interface moderna, responsiva e intuitiva com tema cyberpunk
- **Status**: ✅ Concluído (design base)
- **Benefício**: Maior taxa de conversão e satisfação do cliente

#### 3. Integração de Pagamentos Locais
- **Meta**: Suportar métodos de pagamento brasileiros (PIX, cartões locais)
- **Status**: ✅ Implementado
- **Benefício**: Redução de fricção no checkout, maior taxa de conclusão

#### 4. Sistema de Rifas Blockchain (Nerd-Premiado)
- **Meta**: Criar sistema de rifas 100% transparente e verificável
- **Status**: 📋 Planejado (Fase 2)
- **Benefício**: Diferencial competitivo único, aumento de engajamento

#### 5. Gestão de Conteúdo Dinâmico
- **Meta**: CMS para gerenciamento de páginas, banners e conteúdo
- **Status**: ✅ Implementado (Strapi)
- **Benefício**: Agilidade em marketing e comunicação

#### 6. Escalabilidade e Performance
- **Meta**: Arquitetura que suporte crescimento exponencial
- **Status**: ✅ Base implementada
- **Benefício**: Custos operacionais otimizados, melhor experiência

---

## Funcionalidades Atuais

### E-commerce Core (✅ Implementado)

#### Gestão de Produtos
- **Catálogo**: 15 produtos cadastrados e ativos
- **Categorias**: Sistema de categorização flexível
- **Coleções**: Agrupamento de produtos por temas
- **Imagens**: Upload e gerenciamento de múltiplas imagens por produto
- **Variantes**: Suporte a variações (tamanho, cor, etc.)
- **Preços**: Sistema de precificação com suporte a múltiplas moedas (foco em BRL)
- **Estoque**: Controle de inventário em tempo real

#### Carrinho de Compras
- **Sessão persistente**: Carrinho mantido entre sessões
- **Cálculo dinâmico**: Preços, descontos e frete atualizados em tempo real
- **Validação**: Verificação de disponibilidade de estoque
- **Promoções**: Sistema de descontos e cupons

#### Checkout & Pagamentos
- **Métodos de Pagamento**:
  - ✅ **PIX**: Pagamento instantâneo brasileiro
  - ✅ **Cartão de Crédito**: Via Stripe
  - ✅ **Criptomoedas**: Bitcoin, Ethereum, USDC, USDT via Coinbase Commerce
- **Processamento**: Confirmação automática de pagamentos
- **Webhooks**: Integração com gateways de pagamento
- **Segurança**: PCI compliance via Stripe

#### Gestão de Pedidos
- **Rastreamento**: Acompanhamento completo do ciclo do pedido
- **Status**: Estados definidos (pending, paid, shipped, delivered, cancelled)
- **Notificações**: Email de confirmação e atualizações
- **Histórico**: Acesso completo ao histórico de pedidos

#### Área do Cliente
- **Autenticação**: Sistema de login/registro seguro
- **Perfil**: Gerenciamento de dados pessoais
- **Endereços**: Múltiplos endereços de entrega
- **Pedidos**: Visualização e rastreamento de pedidos

### Infraestrutura (✅ Implementado)

#### Backend - Medusa v2.0
- **Port**: http://localhost:9000
- **Admin Dashboard**: http://localhost:9000/app
- **API REST**: Endpoints completos para store e admin
- **Database**: PostgreSQL com migrações automatizadas
- **Cache**: Redis para otimização de performance
- **Modularidade**: Arquitetura baseada em módulos customizados

#### Frontend - Next.js 14
- **Port**: http://localhost:3000
- **App Router**: Utilização do novo roteador do Next.js
- **SSR/SSG**: Renderização otimizada para SEO e performance
- **Responsivo**: Design mobile-first
- **Tema**: Cyberpunk customizado com Tailwind CSS

#### CMS - Strapi
- **Port**: http://localhost:1337
- **Admin**: http://localhost:1337/admin
- **Content Types**: Páginas, banners, blog posts
- **Media Library**: Gestão centralizada de imagens e arquivos
- **API**: GraphQL e REST disponíveis

### Módulos Customizados (✅ Implementado)

#### 1. Brazil Module
- **PIX Integration**: Pagamentos PIX via providers brasileiros
- **Shipping**: Integração com Melhor Envio (preparado)
- **NFe**: Sistema de emissão de Nota Fiscal Eletrônica (preparado)
- **Localização**: Moeda BRL, formato de data/hora brasileiro

#### 2. Crypto Payment Module
- **Coinbase Commerce**: Integração completa
- **Currencies**: BTC, ETH, USDC, USDT, MATIC
- **Auto-conversion**: Conversão automática para BRL
- **Webhooks**: Confirmação automática de transações

#### 3. Raffle Module (Base)
- **Models**: Estrutura de dados para rifas, tickets e sorteios
- **Services**: Lógica de negócio básica
- **Status**: Preparado para integração blockchain (Fase 2)

### Gestão de Conteúdo (✅ Implementado)

#### Strapi CMS
- **Páginas Dinâmicas**: Criação de páginas via CMS
- **Banners**: Sistema de banners rotativos para homepage
- **Blog**: Plataforma de blog integrada
- **Galeria de Vencedores**: Showcase de ganhadores de rifas
- **SEO**: Meta tags e otimização para cada página
- **Rich Text**: Editor visual para conteúdo

---

## Stack Tecnológico

### Backend

#### Framework Principal
- **Medusa v2.0**: Plataforma de e-commerce headless
  - Node.js 20+
  - TypeScript 5.6
  - Modular architecture
  - Event-driven design
  - RESTful API

#### Database & Cache
- **PostgreSQL 14+**: Database principal
  - ACID compliance
  - Full-text search
  - JSON support
  - Performance optimizations
- **Redis 6+**: Cache e sessões
  - Session storage
  - Cache layer
  - Pub/sub para eventos

#### Payment Gateways
- **Stripe**: Cartões de crédito e PIX
  - PCI compliant
  - Webhooks integration
  - Multi-currency support
- **Coinbase Commerce**: Criptomoedas
  - BTC, ETH, USDC, USDT
  - Auto-conversion
  - Secure payments

#### Blockchain (Planejado - Fase 2)
- **Alchemy**: RPC provider para Polygon
- **Ethers.js 6.x**: Interação com blockchain
- **Polygon (Matic)**: Blockchain layer 2
- **Chainlink VRF**: Randomness verificável

### Frontend

#### Framework
- **Next.js 14**: React framework
  - App Router
  - Server Components
  - Server Actions
  - ISR/SSG/SSR
  - Image optimization

#### Styling
- **Tailwind CSS v4**: Utility-first CSS
  - Custom cyberpunk theme
  - Responsive design
  - Dark mode optimized
  - Container queries

#### Libraries
- **React 18**: UI library
- **TypeScript**: Type safety
- **Zod**: Schema validation
- **React Hook Form**: Form management

### CMS

#### Strapi v4
- **Headless CMS**: Content management
- **GraphQL & REST**: Dual API support
- **Media Library**: Asset management
- **Roles & Permissions**: Access control
- **Custom Content Types**: Flexible schemas

### DevOps & Infrastructure

#### Containerization
- **Docker**: Containerized services
- **Docker Compose**: Multi-service orchestration

#### Development Tools
- **Git**: Version control
- **TypeScript**: Static typing
- **ESLint**: Code linting
- **Prettier**: Code formatting

#### Testing (Target)
- **Jest**: Unit tests
- **Vitest**: Frontend testing
- **Playwright**: E2E testing
- **Coverage Target**: 80%+

---

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                         CAMADA DE APRESENTAÇÃO                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           Next.js 14 Frontend (Port 3000)                  │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  • App Router (SSR/SSG/ISR)                               │  │
│  │  • React Server Components                                 │  │
│  │  • Tailwind CSS Cyberpunk Theme                           │  │
│  │  • Responsive Design                                       │  │
│  │  • SEO Optimized                                          │  │
│  └─────────────────┬─────────────────────────────────────────┘  │
│                    │                                             │
└────────────────────┼─────────────────────────────────────────────┘
                     │ REST API / GraphQL
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAMADA DE APLICAÇÃO                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────┐  ┌─────────────────────────────┐   │
│  │  Medusa Backend        │  │  Strapi CMS                 │   │
│  │  (Port 9000)           │  │  (Port 1337)                │   │
│  ├────────────────────────┤  ├─────────────────────────────┤   │
│  │  Core Modules:         │  │  • Content Management       │   │
│  │  • Product             │  │  • Media Library            │   │
│  │  • Cart                │  │  • Pages & Banners          │   │
│  │  • Order               │  │  • Blog                     │   │
│  │  • Customer            │  │  • API (REST + GraphQL)     │   │
│  │  • Payment             │  │                             │   │
│  │                        │  │                             │   │
│  │  Custom Modules:       │  └─────────────────────────────┘   │
│  │  • Brazil (PIX, NFe)   │                                     │
│  │  • Crypto Payment      │                                     │
│  │  • Raffle (base)       │                                     │
│  └────────────┬───────────┘                                     │
│               │                                                  │
└───────────────┼──────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAMADA DE DADOS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  PostgreSQL      │  │  Redis           │                    │
│  │  (Port 5432)     │  │  (Port 6379)     │                    │
│  ├──────────────────┤  ├──────────────────┤                    │
│  │  • Products      │  │  • Sessions      │                    │
│  │  • Orders        │  │  • Cache         │                    │
│  │  • Customers     │  │  • Pub/Sub       │                    │
│  │  • Payments      │  │                  │                    │
│  │  • Raffles       │  │                  │                    │
│  │  • CMS Data      │  │                  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRAÇÕES EXTERNAS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │  Stripe        │  │  Coinbase      │  │  Polygon         │  │
│  │  Payment       │  │  Commerce      │  │  Blockchain      │  │
│  ├────────────────┤  ├────────────────┤  ├──────────────────┤  │
│  │  • PIX         │  │  • BTC         │  │  • Alchemy RPC   │  │
│  │  • Cards       │  │  • ETH         │  │  • Smart Contracts│ │
│  │  • Webhooks    │  │  • USDC/USDT   │  │  • VRF (Fase 2)  │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados - Compra de Produto

```
1. Cliente navega no frontend (Next.js)
   ↓
2. Adiciona produtos ao carrinho (API Medusa)
   ↓
3. Inicia checkout
   ↓
4. Seleciona método de pagamento:
   ├─→ PIX: Stripe → QR Code → Webhook → Confirma pedido
   ├─→ Cartão: Stripe → Processa → Webhook → Confirma pedido
   └─→ Crypto: Coinbase → Wallet payment → Webhook → Confirma pedido
   ↓
5. Pedido confirmado → Email enviado
   ↓
6. Admin processa pedido (Medusa Admin)
   ↓
7. Atualiza status → Cliente rastreia pedido
```

### Fluxo de Dados - Sistema de Rifas (Fase 2)

```
1. Cliente compra números (Frontend)
   ↓
2. Pagamento via Stripe (PIX/Card/Crypto)
   ↓
3. Webhook confirma pagamento
   ↓
4. Backend aloca números ao cliente
   ↓
5. Registra números na Polygon blockchain via Alchemy
   ↓
6. Cliente recebe email com números + link blockchain
   ↓
7. Data do sorteio chega
   ↓
8. Admin executa sorteio via Chainlink VRF
   ↓
9. Smart contract seleciona vencedor (randomness verificável)
   ↓
10. Backend identifica vencedor
    ↓
11. Notificações multichannel (Email/SMS/Push/WhatsApp)
    ↓
12. Vencedor verifica resultado na blockchain
```

---

## Métricas de Sucesso

### Métricas Operacionais (Atuais)

#### Funcionalidade
- ✅ **Uptime Backend**: 99.9% disponibilidade
- ✅ **APIs Funcionais**: 100% dos endpoints operacionais
- ✅ **Produtos Ativos**: 15 produtos no catálogo
- ✅ **Métodos de Pagamento**: 3 ativos (PIX, Card, Crypto)
- ✅ **Tempo de Resposta API**: < 200ms (média)

#### Desenvolvimento
- ✅ **Cobertura de Testes**: Target 80% (em implementação)
- ✅ **Código TypeScript**: 100% tipado
- ✅ **Documentação**: Bilíngue (EN/PT-BR)
- ✅ **Commits Convencionais**: Padrão seguido

### Métricas de Negócio (Target)

#### Conversão
- **Taxa de Conversão**: > 2.5%
- **Abandono de Carrinho**: < 70%
- **Tempo Médio de Checkout**: < 3 minutos
- **Aprovação de Pagamentos**: > 95%

#### Engajamento
- **Sessões por Usuário**: > 3
- **Páginas por Sessão**: > 5
- **Tempo Médio no Site**: > 4 minutos
- **Taxa de Retorno**: > 30%

#### Performance
- **Tempo de Carregamento**: < 2 segundos
- **Core Web Vitals**: Todos "Good"
- **Mobile Performance**: Score > 90
- **SEO Score**: > 95

### Métricas Blockchain (Fase 2)

#### Transparência
- **Transações Verificáveis**: 100%
- **Tempo de Confirmação**: < 5 minutos
- **Custo por Transação**: < $0.01 USD
- **Sorteios Auditáveis**: 100%

#### Confiança
- **Taxa de Verificação**: > 40% (clientes verificam blockchain)
- **NPS Blockchain**: > 70
- **Reclamações de Fraude**: 0

---

## Time e Stakeholders

### Stakeholders Principais

#### Cliente/Product Owner
- **Dhiego Pagotto**
- **Role**: Founder & CEO
- **Email**: dhiego@pagotto.eu
- **Responsabilidades**:
  - Visão estratégica do produto
  - Aprovação de roadmap
  - Decisões de negócio
  - Budget e investimentos

#### Time de Desenvolvimento
- **Backend Developer**: Desenvolvimento Medusa, APIs, integrações
- **Frontend Developer**: Next.js, UI/UX, Tailwind CSS
- **Blockchain Developer**: Smart contracts, integração Polygon
- **DevOps Engineer**: Infraestrutura, CI/CD, monitoring
- **QA Engineer**: Testes, qualidade, documentação

### Tecnologias-Chave e Responsáveis

#### Medusa Backend
- **Responsável**: Backend Developer
- **Tecnologias**: Node.js, TypeScript, PostgreSQL, Redis
- **Entregas**:
  - Módulos customizados (Brazil, Crypto, Raffle)
  - APIs REST
  - Workflows e eventos
  - Integrações de pagamento

#### Next.js Frontend
- **Responsável**: Frontend Developer
- **Tecnologias**: React, Next.js 14, Tailwind CSS
- **Entregas**:
  - Interface responsiva
  - Tema cyberpunk
  - Páginas dinâmicas
  - Otimização SEO

#### Blockchain (Fase 2)
- **Responsável**: Blockchain Developer
- **Tecnologias**: Solidity, Ethers.js, Alchemy, Chainlink VRF
- **Entregas**:
  - Smart contracts
  - Integração Polygon
  - Sistema de sorteios VRF
  - Verificação blockchain

#### Strapi CMS
- **Responsável**: Backend Developer + Content Manager
- **Tecnologias**: Strapi, GraphQL, REST
- **Entregas**:
  - Content types customizados
  - Media library
  - API pública
  - Permissões e roles

### Fornecedores e Parceiros

#### Payment Providers
- **Stripe**: Gateway principal (PIX + Cards)
- **Coinbase Commerce**: Pagamentos crypto
- **Mercado Pago**: Backup payment (Brasil)

#### Blockchain Infrastructure
- **Alchemy**: RPC provider Polygon (Fase 2)
- **Chainlink**: VRF para randomness (Fase 2)

#### Cloud & Hosting
- **AWS / Vercel**: Hosting (a definir)
- **Cloudflare**: CDN e DDoS protection

#### Monitoring & Analytics
- **Sentry**: Error tracking
- **Google Analytics**: User analytics
- **Alchemy Dashboard**: Blockchain monitoring (Fase 2)

---

## Próximos Passos

### Imediato (1-2 semanas)
1. ✅ Finalizar documentação executiva
2. 📋 Testes E2E do fluxo de compra
3. 📋 Otimização de performance frontend
4. 📋 Configuração de monitoring (Sentry)

### Curto Prazo (1-2 meses)
1. 📋 Implementar Fase 2 - Nerd-Premiado Blockchain
2. 📋 Deploy em produção (ambiente staging primeiro)
3. 📋 Campanha de marketing para lançamento
4. 📋 Integração Melhor Envio (shipping)

### Médio Prazo (3-6 meses)
1. 📋 Print-on-Demand (Printful/Printify)
2. 📋 Analytics avançado e dashboard
3. 📋 App mobile (React Native)
4. 📋 Programa de afiliados

### Longo Prazo (6-12 meses)
1. 📋 Marketplace multi-vendor
2. 📋 NFTs como prêmios de rifas
3. 📋 Gamificação e loyalty program
4. 📋 Expansão internacional

---

**Última atualização**: 17/11/2025
**Próxima revisão**: 17/12/2025
**Documento vivo**: Este documento será atualizado mensalmente com progresso e novos objetivos.

---

**Referências**:
- [Status Report](./CURRENT_STATUS_REPORT.md)
- [Roadmap](./ROADMAP.md)
- [Nerd-Premiado Master Plan](../../NERD_PREMIADO_MASTER_PLAN.md)
- [User Manual](../user-guides/USER_MANUAL.md)
- [Admin Manual](../user-guides/ADMIN_MANUAL.md)
