# Communication Protocol — 通信プロトコル詳細

> Agent間の通信方式、メッセージフォーマット、ルーティングの完全定義

---

## 通信アーキテクチャ概観

```
┌─────────────────────────────────────────────────────┐
│                  Event Bus (全体通知)                  │
│  Topic: kpi.alert | system.config | agent.lifecycle  │
└─────┬──────────┬──────────┬──────────┬──────────┬───┘
      │          │          │          │          │
  ┌───┴───┐  ┌──┴──┐  ┌───┴───┐  ┌──┴──┐  ┌───┴───┐
  │Sensory│  │Cortex│  │ Motor │  │Limbic│  │ I/F   │
  │ Layer │  │Layer │  │ Layer │  │Layer │  │ Layer │
  └───┬───┘  └──┬──┘  └───┬───┘  └──┬──┘  └───┬───┘
      │         │         │         │         │
      └─────────┴─────────┴─────────┴─────────┘
                          │
                   ┌──────┴──────┐
                   │ Task Queue  │ ← 層間タスク委任
                   │ (async)     │
                   └──────┬──────┘
                          │
                   ┌──────┴──────┐
                   │   Memory    │ ← 共有記憶（間接通信）
                   │   Layer     │
                   └─────────────┘
```

---

## 4つの通信パターン

### Pattern 1: Event Bus（イベントバス）

**用途:** 組織全体への非同期ブロードキャスト通知

```
技術実装: Apache Kafka / NATS JetStream
特性:     Pub/Sub型、永続化、リプレイ可能
レイテンシ: < 100ms
```

#### トピック体系

```
neural-org/
├── kpi/
│   ├── alert        # KPI閾値超過アラート
│   ├── snapshot     # 定期KPIスナップショット
│   └── target       # 目標値変更
├── system/
│   ├── config       # 設定変更
│   ├── health       # ヘルスステータス
│   └── emergency    # 緊急通知
├── agent/
│   ├── lifecycle    # Agent起動・停止
│   ├── error        # Agentエラー
│   └── performance  # パフォーマンスメトリクス
├── task/
│   ├── created      # タスク生成
│   ├── completed    # タスク完了
│   └── failed       # タスク失敗
└── learning/
    ├── feedback     # 人間フィードバック
    ├── pattern      # 新規パターン発見
    └── improvement  # 改善提案
```

#### メッセージフォーマット

```json
{
  "event_id": "uuid",
  "topic": "neural-org/kpi/alert",
  "timestamp": "ISO-8601",
  "source": "t1.perception.event_detector",
  "priority": "high",
  "payload": {
    "kpi_id": "marketing.website_pv",
    "current_value": 9000,
    "threshold": 10000,
    "deviation": -10,
    "trend": "declining"
  },
  "correlation_id": "uuid",
  "ttl": 86400
}
```

### Pattern 2: Task Queue（タスクキュー）

**用途:** 層間の非同期タスク委任（Cortex → Motor → Limbic）

```
技術実装: Redis Streams / RabbitMQ
特性:     FIFO + 優先度キュー、ACK確認、デッドレター
レイテンシ: < 50ms
```

#### キュー体系

```
queues/
├── directives/         # Cortex → Motor（戦略指示）
│   ├── priority-P0     # 最優先
│   ├── priority-P1     # 高
│   ├── priority-P2     # 中
│   └── priority-P3     # 低
├── artifacts/          # Motor → Limbic（成果物提出）
│   └── review-pending
├── revisions/          # Limbic → Motor（差し戻し）
│   └── revision-required
├── approvals/          # Limbic → Output（承認済み）
│   └── deploy-ready
└── deadletter/         # 処理失敗メッセージ
```

#### タスクメッセージ

```json
{
  "task_id": "uuid",
  "queue": "directives/priority-P1",
  "created_at": "ISO-8601",
  "deadline": "ISO-8601",
  "source_agent": "t3.strategy.marketing",
  "target_cluster": "t4.marketing",
  "task_type": "content_creation",
  "payload": {
    "directive_id": "uuid",
    "objective": "X(Twitter)投稿を3本作成",
    "constraints": { "tone": "casual", "max_chars": 280 },
    "memory_context": ["episodic_ref_1", "semantic_ref_2"]
  },
  "retry_policy": {
    "max_retries": 3,
    "backoff": "exponential",
    "deadletter_after": 3
  }
}
```

### Pattern 3: Direct Message（ダイレクトメッセージ）

**用途:** 同一Cluster内、または隣接Agent間の低レイテンシ通信

```
技術実装: gRPC / WebSocket
特性:     Point-to-Point、同期/非同期選択可能
レイテンシ: < 10ms
```

#### ユースケース

