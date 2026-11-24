# Análise da Linguagem e Estrutura do Projeto Piacentini

## Visão Geral

O projeto **Piacentini** é um sistema full-stack moderno composto por:

- **API Backend**: NestJS (Node.js) com TypeScript
- **Frontend Web**: Angular com TypeScript

## 1. Linguagens e Frameworks

### Backend (API)
- **TypeScript** ^6.0.2
- **NestJS** ^12.0.1 (framework progressivo Node.js)
- Dependências principais:
  - `@nestjs/common`, `@nestjs/core`, `@nestjs/typeorm`
  - `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/config`
  - `@nestjs/platform-express`
- Banco de dados:
  - **PostgreSQL** via TypeORM (principal)
  - **Oracle** via `oracledb` ^7.0.1 (secundário/legacy)
- Autenticação: JWT com Passport, bcrypt para hash de senhas
- Testes: Vitest, Supertest

### Frontend (Web)
- **TypeScript** ~5.9.2
- **Angular** ^21.2.0 (versão muito recente/bleeding edge)
- UI Components: **@po-ui/ng-components** ^21.32.4 (biblioteca de componentes PO)
- RxJS ~7.8.0
- Angular Signals (padrão reativo moderno)
- Testes: Vitest, Jasmine (via Angular Testing)

## 2. Arquitetura da API (NestJS)

### Padrão Utilizado
- **Módulos** (`feature modules`) organizados por domínio
- Controladores (`controllers`) expondo endpoints REST
- Services (`services` com `@Injectable`) com lógica de negócio
- Guards (`guards`) para autorização
- Interceptors (`interceptors`) para cross-cutting concerns
- Decorators personalizados para metadados

### Módulos Principais
| Módulo | Descrição |
|--------|-----------|
| `AuthModule` | Login, JWT tokens, troca de senha, reset de senha |
| `UsuariosModule` | CRUD de usuários com perfis |
| `PerfisModule` | Gerenciamento de perfis e permissões |
| `SegurancaModule` | Entidades base (Usuario, Perfil, Permissão) |
| `AuditoriaModule` | Registro e consulta de ações do sistema |
| `AppModule` | Módulo raíz que agrupa todos os outros |

### Padrões de Design Observados
1. **Guards Duplos**: `JwtAuthGuard` (validade do JWT) + `PermissoesGuard` (verificação de permissões)
2. **Pipes Globais**: `ValidationPipe` com `whitelist: true` e `transform: true`
3. **Interceptador de Auditoria**: Captura contexto de cada requisição
4. **Decorado Personalizado**: `@Permissoes()` para especificar exigências de permissão
5. **DTOs** (`Data Transfer Objects`) para validação de entrada: `CriarUsuarioDto`, `AtualizarUsuarioDto`, `CriarPerfilDto`, etc.

### Configuração de Banco de Dados
```typescript
// Dual database setup
TypeOrmModule.forRootAsync({...})  // PostgreSQL (primary)
TypeOrmModule.forRootAsync({...}, { name: 'oracle' })  // Oracle
```

## 3. Arquitetura do Frontend (Angular)

### Padrão Utilizado
- **Componentes** com template inline ou external
- **Serviços** com injeção de dependência
- **Sinais** (`signal`) para estado reativo (Angular 16+ compatível)
- **Rotas** com lazy loading e guards
- **Interceptadores HTTP** para adicionar tokens de autenticação

### Estrutura de Pastas
```
src/app/
├── core/          ← Serviços, guards, interceptors, models
│   ├── auth.service.ts     ← Autenticação (login/logout/token)
│   ├── auth.guard.ts       ← Guard de rota (authGuard)
│   ├── auth.interceptor.ts ← Adiciona Authorization header
│   ├── models/             ← Interfaces Usuario, LoginResponse
│   ├── permissions/        ← Configuração de módulos e permissões
│   └── theme/              ← Configuração de tema PO UI
├── layout/             ← Layout principal com toolbar e menu
├── pages/             ← Páginas (painel, pcp, engenharia, etc.)
│   ├── painel/           ← Dashboard inicial
│   ├── login/            ← Tela de login
│   └── ... (pcp, engenharia, financeiro, suprimentos, vendas, manutencao)
```

### Recursos Modernos Angular
- **syntax de sinais** (`signal`, `computed`, `readonly`) em todo o código
- **Rota lazy loading** para módulos pesados
- **HttpClient** com interceptores
- **Router** with navigation state

### Sistema de Permissões
- Configurado em `permissions.config.ts` com módulos e permissões definidas
- `MODULOS` define quais menus aparecem por perfil
- `SUBMODULOS` define sub-itens dentro de módulos
- `hasPerfil('ADMIN')` e `hasPermissao('nome.permissao')` nos serviços
- Filtro de menus no `PainelComponent` baseado nas permissões do usuário

## 4. Padrões de Comunicação

### API Backend → Frontend
- Endpoints REST em `/api/auth/`, `/api/usuarios/`, `/api/perfis/`, etc.
- Respostas JSON padronizadas
- Tokens JWT incluídos nos headers `Authorization: Bearer <token>`

### Frontend → API
- `AuthService` faz POST para `/api/auth/login`
- `AuthInterceptor` injeta token em todas requisições para `/api/`
- `HttpClient` do Angular consumindo a API NestJS

## 5. Padrões de Segurança

### Backend
- Senhas com `bcryptjs` (10 rounds de hashing)
- JWT com segredo configurado via `.env` (`JWT_SECRET`)
- Guards JWT e de permissão
- Pipe de validação global (whitelist, transform)
- Exclusão bloqueada para usuário `admin`

### Frontend
- Token armazenado em `localStorage`
- Interceptor adiciona header Authorization automaticamente
- Guard `authGuard` redireciona login se não autenticado
- `hasPerfil()` e `hasPermissao()` para controle de UI
- Decorator `@Public()` para endpoints de login sem auth

## 6. Padrões de Testes

### Backend
- `vitest` para unit tests
- `supertest` para integration tests
- `test:e2e` para end-to-end tests
- Cobertura de código com `test:cov`

### Frontend
- `ng test` (Jasmine/Karma legacy) ou `vitest`
- Componentes e services testados isoladamente

## 7. Observabilidade

- Integração com **NestJS Observe** (telemetria: traces, errors, logs, metrics)
- Configuração via `ObserveModule` no `AppModule`
- Chaves de observabilidade armazenadas em `.env`

## 8. Tecnologias de Integração

- **Dual Database**: PostgreSQL principal + Oracle para dados legados
- **JWT Authentication** padrão da indústria
- **bcryptjs** para criptografia de senhas
- **TypeORM** com suporte a múltiplos bancos
- **@po-ui/ng-components** para interface de usuário (biblioteca de componentes visualmente rica)

## Resumo

O projeto Piacentini representa uma aplicação corporativa moderna, utilizando:

- **Stack TypeScript completa** (backend e frontend)
- **NestJS 12** com arquitetura modular e patterns well-established
- **Angular 21** com recursos mais recentes (sinais, lazy loading)
- **Banco de dados dual** (PostgreSQL + Oracle)
- **Autenticação JWT** com controle de permissões granular
- **UI components** via @po-ui/ng-components
- **Observabilidade** integrada via NestJS Observe

A separação entre módulos de segurança (auth, usuarios, perfis), operações (auditoria, pcp, financeiro, etc.) e a estrutura de permissões baseada em perfis demonstra um sistema bem projetado para controle de acesso corporativo.