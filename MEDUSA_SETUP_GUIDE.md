# 🛠️ Guia de Configuração do Medusa Admin

**Data**: 11/11/2025
**Objetivo**: Configurar produtos, regiões e pagamentos no Medusa v2

---

## 📋 Pré-requisitos

✅ Backend Medusa rodando em `http://localhost:9000`
✅ PostgreSQL ativo
✅ Redis ativo
✅ Migrations aplicadas (123)

---

## 🚀 Passo 1: Acessar o Medusa Admin

### 1.1 Abrir o Admin

```bash
# URL do Admin
http://localhost:9000/app
```

### 1.2 Criar Conta de Administrador (Primeira Vez)

Se for a primeira vez acessando:

1. Abra `http://localhost:9000/app`
2. Clique em **"Create Admin User"** ou **"Sign Up"**
3. Preencha:
   - **Email**: `admin@usenerd.com` (ou seu email)
   - **Password**: Senha forte (min. 8 caracteres)
   - **First Name**: `Admin`
   - **Last Name**: `USE Nerd`
4. Clique em **"Create Account"**
5. Faça login com as credenciais

---

## 🌎 Passo 2: Configurar Região Brasil (BRL)

### 2.1 Criar Região Brasil

1. No menu lateral, vá em **Settings** ⚙️
2. Clique em **Regions**
3. Clique em **"+ Create Region"**
4. Preencha:
   ```
   Name: Brasil
   Currency: BRL (Brazilian Real)
   Tax Rate: 0% (ou conforme legislação)
   Countries:
     - ✅ Brazil (BR)
   ```
5. Clique em **"Save"**

### 2.2 Configurar Métodos de Pagamento

Na mesma tela de Region:

1. Vá na seção **Payment Providers**
2. Adicione:
   - `manual` (pagamento manual/PIX/boleto)
   - Se configurado: `stripe`, `mercado-pago`
3. Salve as configurações

### 2.3 Configurar Métodos de Envio

1. Na região Brasil, vá em **Shipping Options**
2. Clique em **"+ Add Shipping Option"**

#### Opção 1: Frete Padrão
```
Name: Correios PAC
Price Type: Flat Rate
Amount: R$ 15,00 (1500 centavos)
Min Subtotal: R$ 0,00
Max Subtotal: R$ 100,00
```

#### Opção 2: Frete Expresso
```
Name: Correios SEDEX
Price Type: Flat Rate
Amount: R$ 25,00 (2500 centavos)
Min Subtotal: R$ 0,00
Max Subtotal: -
```

#### Opção 3: Frete Grátis
```
Name: Frete Grátis
Price Type: Flat Rate
Amount: R$ 0,00
Min Subtotal: R$ 150,00
```

---

## 📦 Passo 3: Adicionar Produtos

### 3.1 Criar Primeira Coleção (Opcional)

1. No menu lateral, vá em **Products** → **Collections**
2. Clique em **"+ Create Collection"**
3. Preencha:
   ```
   Title: Roupas Cyberpunk
   Handle: roupas-cyberpunk (gerado automaticamente)
   ```
4. Clique em **"Save"**

### 3.2 Criar Categorias (Opcional)

1. Vá em **Products** → **Categories**
2. Crie categorias como:
   - Camisetas
   - Moletons
   - Acessórios
   - Eletrônicos

### 3.3 Adicionar Produto Completo

#### Exemplo: Camiseta Cyberpunk Neon

1. No menu lateral, vá em **Products**
2. Clique em **"+ New Product"**

#### Aba: General

```yaml
Title: Camiseta Cyberpunk Neon
Subtitle: Edição Limitada 2025
Handle: camiseta-cyberpunk-neon (auto-gerado)
Description: |
  Camiseta premium com estampa neon cyberpunk exclusiva.

  Características:
  - Material: 100% algodão com tecnologia dry-fit
  - Estampa em silk screen de alta qualidade
  - Design exclusivo cyberpunk
  - Disponível em várias cores e tamanhos

  Perfeita para quem ama o estilo futurista!

Status: Published ✅
```

#### Aba: Organize

```yaml
Category: Camisetas
Collection: Roupas Cyberpunk
Tags:
  - cyberpunk
  - neon
  - tech
  - streetwear
```

#### Aba: Variants

**Criar Opções de Produto:**

1. Clique em **"+ Add Product Option"**

**Opção 1: Tamanho**
```
Option Title: Tamanho
Values:
  - P
  - M
  - G
  - GG
```

