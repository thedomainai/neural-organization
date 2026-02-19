# Memory Architecture — 記憶アーキテクチャ詳細

> 組織の全知識・経験・文脈を構造化して保持する5種類の記憶システムの技術仕様

---

## 設計思想

人間の脳は単一の「記憶装置」ではなく、複数の記憶システムが協調して動作している。
Neural Organizationも同様に、**用途に最適化された5種類の記憶**を持つ。

```
┌─────────────────────────────────────────────────────────┐
│                    Memory Layer                          │
│                                                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│  │ Semantic   │  │ Episodic  │  │ Working   │           │
│  │ Memory     │  │ Memory    │  │ Memory    │           │
│  │            │  │           │  │           │           │
│  │ Knowledge  │  │ Temporal  │  │ In-Memory │           │
│  │ Graph      │  │ KG        │  │ Store     │           │
│  │ (Neo4j)    │  │ (Graphiti)│  │ (Redis)   │           │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘           │
│        │              │              │                  │
│        └──────────────┼──────────────┘                  │
│                       │                                 │
│              ┌────────┴────────┐                        │
│              │  Unified Query  │ ← 統一検索インターフェース │
│              │  Interface      │                        │
│              └────────┬────────┘                        │
│                       │                                 │
│  ┌───────────┐  ┌────┴──────┐                          │
│  │ Procedural│  │ Evaluative│                          │
│  │ Memory    │  │ Memory    │                          │
│  │           │  │           │                          │
│  │ Workflow  │  │ TimeSeries│                          │
│  │ DB        │  │ DB        │                          │
│  └───────────┘  └───────────┘                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Semantic Memory（意味記憶）

### 概要
組織の恒久的な知識を保持する。事実、概念、関係性、ルールなど、
「**組織が知っていること**」全てがここに蓄積される。

### 技術実装

```
Backend:  Neo4j (Graph Database)
Search:   GraphRAG (Vector + Graph Traversal Hybrid)
Embedding: text-embedding-3-large (1536次元)
```

### スキーマ

#### ノードタイプ

| ノード | 説明 | プロパティ例 |
|--------|------|------------|
| `Organization` | 自社・取引先 | name, industry, size |
| `Person` | 従業員・顧客・連絡先 | name, role, department |
| `Product` | 製品・サービス | name, version, status |
| `Concept` | ドメイン知識 | term, definition, domain |
| `Rule` | 業務ルール・ポリシー | rule_text, scope, effective_date |
| `Document` | ドキュメント参照 | title, url, summary |
| `Skill` | 組織が持つスキル | skill_name, proficiency |

#### エッジタイプ

| エッジ | 説明 | 例 |
|--------|------|-----|
| `BELONGS_TO` | 所属関係 | Person → Organization |
| `USES` | 利用関係 | Organization → Product |
| `RELATED_TO` | 一般的な関連 | Concept ↔ Concept |
| `DEPENDS_ON` | 依存関係 | Product → Product |
| `GOVERNED_BY` | 規制関係 | Process → Rule |
| `CREATED_BY` | 作成者 | Document → Person |

### クエリパターン

```cypher
// パターン1: 関連知識の検索（GraphRAG）
// 「マーケティング施策に関連する過去の成功事例」
MATCH (c:Concept {domain: "marketing"})-[:RELATED_TO*1..3]-(related)
WHERE related.success_score > 0.7
RETURN related ORDER BY related.relevance_score DESC LIMIT 10

