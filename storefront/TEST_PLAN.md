# 🧪 Plano de Testes - USE Nerd Frontend

**Data**: 11/11/2025
**Objetivo**: Validar implementação atual do frontend
**Tempo estimado**: 2-4 horas

---

## 📋 Checklist de Preparação

### ✅ Pré-requisitos
- [ ] Docker containers rodando (PostgreSQL, Redis, Medusa)
- [ ] Backend Medusa acessível em http://localhost:9000
- [ ] Node.js 20+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env.local` configurado

### 🔍 Verificar Status do Backend
```bash
# Verificar containers
docker-compose ps

# Testar API Medusa
curl http://localhost:9000/health

# Ver logs se necessário
docker-compose logs -f medusa-backend
```

---

## 🧪 Testes Funcionais

### 1. Teste de Inicialização (5 min)

**Objetivo**: Verificar se o servidor inicia corretamente

**Passos**:
```bash
cd C:\Users\dcpagotto\Documents\Projects\use-nerd\storefront
npm run dev
```

**Resultado Esperado**:
```
✓ Ready in 3.5s
○ Local: http://localhost:3000
○ Network: http://192.168.x.x:3000
```

**Verificar**:
- [ ] Servidor inicia sem erros
- [ ] Não há warnings de TypeScript
- [ ] Não há erros de compilação

---

### 2. Teste da Página Inicial (5 min)

**URL**: http://localhost:3000

**Verificar**:
- [ ] Página carrega completamente
- [ ] Header aparece (logo "USE Nerd")
- [ ] Footer aparece (copyright, links)
- [ ] Menu de navegação funciona
- [ ] Botão "Conectar Carteira" aparece
- [ ] Ícone do carrinho aparece
- [ ] Design cyberpunk (cores neon, fundo dark)

**Testes de Interação**:
- [ ] Clicar em "Rifas" no menu → redireciona
- [ ] Clicar em "Produtos" → redireciona (404 esperado)
- [ ] Clicar no ícone do carrinho → abre drawer
- [ ] Menu mobile (< 768px) abre e fecha

**Screenshots**: 📸 Tirar print da home page

---

### 3. Teste da Listagem de Rifas (10 min)

**URL**: http://localhost:3000/raffles

**Verificar Layout**:
- [ ] Hero section com título "Rifas Ativas"
- [ ] Cards de features (Blockchain, Segurança, Transparência)
- [ ] Grid de rifas (3 colunas em desktop)
- [ ] Seção "Rifas Finalizadas" aparece
- [ ] Seção "Como Funciona" (3 passos)

**Verificar Cards de Rifas**:
- [ ] Pelo menos 6 rifas ativas aparecem
- [ ] Cada card mostra:
  - [ ] Imagem do prêmio
  - [ ] Título da rifa
  - [ ] Descrição do prêmio
  - [ ] Preço do ticket (em BRL)
  - [ ] Progresso (X de Y tickets)
  - [ ] Barra de progresso visual
  - [ ] Data do sorteio
  - [ ] Badge de status (ATIVO)
  - [ ] Botão "Ver Detalhes"

**Testes de Interação**:
- [ ] Hover no card → efeito de zoom na imagem
- [ ] Hover no botão → muda cor (neon effect)
- [ ] Clicar em "Ver Detalhes" → redireciona

**Testes Responsivos**:
- [ ] Desktop (> 1024px): 3 colunas
- [ ] Tablet (768-1024px): 2 colunas
- [ ] Mobile (< 768px): 1 coluna

**Screenshots**: 📸 Tirar print da grid de rifas

---

### 4. Teste de Detalhes da Rifa (15 min)

**URLs para Testar**:
- http://localhost:3000/raffle/raffle-001 (PlayStation 5 - Ativa)
- http://localhost:3000/raffle/raffle-005 (Xbox Series X - Sorteada)

#### 4.1 Rifa Ativa (raffle-001)

**Verificar Estrutura**:
- [ ] Breadcrumb navigation (Home > Rifas > PlayStation 5)
- [ ] Layout 2 colunas (imagem esq, info dir)
- [ ] Imagem grande do prêmio (1000x1000px)
- [ ] Título da rifa
- [ ] Badge de status "ATIVO"

**Verificar Stats Cards**:
- [ ] Card "Preço do Ticket": R$ 50,00
- [ ] Card "Tickets Vendidos": X de 1000
- [ ] Card "Data do Sorteio": DD/MM/YYYY
- [ ] Barra de progresso funcionando

**Verificar Countdown Timer**:
- [ ] Timer aparece e está formatado (dias, horas, min, seg)
- [ ] Timer **atualiza a cada 1 segundo** ⏱️
- [ ] Countdown não trava/congela

**Verificar Seletor de Tickets**:
- [ ] Campo de quantidade (default: 1)
- [ ] Botões +/- funcionam
- [ ] Não permite quantidade < 1
- [ ] Não permite quantidade > 10
- [ ] Total é calculado corretamente (preço × quantidade)
- [ ] Botão "Adicionar ao Carrinho" aparece

**Testes de Interação**:
- [ ] Clicar "+" → aumenta quantidade
- [ ] Clicar "-" → diminui quantidade
- [ ] Digitar número no input → aceita valor válido
- [ ] Digitar número inválido (0, 11, -1) → não aceita
- [ ] Clicar "Adicionar ao Carrinho" → mostra console.log (mock)

**Verificar Seções Informativas**:
- [ ] "Sobre o Prêmio" está presente
- [ ] "Como Funciona" (3 passos) está presente

**Screenshots**:
- 📸 Timer funcionando
- 📸 Seletor de tickets
- 📸 Layout completo

#### 4.2 Rifa Sorteada (raffle-005)

**Verificar**:
- [ ] Badge "SORTEADO" aparece
- [ ] Banner de vencedor aparece:
  - [ ] Nome do vencedor (truncado)
  - [ ] Número do ticket vencedor
  - [ ] Data do sorteio
- [ ] Botão "Verificar na Blockchain" aparece
- [ ] Link para PolygonScan aparece
- [ ] Seletor de tickets NÃO aparece (rifa encerrada)
- [ ] Countdown timer NÃO aparece

**Testes de Interação**:
- [ ] Clicar "Verificar na Blockchain" → mostra console.log
- [ ] Clicar link PolygonScan → abre em nova aba

**Screenshots**: 📸 Banner de vencedor

---

### 5. Teste do Carrinho de Compras (10 min)

**Abrir Carrinho**:
- [ ] Clicar no ícone do carrinho no header
- [ ] Drawer abre suavemente (animação Framer Motion)
- [ ] Drawer vem da direita

**Estado Vazio**:
- [ ] Mensagem "Seu carrinho está vazio" aparece
- [ ] Ícone de carrinho vazio
- [ ] Botão "Continuar Comprando"

**Adicionar Items**:
- [ ] Ir para home, clicar em "Adicionar ao Carrinho" (produtos exemplo)
- [ ] Drawer abre automaticamente
- [ ] Item aparece na lista

**Verificar Item no Carrinho**:
- [ ] Thumbnail do produto
- [ ] Nome do produto
- [ ] Preço unitário
- [ ] Quantidade
- [ ] Subtotal (preço × quantidade)
- [ ] Botões +/- para ajustar quantidade
- [ ] Botão X para remover

**Verificar Totais**:
- [ ] Subtotal atualiza ao mudar quantidade
- [ ] Total geral está correto
- [ ] Formatação BRL (R$ X,XX)

**Testes de Interação**:
- [ ] Clicar "+" → aumenta quantidade, recalcula total
- [ ] Clicar "-" → diminui quantidade, recalcula total
- [ ] Clicar "X" → remove item
- [ ] Remover todos → volta para estado vazio

**Persistência**:
- [ ] Fechar e reabrir navegador → carrinho persiste (localStorage)

**Screenshots**: 📸 Carrinho com items

---

### 6. Teste de Conexão Web3 (15 min)

**Pré-requisito**: Ter MetaMask instalado

#### 6.1 Sem MetaMask
- [ ] Clicar "Conectar Carteira" sem MetaMask
- [ ] Mostra erro ou redirect para instalar MetaMask

#### 6.2 Com MetaMask
- [ ] Clicar "Conectar Carteira"
- [ ] Popup do MetaMask abre
- [ ] Selecionar conta
- [ ] Aprovar conexão
- [ ] Botão muda para mostrar endereço truncado (0x1234...5678)
- [ ] Ícone de rede aparece (Polygon)

**Verificar Dropdown**:
- [ ] Clicar no endereço → dropdown abre
- [ ] Opções aparecem:
  - [ ] "Copiar Endereço"
  - [ ] "Ver no PolygonScan"
  - [ ] "Desconectar"

**Testes de Interação**:
- [ ] Clicar "Copiar Endereço" → copia para clipboard
- [ ] Clicar "Ver no PolygonScan" → abre em nova aba
- [ ] Clicar "Desconectar" → desconecta e volta para estado inicial

**Trocar de Rede**:
- [ ] Trocar MetaMask para outra rede (Ethereum)
- [ ] Sistema detecta e mostra warning
- [ ] Botão "Trocar para Polygon" aparece
- [ ] Clicar → MetaMask solicita troca de rede

**Auto-Reconexão**:
- [ ] Fechar navegador e reabrir
- [ ] Carteira reconecta automaticamente

**Screenshots**: 📸 Carteira conectada

---

### 7. Teste de Responsividade (10 min)

**Testar em 3 Tamanhos**:

#### Desktop (1920x1080)
- [ ] Layout 2 colunas funciona
- [ ] Grid de rifas: 3 colunas
- [ ] Menu completo visível
- [ ] Imagens em alta resolução

#### Tablet (768x1024)
- [ ] Layout 2 colunas funciona
- [ ] Grid de rifas: 2 colunas
- [ ] Menu completo visível
- [ ] Font sizes reduzem levemente

#### Mobile (375x667)
- [ ] Layout 1 coluna (vertical stack)
- [ ] Grid de rifas: 1 coluna
- [ ] Menu hamburger aparece
- [ ] Botões touch-friendly (min 44px)
- [ ] Imagens responsive
- [ ] Carrinho ocupa 90% da tela
- [ ] Countdown legível

**Testar Hamburger Menu**:
- [ ] Ícone aparece em mobile
- [ ] Clicar → menu slide in
- [ ] Links funcionam
- [ ] Fechar com X ou backdrop

**Screenshots**:
- 📸 Desktop
- 📸 Tablet
- 📸 Mobile

---

### 8. Teste de Performance (5 min)

**Métricas no DevTools**:

**Lighthouse Audit** (Chrome DevTools):
```
1. Abrir DevTools (F12)
2. Aba "Lighthouse"
3. Selecionar "Mobile" ou "Desktop"
4. Clicar "Analyze page load"
```

**Verificar Scores**:
- [ ] Performance: > 80
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

**Network Tab**:
- [ ] Total bundle size: < 500kb (gzipped)
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3.5s

**Screenshots**: 📸 Lighthouse scores

---

### 9. Teste de Acessibilidade (5 min)

**Navegação por Teclado**:
- [ ] Tab através de todos os elementos interativos
- [ ] Focus states são visíveis (bordas neon)
- [ ] Enter/Space acionam botões
- [ ] Escape fecha modals/drawers

**Screen Reader** (opcional):
- [ ] NVDA (Windows) ou VoiceOver (Mac)
- [ ] Textos alternativos nas imagens
- [ ] ARIA labels nos botões
- [ ] Landmark roles (<nav>, <main>, <footer>)

**Contraste de Cores**:
- [ ] Texto branco (#F9FAFB) em fundo dark (#0A0A0F) → passa WCAG AA
- [ ] Neon colors em fundo dark → passa WCAG AA

---

### 10. Teste de Console (5 min)

**Verificar Console do Navegador**:
- [ ] Não há **errors** em vermelho
- [ ] Warnings são aceitáveis (dependency warnings, etc.)
- [ ] Não há memory leaks
- [ ] Não há infinite loops

**Logs Esperados** (console.log):
- [ ] "Adding to cart: ..." ao adicionar produto
- [ ] "Connecting wallet..." ao conectar MetaMask
- [ ] "Verifying on blockchain..." ao clicar verificação

---

## 🐛 Documentar Bugs Encontrados

### Template de Bug Report

Para cada bug encontrado, documentar:

```markdown
## Bug #X: [Título curto]

