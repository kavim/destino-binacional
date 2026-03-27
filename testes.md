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

```
tests/                          # ← Backend (PHPUnit)
├── Unit/
│   ├── ExampleTest.php
│   └── Models/
│       ├── EventTest.php
│       ├── TourTest.php
│       └── UserTest.php
├── Feature/
│   ├── ExampleTest.php
│   ├── ProfileTest.php
│   ├── PlaceControllerTest.php
│   ├── Auth/
│   │   ├── AuthenticationTest.php
│   │   ├── RegistrationTest.php
│   │   ├── PasswordConfirmationTest.php
│   │   ├── PasswordResetTest.php
│   │   ├── PasswordUpdateTest.php
│   │   └── EmailVerificationTest.php
│   ├── Dashboard/
│   │   ├── DashboardTest.php
│   │   ├── EventControllerTest.php
│   │   └── TourControllerTest.php
│   └── Site/
│       ├── HomeTest.php
│       └── EventTest.php
├── TestCase.php
└── CreatesApplication.php

resources/js/__tests__/          # ← Frontend (Vitest)
├── setup.ts
├── components/
│   ├── ApplicationLogo.test.tsx
│   ├── PrimaryButton.test.tsx
│   ├── ThemeProvider.test.tsx
│   └── ui/
│       ├── button.test.tsx
│       ├── card.test.tsx
│       └── input.test.tsx
```

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

# Com cobertura (requer Xdebug ou PCOV)
docker compose exec app php artisan test --coverage
```

> **Nota:** O `phpunit.xml` está configurado com **SQLite :memory:** para testes.
> Isso significa que **não depende** do MySQL estar rodando — os testes criam
> e destroem o banco em memória a cada suite.

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

### Backend

| Grupo | O que cobre |
|-------|------------|
| `Unit/Models` | Atributos fillable, casts, accessors dos Models (sem banco) |
| `Feature/Auth` | Login, registro, reset de senha, confirmação, verificação de e-mail |
| `Feature/Dashboard` | Acesso autenticado ao painel, CRUD de eventos/tours |
| `Feature/Site` | Páginas públicas: Home, Eventos, filtros por data |
| `Feature/PlaceControllerTest` | Edição de locais (Place) com Inertia assertions |

### Frontend

| Grupo | O que cobre |
|-------|------------|
| `components/ThemeProvider` | Troca de tema, persistência localStorage, resolvedTheme, sistema |
| `components/ApplicationLogo` | Duas imagens (claro/escuro), tamanhos, classes dark: |
| `components/PrimaryButton` | Wrapper do Button, variante default, disabled |
| `components/ui/button` | Todas as variantes, tamanhos, disabled, merge de classes |
| `components/ui/card` | Bordas semânticas, rounded-xl, composição Header/Content/Footer |
| `components/ui/input` | Tipos, placeholder, disabled, tokens dark mode |

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

### CI rápido

Para rodar tudo em sequência (útil em CI):

```bash
docker compose exec app php artisan test && npm test
```

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
