# Layer 0-7: 七層モデル詳細定義

> 各層の責務、構成モジュール、入出力、および層間インターフェースの完全な定義

---

## Layer 0: Autonomic Layer（自律層）

> **脳の対応:** 自律神経系（体温、心拍、呼吸の無意識的制御）
> **カラー:** `#64748b` (Slate)

### 責務
組織全体のインフラストラクチャを維持し、他の全ての層が安定して動作するための基盤を提供する。
人間の自律神経が意識せずとも体の恒常性を維持するように、この層は全ての他層に対して透過的に機能する。

### 構成モジュール

| モジュール | 責務 | 入力 | 出力 |
|-----------|------|------|------|
| **Lifecycle Manager** | Agentの生成・監視・終了・再起動 | Agent要求、健全性情報 | Agent Instance |
| **Health Monitor** | 全層の健全性メトリクス収集・異常検知 | 各層のメトリクス | アラート、ステータスレポート |
| **Resource Governor** | 計算資源・API呼び出し・コスト管理 | リソース使用状況 | 割当制限、スロットリング指示 |
| **Security Controller** | アクセス制御・秘密管理・脅威検知 | 認証要求、アクセスログ | 認可判定、セキュリティアラート |
| **Config Manager** | 組織設定・Agent設定・環境変数管理 | 設定変更要求 | 設定値配信 |

### 動作特性
- **常時稼働:** 他の全ての層が停止しても、この層は稼働し続ける
- **自己修復:** 自身のモジュール障害を検知し、自動復旧する
- **優先度最高:** リソース競合時、この層の動作が最優先される

---

## Layer 1: Sensory Layer（感覚層）

> **脳の対応:** 感覚皮質（視覚・聴覚・触覚情報の処理）
> **カラー:** `#6366f1` (Indigo)

### 責務
組織の内外からデータを収集し、正規化・構造化して上位層に渡す。
生のデータを「組織が理解できる形式」に変換する知覚処理を担う。

### 構成モジュール

| モジュール | 責務 | データソース | 出力形式 |
|-----------|------|------------|---------|
| **Market Sensor** | 市場データ・競合情報の収集 | ニュースAPI、SNS、業界レポート | MarketSignal Event |
| **Customer Listener** | 顧客接点からのフィードバック収集 | CS問い合わせ、レビュー、NPS | CustomerFeedback Event |
| **Internal Aggregator** | 社内データの統合 | 会議ログ、チャット、ドキュメント | InternalData Event |
| **Metrics Collector** | 定量データの収集 | KPIダッシュボード、財務DB、Analytics | MetricsSnapshot Event |
| **Event Detector** | 異常・閾値超過の検知 | 全データストリーム | Alert Event |
| **Human Instruction Receiver** | 人間からの直接指示の受信 | Slack、メール、音声入力 | HumanDirective Event |

### データ正規化

全ての入力データは以下の統一フォーマットに変換される：

```json
{
  "event_id": "uuid",
  "timestamp": "ISO-8601",
  "source_type": "market|customer|internal|metrics|human",
  "source_id": "specific_source_identifier",
  "data_type": "qualitative|quantitative|directive",
  "content": { ... },
  "confidence": 0.0-1.0,
  "urgency": "low|medium|high|critical",
  "metadata": { ... }
}
```

### 動作特性
- **常時リスニング:** データソースを継続的に監視
- **フィルタリング:** ノイズ除去、重複排除
- **エンリッチメント:** 生データにメタデータ（信頼度、緊急度）を付加
- **ルーティング:** データの性質に応じて適切な上位層に配信

---

## Layer 2: Memory Layer（記憶層）

> **脳の対応:** 海馬（記憶形成）+ 側頭葉（記憶保存・検索）
> **カラー:** `#8b5cf6` (Violet)

### 責務
組織の全記憶を管理する。全てのAgentがこの層にアクセスし、
必要な知識・文脈・手順・履歴を取得する。
Neural Organizationの**核心**。

