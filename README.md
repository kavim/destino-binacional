<p align="center"><a href="https://destinobinacional.com" target="_blank"><img src="https://raw.githubusercontent.com/kavim/destino-binacional/dc1321af8503d9e0ee1fba361e05ca2d70498a72/public/images/logotipo-color.svg" width="400" alt="Destino Binacional Logo"></a></p>

## Sobre

**Rivera e Santana do Livramento** são cidades gêmeas unidas por uma única rua, com extraordinária riqueza natural, patrimonial e cultural e uma localização geográfica privilegiada.

Este sistema foi criado para promover e compartilhar o rico patrimônio cultural, natural e histórico de Rivera e Santana do Livramento. Seja planejando uma visita ou simplesmente curioso sobre a região, esta plataforma é o seu portal para descobrir tudo o que Rivera e Santana do Livramento têm a oferecer.

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | PHP 8.2 · Laravel 10 · Inertia.js |
| Frontend | React 18 · TypeScript · Tailwind CSS 3 · shadcn/ui |
| Banco | MySQL 8.0 |
| Infra | Docker · Docker Compose |
| Testes | PHPUnit 10 · Vitest 3 · Testing Library |

---

## Pré-requisitos

- **Docker** e **Docker Compose** (recomendado)
- ou PHP 8.2+, Composer 2, Node.js 18+, MySQL 8

---

## Instalação com Docker (recomendado)

```bash
# 1. Clone o repositório
git clone git@github.com:kavim/destino-binacional.git
cd destino-binacional

# 2. Suba os containers
docker compose up -d

# Isso cria 4 serviços:
#   - app           → PHP 8.2 (Laravel) na porta 8000
#   - mysql          → MySQL 8.0 na porta 3306
#   - init_tracker   → Cria o banco 'tracker' automaticamente
#   - phpmyadmin     → Interface web na porta 8080

# 3. Instale as dependências (primeira vez)
docker compose exec app composer install
npm install

# 4. Configure o ambiente
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate

# 5. Rode as migrations e seeders
docker compose exec app php artisan migrate --seed

# 6. Compile os assets
npm run build

# 7. Acesse
# App:        http://localhost:8000
# phpMyAdmin: http://localhost:8080
```

### Variáveis de ambiente (Docker)

As variáveis de banco já estão no `docker-compose.yml`:

| Variável | Valor |
|----------|-------|
| `DB_HOST` | `mysql` |
| `DB_DATABASE` | `destino` |
| `DB_USERNAME` | `destino` |
| `DB_PASSWORD` | `secret` |

---

## Instalação local (sem Docker)

```bash
# 1. Clone
git clone git@github.com:kavim/destino-binacional.git
cd destino-binacional

# 2. Instale dependências
composer install
npm install

# 3. Configure
cp .env.example .env
php artisan key:generate

# 4. Configure o banco no .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=destino
# DB_USERNAME=root
# DB_PASSWORD=

# 5. Migrations + Seeders
php artisan migrate --seed

# 6. Compile e sirva
npm run build
php artisan serve
```

---

## Desenvolvimento

```bash
# Terminal 1 — backend
docker compose up -d
# ou: php artisan serve

# Terminal 2 — frontend (hot reload)
npm run dev
```

### Tema escuro

O projeto suporta **dark mode nativo** com 3 opções: Light, Dark e System.
A opção System sincroniza automaticamente com o sistema operacional.
O toggle está disponível no header do site e do dashboard.

---

## Testes

O projeto possui testes backend (PHPUnit) e frontend (Vitest).
Para o guia completo com todos os comandos, consulte **[testes.md](./testes.md)**.

### Quick start

```bash
# Backend — roda tudo com SQLite in-memory (sem precisar do MySQL)
docker compose exec app php artisan test

# Frontend — 35 testes de componentes UI
npm test
```

### Estrutura dos testes

```
tests/                              # PHPUnit
├── Unit/Models/                    # Testes de model (sem banco)
├── Feature/Auth/                   # Autenticação, registro, senhas
├── Feature/Dashboard/              # CRUD admin (eventos, tours)
├── Feature/Site/                   # Páginas públicas
└── Feature/                        # Profile, Places

resources/js/__tests__/             # Vitest
├── components/                     # ThemeProvider, Logo, PrimaryButton
└── components/ui/                  # Button, Card, Input (shadcn)
```

### Comandos úteis

```bash
# Apenas testes unitários
docker compose exec app php artisan test --testsuite=Unit

# Apenas testes de feature
docker compose exec app php artisan test --testsuite=Feature

# Filtrar por nome
docker compose exec app php artisan test --filter=AuthenticationTest

# Frontend em modo watch
npm run test:watch

# Frontend com cobertura
npm run test:coverage
```

---

## Serviços Docker

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| `app` | 8000 | Aplicação Laravel |
| `mysql` | 3306 | Banco de dados MySQL 8.0 |
| `phpmyadmin` | 8080 | Interface de administração do banco |
| `init_tracker` | — | Inicializador do banco de tracking |

### Comandos Docker frequentes

```bash
docker compose up -d          # Subir tudo
docker compose down           # Parar tudo
docker compose logs -f app    # Ver logs da aplicação
docker compose exec app bash  # Abrir shell no container
docker compose exec app php artisan migrate  # Rodar migrations
docker compose exec app php artisan tinker   # Laravel REPL
```

---

## Tracker

O módulo de tracking está **desabilitado por padrão**. Para ativar, configure no `.env`:

```
TRACKER_ENABLED=true
```

---

## Licença

Software open-source licenciado sob a [MIT license](https://opensource.org/licenses/MIT).
