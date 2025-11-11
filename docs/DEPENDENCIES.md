# Dependências do Projeto USE Nerd

## Dependências de Produção

### Core Medusa
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `@medusajs/admin-sdk` | 2.11.3 | SDK para customização do Admin UI |
| `@medusajs/cli` | 2.11.3 | CLI do Medusa para comandos de desenvolvimento |
| `@medusajs/framework` | 2.11.3 | Framework core do Medusa v2.0 |
| `@medusajs/medusa` | 2.11.3 | Servidor principal do Medusa |

### Blockchain & Web3
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `ethers` | ^6.13.0 | Biblioteca moderna para interação com Ethereum/Polygon |
| `@chainlink/contracts` | ^1.2.0 | Contratos do Chainlink (VRF para randomness verificável) |
| `@openzeppelin/contracts` | ^5.0.0 | Contratos inteligentes seguros e auditados |

**Casos de Uso:**
- Sistema de rifas com sorteio verificável (Chainlink VRF)
- Emissão de tickets como NFTs (ERC-721)
- Transações seguras na blockchain Polygon

### Integrações Brasileiras
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `axios` | ^1.7.0 | Cliente HTTP para APIs de terceiros |
| `mercadopago` | ^2.0.0 | SDK oficial do Mercado Pago (pagamentos PIX/cartão) |

**APIs Integradas:**
- **Melhor Envio**: Cálculo de frete e gestão de envios (via axios)
- **Mercado Pago**: Pagamentos PIX, cartão de crédito, boleto
- **Focus NFe**: Emissão de Nota Fiscal Eletrônica (via axios)

---

## Dependências de Desenvolvimento

### Testes
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `@medusajs/test-utils` | 2.11.3 | Utilitários de teste do Medusa |
| `jest` | ^29.7.0 | Framework de testes |
| `@types/jest` | ^29.5.13 | Tipos TypeScript para Jest |
| `chai` | ^4.3.0 | Biblioteca de asserções |
| `@types/chai` | ^4.3.0 | Tipos TypeScript para Chai |
| `@types/mocha` | ^10.0.0 | Tipos TypeScript para Mocha |

### Hardhat - Desenvolvimento de Smart Contracts
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `hardhat` | ^2.22.0 | Framework para desenvolvimento Ethereum/Solidity |
| `@nomicfoundation/hardhat-ethers` | ^3.0.0 | Plugin Hardhat para Ethers.js |
| `@nomicfoundation/hardhat-chai-matchers` | ^2.0.0 | Matchers avançados para testes |
| `@nomicfoundation/hardhat-toolbox` | ^5.0.0 | Conjunto de plugins essenciais |
| `hardhat-gas-reporter` | ^2.0.0 | Relatório de custos de gas |
| `solidity-coverage` | ^0.8.0 | Cobertura de testes para Solidity |

### TypeChain - Tipos TypeScript para Contratos
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `typechain` | ^8.3.0 | Gera tipos TypeScript de contratos Solidity |
| `@typechain/ethers-v6` | ^0.5.0 | Suporte para Ethers v6 |
| `@typechain/hardhat` | ^9.0.0 | Plugin Hardhat para TypeChain |

**Benefício**: Autocompletar e type safety ao interagir com contratos

### Build & Transpilação
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `typescript` | ^5.6.2 | Compilador TypeScript |
| `ts-node` | ^10.9.2 | Execução de TypeScript sem compilação prévia |
| `@swc/core` | ^1.7.28 | Compilador super rápido (substituto do Babel) |
| `@swc/jest` | ^0.2.36 | Transformador SWC para Jest |

### React (Admin UI)
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `react` | ^18.3.1 | Biblioteca React |
| `react-dom` | ^18.3.1 | React para DOM |
| `@types/react` | ^18.3.2 | Tipos TypeScript para React |
| `@types/react-dom` | ^18.2.25 | Tipos TypeScript para React DOM |
| `prop-types` | ^15.8.1 | Validação de props em runtime |
| `vite` | ^5.4.14 | Build tool ultra rápido para Admin UI |

### Utilidades
| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `@types/node` | ^20.12.11 | Tipos TypeScript para Node.js |
| `yalc` | ^1.0.0-pre.53 | Testes locais de pacotes npm |

---

## Scripts NPM

### Medusa Backend
```bash
npm run dev              # Desenvolvimento com hot reload
npm run build            # Build para produção
npm start                # Inicia servidor de produção
npm run seed             # Popula banco com dados iniciais
```

### Testes
```bash
npm run test:unit                    # Testes unitários
npm run test:integration:http       # Testes de integração HTTP
npm run test:integration:modules    # Testes de integração de módulos
```

### Hardhat - Smart Contracts
```bash
npm run hardhat:compile  # Compila contratos Solidity
npm run hardhat:test     # Executa testes de contratos
npm run hardhat:deploy   # Deploy de contratos
```

---

## Estrutura de Dependências por Módulo

### Módulo Raffle (Sistema de Rifas)
- **Backend**: Medusa Framework
- **Blockchain**: ethers, @openzeppelin/contracts
- **Randomness**: @chainlink/contracts (VRF)
- **Storage**: IPFS para metadados NFT

### Módulo Brazil (Integrações Brasileiras)
- **Frete**: axios + API Melhor Envio
- **Pagamento**: mercadopago (PIX, cartão, boleto)
- **Fiscal**: axios + API Focus NFe
- **Validações**: Validadores de CPF/CNPJ, CEP

### Módulo Blockchain
- **Web3**: ethers
- **Contratos**: @openzeppelin/contracts
- **Desenvolvimento**: hardhat + plugins
- **Testes**: chai + hardhat-chai-matchers
- **Tipos**: typechain

### Módulo POD (Print-on-Demand)
- **Integrações**: axios
- **APIs**: Printful, Printify

---

## Requisitos de Sistema

- **Node.js**: >= 20.x (definido em engines)
- **PostgreSQL**: 15+ (via Docker)
- **Redis**: 7+ (via Docker)
- **Docker**: Para ambiente de desenvolvimento
- **Wallet**: MetaMask ou similar (para interações blockchain)

---

## Instalação

### Ambiente Docker (Recomendado)
```bash
docker-compose up -d
docker-compose exec medusa-backend npm install
```

### Ambiente Local
```bash
npm install --legacy-peer-deps
```

**Nota**: A flag `--legacy-peer-deps` é necessária devido a conflitos de peer dependencies entre pacotes do Medusa e Hardhat.

---

## Próximas Dependências Planejadas

### Fase 2 - POD & Frontend
- [ ] `next` (^14.x) - Framework React para storefront
- [ ] `tailwindcss` (^4.x) - Estilo cyberpunk
- [ ] `@tanstack/react-query` - Cache e sincronização de dados
- [ ] `zustand` - State management

### Fase 3 - Produção
- [ ] `@sentry/node` - Monitoramento de erros
- [ ] `pino` - Logger estruturado
- [ ] `helmet` - Segurança HTTP
- [ ] `rate-limiter-flexible` - Rate limiting

---

**Última Atualização**: 2025-11-11
**Versão Medusa**: 2.11.3
**Node Version**: 20.x
