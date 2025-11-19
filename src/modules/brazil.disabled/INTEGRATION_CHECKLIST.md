# Brazil Module - Integration Checklist

Este checklist guia a ativação das integrações reais (substituir mocks).

## Status Atual

- ✅ Módulo implementado com mocks funcionais
- ⏳ Integrações reais desativadas (comentadas com TODO)
- ⏳ Testes pendentes
- ⏳ Configuração de produção pendente

---

## 1. PIX Payment (Mercado Pago)

### Setup (Sandbox)

- [ ] **Criar conta Mercado Pago**
  - URL: https://www.mercadopago.com.br/developers
  - Criar conta de teste (sandbox)

- [ ] **Obter credenciais**
  - Access Token (sandbox)
  - Public Key (sandbox)
  - Copiar para `.env`:
    ```env
    MERCADO_PAGO_ACCESS_TOKEN=TEST-xxx
    MERCADO_PAGO_PUBLIC_KEY=TEST-xxx
    MERCADO_PAGO_SANDBOX=true
    ```

- [ ] **Configurar webhook**
  - URL: `https://seu-dominio.com/webhooks/brazil/pix`
  - Eventos: `payment` (criação, atualização)
  - Painel: https://www.mercadopago.com.br/developers/panel/webhooks

- [ ] **Instalar SDK**
  ```bash
  npm install mercadopago
  ```

- [ ] **Ativar código real**
  - Arquivo: `src/modules/brazil/services/pix-payment.ts`
  - Remover mocks
  - Descomentar seções marcadas com `// TODO: Integrar com Mercado Pago`

- [ ] **Testar pagamento**
  ```bash
  curl -X POST http://localhost:9000/store/brazil/pix/create \
    -H "Content-Type: application/json" \
    -d '{
      "order_id": "test_order",
      "amount": 1000,
      "payer_name": "Test User",
      "payer_email": "test@test.com",
      "payer_cpf_cnpj": "12345678901"
    }'
  ```

- [ ] **Testar webhook**
  - Usar ngrok para expor localhost: `ngrok http 9000`
  - Configurar URL do webhook
  - Fazer pagamento de teste
  - Verificar logs: `grep "pix_webhook" logs/medusa.log`

### Setup (Produção)

- [ ] Obter credenciais de produção
- [ ] Atualizar `.env` com credenciais reais
- [ ] Configurar `MERCADO_PAGO_SANDBOX=false`
- [ ] Validar webhook signature (implementar segurança)
- [ ] Testar com valores reais

---

## 2. Shipping (Melhor Envio)

### Setup (Sandbox)

- [ ] **Criar conta Melhor Envio**
  - URL: https://sandbox.melhorenvio.com.br
  - Criar conta de teste

- [ ] **Obter token OAuth2**
  - Painel: https://sandbox.melhorenvio.com.br/painel/gerenciar/tokens
  - Criar novo token
  - Copiar para `.env`:
    ```env
    MELHOR_ENVIO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGc...
    MELHOR_ENVIO_SANDBOX=true
    ```

- [ ] **Instalar dependências**
  ```bash
  npm install axios
  ```

- [ ] **Ativar código real**
  - Arquivo: `src/modules/brazil/services/melhor-envio.ts`
  - Remover mocks
  - Descomentar seções marcadas com `// TODO: Integrar com Melhor Envio`

- [ ] **Configurar endereço de origem**
  - Adicionar ao `.env`:
    ```env
    WAREHOUSE_POSTAL_CODE=01310-100
    WAREHOUSE_NAME=Seu Depósito
    WAREHOUSE_PHONE=11987654321
    ```

- [ ] **Testar cálculo de frete**
  ```bash
  curl -X POST http://localhost:9000/store/brazil/shipping/calculate \
    -H "Content-Type: application/json" \
    -d '{
      "from_postal_code": "01310-100",
      "to_postal_code": "80010-000",
      "packages": [
        {"height": 10, "width": 20, "length": 30, "weight": 1.5}
      ]
    }'
  ```

