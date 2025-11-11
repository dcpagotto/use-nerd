# ⚡ Guia de Teste Rápido - Frontend USE Nerd

**Status**: ✅ Servidor rodando em http://localhost:3000
**Tempo estimado**: 5-10 minutos

---

## 🚀 URLs para Testar

Abra seu navegador e teste estas páginas:

### 1. 🏠 Home Page
```
http://localhost:3000
```
**O que verificar**:
- ✅ Header aparece com logo "USE Nerd"
- ✅ Footer aparece
- ✅ Design cyberpunk (cores neon, fundo escuro)
- ✅ Menu de navegação funciona
- ✅ Botão "Conectar Carteira" visível

### 2. 🎲 Lista de Rifas
```
http://localhost:3000/raffles
```
**O que verificar**:
- ✅ Hero section "Rifas Ativas"
- ✅ Grid com 6+ rifas
- ✅ Cards de features (Blockchain, Segurança, Transparência)
- ✅ Cada card mostra:
  - Imagem do prêmio
  - Título e descrição
  - Preço em BRL (R$)
  - Progresso de tickets
  - Barra de progresso visual
  - Data do sorteio
  - Badge "ATIVO"
  - Botão "Ver Detalhes"

**Teste de interação**:
- 🖱️ Passar mouse no card → imagem faz zoom
- 🖱️ Clicar "Ver Detalhes" → redireciona

### 3. 📄 Detalhes da Rifa (Ativa)
```
http://localhost:3000/raffle/raffle-001
```
**O que verificar**:
- ✅ Breadcrumb: Home > Rifas > PlayStation 5
- ✅ Layout 2 colunas (imagem + info)
- ✅ Imagem grande do prêmio
- ✅ Badge "ATIVO"
- ✅ Stats cards:
  - Preço do ticket: R$ 50,00
  - Tickets vendidos: X de 1000
  - Data do sorteio
- ✅ **Countdown Timer** ⏱️
  - Timer atualiza a cada 1 segundo
  - Formato: Xd Xh Xm Xs
- ✅ Seletor de Tickets:
  - Campo de quantidade (default: 1)
  - Botões +/- funcionam
  - Não permite < 1 ou > 10
  - Total calculado (preço × quantidade)
  - Botão "Adicionar ao Carrinho"

**Testes de interação**:
- 🖱️ Clicar "+" → quantidade aumenta
- 🖱️ Clicar "-" → quantidade diminui
- 🖱️ Digitar 0 ou 11 → não aceita
- 🖱️ Clicar "Adicionar" → console.log (abra DevTools F12)

### 4. 📄 Detalhes da Rifa (Sorteada)
```
http://localhost:3000/raffle/raffle-005
```
**O que verificar**:
- ✅ Badge "SORTEADO"
- ✅ Banner de vencedor:
  - Nome truncado: 0x1234...5678
  - Número do ticket: #0042
  - Data do sorteio
- ✅ Botão "Verificar na Blockchain"
- ✅ Link para PolygonScan
- ❌ Seletor de tickets NÃO aparece (rifa encerrada)
- ❌ Countdown NÃO aparece

### 5. 🛒 Carrinho de Compras
```
http://localhost:3000
```
**Como testar**:
1. Clicar no ícone do carrinho (header)
2. Drawer abre da direita (animação suave)

**Estado Vazio**:
- ✅ Mensagem "Seu carrinho está vazio"
- ✅ Ícone de carrinho vazio
- ✅ Botão "Continuar Comprando"

**Com Items** (adicione alguns):
- ✅ Lista de items aparece
- ✅ Cada item mostra:
  - Thumbnail
  - Nome
  - Preço unitário
  - Quantidade
  - Subtotal
  - Botões +/- para ajustar
  - Botão X para remover
- ✅ Total geral correto
- ✅ Formatação BRL (R$ X,XX)

**Testes de interação**:
- 🖱️ Clicar "+" → quantidade aumenta, recalcula
- 🖱️ Clicar "-" → quantidade diminui, recalcula
- 🖱️ Clicar "X" → remove item
- 🖱️ Fechar e reabrir navegador → carrinho persiste (localStorage)

### 6. 🔗 Web3 Wallet
```
http://localhost:3000
```
**Pré-requisito**: MetaMask instalado

