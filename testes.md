# Guia de Testes — Destino Binacional

> Rivera & Santana do Livramento, unidos pela mesma rua — e pelo mesmo CI.

---

## Visão geral

O projeto possui **dois pipelines de testes** independentes:

| Stack | Engine | Config | Diretório |
|-------|--------|--------|-----------|
| **Backend** (PHP) | PHPUnit 10 | `phpunit.xml` | `tests/` |
| **Frontend** (React/TS) | Vitest 3 | `vitest.config.ts` | `resources/js/__tests__/` |

---

## Estrutura de diretórios

A árvore muda com frequência. Fonte de verdade:

- Backend: `tests/Unit/`, `tests/Feature/` (Auth, Dashboard, Site, Api, Security, Inertia, Observability, Tracker, Bootstrap)
- Frontend: `resources/js/__tests__/` (components, pages, lib)

Exemplos atuais de cobertura PHP: Gallery, Category, Place, Event, EventService, CSRF, headers, sitemap, admin.

Exemplos Vitest: `mapsEmbedUrl`, `galleryForm`, ImageGallery/GalleryManager, CookieConsent, MainNav, SeoHead, ui/button/input, ThemeProvider.

---

## 1. Rodando via Docker (recomendado)

O projeto roda dentro de containers Docker. Todos os comandos abaixo assumem
que você já subiu o ambiente com:

```bash
docker compose up -d
```

### 1.1 Testes Backend (PHPUnit)

```bash
# Todos os testes (Unit + Feature)
docker compose exec app php artisan test

# Apenas Unit
docker compose exec app php artisan test --testsuite=Unit

# Apenas Feature
docker compose exec app php artisan test --testsuite=Feature

# Filtrar por nome
docker compose exec app php artisan test --filter=AuthenticationTest

# Filtrar por grupo/diretório
docker compose exec app php artisan test --filter=Dashboard

# Com cobertura (PCOV na imagem local — rebuild após mudar o Dockerfile)
docker compose exec app php artisan test --coverage
```

> **Nota:** O `phpunit.xml` está configurado com **SQLite :memory:** para testes.
> Isso significa que **não depende** do MySQL estar rodando — os testes criam
> e destroem o banco em memória a cada suite. Cobertura PHP usa **PCOV** no
> `Dockerfile` local (`docker compose build app` depois de puxar esta mudança).

### 1.2 Testes Frontend (Vitest)

O container `app` não possui Node.js. Você tem duas opções:

**Opção A — Rodar na máquina local (mais rápido):**

```bash
npm test            # roda uma vez e sai
npm run test:watch  # modo watch (re-roda ao salvar)
npm run test:coverage  # com cobertura v8
```

**Opção B — Rodar dentro do container com Node (one-liner):**

```bash
docker run --rm -v "$(pwd)":/app -w /app node:20-alpine sh -c "npm ci && npm test"
```

---

## 2. Rodando local (sem Docker)

Se você tem PHP 8.2+ e Node 18+ instalados localmente:

```bash
# Backend
php artisan test
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
php artisan test --filter=HomeTest

# Frontend
npm test
npm run test:watch
```

---

## 3. O que cada grupo testa

Ver `tests/` e `resources/js/__tests__/`. Resumo:

| Grupo | O que cobre |
|-------|------------|
| `Unit/` | Models, services (Event, Gallery), middleware (TrustProxies, ForceHttps) |
| `Feature/Auth` | Login, registro, reset, confirmação, verificação de e-mail |
| `Feature/Dashboard` | Painel admin, CRUD Place/Event/Tour/Category/Tag, galeria |
| `Feature/Site` | Home, eventos, tours, sitemap |
| `Feature/Security` | CSRF, headers |
| `Feature/Inertia` | Cache de categorias compartilhadas |
| `Feature/Observability` | Fila de observabilidade |
| `Feature/Tracker` | Tracker desligado (sem write, 404 no dashboard) |
| Vitest | UI (button/input/card), galeria, maps, SEO, MainNav, cookies, ThemeProvider |

---

## 4. Dicas e boas práticas

### Criar um novo teste backend

```bash
docker compose exec app php artisan make:test Feature/Dashboard/CategoryControllerTest
```

### Criar um novo teste frontend

Crie o arquivo em `resources/js/__tests__/` seguindo a convenção:

```
resources/js/__tests__/<grupo>/<NomeDoComponente>.test.tsx
```

### Convenções de nomenclatura

- **PHPUnit:** `test_<ação>_<resultado_esperado>` (snake_case)
- **Vitest:** `it('descreve o comportamento em português')` dentro de `describe`

### CI (GitHub Actions)

O workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) **está desativado** (não dispara em push/PR). Os jobs PHP e JS existem no arquivo; para religar, descomente `push`/`pull_request` no `on:`.

| Job | Comandos |
|-----|----------|
| PHP | `composer install` → `./vendor/bin/pint --test` → `php artisan test` (PHP 8.2, SQLite in-memory) |
| JS | `npm ci` → `npm run lint` → `npm test` (Node 20) |

Localmente:

```bash
docker compose exec app ./vendor/bin/pint --test
docker compose exec app php artisan test
npm ci && npm run lint && npm test
```

Produção com `QUEUE_CONNECTION=database`: o serviço `queue` no `docker-compose.prod.yml` roda `php artisan queue:work`. Sem worker a tabela `jobs` cresce. Em local, `QUEUE_CONNECTION=sync` no `.env.example`.

---

## 5. Banco de testes (SQLite in-memory)

O `phpunit.xml` define:

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

Todos os Feature tests usam `RefreshDatabase`, que roda migrations
automaticamente em cada teste. Não é necessário preparar banco algum.

Se precisar voltar a usar MySQL para algum teste específico, sobrescreva
no próprio test:

```php
protected function setUp(): void
{
    parent::setUp();
    config(['database.default' => 'mysql']);
}
```

---

*Mantido com carinho pela comunidade binacional.*