**Severidade**: Crítica | Alta | Média | Baixa

**Descrição**:
[Descrever o que aconteceu]

**Passos para Reproduzir**:
1. [Passo 1]
2. [Passo 2]
3. [Resultado incorreto]

**Resultado Esperado**:
[O que deveria acontecer]

**Resultado Atual**:
[O que acontece]

**Screenshots**:
[Anexar prints]

**Ambiente**:
- Browser: Chrome/Firefox/Safari
- OS: Windows/Mac/Linux
- Viewport: Desktop/Tablet/Mobile

**Console Errors**:
```
[Copiar erros do console]
```

**Prioridade para Correção**: P0 | P1 | P2 | P3
```

---

## ✅ Checklist Final

Após completar todos os testes:

- [ ] Todos os testes passaram ou bugs foram documentados
- [ ] Screenshots foram tirados
- [ ] Bug reports foram criados
- [ ] Performance está aceitável (Lighthouse > 80)
- [ ] Não há erros críticos no console
- [ ] Responsividade funciona em 3 tamanhos
- [ ] Carrinho persiste corretamente
- [ ] Web3 conecta sem problemas

---

## 📊 Resumo dos Testes

Preencher após completar:

| Categoria | Total Tests | Passed | Failed | Bugs Found |
|-----------|-------------|--------|--------|------------|
| Inicialização | 3 | - | - | - |
| Home Page | 7 | - | - | - |
| Listagem Rifas | 15 | - | - | - |
| Detalhes Rifa | 25 | - | - | - |
| Carrinho | 15 | - | - | - |
| Web3 | 12 | - | - | - |
| Responsividade | 10 | - | - | - |
| Performance | 4 | - | - | - |
| Acessibilidade | 5 | - | - | - |
| Console | 3 | - | - | - |
| **TOTAL** | **99** | **-** | **-** | **-** |

---

## 🚀 Próximos Passos

Após completar os testes:

1. **Se 0-5 bugs**: Prosseguir para Opção B (Completar Frontend)
2. **Se 6-15 bugs**: Corrigir bugs críticos primeiro
3. **Se 16+ bugs**: Code review necessário

---

## 📝 Notas Adicionais

Use este espaço para anotações gerais:

```
[Suas observações aqui]
```

---

**Data de Teste**: ___/___/_____
**Testado por**: _____________________
**Duração**: _____ horas
**Status**: ☐ Aprovado | ☐ Aprovado com ressalvas | ☐ Reprovado
