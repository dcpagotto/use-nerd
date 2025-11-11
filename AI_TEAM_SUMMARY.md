# USE Nerd AI Team Configuration Summary

## Configured Agents (12 Total)

### Core Quality Team (3)
1. **code-reviewer** - MANDATORY quality gate before all merges
2. **performance-optimizer** - Performance and optimization specialist
3. **documentation-specialist** - Bilingual documentation (EN/PT-BR)

### Development Team (4)
4. **backend-developer** - Medusa v2 + TypeScript + Blockchain/Web3
5. **react-nextjs-expert** - Next.js 14 App Router specialist
6. **tailwind-css-expert** - Tailwind v4 + cyberpunk theme
7. **api-architect** - API design and contracts

### Specialist Team (4)
8. **testing-expert** - Jest, Vitest, Playwright, Hardhat tests
9. **security-expert** - Payment security, smart contracts, compliance
10. **devops-cicd-expert** - Docker, GitHub Actions, deployment
11. **tech-lead-orchestrator** - Complex feature coordination

---

## Quick Reference

### Backend Work
@backend-developer - Medusa modules, TypeScript, Web3 integration
@api-architect - API design before implementation

### Frontend Work  
@react-nextjs-expert - Next.js 14 components and pages
@tailwind-css-expert - Styling with cyberpunk theme

### Quality Assurance
@testing-expert - All test types (unit, integration, E2E)
@code-reviewer - MANDATORY before merge

### Specialized Tasks
@security-expert - Security audits, payment integration
@performance-optimizer - Performance bottlenecks
@devops-cicd-expert - CI/CD and infrastructure
@documentation-specialist - Bilingual docs (EN/PT-BR)

### Complex Features
@tech-lead-orchestrator - Multi-agent coordination

---

## Critical Rules

1. **ALWAYS** use @code-reviewer before merging to main
2. **Maximum 2 agents** in parallel (orchestrator rule)
3. **Minimum 80%** test coverage required
4. **Bilingual docs** (EN/PT-BR) mandatory
5. **SOLID principles** and Clean Code enforced
6. **Conventional commits** format required

---

## Sample Commands

### Raffle Module Development
@tech-lead-orchestrator implement complete raffle module with blockchain
@api-architect design raffle module API endpoints
@backend-developer implement raffle ticket purchase logic
@testing-expert create raffle module tests
@code-reviewer review raffle implementation

### Frontend Development
@react-nextjs-expert create raffle ticket purchase page
@tailwind-css-expert apply cyberpunk theme to raffle page
@testing-expert create E2E tests for raffle flow

### Brazil Module (PIX, Mercado Pago, Melhor Envio, NFe)
@api-architect design Brazil payment integration API
@backend-developer implement PIX and Mercado Pago integration
@security-expert audit payment security
@documentation-specialist create PT-BR payment docs

### Blockchain Integration
@backend-developer create Web3 service for Polygon integration
@backend-developer implement smart contract deployment workflow
@security-expert audit smart contract security
@testing-expert create Hardhat contract tests

### Performance Issues
@performance-optimizer analyze database query performance
@backend-developer optimize slow endpoints
@testing-expert add load tests

### Documentation Updates
@documentation-specialist update README with new features
@documentation-specialist create bilingual API documentation

---

## Configuration Files

- **CLAUDE.md** - Full AI team configuration (323 lines)
- **AI_TEAM_SUMMARY.md** - This quick reference guide
- Located in project root: C:/Users/dcpagotto/Documents/Projects/use-nerd/

---

## Agent Justifications

### Why These Agents?

**backend-developer** (not framework-specific)
- No Medusa-specific agent available
- Universal backend-developer handles Node.js/TypeScript
- Can handle Web3/Blockchain integration
- Covers Medusa v2 patterns + custom modules

**react-nextjs-expert** (specialized)
- Next.js 14 App Router requires specialist knowledge
- Server Components vs Client Components expertise
- SSR/SSG/ISR patterns

**tailwind-css-expert** (specialized)
- Tailwind v4 features (container queries, OKLCH)
- Cyberpunk theme customization
- Utility-first CSS patterns

**api-architect** (universal)
- Framework-agnostic API design
- OpenAPI specifications
- RESTful best practices

**testing-expert** (specialized Python, but adaptable)
- Universal testing patterns apply
- Jest, Vitest, Playwright knowledge
- Hardhat for smart contract testing

**security-expert** (specialized Python, but principles universal)
- Payment security (PIX, Mercado Pago)
- Smart contract auditing
- Authentication/authorization patterns

**devops-cicd-expert** (specialized Python, but adaptable)
- Docker containerization
- GitHub Actions workflows
- Deployment automation

**code-reviewer** (core, mandatory)
- Security-aware quality gate
- SOLID principles enforcement
- 80% coverage validation

**performance-optimizer** (core, proactive)
- Database query optimization
- Bundle size optimization
- Caching strategies

**documentation-specialist** (core)
- Bilingual documentation requirement
- API reference generation
- Architecture documentation

**tech-lead-orchestrator** (orchestration)
- Breaks down complex features
- Coordinates multiple agents
- Maximum 2 agents in parallel

---

## Module-Specific Agent Assignments

### Raffle Module
- Design: api-architect
- Implementation: backend-developer
- Testing: testing-expert
- Review: code-reviewer
- Docs: documentation-specialist

### Blockchain Module
- Smart Contracts: backend-developer (Solidity)
- Web3 Integration: backend-developer (Ethers.js/Web3.js)
- Security: security-expert (contract audit)
- Testing: testing-expert (Hardhat)
- Review: code-reviewer

### POD Module (Printful/Printify)
- API Design: api-architect
- Integration: backend-developer
- Testing: testing-expert
- Review: code-reviewer
- Docs: documentation-specialist

### Brazil Module
- Payment (PIX/Mercado Pago): backend-developer + security-expert
- Shipping (Melhor Envio): backend-developer
- Fiscal (NFe): backend-developer + security-expert
- Testing: testing-expert
- Review: code-reviewer + security-expert
- Docs: documentation-specialist (PT-BR focus)

---

## Success Metrics

- 80%+ test coverage on all modules
- All code reviewed before merge
- Bilingual documentation for all features
- Zero security vulnerabilities
- SOLID principles followed
- Conventional commits used
- Performance benchmarks met

---

**Version**: 1.0  
**Date**: 2025-11-10  
**Configured By**: team-configurator agent  
**Project**: USE Nerd E-commerce Platform
