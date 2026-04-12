---
name: destino-binacional
description: >-
  Laravel 11 + Inertia (React, TypeScript) app with Vite, Tailwind, Ziggy, and
  Sanctum. Use when editing PHP backend, Inertia pages, dashboard/site UI,
  routes, or when the user mentions destino-binacional, this repo, or its stack.
---

# Destino Binacional

## Stack

- **Backend**: PHP 8.2+, Laravel 11, Inertia Laravel, Sanctum, Ziggy (named routes in JS)
- **Frontend**: React 18, TypeScript, Vite 4, Tailwind 3, Radix UI + shadcn-style components (`resources/js/Components/ui/`)
- **i18n**: `astrotomic/laravel-translatable` (models/translations on server; `resources/js/Mixins/translations.ts` on client)
- **Tooling**: ESLint (`npm run lint`), Vitest (`npm run test`), Laravel Pint (PHP — obrigatório após mudanças PHP antes de commit/PR)

## Fluxo de trabalho (Git / PR)

- **Branches**: `feature/descricao-curta`, `fix/descricao-curta`, `chore/...` ou `docs/...` — evitar trabalho direto em `main`/`master` (ver rule `git-workflow`).
- **Pull request**: abrir PR para a branch principal do repositório; descrição com contexto e, se aplicável, como testar.
- **Antes de pedir merge**: `npm run lint` e `npm run test` quando houver mudanças em JS/TS; `./vendor/bin/pint` quando houver mudanças em `app/`, `routes/` ou `database/migrations`.

## Onde mexer

| Área | Caminhos |
|------|----------|
| Páginas Inertia | `resources/js/Pages/` (`Dashboard/`, `Site/`, `Auth/`, `Profile/`) |
| Componentes | `resources/js/Components/`, `resources/js/Shared/` |
| Entrada SPA | `resources/js/app.tsx`, `resources/js/bootstrap.ts` |
| Rotas web/API | `routes/web.php`, `routes/api.php` |
| Controllers / models | `app/Http/`, `app/Models/` |
| Build front | `vite.config.js`, `package.json` scripts |

## Comandos úteis

```bash
npm run dev          # Vite dev server
npm run build        # Produção
npm run lint         # ESLint em resources/js
npm run test         # Vitest
php artisan ...      # Migrações, rotas, etc.
./vendor/bin/pint    # Obrigatório após editar PHP (antes de commit/PR)
```

## Convenções

- Preferir **Inertia** (`router`, `useForm`, `Link` de `@inertiajs/react`) em vez de SPA separada, salvo exceções já existentes.
- Rotas nomeadas no backend; no TS usar **Ziggy** (`route()`) quando o projeto já exporta isso.
- UI: reutilizar `Button`, `Input`, `badge`, etc. em `Components/ui/` e padrões de layout existentes (`AuthenticatedLayout`, `GuestLayout`, site layout).
- Observabilidade client: `resources/js/observability.ts` é registrado no `createInertiaApp` — manter coerência ao instrumentar navegação/erros.
- Testes de componentes: `resources/js/__tests__/` com Vitest + Testing Library.

## Referência rápida de domínio

- Áreas funcionais comuns no código: **Places**, **Tours**, **Events**, **Categories**, **Tags**, painel **Dashboard** vs páginas **Site**.

Para detalhes de API ou variáveis de ambiente, ler `.env.example` e `routes/api.php` no contexto da tarefa.