- [ ] **Testar compra de etiqueta**
  - Criar pedido de teste
  - Disparar evento `order.fulfillment_created`
  - Verificar se etiqueta foi comprada
  - Verificar tracking code gerado

### Setup (Produção)

- [ ] Criar conta de produção
- [ ] Obter token de produção
- [ ] Atualizar `.env` com token real
- [ ] Configurar `MELHOR_ENVIO_SANDBOX=false`
- [ ] Adicionar saldo na conta
- [ ] Testar com pedidos reais

---

## 3. NFe (Nota Fiscal Eletrônica)

### Escolher Provider

Opções:
- **eNotas**: https://enotas.com.br (recomendado)
- **Focus NFe**: https://focusnfe.com.br
- **WebMania**: https://webmania.com.br

### Setup (Sandbox - eNotas)

- [ ] **Criar conta eNotas**
  - URL: https://enotas.com.br
  - Plano sandbox/teste

- [ ] **Obter credenciais**
  - API Token
  - Copiar para `.env`:
    ```env
    NFE_API_URL=https://api.enotas.com.br
    NFE_API_TOKEN=seu_token_aqui
    NFE_ENVIRONMENT=sandbox
    ```

- [ ] **Configurar dados da empresa**
  - Adicionar ao `.env`:
    ```env
    COMPANY_CNPJ=12345678000190
    COMPANY_IE=123456789
    COMPANY_NAME=Sua Empresa LTDA
    COMPANY_ADDRESS=Rua Exemplo, 123
    COMPANY_CITY=São Paulo
    COMPANY_STATE=SP
    COMPANY_ZIP=01310-100
    COMPANY_PHONE=1130001000
    COMPANY_EMAIL=fiscal@suaempresa.com.br
    ```

- [ ] **Instalar dependências**
  ```bash
  npm install axios
  ```

- [ ] **Ativar código real**
  - Arquivo: `src/modules/brazil/services/nfe.ts`
  - Remover mocks
  - Descomentar seções marcadas com `// TODO: Integrar com provedor de NFe`

- [ ] **Configurar NCM nos produtos**
  - Adicionar metadata aos produtos:
    ```typescript
    product.metadata = {
      ncm: "61091000", // Código NCM obrigatório
      cfop: "5102", // Código CFOP obrigatório
    }
    ```

- [ ] **Testar geração de NFe**
  ```bash
  curl -X POST http://localhost:9000/admin/brazil/nfe/order_123/generate \
    -H "Authorization: Bearer SEU_TOKEN_ADMIN"
  ```

- [ ] **Configurar email templates**
  - Template para envio de NFe ao cliente
  - Template para notificação de NFe rejeitada

### Setup (Produção)

- [ ] Obter certificado digital (e-CPF ou e-CNPJ)
- [ ] Configurar certificado no provider
- [ ] Obter credenciais de produção
- [ ] Atualizar `.env` com credenciais reais
- [ ] Configurar `NFE_ENVIRONMENT=production`
- [ ] Homologar com SEFAZ (o provider faz isso)
- [ ] Testar emissão em produção
- [ ] Configurar backup automático de XMLs

---

## 4. Security & Compliance

### Webhook Security

- [ ] **Implementar validação de assinatura**
  - Arquivo: `src/modules/brazil/api/webhooks/pix/route.ts`
  - Adicionar função `validateMercadoPagoSignature()`
  - Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

- [ ] **Rate limiting**
  - Adicionar rate limiting aos endpoints públicos
  - Limite sugerido: 10 requests/minuto por IP

- [ ] **HTTPS obrigatório**
  - Verificar se todos os webhooks usam HTTPS
  - Rejeitar requests HTTP

### Data Protection (LGPD)

- [ ] **Encriptação de CPF/CNPJ**
  - Implementar encriptação at-rest
  - Usar AES-256 ou similar

- [ ] **Logs de acesso**
  - Registrar acessos a dados sensíveis
  - Manter logs por 6 meses mínimo

