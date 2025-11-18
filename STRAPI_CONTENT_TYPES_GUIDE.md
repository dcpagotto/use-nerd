# Guia de Criação de Content Types - Strapi CMS

## 1. Acesse o Strapi Admin

URL: **http://localhost:1337/admin**

Primeiro acesso: crie seu usuário administrador.

---

## 2. Content Types a Criar

### Content Type 1: **Hero Section** (Single Type)

**Content-Type Builder → Create new single type**

Nome: `Hero Section`

Campos:
1. **title** (Text - Short text)
   - Required: Yes
   - Max length: 100

2. **subtitle** (Text - Long text)
   - Required: No

3. **ctaText** (Text - Short text)
   - Required: No
   - Default: "Explorar Produtos"

4. **ctaLink** (Text - Short text)
   - Required: No
   - Default: "/produtos"

5. **backgroundImage** (Media - Single media)
   - Required: No
   - Allowed types: images

---

### Content Type 2: **Banner** (Collection Type)

**Content-Type Builder → Create new collection type**

Nome: `Banner`

Campos:
1. **title** (Text - Short text)
   - Required: Yes

2. **description** (Text - Long text)
   - Required: No

3. **image** (Media - Single media)
   - Required: Yes
   - Allowed types: images

4. **link** (Text - Short text)
   - Required: No

5. **active** (Boolean)
   - Required: Yes
   - Default: true

6. **position** (Number - integer)
   - Required: No
   - Min: 1

---

### Content Type 3: **Page** (Collection Type)

**Content-Type Builder → Create new collection type**

Nome: `Page`

Campos:
1. **title** (Text - Short text)
   - Required: Yes

2. **slug** (UID)
   - Required: Yes
   - Attached field: title

3. **content** (Rich Text)
   - Required: No

4. **published** (Boolean)
   - Required: Yes
   - Default: false

5. **seo** (Component - repeatable: No)
   - Criar componente "SEO" (ver abaixo)

---

### Content Type 4: **Site Setting** (Single Type)

**Content-Type Builder → Create new single type**

Nome: `Site Setting`

Campos:
1. **siteName** (Text - Short text)
   - Required: Yes
   - Default: "USE Nerd"

2. **siteDescription** (Text - Long text)
   - Required: No

3. **logo** (Media - Single media)
   - Allowed types: images

4. **contactEmail** (Email)
   - Required: No

5. **socialLinks** (Component - repeatable: Yes)
   - Criar componente "Social Links" (ver abaixo)

---

### Content Type 5: **Nerd Premiado** (Collection Type)

**Content-Type Builder → Create new collection type**

Nome: `Nerd Premiado`

Campos:
1. **winnerName** (Text - Short text)
   - Required: Yes

2. **raffleName** (Text - Short text)
   - Required: Yes

3. **winnerPhoto** (Media - Single media)
   - Allowed types: images

4. **prizeDescription** (Text - Long text)
   - Required: Yes

5. **drawDate** (Date)
   - Required: Yes
   - Type: date

6. **featured** (Boolean)
   - Default: false

---

## 3. Componentes a Criar

### Componente 1: **SEO**

**Category:** `shared`
**Nome:** `seo`

Campos:
1. **metaTitle** (Text - Short text)
   - Max: 60

2. **metaDescription** (Text - Long text)
   - Max: 160

3. **keywords** (Text - Short text)

4. **ogImage** (Media - Single media)
   - Allowed types: images

---

### Componente 2: **Social Links**

**Category:** `shared`
**Nome:** `socialLinks`

Campos:
1. **platform** (Enumeration)
   - Values: Facebook, Instagram, Twitter, LinkedIn, YouTube

2. **url** (Text - Short text)
   - Required: Yes

---

## 4. Configurar Permissões (IMPORTANTE!)

**Settings → Users & Permissions Plugin → Roles → Public**

Para cada Content Type criado, ative:
- ✅ `find` (GET lista)
- ✅ `findOne` (GET individual)

⚠️ **NÃO ative:**  create, update, delete (apenas admin pode)

---

## 5. Adicionar Conteúdo Inicial

### Hero Section (Single Type)

Content Manager → Hero Section → Add entry

```
Title: "USE Nerd"
Subtitle: "E-commerce com Rifas Blockchain Verificáveis"
CTA Text: "Explorar Produtos"
CTA Link: "/produtos"
```

Salve e Publique.

---

### Site Settings (Single Type)

Content Manager → Site Settings → Add entry

```
Site Name: "USE Nerd"
Site Description: "E-commerce completo com sistema de rifas verificado na blockchain Polygon"
Contact Email: "contato@usenerd.com"
```

Adicione Social Links:
- Platform: Instagram | URL: https://instagram.com/usenerd
- Platform: Facebook | URL: https://facebook.com/usenerd

Salve e Publique.

---

## 6. Testar API

Após criar e publicar o conteúdo:

**Hero Section:**
```
GET http://localhost:1337/api/hero-section?populate=*
```

**Banners:**
```
GET http://localhost:1337/api/banners?populate=*
```

**Pages:**
```
GET http://localhost:1337/api/pages?populate=*
```

**Site Settings:**
```
GET http://localhost:1337/api/site-setting?populate=deep
```

**Nerd Premiado:**
```
GET http://localhost:1337/api/nerd-premiados?populate=*
```

---

## 7. Integração com Frontend

Após configurar tudo, o frontend em http://localhost:3000 poderá consumir esses dados através dos clients TypeScript já criados em `storefront/lib/strapi-client.ts`.

---

## Resumo de Ações

1. ✅ Criar usuário admin
2. ✅ Criar 5 Content Types (2 Single Types + 3 Collection Types)
3. ✅ Criar 2 Componentes (SEO + Social Links)
4. ✅ Configurar permissões públicas (find + findOne)
5. ✅ Adicionar conteúdo inicial
6. ✅ Testar endpoints da API
7. ✅ Frontend está pronto para consumir

---

**Dúvidas?** Consulte a documentação oficial: https://docs.strapi.io/dev-docs/quick-start