**Opção 2: Cor**
```
Option Title: Cor
Values:
  - Preto
  - Branco
  - Roxo Neon
```

**Criar Variantes:**

O Medusa cria variantes automaticamente combinando as opções. Exemplo:

| Variant | SKU | Price | Stock |
|---------|-----|-------|-------|
| P / Preto | CAM-001-P-BLK | R$ 79,90 | 50 |
| P / Branco | CAM-001-P-WHT | R$ 79,90 | 30 |
| P / Roxo Neon | CAM-001-P-PUR | R$ 89,90 | 20 |
| M / Preto | CAM-001-M-BLK | R$ 79,90 | 100 |
| ... | ... | ... | ... |

**Para cada variante, preencha:**
```yaml
Prices:
  Region: Brasil (BRL)
  Amount: 7990 (= R$ 79,90)

Inventory:
  Quantity: 50
  Manage Inventory: ✅ Yes
  Allow Backorders: ❌ No

Shipping:
  Weight: 200 (gramas)
  Length: 30 (cm)
  Width: 25 (cm)
  Height: 2 (cm)
```

#### Aba: Attributes (Opcional)

```yaml
Material: Algodão
Type: Camiseta
Gender: Unissex
```

#### Aba: Thumbnail & Images

1. Clique em **"Upload Images"**
2. Adicione:
   - **Thumbnail**: Imagem principal (quadrada, 800x800px)
   - **Gallery**: 3-5 imagens do produto em diferentes ângulos

**Formatos aceitos**: JPG, PNG, WebP
**Tamanho máximo**: 10MB por imagem

3. Arraste as imagens para reordenar
4. A primeira imagem será a thumbnail

#### Salvar Produto

1. Revise todas as informações
2. Clique em **"Publish"** no canto superior direito
3. Produto estará visível no storefront!

---

## 💳 Passo 4: Configurar Métodos de Pagamento

### 4.1 Pagamento Manual (PIX/Boleto)

O provider `manual` já vem configurado no Medusa.

**Como funciona:**
1. Cliente finaliza compra
2. Pedido fica como "Awaiting Payment"
3. Admin marca como pago manualmente após confirmar PIX/Boleto
4. Pedido é processado

### 4.2 Stripe (Cartão de Crédito) - Opcional

Se quiser aceitar cartões:

1. Crie conta em [stripe.com](https://stripe.com)
2. Obtenha as chaves API
3. Configure no `.env`:
   ```bash
   STRIPE_API_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Reinicie o backend

### 4.3 Mercado Pago (Brasil) - Futuro

Para integrar Mercado Pago:
- Será necessário criar módulo customizado
- Ou usar plugin da comunidade
- Documentação em breve

---

## 📊 Passo 5: Testar Integração

### 5.1 Verificar Produtos no Frontend

1. Abra `http://localhost:3000/produtos`
2. Você deve ver os produtos criados
3. Se ver produtos demo com aviso amarelo = API key faltando

### 5.2 Testar Carrinho

1. Adicione produto ao carrinho
2. Clique no ícone do carrinho (header)
3. Verifique se aparece corretamente

### 5.3 Testar Checkout (Parcial)

1. Vá para `/checkout`
2. Preencha endereço
3. Selecione método de pagamento
4. **Nota**: Finalização depende da API key configurada

---

## 🔑 Passo 6: Configurar API Keys (Importante!)

### 6.1 Criar Publishable Key

O Medusa v2 requer uma publishable key para acesso público.

**Via Admin UI:**
1. Vá em **Settings** → **API Keys**
2. Clique em **"+ Create Key"**
3. Preencha:
   ```
   Title: Storefront Key
   Type: Publishable
   ```
4. Clique em **"Save"**
5. **Copie a key gerada** (ex: `pk_01234567890`)

**Via Command Line (Alternativa):**
```bash
cd C:\Users\dcpagotto\Documents\Projects\use-nerd

# Entrar no container
docker-compose exec medusa-backend bash

# Criar publishable key via Medusa CLI (se disponível)
npx medusa keys create --type publishable --title "Storefront"
```

### 6.2 Adicionar Key no Frontend

1. Abra `.env.local` no storefront:
   ```bash
   C:\Users\dcpagotto\Documents\Projects\use-nerd\storefront\.env.local
   ```

2. Adicione a key:
   ```bash
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01234567890abcdef
   ```

3. Reinicie o servidor frontend:
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

4. Agora a API funcionará sem erros!

### 6.3 Obter Region ID (Opcional)

Se quiser especificar a região Brasil:

1. No Admin, vá em **Settings** → **Regions**
2. Clique na região "Brasil"
3. Na URL, copie o ID: `http://localhost:9000/app/settings/regions/reg_01ABCD...`
4. Adicione no `.env.local`:
   ```bash
   NEXT_PUBLIC_MEDUSA_REGION_ID=reg_01ABCD...
   ```

---

## 📝 Passo 7: Produtos de Exemplo Completos

### Produto 1: Camiseta Cyberpunk Neon
```yaml
Title: Camiseta Cyberpunk Neon
Price: R$ 79,90
Variants:
  - P/M/G/GG
  - Preto/Branco/Roxo
Stock: 50 unidades por variante
```

### Produto 2: Moletom Tech Glow
```yaml
Title: Moletom Tech Glow
Price: R$ 159,90
Variants:
  - P/M/G/GG
  - Preto/Cinza
Stock: 30 unidades
Features: Capuz, Bolso Canguru
```

### Produto 3: Relógio Digital Neon
```yaml
Title: Relógio Digital Neon
Price: R$ 129,90
Variants: Único
Stock: 60 unidades
Features: LED, Resistente à água
```

---

## 🎯 Checklist de Configuração

Use este checklist para garantir que tudo está configurado:

- [ ] ✅ Admin Medusa acessível (http://localhost:9000/app)
- [ ] ✅ Conta de administrador criada
- [ ] ✅ Região Brasil (BRL) configurada
- [ ] ✅ Métodos de envio adicionados (PAC, SEDEX, Grátis)
- [ ] ✅ Método de pagamento manual ativo
- [ ] ✅ Primeira coleção criada (opcional)
- [ ] ✅ Categorias criadas (opcional)
- [ ] ✅ Pelo menos 3 produtos adicionados
- [ ] ✅ Produtos com variantes configuradas
- [ ] ✅ Produtos com preços em BRL
- [ ] ✅ Produtos com estoque definido
- [ ] ✅ Produtos com imagens
- [ ] ✅ Publishable API Key criada
- [ ] ✅ API Key adicionada no `.env.local`
- [ ] ✅ Frontend reiniciado após configurar key
- [ ] ✅ Produtos visíveis em http://localhost:3000/produtos
- [ ] ✅ Carrinho funcionando
- [ ] ✅ Checkout funcional (parcial)

---

## 🐛 Troubleshooting

### Problema 1: "Publishable API key required"
**Solução**: Siga o Passo 6 para criar e configurar a API key

### Problema 2: Produtos não aparecem no frontend
**Causas possíveis:**
- API key não configurada → Configure no `.env.local`
- Produtos não publicados → Marque como "Published" no Admin
- Região errada → Configure região Brasil com BRL
- Frontend não reiniciado → Reinicie com `npm run dev`

### Problema 3: Preços errados
**Causa**: Medusa usa centavos, não reais
**Exemplo**: R$ 79,90 = 7990 centavos

### Problema 4: Estoque não atualiza
**Causa**: "Manage Inventory" não marcado nas variantes
**Solução**: Edite produto → Variants → Marque "Manage Inventory"

### Problema 5: Imagens não carregam
**Causas possíveis:**
- Imagem muito grande (>10MB)
- Formato não suportado (use JPG/PNG/WebP)
- CORS não configurado → Verifique STORE_CORS no `.env`

---

## 📚 Recursos Adicionais

### Documentação Oficial
- Medusa v2 Docs: https://docs.medusajs.com
- Admin UI: https://docs.medusajs.com/user-guide
- API Reference: https://docs.medusajs.com/api

### Vídeos Tutoriais
- Medusa Admin Quickstart: https://youtu.be/...
- Adding Products: https://youtu.be/...

### Comunidade
- Discord: https://discord.gg/medusajs
- GitHub: https://github.com/medusajs/medusa

---

## 🎉 Próximos Passos

Após configurar produtos:

1. ✅ Testar fluxo completo de compra
2. ✅ Adicionar mais produtos variados
3. ✅ Configurar Mercado Pago (integração customizada)
4. ✅ Configurar Melhor Envio (cálculo de frete real)
5. ✅ Deploy para produção

---

**Criado em**: 11/11/2025
**Última atualização**: 11/11/2025
**Status**: ✅ Pronto para uso
**Dúvidas**: Consulte a documentação ou peça ajuda!