### 5種類の記憶

#### 2-1. Semantic Memory（意味記憶）
```
技術実装: Knowledge Graph (Neo4j + GraphRAG)
保存対象: 組織の知識・概念・事実・関係性
```

| データ種別 | 例 |
|-----------|-----|
| 企業知識 | 「弊社の主力製品はX」「顧客セグメントはA, B, C」 |
| ドメイン知識 | 「SaaS業界のchurn rateの平均は5%」 |
| 関係性 | 「顧客Aは製品Xと製品Yを利用中」 |
| ルール | 「見積もりの承認は100万円以上で部長承認が必要」 |
| アイデンティティ | 「弊社のトーン＆マナー: プロフェッショナルだがフレンドリー」 |

#### 2-2. Episodic Memory（エピソード記憶）
```
技術実装: Temporal Knowledge Graph (Graphiti)
保存対象: 過去のイベント・決定・その結果
```

| データ種別 | 例 |
|-----------|-----|
| プロジェクト履歴 | 「2025年Q3のリブランディングPJ → 売上+15%」 |
| 意思決定ログ | 「SNS戦略をYouTubeからTikTokに転換 → エンゲージメント+40%」 |
| 失敗事例 | 「価格改定を告知なしに実施 → 解約率+8%」 |
| 人間フィードバック | 「担当者Aは砕けた表現を好む」 |

#### 2-3. Working Memory（作業記憶）
```
技術実装: Redis + In-memory Context Store
保存対象: 現在進行中のタスク・会話・状態
```

| データ種別 | 例 |
|-----------|-----|
| 進行中タスク | 「Q1マーケティング施策: ステータス=実行中, 進捗=60%」 |
| 会話コンテキスト | 「顧客Bとの商談: 前回は価格交渉中」 |
| Agent状態 | 「Marketing Cluster: 3タスク並行実行中」 |

#### 2-4. Procedural Memory（手続き記憶）
```
技術実装: Workflow DB + Runbook Store
保存対象: 業務手順・ワークフロー・SOP
```

| データ種別 | 例 |
|-----------|-----|
| 業務手順 | 「請求書発行: 見積作成→承認→発行→送付→入金確認」 |
| ベストプラクティス | 「記事リライト: タイトル変更→本文修正→CTA追加→SEOチェック」 |
| テンプレート | 「提案書テンプレート v3.2」 |
| ワークフロー定義 | 「新規顧客オンボーディング: 7ステップ」 |

#### 2-5. Evaluative Memory（評価記憶）
```
技術実装: Time-series DB (InfluxDB/TimescaleDB)
保存対象: KPI・目標・パフォーマンス推移
```

| データ種別 | 例 |
|-----------|-----|
| KPI値 | 「MRR: ¥50M（前月比+3%）」 |
| 目標値 | 「Q1目標: MRR ¥55M, churn rate <3%」 |
| 推移データ | 「過去12ヶ月のPV推移: [...]」 |
| ベンチマーク | 「業界平均NPS: 42, 弊社NPS: 58」 |

### 記憶管理Agent

| Agent | 責務 |
|-------|------|
| **Knowledge Curator** | Semantic Memoryの整合性維持、重複排除、関係性更新 |
| **Context Manager** | Working Memoryのライフサイクル管理、有効期限管理 |
| **Recall Agent** | クエリに基づく関連記憶の検索・ランキング・返却 |
| **Learning Synthesizer** | Episodic Memoryからのパターン抽出、Semantic Memoryへの昇格 |

---

## Layer 3: Cortex Layer（思考層）

> **脳の対応:** 前頭前皮質（計画、判断、推論、意思決定）
> **カラー:** `#ec4899` (Pink)

### 責務
組織全体の戦略立案と意思決定を担う。
「**何をすべきか（WHAT）**」を決定し、実行層に指示を発行する。

