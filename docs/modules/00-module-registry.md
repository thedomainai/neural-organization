# Module Registry — 全モジュール一覧

> Neural Organization v2.0 に含まれる全モジュールの索引

---

## 全モジュール一覧

### Layer 0: Autonomic Layer（5モジュール）

| ID | モジュール名 | Type | 詳細 |
|----|------------|------|------|
| `t0.infra.lifecycle_manager` | Lifecycle Manager | Singleton | Agent生成・監視・終了・再起動 |
| `t0.infra.health_monitor` | Health Monitor | Singleton | 全層ヘルスメトリクス収集・異常検知 |
| `t0.infra.resource_governor` | Resource Governor | Singleton | 計算資源・コスト・レート制限管理 |
| `t0.infra.security_controller` | Security Controller | Singleton | アクセス制御・秘密管理・脅威検知 |
| `t0.infra.config_manager` | Config Manager | Singleton | 全Agent設定の中央管理 |

### Layer 1: Sensory Layer（6モジュール）

| ID | モジュール名 | Type | 詳細 |
|----|------------|------|------|
| `t1.perception.market_sensor` | Market Sensor | Singleton | 市場・競合データの収集 |
| `t1.perception.customer_listener` | Customer Listener | Singleton | 顧客接点からのフィードバック収集 |
| `t1.perception.internal_aggregator` | Internal Aggregator | Singleton | 社内データの統合 |
| `t1.perception.metrics_collector` | Metrics Collector | Singleton | KPI定量データの収集 |
| `t1.perception.event_detector` | Event Detector | Singleton | 異常検知・アラート生成 |
| `t1.perception.human_instruction_receiver` | Human Instruction Receiver | Singleton | 人間からの直接指示受信 |

### Layer 2: Memory Layer（4モジュール + 5ストア）

| ID | モジュール名 | Type | 詳細 |
|----|------------|------|------|
| `t2.memory.knowledge_curator` | Knowledge Curator | Singleton | Semantic Memory品質維持 |
| `t2.memory.context_manager` | Context Manager | Singleton | Working Memoryライフサイクル管理 |
| `t2.memory.recall_agent` | Recall Agent | Scalable | 関連記憶の検索・想起 |
| `t2.memory.learning_synthesizer` | Learning Synthesizer | Singleton | パターン抽出・知識統合 |

**Memory Stores:**

| Store | 技術 | 用途 |
|-------|------|------|
| Semantic Memory | Neo4j + GraphRAG | 恒久的知識 |
| Episodic Memory | Graphiti (Temporal KG) | 経験・出来事 |
| Working Memory | Redis Cluster | 現在の状態 |
| Procedural Memory | PostgreSQL + JSONB | 手順・ワークフロー |
| Evaluative Memory | TimescaleDB | KPI・メトリクス |

### Layer 3: Cortex Layer（12モジュール）

| ID | モジュール名 | Type | 詳細 |
|----|------------|------|------|
| `t3.strategy.ceo` | CEO Agent | Singleton | 全社戦略・方向性決定 |
| `t3.strategy.hr` | HR Strategist | Singleton | 人材戦略 |
| `t3.strategy.finance` | Finance Strategist | Singleton | 財務戦略 |
| `t3.strategy.marketing` | Marketing Strategist | Singleton | マーケティング戦略 |
| `t3.strategy.sales` | Sales Strategist | Singleton | 営業戦略 |
| `t3.strategy.engineering` | Engineering Strategist | Singleton | 技術戦略 |
| `t3.strategy.legal` | Legal Strategist | Singleton | 法務戦略 |
| `t3.strategy.operations` | Operations Strategist | Singleton | 業務戦略 |
| `t3.strategy.support` | Support Strategist | Singleton | CS戦略 |
| `t3.strategy.resource_allocator` | Resource Allocator | Singleton | リソース最適配分 |
| `t3.strategy.risk_assessor` | Risk Assessor | Singleton | リスク評価 |
| `t3.strategy.okr_manager` | OKR Manager | Singleton | OKR/KGI管理・進捗追跡 |

