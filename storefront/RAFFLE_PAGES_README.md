# Páginas de Rifas - USE Nerd

Documentação completa das páginas de rifas criadas para o projeto USE Nerd.

## Arquivos Criados

### Componentes

#### 1. `components/RaffleCard.tsx`
**Descrição**: Componente de card reutilizável para exibir informações de rifas em listas e grids.

**Características**:
- Design cyberpunk com bordas neon e efeitos de glow
- Badge de status (Ativo, Encerrado, Sorteado, Cancelado)
- Barra de progresso animada
- Hover effects com transições suaves
- Imagem com zoom on hover
- Informações: título, preço, progresso, data do sorteio
- Botão "Ver Detalhes" com gradient

**Props**:
```typescript
interface RaffleCardProps {
  raffle: Raffle;
}
```

**Uso**:
```tsx
import RaffleCard from '@/components/RaffleCard';

<RaffleCard raffle={raffleData} />
```

---

#### 2. `components/RaffleTicketSelector.tsx`
**Descrição**: Seletor interativo de quantidade de tickets para compra de rifas.

**Características**:
- Seletor de quantidade com botões +/- e input numérico
- Validação de quantidade (1-10 ou max_tickets_per_user)
- Cálculo automático do total
- Botão "Adicionar ao Carrinho" com loading state
- Informações de disponibilidade
- Estado de esgotado
- Design responsivo

**Props**:
```typescript
interface RaffleTicketSelectorProps {
  raffle: Raffle;
  onAddToCart: (quantity: number) => void;
  disabled?: boolean;
}
```

**Uso**:
```tsx
import RaffleTicketSelector from '@/components/RaffleTicketSelector';

<RaffleTicketSelector
  raffle={raffleData}
  onAddToCart={(quantity) => console.log(`Adicionando ${quantity} tickets`)}
/>
```

---

### Páginas

#### 3. `app/raffles/page.tsx`
**Descrição**: Página de listagem de todas as rifas ativas e finalizadas.

**Características**:
- Server Component com fetch server-side
- Hero section com título gradient e features
- Grid responsivo (3 colunas desktop, 1 mobile)
- Seções separadas: "Rifas Ativas" e "Rifas Finalizadas"
- Skeleton loading states
- Empty state (nenhuma rifa disponível)
- Seção "Como Funciona" com 3 passos
- SEO otimizado (metadata, Open Graph)
- Fallback para dados mockados se API falhar

**Rota**: `/raffles`

**Metadata**:
- Title: "Rifas Ativas | USE Nerd"
- Description: SEO-friendly
- Open Graph configurado

---

#### 4. `app/raffle/[id]/page.tsx`
**Descrição**: Página de detalhes de uma rifa específica.

**Características**:
- Client Component (requer interatividade)
- Hero com imagem grande do prêmio
- Breadcrumb navigation
- Stats cards (preço, tickets vendidos)
- Barra de progresso grande
- Countdown timer até o sorteio (atualização em tempo real)
- RaffleTicketSelector integrado
- Seção "Sobre o Prêmio"
- Seção "Como Funciona" (3 passos)
- Para rifas sorteadas:
  - Anúncio do vencedor
  - Número do ticket vencedor
  - Botão "Verificar na Blockchain"
  - Link para PolygonScan
- Error state (rifa não encontrada)
- Loading state com spinner
- Fallback para dados mockados

**Rota**: `/raffle/[id]`

**Parâmetros dinâmicos**: `id` (string)

---

### Utilitários

#### 5. `lib/mock-data.ts`
**Descrição**: Dados mockados centralizados para desenvolvimento e testes.

**Conteúdo**:
- 8 rifas de exemplo com dados completos
- Mix de status: active, closed, drawn
- Diferentes preços e quantidades
- Rifas sorteadas com informações de vencedor
- Helper functions para filtrar dados

**Funções auxiliares**:
```typescript
getMockRaffleById(id: string): Raffle | undefined
getMockRafflesByStatus(status: Raffle['status']): Raffle[]
getMockActiveRaffles(): Raffle[]
getMockDrawnRaffles(): Raffle[]
```

**Uso**:
```typescript
import { MOCK_RAFFLES, getMockRaffleById } from '@/lib/mock-data';

const raffle = getMockRaffleById('raffle-001');
```

---

## Como Testar

### 1. Teste da Página de Listagem

```bash
# Navegue até o diretório do storefront
cd C:\Users\dcpagotto\Documents\Projects\use-nerd\storefront

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:3000/raffles
```

**O que você verá**:
- Hero section com título "Rifas Blockchain"
- 6 rifas ativas no grid
- 1 rifa finalizada na seção "Rifas Finalizadas"
- Seção "Como Funciona" no final

