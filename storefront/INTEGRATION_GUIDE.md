# Guia de Integração - Componentes de Layout USE Nerd

Este guia mostra como integrar e usar os componentes de layout criados.

## Arquivos Criados

### Componentes (`components/`)
1. `LoadingSpinner.tsx` - Spinner de loading com tema cyberpunk
2. `WalletConnect.tsx` - Conexão Web3/MetaMask
3. `CartDrawer.tsx` - Drawer lateral do carrinho
4. `Header.tsx` - Cabeçalho com navegação
5. `Footer.tsx` - Rodapé com links
6. `ClientLayout.tsx` - Wrapper que integra tudo
7. `README.md` - Documentação completa

### Store (`store/`)
1. `cart-store.ts` - Gerenciamento de estado do carrinho (Zustand)

---

## Integração no Layout Principal

O arquivo `app/layout.tsx` já foi atualizado para incluir o `ClientLayout`:

```tsx
import ClientLayout from '@/components/ClientLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
```

Com isso, todas as páginas automaticamente terão:
- Header (navegação, carrinho, wallet)
- Footer (links, social)
- CartDrawer (carrinho lateral)
- Toast notifications

---

## Exemplos de Uso

### 1. Adicionar Item ao Carrinho

```tsx
'use client';

import useCartStore from '@/store/cart-store';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price, // em centavos
      thumbnail: product.thumbnail,
      variant_id: product.selectedVariant?.id,
      variant_title: product.selectedVariant?.title,
      quantity: 1, // opcional, padrão é 1
    });
  };

  return (
    <button onClick={handleAddToCart} className="btn-neon-filled-purple">
      Adicionar ao Carrinho
    </button>
  );
}
```

### 2. Exibir Badge do Carrinho

```tsx
'use client';

import useCartStore from '@/store/cart-store';

export default function CustomCartButton() {
  const { getTotalItems, toggleCart } = useCartStore();
  const itemCount = getTotalItems();

  return (
    <button onClick={toggleCart} className="relative btn-neon-purple">
      Carrinho
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-neon-pink rounded-full px-2 py-1 text-xs">
          {itemCount}
        </span>
      )}
    </button>
  );
}
```

### 3. Usar Loading Spinner

```tsx
import LoadingSpinner, { FullPageSpinner } from '@/components/LoadingSpinner';

// Em componente
export default function MyComponent() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingSpinner size="large" variant="purple" label="Carregando produtos..." />;
  }

  return <div>Content</div>;
}

// Loading de página completa
export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <FullPageSpinner variant="purple" />;
  }

  return <div>Page content</div>;
}
```

### 4. Conectar Wallet (já integrado no Header)

O componente `WalletConnect` já está integrado no Header. Se você precisar acessar o estado da wallet em outros componentes:

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });
    }
  }, []);

  return (
    <div>
      {account ? (
        <p>Conectado: {account}</p>
      ) : (
        <p>Não conectado</p>
      )}
    </div>
  );
}
```

### 5. Criar Página de Produtos

```tsx
// app/produtos/page.tsx
'use client';

