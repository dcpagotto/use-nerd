# USE Nerd Storefront

Frontend Next.js 14 para a plataforma de e-commerce USE Nerd com sistema de rifas blockchain.

## Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript (strict mode)
- **Estilização**: Tailwind CSS v4
- **Backend**: Medusa v2.0 (http://localhost:9000)
- **Blockchain**: Polygon (Matic)
- **Testes**: Vitest + Testing Library
- **Gerenciador de Pacotes**: npm

## Características

### E-commerce
- Catálogo de produtos integrado com Medusa
- Carrinho de compras
- Checkout completo
- Integração com Medusa JS SDK

### Sistema de Rifas
- Rifas verificadas por blockchain (Polygon)
- Compra de tickets
- Visualização de rifas ativas
- Histórico de participações
- Transparência total via smart contracts

### Mercado Brasileiro
- Idioma padrão: Português (pt-BR)
- Moeda: Real (BRL)
- Métodos de pagamento:
  - PIX (pagamento instantâneo)
  - Mercado Pago
- NFe automática
- Integração com Melhor Envio (frete)

### Tecnologias Blockchain
- Conexão com carteiras Web3 (MetaMask)
- Verificação de transações na Polygon
- Visualização de dados on-chain
- Integração com Ethers.js

## Estrutura do Projeto

```
storefront/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
├── components/            # Componentes React reutilizáveis
├── lib/                   # Utilitários e configurações
│   ├── medusa-client.ts  # Cliente Medusa JS SDK
│   ├── web3-client.ts    # Cliente Web3/Ethers.js
│   └── utils.ts          # Funções utilitárias
├── types/                 # Tipos TypeScript
│   └── index.ts          # Tipos globais
├── public/                # Arquivos estáticos
├── tests/                 # Testes
│   └── setup.ts          # Configuração de testes
└── styles/                # Estilos adicionais
```

## Instalação

### Pré-requisitos

- Node.js >= 20.x
- npm >= 10.x
- Backend Medusa v2.0 rodando em http://localhost:9000

### Passos

1. **Instalar dependências**:

```bash
cd storefront
npm install
```

2. **Configurar variáveis de ambiente**:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e configure:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`: URL do backend Medusa
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`: Chave pública do Medusa
- `NEXT_PUBLIC_POLYGON_RPC_URL`: URL RPC da Polygon
- Outras configurações conforme necessário

3. **Iniciar servidor de desenvolvimento**:

```bash
npm run dev
```

O storefront estará disponível em: http://localhost:3000

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build & Deploy
npm run build            # Cria build de produção
npm start                # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Executa ESLint
npm run type-check       # Verifica tipos TypeScript
npm run format           # Formata código com Prettier

# Testes
npm run test             # Executa testes com Vitest
npm run test:ui          # Interface gráfica de testes
npm run test:coverage    # Relatório de cobertura (meta: 80%)
```

## Configuração do Medusa Backend

O storefront se conecta ao backend Medusa v2.0. Certifique-se de que:

1. O backend está rodando em `http://localhost:9000`
2. CORS está configurado para aceitar requests de `http://localhost:3000`
3. Uma região BRL (Brasil) foi criada no Medusa
4. Produtos e coleções foram cadastrados

### Exemplo de configuração CORS no Medusa

```typescript
// medusa-config.ts
export default {
  projectConfig: {
    http: {
      cors: "http://localhost:3000",
    },
  },
};
```

## Integração com Blockchain

### Configuração da Carteira

Para testar funcionalidades blockchain:

1. Instale a extensão MetaMask
2. Adicione a rede Polygon Mumbai (testnet) ou Polygon Mainnet
3. Conecte sua carteira no storefront

### Redes Suportadas

- **Polygon Mainnet** (Produção)
  - Chain ID: 137
  - RPC: https://polygon-rpc.com
  - Explorer: https://polygonscan.com

- **Polygon Mumbai** (Testnet)
  - Chain ID: 80001
  - RPC: https://rpc-mumbai.maticvigil.com
  - Explorer: https://mumbai.polygonscan.com

## Desenvolvimento

### Arquitetura

Este projeto segue os princípios de **React Server Components** (RSC):

- **Server Components** por padrão (fetching de dados, lógica de negócio)
- **Client Components** (`'use client'`) apenas para interatividade
- **Streaming SSR** com Suspense para loading states
- **API Routes** para operações customizadas

### Boas Práticas

1. **TypeScript Strict Mode**: Sempre tipar corretamente
2. **Server Components**: Usar por padrão, Client Components apenas quando necessário
3. **Data Fetching**: Buscar dados no servidor sempre que possível
4. **Otimização de Imagens**: Usar `next/image` para todas as imagens
5. **Cobertura de Testes**: Manter mínimo de 80%
6. **SOLID Principles**: Aplicar em toda a base de código
7. **Clean Code**: Código limpo, legível e bem documentado

### Padrões de Nomenclatura

- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Utilitários**: camelCase (`formatPrice.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Tipos**: PascalCase com sufixo descritivo (`ProductCardProps`)

### Estrutura de Componentes

```typescript
// components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Component logic
}
```

## Testing

### Executar Testes

```bash
# Todos os testes
npm run test

# Modo watch
npm run test -- --watch

# Interface gráfica
npm run test:ui

# Cobertura
npm run test:coverage
```

### Estrutura de Testes

```
tests/
├── setup.ts              # Configuração global
├── components/           # Testes de componentes
├── lib/                  # Testes de utilitários
└── integration/          # Testes de integração
```

### Exemplo de Teste

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

describe('ProductCard', () => {
  it('should render product title', () => {
    const product = { id: '1', title: 'Test Product' };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

## Próximos Passos

### Tarefas Prioritárias

1. **Configuração do Tailwind CSS** (tailwind-css-expert)
   - Implementar tema cyberpunk
   - Configurar design system
   - Criar componentes base de UI

2. **Páginas Core** (react-nextjs-expert)
   - `/products` - Catálogo de produtos
   - `/product/[handle]` - Página de produto
   - `/cart` - Carrinho de compras
   - `/checkout` - Checkout
   - `/raffles` - Lista de rifas
   - `/raffle/[id]` - Detalhes da rifa

3. **Componentes Reutilizáveis** (react-nextjs-expert)
   - Header/Navigation
   - Footer
   - ProductCard
   - RaffleCard
   - CartDrawer
   - WalletConnect

4. **Integração Backend** (backend-developer)
   - Validar endpoints do Medusa
   - Configurar módulos customizados (Raffle, Blockchain, POD, Brazil)
   - Testar fluxo completo de compra

5. **Testes E2E** (testing-expert)
   - Fluxo de compra completo
   - Fluxo de compra de rifas
   - Conexão de carteira Web3

## Dependências Principais

### Produção
- `next@14.2.18` - Framework React
- `react@18.3.1` - Biblioteca React
- `@medusajs/js-sdk@2.0.2` - Cliente Medusa
- `ethers@6.13.4` - Biblioteca Web3
- `tailwindcss@4.0.0` - Framework CSS
- `framer-motion@11.11.11` - Animações
- `zustand@5.0.1` - State management

### Desenvolvimento
- `typescript@5.6.3` - TypeScript
- `vitest@2.1.4` - Framework de testes
- `@testing-library/react@16.0.1` - Testes de componentes
- `eslint@9.14.0` - Linter
- `prettier@3.3.3` - Formatação de código

## Recursos Adicionais

- [Documentação Next.js 14](https://nextjs.org/docs)
- [Documentação Medusa v2](https://docs.medusajs.com)
- [Documentação Ethers.js](https://docs.ethers.org)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Polygon Documentation](https://docs.polygon.technology)

## Suporte

Para dúvidas e suporte:
- Backend issues: Consulte `../README.md` (raiz do projeto)
- Frontend issues: Abra uma issue no repositório
- Documentação: Consulte `../docs/` (documentação completa do projeto)

## Licença

MIT

---

**Desenvolvido com** ❤️ **pela equipe USE Nerd**

**Stack**: Next.js 14 • TypeScript • Tailwind CSS • Medusa v2 • Polygon
