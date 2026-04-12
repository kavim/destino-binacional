## Guia rápido para devs iniciantes

Este documento é um complemento do `README.md`, escrito pensando em quem está começando.  
Foca em **o que você precisa rodar** e **por que está rodando**.

---

## 1. Visão geral do projeto

- **Backend**: Laravel (PHP) rodando dentro de um container Docker (`app`).
- **Banco principal**: MySQL 8 em outro container (`mysql`).
- **Frontend**: React + TypeScript + Vite, rodando na sua máquina com Node/npm.
- **Testes frontend**: Vitest.

Você quase sempre vai trabalhar com **dois mundos**:

1. **Docker** (PHP, Laravel, MySQL, phpMyAdmin).  
2. **Node/npm** (React, TypeScript, build, lint).

---

## 2. Primeiro setup do projeto

Siga esta ordem na primeira vez:

```bash
# 1. Clonar o repositório
git clone git@github.com:kavim/destino-binacional.git
cd destino-binacional

# 2. Subir os containers (Laravel + MySQL + phpMyAdmin)
docker compose up -d

# 3. Instalar dependências do backend (dentro do container app)
docker compose exec app composer install

# 4. Instalar dependências do frontend (na sua máquina)
npm install

# 5. Criar o arquivo .env do Laravel
docker compose exec app cp .env.example .env

# 6. Gerar APP_KEY do Laravel
docker compose exec app php artisan key:generate

# 7. Criar estrutura do banco com dados iniciais
docker compose exec app php artisan migrate --seed

# 8. Fazer um build inicial do frontend
npm run build
```

Depois disso, o sistema já deve abrir em `http://localhost:8000`.

---

## 3. Entendendo o `.env` e os bancos

O Laravel lê toda a configuração do arquivo `.env` (dentro do container).  
Quando você roda:

```bash
docker compose exec app cp .env.example .env
```

ele copia um modelo pronto com as configurações básicas.  
No Docker, as variáveis de banco (`DB_HOST`, `DB_USERNAME`, etc.) já estão preparadas para apontar para o container `mysql`.

Se algo de banco “não conecta”, geralmente é um destes problemas:

- **Containers não estão de pé** → rode `docker compose up -d`.
- **Migrations não foram executadas** → rode `docker compose exec app php artisan migrate --seed`.
- **`.env` faltando ou sem APP_KEY** → rode os comandos de cópia e `php artisan key:generate` de novo.

---

## 4. Como rodar o sistema para desenvolvimento

Sempre que for desenvolver, normalmente você faz:

```bash
# 1. Subir backend + banco
docker compose up -d

# 2. Rodar servidor de frontend com hot reload
npm run dev
```

Com isso:

- **Backend Laravel** fica acessível em `http://localhost:8000`.
- **Frontend** recompila sozinho quando você salva arquivos `.tsx`/`.ts`.

Se quiser parar tudo depois:

```bash
docker compose down      # derruba serviços Docker
Ctrl + C                 # no terminal onde está rodando npm run dev
```

---

## 5. Comandos importantes de qualidade de código

### 5.1 `npm run lint`

Definido no `package.json` como:

```json
"lint": "eslint resources/js --ext .ts,.tsx"
```

O que faz:

- Roda o **ESLint** em todos os arquivos `.ts` e `.tsx` dentro de `resources/js`.
- Procura problemas de estilo e possíveis bugs de JavaScript/TypeScript.

Quando usar:

- Antes de abrir PR.
- Quando fizer uma mudança maior em componentes React.

Como rodar:

```bash
npm run lint
```

Se aparecerem erros:

- Leia a mensagem do terminal (sempre diz o arquivo e a linha).
- Ajuste o código onde ele apontar e rode o comando de novo.

---

### 5.2 `npx tsc --noEmit`

O projeto usa **TypeScript** com a configuração em `tsconfig.json`.  
O comando:

```bash
npx tsc --noEmit
```

O que faz:

- Roda o compilador TypeScript **apenas para checar tipos**.
- `--noEmit` significa: **não gerar arquivos JS**, só validar.

Por que é útil:

- Garante que não há erros de tipo (props erradas, retornos errados, etc.).
- Pega muitos problemas que o ESLint não vê.

Quando usar:

- Antes de subir código para produção.
- Quando mexer em types compartilhados ou componentes mais complexos.

Se der erro:

- O terminal lista arquivo, linha e mensagem (por exemplo: tipo incompatível).
- Corrija os tipos e rode de novo.

---

### 5.3 `npm run build`

Definido no `package.json` como:

```json
"build": "vite build"
```

O que faz:

- Usa o **Vite** para gerar uma versão otimizada dos assets do frontend:
  - Minifica o JavaScript.
  - Otimiza CSS.
  - Gera arquivos para produção (normalmente em `public/build` via Laravel Vite).

Quando usar:

- Em produção (deploy).
- Localmente, para garantir que o projeto **compila sem erros**.

Como rodar:

```bash
npm run build
```

Se der erro de build:

- Leia a mensagem (normalmente aponta para um componente específico).
- Erros comuns:
  - Import faltando (`Cannot find module ...`).
  - Erros de TypeScript não resolvidos.
  - Uso de APIs do navegador em local errado (por exemplo, fora de ambiente browser).

---

## 6. Ordem sugerida de checagens antes de subir código

Quando for subir algo (PR/deploy), siga esta sequência:

```bash
npm run lint          # checar estilo e possíveis bugs
npx tsc --noEmit      # checar tipos
npm run test          # frontend (Vitest) quando fizer mudanças de UI
docker compose exec app php artisan test   # backend (PHPUnit)
npm run build         # garantir que o build de produção passa
```

Se todos passarem, as chances de quebrar algo em produção caem bastante.

---

## 7. Problemas comuns e como checar rápido

- **Página não abre / erro 500**:
  - Ver logs do Laravel:
    ```bash
    docker compose logs -f app
    ```
- **Erro de banco de dados**:
  - Confirme se o container do MySQL está rodando:
    ```bash
    docker compose ps
    ```
  - Confirme se rodou migrations:
    ```bash
    docker compose exec app php artisan migrate
    ```
- **Erro só no frontend (tela em branco / erro no console)**:
  - Abra o DevTools do navegador (F12) → aba **Console**.
  - Veja se o `npm run dev` está mostrando algum erro no terminal.

Se algo não fizer sentido, volte para este arquivo e confira a ordem dos passos.

