# Contributing to USE Nerd

[English](#english) | [Portugues](#portugues)

---

## English

Thank you for your interest in contributing to USE Nerd! This document provides guidelines and standards for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation Requirements](#documentation-requirements)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/use-nerd.git
cd use-nerd
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-org/use-nerd.git
```

4. Install dependencies:
```bash
npm install
```

5. Set up your development environment following the [README](./README.md)

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test improvements

### Creating a Feature Branch

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

## Code Standards

### SOLID Principles

Follow SOLID principles in all code:

1. **Single Responsibility Principle (SRP)**
   - Each class/module should have one responsibility
   - Example: Separate data access from business logic

2. **Open/Closed Principle (OCP)**
   - Open for extension, closed for modification
   - Use interfaces and abstract classes

3. **Liskov Substitution Principle (LSP)**
   - Subtypes must be substitutable for base types
   - Maintain expected behavior in inheritance

4. **Interface Segregation Principle (ISP)**
   - Many specific interfaces > one general interface
   - Don't force implementations of unused methods

5. **Dependency Inversion Principle (DIP)**
   - Depend on abstractions, not concretions
   - Use dependency injection

### Clean Code Practices

#### Naming Conventions

```typescript
// Classes: PascalCase
class RaffleService {}

// Interfaces: PascalCase with 'I' prefix
interface IRaffleRepository {}

// Functions/Methods: camelCase with verb
function calculateRaffleOdds() {}
async function fetchUserRaffles() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RAFFLE_ENTRIES = 1000;

// Variables: camelCase, descriptive
const userRaffleEntries = [];
```

#### Function Guidelines

- Functions should be small (< 20 lines ideally)
- Do one thing and do it well
- Use descriptive names (avoid abbreviations)
- Limit parameters (max 3-4, use objects for more)

```typescript
// Good
async function createRaffleEntry(params: CreateRaffleEntryParams): Promise<RaffleEntry> {
  validateRaffleParams(params);
  const entry = await raffleRepository.create(params);
  await notifyRaffleCreation(entry);
  return entry;
}

// Bad
async function cre(a: any, b: any, c: any, d: any, e: any) {
  // Too many parameters, unclear purpose
}
```

#### Error Handling

```typescript
// Use custom error classes
class RaffleNotFoundError extends Error {
  constructor(raffleId: string) {
    super(`Raffle with ID ${raffleId} not found`);
    this.name = 'RaffleNotFoundError';
  }
}

// Handle errors explicitly
try {
  const raffle = await raffleService.getRaffle(id);
  return raffle;
} catch (error) {
  if (error instanceof RaffleNotFoundError) {
    return { error: 'Raffle not found', status: 404 };
  }
  throw error; // Re-throw unexpected errors
}
```

#### Comments

- Write self-documenting code
- Use comments for "why", not "what"
- Document complex algorithms
- Use JSDoc for public APIs

```typescript
// Good
/**
 * Calculates raffle odds based on blockchain entropy
 * and total number of entries. Uses Polygon's block hash
 * as randomness source.
 */
function calculateRaffleOdds(entries: number, blockHash: string): number {
  // Implementation
}

// Bad
// This function adds two numbers
function add(a: number, b: number): number {
  return a + b; // Returns the sum
}
```

### TypeScript Guidelines

- Enable strict mode
- Avoid `any` type (use `unknown` if needed)
- Define explicit return types
- Use interfaces for object shapes
- Use enums or union types for constants

```typescript
// Good
interface RaffleStatus {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  entryCount: number;
}

async function getRaffleStatus(id: string): Promise<RaffleStatus> {
  // Implementation
}

// Bad
async function getRaffleStatus(id: any) {
  // Missing types
}
```

## Testing Requirements

### Coverage Target

- Minimum 80% code coverage
- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical user flows

### Test Structure

```typescript
describe('RaffleService', () => {
  describe('createRaffle', () => {
    it('should create a raffle with valid parameters', async () => {
      // Arrange
      const params = {
        title: 'Test Raffle',
        maxEntries: 100,
        endDate: new Date('2025-12-31')
      };

      // Act
      const raffle = await raffleService.createRaffle(params);

      // Assert
      expect(raffle).toBeDefined();
      expect(raffle.title).toBe(params.title);
    });

    it('should throw error when max entries is negative', async () => {
      // Arrange
      const params = { maxEntries: -1 };

      // Act & Assert
      await expect(raffleService.createRaffle(params))
        .rejects
        .toThrow('Max entries must be positive');
    });
  });
});
```

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration:http
npm run test:integration:modules

# All tests with coverage
npm test -- --coverage
```

### Test Guidelines

- Use AAA pattern (Arrange, Act, Assert)
- One assertion per test (when possible)
- Test edge cases and error conditions
- Mock external dependencies
- Use descriptive test names

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semi colons, etc)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system changes
- `ci` - CI/CD changes
- `chore` - Other changes that don't modify src or test files

