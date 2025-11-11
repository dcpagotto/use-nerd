# USE Nerd - Layout Components

Componentes base de layout para o projeto USE Nerd com tema cyberpunk.

## Componentes Criados

### 1. LoadingSpinner (`LoadingSpinner.tsx`)

Spinner de loading com estilo cyberpunk e efeitos neon.

**Características:**
- Múltiplos tamanhos (small, medium, large)
- Variantes de cor (purple, blue, pink, green)
- Efeitos de neon glow
- Variantes: `FullPageSpinner`, `InlineSpinner`

**Uso:**
```tsx
import LoadingSpinner, { FullPageSpinner, InlineSpinner } from '@/components/LoadingSpinner';

// Básico
<LoadingSpinner size="medium" variant="purple" />

// Com label
<LoadingSpinner size="large" variant="blue" label="Carregando..." />

// Página completa
<FullPageSpinner variant="purple" />

// Inline (botões)
<InlineSpinner variant="purple" />
```

---

### 2. WalletConnect (`WalletConnect.tsx`)

Componente de conexão Web3 para MetaMask na rede Polygon.

**Características:**
- Conectar/desconectar carteira MetaMask
- Exibir endereço truncado
- Indicador de rede (Polygon)
- Dropdown com ações da conta
- Auto-reconexão
- Client Component

**Uso:**
```tsx
import WalletConnect from '@/components/WalletConnect';

<WalletConnect />
```

**Funcionalidades:**
- Copiar endereço para clipboard
- Ver conta no PolygonScan
- Desconectar carteira
- Notificações toast para feedback

---

### 3. Cart Store (`store/cart-store.ts`)

Gerenciamento global de estado do carrinho com Zustand.

**Características:**
- Adicionar/remover itens
- Atualizar quantidades
- Calcular totais
- Persistência em localStorage
- Estado do drawer (aberto/fechado)

**Uso:**
```tsx
import useCartStore from '@/store/cart-store';

function MyComponent() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    toggleCart
  } = useCartStore();

  // Adicionar item
  const handleAddToCart = () => {
    addItem({
      id: 'product-123',
      title: 'Produto Teste',
      price: 9999, // em centavos
      thumbnail: '/images/product.jpg',
    });
  };

  // Atualizar quantidade
  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  // Remover item
  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
      <button onClick={toggleCart}>Abrir Carrinho ({getTotalItems()})</button>
    </div>
  );
}
```

---

### 4. CartDrawer (`CartDrawer.tsx`)

Drawer lateral para exibir itens do carrinho.

**Características:**
- Animações com Framer Motion
- Slide-in da direita
- Lista de itens com thumbnails
- Controles de quantidade
- Remover itens
- Subtotal
- Botões de ação (checkout, continuar comprando)
- Backdrop overlay
- Client Component

**Uso:**
```tsx
import CartDrawer from '@/components/CartDrawer';

// Incluir no layout principal
<CartDrawer />

// O drawer abre/fecha automaticamente via store
const { toggleCart } = useCartStore();
<button onClick={toggleCart}>Toggle Cart</button>
```

---

### 5. Header (`Header.tsx`)

Cabeçalho principal com navegação.

**Características:**
- Logo animado com neon glow
- Navegação desktop (Início, Produtos, Rifas, Sobre)
- Menu mobile responsivo (hamburger)
- Indicador de link ativo com animação
- Ícone de carrinho com badge de contagem
- Integração com WalletConnect
- Header sticky com blur no scroll
- Client Component

**Uso:**
```tsx
import Header from '@/components/Header';

<Header />
```

**Navegação:**
- `/` - Início
- `/produtos` - Produtos
- `/rifas` - Rifas
- `/sobre` - Sobre

**Funcionalidades:**
- Menu mobile com backdrop overlay
- Badge animado no carrinho
- Detecção de rota ativa
- Sticky header com efeito de scroll

---

### 6. Footer (`Footer.tsx`)

Rodapé com links e informações da empresa.

**Características:**
- Layout de 4 colunas (desktop)
- Responsive (empilhamento mobile)
- Links organizados por categoria (Loja, Suporte, Legal)
- Ícones de redes sociais
- Badge "Powered by Polygon"
- Copyright dinâmico
- Server Component (estático)