| From | To | 用途 |
|------|-----|------|
| Cluster Lead | Worker | タスク割当 |
| Worker | Worker | 中間結果の共有 |
| Worker | Cluster Lead | 完了報告 |
| AI Critic | Execution Agent | 修正指示 |
| HITL Gateway | Human Interface | 承認要求 |

#### メッセージフォーマット

```json
{
  "message_id": "uuid",
  "from": "t4.marketing.lead",
  "to": "t4.marketing.content_writer.001",
  "type": "task_assignment|status_query|result_report|revision_request",
  "payload": { ... },
  "reply_to": "message_id or null",
  "timeout": 30000
}
```

### Pattern 4: Shared Memory（共有記憶）

**用途:** 長期的な知識共有、非同期の間接的通信

```
技術実装: Memory Layer (前章参照)
特性:     Agent間で記憶を介した間接通信
          タイムスタンプと信頼度による自然な情報の鮮度管理
```

#### パターン例

```
Marketing Strategist:
  → Semantic Memoryに「Q1の施策方針: SNS強化」を書き込み

Sales Strategist:
  → 「マーケティング方針」をSemantic Memoryから読み取り
  → 営業戦略をSNS連携方針と整合させる

※ 直接通信は不要。記憶を介して暗黙的に協調する。
```

---

## 外部通信プロトコル

### MCP（Model Context Protocol）

```
用途:     Agent → 外部ツールへのアクセス
方向:     一方向（Agentが能動的にツールを呼び出す）
実装:     MCP Server per tool
```

#### MCP Server 一覧

| Server | 提供ツール | 利用Agent |
|--------|---------|----------|
| `mcp-slack` | Slack API | Output Layer, Interface Layer |
| `mcp-github` | GitHub API | Engineering Cluster |
| `mcp-crm` | CRM操作 | Sales Cluster |
| `mcp-analytics` | GA4/Mixpanel | Metrics Collector |
| `mcp-email` | メール送受信 | Output Layer |
| `mcp-cms` | CMS操作 | Marketing Cluster |
| `mcp-erp` | 基幹システム | Finance/Operations Cluster |
| `mcp-calendar` | カレンダー | Operations Cluster |

### A2A（Agent-to-Agent Protocol）

```
用途:     外部組織のAIエージェントとの通信
方向:     双方向
実装:     A2A Server (Google A2A Protocol)
```

#### A2A通信フロー

```
自社 Partner Agent ←A2A→ 取引先 Partner Agent

1. Capability Discovery（能力発見）
   自社: 「あなたは何ができますか？」
   取引先: 「在庫照会、発注受付、納期回答ができます」

2. Task Invocation（タスク呼び出し）
   自社: 「製品Xを100個発注したい」
   取引先: 「承知しました。納期は2週間後です」

3. Status Tracking（進捗追跡）
   自社: 「発注#123の状況は？」
   取引先: 「出荷済み。追跡番号: ABC123」
```

---

## ルーティングルール

### 優先度ベースルーティング

```
P0 (Critical): 即時処理。全てのキューをバイパスして直接配信。
P1 (High):     優先キューで処理。10分以内に着手。
P2 (Medium):   標準キューで処理。1時間以内に着手。
P3 (Low):      バッチ処理可。日次で処理。
```

### データ型ベースルーティング

```
KPI Alert (quantitative) → Event Bus → Cortex Layer (CEO/Domain Strategist)
Customer Feedback (qualitative) → Task Queue → Support Cluster
Human Directive (imperative) → Direct Message → Target Agent
Market Signal (informational) → Event Bus → Cortex Layer
```

### 障害時ルーティング

```
通常: Agent A → Agent B
障害: Agent A → DeadLetter Queue → Alert to Health Monitor → Retry/Escalate
3回失敗: DeadLetter → Human Notification (HITL Gateway)
```

---

## 通信の観測可能性

### トレーシング

全通信にはDistributed Tracingを適用：

```json
{
  "trace_id": "uuid",
  "span_id": "uuid",
  "parent_span_id": "uuid or null",
  "operation": "task_assignment",
  "service": "t4.marketing.lead",
  "timestamp": "ISO-8601",
  "duration_ms": 45,
  "status": "ok|error",
  "tags": {
    "task_type": "content_creation",
    "priority": "P1"
  }
}
```

### メトリクス

| メトリクス | 説明 | アラート閾値 |
|-----------|------|------------|
| msg_throughput | メッセージ処理量/秒 | - |
| msg_latency_p95 | 95%tile配信レイテンシ | > 5s |
| queue_depth | キュー待機数 | > 1000 |
| deadletter_count | DLQ蓄積数 | > 10 |
| consumer_lag | コンシューマ遅延 | > 60s |

---

*次のドキュメント:* `05-governance.md` — ガバナンスフレームワーク