### Examples

```bash
# Simple commit
git commit -m "feat(raffle): add blockchain verification"

# Commit with body
git commit -m "fix(api): resolve race condition in raffle creation

Added mutex lock to prevent duplicate raffle entries when
multiple requests arrive simultaneously."

# Breaking change
git commit -m "feat(api)!: change raffle API response format

BREAKING CHANGE: Raffle API now returns entries as nested array
instead of flat structure. Update clients accordingly."
```

### Scope Examples

- `raffle` - Raffle module
- `blockchain` - Blockchain integration
- `api` - API routes
- `admin` - Admin dashboard
- `workflows` - Workflows
- `tests` - Test suite
- `docs` - Documentation

## Pull Request Process

### Before Submitting

1. Update your branch with latest develop:
```bash
git checkout develop
git pull upstream develop
git checkout your-branch
git rebase develop
```

2. Run tests and ensure they pass:
```bash
npm run test:unit
npm run test:integration:http
```

3. Check code coverage:
```bash
npm test -- --coverage
```

4. Lint your code:
```bash
npm run lint
```

5. Update documentation if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests passing
- [ ] Coverage >= 80%

## Checklist
- [ ] Code follows SOLID principles
- [ ] Code follows Clean Code practices
- [ ] Conventional commits used
- [ ] Documentation updated
- [ ] No console.log or debug code
- [ ] TypeScript types properly defined
```

### PR Review Process

1. Automated checks must pass (tests, linting, build)
2. At least one approval from maintainer required
3. Code review feedback must be addressed
4. PR will be squashed and merged to develop

## Documentation Requirements

### When to Update Documentation

- Adding new features
- Changing APIs
- Modifying configurations
- Adding environment variables
- Updating dependencies

### Documentation Guidelines

- Write in both English and Portuguese
- Use clear, concise language
- Include code examples
- Add diagrams for complex features
- Keep README and docs/ in sync

### Documentation Structure

- `README.md` - Project overview and quick start
- `docs/ARCHITECTURE.md` - System architecture
- `docs/API.md` - API reference
- `docs/modules/` - Module-specific documentation
- `docs/development/` - Development guides
- `docs/DEPLOYMENT.md` - Deployment instructions

## Questions?

- Open a GitHub Discussion for general questions
- Open an issue for bug reports or feature requests
- Join our community channels (Discord/Slack if available)

Thank you for contributing to USE Nerd!

---

## Portugues

Obrigado pelo seu interesse em contribuir para o USE Nerd! Este documento fornece diretrizes e padroes para contribuir com o projeto.

## Indice

- [Codigo de Conduta](#codigo-de-conduta)
- [Comecando](#comecando)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Padroes de Codigo](#padroes-de-codigo)
- [Requisitos de Teste](#requisitos-de-teste)
- [Diretrizes de Commit](#diretrizes-de-commit)
- [Processo de Pull Request](#processo-de-pull-request)
- [Requisitos de Documentacao](#requisitos-de-documentacao)

## Codigo de Conduta

- Seja respeitoso e inclusivo
- Dê boas-vindas aos novatos e ajude-os a comecar
- Foque em feedback construtivo
- Respeite diferentes pontos de vista e experiencias

## Comecando

1. Faca fork do repositorio
2. Clone seu fork:
```bash
git clone https://github.com/SEU_USUARIO/use-nerd.git
cd use-nerd
```

3. Adicione remote upstream:
```bash
git remote add upstream https://github.com/original-org/use-nerd.git
```

4. Instale as dependencias:
```bash
npm install
```

5. Configure seu ambiente de desenvolvimento seguindo o [README](./README.md)

## Fluxo de Desenvolvimento

### Estrategia de Branches

- `main` - Codigo pronto para producao
- `develop` - Branch de integracao para features
- `feature/*` - Novas funcionalidades
- `fix/*` - Correcoes de bugs
- `docs/*` - Atualizacoes de documentacao
- `refactor/*` - Refatoracao de codigo
- `test/*` - Melhorias em testes

### Criando uma Branch de Feature

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/nome-da-sua-feature
```

## Padroes de Codigo

### Principios SOLID

Siga os principios SOLID em todo codigo:

1. **Principio da Responsabilidade Unica (SRP)**
   - Cada classe/modulo deve ter uma responsabilidade
   - Exemplo: Separe acesso a dados de logica de negocio

2. **Principio Aberto/Fechado (OCP)**
   - Aberto para extensao, fechado para modificacao
   - Use interfaces e classes abstratas

3. **Principio da Substituicao de Liskov (LSP)**
   - Subtipos devem ser substituiveis por seus tipos base
   - Mantenha comportamento esperado na heranca

4. **Principio da Segregacao de Interface (ISP)**
   - Muitas interfaces especificas > uma interface geral
   - Nao force implementacoes de metodos nao usados

5. **Principio da Inversao de Dependencia (DIP)**
   - Dependa de abstracoes, nao de concrecoes
   - Use injecao de dependencia

### Praticas de Clean Code

#### Convencoes de Nomenclatura

```typescript
// Classes: PascalCase
class RaffleService {}

// Interfaces: PascalCase com prefixo 'I'
interface IRaffleRepository {}

// Funcoes/Metodos: camelCase com verbo
function calculateRaffleOdds() {}
async function fetchUserRaffles() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RAFFLE_ENTRIES = 1000;

// Variaveis: camelCase, descritivo
const userRaffleEntries = [];
```

#### Diretrizes de Funcoes

- Funcoes devem ser pequenas (< 20 linhas idealmente)
- Fazer uma coisa e fazer bem
- Usar nomes descritivos (evitar abreviacoes)
- Limitar parametros (max 3-4, use objetos para mais)

```typescript
// Bom
async function createRaffleEntry(params: CreateRaffleEntryParams): Promise<RaffleEntry> {
  validateRaffleParams(params);
  const entry = await raffleRepository.create(params);
  await notifyRaffleCreation(entry);
  return entry;
}

// Ruim
async function cre(a: any, b: any, c: any, d: any, e: any) {
  // Muitos parametros, proposito nao claro
}
```

#### Tratamento de Erros

```typescript
// Use classes de erro customizadas
class RaffleNotFoundError extends Error {
  constructor(raffleId: string) {
    super(`Sorteio com ID ${raffleId} nao encontrado`);
    this.name = 'RaffleNotFoundError';
  }
}

// Trate erros explicitamente
try {
  const raffle = await raffleService.getRaffle(id);
  return raffle;
} catch (error) {
  if (error instanceof RaffleNotFoundError) {
    return { error: 'Sorteio nao encontrado', status: 404 };
  }
  throw error; // Re-lance erros inesperados
}
```

#### Comentarios

- Escreva codigo auto-documentavel
- Use comentarios para "por que", nao "o que"
- Documente algoritmos complexos
- Use JSDoc para APIs publicas

```typescript
// Bom
/**
 * Calcula odds do sorteio baseado em entropia blockchain
 * e numero total de entradas. Usa hash de bloco Polygon
 * como fonte de aleatoriedade.
 */