**Teste de responsividade**:
- Desktop: 3 colunas
- Tablet: 2 colunas
- Mobile: 1 coluna

---

### 2. Teste da Página de Detalhes

```bash
# Acesse uma rifa específica
http://localhost:3000/raffle/raffle-001  # PlayStation 5
http://localhost:3000/raffle/raffle-002  # iPhone 15 Pro Max
http://localhost:3000/raffle/raffle-005  # Xbox Series X (sorteado)
```

**Rifa Ativa (raffle-001, raffle-002, etc.)**:
- Imagem grande do prêmio
- Stats cards
- Countdown timer funcionando (atualiza a cada segundo)
- Seletor de tickets
- Botão "Adicionar ao Carrinho" funcional

**Rifa Sorteada (raffle-005)**:
- Badge "SORTEADO" na imagem
- Seção "Vencedor Anunciado"
- Número do ticket vencedor: #347
- Nome do ganhador: João S.
- Botão "Verificar na Blockchain"
- Link para PolygonScan

**Teste de ID inválido**:
```bash
http://localhost:3000/raffle/raffle-999
```
- Mostra error state
- Botão "Voltar para Rifas"

---

### 3. Teste de Interatividade

#### RaffleTicketSelector
1. Clique em + para aumentar quantidade
2. Clique em - para diminuir quantidade
3. Digite um número no input
4. Tente valores inválidos (< 1 ou > 10)
5. Clique em "Adicionar ao Carrinho"
6. Veja o alert de confirmação

#### Countdown Timer
- Observe o timer atualizando a cada segundo
- Verifica dias, horas, minutos e segundos

#### Verificação Blockchain (raffle-005)
1. Acesse a rifa sorteada
2. Clique em "Verificar na Blockchain"
3. Veja a chamada da API (console.log)
4. Clique em "Ver no PolygonScan"
5. Abre o PolygonScan em nova aba

---

### 4. Teste com Backend Desligado

As páginas foram configuradas para usar dados mockados como fallback:

```typescript
// Em app/raffles/page.tsx e app/raffle/[id]/page.tsx
try {
  const response = await raffleApi.getActiveRaffles();
  return response.raffles;
} catch (error) {
  console.error('Error fetching raffles, using mock data:', error);
  return MOCK_RAFFLES; // Fallback para mock
}
```

**Como testar**:
1. Certifique-se de que o backend Medusa NÃO está rodando
2. Acesse as páginas de rifas
3. Veja mensagem no console: "Error fetching raffles, using mock data"
4. Páginas funcionam normalmente com dados mockados

---

## Integração com Backend

### Quando o Backend Estiver Pronto

#### 1. Remover/Comentar Dados Mockados

Em `app/raffles/page.tsx`:
```typescript
// Remover ou comentar MOCK_RAFFLES
// const MOCK_RAFFLES = [...];

async function getRaffles(): Promise<Raffle[]> {
  try {
    const response = await raffleApi.getActiveRaffles();
    return response.raffles || [];
  } catch (error) {
    console.error('Error fetching raffles:', error);
    throw error; // Propagar erro em vez de usar mock
  }
}
```

Em `app/raffle/[id]/page.tsx`:
```typescript
// Remover ou comentar MOCK_RAFFLES
// const MOCK_RAFFLES = [...];

async function loadRaffle() {
  try {
    const response = await raffleApi.getRaffle(raffleId);
    setRaffle(response.raffle);
  } catch (err) {
    console.error('Error loading raffle:', err);
    setError('Rifa não encontrada'); // Sem fallback
  }
}
```

#### 2. Implementar Integração com Carrinho

Em `RaffleTicketSelector`:
```typescript
const handleAddToCart = async (quantity: number) => {
  try {
    // Substituir por implementação real
    const cartId = localStorage.getItem('cart_id');
    await raffleApi.purchaseTickets(raffle.id, quantity, cartId);

    // Atualizar estado do carrinho
    // Mostrar toast de sucesso
  } catch (error) {
    // Mostrar toast de erro
  }
};
```

#### 3. Verificar Formato da Resposta da API

Certifique-se de que a API retorna dados no formato esperado:

```typescript
// GET /store/raffles/active
{
  "raffles": [
    {
      "id": "raffle-001",
      "title": "PlayStation 5 + 2 Controles",
      // ... demais campos do tipo Raffle
    }
  ]
}

// GET /store/raffles/:id
{
  "raffle": {
    "id": "raffle-001",
    "title": "PlayStation 5 + 2 Controles",
    // ... demais campos do tipo Raffle
  }
}
```

---

## Estrutura de Tipos

