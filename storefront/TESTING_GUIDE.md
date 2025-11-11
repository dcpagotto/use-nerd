# Guia de Testes - Páginas de Rifas

Este guia demonstra como testar as páginas de rifas criadas, tanto manualmente quanto com testes automatizados futuros.

## Testes Manuais

### Pré-requisitos
```bash
cd C:\Users\dcpagotto\Documents\Projects\use-nerd\storefront
npm install
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

---

## 1. Teste de Navegação

### Teste 1.1: Acesso à página de listagem
```
URL: http://localhost:3000/raffles

✓ Hero section aparece com título "Rifas Blockchain"
✓ Features (Verificado na Blockchain, 100% Seguro, Pagamento Seguro) aparecem
✓ Grid de rifas carrega com cards
✓ Seção "Rifas Ativas" mostra rifas active/closed
✓ Seção "Rifas Finalizadas" mostra rifas drawn
✓ Seção "Como Funciona" aparece no final
```

### Teste 1.2: Navegação para detalhes
```
1. Na página /raffles, clique em qualquer card de rifa
2. Deve redirecionar para /raffle/[id]
3. URL deve mudar para /raffle/raffle-001 (ou outro ID)
4. Página de detalhes deve carregar
```

### Teste 1.3: Breadcrumb
```
1. Na página /raffle/raffle-001
2. Verifique breadcrumb: Home / Rifas / [Nome da Rifa]
3. Clique em "Rifas" no breadcrumb
4. Deve voltar para /raffles
```

---

## 2. Teste de RaffleCard

### Teste 2.1: Informações exibidas
Para cada card em /raffles, verifique:
```
✓ Imagem do prêmio (ou placeholder)
✓ Badge de status no canto superior direito
✓ Título da rifa
✓ Descrição do prêmio (2 linhas máximo)
✓ Preço por ticket em BRL
✓ Progresso: "X de Y tickets vendidos"
✓ Barra de progresso visual
✓ Porcentagem ao lado da barra
✓ Data do sorteio com ícone de calendário
✓ Botão "Ver Detalhes"
```

### Teste 2.2: Hover effects
```
1. Passe o mouse sobre um card
2. Verifique:
   ✓ Borda muda para cor neon roxo
   ✓ Sombra neon aparece
   ✓ Imagem dá zoom suavemente
   ✓ Título muda para cor neon roxa
   ✓ Botão "Ver Detalhes" aumenta levemente
```

### Teste 2.3: Status badges
Verifique cores dos badges:
```
- Ativo: Verde com borda (raffle-001, raffle-002, raffle-003)
- Encerrado: Amarelo com borda (raffle-004)
- Sorteado: Roxo com borda (raffle-005)
```

---

## 3. Teste de Página de Detalhes

### Teste 3.1: Rifa Ativa (raffle-001)
```
URL: http://localhost:3000/raffle/raffle-001

Layout:
✓ Imagem grande (50% width desktop, 100% mobile)
✓ Informações ao lado (50% width desktop, 100% mobile)
✓ Título grande
✓ Descrição completa
✓ Stats cards (Preço do Ticket, Tickets Vendidos)
✓ Barra de progresso grande
✓ Countdown timer funcionando
✓ RaffleTicketSelector aparece
✓ Seção "Sobre o Prêmio"
✓ Seção "Como Funciona" (3 passos)
```

### Teste 3.2: Countdown Timer
```
1. Observe o countdown por 10 segundos
2. Verifique:
   ✓ Dias atualizando
   ✓ Horas atualizando
   ✓ Minutos atualizando
   ✓ Segundos atualizando a cada segundo
   ✓ Números sempre com 2 dígitos (01, 02, 03...)
   ✓ Labels corretas (Dias, Horas, Min, Seg)
```

### Teste 3.3: Rifa Sorteada (raffle-005)
```
URL: http://localhost:3000/raffle/raffle-005