function calculateRaffleOdds(entries: number, blockHash: string): number {
  // Implementacao
}

// Ruim
// Esta funcao soma dois numeros
function add(a: number, b: number): number {
  return a + b; // Retorna a soma
}
```

### Diretrizes TypeScript

- Habilite modo strict
- Evite tipo `any` (use `unknown` se necessario)
- Defina tipos de retorno explicitos
- Use interfaces para formas de objeto
- Use enums ou union types para constantes

```typescript
// Bom
interface RaffleStatus {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  entryCount: number;
}

async function getRaffleStatus(id: string): Promise<RaffleStatus> {
  // Implementacao
}

// Ruim
async function getRaffleStatus(id: any) {
  // Tipos faltando
}
```

## Requisitos de Teste

### Meta de Cobertura

- Minimo 80% de cobertura de codigo
- Testes unitarios para toda logica de negocio
- Testes de integracao para endpoints de API
- Testes E2E para fluxos criticos de usuario

### Estrutura de Teste

```typescript
describe('RaffleService', () => {
  describe('createRaffle', () => {
    it('deve criar um sorteio com parametros validos', async () => {
      // Arrange
      const params = {
        title: 'Sorteio Teste',
        maxEntries: 100,
        endDate: new Date('2025-12-31')
      };

      // Act
      const raffle = await raffleService.createRaffle(params);

      // Assert
      expect(raffle).toBeDefined();
      expect(raffle.title).toBe(params.title);
    });

    it('deve lancar erro quando max entries e negativo', async () => {
      // Arrange
      const params = { maxEntries: -1 };

      // Act & Assert
      await expect(raffleService.createRaffle(params))
        .rejects
        .toThrow('Max entries deve ser positivo');
    });
  });
});
```

### Executando Testes

```bash
# Testes unitarios
npm run test:unit