### 構成モジュール

#### 3-1. CEO Agent（最高経営判断Agent）

```
役割:     組織全体の方向性決定、部門間の優先度調整
入力:     全KPI、市場状況、各部門の報告
出力:     戦略指示書（Strategic Directive）
判断基準: 長期ビジョン + 短期KPI + リスク許容度
```

**意思決定フロー:**
1. 現在のKPIギャップを評価記憶から取得
2. 過去の類似状況をエピソード記憶から想起
3. 利用可能なリソースをResource Allocatorから確認
4. 戦略的優先度に基づいて指示を発行

#### 3-2. Domain Strategists（部門別戦略Agent）

各企業機能に1つの Domain Strategist が存在する。

| Strategist | 担当領域 | 主要KPI |
|-----------|---------|--------|
| HR Strategist | 人材戦略 | 離職率, 採用コスト, 従業員満足度 |
| Finance Strategist | 財務戦略 | キャッシュフロー, 利益率, ROI |
| Marketing Strategist | マーケティング戦略 | CAC, LTV, ブランド認知度 |
| Sales Strategist | 営業戦略 | パイプライン, 成約率, ACV |
| Engineering Strategist | 技術戦略 | デリバリー速度, 品質, 技術負債 |
| Legal Strategist | 法務戦略 | コンプライアンス率, 訴訟リスク |
| Operations Strategist | 業務戦略 | 効率性, コスト削減率 |
| Support Strategist | CS戦略 | CSAT, 解決率, 応答時間 |

#### 3-3. Resource Allocator（リソース配分Agent）

```
役割:     予算・計算資源・優先度の最適配分
入力:     各Domain Strategistからのリソース要求
出力:     リソース配分計画
制約:     総予算、API利用制限、LLMトークン予算
```

#### 3-4. Risk Assessor（リスク評価Agent）

```
役割:     全ての戦略指示に対するリスク評価
入力:     戦略指示書、関連する記憶
出力:     リスクスコア + 軽減策提案
評価軸:   財務リスク、法務リスク、レピュテーションリスク、技術リスク
```

### 指示書フォーマット

思考層から実行層への指示は**Strategic Directive**として発行される：

```json
{
  "directive_id": "uuid",
  "issued_by": "ceo_agent|domain_strategist",
  "issued_at": "ISO-8601",
  "priority": "P0|P1|P2|P3",
  "target_cluster": "hr|finance|marketing|...",
  "objective": "何を達成するか",
  "context": "なぜ今この施策が必要か",
  "constraints": ["予算上限", "期限", "品質基準"],
  "success_criteria": ["KPI目標値"],
  "risk_assessment": {
    "risk_level": "low|medium|high|critical",
    "mitigation": "リスク軽減策"
  },
  "memory_references": ["関連する記憶ID"]
}
```

---

## Layer 4: Motor Layer（実行層）

> **脳の対応:** 運動皮質（計画された行動の実行）
> **カラー:** `#f97316` (Orange)

### 責務
思考層からの指示を受け、実際のタスクを実行して成果物を生成する。
「**どうやるか（HOW）**」を決定し、実行する。

### 構成：部門別Agentクラスタ

各クラスタは **Orchestrator-Worker パターン** で構成される：

```
┌─────────────────────────────────┐
│         Cluster Lead Agent      │ ← 指示の受信、タスク分解
│              │                  │
│    ┌─────────┼─────────┐        │
│    │         │         │        │
│ Worker A  Worker B  Worker C    │ ← 並行タスク実行
│    │         │         │        │
│    └─────────┼─────────┘        │
│              │                  │
│        Tool Integration         │ ← MCP経由の外部ツール利用
└─────────────────────────────────┘
```

### 8つのクラスタ

（詳細は `modules/04-execution-modules.md` に定義）