Diferenças:
✓ Badge "SORTEADO" sobreposto na imagem
✓ Countdown NÃO aparece
✓ RaffleTicketSelector NÃO aparece
✓ Seção "Vencedor Anunciado!" aparece
✓ Número do ticket vencedor: #347
✓ Nome do ganhador: João S.
✓ Botão "Verificar na Blockchain"
✓ Link "Ver no PolygonScan" com ícone de external link
```

### Teste 3.4: Rifa Não Encontrada
```
URL: http://localhost:3000/raffle/invalid-id

✓ Ícone de erro vermelho
✓ Mensagem "Rifa não encontrada"
✓ Descrição explicativa
✓ Botão "Voltar para Rifas"
✓ Clicar no botão redireciona para /raffles
```

---

## 4. Teste de RaffleTicketSelector

### Teste 4.1: Botões +/-
```
1. Acesse /raffle/raffle-001
2. Encontre o seletor de tickets
3. Quantidade inicial: 1

Teste incremento:
- Clique no botão "+"
- Quantidade aumenta para 2
- Total atualiza (R$ 10,00 → R$ 20,00)
- Clique + 8 vezes (total 10)
- Botão "+" fica desabilitado (máximo 10)

Teste decremento:
- Clique no botão "-"
- Quantidade diminui para 9
- Total atualiza (R$ 100,00 → R$ 90,00)
- Clique - 8 vezes (total 1)
- Botão "-" fica desabilitado (mínimo 1)
```

### Teste 4.2: Input direto
```
1. Clique no input de quantidade
2. Digite "5"
3. Verifique:
   ✓ Quantidade muda para 5
   ✓ Total atualiza para R$ 50,00

Valores inválidos:
- Digite "0" → deve voltar para 1
- Digite "-5" → deve voltar para 1
- Digite "100" → deve limitar a 10
- Digite "abc" → deve voltar para 1
```

### Teste 4.3: Botão Adicionar ao Carrinho
```
1. Selecione 3 tickets
2. Clique em "Adicionar ao Carrinho"
3. Verifique:
   ✓ Botão mostra "Adicionando..." com spinner
   ✓ Botão fica desabilitado
   ✓ Alert aparece: "3 tickets adicionados ao carrinho!"
   ✓ Quantidade volta para 1 após adicionar
```

### Teste 4.4: Informações exibidas
```
✓ Header: "Comprar Tickets" + "X disponíveis"
✓ Label "Quantidade"
✓ Resumo de preço:
  - Preço unitário
  - Quantidade
  - Total (em destaque roxo)
✓ Info box azul com explicação
✓ Ícone de informação
```

### Teste 4.5: Estado esgotado
```
Para testar, modifique temporariamente mock-data.ts:
sold_tickets: 1000 (igual a total_tickets)

Verifique:
✓ Badge "ESGOTADO" vermelho
✓ Botões +/- desabilitados
✓ Input desabilitado
✓ Botão mostra "Esgotado" e está desabilitado
✓ Texto "0 disponíveis"
```

---

## 5. Teste de Responsividade

### Teste 5.1: Desktop (1920x1080)
```
/raffles:
✓ Hero centralizado com espaçamento adequado
✓ Grid com 3 colunas
✓ Cards proporcionais

/raffle/[id]:
✓ Layout 2 colunas (imagem | info)
✓ Countdown com 4 colunas
✓ Todos os elementos visíveis sem scroll horizontal
```

### Teste 5.2: Tablet (768x1024)
```
/raffles:
✓ Hero reduz tamanho de fonte
✓ Grid com 2 colunas
✓ Cards mantêm proporções

/raffle/[id]:
✓ Layout ainda 2 colunas (mas mais estreito)
✓ Countdown com 4 colunas
✓ Fonte reduzida proporcionalmente
```

### Teste 5.3: Mobile (375x667)
```
/raffles:
✓ Hero com título menor
✓ Features em coluna única ou wrap
✓ Grid com 1 coluna
✓ Cards ocupam largura total

