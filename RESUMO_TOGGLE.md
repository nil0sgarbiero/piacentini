# Toggle Light/Dark no Menu de Perfil - Resumo

## Problema
O menu lateral do PO UI não estava colapsando devido a um typo `p-colapse` → `p-collapse` corrigido.

## Solução Implementada

### 1. Correcão de Typo (layout.component.html, line 16)
- `p-colapse="true"` → `p-collapse="true"`

### 2. Toggle de Tema no Perfil (layout.component.ts)
- Adicionado import `PoThemeService`, `PoThemeTypeEnum`, `piacentiniTheme`
- Adicionado item "Tema" no `acoesPerfil` do toolbar
- Implementado método `toggleTheme()` que:
  - Captura o tema atual via `this.theme.getThemeActive()`
  - Trata ambos os tipos possíveis de `active` (enum ou objeto)
  - Alterna entre `PoThemeTypeEnum.light` e `PoThemeTypeEnum.dark`
  - Aplica via `this.theme.setThemeType(piacentiniTheme, nextType)`

### Como Fica o Usuário
```
Toolbar → Perfil do Usuário
  ↓
  ├── Meu perfil
  ├── Sair
  └── Tema  (ícone lua/estrelas) ← NOVO
```

### Estados do Tema
- **Light**: Cores `#0069a8` (azul) e `#ffd464` (laranja) do piacentiniTheme
- **Dark**: Inversão dessas cores, nível AAA de acessibilidade

### Comando para Testar
```bash
cd C:\projetos\piacentini\web
npm run dev
```
Clique no perfil do usuário → "Tema" → alterna light/dark.