| クラスタ | Lead Agent | Worker例 | ツール例 |
|---------|-----------|---------|---------|
| **HR** | HR Lead | Recruiter, Evaluator, Trainer | HRMS, ATS, LMS |
| **Finance** | Finance Lead | Accountant, Budgeter, Auditor | ERP, 会計ソフト |
| **Marketing** | Marketing Lead | Content Writer, SEO, SNS | CMS, Analytics, SNS API |
| **Sales** | Sales Lead | Prospector, Negotiator, Closer | CRM, メール |
| **Engineering** | Eng Lead | Developer, Reviewer, DevOps | GitHub, CI/CD, Cloud |
| **Legal** | Legal Lead | Contract Drafter, Compliance | 法務DB, 電子署名 |
| **Operations** | Ops Lead | Process Manager, Scheduler | プロジェクト管理, ERP |
| **Support** | Support Lead | Responder, Escalator, Analyst | チケットシステム, KB |

### 成果物フォーマット

```json
{
  "artifact_id": "uuid",
  "directive_id": "元の指示ID",
  "produced_by": "cluster_id.agent_id",
  "produced_at": "ISO-8601",
  "artifact_type": "document|code|email|report|design|...",
  "content": { ... },
  "quality_self_assessment": 0.0-1.0,
  "tools_used": ["tool_id"],
  "execution_log": ["step1", "step2", ...],
  "status": "draft|review_pending|approved|rejected"
}
```

---

## Layer 5: Limbic Layer（評価層）

> **脳の対応:** 辺縁系（情動、価値判断、報酬系）
> **カラー:** `#10b981` (Emerald)

### 責務
実行層の成果物を評価し、品質を担保し、学習フィードバックを記憶層に還元する。
人間の辺縁系が「良い/悪い」を判断するように、組織の成果物の価値を判定する。

### 評価パイプライン

```
成果物 → [AI Critic Network] → [Compliance Guardian] → [Quality Auditor]
                                                              │
                                                    ┌────────┴────────┐
                                                    │                 │
                                              自動承認           Human Review
                                           (Low Risk)         (High Risk)
                                                    │                 │
                                                    └────────┬────────┘
                                                              │
                                                     [Learning Synthesizer]
                                                              │
                                                        Memory Layer へ
```

### 構成モジュール

#### 5-1. AI Critic Network

```
構成:     成果物の種類に応じた専門評価Agent群
評価基準: 正確性、一貫性、ガイドライン準拠、品質スコア
判定:     Accept / Revise / Reject
Revise → 実行層に差し戻し（自律ループ、最大3回）
```

#### 5-2. Compliance Guardian

```
役割:     法務・規制・社内ルールへの準拠チェック
チェック項目:
  - 個人情報の不適切な使用
  - 著作権侵害の可能性
  - 規制要件への違反
  - 社内ガイドライン違反
判定:     Compliant / Non-compliant（理由付き）
```

#### 5-3. Quality Auditor

```
役割:     最終品質検証
チェック項目:
  - 指示書の要件充足度
  - 成功基準の達成度
  - 一貫性（過去の成果物との整合性）
判定:     Pass / Fail（スコア付き）
```

#### 5-4. HITL Gateway（Human-in-the-Loop ゲートウェイ）

```
役割:     リスクレベルに応じた人間エスカレーション
ルーティング:
  Low Risk    → 自動承認（事後レポート）
  Medium Risk → 自動承認（即時通知、24h以内レビュー）
  High Risk   → 人間の事前承認が必須
  Critical    → 複数人の事前承認が必須
通知手段: Slack, メール, 専用ダッシュボード
```

#### 5-5. Learning Synthesizer

```
役割:     評価結果からの学習パターン抽出
入力:     全評価結果、人間フィードバック、KPI変化
出力:
  - Episodic Memory への事例保存
  - Semantic Memory へのルール更新
  - Procedural Memory への手順改善
  - Agent性能メトリクスの更新
```

---

## Layer 6: Output Layer（出力層）