/raffle/[id]:
✓ Layout 1 coluna (imagem acima, info abaixo)
✓ Imagem aspect-square mantém
✓ Countdown 4 colunas (mais compacto)
✓ RaffleTicketSelector responsivo
✓ Botões com tamanho adequado para touch
✓ Textos legíveis
```

### Teste 5.4: Mobile Landscape (667x375)
```
✓ Sem overflow horizontal
✓ Elementos não quebram layout
✓ Navbar acessível
```

---

## 6. Teste de Performance

### Teste 6.1: Lighthouse Score
```
1. Abra DevTools (F12)
2. Aba "Lighthouse"
3. Selecione: Performance, Accessibility, Best Practices, SEO
4. Clique em "Analyze page load"

Targets:
✓ Performance: > 90
✓ Accessibility: > 90
✓ Best Practices: > 90
✓ SEO: > 90
```

### Teste 6.2: Network
```
1. DevTools → Network tab
2. Recarregue /raffles
3. Verifique:
   ✓ Imagens carregam lazy
   ✓ Fontes são otimizadas
   ✓ CSS é minificado
   ✓ JavaScript é code-split
   ✓ Total size < 2MB
```

### Teste 6.3: Loading States
```
Para simular loading lento:
1. DevTools → Network
2. Throttling: "Slow 3G"
3. Recarregue /raffles

Verifique:
✓ Skeleton placeholders aparecem
✓ Layout não quebra durante loading
✓ Nenhum CLS (Cumulative Layout Shift)
```

---

## 7. Teste de Acessibilidade

### Teste 7.1: Navegação por Teclado
```
1. Use apenas Tab para navegar
2. Verifique:
   ✓ Todos os links são acessíveis
   ✓ Todos os botões são acessíveis
   ✓ Input de quantidade é acessível
   ✓ Focus states são visíveis
   ✓ Ordem de tabulação faz sentido
```

### Teste 7.2: Screen Reader (NVDA/JAWS)
```
Elementos que devem ser anunciados:
✓ "PlayStation 5 + 2 Controles, link"
✓ "Preço do Ticket: R$ 10,00"
✓ "657 de 1000 tickets vendidos"
✓ "Adicionar ao Carrinho, botão"
✓ "Aumentar quantidade, botão"
✓ "Diminuir quantidade, botão"
```

### Teste 7.3: Contraste de Cores
```
Use DevTools → Lighthouse → Accessibility

Verifique:
✓ Todos os textos têm contraste suficiente
✓ WCAG AA compliance
✓ Botões são distinguíveis do background
```

---

## 8. Teste de Estados de Erro

### Teste 8.1: API offline
```
1. Pare o backend Medusa (se estiver rodando)
2. Acesse /raffles
3. Verifique:
   ✓ Console mostra: "Error fetching raffles, using mock data"
   ✓ Página carrega normalmente com MOCK_RAFFLES
   ✓ Nenhum crash ou tela branca
```

### Teste 8.2: ID inválido
```
URL: /raffle/invalid-123

✓ Error state aparece
✓ Mensagem amigável
✓ Botão de retorno funciona
✓ Nenhum erro no console
```

### Teste 8.3: Imagem quebrada
```
Para simular, modifique temporariamente um mock:
image: 'https://invalid-url.com/image.jpg'

✓ Placeholder aparece
✓ Alt text é exibido
✓ Layout não quebra
```

---

## 9. Teste de Integração Blockchain

### Teste 9.1: Botão Verificar na Blockchain
```
URL: /raffle/raffle-005

1. Clique em "Verificar na Blockchain"
2. Verifique:
   ✓ Botão mostra "Verificando..."
   ✓ Botão fica desabilitado
   ✓ Console mostra chamada da API
   ✓ Alert de sucesso ou erro aparece
```

### Teste 9.2: Link PolygonScan
```
1. Clique em "Ver no PolygonScan"
2. Verifique:
   ✓ Nova aba abre
   ✓ URL: https://polygonscan.com/tx/0xfedcba...
   ✓ Rel="noopener noreferrer" (segurança)
