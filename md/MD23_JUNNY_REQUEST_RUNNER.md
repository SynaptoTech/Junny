# MD23 — Junny Request Runner + Collections Execution

# Objetivo

Este MD define:
- request runner
- execução collections
- chaining requests
- variáveis dinâmicas
- workflows
- automação básica
- execução sequencial

---

# Objetivo Estratégico

O Runner transformará o Junny em:

# plataforma de automação leve

e não apenas:
# executor manual APIs

---

# Objetivo do Runner

Permitir:

- executar collections inteiras
- automatizar requests
- chaining requests
- variáveis dinâmicas
- testes futuros

---

# Fluxo Principal

Usuário:

1. cria collection
2. adiciona requests
3. executa collection inteira
4. acompanha resultados

---

# Estrutura Visual

Adicionar botão:

```text
Run Collection
```

---

# Layout Planejado

```text
------------------------------------------------
Collection Runner
------------------------------------------------
Execution Timeline
------------------------------------------------
Logs / Results
------------------------------------------------
```

---

# Execução Sequencial

Inicialmente:

```text
Request 1
↓
Request 2
↓
Request 3
```

---

# Variáveis Dinâmicas

Permitir futuramente:

```text
{{authToken}}
{{response.userId}}
```

---

# Chaining

Preparar arquitetura para:

```text
Request A response
↓
Request B variables
```

---

# Runner Timeline

Visualizar:

- requests executadas
- status
- duração
- erros
- logs

---

# Status Visual

## Success
Verde

## Running
Azul

## Failed
Vermelho

---

# Execução

Permitir:

- run all
- stop execution
- rerun failed

---

# Logs

Exibir:

- request
- response
- status
- duration

---

# Estrutura Frontend

```text
/features/runner
```

---

# Componentes Necessários

Criar:

- CollectionRunner
- RunnerTimeline
- RunnerLogs
- ExecutionStatus
- RunnerToolbar

---

# Estrutura Backend

Criar módulo:

```text
/modules/runner
```

---

# Estrutura Recomendada

```text
/modules/runner
  /services
  /executors
  /dto
```

---

# Persistência

Salvar:

- execuções
- status
- logs futuros

---

# Banco

Criar tabela futura:

```text
RunnerExecutions
```

---

# Performance

Runner deverá:
- executar rapidamente
- evitar travamentos
- permitir múltiplas requests

---

# UX Requirements

A experiência deverá ser:

- extremamente visual
- moderna
- limpa
- intuitiva

---

# Tema

Seguir:
# dark-first

Mesmo padrão do sistema.

---

# Delay Future

Preparar arquitetura para:

```text
Wait 1000ms
```

---

# Conditions Future

Preparar arquitetura para:

```text
If status == 200
```

---

# Objetivo Estratégico

O Runner será:
# ponte para automações futuras

---

# Futuro

Preparar arquitetura para:

- workflows
- conditions
- loops
- schedules
- cron jobs

---

# Test Assertions (Futuro)

Preparar arquitetura para:

```text
Expect status 200
```

---

# Variables Runtime

Preparar runtime variables:

```text
{{timestamp}}
{{random}}
```

---

# NÃO implementar inicialmente

❌ cron jobs
❌ distributed execution
❌ cloud runners
❌ AI workflows

---

# Objetivo do MVP Runner

Entregar:

- executar collections
- timeline execução
- logs básicos
- status visual
- stop execution

---

# Objetivo do MD23

Definir:

- request runner
- execution flow
- collections automation
- base workflows do Junny