### Raffle (types/index.ts)

```typescript
export interface Raffle {
  id: string;
  title: string;
  description: string;
  image: string | null;
  start_date: string;
  end_date: string;
  draw_date: string;
  ticket_price: number; // Em centavos (R$ 10.00 = 1000)
  total_tickets: number;
  sold_tickets: number;
  max_tickets_per_user: number | null;
  status: 'draft' | 'active' | 'closed' | 'drawn' | 'cancelled';
  prize_description: string;
  product_id: string | null;
  blockchain_hash: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
```

---

## Classes Tailwind Customizadas Utilizadas

### Cores
- `bg-cyber-dark-*`: Backgrounds escuros cyberpunk
- `text-neon-purple`: Cor primária neon roxa
- `text-neon-blue`: Cor secundária azul cyber
- `text-neon-pink`: Cor de acento rosa
- `text-neon-green`: Cor de sucesso verde matrix

### Efeitos
- `shadow-neon-purple`: Glow effect roxo
- `shadow-neon-blue`: Glow effect azul
- `border-neon-purple/20`: Borda com opacidade
- `bg-gradient-cyber`: Gradient roxo → azul

### Bordas
- `rounded-cyber`: Border radius padrão (0.5rem)
- `rounded-cyber-lg`: Border radius grande (1rem)

### Animações
- `animate-glow-pulse`: Pulso de brilho
- `animate-fade-in`: Fade in suave
- `animate-slide-up`: Slide up com fade

### Typography
- `font-display`: Fonte Orbitron para títulos
- `font-cyber`: Fonte Rajdhani para texto cyber
- `text-display-1`, `text-display-2`, `text-display-3`: Tamanhos display

---

## Considerações Importantes

### Performance
1. **Imagens**: Use Next.js Image component para otimização automática
2. **Server Components**: Página de listagem é Server Component (SSR)
3. **Client Components**: Apenas onde necessário (interatividade)
4. **Lazy Loading**: Imagens carregam sob demanda

### SEO
1. **Metadata**: Configurada em todas as páginas
2. **Semantic HTML**: Tags semânticas (section, article, nav)
3. **Alt Text**: Todas as imagens têm alt text
4. **Open Graph**: Configurado para social sharing

### Acessibilidade
1. **ARIA Labels**: Botões têm aria-label descritivo
2. **Keyboard Navigation**: Todos os elementos interativos são acessíveis por teclado
3. **Focus States**: Estados de foco visíveis
4. **Color Contrast**: Cores atendem WCAG 2.1 AA

### Responsividade
1. **Mobile First**: Design otimizado para mobile
2. **Breakpoints**: sm, md, lg, xl
3. **Grid Responsivo**: Ajusta colunas por tamanho de tela
4. **Typography**: Tamanhos de fonte responsivos

### Segurança
1. **XSS Prevention**: Dados sanitizados
2. **CSRF**: Tokens implementados (quando integrar com carrinho)
3. **Input Validation**: Validação client-side e server-side
4. **External Links**: rel="noopener noreferrer"

---

## Próximos Passos

### Backend
- [ ] Implementar endpoints de rifas no Medusa backend
- [ ] Criar módulo Raffle no backend
- [ ] Implementar lógica de compra de tickets
- [ ] Integrar com sistema de pagamento (PIX, Mercado Pago)
- [ ] Implementar sorteio na blockchain

### Frontend
- [ ] Integrar com carrinho de compras real
- [ ] Implementar toast notifications (react-hot-toast ou similar)
- [ ] Adicionar animações de transição entre páginas
- [ ] Implementar filtros na página de listagem
- [ ] Adicionar paginação se necessário
- [ ] Criar página "Minhas Rifas" (rifas do usuário)
- [ ] Implementar notificações de sorteio

### Blockchain
- [ ] Criar smart contract de rifas
- [ ] Deploy no Polygon
- [ ] Integrar verificação on-chain
- [ ] Implementar geração aleatória verificável (VRF)

### Testes
- [ ] Escrever testes unitários (Vitest)
- [ ] Escrever testes de integração
- [ ] Escrever testes E2E (Playwright)
- [ ] Testar em diferentes navegadores
- [ ] Testar em diferentes dispositivos

---

## Suporte

Para dúvidas ou problemas:
1. Verifique este README
2. Consulte a documentação do Next.js 14
3. Consulte o CLAUDE.md no root do projeto
4. Abra uma issue no repositório

---

**Criado em**: 2025-01-11
**Versão**: 1.0.0
**Framework**: Next.js 14 App Router
**Styling**: Tailwind CSS (Cyberpunk Theme)
**Backend**: Medusa v2.0
