---
name: spec-driven
description: >-
  Spec-driven development for destino-binacional. Use when starting a new
  feature, behavior change, multi-file refactor, or when the user mentions
  spec, specification, SDD, or acceptance criteria. Requires a spec in specs/
  before non-trivial implementation.
---

# Spec-Driven Development

## Quando aplicar

- Feature nova, mudança de comportamento, refactor >1 arquivo, bug com causa incerta.
- **Não** aplicar: typo, copy, fix óbvio de uma linha.

## Fluxo

1. Verificar `specs/` — spec existe para esta tarefa?
2. **Não** → criar `specs/NNN-slug.md` a partir de [specs/_template.md](../../../specs/_template.md).
3. Preencher Contexto + Critérios de aceite; `status: draft`.
4. Só codar com `status: approved` ou aprovação explícita do usuário.
5. Durante impl: `status: in-progress`; ao fim: marcar ACs, `status: done`, atualizar índice em [specs/README.md](../../../specs/README.md).

## Formato da spec (mínimo)

```markdown
---
id: 003
title: Filtro de tours por categoria
status: approved
---

## Contexto
…

## Critérios de aceite
- [ ] AC1: …

## Abordagem técnica
(tabela curta)

## Arquivos (previstos)
```

## Regras do agente

- Implementar **só** o que a spec cobre; escopo extra → nova spec ou seção "Fora de escopo".
- Cada AC deve ser verificável (teste ou passo manual na spec).
- PR/commit: referenciar `specs/NNN-….md`.

## Referência

- [specs/README.md](../../../specs/README.md)
- [AGENTS.md](../../../AGENTS.md)
