# USE Nerd - Guia de Gerenciamento de Conteúdo (Strapi CMS)

**Projeto**: USE Nerd
**Versão**: 1.0
**Data**: 17 de Novembro de 2025
**Status**: Approved
**Autor**: Documentation Team

---

## Índice

1. [Introdução ao Strapi](#introdução-ao-strapi)
2. [Acessando o Strapi Admin](#acessando-o-strapi-admin)
3. [Gerenciando Páginas](#gerenciando-páginas)
4. [Gerenciando Banners](#gerenciando-banners)
5. [Sistema de Blog](#sistema-de-blog)
6. [Media Library](#media-library)
7. [Permissões e Roles](#permissões-e-roles)

---

## Introdução ao Strapi

### O que é o Strapi?

O **Strapi** é o CMS (Content Management System) usado na USE Nerd para gerenciar todo o conteúdo dinâmico do site, incluindo:

- 📄 **Páginas Dinâmicas**: Sobre, Contato, FAQ, etc.
- 🎨 **Banners**: Homepage, promoções, destaques
- 📝 **Blog**: Artigos, notícias, tutoriais
- 🏆 **Galeria de Vencedores**: Showcase de ganhadores de rifas
- 📂 **Media Library**: Gerenciamento centralizado de imagens e arquivos

### Por que usar o Strapi?

- **Fácil de Usar**: Interface intuitiva, sem código
- **Flexível**: Crie qualquer tipo de conteúdo
- **API Automática**: REST e GraphQL gerados automaticamente
- **Multi-usuário**: Controle de permissões por role

---

## Acessando o Strapi Admin

### URL de Acesso

**Desenvolvimento**: http://localhost:1337/admin
**Produção**: https://cms.usenerd.com/admin (após deploy)

### Primeiro Acesso

No primeiro acesso, você criará a conta admin principal:

```
┌────────────────────────────────────────────────┐
│  Bem-vindo ao Strapi!                           │
│  Crie sua conta de administrador                │
├────────────────────────────────────────────────┤
│  Nome:                                          │
│  [Dhiego Pagotto_____________________]         │
│                                                 │
│  Email:                                         │
│  [admin@example.com__________________]         │
│                                                 │
│  Senha:                                         │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  Confirmar Senha:                               │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  [Criar Conta Admin]                           │
└────────────────────────────────────────────────┘
```

### Login Regular

Após configuração inicial:

```
┌────────────────────────────────────────────────┐
│         [LOGO STRAPI]                          │
│         Strapi Admin Panel                      │
├────────────────────────────────────────────────┤
│  Email:                                         │
│  [admin@example.com__________________]         │
│                                                 │
│  Senha:                                         │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  [ ] Lembrar-me                                 │
│                                                 │
│  [Entrar]                                      │
│                                                 │
│  Esqueceu sua senha?                            │
└────────────────────────────────────────────────┘
```

### Dashboard Inicial

```
┌────────────────────────────────────────────────┐
│  [≡] Strapi Admin    [🔔]  [dhiego@...]  [⚙]  │
├────────────────────────────────────────────────┤
│  CONTENT TYPES                                  │
│  ├─ 📄 Pages (5)                               │
│  ├─ 🎨 Banners (3)                             │
│  ├─ 📝 Blog Posts (12)                         │
│  ├─ 🏆 Winners (8)                             │
│  └─ 🏷️ Categories (4)                          │
│                                                 │
│  MEDIA LIBRARY                                  │
│  └─ 📁 Media (47 files)                        │
│                                                 │
│  SETTINGS                                       │
│  ├─ 👥 Users & Permissions                     │
│  ├─ 🔌 Webhooks                                │
│  └─ ⚙️ General                                  │
└────────────────────────────────────────────────┘
```

---

## Gerenciando Páginas

### Visualizar Páginas

Menu → **Content Types** → **Pages**

```
┌────────────────────────────────────────────────┐
│  Pages (5)                    [+ Create new]    │
├────────────────────────────────────────────────┤
│  [Search] [Filter▼]                            │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ Sobre Nós                         Published││
│  │ /sobre                                   ││
│  │ Updated: 15/11/2025                      ││
│  │ [Edit] [Delete]                          ││
│  ├──────────────────────────────────────────┤ │
│  │ Contato                           Published││
│  │ /contato                                 ││
│  │ Updated: 10/11/2025                      ││
│  │ [Edit] [Delete]                          ││
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

### Criar Nova Página

Botão **[+ Create new]**

```
┌────────────────────────────────────────────────┐
│  Create new Page                     [Save]     │
├────────────────────────────────────────────────┤
│  Title: *                                       │
│  [Política de Privacidade____________]         │
│                                                 │
│  Slug (URL): *                                  │
│  [politica-de-privacidade____________]         │
│  Full URL: /politica-de-privacidade             │
│                                                 │
│  SEO Title:                                     │
│  [Política de Privacidade - USE Nerd]          │
│  (60 caracteres)                                │
│                                                 │
│  SEO Description:                               │
│  [Conheça nossa política de privacidade...]    │
│  (160 caracteres)                               │
│                                                 │
│  Featured Image:                                │
│  [Upload or Select from Media Library]          │
│                                                 │
│  Content: *                                     │
│  ┌──────────────────────────────────────────┐ │
│  │ [Rich Text Editor]                       │ │
│  │                                          │ │
│  │ # Política de Privacidade                │ │
│  │                                          │ │
│  │ ## Coleta de Dados                       │ │
│  │ Nós coletamos...                         │ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│  [B] [I] [U] [H1] [H2] [Link] [Image] [...]  │
│                                                 │
│  Status:                                        │
│  ( ) Draft  (•) Published                      │
│                                                 │
│  Published At:                                  │
│  [17/11/2025 15:30] [Now]                      │
│                                                 │
│  [Save]  [Save & Publish]  [Cancel]            │
└────────────────────────────────────────────────┘
```

### Editar Página Existente

Clique em **[Edit]** na lista de páginas.

### Rich Text Editor

#### Toolbar Disponível

| Botão | Função | Atalho |
|-------|--------|--------|
| **B** | Negrito | Ctrl+B |
| **I** | Itálico | Ctrl+I |
| **U** | Sublinhado | Ctrl+U |
| **H1-H6** | Títulos | - |
| **🔗** | Link | Ctrl+K |
| **🖼️** | Imagem | - |
| **📋** | Lista | - |
| **1.** | Lista Numerada | - |
| **"** | Citação | - |
| **</>** | Código | - |
| **⚡** | Componentes | - |

#### Inserir Imagem

1. Clique no botão **🖼️ Image**
2. Opções:
   - **Upload**: Enviar nova imagem
   - **Media Library**: Selecionar existente
3. Após selecionar:
   - Alt Text (acessibilidade)
   - Title (tooltip)
   - Alignment (left, center, right)

#### Inserir Link

1. Selecione texto
2. Clique **🔗 Link** ou Ctrl+K
3. Preencha:
   - **URL**: https://exemplo.com ou /pagina-interna
   - **Title**: Tooltip do link
   - **Target**: ( ) Same tab  (•) New tab

#### Componentes Dinâmicos

Botão **⚡ Components** permite inserir:
- Call-to-Action (CTA)
- Galeria de Imagens
- Vídeo do YouTube
- Accordion (FAQ)
- Cards

**Exemplo - Inserir CTA:**
```
┌────────────────────────────────────────────────┐
│  Add Component: Call to Action                  │
├────────────────────────────────────────────────┤
│  Title:                                         │
│  [Participe do Nerd-Premiado!_________]        │
│                                                 │
│  Description:                                   │
│  [Compre números e concorra a prêmios...]      │
│                                                 │
│  Button Text:                                   │
│  [Ver Rifas Ativas________________]            │
│                                                 │
│  Button Link:                                   │
│  [/nerd-premiado___________________]            │
│                                                 │
│  Style:                                         │
│  (•) Primary  ( ) Secondary  ( ) Outline       │
│                                                 │
│  [Add Component]  [Cancel]                     │
└────────────────────────────────────────────────┘
```

---

## Gerenciando Banners

### Criar Banner Homepage

Menu → **Banners** → **[+ Create new]**

```
┌────────────────────────────────────────────────┐
│  Create new Banner                    [Save]    │
├────────────────────────────────────────────────┤
│  Name: *                                        │
│  [Black Friday 2025_________________]          │
│                                                 │
│  Image (Desktop): *                             │
│  [Upload Banner - 1920x600px]                  │
│  Recomendado: 1920x600px, JPG/PNG < 500KB      │
│                                                 │
│  Image (Mobile):                                │
│  [Upload Banner - 800x600px]                   │
│  Recomendado: 800x600px, JPG/PNG < 300KB       │
│                                                 │
│  Link URL:                                      │
│  [/produtos/promocao-black-friday___]          │
│                                                 │
│  Link Target:                                   │
│  (•) Same tab  ( ) New tab                     │
│                                                 │
│  Alt Text: (acessibilidade)                     │
│  [Promoção Black Friday - Até 50% OFF]         │
│                                                 │
│  Order: (ordem de exibição)                     │
│  [1___] (1 = primeiro)                         │
│                                                 │
│  Active:                                        │
│  [✓] Show on homepage                          │
│                                                 │
│  Start Date:                                    │
│  [20/11/2025 00:00] (opcional)                 │
│                                                 │
│  End Date:                                      │
│  [30/11/2025 23:59] (opcional)                 │
│                                                 │
│  [Save & Publish]  [Cancel]                    │
└────────────────────────────────────────────────┘
```

### Boas Práticas para Banners

#### Dimensões Ideais
- **Desktop**: 1920x600px (ratio 3.2:1)
- **Mobile**: 800x600px (ratio 4:3)

#### Peso do Arquivo
- **Máximo**: 500KB (desktop), 300KB (mobile)
- **Formato**: JPG (fotos), PNG (com transparência), WEBP (melhor compressão)

#### Design
- **Texto**: Grande, legível, contraste
- **CTA**: Botão visível ("Compre Agora", "Ver Mais")
- **Cores**: Coerentes com tema cyberpunk

#### Agendamento
- Use Start/End Date para campanhas temporárias
- Exemplo: Black Friday, Natal, Lançamentos

---

## Sistema de Blog

### Criar Post no Blog

Menu → **Blog Posts** → **[+ Create new]**

```
┌────────────────────────────────────────────────┐
│  Create new Blog Post                 [Save]    │
├────────────────────────────────────────────────┤
│  Title: *                                       │
│  [10 Melhores Animes de 2025__________]        │
│                                                 │
│  Slug:                                          │
│  [10-melhores-animes-2025______________]        │
│                                                 │
│  Featured Image: *                              │
│  [Upload 1200x630px]                           │
│                                                 │
│  Excerpt: (resumo)                              │
│  [Descubra os animes mais incríveis que...]    │
│  [_______________________________________]     │
│                                                 │
│  Categories: (múltipla escolha)                 │
│  [✓] Anime                                     │
│  [✓] Listas                                    │
│  [ ] Mangá                                      │
│  [ ] Jogos                                      │
│                                                 │
│  Tags: (separar por vírgula)                    │
│  [anime, top 10, 2025, lista____________]      │
│                                                 │
│  Author:                                        │
│  [Dhiego Pagotto▼]                             │
│                                                 │
│  Content: *                                     │
│  ┌──────────────────────────────────────────┐ │
│  │ [Rich Text Editor - igual páginas]       │ │
│  │                                          │ │
│  │ ## 1. Jujutsu Kaisen Season 3           │ │
│  │ ![Image](...)                            │ │
│  │ Descrição...                             │ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  SEO:                                           │
│  Meta Title: [10 Melhores Animes 2025 - TOP]  │
│  Meta Description: [Lista completa dos...]     │
│                                                 │
│  Status:                                        │
│  (•) Published  ( ) Draft  ( ) Scheduled       │
│                                                 │
│  Publish Date:                                  │
│  [17/11/2025 10:00] [Now]                      │
│                                                 │
│  [Save & Publish]  [Cancel]                    │
└────────────────────────────────────────────────┘
```

### Categorias de Blog

Menu → **Categories** → **[+ Create new]**

```
┌────────────────────────────────────────────────┐
│  Create new Category                  [Save]    │
├────────────────────────────────────────────────┤
│  Name: *                                        │
│  [Anime_______________________________]        │
│                                                 │
│  Slug:                                          │
│  [anime_______________________________]        │
│                                                 │
│  Description:                                   │
│  [Tudo sobre animes: reviews, listas...]       │
│                                                 │
│  Color: (para badges)                           │
│  [#FF00FF] 🎨                                  │
│                                                 │
│  [Save]  [Cancel]                              │
└────────────────────────────────────────────────┘
```

### Agendar Post

Para publicar automaticamente no futuro:

1. **Status**: Selecione `Scheduled`
2. **Publish Date**: Defina data/hora futura
3. **Save**: Post será publicado automaticamente

---

## Media Library

### Acessar Media Library

Menu → **Media Library**

```
┌────────────────────────────────────────────────┐
│  Media Library (47 files)    [+ Upload]         │
├────────────────────────────────────────────────┤
│  [Search] [Filter: All▼] [Sort: Newest▼]      │
│                                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │         │
│  │      │ │      │ │      │ │      │         │
│  │ 1.2MB│ │ 800KB│ │ 1.5MB│ │ 450KB│         │
│  │[✓]   │ │[✓]   │ │[✓]   │ │[✓]   │         │
│  └──────┘ └──────┘ └──────┘ └──────┘         │
│                                                 │
│  Selected: 4 files                              │
│  [Delete] [Move to Folder]                     │
│                                                 │
│  ← 1 2 3 4 5 →                                 │
└────────────────────────────────────────────────┘
```

### Upload de Arquivos

#### Método 1: Drag & Drop

1. Arraste arquivos para área de upload
2. Drop para começar upload
3. Aguarde conclusão

#### Método 2: Select Files

1. Clique **[+ Upload]**
2. Botão **[Browse Files]**
3. Selecione múltiplos arquivos (Ctrl/Cmd)
4. Abrir

### Formatos Suportados

#### Imagens
- **JPG/JPEG**: Fotos, banners
- **PNG**: Logos, ícones (transparência)
- **WEBP**: Melhor compressão (recomendado)
- **SVG**: Vetores (logos)
- **GIF**: Animações

#### Documentos
- **PDF**: Catálogos, manuais
- **TXT**: Textos simples

#### Vídeos (não recomendado, use YouTube)
- **MP4**: Vídeos curtos

### Limites de Tamanho

- **Imagens**: Max 5MB
- **Documentos**: Max 10MB
- **Total Storage**: 10GB

### Organizar em Pastas

1. Criar pasta: **[+ New Folder]**
2. Nome: "Banners", "Blog", "Produtos"
3. Mover arquivos: Selecionar → **[Move to Folder]**

### Editar Metadados de Imagem

Clique em imagem → Modal de detalhes:

```
┌────────────────────────────────────────────────┐
│  [PREVIEW DA IMAGEM]                            │
├────────────────────────────────────────────────┤
│  File Name:                                     │
│  [camiseta-goku-frente.jpg_________]           │
│                                                 │
│  Alt Text: *                                    │
│  [Camiseta Goku Super Saiyan - Frente]         │
│                                                 │
│  Caption:                                       │
│  [Camiseta premium 100% algodão]               │
│                                                 │
│  Size: 1200x1200px - 1.2 MB                    │
│  Type: image/jpeg                               │
│  Uploaded: 15/11/2025 by Dhiego                │
│                                                 │
│  Public URL:                                    │
│  [https://cms.usenerd.com/uploads/...]         │
│  [Copy URL]                                    │
│                                                 │
│  [Save]  [Delete]  [Close]                     │
└────────────────────────────────────────────────┘
```

**Importante**: Sempre preencher **Alt Text** (acessibilidade + SEO)

---

## Permissões e Roles

### Criar Novo Usuário

Menu → **Settings** → **Users & Permissions** → **Users** → **[+ Add new user]**

```
┌────────────────────────────────────────────────┐
│  Add new user                         [Save]    │
├────────────────────────────────────────────────┤
│  First name: *                                  │
│  [João_____________________________]           │
│                                                 │
│  Last name: *                                   │
│  [Silva____________________________]           │
│                                                 │
│  Email: *                                       │
│  [joao.silva@usenerd.com____________]          │
│                                                 │
│  Username:                                      │
│  [joao.silva_______________________]           │
│                                                 │
│  Password: *                                    │
│  [••••••••••••••••••••••••••••••••]          │
│                                                 │
│  Role: *                                        │
│  [Editor▼]                                     │
│  - Super Admin: Full access                     │
│  - Editor: Content management                   │
│  - Author: Create & edit own content           │
│  - Viewer: Read only                            │
│                                                 │
│  Active:                                        │
│  [✓] User is active                            │
│                                                 │
│  [Save]  [Cancel]                              │
└────────────────────────────────────────────────┘
```

### Roles e Permissões

| Role | Permissões |
|------|------------|
| **Super Admin** | Tudo (configurações, usuários, conteúdo) |
| **Editor** | Criar/editar/deletar conteúdo, media library |
| **Author** | Criar/editar próprio conteúdo |
| **Viewer** | Visualizar conteúdo (read-only) |

### Configurar Permissões Customizadas

Menu → **Settings** → **Users & Permissions** → **Roles** → Clique em role → **Permissions**

```
┌────────────────────────────────────────────────┐
│  Editor - Permissions                           │
├────────────────────────────────────────────────┤
│  Pages:                                         │
│  [✓] Find (view)                               │
│  [✓] Create                                    │
│  [✓] Update                                    │
│  [✓] Delete                                    │
│                                                 │
│  Blog Posts:                                    │
│  [✓] Find (view)                               │
│  [✓] Create                                    │
│  [✓] Update                                    │
│  [✓] Delete                                    │
│                                                 │
│  Banners:                                       │
│  [✓] Find (view)                               │
│  [✓] Create                                    │
│  [✓] Update                                    │
│  [ ] Delete (apenas admin)                     │
│                                                 │
│  Media Library:                                 │
│  [✓] Upload                                    │
│  [✓] Update                                    │
│  [✓] Delete                                    │
│                                                 │
│  Settings:                                      │
│  [ ] Access (apenas admin)                     │
│                                                 │
│  [Save]                                        │
└────────────────────────────────────────────────┘
```

---

## Webhooks (Avançado)

### Configurar Webhook para Invalidação de Cache

Quando conteúdo é publicado/atualizado, notificar frontend:

Menu → **Settings** → **Webhooks** → **[+ Create new webhook]**

```
┌────────────────────────────────────────────────┐
│  Create new webhook                   [Save]    │
├────────────────────────────────────────────────┤
│  Name: *                                        │
│  [Frontend Revalidation_____________]          │
│                                                 │
│  URL: *                                         │
│  [https://usenerd.com/api/revalidate]          │
│                                                 │
│  Events: (when to trigger)                      │
│  [✓] entry.create                              │
│  [✓] entry.update                              │
│  [✓] entry.delete                              │
│  [✓] entry.publish                             │
│  [✓] entry.unpublish                           │
│                                                 │
│  Headers: (optional)                            │
│  Key: [x-revalidate-token]                     │
│  Value: [••••••••••••••••••]                   │
│                                                 │
│  Enabled:                                       │
│  [✓] Webhook is active                         │
│                                                 │
│  [Save]  [Cancel]                              │
└────────────────────────────────────────────────┘
```

---

## Dicas e Melhores Práticas

### SEO

1. **Alt Text**: Sempre preencher em imagens
2. **Meta Title**: 50-60 caracteres
3. **Meta Description**: 150-160 caracteres
4. **Slugs**: curtos, descritivos, kebab-case
5. **Headers**: Usar H1 (título) → H2 → H3 hierarquia

### Performance

1. **Imagens**: Otimizar antes de upload (tinypng.com)
2. **Tamanho**: Máximo 500KB por imagem
3. **Formato**: WEBP quando possível
4. **Lazy Load**: Automático no frontend

### Organização

1. **Pastas**: Separar por tipo (banners, blog, produtos)
2. **Nomenclatura**: Padrão consistente (produto-nome-frente.jpg)
3. **Limpeza**: Deletar arquivos não usados mensalmente

### Workflow Editorial

1. **Draft**: Criar conteúdo
2. **Review**: Revisar texto/imagens
3. **Schedule**: Agendar publicação
4. **Publish**: Publicar ou aguardar agendamento
5. **Update**: Atualizar conforme necessário

---

## Troubleshooting

### Problema: Upload falha

**Possíveis causas**:
- Arquivo muito grande (> 5MB)
- Formato não suportado
- Conexão instável

**Solução**:
- Comprimir imagem
- Verificar formato
- Tentar novamente

### Problema: Conteúdo não aparece no site

**Checklist**:
- [ ] Status é "Published"?
- [ ] Publish Date já passou?
- [ ] Permissões públicas habilitadas?
- [ ] Frontend fez revalidation/rebuild?

**Solução**:
- Verificar status
- Trigger revalidation manual

### Problema: Imagem quebrada

**Causas**:
- URL incorreta
- Arquivo deletado
- Permissões

**Solução**:
- Re-upload da imagem
- Verificar link
- Checar permissões public

---

## Conclusão

O Strapi CMS é uma ferramenta poderosa e flexível para gerenciar todo o conteúdo dinâmico da USE Nerd. Este guia cobre 95% das operações do dia-a-dia.

Para dúvidas ou funcionalidades avançadas, consulte:
- Documentação oficial: https://docs.strapi.io
- Suporte técnico: tech@usenerd.com

---

**Última atualização**: 17/11/2025
**Próxima revisão**: 17/12/2025

**Documentos Relacionados**:
- [User Manual](./USER_MANUAL.md)
- [Admin Manual](./ADMIN_MANUAL.md)
- [Project Overview](../project-management/PROJECT_OVERVIEW.md)
