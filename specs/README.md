# Spec-Driven Development

Toda mudança **não trivial** começa com um arquivo em `specs/` **antes** do código.

## Quando criar spec

| Criar spec | Pular spec |
|------------|------------|
| Nova feature | Typo, copy, cor |
| Mudança de API/contrato | Fix one-liner óbvio |
| Refactor multi-arquivo | Ajuste de lint pontual |
| Bug com causa incerta | |

## Nomenclatura

```
specs/NNN-slug-curto.md
```

- `NNN` — número sequencial com 3 dígitos (`001`, `002`, …)
- `slug` — kebab-case, inglês ou português consistente no repo

Exemplo: `specs/003-tour-filtro-categoria.md`

## Workflow

1. Copiar [`_template.md`](_template.md) → `specs/NNN-nome.md`
2. Preencher **Contexto** e **Critérios de aceite** (obrigatórios)
3. Marcar `status: draft` → `approved` (humano ou explícito na conversa)
4. Agente implementa; atualiza **Arquivos** e `status: done`
5. PR referencia a spec: `Spec: specs/003-….md`

## Status

| Status | Significado |
|--------|-------------|
| `draft` | Em elaboração |
| `approved` | Pronto para implementação |
| `in-progress` | Agente/dev codando |
| `done` | Critérios atendidos + testes ok |
| `cancelled` | Descartado |

## Índice

Manter lista atualizada nesta seção:

| Spec | Título | Status |
|------|--------|--------|
| — | _(nenhuma ainda)_ | — |
