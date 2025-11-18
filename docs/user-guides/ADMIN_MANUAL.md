# USE Nerd - Manual do Administrador

**Projeto**: USE Nerd
**Versão**: 1.0
**Data**: 17 de Novembro de 2025
**Status**: Approved
**Autor**: Documentation Team

---

## Índice

1. [Bem-vindo ao Admin](#bem-vindo-ao-admin)
2. [Acessando o Medusa Admin](#acessando-o-medusa-admin)
3. [Gerenciamento de Produtos](#gerenciamento-de-produtos)
4. [Processamento de Pedidos](#processamento-de-pedidos)
5. [Gestão de Clientes](#gestão-de-clientes)
6. [Relatórios e Analytics](#relatórios-e-analytics)
7. [Configurações do Sistema](#configurações-do-sistema)

---

## Bem-vindo ao Admin

### O que é o Medusa Admin?

O **Medusa Admin** é o painel de controle completo da plataforma USE Nerd. Através dele, você gerencia:

- 📦 **Produtos**: Criar, editar, estoque, preços
- 🛒 **Pedidos**: Processar, rastrear, cancelar
- 👥 **Clientes**: Visualizar, editar, suporte
- 💰 **Finanças**: Vendas, relatórios, receita
- ⚙️ **Configurações**: Sistema, pagamentos, envio

### Requisitos de Acesso

- **Permissão**: Usuário com role `admin`
- **Navegador**: Chrome, Firefox, Safari ou Edge (atualizado)
- **Tela**: Mínimo 1280x720 (desktop recomendado)
- **Conexão**: Internet estável

---

## Acessando o Medusa Admin

### URL de Acesso

**Desenvolvimento**: http://localhost:9000/app
**Produção**: https://admin.usenerd.com (após deploy)

### Credenciais Padrão

```
Email: dhiego@pagotto.eu
Senha: ##Dcp1501
```

**⚠️ IMPORTANTE**: Altere a senha após primeiro login!

### Como Fazer Login

#### Passo 1: Acessar URL
Digite na barra do navegador:
```
http://localhost:9000/app
```

#### Passo 2: Tela de Login
```
┌────────────────────────────────────────────────┐
│                                                 │
│         [LOGO USE NERD]                        │
│                                                 │
│         Medusa Admin                            │
│                                                 │
├────────────────────────────────────────────────┤
│                                                 │
│  Email:                                         │
│  [dhiego@pagotto.eu_________________]          │
│                                                 │
│  Senha:                                         │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  [ ] Lembrar-me                                 │
│                                                 │
│  [        Entrar        ]                      │
│                                                 │
│  Esqueceu sua senha?                            │
│                                                 │
└────────────────────────────────────────────────┘
```

#### Passo 3: Dashboard
Após login bem-sucedido, você verá o Dashboard principal:

```
┌────────────────────────────────────────────────┐
│  [☰] USE Nerd Admin    [🔔]  [dhiego@...] [⚙]  │
├────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Vendas   │  │ Pedidos  │  │ Produtos │     │
│  │ R$ 8.523 │  │    47    │  │    15    │     │
│  │ +12% ↑   │  │  +5 hoje │  │ 15 ativos│     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  Últimos Pedidos:                               │
│  ┌────────────────────────────────────────┐   │
│  │ #12345  João Silva      R$ 198,10  🟢 │   │
│  │ #12344  Maria Santos    R$ 89,90   🟡 │   │
│  │ #12343  Pedro Costa     R$ 149,90  🟢 │   │
│  └────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
```

### Menu Lateral

O menu lateral (esquerda) contém todas as seções:

```
☰ Menu
├─ 📊 Dashboard
├─ 📦 Produtos
│  ├─ Lista
│  ├─ Adicionar Novo
│  ├─ Categorias
│  └─ Coleções
├─ 🛒 Pedidos
│  ├─ Todos
│  ├─ Pendentes
│  └─ Completos
├─ 👥 Clientes
├─ 🎲 Rifas (Nerd-Premiado)
├─ 💰 Finanças
├─ 📈 Relatórios
└─ ⚙️ Configurações
```

---

## Gerenciamento de Produtos

### Visualizar Produtos

#### 1. Acessar Lista
- Menu lateral → **Produtos** → **Lista**

#### 2. Visualização
```
┌────────────────────────────────────────────────┐
│  Produtos (15)                [+ Adicionar]     │
├────────────────────────────────────────────────┤
│  Buscar: [________________] [Filtros▼]         │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ [IMG] Camiseta Goku                      │ │
│  │       R$ 79,90  •  Estoque: 45          │ │
│  │       [Editar] [Ver] [...]               │ │
│  ├──────────────────────────────────────────┤ │
│  │ [IMG] Caneca Naruto                      │ │
│  │       R$ 39,90  •  Estoque: 120         │ │
│  │       [Editar] [Ver] [...]               │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  ← 1 2 3 4 5 →                                 │
└────────────────────────────────────────────────┘
```

#### 3. Filtros Disponíveis
- **Status**: Ativo, Rascunho, Arquivado
- **Categoria**: Todas, Camisetas, Canecas, etc.
- **Estoque**: Em estoque, Estoque baixo, Sem estoque
- **Preço**: Faixa de preço
- **Coleção**: Filtrar por coleção

### Adicionar Novo Produto

#### 1. Iniciar Criação
- Botão **[+ Adicionar]** (canto superior direito)
- Ou Menu → **Produtos** → **Adicionar Novo**

#### 2. Formulário Básico

##### Aba: Informações Gerais
```
┌────────────────────────────────────────────────┐
│  Adicionar Produto                              │
├────────────────────────────────────────────────┤
│  Título: *                                      │
│  [Camiseta Dragon Ball Z_________________]     │
│                                                 │
│  Descrição:                                     │
│  [Esta camiseta apresenta o icônico Goku...]   │
│  [___________________________________________] │
│  [___________________________________________] │
│                                                 │
│  Handle (URL): *                                │
│  [camiseta-dragon-ball-z________________]      │
│  URL: /produtos/camiseta-dragon-ball-z          │
│                                                 │
│  Status:                                        │
│  ( ) Rascunho  (•) Publicado  ( ) Arquivado   │
│                                                 │
│  * Campos obrigatórios                          │
└────────────────────────────────────────────────┘
```

**Dicas**:
- **Título**: Claro e descritivo (SEO importante)
- **Descrição**: Detalhe características, materiais, tamanhos
- **Handle**: Automático, mas pode customizar
- **Status**:
  - `Rascunho`: Não aparece na loja
  - `Publicado`: Visível para clientes
  - `Arquivado`: Oculto mas mantém histórico

##### Aba: Imagens
```
┌────────────────────────────────────────────────┐
│  Imagens do Produto                             │
├────────────────────────────────────────────────┤
│                                                 │
│  [Arrastar arquivos ou clicar para upload]     │
│  ┌─────────────────────────────────────────┐  │
│  │                                          │  │
│  │         📁  Soltar imagens aqui          │  │
│  │                                          │  │
│  │    Formatos: JPG, PNG, WEBP (max 5MB)   │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  Imagens Enviadas:                              │
│  ┌──────┐ ┌──────┐ ┌──────┐                   │
│  │ [IMG]│ │ [IMG]│ │ [IMG]│                   │
│  │ Main │ │      │ │      │                   │
│  │ [×]  │ │ [×]  │ │ [×]  │                   │
│  └──────┘ └──────┘ └──────┘                   │
│                                                 │
│  Dica: Primeira imagem = Thumbnail             │
└────────────────────────────────────────────────┘
```

**Boas Práticas**:
- **Quantidade**: Mínimo 3 imagens (frente, costas, detalhes)
- **Resolução**: 1000x1000px ou superior
- **Formato**: JPG ou PNG (WEBP para melhor performance)
- **Fundo**: Branco ou transparente (profissional)
- **Ordem**: Arraste para reordenar (primeira = principal)

##### Aba: Preços
```
┌────────────────────────────────────────────────┐
│  Preços e Variantes                             │
├────────────────────────────────────────────────┤
│  Produto tem variantes?                         │
│  ( ) Não - Produto simples                     │
│  (•) Sim - Tem variações (cor, tamanho, etc)  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Opções de Variação:                            │
│                                                 │
│  Opção 1: [Tamanho▼]                           │
│  Valores: [P] [M] [G] [GG] [XG]                │
│  [+ Adicionar valor]                            │
│                                                 │
│  Opção 2: [Cor▼]                                │
│  Valores: [Preto] [Branco] [Azul]              │
│  [+ Adicionar valor]                            │
│                                                 │
│  [+ Adicionar opção]                            │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Variantes Geradas (15):                        │
│  ┌────────────────────────────────────────┐   │
│  │ P / Preto    R$ [79,90] Estoque: [10] │   │
│  │ P / Branco   R$ [79,90] Estoque: [10] │   │
│  │ P / Azul     R$ [79,90] Estoque: [10] │   │
│  │ M / Preto    R$ [79,90] Estoque: [15] │   │
│  │ M / Branco   R$ [79,90] Estoque: [15] │   │
│  │ ... (mostrar todas)                    │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│  [Aplicar mesmo preço a todas: R$ 79,90]       │
└────────────────────────────────────────────────┘
```

**Para Produto Simples** (sem variantes):
```
┌────────────────────────────────────────────────┐
│  Preços                                         │
├────────────────────────────────────────────────┤
│  Preço: *                                       │
│  R$ [79,90____]                                │
│                                                 │
│  Preço Comparação (opcional):                   │
│  R$ [99,90____] (mostra "de R$ 99,90 por...")  │
│                                                 │
│  Custo (opcional - interno):                    │
│  R$ [35,00____]                                │
└────────────────────────────────────────────────┘
```

##### Aba: Estoque
```
┌────────────────────────────────────────────────┐
│  Controle de Estoque                            │
├────────────────────────────────────────────────┤
│  Rastrear estoque?                              │
│  [✓] Sim, rastrear quantidade disponível       │
│                                                 │
│  Quantidade em Estoque: *                       │
│  [50_____]                                     │
│                                                 │
│  Permitir backorder?                            │
│  [ ] Permitir compra mesmo sem estoque         │
│                                                 │
│  SKU (Código):                                  │
│  [CAM-DBZ-001__________________________]       │
│                                                 │
│  Código de Barras (EAN):                        │
│  [7891234567890_________________________]      │
│                                                 │
│  Peso (kg):                                     │
│  [0.250___] (usado para calcular frete)        │
│                                                 │
│  Dimensões (cm):                                │
│  Altura: [5__] Largura: [30__] Comp: [40__]   │
└────────────────────────────────────────────────┘
```

**Importante**:
- **SKU**: Use padrão consistente (ex: CAT-PROD-001)
- **Peso/Dimensões**: Precisos para frete correto
- **Backorder**: Habilitar só se fornecedor garante reposição

##### Aba: Organização
```
┌────────────────────────────────────────────────┐
│  Categorização                                  │
├────────────────────────────────────────────────┤
│  Categoria: *                                   │
│  [Camisetas▼]                                  │
│  [+ Criar nova categoria]                       │
│                                                 │
│  Coleções: (opcional)                           │
│  [ ] Dragon Ball                                │
│  [ ] Naruto                                     │
│  [✓] Animes                                    │
│  [ ] Heróis                                     │
│  [+ Criar nova coleção]                         │
│                                                 │
│  Tags: (separar por vírgula)                    │
│  [goku, dragon ball, anime, manga, saiyan]     │
│                                                 │
│  Tipo de Produto:                               │
│  [Camiseta▼]                                   │
│  [+ Criar novo tipo]                            │
└────────────────────────────────────────────────┘
```

##### Aba: SEO
```
┌────────────────────────────────────────────────┐
│  Otimização para Busca (SEO)                    │
├────────────────────────────────────────────────┤
│  Título SEO: (60 caracteres)                    │
│  [Camiseta Goku Dragon Ball Z - Compre Aqui]   │
│  47/60 caracteres                               │
│                                                 │
│  Meta Descrição: (160 caracteres)               │
│  [Camiseta premium do Goku de Dragon Ball Z.   │
│   100% algodão, vários tamanhos. Frete grátis  │
│   acima de R$ 150. Compre agora!]              │
│  142/160 caracteres                             │
│                                                 │
│  Preview Google:                                │
│  ┌──────────────────────────────────────────┐ │
│  │ Camiseta Goku Dragon Ball Z - Compre ...│ │
│  │ usenerd.com › produtos › camiseta...     │ │
│  │ Camiseta premium do Goku de Dragon ...  │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

#### 3. Salvar Produto

Botões na parte inferior:
- **[Salvar como Rascunho]**: Salva mas não publica
- **[Publicar]**: Salva e torna visível na loja
- **[Cancelar]**: Descarta alterações

### Editar Produto Existente

#### 1. Localizar Produto
- Lista de produtos → Clique em **[Editar]**
- Ou clique no nome do produto

#### 2. Editar Campos
- Mesma interface de criação
- Altere o que precisar

#### 3. Salvar Alterações
- Botão **[Salvar]** (canto superior direito)
- Ou **Ctrl+S** (Windows) / **Cmd+S** (Mac)

### Definir Preços

#### Preço Simples
```
Produto: Caneca Naruto
Preço: R$ 39,90
```

#### Preço com Desconto
```
Preço: R$ 39,90
Preço Comparação: R$ 49,90

Exibição na loja:
de R$ 49,90 por R$ 39,90 (20% OFF)
```

#### Preços por Variante
```
Camiseta Goku:
- P: R$ 79,90
- M: R$ 79,90
- G: R$ 79,90
- GG: R$ 84,90 (maior = mais caro)
- XG: R$ 89,90
```

### Upload de Imagens

#### Formatos Aceitos
- **JPG/JPEG**: Fotos realistas
- **PNG**: Imagens com transparência
- **WEBP**: Melhor compressão (recomendado)

#### Tamanho Máximo
- **5 MB** por imagem
- Use compressor online se necessário: tinypng.com

#### Resolução Recomendada
- **Mínimo**: 800x800px
- **Ideal**: 1200x1200px
- **Máximo**: 2000x2000px (maior = carregamento lento)

#### Boas Práticas de Foto
1. **Fundo**: Branco ou neutro
2. **Iluminação**: Natural ou profissional
3. **Ângulos**: Frente, costas, detalhes
4. **Contexto**: Pessoa usando (se aplicável)
5. **Zoom**: Detalhes de qualidade, estampa

### Gestão de Categorias

#### Criar Categoria

1. Menu → **Produtos** → **Categorias**
2. Botão **[+ Adicionar Categoria]**

```
┌────────────────────────────────────────────────┐
│  Nova Categoria                                 │
├────────────────────────────────────────────────┤
│  Nome: *                                        │
│  [Camisetas______________________]             │
│                                                 │
│  Handle (URL):                                  │
│  [camisetas______________________]             │
│                                                 │
│  Descrição:                                     │
│  [Camisetas geek e nerd com estampas únicas]   │
│                                                 │
│  Categoria Pai: (opcional)                      │
│  [Roupas▼]                                     │
│                                                 │
│  Ativa:                                         │
│  [✓] Mostrar na loja                           │
│                                                 │
│  [Salvar]  [Cancelar]                          │
└────────────────────────────────────────────────┘
```

#### Hierarquia de Categorias
```
Roupas (pai)
├─ Camisetas
├─ Moletons
└─ Bonés

Acessórios (pai)
├─ Canecas
├─ Mousepad
└─ Adesivos
```

### Gestão de Coleções

**Coleções** agrupam produtos por tema/campanha.

#### Criar Coleção

1. Menu → **Produtos** → **Coleções**
2. Botão **[+ Adicionar Coleção]**

```
┌────────────────────────────────────────────────┐
│  Nova Coleção                                   │
├────────────────────────────────────────────────┤
│  Título: *                                      │
│  [Dragon Ball Collection_____________]         │
│                                                 │
│  Handle:                                        │
│  [dragon-ball-collection_____________]         │
│                                                 │
│  Imagem de Capa:                                │
│  [Upload___]                                   │
│                                                 │
│  Adicionar Produtos:                            │
│  [ ] Todos produtos                             │
│  [✓] Selecionar manualmente                    │
│                                                 │
│  Produtos (5 selecionados):                     │
│  ┌──────────────────────────────────────────┐ │
│  │ [✓] Camiseta Goku                        │ │
│  │ [✓] Caneca Vegeta                        │ │
│  │ [✓] Mousepad Dragon Ball                 │ │
│  │ [✓] Adesivo Pack DBZ                     │ │
│  │ [✓] Boneco Goku Super Saiyan             │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  [Salvar]  [Cancelar]                          │
└────────────────────────────────────────────────┘
```

#### Coleções Automáticas
Baseadas em regras:
```
Coleção: "Produtos em Promoção"
Regra: Preço de comparação > Preço atual

Coleção: "Mais Vendidos"
Regra: Vendas > 50 unidades

Coleção: "Novidades"
Regra: Data criação < 30 dias
```

---

## Processamento de Pedidos

### Visualizar Pedidos

#### 1. Acessar Lista
Menu → **Pedidos** → **Todos**

#### 2. Visão Geral
```
┌────────────────────────────────────────────────┐
│  Pedidos (47)                 [Exportar CSV]    │
├────────────────────────────────────────────────┤
│  [Buscar] [Filtros▼] [Status: Todos▼]         │
│                                                 │
│  ┌────────────────────────────────────────────┐│
│  │ #12345  João Silva                   🟢   ││
│  │ 15/11/2025  R$ 198,10  PIX                ││
│  │ Status: Enviado                            ││
│  │ [Ver Detalhes] [Rastrear]                  ││
│  ├────────────────────────────────────────────┤│
│  │ #12344  Maria Santos                 🟡   ││
│  │ 15/11/2025  R$ 89,90   Cartão             ││
│  │ Status: Aguardando Pagamento               ││
│  │ [Ver Detalhes] [Confirmar Pagamento]       ││
│  └────────────────────────────────────────────┘│
│                                                 │
│  ← 1 2 3 4 5 →                                 │
└────────────────────────────────────────────────┘
```

#### 3. Filtros Disponíveis
- **Status**: Aguardando, Pago, Enviado, Entregue, Cancelado
- **Método Pagamento**: PIX, Cartão, Crypto
- **Data**: Hoje, Esta semana, Este mês, Personalizado
- **Cliente**: Buscar por nome/email
- **Valor**: Faixa de valor

### Status dos Pedidos

| Status | Cor | Significado | Ação Necessária |
|--------|-----|-------------|-----------------|
| **Aguardando Pagamento** | 🟡 | Pagamento pendente | Aguardar ou cancelar |
| **Pagamento Confirmado** | 🟢 | Pago, pronto para separar | Separar itens |
| **Em Separação** | 🔵 | Preparando pedido | Embalar |
| **Pronto para Envio** | 🟣 | Embalado | Gerar etiqueta e enviar |
| **Enviado** | 🟢 | Despachado | Atualizar rastreio |
| **Entregue** | ✅ | Cliente recebeu | Finalizado |
| **Cancelado** | 🔴 | Pedido cancelado | Processar reembolso |
| **Reembolsado** | 🟠 | Valor devolvido | Finalizado |

### Detalhes do Pedido

#### Visualização Completa
```
┌────────────────────────────────────────────────┐
│  Pedido #12345                    [Imprimir]    │
├────────────────────────────────────────────────┤
│  Status: 🟢 Enviado                            │
│  [Atualizar Status▼]                           │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Cliente:                                       │
│  João Silva                                     │
│  joao.silva@email.com                          │
│  (11) 99999-9999                               │
│  [Ver perfil]                                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Endereço de Entrega:                           │
│  Rua das Flores, 123 - Apt 45                  │
│  Centro, São Paulo - SP                         │
│  CEP: 12345-678                                │
│  [Copiar]                                      │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Itens do Pedido:                               │
│  ┌──────────────────────────────────────────┐ │
│  │ [IMG] Camiseta Goku (M, Preto)           │ │
│  │       1x R$ 79,90 = R$ 79,90             │ │
│  │       SKU: CAM-DBZ-001                    │ │
│  ├──────────────────────────────────────────┤ │
│  │ [IMG] Caneca Naruto                      │ │
│  │       2x R$ 39,90 = R$ 79,80             │ │
│  │       SKU: CAN-NAR-001                    │ │
│  ├──────────────────────────────────────────┤ │
│  │ [IMG] Adesivo Pack                       │ │
│  │       1x R$ 19,90 = R$ 19,90             │ │
│  │       SKU: ADE-MIX-001                    │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Subtotal:    R$ 179,60                        │
│  Frete (PAC): R$ 18,50                         │
│  Total:       R$ 198,10                        │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Pagamento:                                     │
│  Método: PIX                                    │
│  Status: ✅ Confirmado                         │
│  Data: 15/11/2025 às 14:31                     │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Envio:                                         │
│  Método: Correios PAC                           │
│  Código Rastreio: BR123456789BR                │
│  [Atualizar rastreio]                          │
│  Data Envio: 16/11/2025                        │
│  Previsão: 22/11/2025                          │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Timeline:                                      │
│  ✅ 15/11 14:30 - Pedido criado                │
│  ✅ 15/11 14:31 - Pagamento confirmado (PIX)    │
│  ✅ 16/11 10:00 - Pedido separado               │
│  ✅ 16/11 15:30 - Enviado (BR123456789BR)      │
│  🔄 17/11 08:00 - Em trânsito                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Notas Internas: (visível só para admins)      │
│  [Cliente solicitou embalagem de presente]     │
│  [__________________________________________]  │
│  [Adicionar Nota]                              │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Ações:                                         │
│  [Cancelar Pedido]                             │
│  [Processar Reembolso]                         │
│  [Enviar Email ao Cliente]                     │
│  [Imprimir Pedido]                             │
│  [Gerar Nota Fiscal] (em breve)                │
└────────────────────────────────────────────────┘
```

### Processando um Pedido

#### Fluxo Completo

**1. Pedido Recebido**
- Notificação: Email + Dashboard
- Verificar pagamento

**2. Pagamento Confirmado**
- PIX: Automático (5-30 segundos)
- Cartão: Automático (1-2 minutos)
- Crypto: Aguardar confirmações blockchain (3-15 min)

**3. Separar Pedido**
- Imprimir pedido ou ver no mobile
- Localizar produtos no estoque
- Verificar quantidades
- Separar itens

**4. Embalar**
- Embalar com cuidado
- Adicionar nota fiscal (quando disponível)
- Adicionar materiais promocionais (flyers, adesivos)

**5. Gerar Etiqueta de Envio**
```
Menu: Pedido #12345 → [Gerar Etiqueta]

┌────────────────────────────────────────────────┐
│  Envio - Pedido #12345                          │
├────────────────────────────────────────────────┤
│  Transportadora:                                │
│  (•) Correios PAC  ( ) Correios SEDEX          │
│                                                 │
│  Peso: 0,8 kg  Dimensões: 30x20x10cm           │
│  Valor declarado: R$ 198,10                    │
│                                                 │
│  Frete: R$ 18,50 (já pago pelo cliente)        │
│                                                 │
│  [Gerar Etiqueta PDF]                          │
│  [Solicitar Coleta] (opcional)                 │
└────────────────────────────────────────────────┘
```

**6. Imprimir Etiqueta**
- Imprimir em papel A4
- Colar na embalagem
- OU levar PDF nos Correios

**7. Postar nos Correios**
- Levar pacote até agência
- Solicitar comprovante de postagem
- Guardar comprovante

**8. Atualizar Status e Rastreio**
```
Pedido #12345 → [Atualizar Status]

Status: [Enviado▼]

Código Rastreio:
[BR123456789BR_______________]

Data de Envio:
[16/11/2025]

[Salvar e Notificar Cliente]
```

Cliente recebe email:
> Seu pedido foi enviado! Código: BR123456789BR
> Acompanhe: link do rastreio

**9. Monitorar Entrega**
- Correios atualizam status automaticamente
- Quando "Entregue": Status muda para ✅ Entregue

**10. Finalizado**
- Solicitar avaliação do cliente (email automático 3 dias após entrega)

### Cancelar Pedido

#### Quando Cancelar?
- Cliente solicitou cancelamento
- Pagamento não confirmado após 24h (PIX) ou 7 dias (Cartão)
- Produto sem estoque
- Endereço de entrega inválido

#### Como Cancelar

```
Pedido #12344 → [Ações] → [Cancelar Pedido]

┌────────────────────────────────────────────────┐
│  Cancelar Pedido #12344                         │
├────────────────────────────────────────────────┤
│  ⚠️ Esta ação não pode ser desfeita!            │
│                                                 │
│  Motivo do Cancelamento: *                      │
│  [Solicitado pelo cliente▼]                    │
│  - Solicitado pelo cliente                      │
│  - Produto sem estoque                          │
│  - Pagamento não confirmado                     │
│  - Endereço inválido                            │
│  - Outro                                        │
│                                                 │
│  Observações:                                   │
│  [Cliente desistiu da compra____________]      │
│  [_______________________________________]     │
│                                                 │
│  Processar Reembolso?                           │
│  [✓] Sim, reembolsar R$ 89,90 automaticamente │
│                                                 │
│  Notificar Cliente?                             │
│  [✓] Enviar email de cancelamento              │
│                                                 │
│  [Confirmar Cancelamento]  [Voltar]            │
└────────────────────────────────────────────────┘
```

Após confirmar:
- Status muda para 🔴 Cancelado
- Estoque é devolvido
- Reembolso processado (se pago)
- Cliente notificado por email

### Processar Reembolso

#### Reembolso Automático
- Ao cancelar pedido pago, reembolso é automático
- PIX: 1-3 dias úteis
- Cartão: 5-10 dias úteis (depende do banco)
- Crypto: 1-24 horas

#### Reembolso Manual
```
Pedido #12345 → [Ações] → [Processar Reembolso]

┌────────────────────────────────────────────────┐
│  Reembolso - Pedido #12345                      │
├────────────────────────────────────────────────┤
│  Valor Pago: R$ 198,10                         │
│  Método: PIX                                    │
│                                                 │
│  Valor do Reembolso:                            │
│  (•) Total: R$ 198,10                          │
│  ( ) Parcial: R$ [____]                        │
│                                                 │
│  Motivo:                                        │
│  [Produto com defeito▼]                        │
│                                                 │
│  Observações:                                   │
│  [Cliente reportou defeito na camiseta]        │
│  [_______________________________________]     │
│                                                 │
│  [Processar Reembolso]  [Cancelar]             │
└────────────────────────────────────────────────┘
```

### Imprimir Pedido

Útil para separação de estoque:

```
[Imprimir] → Visualização para impressão:

╔════════════════════════════════════════════╗
║          USE NERD - PEDIDO #12345          ║
╠════════════════════════════════════════════╣
║ Data: 15/11/2025                           ║
║ Status: Pagamento Confirmado               ║
║                                            ║
║ CLIENTE:                                   ║
║ João Silva                                 ║
║ joao.silva@email.com                      ║
║ (11) 99999-9999                           ║
║                                            ║
║ ENTREGA:                                   ║
║ Rua das Flores, 123 - Apt 45              ║
║ Centro, São Paulo - SP                     ║
║ CEP: 12345-678                            ║
║                                            ║
║ ITENS:                                     ║
║ ┌────────────────────────────────────────┐║
║ │ 1x Camiseta Goku (M, Preto)            │║
║ │    SKU: CAM-DBZ-001                     │║
║ │    Localização: Prateleira A3           │║
║ │    [ ] Separado                         │║
║ ├────────────────────────────────────────┤║
║ │ 2x Caneca Naruto                        │║
║ │    SKU: CAN-NAR-001                     │║
║ │    Localização: Prateleira B1           │║
║ │    [ ] Separado                         │║
║ ├────────────────────────────────────────┤║
║ │ 1x Adesivo Pack                         │║
║ │    SKU: ADE-MIX-001                     │║
║ │    Localização: Caixa C5                │║
║ │    [ ] Separado                         │║
║ └────────────────────────────────────────┘║
║                                            ║
║ PAGAMENTO: PIX - R$ 198,10 (PAGO)         ║
║ FRETE: Correios PAC - R$ 18,50            ║
║                                            ║
║ NOTAS:                                     ║
║ Cliente solicitou embalagem de presente    ║
║                                            ║
║ ──────────────────────────────────────────║
║ Separado por: _____________ Data: ____    ║
║ Conferido por: _____________ Data: ____   ║
╚════════════════════════════════════════════╝
```

---

## Gestão de Clientes

### Visualizar Clientes

Menu → **Clientes**

```
┌────────────────────────────────────────────────┐
│  Clientes (127)                [+ Adicionar]    │
├────────────────────────────────────────────────┤
│  Buscar: [________________] [Filtros▼]         │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ João Silva                               │ │
│  │ joao.silva@email.com                    │ │
│  │ Pedidos: 5  |  Total gasto: R$ 892,50   │ │
│  │ [Ver Perfil] [Enviar Email]              │ │
│  ├──────────────────────────────────────────┤ │
│  │ Maria Santos                             │ │
│  │ maria.santos@email.com                  │ │
│  │ Pedidos: 2  |  Total gasto: R$ 289,80   │ │
│  │ [Ver Perfil] [Enviar Email]              │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

### Perfil do Cliente

```
┌────────────────────────────────────────────────┐
│  João Silva                    [Editar] [...]   │
├────────────────────────────────────────────────┤
│  Email: joao.silva@email.com                   │
│  Telefone: (11) 99999-9999                     │
│  CPF: 123.456.789-00                           │
│  Data Cadastro: 10/10/2025                     │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Estatísticas:                                  │
│  • Total de Pedidos: 5                         │
│  • Total Gasto: R$ 892,50                      │
│  • Ticket Médio: R$ 178,50                     │
│  • Último Pedido: 15/11/2025                   │
│  • Tempo como Cliente: 1 mês                   │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Endereços Salvos:                              │
│  ┌──────────────────────────────────────────┐ │
│  │ 📍 Rua das Flores, 123 - Apt 45          │ │
│  │    Centro, São Paulo - SP, 12345-678     │ │
│  │    [Padrão] [Editar] [Remover]           │ │
│  ├──────────────────────────────────────────┤ │
│  │ 📍 Av. Paulista, 1000 - Conj 501         │ │
│  │    Bela Vista, São Paulo - SP, 01310-100 │ │
│  │    [Editar] [Remover]                    │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Histórico de Pedidos:                          │
│  ┌──────────────────────────────────────────┐ │
│  │ #12345  R$ 198,10  15/11/2025  Enviado  │ │
│  │ #12298  R$ 149,90  08/11/2025  Entregue │ │
│  │ #12156  R$ 89,90   01/11/2025  Entregue │ │
│  │ #12034  R$ 234,60  25/10/2025  Entregue │ │
│  │ #11987  R$ 220,00  18/10/2025  Entregue │ │
│  └──────────────────────────────────────────┘ │
│  [Ver Todos]                                   │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Notas do Admin: (visível só para admins)      │
│  [Cliente VIP - sempre dar atenção especial]   │
│  [__________________________________________]  │
│  [Adicionar Nota]                              │
└────────────────────────────────────────────────┘
```

### Segmentação de Clientes

#### Filtros Úteis

**Por Valor Gasto:**
- VIP: > R$ 1.000
- Regular: R$ 500 - R$ 1.000
- Novo: < R$ 500

**Por Frequência:**
- Fiel: 5+ pedidos
- Recorrente: 2-4 pedidos
- Primeira compra: 1 pedido

**Por Atividade:**
- Ativo: Comprou nos últimos 30 dias
- Inativo: Sem compras há 90+ dias

### Enviar Email para Cliente

```
Cliente: João Silva → [Enviar Email]

┌────────────────────────────────────────────────┐
│  Enviar Email - João Silva                      │
├────────────────────────────────────────────────┤
│  Para: joao.silva@email.com                    │
│                                                 │
│  Assunto:                                       │
│  [Sobre seu pedido #12345_______________]      │
│                                                 │
│  Mensagem:                                      │
│  ┌──────────────────────────────────────────┐ │
│  │ Olá João,                                │ │
│  │                                          │ │
│  │ Seu pedido #12345 foi enviado hoje!     │ │
│  │                                          │ │
│  │ Código de rastreio: BR123456789BR        │ │
│  │                                          │ │
│  │ Qualquer dúvida, estamos à disposição.  │ │
│  │                                          │ │
│  │ Att,                                     │ │
│  │ Equipe USE Nerd                          │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  [Enviar]  [Cancelar]                          │
└────────────────────────────────────────────────┘
```

---

## Relatórios e Analytics

### Dashboard Principal

Menu → **Dashboard**

```
┌────────────────────────────────────────────────┐
│  Período: [Últimos 30 dias▼]                   │
├────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Receita  │  │ Pedidos  │  │ Taxa de  │     │
│  │ R$ 8.523 │  │    47    │  │ Conversão│     │
│  │ +12% ↑   │  │  +5 hoje │  │   2.8%   │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  Gráfico de Vendas:                             │
│  ┌──────────────────────────────────────────┐ │
│  │ R$                                        │ │
│  │  500┤     ▄█                              │ │
│  │  400┤    ▄██    ▄█                        │ │
│  │  300┤   ▄███   ▄██  ▄█                    │ │
│  │  200┤  ▄████  ▄███ ▄██  ▄█                │ │
│  │  100┤ ▄█████ ▄████▄███ ▄██  ▄█           │ │
│  │    0├─────────────────────────────────    │ │
│  │      1  5  10  15  20  25  30 (dias)     │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Top 5 Produtos Mais Vendidos:                  │
│  1. Camiseta Goku - 23 unidades                │
│  2. Caneca Naruto - 18 unidades                │
│  3. Mousepad Sasuke - 15 unidades              │
│  4. Adesivo Pack - 12 unidades                 │
│  5. Boneco Vegeta - 10 unidades                │
│                                                 │
│  Métodos de Pagamento:                          │
│  PIX:     68% (32 pedidos)                     │
│  Cartão:  28% (13 pedidos)                     │
│  Crypto:   4% (2 pedidos)                      │
└────────────────────────────────────────────────┘
```

### Relatório de Vendas

Menu → **Relatórios** → **Vendas**

```
┌────────────────────────────────────────────────┐
│  Relatório de Vendas          [Exportar CSV]    │
├────────────────────────────────────────────────┤
│  Período: [01/11/2025] a [17/11/2025]          │
│  [Aplicar]                                      │
│                                                 │
│  Resumo:                                        │
│  • Total de Pedidos: 47                        │
│  • Receita Bruta: R$ 8.523,00                  │
│  • Descontos: R$ 341,00                        │
│  • Frete: R$ 870,50                            │
│  • Receita Líquida: R$ 8.182,00                │
│  • Ticket Médio: R$ 181,34                     │
│  • Taxa de Cancelamento: 4,2%                  │
│                                                 │
│  Por Dia:                                       │
│  ┌──────────────────────────────────────────┐ │
│  │ Data       Pedidos  Receita     Ticket   │ │
│  ├──────────────────────────────────────────┤ │
│  │ 17/11/2025    3     R$ 567,70   R$ 189  │ │
│  │ 16/11/2025    5     R$ 892,50   R$ 178  │ │
│  │ 15/11/2025    8     R$ 1.456,80 R$ 182  │ │
│  │ ...                                      │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Por Categoria:                                 │
│  • Camisetas: R$ 3.756,20 (44%)                │
│  • Canecas: R$ 1.596,20 (19%)                  │
│  • Acessórios: R$ 2.170,60 (25%)               │
│  • Outros: R$ 1.000,00 (12%)                   │
└────────────────────────────────────────────────┘
```

### Relatório de Estoque

Menu → **Relatórios** → **Estoque**

```
┌────────────────────────────────────────────────┐
│  Relatório de Estoque         [Exportar CSV]    │
├────────────────────────────────────────────────┤
│  Filtros: [Todos▼] [Categoria: Todas▼]        │
│                                                 │
│  Resumo:                                        │
│  • Total de Produtos: 15                       │
│  • Total em Estoque: 487 unidades              │
│  • Valor em Estoque: R$ 34.589,00              │
│  • Estoque Baixo: 3 produtos                   │
│  • Sem Estoque: 0 produtos                     │
│                                                 │
│  Produtos em Estoque Baixo (< 10 unidades):     │
│  ┌──────────────────────────────────────────┐ │
│  │ Produto              Estoque  Recomendado │ │
│  ├──────────────────────────────────────────┤ │
│  │ Camiseta Goku (GG)      5     Repor 20   │ │
│  │ Caneca Sasuke           7     Repor 30   │ │
│  │ Mousepad Naruto         9     Repor 25   │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Movimentação (últimos 7 dias):                 │
│  • Entradas: 120 unidades                      │
│  • Saídas: 78 unidades                         │
│  • Saldo: +42 unidades                         │
└────────────────────────────────────────────────┘
```

### Exportar Relatórios

Botão **[Exportar CSV]** gera arquivo Excel/CSV com todos os dados:

```csv
Data,Pedido,Cliente,Email,Itens,Total,Metodo,Status
15/11/2025,#12345,João Silva,joao@email.com,3,198.10,PIX,Enviado
15/11/2025,#12344,Maria Santos,maria@email.com,2,89.90,Cartão,Aguardando
...
```

Útil para:
- Análises externas (Excel, Google Sheets)
- Contabilidade
- Relatórios fiscais

---

## Configurações do Sistema

### Configurações Gerais

Menu → **Configurações** → **Geral**

```
┌────────────────────────────────────────────────┐
│  Configurações Gerais                           │
├────────────────────────────────────────────────┤
│  Nome da Loja:                                  │
│  [USE Nerd________________________]            │
│                                                 │
│  Email de Contato:                              │
│  [contato@usenerd.com_______________]          │
│                                                 │
│  Telefone:                                      │
│  [(11) 99999-9999___________________]          │
│                                                 │
│  Moeda Padrão:                                  │
│  [BRL - Real Brasileiro▼]                      │
│                                                 │
│  Timezone:                                      │
│  [America/Sao_Paulo (BRT)▼]                    │
│                                                 │
│  Idioma:                                        │
│  [Português (Brasil)▼]                         │
│                                                 │
│  [Salvar Alterações]                           │
└────────────────────────────────────────────────┘
```

### Configurações de Pagamento

Menu → **Configurações** → **Pagamentos**

```
┌────────────────────────────────────────────────┐
│  Métodos de Pagamento                           │
├────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐ │
│  │ Stripe                            [✓] ON │ │
│  │ PIX, Cartões, Crypto                     │ │
│  │ [Configurar]                             │ │
│  ├──────────────────────────────────────────┤ │
│  │ Coinbase Commerce                 [✓] ON │ │
│  │ BTC, ETH, USDC, USDT                     │ │
│  │ [Configurar]                             │ │
│  ├──────────────────────────────────────────┤ │
│  │ Mercado Pago                      [ ] OFF│ │
│  │ Cartões, PIX, Boleto (Brasil)            │ │
│  │ [Habilitar]                              │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

#### Configurar Stripe

```
┌────────────────────────────────────────────────┐
│  Stripe - Configurações                         │
├────────────────────────────────────────────────┤
│  Modo:                                          │
│  ( ) Test (Sandbox)                             │
│  (•) Live (Produção)                           │
│                                                 │
│  Secret Key:                                    │
│  [sk_live_••••••••••••••••••••••••••]         │
│                                                 │
│  Publishable Key:                               │
│  [pk_live_••••••••••••••••••••••••••]         │
│                                                 │
│  Webhook Secret:                                │
│  [whsec_•••••••••••••••••••••••••••]          │
│                                                 │
│  Métodos Habilitados:                           │
│  [✓] Cartões de Crédito                        │
│  [✓] PIX                                       │
│  [✓] Criptomoedas (auto-conversão BRL)        │
│                                                 │
│  [Testar Conexão]  [Salvar]                    │
└────────────────────────────────────────────────┘
```

### Configurações de Envio

Menu → **Configurações** → **Envio**

```
┌────────────────────────────────────────────────┐
│  Frete e Envio                                  │
├────────────────────────────────────────────────┤
│  Endereço de Origem (seu estoque):              │
│  CEP: [12345-678___]                           │
│  Rua: [Rua do Estoque, 456_____________]       │
│  Número: [456_] Complemento: [Galpão 2]       │
│  Bairro: [Industrial_______]                   │
│  Cidade: [São Paulo________] UF: [SP]          │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Métodos de Envio:                              │
│  ┌──────────────────────────────────────────┐ │
│  │ Correios PAC                     [✓] ON  │ │
│  │ Prazo: 5-10 dias úteis                   │ │
│  │ [Configurar]                             │ │
│  ├──────────────────────────────────────────┤ │
│  │ Correios SEDEX                   [✓] ON  │ │
│  │ Prazo: 1-3 dias úteis                    │ │
│  │ [Configurar]                             │ │
│  ├──────────────────────────────────────────┤ │
│  │ Melhor Envio (Cotação Automática) [ ]    │ │
│  │ API Key: [________________________]      │ │
│  │ [Habilitar]                              │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Frete Grátis:                                  │
│  [✓] Habilitar frete grátis                    │
│  Valor mínimo: R$ [150,00____]                 │
│  Regiões: [Todo Brasil▼]                       │
│                                                 │
│  [Salvar Alterações]                           │
└────────────────────────────────────────────────┘
```

### Configurações de Email

Menu → **Configurações** → **Emails**

```
┌────────────────────────────────────────────────┐
│  Notificações por Email                         │
├────────────────────────────────────────────────┤
│  Provider:                                      │
│  (•) SendGrid  ( ) Resend  ( ) SMTP            │
│                                                 │
│  SendGrid API Key:                              │
│  [SG.•••••••••••••••••••••••••••••••••]       │
│                                                 │
│  Email Remetente:                               │
│  [noreply@usenerd.com_______________]          │
│                                                 │
│  Nome Remetente:                                │
│  [USE Nerd_________________________]           │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Templates de Email:                            │
│  [✓] Confirmação de Pedido                     │
│  [✓] Pedido Enviado                            │
│  [✓] Pedido Entregue                           │
│  [✓] Pedido Cancelado                          │
│  [✓] Bem-vindo (novo cliente)                  │
│  [✓] Recuperação de Senha                      │
│                                                 │
│  [Testar Envio]  [Salvar]                      │
└────────────────────────────────────────────────┘
```

### Usuários Admin

Menu → **Configurações** → **Usuários**

```
┌────────────────────────────────────────────────┐
│  Usuários Admin             [+ Adicionar Novo]  │
├────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐ │
│  │ Dhiego Pagotto                           │ │
│  │ dhiego@pagotto.eu                       │ │
│  │ Role: Owner (Todos os Permissões)        │ │
│  │ [Editar] [...]                           │ │
│  ├──────────────────────────────────────────┤ │
│  │ Gerente Loja                             │ │
│  │ gerente@usenerd.com                     │ │
│  │ Role: Admin (Produtos, Pedidos)          │ │
│  │ [Editar] [Remover]                       │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

#### Adicionar Novo Usuário Admin

```
┌────────────────────────────────────────────────┐
│  Novo Usuário Admin                             │
├────────────────────────────────────────────────┤
│  Nome:                                          │
│  [__________________________________]          │
│                                                 │
│  Email:                                         │
│  [__________________________________]          │
│                                                 │
│  Senha Temporária:                              │
│  [__________________________________]          │
│  (Usuário será solicitado a alterar)           │
│                                                 │
│  Role/Permissões:                               │
│  [Admin▼]                                      │
│  - Owner: Todos acessos                         │
│  - Admin: Produtos, Pedidos, Clientes          │
│  - Editor: Produtos, Conteúdo                   │
│  - Suporte: Pedidos, Clientes (visualização)   │
│                                                 │
│  [Criar Usuário]  [Cancelar]                   │
└────────────────────────────────────────────────┘
```

### Alterar Senha

Menu → **Perfil** (ícone no canto superior direito) → **Alterar Senha**

```
┌────────────────────────────────────────────────┐
│  Alterar Senha                                  │
├────────────────────────────────────────────────┤
│  Senha Atual:                                   │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  Nova Senha:                                    │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  Confirmar Nova Senha:                          │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  Requisitos:                                    │
│  ✅ Mínimo 8 caracteres                        │
│  ✅ Letra maiúscula                            │
│  ✅ Letra minúscula                            │
│  ✅ Número                                     │
│                                                 │
│  [Alterar Senha]  [Cancelar]                   │
└────────────────────────────────────────────────┘
```

---

## Dicas e Boas Práticas

### Gestão Eficiente

#### 1. Rotina Diária
- **Manhã**:
  - Verificar pedidos novos
  - Confirmar pagamentos
  - Separar pedidos do dia
  - Responder mensagens de clientes

- **Tarde**:
  - Embalar e enviar pedidos
  - Atualizar rastreios
  - Repor estoque se necessário
  - Verificar métricas

#### 2. Organização de Estoque
- Use SKUs padronizados
- Mantenha localização física organizada
- Faça contagem semanal
- Alerta de estoque baixo configurado

#### 3. Atendimento ao Cliente
- Responda em até 2 horas úteis
- Seja educado e prestativo
- Resolva problemas proativamente
- Peça feedback após entrega

#### 4. Otimização de Vendas
- Fotos profissionais
- Descrições detalhadas
- Preços competitivos
- Promoções sazonais
- SEO otimizado

#### 5. Segurança
- Altere senha regularmente
- Não compartilhe credenciais
- Faça backup de dados
- Revise acessos de usuários

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| **Ctrl+S** | Salvar |
| **Ctrl+P** | Imprimir |
| **Ctrl+F** | Buscar |
| **Esc** | Fechar modal |
| **?** | Ajuda/Atalhos |

### Troubleshooting

#### Problema: Não consigo fazer login
- Verificar email/senha
- Testar "Esqueci minha senha"
- Limpar cache do navegador
- Tentar navegador diferente

#### Problema: Pedido não aparece
- Verificar filtros ativos
- Buscar por número do pedido
- Verificar status (pode estar arquivado)

#### Problema: Produto não aparece na loja
- Verificar se está "Publicado"
- Verificar se tem estoque
- Verificar se tem preço definido
- Verificar categorização

---

## Conclusão

Este manual cobre todas as funcionalidades principais do Medusa Admin. Para dúvidas ou suporte adicional, entre em contato com o time técnico.

**Contato Suporte Técnico**:
- Email: tech@usenerd.com
- Documentação completa: [Project Overview](../project-management/PROJECT_OVERVIEW.md)

---

**Última atualização**: 17/11/2025
**Próxima revisão**: 17/12/2025

**Documentos Relacionados**:
- [User Manual](./USER_MANUAL.md)
- [Strapi Content Guide](./STRAPI_CONTENT_GUIDE.md)
- [Current Status Report](../project-management/CURRENT_STATUS_REPORT.md)
