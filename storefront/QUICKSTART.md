# Quick Start - Componentes de Layout USE Nerd

Guia rápido para começar a usar os componentes criados.

## Instalação e Setup

### 1. Instalar Dependências (se necessário)

```bash
cd storefront
npm install
```

### 2. Configurar Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do storefront:

```env
# Polygon Network
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_POLYGON_CHAIN_ID=137

# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 3. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Uso Básico dos Componentes

### Adicionar Item ao Carrinho

```tsx
'use client';
import useCartStore from '@/store/cart-store';

export default function MyComponent() {
  const { addItem } = useCartStore();

  const handleAdd = () => {
    addItem({
      id: 'product-123',
      title: 'Produto Teste',
      price: 9999, // R$ 99,99 em centavos
      thumbnail: '/images/product.jpg',
    });
  };

  return <button onClick={handleAdd}>Adicionar</button>;
}
```

### Exibir Loading

```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

export default function MyPage() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingSpinner size="large" variant="purple" label="Carregando..." />;
  }

  return <div>Content</div>;
}
```

### Usar Classes do Tema

```tsx
export default function MyComponent() {
  return (
    <div className="card-cyber p-6">
      <h2 className="neon-text-purple mb-4">Título</h2>
      <p className="text-gray-cyber-300 mb-4">Descrição</p>
      <button className="btn-neon-filled-purple">Ação</button>
    </div>
  );
}
```

---

## Estrutura de Rotas

Criar estas páginas em `app/`:

```
app/
├── page.tsx              ✓ Pronta (Home)
├── produtos/
│   └── page.tsx          → Criar
├── rifas/
│   └── page.tsx          → Criar
├── sobre/
│   └── page.tsx          → Criar
└── checkout/
    └── page.tsx          → Criar
```

---

## Template de Página

Use este template para criar novas páginas:

```tsx
// app/produtos/page.tsx
'use client';

import useCartStore from '@/store/cart-store';

export default function ProdutosPage() {
  const { addItem } = useCartStore();

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="neon-text-purple font-display text-display-2 mb-8">
        Produtos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seus produtos aqui */}
      </div>
    </div>
  );
}
```

---

## Classes Tailwind Mais Usadas

### Botões
```tsx
<button className="btn-neon-purple">Outline</button>
<button className="btn-neon-filled-purple">Filled</button>
```

### Cards
```tsx
<div className="card-cyber p-6">Card</div>
<div className="card-cyber-glow p-6">Card com glow</div>
```

### Títulos
```tsx
<h1 className="neon-text-purple font-display text-display-1">Hero</h1>
<h2 className="neon-text-purple font-display text-heading-1">Section</h2>
<h3 className="text-gradient-cyber text-xl">Subtitle</h3>
```

### Layout
```tsx
<div className="container mx-auto px-4 py-20">
  {/* Content */}
</div>
```

---

## Testar Funcionalidades

### 1. Testar Carrinho
- Adicione produtos na home
- Clique no ícone do carrinho no header
- Ajuste quantidades
- Remova itens

### 2. Testar Wallet
- Instale MetaMask
- Clique em "Conectar Carteira"
- Aprove no MetaMask
- Use o dropdown de ações

### 3. Testar Menu Mobile
- Redimensione para < 768px
- Clique no hamburger
- Navegue pelos links

---

## Próximos Passos

1. **Criar páginas faltantes**
   ```bash
   # Criar estrutura
   mkdir -p app/produtos app/rifas app/sobre app/checkout
   touch app/produtos/page.tsx
   touch app/rifas/page.tsx
   touch app/sobre/page.tsx
   touch app/checkout/page.tsx
   ```

2. **Integrar com Medusa**
   ```tsx
   import { medusaClient } from '@/lib/medusa-client';

   const products = await medusaClient.products.list();
   ```

3. **Adicionar funcionalidades**
   - Busca
   - Filtros
   - Paginação
   - Checkout

---

## Troubleshooting Rápido

**Erro: Module not found '@/components/...'**
- Verifique tsconfig.json paths

**Wallet não conecta**
- Instale MetaMask
- Verifique se está na rede Polygon

**Carrinho não persiste**
- Verifique localStorage (F12 > Application > Local Storage)
- Limpe o cache se necessário

**Toast não aparece**
- Verifique se ClientLayout está no layout.tsx

---

## Documentação Completa

- `components/README.md` - Documentação detalhada
- `INTEGRATION_GUIDE.md` - Guia de integração
- `COMPONENTS_SUMMARY.md` - Resumo dos componentes

---

## Suporte

Problemas ou dúvidas? Consulte a documentação completa nos arquivos acima.

Boa sorte com o desenvolvimento do USE Nerd! 🚀