// パターン2: ルール検索
// 「見積もり承認に必要なルール」
MATCH (r:Rule)-[:GOVERNED_BY]-(p:Process {name: "見積もり承認"})
WHERE r.effective_date <= date() AND (r.expiry_date IS NULL OR r.expiry_date > date())
RETURN r
```

### 更新ポリシー

| 操作 | トリガー | 承認 |
|------|---------|------|
| 追加 | Learning Synthesizer / Human Input | 自動（confidence > 0.8）|
| 更新 | 矛盾検出 / 新情報 | Knowledge Curator承認 |
| アーカイブ | 6ヶ月参照なし + 陳腐化判定 | Knowledge Curator承認 |
| 削除 | 明示的な要求のみ | Human承認必須 |

---

## 2. Episodic Memory（エピソード記憶）

### 概要
「**組織が経験したこと**」を時系列で保持する。
いつ、何が起き、どう判断し、結果はどうだったか、を全て記録する。

### 技術実装

```
Backend:  Graphiti (Temporal Knowledge Graph)
特徴:     時間軸を持つエンティティと関係性
          インクリメンタルな更新（バッチ再計算不要）
          コミュニティ検出によるパターン発見
```

### スキーマ

#### エピソード構造

```json
{
  "episode_id": "uuid",
  "timestamp": "ISO-8601",
  "episode_type": "project|decision|incident|feedback|campaign",
  "title": "エピソードのタイトル",
  "context": {
    "trigger": "何がきっかけだったか",
    "participants": ["agent_ids or human_ids"],
    "related_kpis": ["kpi_ids"]
  },
  "narrative": {
    "situation": "状況の説明",
    "action": "取った行動",
    "result": "結果",
    "lesson": "得られた教訓"
  },
  "outcome": {
    "success_score": 0.0-1.0,
    "kpi_impact": { "kpi_name": "delta_value" },
    "side_effects": ["予期しなかった影響"]
  },
  "temporal_links": {
    "preceded_by": ["episode_ids"],
    "followed_by": ["episode_ids"],
    "similar_to": ["episode_ids"]
  }
}
```

### 想起（Recall）メカニズム

エピソード記憶の検索は以下の3段階で行われる：

```
Step 1: Semantic Similarity
  - 現在の状況をベクトル化
  - 類似エピソードを候補として取得（top-50）

Step 2: Temporal Relevance
  - 時間的な近さによるスコア調整
  - 季節性の考慮（同じ四半期の過去事例等）

Step 3: Outcome-based Ranking
  - 成功スコアでランキング
  - 失敗事例も「避けるべきパターン」として返却

Final: Top-5エピソードを返却（成功3 + 失敗2のバランス）
```

---

## 3. Working Memory（作業記憶）

### 概要
「**今、何が起きているか**」をリアルタイムで保持する。
短期的な状態であり、タスク完了やセッション終了で消滅する。

### 技術実装

```
Backend:  Redis Cluster (In-Memory)
特徴:     超低レイテンシー（<1ms）
          TTL（Time-to-Live）による自動消滅
          Pub/Sub による状態変更通知
```

### データ構造

#### タスクコンテキスト

```json
{
  "task_id": "uuid",
  "directive_id": "関連する指示書ID",
  "status": "pending|running|blocked|completed|failed",
  "assigned_to": "agent_id",
  "progress": 0-100,
  "started_at": "ISO-8601",
  "last_updated": "ISO-8601",
  "intermediate_results": [...],
  "blockers": [...]
}
// TTL: タスク完了後24時間、その後Episodic Memoryに移行
```

#### 会話コンテキスト

```json
{
  "conversation_id": "uuid",
  "participants": ["agent_ids", "human_ids"],
  "channel": "slack|email|chat",
  "messages": [...],
  "decisions_made": [...],
  "action_items": [...]
}
// TTL: 最終メッセージから24時間
```

#### Agent状態

```json
{
  "agent_id": "t4.marketing.content_writer.001",
  "status": "idle|busy|error",
  "current_task": "task_id or null",
  "load": 0.0-1.0,
  "last_heartbeat": "ISO-8601"
}
// TTL: Agentが停止するまで
```

### TTL管理とアーカイブ

```
Working Memory (Redis)
    │
    │ TTL expired
    ↓
Archive Decision:
    ├── 重要度 HIGH → Episodic Memory に保存
    ├── 重要度 MEDIUM → 要約してEpisodic Memoryに保存
    └── 重要度 LOW → 破棄（メトリクスのみ保持）