```

---

## 10. Checklist Pré-Deploy

Antes de fazer deploy para produção:

### Backend
- [ ] Endpoints de rafas implementados
- [ ] Validação server-side funcionando
- [ ] Rate limiting configurado
- [ ] CORS configurado corretamente

### Frontend
- [ ] Remover/desabilitar MOCK_RAFFLES
- [ ] Variáveis de ambiente configuradas
- [ ] Error boundaries implementados
- [ ] Analytics configurado (se aplicável)

### Conteúdo
- [ ] Imagens reais dos prêmios
- [ ] Textos revisados (PT-BR correto)
- [ ] Termos e condições linkados
- [ ] Política de privacidade linkada

### SEO
- [ ] Sitemap.xml gerado
- [ ] Robots.txt configurado
- [ ] Meta tags verificadas
- [ ] Schema.org markup (se aplicável)

### Performance
- [ ] Lighthouse score > 90 em todas as métricas
- [ ] Imagens otimizadas (WebP, AVIF)
- [ ] Lazy loading implementado
- [ ] CDN configurado

### Segurança
- [ ] HTTPS habilitado
- [ ] Headers de segurança configurados
- [ ] XSS protection
- [ ] CSRF tokens

---

## Testes Automatizados Futuros

### Estrutura de testes sugerida:

```
storefront/
├── __tests__/
│   ├── components/
│   │   ├── RaffleCard.test.tsx
│   │   └── RaffleTicketSelector.test.tsx
│   ├── pages/
│   │   ├── raffles.test.tsx
│   │   └── raffle-detail.test.tsx
│   └── e2e/
│       ├── raffle-purchase-flow.spec.ts
│       └── raffle-navigation.spec.ts
```

### Exemplo: Unit test para RaffleCard (Vitest)
```typescript
// __tests__/components/RaffleCard.test.tsx
import { render, screen } from '@testing-library/react';
import RaffleCard from '@/components/RaffleCard';
import { MOCK_RAFFLES } from '@/lib/mock-data';

describe('RaffleCard', () => {
  it('renders raffle information correctly', () => {
    const raffle = MOCK_RAFFLES[0];
    render(<RaffleCard raffle={raffle} />);

    expect(screen.getByText(raffle.title)).toBeInTheDocument();
    expect(screen.getByText(/Ver Detalhes/i)).toBeInTheDocument();
  });

  it('shows active status badge', () => {
    const raffle = MOCK_RAFFLES[0];
    render(<RaffleCard raffle={raffle} />);

    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });
});
```

### Exemplo: E2E test (Playwright)
```typescript
// __tests__/e2e/raffle-purchase-flow.spec.ts
import { test, expect } from '@playwright/test';

test('user can add raffle tickets to cart', async ({ page }) => {
  await page.goto('http://localhost:3000/raffles');

  // Clica no primeiro card
  await page.click('a[href^="/raffle/"]').first();

  // Aumenta quantidade
  await page.click('button[aria-label="Aumentar quantidade"]');
  await page.click('button[aria-label="Aumentar quantidade"]');

  // Verifica total
  await expect(page.locator('text=/R\\$ 30,00/')).toBeVisible();

  // Adiciona ao carrinho
  await page.click('button:has-text("Adicionar ao Carrinho")');

  // Verifica alert
  await expect(page.locator('text=/3 tickets adicionados/')).toBeVisible();
});
```

---

## Relatório de Bugs

Ao encontrar bugs durante os testes, documente:

### Template de Bug Report
```markdown
## Bug: [Título descritivo]

**Severidade**: Crítico | Alto | Médio | Baixo

**Ambiente**:
- OS: Windows 11
- Browser: Chrome 120
- Screen: 1920x1080

**Passos para Reproduzir**:
1. Acesse /raffles
2. Clique em...
3. ...

**Comportamento Esperado**:
[Descreva o que deveria acontecer]

**Comportamento Atual**:
[Descreva o que está acontecendo]

**Screenshots**:
[Anexe prints se relevante]

**Console Logs**:
```
[Cole erros do console]
```

**Notas Adicionais**:
[Informações extras que possam ajudar]
```

---

## Contato

Para reportar bugs ou sugerir melhorias nos testes:
- Abra uma issue no repositório
- Tag: `testing`, `raffle-pages`

**Última atualização**: 2025-01-11
