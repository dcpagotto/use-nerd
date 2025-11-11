# Quick Start Guide - USE Nerd Storefront

Este guia rápido irá ajudá-lo a configurar e executar o storefront Next.js 14.

## Instalação Rápida

### 1. Instalar Dependências

```bash
cd storefront
npm install
```

**Tempo estimado**: 2-3 minutos

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.local.example .env.local

# Editar variáveis (use seu editor preferido)
# Mínimo necessário:
# - NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 3. Verificar Backend Medusa

Certifique-se de que o backend Medusa está rodando:

```bash
# Em outro terminal, na raiz do projeto
cd ..
npm run dev
```

O backend deve estar acessível em http://localhost:9000

### 4. Iniciar Storefront

```bash
npm run dev
```

Acesse: http://localhost:3000

## Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor de desenvolvimento

# Build
npm run build            # Criar build de produção
npm start                # Executar build de produção

# Qualidade
npm run lint             # Verificar erros de lint
npm run type-check       # Verificar tipos TypeScript
npm run test             # Executar testes
```

## Estrutura Básica

```
storefront/
├── app/                 # Rotas Next.js (App Router)
├── components/          # Componentes React
├── lib/                 # Utilitários e clientes
├── types/               # Tipos TypeScript
└── public/              # Arquivos estáticos
```

## Próximos Passos

Após a instalação básica, você pode:

1. **Configurar Tailwind CSS** (tema cyberpunk)
   - Será feito pelo `tailwind-css-expert`

2. **Criar Páginas Principais**
   - `/products` - Catálogo
   - `/cart` - Carrinho
   - `/raffles` - Rifas

3. **Implementar Componentes**
   - Header
   - ProductCard
   - RaffleCard

4. **Integrar Backend**
   - Conectar com Medusa API
   - Testar fluxo de compra

## Troubleshooting

### Erro de Conexão com Backend

```
Error: Failed to fetch from Medusa backend
```

**Solução**: Verifique se o backend está rodando e a URL está correta em `.env.local`

### Erro de CORS

```
Access to fetch blocked by CORS policy
```

**Solução**: Configure CORS no backend Medusa:

```typescript
// medusa-config.ts
export default {
  projectConfig: {
    http: {
      cors: "http://localhost:3000",
    },
  },
};
```

### Erro de TypeScript

```
Cannot find module '@/...'
```

**Solução**: Reinicie o servidor TypeScript ou execute:

```bash
npm run type-check
```

## Verificação de Saúde

Execute este checklist para verificar se tudo está funcionando:

- [ ] `npm install` completou sem erros
- [ ] `.env.local` foi criado e configurado
- [ ] Backend Medusa está rodando (http://localhost:9000)
- [ ] `npm run dev` inicia sem erros
- [ ] http://localhost:3000 está acessível
- [ ] `npm run lint` não mostra erros críticos
- [ ] `npm run type-check` passa sem erros

## Recursos

- [README completo](./README.md) - Documentação completa
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Medusa](https://docs.medusajs.com)

---

**Pronto para começar!** 🚀