# Testes de integracao
npm run test:integration:http
npm run test:integration:modules

# Todos os testes com cobertura
npm test -- --coverage
```

### Diretrizes de Teste

- Use padrao AAA (Arrange, Act, Assert)
- Uma assertiva por teste (quando possivel)
- Teste casos extremos e condicoes de erro
- Mocke dependencias externas
- Use nomes de teste descritivos

## Diretrizes de Commit

Seguimos a especificacao [Conventional Commits](https://www.conventionalcommits.org/).

### Formato de Mensagem de Commit

```
<tipo>(<escopo>): <assunto>

<corpo>

<rodape>
```

### Tipos

- `feat` - Nova funcionalidade
- `fix` - Correcao de bug
- `docs` - Mudancas na documentacao
- `style` - Mudancas de estilo de codigo (formatacao, ponto e virgula, etc)
- `refactor` - Refatoracao de codigo
- `perf` - Melhorias de performance
- `test` - Adicao ou atualizacao de testes
- `build` - Mudancas no sistema de build
- `ci` - Mudancas em CI/CD
- `chore` - Outras mudancas que nao modificam arquivos src ou test

### Exemplos

```bash
# Commit simples
git commit -m "feat(raffle): adiciona verificacao blockchain"

# Commit com corpo
git commit -m "fix(api): resolve condicao de corrida na criacao de sorteio

Adicionado mutex lock para prevenir entradas duplicadas quando
multiplas requisicoes chegam simultaneamente."

# Breaking change
git commit -m "feat(api)!: muda formato de resposta da API de sorteio

BREAKING CHANGE: API de Sorteio agora retorna entradas como array
aninhado ao inves de estrutura plana. Atualize clientes adequadamente."
```

### Exemplos de Escopo

- `raffle` - Modulo de sorteio
- `blockchain` - Integracao blockchain
- `api` - Rotas de API
- `admin` - Painel administrativo
- `workflows` - Workflows
- `tests` - Suite de testes
- `docs` - Documentacao

## Processo de Pull Request

### Antes de Submeter

1. Atualize sua branch com o develop mais recente:
```bash
git checkout develop
git pull upstream develop
git checkout sua-branch
git rebase develop
```

2. Execute testes e garanta que passem:
```bash
npm run test:unit
npm run test:integration:http
```

3. Verifique cobertura de codigo:
```bash
npm test -- --coverage
```

4. Faça lint do seu codigo:
```bash
npm run lint
```

5. Atualize documentacao se necessario

### Template de PR

```markdown
## Descricao
Breve descricao das mudancas

## Tipo de Mudanca
- [ ] Correcao de bug
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Atualizacao de documentacao

## Testes
- [ ] Testes unitarios adicionados/atualizados
- [ ] Testes de integracao adicionados/atualizados
- [ ] Todos os testes passando
- [ ] Cobertura >= 80%

## Checklist
- [ ] Codigo segue principios SOLID
- [ ] Codigo segue praticas Clean Code
- [ ] Commits convencionais usados
- [ ] Documentacao atualizada
- [ ] Sem console.log ou codigo de debug
- [ ] Tipos TypeScript propriamente definidos
```

### Processo de Revisao de PR

1. Verificacoes automatizadas devem passar (testes, linting, build)
2. Pelo menos uma aprovacao de mantenedor necessaria
3. Feedback de code review deve ser endereçado
4. PR sera squashed e merged para develop

## Requisitos de Documentacao

### Quando Atualizar Documentacao

- Adicionar novas funcionalidades
- Mudar APIs
- Modificar configuracoes
- Adicionar variaveis de ambiente
- Atualizar dependencias

### Diretrizes de Documentacao

- Escreva em Ingles e Portugues
- Use linguagem clara e concisa
- Inclua exemplos de codigo
- Adicione diagramas para funcionalidades complexas
- Mantenha README e docs/ sincronizados

### Estrutura de Documentacao

- `README.md` - Visao geral e inicio rapido
- `docs/ARCHITECTURE.md` - Arquitetura do sistema
- `docs/API.md` - Referencia da API
- `docs/modules/` - Documentacao especifica de modulos
- `docs/development/` - Guias de desenvolvimento
- `docs/DEPLOYMENT.md` - Instrucoes de deploy

## Duvidas?

- Abra uma GitHub Discussion para questoes gerais
- Abra uma issue para reportar bugs ou solicitar features
- Junte-se aos nossos canais da comunidade (Discord/Slack se disponivel)

Obrigado por contribuir com o USE Nerd!