- [ ] **Direito ao esquecimento**
  - Implementar rota para deletar dados do cliente
  - Manter apenas dados fiscais obrigatórios (5 anos)

### PCI-DSS Compliance

- [ ] Não armazenar dados de cartão (PIX não usa cartão ✓)
- [ ] Usar HTTPS em todas as comunicações ✓
- [ ] Logs não devem conter dados sensíveis
- [ ] Implementar auditoria de acessos

---

## 5. Monitoring & Alerts

### Logs

- [ ] **Estruturar logs**
  - Formato JSON
  - Incluir timestamp, level, module
  - Exemplo:
    ```json
    {
      "timestamp": "2024-01-01T12:00:00Z",
      "level": "info",
      "module": "brazil",
      "service": "pix-payment",
      "message": "Payment created",
      "payment_id": "pixpay_123"
    }
    ```

- [ ] **Centralizar logs**
  - Usar ferramentas como:
    - Sentry (errors)
    - Datadog (monitoring)
    - CloudWatch (AWS)
    - Elastic Stack (ELK)

### Alerts

- [ ] **PIX payment expiration**
  - Alertar quando PIX expirar sem pagamento
  - Enviar email ao cliente

- [ ] **NFe generation failure**
  - Alertar admin quando NFe falhar
  - Criar ticket de suporte automático

- [ ] **Shipping tracking delays**
  - Alertar quando entrega atrasar
  - Enviar notificação proativa ao cliente

### Metrics

- [ ] **Dashboard de métricas**
  - Total de PIX pagos hoje
  - Taxa de conversão PIX
  - Tempo médio de pagamento
  - Total de fretes calculados
  - NFes geradas com sucesso/falha

---

## 6. Testing

### Unit Tests

- [ ] **Services**
  ```bash
  src/modules/brazil/__tests__/services/pix-payment.spec.ts
  src/modules/brazil/__tests__/services/melhor-envio.spec.ts
  src/modules/brazil/__tests__/services/nfe.spec.ts
  ```

- [ ] **Validators**
  ```bash
  src/modules/brazil/__tests__/utils/validators.spec.ts
  ```

- [ ] **Rodar testes**
  ```bash
  npm run test:unit -- src/modules/brazil
  ```

### Integration Tests

- [ ] **Workflows**
  ```bash
  src/modules/brazil/__tests__/workflows/create-pix-payment.spec.ts
  src/modules/brazil/__tests__/workflows/calculate-shipping.spec.ts
  src/modules/brazil/__tests__/workflows/generate-nfe.spec.ts
  ```

- [ ] **API Endpoints**
  ```bash
  src/modules/brazil/__tests__/api/store/pix.spec.ts
  src/modules/brazil/__tests__/api/store/shipping.spec.ts
  src/modules/brazil/__tests__/api/admin/nfe.spec.ts
  ```

- [ ] **Rodar testes**
  ```bash
  npm run test:integration:modules -- src/modules/brazil
  ```

### E2E Tests

- [ ] **Fluxo completo: Checkout com PIX**
  1. Adicionar produto ao carrinho
  2. Calcular frete
  3. Criar pedido
  4. Gerar PIX
  5. Pagar PIX (webhook)
  6. Verificar status do pedido

- [ ] **Fluxo completo: Envio e NFe**
  1. Pedido pago
  2. Criar fulfillment
  3. Comprar etiqueta
  4. Marcar como enviado
  5. Completar pedido
  6. Gerar NFe

---

## 7. Performance

### Database

- [ ] **Verificar indexes**
  ```sql
  -- Verificar se indexes foram criados
  SELECT * FROM pg_indexes WHERE tablename IN ('pix_payment', 'shipping_quote', 'nfe');
  ```

- [ ] **Otimizar queries**
  - Adicionar EXPLAIN ANALYZE nas queries lentas
  - Criar indexes adicionais se necessário

### Caching

- [ ] **Cache de cotações de frete**
  - Cache por 5 minutos
  - Key: `shipping:${from}:${to}:${dimensions}`

