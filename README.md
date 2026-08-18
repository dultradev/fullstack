# <img src="https://cdn.simpleicons.org/apachekafka/231F20/white" height="32" align="center" /> Apache Kafka — Benchmark & Relatório de Engenharia


![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
<img src="https://cdn.simpleicons.org/apachekafka/white" alt="Apache Kafka Logo" width="40" height="40" />
<img src="https://cdn.simpleicons.org/apachekafka/white" alt="Apache Kafka" width="40" height="40" />
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-00000000?style=for-the-badge&logo=apachekafka&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/-%20-00000000?style=flat&logo=apachekafka&logoColor=white)

[![Broker](https://img.shields.io/badge/Broker-Apache%20Kafka%20(KRaft)-black?style=for-the-badge&logo=apachekafka)](https://kafka.apache.org/)
[![Python](https://img.shields.io/badge/Client-confluent--kafka%20(librdkafka)-blue?style=for-the-badge&logo=python)](https://github.com/confluentinc/confluent-kafka-python)
[![Docker](https://img.shields.io/badge/Environment-Docker%20Compose%20(2%20CPUs%20%7C%202GB%20RAM)-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Validation-100%25%20Passed-brightgreen?style=for-the-badge&logo=checkmarx)](https://github.com/)

Repositório dedicado à implementação, execução de benchmarks e análise arquitetural do **Apache Kafka** sob condições rigorosas de restrição de hardware, avaliando seu comportamento como espinha dorsal (*event bus*) corporativa em cenários de alta volumetria,Pub/Sub concorrente, roteamento e recuperação de desastres.

---

## 📌 Sumário
1. [Visão Geral & Topologia de Execução](#-visão-geral--topologia-de-execução)
2. [Matriz Consolidada de Resultados](#-matriz-consolidada-de-resultados)
3. [Destaques por Etapa de Benchmark](#-destaques-por-etapa-de-benchmark)
4. [Procedimentos Operacionais & Replay](#-procedimentos-operacionais--replay)
5. [Lições de Engenharia & Trade-offs](#-lições-de-engenharia--trade-offs)
6. [Decisão Arquitetural & Recomendação](#-decisão-arquitetural--recomendação)
7. [Estrutura do Repositório](#-estrutura-do-repositório)

---

## 🏗️ Visão Geral & Topologia de Execução

O benchmark foi executado em ambiente host único para garantir a consistência das medições de latência ponta a ponta (*wall-clock*), operando sobre contêiner Docker estritamente isolado:


```

```
                  [ Host: Single Machine Clock ]

```

+-----------------------------------------------------------------------+
|  [ Produtor ] (Payload Binário + Injeção de Trace ID / Epoch ms)      |
|       │                                                               |
|       ▼ (acks=all / Partition Key: entity_id)                         |
|  +─────────────────────────────────────────────────────────────────+  |
|  | Docker Container: kafka (apache/kafka:latest)                   |  |
|  | • Modo: KRaft (Single Node, sem ZooKeeper)                      |  |
|  | • Limites: 2.0 CPUs | 2.0 GB RAM                                |  |
|  | • JVM Heap: -Xmx896M -Xms896M | Log Retention: 7 dias / 1GB seg |  |
|  +─────────────────────────────────────────────────────────────────+  |
|       │                                                               |
|       ▼ (Manual Commit síncrono pós-agregação)                        |
|  [ Consumidores Paralelos ] (1 a 4 workers via Consumer Groups)       |
|       │                                                               |
|       ▼                                                               |
|  [ Harness de Agregação ] ──► [ Validador contra Gabaritos Oficiais ] |
+-----------------------------------------------------------------------+

```

### Diretrizes Centrais de Implementação
* **Produtor (`produtor.py`)**: Leitura NDJSON linha a linha com envio de payload binário exato (*zero-copy* de aplicação, sem `json.loads/dumps` redundantes). Headers nativos injetam `trace_id` (UUIDv4) e `ts_publicacao` (epoch ms).
* **Consumidor (`consumidor.py`)**: Confirmação manual estrita de offsets (`enable.auto.commit: false`), registrando cada entrega no `Agregador` antes de invocar o commit síncrono.
* **Harness & Auditoria**: Deduplicação global por `(entity_id, seq)`, verificação de integridade via digest SHA-256 acumulado e cálculo de percentis de latência via *nearest-rank*.

---

## 📊 Matriz Consolidada de Resultados

A tabela abaixo resume os dados oficiais obtidos em cada cenário avaliado contra os gabaritos da suíte de testes:

| Etapa / Cenário | Volume de Msgs | Vazão Publicação | Vazão Consumo | Latência p50 | Latência p99 | Disco / Memória | Ordem Violada | Perdas / RPO | Validador |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Etapa 1: Hello World** | 1 | Unitário | Unitário | < 2 ms | < 5 ms | Mínimo | 0 | 0 | **VALIDADO** |
| **Etapa 2: Work Queues (Oficial)** | 1.000.000 | 122.405 msg/s | 206.356 msg/s | 2.381 ms | 4.207 ms | ~320 MB | **0** | 0 | **VÁLIDO** |
| **Etapa 2: Sub-A (Sleep 30s c1)** | 1.000.000 | 120.538 msg/s | 29.621 msg/s | 2.976 ms | 32.710 ms | ~320 MB | **0** | 0 | **VÁLIDO** |
| **Etapa 3: Pub/Sub (G1-G3 Online)** | 1.000.000 | 100.267 msg/s | ~81.900 msg/s | 1.660 ms | 4.043 ms | 3.419 MB | **0** | 0 | **VÁLIDO** |
| **Etapa 3: Pub/Sub (G4 Tardio)** | 1.000.000 | N/A (Replay) | **263.644 msg/s** | 26.677 ms | 29.330 ms | *(Zero cópia)* | **0** | 0 | **VÁLIDO** |
| **Etapa 4: Routing (Cat == 'A')** | 249.762 *(útil)* | 129.155 msg/s | 39.246 msg/s | 10,20 ms | 1.346 ms | 329 MB *(rede)* | **0** | 0 | **VÁLIDO** |
| **Etapa 4: Routing (Status Canc.)** | 20.098 *(útil)* | 131.845 msg/s | 3.145 msg/s | 8,44 ms | 1.148 ms | 329 MB *(rede)* | **0** | 0 | **VÁLIDO** |
| **Etapa 5: Backlog Massivo** | 2.499.738 | 114.438 msg/s | 204.310 msg/s | 29.275 ms | 34.560 ms | 53,4% RAM | **0** | 0 | **VÁLIDO** |
| **Etapa 5: Sub-teste RPO=0** | 1.000.000 | 133.130 msg/s | 250.815 msg/s | 27.498 ms | 29.218 ms | Failover: 14,3s | **0** | **0 (RPO=0)** | **VÁLIDO** |
| **Etapa 5: Replay Histórico** | 1.000.000 | N/A (Replay) | 246.975 msg/s | 34.413 ms | 36.125 ms | Replay do log | **0** | 0 | **VÁLIDO** |

> [!NOTE]
> Todos os testes executados com `full.ndjson` geraram exatamente o digest SHA-256 `e855c15e316fa5bb`, e o teste com `backlog.ndjson` gerou `993468b52b0556c1`, comprovando a integridade determinística de ponta a ponta.

---

## 🔍 Destaques por Etapa de Benchmark

### Etapa 1 - Hello World

### 📊 Resultados Obtidos

| Item Avaliado | Resultado | Significado Prático |
| :--- | :---: | :--- |
| **Mensagens Enviadas / Lidas** | 1 / 1 | Comunicação estabelecida com sucesso. |
| **Offset Atribuído** | `0` | Mensagem persistida como o primeiro registro da partição. |
| **Extração de `trace_id`** | **100% íntegro** | Metadados recuperados com sucesso via headers nativos. |
| **Integridade do Payload** | **Idêntico** | Bytes originais preservados sem re-serialização. |

> [!NOTE]
> A Etapa 1 serviu como validação funcional de arquitetura: estabeleceu a baseline de que o cliente Python (`confluent-kafka`) conversa adequadamente com o KRaft e preserva rastreabilidade ponta a ponta.


### Etapa 2 — Work Queues & Resiliência a Consumidor Travado
* **Distribuição Determinística**:

### 📊 Resultados Obtidos

| Métrica / Parâmetro | Execução Padrão (1M msgs) | Sub-teste A (Sleep 30s no `c1`) |
| :--- | :---: | :---: |
| **Vazão de Publicação** | **122.405 msg/s** | 120.538 msg/s |
| **Vazão de Consumo Agregado** | **206.356 msg/s** (4,84 s total) | **29.621 msg/s** (33,76 s total) |
| **Latência p50 / p99** | **2,38 s / 4,20 s** | **2,97 s / 32,71 s** |
| **Violações de Ordem por Entidade** | **0** | **0** |
| **Duplicatas Descartadas** | 0 | 0 |
| **Digest SHA-256** | `e855c15e316fa5bb` (**VÁLIDO**) | `e855c15e316fa5bb` (**VÁLIDO**) |

O hashing da chave `entity_id` distribuiu os registros de 576 entidades de maneira perfeitamente balanceada entre as 4 partições, assegurando `ordem_por_trilha_violada = 0`.
* **Comportamento sob Falha (Sub-A)**: A injeção de uma pausa de 30s no consumidor `c1` reteve temporariamente a partição afetada. Assim que o *Group Coordinator* detectou a ausência de *heartbeat*, as partições foram reprocessadas sem duplicatas indevidas ou violação de sequência.

### Etapa 3 — Eficiência de Fan-Out & Consumidor Tardio (*Time-Travel*)

### 📊 Resultados Obtidos

| Assinante / Grupo | Papel no Cenário | Vazão de Consumo | Digest SHA-256 | Validação |
| :--- | :--- | :---: | :---: | :---: |
| **Grupo 1** | Assinante Online Simultâneo | 81.860 msg/s | `e855c15e316fa5bb` | **VÁLIDO** |
| **Grupo 2** | Assinante Online Simultâneo | 81.960 msg/s | `e855c15e316fa5bb` | **VÁLIDO** |
| **Grupo 3** | Assinante Online Simultâneo | 81.887 msg/s | `e855c15e316fa5bb` | **VÁLIDO** |
| **Grupo 4** | **Consumidor Tardio (Pós-envio)**| **263.644 msg/s** | `e855c15e316fa5bb` | **VÁLIDO** |

* **Zero Duplicação em Disco**: 4 grupos de consumidores independentes leram o mesmo milhão de mensagens sem multiplicar a ocupação de disco do broker por 4. O log imutável foi persistido uma única vez.
* **Consumidor Tardio (Grupo 4)**: Subiu após o término do produtor e drenou o tópico completo a **263.644 msg/s** (em apenas 3,79 s), aproveitando os dados residentes no *Page Cache* da máquina.

### Etapa 4 — Custo de Rede em Filtragem no Cliente (*Client-Side Filtering*)

### 📊 Resultados Obtidos

| Métrica / Parâmetro | Rodada 1 (`categoria == 'A'`) | Rodada 2 (`status == 'cancelado'`) |
| :--- | :---: | :---: |
| **Mensagens Publicadas** | 1.000.000 | 1.000.000 |
| **Mensagens Úteis (Aceitas)** | **249.762** (24,98%) | **20.098** (2,01%) |
| **Bytes Trafegados na Rede** | **~329,09 MB** (100%) | **~329,09 MB** (100%) |
| **Bytes Efetivamente Úteis** | **~80,02 MB** (24,98%) | **~6,61 MB** (2,01%) |
| **Desperdício de Banda / Descarte** | **~75,02% descartados** | **~97,99% descartados** |
| **Vazão Efetiva de Consumo** | 39.246 msg/s | 3.145 msg/s |
| **Digest SHA-256** | `c154a53cc06f86ba` (**VÁLIDO**) | `135ebc5fc4087e30` (**VÁLIDO**) |

* Como o Kafka não realiza filtragem por conteúdo no servidor, o broker enviou **100% dos bytes brutos (~329 MB)** pela rede em todas as rodadas.
* No filtro de status cancelado (~2% de seletividade), **~98% dos bytes trafegados foram descartados em memória pelo cliente**, evidenciando o custo de banda em cenários com consumidores de nicho.

### Etapa 5 — Absorção de Backlog Massivo, RPO=0 e Replay
* **Absorção de ~2,5M Mensagens**:

### 📊 Resultados Obtidos

| Métrica / Parâmetro | Cenário 1: Backlog Massivo | Cenário 2: Sub-teste RPO=0 | Cenário 3: Replay Histórico |
| :--- | :---: | :---: | :---: |
| **Dataset Avaliado** | `backlog.ndjson` (2.499.738 msgs) | `full.ndjson` (1.000.000 msgs) | `full.ndjson` (1.000.000 msgs) |
| **Vazão de Publicação** | **114.438 msg/s** | 133.130 msg/s | 127.213 msg/s |
| **Velocidade de Drenagem** | **204.310 msg/s** (12,23 s) | **250.815 msg/s** (3,98 s) | **246.975 msg/s** (4,04 s) |
| **Consumo de Memória do Broker** | **1,069 GiB / 2 GiB (53,4%)** | Nominal | Nominal |
| **Travamento do Produtor** | **Nenhum** (absorção 100%) | N/A | N/A |
| **Tempo de Failover (`failover_s`)** | N/A | **14,319 segundos** | N/A |
| **Mensagens Perdidas (`RPO`)** | **0** | **0 (RPO = 0 estrito)** | **0** |
| **Digest SHA-256** | `993468b52b0556c1` (**VÁLIDO**) | `e855c15e316fa5bb` (**VÁLIDO**) | `e855c15e316fa5bb` (**VÁLIDO**) |

O broker reteve 2.499.738 mensagens com os consumidores desligados utilizando apenas **53,45% da RAM disponível**, sem degradar a vazão de escrita (**114.438 msg/s** contínuos).
* **Resiliência a Crash (`docker kill`)**: Derrubado abruptamente via SIGKILL, o broker restabeleceu os serviços em **14,319 s** e recuperou 100% dos eventos confirmados com **`mensagens_perdidas = 0` (RPO = 0 estrito)**.

---

## 🔁 Procedimentos Operacionais & Replay

### Execução dos Testes Automatizados

```bash
# Permissões de execução
chmod +x *.sh *.py

# 1. Execução padrão das Work Queues (Etapa 2)
./executar_etapa2.sh

# 2. Execução Pub/Sub com Consumidor Tardio (Etapa 3)
./executar_etapa3.sh

# 3. Execução dos Filtros de Roteamento (Etapa 4)
./executar_etapa4.sh

# 4. Execução de Backlog Massivo (Etapa 5)
./executar_etapa5_backlog.sh

```

### Procedimento de Reset de Offset & Replay Histórico

Para reprocessar todo o fluxo de eventos de um grupo a partir do offset `0`:

```bash
# 1. Certifique-se de que os consumidores do grupo estejam pausados/desligados
# 2. Execute o reset dos ponteiros no broker:
docker exec kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group grupo-replay \
  --topic replay-full \
  --reset-offsets --to-earliest --execute

```

**Saída esperada:**

```text
GROUP           TOPIC           PARTITION  NEW-OFFSET
grupo-replay    replay-full     0          0
grupo-replay    replay-full     1          0
grupo-replay    replay-full     2          0
grupo-replay    replay-full     3          0

```

---

## 💡 Lições de Engenharia & Trade-offs

### O que configuramos & otimizamos

* **Ajuste Fino de Memória JVM**: Em contêineres restritos a 2 GB, a JVM foi fixada em `-Xmx896M -Xms896M` para deixar espaço livre para a memória nativa da JVM e o *Page Cache* do kernel Linux, prevenindo eventos de `OOMKilled (Exit 137)`.
* **Controle de Buffer e Backpressure**: O `librdkafka` no produtor foi parametrizado com `queue.buffering.max.messages: 50000` e tratamento explícito de `BufferError` via `poll()`, evitando saturação da fila local em testes de retenção.

### O que deu trabalho durante o desenvolvimento

1. **Estabilização de Consumer Groups**: Ao inicializar 12 consumidores em paralelo (Etapa 3), rajadas imediatas de publicação antes da estabilização das atribuições pelo coordenador causavam revogação de partições no meio do consumo. A introdução de um intervalo de estabilização e adoção da estratégia `cooperative-sticky` eliminou rebalances espúrios.
2. **Commit sem Offset Armazenado (`_NO_OFFSET`)**: Tratamento defensivo no fechamento de consumidores ociosos que não receberam partições para evitar falhas no `consumer.commit()`.

### O que surpreendeu positivamente

* **Throughput de Leitura Sequencial**: O consumo de backlog e replay atingiu taxas superiores a **250.000 msg/s** de forma sustentada em um contêiner limitado a apenas 2 vCPUs.
* **Imutabilidade do Commit Log**: A capacidade de realizar múltiplos *replays* determinísticos e plugar novos assinantes sem duplicar o consumo de disco ou impactar o produtor.

---

## ⚖️ Decisão Arquitetural & Recomendação

### Comparativo de Sinais de Alto Peso

```
+──────────────────────────────+───────────────────────────────+───────────────────────────────+
| Sinal Arquitetural           | Apache Kafka                  | RabbitMQ                      |
+──────────────────────────────+───────────────────────────────+───────────────────────────────+
| Garantia Estrita de Ordem    | Alta (Particionamento Chave)  | Limitada sob Redelivery       |
| Absorção de Backlog Massivo  | Excelente (O(1) no Page Cache)| Degradação sob Filas Longas   |
| Múltiplos Assinantes (Disco) | Armazenamento Único (O(1))    | Multiplica por Fila (O(N))    |
| Replay / Time-Travel         | Nativo via Reset de Offsets   | Inexistente (Fila destrutiva) |
| Roteamento no Servidor       | Inexistente (Filtro Borda)    | Nativo e Altamente Eficiente  |
+──────────────────────────────+───────────────────────────────+───────────────────────────────+

```

> [!IMPORTANT]
> **Recomendação Final: Apache Kafka**
> Para o cenário de **Barramento Interno de Eventos**, o **Apache Kafka** é a tecnologia recomendada. A preservação estrita de ordem por entidade (`entity_id`), a capacidade de suportar backlogs massivos sem exaustão de memória e o suporte nativo a *Replay Histórico* e *Event Sourcing* superam o trade-off do overhead de rede em filtragens pontuais.

---

## 📂 Estrutura do Repositório

```text
.
├── docker-compose.yml           # Infraestrutura Kafka em modo KRaft isolado
├── config.json                  # Parâmetros de durabilidade, batching e partições
├── produtor.py                  # Produtor de alta vazão com headers de rastreabilidade
├── consumidor.py                # Consumidor com commit manual e integração ao harness
├── consumidor_filtro.py         # Consumidor para testes de roteamento (Etapa 4)
├── harness.py                   # Motor compartilhado de agregação, dedup e métricas
├── validador.py                 # Validador oficial de conformidade contra gabaritos
├── subteste_versionamento.py    # Validador de evolução de payload (v1 x v2)
├── *.sh                         # Scripts de orquestração automatizada por etapa
└── dados/                       # Datasets NDJSON, gabaritos e checksums SHA-256

```

