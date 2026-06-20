---
name: agent-workflow
description: >-
  Operating procedures for AI agents in destino-binacional. Use when unsure how
  to approach a task, how to save tokens, or how this repo expects agents to
  work. Read AGENTS.md first.
---

# Agent Workflow — Destino Binacional

## Boot sequence (toda sessão)

1. Ler [AGENTS.md](../../../AGENTS.md) se ainda não no contexto.
2. Identificar tipo de tarefa → carregar skill certa:
   - Código → `destino-binacional`
   - Feature/comportamento → `spec-driven` primeiro
   - Resposta curta ao user → `caveman` (opt-in)
3. Busca **dirigida** (Grep/SemanticSearch com path), não varrer repo inteiro.

## Economia de tokens (operação)

| Fazer | Evitar |
|-------|--------|
| Tool calls paralelos independentes | Ler mesmo arquivo 2x |
| Grep com path/glob | `find` + ler tudo |
| Diff mínimo focado | Refactor "de brinde" |
| Parar quando AC da spec passa | Explorar código adjacente |
| `head_limit` em buscas amplas | Dump de logs/build |

## Implementação

```
spec approved → ler arquivos tocados → editar → lint/test/pint → atualizar spec
```

Branches: `feature/…`, `fix/…`, `chore/…`, `docs/…` — nunca commit direto em `main`.

## Comunicação com usuário

- **Padrão:** claro, completo, proporção à complexidade (regras globais do Cursor).
- **Caveman (opt-in):** `/caveman` ou pedido "menos tokens" → skill `caveman`.
- Código/commits/PRs: sempre linguagem normal e precisa.

## Checklist pré-PR

- [ ] Spec `done` (se aplicável)
- [ ] `npm run lint` + `npm run test` (JS alterado)
- [ ] `pint` + `php artisan test` (PHP alterado)
- [ ] Sem secrets em diff