### Layer 4: Motor Layer（8クラスタ × Lead + Workers）

| Cluster ID | クラスタ名 | Lead Agent | Worker Types |
|-----------|----------|-----------|-------------|
| `t4.hr` | HR Cluster | HR Lead | Recruiter, Evaluator, Trainer, Onboarder |
| `t4.finance` | Finance Cluster | Finance Lead | Accountant, Budgeter, Auditor, Forecaster |
| `t4.marketing` | Marketing Cluster | Marketing Lead | Content Writer, SEO, SNS Manager, Designer |
| `t4.sales` | Sales Cluster | Sales Lead | Prospector, Negotiator, Closer, Account Mgr |
| `t4.engineering` | Engineering Cluster | Eng Lead | Developer, Reviewer, DevOps, Architect |
| `t4.legal` | Legal Cluster | Legal Lead | Contract Drafter, Compliance Checker, IP Manager |
| `t4.operations` | Operations Cluster | Ops Lead | Process Manager, Scheduler, Procurement |
| `t4.support` | Support Cluster | Support Lead | Responder, Escalator, KB Author, Analyst |

### Layer 5: Limbic Layer（5モジュール）

| ID | モジュール名 | Type | 詳細 |
|----|------------|------|------|
| `t5.evaluation.critic.*` | AI Critic Network | Per-domain (8) | ドメイン別品質評価 |
| `t5.evaluation.compliance_guardian` | Compliance Guardian | Singleton | 法務・規制チェック |
| `t5.evaluation.quality_auditor` | Quality Auditor | Singleton | 最終品質検証 |
| `t5.evaluation.hitl_gateway` | HITL Gateway | Singleton | 人間エスカレーション管理 |
| `t5.evaluation.learning_feedback` | Learning Feedback Router | Singleton | 評価結果の学習層への配信 |

### Layer 6: Output Layer（8モジュール）

| ID | モジュール名 | Type | 詳細 |
|----|------------|------|------|
| `t6.output.channel_router` | Channel Router | Singleton | 配信先決定 |
| `t6.output.slack_publisher` | Slack Publisher | Singleton | Slack配信 |
| `t6.output.cms_publisher` | CMS Publisher | Singleton | CMS記事公開 |
| `t6.output.code_deployer` | Code Deployer | Singleton | コードデプロイ |
| `t6.output.email_sender` | Email Sender | Singleton | メール送信 |
| `t6.output.sns_publisher` | SNS Publisher | Singleton | SNS投稿 |
| `t6.output.document_publisher` | Document Publisher | Singleton | ドキュメント保存 |
| `t6.output.erp_integrator` | ERP Integrator | Singleton | 基幹システム更新 |

### Layer 7: Interface Layer（4モジュール）

| ID | モジュール名 | Type | 詳細 |
|----|------------|------|------|
| `t7.interface.customer_agent` | Customer Agent | Scalable | 顧客対応AI |
| `t7.interface.partner_agent` | Partner Agent | Scalable | B2Bエージェント間通信 |
| `t7.interface.channel_publisher` | Channel Publisher | Singleton | マルチチャネル配信 |
| `t7.interface.public_relations` | PR Agent | Singleton | 対外情報発信管理 |

---

## 統計

| 項目 | 数 |
|------|-----|
| 総Layer数 | 8 (Layer 0-7) |
| 総モジュール数 | 56 |
| Singleton Agent | 42 |
| Scalable Agent | 14+ |
| Memory Store | 5 |
| 外部プロトコル | 2 (MCP, A2A) |
| 内部通信パターン | 4 (Event Bus, Task Queue, Direct Message, Shared Memory) |

---

*詳細仕様は各モジュールの個別ドキュメントを参照。*