**Uso:**
```tsx
import Footer from '@/components/Footer';

<Footer />
```

**Seções:**
- **Loja:** Produtos, Rifas, Categorias, Promoções
- **Suporte:** FAQ, Contato, Como Funciona, Rastreamento
- **Legal:** Termos, Privacidade, Trocas, Regulamento
- **Social:** Instagram, Twitter, Discord, GitHub

---

### 7. ClientLayout (`ClientLayout.tsx`)

Wrapper que integra todos os componentes client-side.

**Características:**
- Integra Header, Footer, CartDrawer
- Configuração de Toast notifications
- Pronto para usar no layout raiz

**Uso:**
```tsx
// Em app/layout.tsx
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

---

## Integração no Layout Principal

### Atualizar `app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'USE Nerd - E-commerce com Rifas Blockchain',
  description: 'Plataforma de e-commerce com rifas verificadas por blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${rajdhani.variable} dark`}>
      <body className="font-cyber antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
```

---

## Estrutura de Arquivos Criados

```
storefront/
├── components/
│   ├── LoadingSpinner.tsx    # Spinner de loading
│   ├── WalletConnect.tsx     # Conexão Web3/MetaMask
│   ├── CartDrawer.tsx        # Drawer do carrinho
│   ├── Header.tsx            # Cabeçalho/navegação
│   ├── Footer.tsx            # Rodapé
│   ├── ClientLayout.tsx      # Layout wrapper
│   └── README.md             # Esta documentação
└── store/
    └── cart-store.ts         # Store Zustand do carrinho
```

---

## Tema Cyberpunk

Todos os componentes utilizam as classes Tailwind customizadas do tema:

### Classes de Botões
- `.btn-neon-purple` - Botão outline purple
- `.btn-neon-blue` - Botão outline blue
- `.btn-neon-pink` - Botão outline pink
- `.btn-neon-filled-purple` - Botão preenchido purple
- `.btn-neon-filled-blue` - Botão preenchido blue

### Classes de Cards
- `.card-cyber` - Card com borda neon e shadow
- `.card-cyber-glow` - Card com glow effect

### Classes de Input
- `.input-cyber` - Input com estilo cyberpunk

### Classes de Texto
- `.neon-text-purple` - Texto com glow purple
- `.neon-text-blue` - Texto com glow blue
- `.neon-text-pink` - Texto com glow pink
- `.text-gradient-cyber` - Gradiente cyber (purple → blue)

### Classes Utilitárias
- `.glass-cyber` - Glassmorphism effect
- `.focus-cyber` - Focus ring customizado
- `.scrollbar-hide` - Esconder scrollbar

---

## Dependências Utilizadas

- **Zustand** - State management
- **Framer Motion** - Animações
- **react-hot-toast** - Notificações
- **Ethers.js** - Web3 integration
- **Next.js 14** - Framework
- **Tailwind CSS v4** - Styling

---

## Considerações Importantes

### Acessibilidade
Todos os componentes incluem:
- Roles ARIA apropriados
- Labels descritivos
- Navegação por teclado
- Screen reader support
- Focus indicators

### Responsividade
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Menu hamburger para mobile
- Layout adaptativo

### Performance
- Server Components quando possível
- Client Components apenas com interatividade
- Lazy loading de imagens (Next.js Image)
- Persistência otimizada (Zustand)

### Web3 Integration
- Suporte a MetaMask
- Rede Polygon (Mainnet e Mumbai)
- Auto-switch de rede
- Tratamento de erros
- Feedback visual

---

## Próximos Passos

1. **Variáveis de Ambiente**
   Adicionar ao `.env.local`:
   ```env
   NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
   NEXT_PUBLIC_POLYGON_CHAIN_ID=137
   ```

2. **Criar Páginas**
   - `/produtos` - Listagem de produtos
   - `/rifas` - Rifas ativas
   - `/sobre` - Sobre a plataforma
   - `/checkout` - Finalização de compra

3. **Integrar com Backend**
   - Conectar com Medusa API
   - Buscar produtos reais
   - Sincronizar carrinho

4. **Testes**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Accessibility tests

---

## Suporte

Para dúvidas ou problemas, consulte:
- Documentação do projeto: `/docs`
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://github.com/pmndrs/zustand
- Framer Motion: https://www.framer.com/motion/
