# Quick Start - Páginas de Rifas

Guia rápido para começar a trabalhar com as páginas de rifas em 5 minutos.

## 1. Setup Rápido (30 segundos)

```bash
# Navegue até o storefront
cd C:\Users\dcpagotto\Documents\Projects\use-nerd\storefront

# Instale dependências (se ainda não instalou)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

✅ Servidor rodando em `http://localhost:3000`

---

## 2. Teste Básico (1 minuto)

Abra o navegador e acesse:

### 📋 Página de Listagem
```
URL: http://localhost:3000/raffles
```
Você verá:
- Grid com 6+ rifas ativas
- Design cyberpunk com bordas neon
- Cards interativos com hover effects

### 🎯 Página de Detalhes
```
URL: http://localhost:3000/raffle/raffle-001
```
Você verá:
- Detalhes completos do PlayStation 5
- Countdown timer funcionando
- Seletor de tickets para compra

### 🏆 Rifa Sorteada
```
URL: http://localhost:3000/raffle/raffle-005
```
Você verá:
- Anúncio do vencedor (João S.)
- Ticket #347 vencedor
- Botão de verificação blockchain

---

## 3. Estrutura de Arquivos

```
storefront/
├── app/
│   ├── raffles/
│   │   └── page.tsx          ← Listagem de rifas (Server Component)
│   └── raffle/
│       └── [id]/
│           └── page.tsx      ← Detalhes da rifa (Client Component)
│
├── components/
│   ├── RaffleCard.tsx        ← Card de rifa reutilizável
│   └── RaffleTicketSelector.tsx ← Seletor de tickets
│
├── lib/
│   ├── mock-data.ts          ← Dados de teste
│   ├── medusa-client.ts      ← API client (já existia)
│   ├── web3-client.ts        ← Blockchain client (já existia)
│   └── utils.ts              ← Helpers brasileiros (já existia)
│
└── types/
    └── index.ts              ← TypeScript types (já existia)
```

---

## 4. Como Usar os Componentes

### RaffleCard
```tsx
import RaffleCard from '@/components/RaffleCard';
import { MOCK_RAFFLES } from '@/lib/mock-data';

export default function MyPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {MOCK_RAFFLES.map(raffle => (
        <RaffleCard key={raffle.id} raffle={raffle} />
      ))}
    </div>
  );
}
```

### RaffleTicketSelector
```tsx
'use client';

import RaffleTicketSelector from '@/components/RaffleTicketSelector';
import { MOCK_RAFFLES } from '@/lib/mock-data';

export default function MyPage() {
  const raffle = MOCK_RAFFLES[0];

  const handleAddToCart = (quantity: number) => {
    console.log(`Adicionando ${quantity} tickets`);
    // Sua lógica aqui
  };

  return (
    <RaffleTicketSelector
      raffle={raffle}
      onAddToCart={handleAddToCart}
    />
  );
}
```

---

## 5. Dados de Teste

### Usar dados mockados
```typescript
import { MOCK_RAFFLES, getMockRaffleById } from '@/lib/mock-data';

// Todas as rifas
const allRaffles = MOCK_RAFFLES;

// Uma rifa específica
const raffle = getMockRaffleById('raffle-001');

// Rifas ativas
import { getMockActiveRaffles } from '@/lib/mock-data';
const activeRaffles = getMockActiveRaffles();

// Rifas sorteadas
import { getMockDrawnRaffles } from '@/lib/mock-data';
const drawnRaffles = getMockDrawnRaffles();
```

### IDs disponíveis para teste
- `raffle-001` - PlayStation 5 (ativa)
- `raffle-002` - iPhone 15 Pro Max (ativa)
- `raffle-003` - Setup Gamer (ativa)
- `raffle-004` - Vale Presente (encerrada)
- `raffle-005` - Xbox Series X (sorteada) ⭐
- `raffle-006` - Nintendo Switch (ativa)
- `raffle-007` - Cadeira Gamer (ativa)
- `raffle-008` - Meta Quest 3 (ativa)

---

## 6. Modificar Dados de Teste

Edite `lib/mock-data.ts`:

```typescript
export const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'raffle-001',
    title: 'Seu Prêmio Aqui',
    ticket_price: 1000, // R$ 10.00 (em centavos)
    total_tickets: 1000,
    sold_tickets: 500, // 50% vendido
    status: 'active', // 'draft' | 'active' | 'closed' | 'drawn' | 'cancelled'
    // ... outros campos
  },
  // ... outras rifas
];
```

---

## 7. Customizar Estilos

### Classes Tailwind Cyberpunk disponíveis

#### Cores
```css
text-neon-purple     /* Roxo primário */
text-neon-blue       /* Azul secundário */
text-neon-pink       /* Rosa acento */
text-neon-green      /* Verde sucesso */
text-neon-red        /* Vermelho erro */
```

#### Backgrounds
```css
bg-cyber-dark-200    /* Background escuro */
bg-cyber-dark-50     /* Card background */
bg-gradient-cyber    /* Gradient roxo → azul */
```

#### Efeitos
```css
shadow-neon-purple   /* Glow effect roxo */
border-neon-purple   /* Borda neon */
hover:shadow-neon-purple  /* Hover glow */
```

#### Animações
```css
animate-glow-pulse   /* Pulso de brilho */
animate-fade-in      /* Fade in suave */
```

---

## 8. Integrar com Backend (quando estiver pronto)

### Antes (mock):
```typescript
// app/raffles/page.tsx
async function getRaffles(): Promise<Raffle[]> {
  return MOCK_RAFFLES; // Dados falsos
}
```

### Depois (real):
```typescript
// app/raffles/page.tsx
import { raffleApi } from '@/lib/medusa-client';

async function getRaffles(): Promise<Raffle[]> {
  const response = await raffleApi.getActiveRaffles();
  return response.raffles;
}
```

---

## 9. Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia dev server
npm run build            # Build de produção
npm run start            # Inicia prod server

# Linting
npm run lint             # Verifica código
```

---

## 10. Recursos Adicionais

### Documentação Completa
- 📖 [RAFFLE_PAGES_README.md](./RAFFLE_PAGES_README.md) - Documentação detalhada
- 🧪 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guia de testes

---

## Pronto para começar? 🚀

```bash
npm run dev
```

Abra http://localhost:3000/raffles e divirta-se! 🎮

**Última atualização**: 2025-01-11
