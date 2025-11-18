# Como Adicionar Preços aos Produtos no Medusa v2

## Problema
Quando você cria um novo produto no Medusa Admin, as páginas dinâmicas existem, mas os produtos não aparecem na API pública até que você configure **preços** e **estoque**.

## Solução Rápida via Admin UI

### Passo 1: Acessar o Admin
1. Abra http://localhost:9000/app
2. Login: `admin@use-nerd.com`
3. Senha: `Admin@2025`

### Passo 2: Editar o Produto
1. No menu lateral, clique em **Products**
2. Encontre o produto sem preço (ex: "Produto Teste", "TEste2")
3. Clique no produto para editá-lo

### Passo 3: Adicionar Preços
1. Role até a seção **Variants** (Variantes)
2. Para cada variante, clique em **Edit** (Editar)
3. Na seção **Pricing** (Preços):
   - Clique em **+ Add Price**
   - Selecione a **Region**: `Brasil (BRL)`
   - Digite o **Amount**: por exemplo `10000` (= R$ 100,00)
   - *Nota*: Valores são em centavos! R$ 100,00 = 10000
4. Repita para outras moedas se necessário:
   - Region: `Global (USD)`
   - Amount: `2500` (= $25.00)
5. Clique em **Save**

### Passo 4: Configurar Estoque (Inventory)
1. Ainda na edição da variante
2. Na seção **Inventory**:
   - **Manage Inventory**: ✅ Marque
   - **Stock Location**: Selecione `Armazém São Paulo`
   - **Quantity**: Digite `100` (ou a quantidade desejada)
   - **Allow Backorders**: ❌ Desmarque (ou marque se quiser aceitar pedidos sem estoque)
3. Clique em **Save**

### Passo 5: Salvar e Publicar
1. Clique em **Save** no topo da página
2. Certifique-se que o **Status** do produto está **Published** (Publicado)
3. Se não estiver, mude para **Published** e salve novamente

## Verificação

### Teste via API
Abra o terminal e execute:

```bash
curl -H "x-publishable-api-key: pk_8f93219b24d3c73d3f433e0b382021bfe330f9706f6881c7c34cf7031f0e33ba" \
  "http://localhost:9000/store/products" | python -m json.tool
```

Você deve ver seus novos produtos listados!

### Teste no Frontend
1. Abra http://localhost:3000/produtos
2. Veja se o produto aparece na listagem
3. Clique no produto
4. A página individual deve carregar normalmente
5. Você pode adicionar ao carrinho

## Por que isso é necessário?

No Medusa v2, produtos só aparecem na API pública quando:

✅ Têm **status** = "published"
✅ Têm **preços** configurados para a região
✅ Têm **estoque** > 0 (ou allow_backorder habilitado)
✅ Estão associados a um **Sales Channel**

## Conversão de Preços

| Preço Real | Valor em Centavos |
|-----------|-------------------|
| R$ 10,00  | 1000             |
| R$ 50,00  | 5000             |
| R$ 100,00 | 10000            |
| R$ 149,90 | 14990            |
| R$ 299,00 | 29900            |

## Atalhos no Admin

- **Produtos**: http://localhost:9000/app/products
- **Editar Produto Teste**: http://localhost:9000/app/products/prod_01K9W6JMBJHDV1ZQME3RNXPTX7
- **Editar TEste2**: http://localhost:9000/app/products/prod_01K9W7NXFZ6YSVGEDF4N60TQFE

## Troubleshooting

### Produto ainda não aparece?
1. Verifique se salvou as alterações
2. Verifique se o status é "Published"
3. Recarregue a página de produtos no frontend (Ctrl+F5)
4. Verifique os logs do backend: `docker logs use-nerd-backend`

### Erro ao adicionar ao carrinho?
- Certifique-se de que o estoque está > 0
- Ou habilite "Allow Backorders"

## Automatização Futura

Para automatizar isso em novos produtos, você pode:
1. Criar um script de seed que adicione preços automaticamente
2. Configurar preços padrão no Admin
3. Usar o Medusa Admin Widgets para adicionar preços rapidamente

---

**Criado em**: 12/11/2025
**Projeto**: USE Nerd E-commerce Platform