```

---

## 4. Procedural Memory（手続き記憶）

### 概要
「**どうやるか**」を保持する。業務手順、ワークフロー、テンプレート、
ベストプラクティスなど、実行方法の知識がここに蓄積される。

### 技術実装

```
Backend:  PostgreSQL + JSONB (Workflow DB)
特徴:     バージョニング（手順の改善履歴を保持）
          条件分岐を含むワークフロー定義
          テンプレートエンジン統合
```

### スキーマ

#### ワークフロー定義

```json
{
  "workflow_id": "uuid",
  "name": "新規顧客オンボーディング",
  "version": "3.2",
  "domain": "sales",
  "trigger": {
    "type": "event|schedule|manual",
    "condition": "contract_signed == true"
  },
  "steps": [
    {
      "step_id": 1,
      "name": "ウェルカムメール送信",
      "agent": "t4.support.responder",
      "action": "send_email",
      "template": "template_id",
      "timeout": "1h",
      "on_success": 2,
      "on_failure": "escalate_to_lead"
    },
    {
      "step_id": 2,
      "name": "キックオフMTG設定",
      "agent": "t4.operations.scheduler",
      "action": "schedule_meeting",
      "parameters": { "duration": "30min", "attendees": ["CSM", "customer"] },
      "timeout": "24h",
      "on_success": 3,
      "on_failure": "retry(3)"
    }
  ],
  "metadata": {
    "created_by": "t2.memory.learning_synthesizer",
    "success_rate": 0.94,
    "avg_completion_time": "3 days",
    "last_improved": "2026-01-15"
  }
}
```

#### テンプレート定義

```json
{
  "template_id": "uuid",
  "name": "提案書テンプレート",
  "version": "2.1",
  "domain": "sales",
  "content_type": "markdown",
  "variables": [
    { "name": "customer_name", "type": "string", "required": true },
    { "name": "solution_overview", "type": "text", "required": true },
    { "name": "pricing_table", "type": "table", "required": true }
  ],
  "template_body": "...",
  "usage_count": 47,
  "avg_approval_rate": 0.89
}
```

### 手続き改善フロー

```
Execution Agent が手順を実行
    ↓
結果を Evaluation Layer が評価
    ↓
Learning Synthesizer が改善ポイントを抽出
    ↓
改善版の手順を Procedural Memory に新バージョンとして保存
    ↓
旧バージョンは保持（ロールバック可能）
```

---

## 5. Evaluative Memory（評価記憶）

### 概要
「**組織のパフォーマンス**」を時系列で保持する。
KPI、目標値、ベンチマーク、トレンドなど、評価に必要な定量データ。

### 技術実装

```
Backend:  TimescaleDB (Time-series Database on PostgreSQL)
特徴:     高速な時系列クエリ
          自動データ圧縮（古いデータは粒度を下げて保持）
          連続集計（Continuous Aggregates）
```

### データモデル

```sql
-- KPIマスタ
CREATE TABLE kpi_definitions (
    kpi_id        TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    domain        TEXT NOT NULL,     -- hr, finance, marketing, etc.
    unit          TEXT NOT NULL,     -- %, ¥, count, score
    direction     TEXT NOT NULL,     -- higher_is_better, lower_is_better
    target_value  NUMERIC,
    warning_threshold NUMERIC,
    critical_threshold NUMERIC
);

-- KPI時系列データ
CREATE TABLE kpi_measurements (
    time          TIMESTAMPTZ NOT NULL,
    kpi_id        TEXT NOT NULL,
    value         NUMERIC NOT NULL,
    source        TEXT,              -- 収集元
    confidence    NUMERIC DEFAULT 1.0
);
SELECT create_hypertable('kpi_measurements', 'time');