import { useState } from 'react';
import useCartStore from '@/store/cart-store';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProdutosPage() {
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();

  const products = [
    {
      id: '1',
      title: 'Camiseta Cyberpunk',
      price: 7999, // R$ 79,99
      thumbnail: '/images/products/shirt-1.jpg',
    },
    // ... mais produtos
  ];

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <LoadingSpinner size="large" variant="purple" label="Carregando produtos..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="neon-text-purple font-display text-display-2 mb-12">Produtos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card-cyber-glow p-6">
            <div className="aspect-square bg-cyber-dark mb-4 rounded-cyber">
              {/* Product image */}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
            <p className="neon-text-purple text-2xl font-bold mb-4">
              R$ {(product.price / 100).toFixed(2)}
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="btn-neon-filled-purple w-full"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Configuração de Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do projeto storefront:

```env
# Polygon Network Configuration
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_POLYGON_CHAIN_ID=137

# Para Testnet (Mumbai):
# NEXT_PUBLIC_POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com/
# NEXT_PUBLIC_POLYGON_CHAIN_ID=80001

# Medusa Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

---

## Classes Tailwind Disponíveis

### Botões
```tsx
<button className="btn-neon-purple">Outline Purple</button>
<button className="btn-neon-blue">Outline Blue</button>
<button className="btn-neon-pink">Outline Pink</button>
<button className="btn-neon-filled-purple">Filled Purple</button>
<button className="btn-neon-filled-blue">Filled Blue</button>
```

### Cards
```tsx
<div className="card-cyber">Card básico</div>
<div className="card-cyber-glow">Card com glow hover</div>
```

### Inputs
```tsx
<input type="text" className="input-cyber" placeholder="Digite algo..." />
```

### Texto com Glow
```tsx
<h1 className="neon-text-purple">Título Purple</h1>
<h2 className="neon-text-blue">Título Blue</h2>
<p className="neon-text-pink">Texto Pink</p>
```

### Gradientes
```tsx
<h1 className="text-gradient-cyber">Gradiente Cyber</h1>
<h1 className="text-gradient-neon">Gradiente Neon</h1>
```

### Utilidades
```tsx
<div className="glass-cyber">Glassmorphism</div>
<button className="focus-cyber">Focus customizado</button>
<div className="scrollbar-hide">Sem scrollbar</div>
```

---

## Rotas de Navegação

As rotas configuradas no Header são:

- `/` - Início (Home)
- `/produtos` - Listagem de produtos
- `/rifas` - Rifas ativas
- `/sobre` - Sobre a plataforma

Criar essas páginas em `app/`:

```
app/
├── page.tsx              # Página inicial
├── produtos/
│   └── page.tsx          # Listagem de produtos
├── rifas/
│   └── page.tsx          # Rifas ativas
├── sobre/
│   └── page.tsx          # Sobre
└── checkout/
    └── page.tsx          # Checkout (referenciado no CartDrawer)
```

---

## Testando os Componentes

### 1. Iniciar o servidor de desenvolvimento

```bash
cd storefront
npm run dev
```

### 2. Testar o carrinho

Adicione o seguinte código temporário na página inicial para testar:

```tsx
// app/page.tsx
'use client';

import useCartStore from '@/store/cart-store';

export default function HomePage() {
  const { addItem, getTotalItems } = useCartStore();

  const testAddItem = () => {
    addItem({
      id: 'test-1',
      title: 'Produto Teste',
      price: 9999,
      thumbnail: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="neon-text-purple font-display text-display-1 mb-8">USE Nerd</h1>
      <button onClick={testAddItem} className="btn-neon-filled-purple">
        Adicionar Item Teste
      </button>
      <p className="mt-4 text-white">Itens no carrinho: {getTotalItems()}</p>
    </div>
  );
}
```

### 3. Testar a wallet

- Instale o MetaMask no navegador
- Clique em "Conectar Carteira" no header
- Verifique se o dropdown funciona

### 4. Testar o menu mobile

- Redimensione o navegador para mobile (<768px)
- Clique no ícone de hamburger
- Verifique se o menu abre/fecha corretamente

---

## Próximos Passos

1. **Criar páginas faltantes:**
   - `/produtos` - Listagem de produtos
   - `/rifas` - Rifas ativas
   - `/sobre` - Sobre a plataforma
   - `/checkout` - Finalização de compra

2. **Integrar com Medusa Backend:**
   - Buscar produtos da API
   - Sincronizar carrinho
   - Processar pedidos

3. **Adicionar funcionalidades:**
   - Busca de produtos
   - Filtros e ordenação
   - Wishlist
   - Histórico de pedidos

4. **Testes:**
   - Unit tests dos componentes
   - Integration tests do carrinho
   - E2E tests das jornadas principais

---

## Troubleshooting

### Erro: "Module not found: Can't resolve '@/components/...'"

Verifique se o `tsconfig.json` tem a configuração de paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Erro: "window.ethereum is not available"

Instale o MetaMask ou outro wallet Web3 no navegador.

### Toast não aparece

Verifique se o `ClientLayout` está sendo usado no `layout.tsx` raiz.

### Carrinho não persiste

Verifique se o localStorage está disponível (não funciona em SSR). O Zustand persist deve estar configurado corretamente.

---

## Suporte e Documentação

- **Documentação completa:** `components/README.md`
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Zustand:** https://github.com/pmndrs/zustand
- **Framer Motion:** https://www.framer.com/motion/
- **Ethers.js:** https://docs.ethers.org/v6/

---

## Contribuindo

Ao adicionar novos componentes:

1. Siga o padrão de nomenclatura (PascalCase)
2. Adicione JSDoc comments
3. Use TypeScript para props
4. Inclua aria-labels para acessibilidade
5. Teste em mobile e desktop
6. Documente no README