**Como testar**:
1. Clicar "Conectar Carteira" no header
2. Popup do MetaMask abre
3. Selecionar conta e aprovar

**Resultado esperado**:
- ✅ Botão muda para endereço truncado (0x1234...5678)
- ✅ Ícone de rede (Polygon)
- ✅ Dropdown com opções:
  - Copiar Endereço
  - Ver no PolygonScan
  - Desconectar

**Trocar rede**:
- Trocar MetaMask para Ethereum
- Sistema detecta e mostra warning
- Botão "Trocar para Polygon"

---

## 📱 Teste Responsivo

### Desktop (> 1024px)
- F12 → Toggle Device Toolbar
- Viewport: 1920x1080
- Grid de rifas: 3 colunas
- Layout 2 colunas funciona

### Tablet (768-1024px)
- Viewport: 768x1024
- Grid de rifas: 2 colunas
- Menu completo visível

### Mobile (< 768px)
- Viewport: 375x667 (iPhone SE)
- Grid de rifas: 1 coluna
- Menu hamburger aparece
- Botões touch-friendly (min 44px)
- Carrinho ocupa 90% da tela
- Countdown legível

---

## 🎨 Design Cyberpunk

Verifique se estes elementos aparecem:

- ✅ Fundo escuro (#0A0A0F)
- ✅ Bordas neon (purple, blue, pink)
- ✅ Efeitos de glow
- ✅ Animações suaves (Framer Motion)
- ✅ Fonts futurísticas
- ✅ Hover effects
- ✅ Loading states

---

## 🐛 Console do Navegador

Abra DevTools (F12) → Console:

**O que NÃO deve aparecer**:
- ❌ Erros em vermelho (errors)
- ❌ Hydration errors
- ❌ Failed to fetch
- ❌ CORS errors

**O que PODE aparecer**:
- ⚠️ Warnings em amarelo (aceitável)
- 📝 console.log de debug (normal)

**Logs esperados ao interagir**:
- "Adding to cart: ..." → ao adicionar produto
- "Connecting wallet..." → ao conectar MetaMask
- "Verifying on blockchain..." → ao clicar verificação

---

## ✅ Checklist Rápido (5 min)

- [ ] Home carrega completamente
- [ ] Lista de rifas mostra 6+ cards
- [ ] Detalhes da rifa mostra countdown funcionando
- [ ] Carrinho abre/fecha suavemente
- [ ] Design cyberpunk está aplicado
- [ ] Responsivo funciona (teste mobile)
- [ ] Console sem erros críticos

---

## 🎯 Se Encontrar Problemas

### Frontend não carrega
```bash
# Verificar se servidor está rodando
# Deve aparecer "Ready in Xs" no terminal
```

### Countdown não atualiza
- Problema conhecido: JavaScript desabilitado?
- Recarregar página (Ctrl+R)

### Carrinho não persiste
- LocalStorage pode estar desabilitado
- Modo privado/anônimo bloqueia localStorage

### MetaMask não conecta
- Verificar se extensão está instalada
- Verificar se site está em localhost (permitido)

---

## 📊 Reportar Resultados

Se encontrar bugs, anote:

1. **O que você fez** (passos)
2. **O que esperava** (comportamento correto)
3. **O que aconteceu** (comportamento incorreto)
4. **Print da tela** (se possível)
5. **Console errors** (F12 → Console → copiar erro)

Formato sugerido:
```markdown
## Bug: [Título]
- **Severidade**: Crítica | Alta | Média | Baixa
- **Página**: http://localhost:3000/...
- **Passos**:
  1. Abri a página X
  2. Cliquei em Y
  3. Resultado incorreto Z
- **Esperado**: Deveria fazer A
- **Atual**: Faz B
- **Console**: [erro aqui se houver]
```

---

## 🚀 Próximos Passos

Após testar:

1. **0-5 bugs encontrados** → ✅ Frontend OK! Prosseguir para deploy
2. **6-15 bugs encontrados** → ⚠️ Corrigir P0/P1 e continuar
3. **16+ bugs encontrados** → 🔴 Code review necessário

---

**Criado em**: 11/11/2025
**Servidor**: http://localhost:3000
**Status**: ✅ Rodando
**Tempo de teste**: 5-10 minutos

**Bons testes! 🧪✨**