- [ ] **Cache de transportadoras disponíveis**
  - Cache por 1 hora
  - Key: `shipping:carriers`

### Rate Limiting

- [ ] **API pública**
  - `/store/brazil/pix/create`: 5 req/min por IP
  - `/store/brazil/shipping/calculate`: 10 req/min por IP

- [ ] **Webhooks**
  - Implementar retry com exponential backoff
  - Max 3 retries

---

## 8. Documentation

### Code Documentation

- [ ] **JSDoc em todos os métodos públicos**
- [ ] **Exemplos de uso nos comentários**
- [ ] **Documentar todos os tipos e interfaces**

### User Documentation

- [ ] **README.md** ✅ (já criado)
- [ ] **GUIA_RAPIDO.md** ✅ (já criado)
- [ ] **API documentation** (Swagger/OpenAPI)
- [ ] **Changelog**

### Admin Documentation

- [ ] **Manual de operação**
  - Como gerar NFe manualmente
  - Como verificar status de PIX
  - Como rastrear envios

- [ ] **Manual de troubleshooting**
  - Problemas comuns e soluções
  - Como interpretar logs
  - Quando entrar em contato com suporte

---

## 9. Deployment

### Environment Variables

- [ ] **Validar variáveis obrigatórias no startup**
  ```typescript
  const requiredVars = [
    'MERCADO_PAGO_ACCESS_TOKEN',
    'MELHOR_ENVIO_TOKEN',
    'NFE_API_TOKEN',
    'COMPANY_CNPJ',
  ];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`Missing required env var: ${varName}`);
    }
  });
  ```

### Database Migrations

- [ ] **Backup antes de migração**
  ```bash
  pg_dump -h localhost -U postgres use-nerd > backup_$(date +%Y%m%d).sql
  ```

- [ ] **Rodar migrations**
  ```bash
  npm run medusa migrations run
  ```

- [ ] **Verificar sucesso**
  ```sql
  SELECT * FROM migrations ORDER BY created_at DESC LIMIT 5;
  ```

### Health Checks

- [ ] **Endpoint de health check**
  ```typescript
  GET /health/brazil
  // Retorna status das integrações
  {
    "pix": "ok",
    "shipping": "ok",
    "nfe": "ok"
  }
  ```

---

## 10. Post-Launch

### Week 1

- [ ] Monitorar logs diariamente
- [ ] Verificar métricas de uso
- [ ] Responder feedbacks de usuários
- [ ] Corrigir bugs críticos imediatamente

### Month 1

- [ ] Analisar taxa de conversão PIX
- [ ] Otimizar custos de frete
- [ ] Avaliar qualidade das NFes geradas
- [ ] Coletar feedback de clientes

### Quarter 1

- [ ] Implementar melhorias baseadas em feedback
- [ ] Adicionar novos métodos de pagamento
- [ ] Expandir transportadoras disponíveis
- [ ] Otimizar performance

---

## Checklist de Produção

Antes de ir para produção, verificar:

- [ ] Todas as integrações ativadas e testadas
- [ ] Testes com 80%+ coverage
- [ ] Logs estruturados e centralizados
- [ ] Monitoring e alerts configurados
- [ ] Backup automático configurado
- [ ] Certificado SSL válido
- [ ] Variáveis de ambiente de produção configuradas
- [ ] Rate limiting ativo
- [ ] Webhook signatures validadas
- [ ] LGPD compliance implementado
- [ ] Documentação completa
- [ ] Runbook de troubleshooting
- [ ] Plano de rollback definido

---

**Status**: ⏳ Integrações pendentes (mocks ativos)

**Próxima etapa**: Começar por PIX (mais simples)

**Tempo estimado**:
- PIX: 4-6 horas
- Frete: 6-8 horas
- NFe: 8-12 horas
- Testes: 8-10 horas
- Total: 26-36 horas

**Desenvolvido para USE Nerd E-commerce Platform**
