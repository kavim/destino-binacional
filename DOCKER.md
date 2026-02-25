# Docker: desenvolvimento vs produção e comparação com Sail

## Resumo

| Cenário        | Arquivo                  | Uso |
|----------------|---------------------------|-----|
| **Desenvolvimento** | `docker-compose.yml` + `Dockerfile` | Local: `php artisan serve`, volume com código, MySQL. |
| **Produção**   | `docker-compose.prod.yml` + `Dockerfile.prod` | Nginx + PHP-FPM, imagem otimizada, sem volume de código. |
| **Sail**       | (Laravel Sail)            | Dev oficial Laravel; não é para produção. |

A config atual do Docker **não serve para produção**: ela usa `php artisan serve`, que é só para desenvolvimento. Para produção use `docker-compose.prod.yml` (Nginx + PHP-FPM).

---

## Desenvolvimento (atual)

- **Arquivos:** `Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh`
- **Servidor:** `php artisan serve` (porta 8000)
- **Banco:** MySQL no container (bancos `destino` e `tracker` no mesmo container)
- **Código:** montado com volume (alterações no host refletem no container)
- **Uso:** ver `TESTE_LOCAL.md`

O serviço `init_tracker` roda após o MySQL ficar pronto e cria o banco `tracker` + usuário (idempotente, roda toda vez). Depois: `docker compose exec app php artisan migrate --database=tracker`

```bash
docker compose up -d --build
docker compose exec app php artisan migrate
npm run dev   # no host
# http://localhost:8000
```

---

## Produção

- **Arquivos:** `Dockerfile.prod`, `docker-compose.prod.yml`, `docker/nginx/default.conf`
- **Servidor:** Nginx (porta 80) + PHP-FPM (não usa `artisan serve`)
- **Código:** dentro da imagem (sem volume de código)
- **Otimizações:** OPcache, `composer --no-dev`, autoload otimizado

### Passos para rodar em produção

1. **Build dos assets (no host ou em CI):**

   ```bash
   npm ci
   npm run build
   ```

2. **Criar `.env` de produção** (APP_KEY, APP_ENV=production, APP_DEBUG=false, DB_*, etc.).

3. **Build e subir:**

   ```bash
   docker compose -f docker-compose.prod.yml build
   docker compose -f docker-compose.prod.yml up -d
   ```

4. **Migrations e cache (uma vez ou no deploy):**

   ```bash
   docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
   docker compose -f docker-compose.prod.yml exec app php artisan config:cache
   docker compose -f docker-compose.prod.yml exec app php artisan route:cache
   docker compose -f docker-compose.prod.yml exec app php artisan view:cache
   ```

5. **Acessar:** `http://localhost` (ou o IP/domínio do servidor).

No `docker-compose.prod.yml`, as variáveis de banco vêm do `.env` (por exemplo `DB_PASSWORD`, `DB_DATABASE`). Defina `MYSQL_ROOT_PASSWORD` e `DB_PASSWORD` em produção.

O banco `tracker` é criado automaticamente no mesmo MySQL. Rodar `php artisan migrate --database=tracker --force` após o deploy.

---

## Comparação com Laravel Sail

| Aspecto | Este projeto (dev) | Este projeto (prod) | Sail |
|--------|---------------------|----------------------|------|
| **Foco** | Dev local simples | Produção | Apenas desenvolvimento |
| **Servidor HTTP** | `artisan serve` | Nginx + PHP-FPM | `artisan serve` (padrão) |
| **Produção** | Não usar | Sim | Não usar |
| **Serviços** | app + MySQL | app + nginx + MySQL | app, MySQL, Redis, Mailpit, etc. |
| **CLI** | `docker compose` | `docker compose -f docker-compose.prod.yml` | `./vendor/bin/sail` |
| **Volume de código** | Sim (hot reload) | Não (código na imagem) | Sim |
| **Complexidade** | Baixa | Média | Média (mais serviços) |

### Quando usar o quê

- **Só desenvolver no seu PC:** `docker-compose.yml` (este projeto) ou Sail.
- **Quer Redis, Mailpit, etc. no dev:** Sail (`sail:install` e escolher os serviços).
- **Deploy em servidor (VPS, etc.):** `docker-compose.prod.yml` + `Dockerfile.prod`.

### Vantagens desta config em relação ao Sail (dev)

- Menos serviços (só app + MySQL), mais leve.
- Não depende do binário Sail; usa só `docker compose`.
- Fácil de customizar (um `docker-compose.yml` e um `Dockerfile`).

### Vantagens do Sail (dev)

- Ambiente padrão Laravel (versões de PHP, Node, etc. alinhadas).
- Serviços extras (Redis, Mailpit, Meilisearch) com um comando.
- Documentação e comunidade focadas em Sail.

---

## Melhorias em relação ao Sail (para produção)

A config de **produção** deste repo oferece o que o Sail não cobre:

1. **Nginx + PHP-FPM** em vez de `artisan serve`.
2. **Imagem otimizada:** multi-stage, `composer --no-dev`, OPcache.
3. **Sem volume de código** na app: deploy imutável, mais seguro.
4. **Arquivos estáticos** em `public/` servidos pelo Nginx (incluindo build do Vite).
5. **Pronta para deploy** em qualquer host com Docker (VPS, EC2, etc.), sem usar Sail em produção.

Resumo: para **dev** você pode usar tanto esta config quanto o Sail; para **produção** use apenas `docker-compose.prod.yml` + `Dockerfile.prod`, não o Sail nem o `docker-compose.yml` de desenvolvimento.