> **脳の対応:** 運動神経（行動の最終出力）
> **カラー:** `#06b6d4` (Cyan)

### 責務
評価層を通過した承認済み成果物を、指定されたチャネル・ツールにデプロイする。

### 構成モジュール

| モジュール | 責務 | 対象システム |
|-----------|------|------------|
| **Channel Router** | 成果物の配信先決定 | - |
| **Slack Publisher** | Slackへのメッセージ送信 | Slack API |
| **CMS Publisher** | CMS記事の公開 | WordPress, Notion, etc. |
| **Code Deployer** | コードのデプロイ | GitHub, CI/CD |
| **Email Sender** | メール送信 | SMTP, SendGrid |
| **SNS Publisher** | SNS投稿 | X, LinkedIn, etc. |
| **Document Publisher** | ドキュメント保存 | Google Drive, Notion |
| **ERP Integrator** | 基幹システム更新 | ERP, 会計ソフト |

### デプロイメントレシート

全てのデプロイにレシートが発行される：

```json
{
  "deployment_id": "uuid",
  "artifact_id": "元の成果物ID",
  "channel": "slack|cms|github|email|sns|...",
  "deployed_at": "ISO-8601",
  "status": "success|failed|partial",
  "external_id": "外部システムのID（投稿ID等）",
  "rollback_possible": true|false
}
```

---

## Layer 7: Interface Layer（界面層）

> **脳の対応:** 末梢神経系（外部世界との接触面）
> **カラー:** `#f59e0b` (Amber)

### 責務
外部世界との**双方向**コミュニケーションを管理する。
v1.0では出力のみだったが、v2.0では外部からの反応・要求も受信する。

### 構成モジュール

#### 7-1. Customer Agent

```
役割:     顧客対応の窓口AI
機能:
  - 問い合わせ対応（チャット、メール）
  - 商談対応（質問回答、提案）
  - クレーム対応（初期対応、エスカレーション）
記憶参照: 顧客別のエピソード記憶、製品のSemantic Memory
```

#### 7-2. Partner Agent

```
役割:     取引先・パートナーとのB2B通信
機能:
  - A2Aプロトコルによるエージェント間通信
  - 発注・受注の自動処理
  - 情報共有・共同プロジェクト調整
```

#### 7-3. Market Responder

```
役割:     市場変化への即座反応
機能:
  - 競合動向への対応策立案トリガー
  - 市場機会の検知と戦略層への報告
  - PR・危機対応の初動
```

#### 7-4. Public Relations Agent

```
役割:     対外的な情報発信の管理
機能:
  - プレスリリースの最終チェックと配信
  - SNSでのブランドモニタリングと応答
  - ステークホルダーへの定期報告
```

---

## 層間インターフェース仕様

### イベント型（非同期）

```
Event {
  event_id: string
  event_type: string
  source_layer: 0-7
  target_layer: 0-7 | "broadcast"
  payload: any
  priority: "low" | "medium" | "high" | "critical"
  timestamp: ISO-8601
  correlation_id: string  // 関連イベントの追跡用
}
```

### 指示型（同期的）

```
Directive {
  directive_id: string
  issuer: AgentId
  target: AgentId | ClusterId
  action: string
  parameters: object
  deadline: ISO-8601 | null
  callback: string  // 完了通知先
}
```

### 記憶アクセス型

```
MemoryQuery {
  query_id: string
  requester: AgentId
  memory_types: ["semantic" | "episodic" | "working" | "procedural" | "evaluative"]
  query: string
  filters: object
  max_results: number
  min_confidence: number
}

MemoryWrite {
  write_id: string
  writer: AgentId
  memory_type: string
  content: object
  confidence: number
  ttl: number | null  // Time-to-Live（秒）
  tags: string[]
}
```

---

*次のドキュメント:* `02-agent-taxonomy.md` — エージェント分類体系の詳細