-- データ保持ポリシー
-- 直近3ヶ月: 1時間粒度
-- 3ヶ月-1年: 日次粒度
-- 1年以上: 週次粒度
```

### KPIヒエラルキー

```
Organization KPIs (全社)
├── Revenue
│   ├── MRR
│   ├── ARR
│   └── Revenue Growth Rate
├── Profitability
│   ├── Gross Margin
│   └── Net Margin
│
├── Domain KPIs (部門別)
│   ├── Marketing
│   │   ├── CAC (Customer Acquisition Cost)
│   │   ├── LTV (Lifetime Value)
│   │   ├── Website PV
│   │   └── Conversion Rate
│   ├── Sales
│   │   ├── Pipeline Value
│   │   ├── Win Rate
│   │   └── ACV (Annual Contract Value)
│   ├── Engineering
│   │   ├── Deployment Frequency
│   │   ├── Lead Time
│   │   └── Change Failure Rate
│   └── ... (other domains)
│
└── Operational KPIs (運用)
    ├── Agent Response Time (p95)
    ├── Task Completion Rate
    ├── Error Rate
    └── Cost per Task
```

---

## 統一検索インターフェース（Unified Query Interface）

全ての記憶タイプを横断的に検索するための統一API。

### クエリ仕様

```json
{
  "query": "自然言語クエリ",
  "memory_types": ["semantic", "episodic", "working", "procedural", "evaluative"],
  "filters": {
    "domain": "marketing",
    "time_range": { "from": "2025-01-01", "to": "2026-01-31" },
    "min_confidence": 0.7,
    "min_success_score": 0.5
  },
  "max_results": 10,
  "include_reasoning": true
}
```

### レスポンス

```json
{
  "results": [
    {
      "memory_type": "episodic",
      "relevance_score": 0.95,
      "content": { ... },
      "reasoning": "なぜこの記憶が関連するかの説明"
    },
    {
      "memory_type": "semantic",
      "relevance_score": 0.88,
      "content": { ... },
      "reasoning": "..."
    }
  ],
  "cross_references": [
    {
      "from": "result[0]",
      "to": "result[1]",
      "relationship": "result[0]のエピソードはresult[1]のルールに基づいて実行された"
    }
  ]
}
```

### 検索優先度

クエリの性質に応じて、検索するメモリタイプの優先度が変わる：

| クエリ種別 | 優先メモリ | 例 |
|-----------|---------|-----|
| 事実確認 | Semantic | 「弊社の主力製品は？」 |
| 過去事例 | Episodic | 「前回のリブランディングの結果は？」 |
| 現状把握 | Working + Evaluative | 「今のMRRは？」 |
| 手順確認 | Procedural | 「請求書の発行手順は？」 |
| 戦略判断 | Episodic + Evaluative | 「売上改善に何が効果的だったか？」 |

---

## 記憶のライフサイクル

```
           生成              活用              評価              進化
            │                 │                │                │
新規データ ─┤                 │                │                │
            ↓                 │                │                │
    ┌──────────────┐         │                │                │
    │ 分類・保存    │─────────┤                │                │
    │ (auto-route) │         │                │                │
    └──────────────┘         ↓                │                │
                      ┌──────────────┐        │                │
                      │ 検索・想起    │────────┤                │
                      │ (recall)     │        │                │
                      └──────────────┘        ↓                │
                                       ┌──────────────┐       │
                                       │ 信頼度更新    │───────┤
                                       │ (validate)   │       │
                                       └──────────────┘       ↓
                                                        ┌──────────────┐
                                                        │ パターン抽出  │
                                                        │ 統合・昇格    │
                                                        │ アーカイブ    │
                                                        └──────────────┘
```

### 記憶の昇格パターン

```
Working Memory → (重要なタスク完了) → Episodic Memory
Episodic Memory → (パターン発見) → Semantic Memory
Episodic Memory → (手順改善) → Procedural Memory
Working Memory → (KPIスナップショット) → Evaluative Memory
```

---

*次のドキュメント:* `04-communication.md` — 通信プロトコル詳細
