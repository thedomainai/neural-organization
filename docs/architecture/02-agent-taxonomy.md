# Agent Taxonomy — エージェント分類体系

> Neural Organization v2.0 における全エージェントの分類、責務、動作仕様の完全定義

---

## 分類原則

### Tier構造

エージェントは6つのTierに分類される。Tierは**権限の階層**を示す。

| Tier | 名称 | 権限レベル | 並行度 |
|------|------|----------|--------|
| 0 | Infrastructure | システム管理者 | Always-on (常時稼働) |
| 1 | Perception | 読み取り専用 | Always-on (ストリーミング) |
| 2 | Memory | 読み書き（記憶層のみ） | On-demand |
| 3 | Strategic | 読み＋指示発行 | On-demand |
| 4 | Execution | 読み＋書き＋ツール操作 | Parallel (並行多重) |
| 5 | Evaluation | 読み＋判定＋差し戻し | Pipeline (逐次) |
| 6 | Interface | 外部通信 | Always-on (リスニング) |

### Agent Identity

各Agentは以下のIDで一意に識別される：

```
{tier}.{domain}.{role}.{instance}
例: t4.marketing.content_writer.001
```

---

## Tier 0: Infrastructure Agents

### 0.1 Lifecycle Manager

```yaml
id: t0.infra.lifecycle_manager
type: singleton  # 単一インスタンス（冗長化あり）
always_on: true

責務:
  - 全Agentのインスタンス管理（生成・監視・終了・再起動）
  - Agent負荷に基づくオートスケーリング
  - Agent障害時のフェイルオーバー

入力:
  - Agent生成要求（Strategic/Execution層から）
  - Health Monitorからの異常通知
  - Resource Governorからのリソース制約

出力:
  - Agent Instance（起動済みのAgent）
  - 停止通知
  - スケーリングレポート

動作フロー:
  1. Agent要求を受信
  2. Resource Governorにリソース確認
  3. 利用可能な場合、Agent Instanceを生成
  4. ヘルスチェックを開始（30秒間隔）
  5. 異常検知時: 再起動 → 3回失敗で代替Agent起動 → 管理者通知

依存:
  - Resource Governor（リソース確認）
  - Config Manager（Agent設定取得）
```

### 0.2 Health Monitor

```yaml
id: t0.infra.health_monitor
type: singleton
always_on: true

責務:
  - 全層・全Agentのヘルスメトリクス収集
  - 異常パターンの検知
  - システム全体のダッシュボード提供

監視メトリクス:
  - Agent応答時間（p50, p95, p99）
  - メモリ使用量
  - API呼び出し頻度・エラー率
  - タスク完了率・平均処理時間
  - 記憶層のクエリ性能

閾値:
  warning:  p95 > 5s, error_rate > 5%
  critical: p95 > 30s, error_rate > 20%, agent_down
```

### 0.3 Resource Governor

```yaml
id: t0.infra.resource_governor
type: singleton
always_on: true

責務:
  - LLMトークン予算の管理
  - API呼び出しレート制限
  - 計算コストの最適化
  - リソース使用量の公平な配分

管理リソース:
  - LLM tokens/day: 各Tier別に予算配分
  - API calls/min: 外部API別にレート制限
  - Storage: 記憶層のストレージ使用量
  - Compute: Agent並行実行数の上限

配分戦略:
  Tier 0 (Infra):     予算の5%  — 最優先確保
  Tier 3 (Strategic):  予算の15% — 高品質モデル使用
  Tier 4 (Execution):  予算の50% — 最大消費層
  Tier 5 (Evaluation): 予算の20% — 品質担保に必要
  Tier 1,2,6:          予算の10% — 残り
```

### 0.4 Security Controller

```yaml
id: t0.infra.security_controller
type: singleton
always_on: true

責務:
  - Agent間のアクセス制御（RBAC）
  - 秘密情報の管理（API Key, 認証情報）
  - データアクセスの監査ログ
  - 脅威検知（不正なAgent動作の検出）

アクセス制御マトリクス:
  Tier 4 Agents → Memory Layer: READ + WRITE (own domain)
  Tier 4 Agents → Memory Layer: READ (other domains)
  Tier 3 Agents → Memory Layer: READ ALL
  Tier 4 Agents → External Tools: EXECUTE (authorized only)
  Tier 6 Agents → External Systems: COMMUNICATE (authorized only)
```

### 0.5 Config Manager

```yaml
id: t0.infra.config_manager
type: singleton
always_on: true

責務:
  - 全Agent設定の中央管理
  - 環境変数・接続情報の配信
  - 設定変更の即時反映（hot reload）
  - 設定バージョニング

管理対象:
  - LLMモデル選択（Agent別）
  - プロンプトテンプレート
  - ツール接続設定
  - ガバナンスルール
  - KPI閾値設定
```

---

## Tier 1: Perception Agents

### 1.1 Market Sensor

```yaml
id: t1.perception.market_sensor
type: singleton
always_on: true
model: haiku (コスト効率優先)

責務:
  - ニュース、SNS、業界レポートの自動収集
  - 競合動向のモニタリング
  - 市場トレンドの検出

データソース:
  - ニュースAPI (NewsAPI, Google News)
  - SNS API (X, LinkedIn)
  - 業界データベース
  - Google Trends
  - 特許DB

出力イベント:
  MarketSignal:
    signal_type: "competitor_move|trend_shift|opportunity|threat"
    relevance_score: 0.0-1.0
    summary: string
    source_urls: string[]
    recommended_action: string | null

収集頻度:
  ニュース: 15分間隔
  SNS: リアルタイム（ストリーミング）
  業界レポート: 日次
```

### 1.2 Customer Listener

```yaml
id: t1.perception.customer_listener
type: singleton
always_on: true

責務:
  - 顧客からの問い合わせ・フィードバックの収集
  - 顧客感情分析（Sentiment Analysis）
  - 解約シグナルの早期検知
  - NPS/CSATの自動集計

データソース:
  - カスタマーサポートチケット
  - レビューサイト
  - SNSメンション
  - アンケート回答
  - 利用ログ（行動データ）

出力イベント:
  CustomerFeedback:
    customer_id: string
    sentiment: "positive|neutral|negative|critical"
    topic: string
    churn_risk: 0.0-1.0
    action_required: boolean
```

### 1.3 Internal Aggregator

```yaml
id: t1.perception.internal_aggregator
type: singleton
always_on: true

責務:
  - 社内コミュニケーションの集約（会議、チャット、ドキュメント）
  - 意思決定ポイントの抽出
  - タスク状況の自動更新

データソース:
  - Slack / Microsoft Teams
  - 会議録音・議事録
  - Google Docs / Notion
  - プロジェクト管理ツール

出力イベント:
  InternalData:
    data_type: "decision|action_item|knowledge|status_update"
    source: string
    participants: string[]
    extracted_content: object
```

### 1.4 Metrics Collector

```yaml
id: t1.perception.metrics_collector
type: singleton
always_on: true

責務:
  - KPI値の定期収集
  - 閾値監視とアラート生成
  - データ正規化と記憶層への保存

データソース:
  - Google Analytics / Mixpanel
  - CRM (Salesforce, HubSpot)
  - 会計システム
  - HRシステム
  - カスタムダッシュボード

収集スケジュール:
  リアルタイム: Webトラフィック、エラー率
  時間次: 売上、問い合わせ数
  日次: 全KPIスナップショット
```

### 1.5 Event Detector

```yaml
id: t1.perception.event_detector
type: singleton
always_on: true

責務:
  - 全データストリームの横断的異常検知
  - パターンマッチングによるイベント検出
  - アラートの優先度判定と配信

検知パターン:
  - KPI閾値超過（前月比90%以下等）
  - 急激な変化（スパイク/ドロップ）
  - パターン異常（通常と異なる曜日別パターン等）
  - 複合イベント（複数KPIの同時悪化等）

出力:
  Alert:
    alert_type: "threshold|spike|pattern|compound"
    severity: "info|warning|error|critical"
    affected_kpis: string[]
    description: string
    recommended_escalation: "auto|cortex|human"
```

### 1.6 Human Instruction Receiver

```yaml
id: t1.perception.human_instruction_receiver
type: singleton
always_on: true

責務:
  - 人間からの直接指示の受信・解釈
  - 自然言語指示の構造化
  - 指示の曖昧性解消（必要に応じて質問）

入力チャネル:
  - Slack DM / メンション
  - メール
  - 専用ダッシュボード
  - 音声入力（Whisper経由）

出力:
  HumanDirective:
    requester: string
    intent: string
    structured_request: object
    urgency: "low|medium|high|critical"
    ambiguity_score: 0.0-1.0  # 高い場合は確認を要求
```

---

## Tier 2: Memory Agents

### 2.1 Knowledge Curator

```yaml
id: t2.memory.knowledge_curator
type: singleton
model: sonnet (推論力が必要)

責務:
  - Semantic Memoryの品質維持
  - 新規知識の分類・関連付け
  - 陳腐化した知識の更新・アーカイブ
  - 知識間の矛盾検出・解消

動作サイクル:
  リアルタイム: 新規知識の追加リクエスト処理
  日次: 矛盾チェック、重複排除
  週次: 陳腐化チェック、関連性の再評価
```

### 2.2 Context Manager

```yaml
id: t2.memory.context_manager
type: singleton

責務:
  - Working Memoryのライフサイクル管理
  - TTL切れコンテキストの自動アーカイブ
  - Agent間のコンテキスト共有管理

TTLポリシー:
  会話コンテキスト: 24時間（最終アクセスから）
  タスクコンテキスト: タスク完了まで
  セッションコンテキスト: セッション終了まで
```

### 2.3 Recall Agent

```yaml
id: t2.memory.recall_agent
type: scalable (負荷に応じてスケール)

責務:
  - クエリに基づく関連記憶の検索
  - マルチタイプ横断検索（Semantic + Episodic + Procedural）
  - 結果のランキング・フィルタリング

検索戦略:
  1. Vector Similarity Search（初期候補取得）
  2. Graph Traversal（関連ノード展開）
  3. Temporal Filtering（時間的関連性フィルタ）
  4. Relevance Ranking（最終ランキング）
```

### 2.4 Learning Synthesizer

```yaml
id: t2.memory.learning_synthesizer
type: singleton
model: opus (高度な推論が必要)

責務:
  - エピソード記憶からのパターン抽出
  - 成功/失敗パターンの一般化
  - 暗黙知の形式知化
  - 記憶間の因果関係推定

学習サイクル:
  日次 (Level 1):
    - 本日の全評価結果をレビュー
    - 人間フィードバックからの選好パターン抽出
    - Procedural Memoryの微調整

  週次 (Level 2):
    - KPIトレンドと施策の相関分析
    - 成功施策のパターン化
    - Strategic Agentへの改善提案

  月次 (Level 3):
    - Agent性能の横断分析
    - 組織構造の最適化提案
    - 記憶アーキテクチャの改善提案
```

---

## Tier 3: Strategic Agents

### 3.1 CEO Agent

```yaml
id: t3.strategy.ceo
type: singleton
model: opus (最高品質の判断が必要)

責務:
  - 組織全体のOKR/KGI設定・管理
  - 部門間の優先度調整・リソース配分方針
  - 全社戦略の定期見直し

意思決定プロセス:
  1. 全KPIの現状把握（Evaluative Memory）
  2. 過去の類似状況の想起（Episodic Memory）
  3. 各Domain Strategistからの報告受信
  4. リソース制約の確認（Resource Allocator）
  5. リスク評価（Risk Assessor）
  6. 戦略指示書の発行

定期タスク:
  日次: KPIレビュー、緊急対応の判断
  週次: 部門別進捗レビュー、優先度調整
  月次: 全社戦略レビュー、OKR進捗確認
  四半期: OKR更新、戦略大幅見直し
```

### 3.2 Domain Strategists (×8)

```yaml
id: t3.strategy.{domain}  # hr, finance, marketing, sales, engineering, legal, operations, support
type: singleton per domain
model: sonnet

責務:
  - 担当ドメインの戦略立案
  - CEO Agentからの全社方針の翻訳（ドメイン固有の施策へ）
  - 担当クラスタへの指示書発行

動作フロー:
  1. CEO Agentから全社方針を受信
  2. ドメイン固有のKPIを確認
  3. 過去の施策効果を想起
  4. 具体的な施策を立案
  5. 指示書を作成、実行クラスタに発行
```

### 3.3 Resource Allocator

```yaml
id: t3.strategy.resource_allocator
type: singleton

責務:
  - 全部門からのリソース要求の受付・優先度付け
  - LLMトークン予算の動的配分
  - 計算資源の最適配分
  - コスト対効果の最大化

配分アルゴリズム:
  1. Priority-weighted allocation（優先度重み付き配分）
  2. Historical usage pattern（過去の使用パターン）
  3. ROI estimation（投資対効果推定）
  4. Fairness constraint（公平性制約）
```

### 3.4 Risk Assessor

```yaml
id: t3.strategy.risk_assessor
type: singleton
model: sonnet

責務:
  - 全指示書に対するリスク評価
  - リスクティアの自動判定
  - 軽減策の提案

リスク評価軸:
  financial_risk:     0.0-1.0  # 財務的影響
  legal_risk:         0.0-1.0  # 法的リスク
  reputation_risk:    0.0-1.0  # ブランド毀損リスク
  operational_risk:   0.0-1.0  # 業務継続リスク
  reversibility:      0.0-1.0  # 可逆性（高いほど取り消しやすい）

リスクティア判定:
  composite_score = weighted_average(above)
  Low:      composite_score < 0.2
  Medium:   0.2 <= composite_score < 0.5
  High:     0.5 <= composite_score < 0.8
  Critical: composite_score >= 0.8
```

---

## Tier 4: Execution Agents

> 各クラスタの詳細は `modules/04-execution-modules.md` に定義。
> ここでは共通パターンのみ記載。

### 共通: Cluster Lead Agent

```yaml
id: t4.{domain}.lead
type: singleton per cluster
model: sonnet

責務:
  - Strategic Directiveの受信とタスク分解
  - Worker Agentへのタスク割当
  - 進捗監視と報告
  - Worker間の調整

タスク分解フロー:
  1. Directiveを受信
  2. 必要なWorker種別とタスク数を決定
  3. Lifecycle Managerに必要なWorkerの起動を要求
  4. 各Workerにタスクを配布
  5. 完了報告を収集、成果物を統合
  6. 評価層に成果物を提出
```

### 共通: Worker Agent

```yaml
id: t4.{domain}.{role}.{instance}
type: scalable (0-N instances)
model: haiku or sonnet (タスク複雑度による)

責務:
  - 単一タスクの実行
  - ツール（MCP経由）を使った外部操作
  - 実行ログの記録
  - 品質の自己評価

ライフサイクル:
  CREATED → INITIALIZED → RUNNING → COMPLETED/FAILED → TERMINATED
  最大実行時間: 30分（デフォルト、タスク種別で調整可能）
```

---

## Tier 5: Evaluation Agents

### 5.1 AI Critic (per domain)

```yaml
id: t5.evaluation.critic.{domain}
type: one per execution domain
model: sonnet (異なるモデルで評価の多様性を確保)

責務:
  - 成果物の品質チェック
  - ガイドライン準拠チェック
  - 修正指示の生成

評価プロセス:
  1. 成果物と元の指示書を受信
  2. 品質基準に照らして評価
  3. Accept / Revise(修正指示付き) / Reject を判定
  4. Reviseの場合: 実行層に差し戻し（最大3回ループ）
  5. 3回Revise後もNGの場合: Reject → HITL Gatewayへ
```

### 5.2 Compliance Guardian

```yaml
id: t5.evaluation.compliance_guardian
type: singleton
model: sonnet

チェックリスト:
  - 個人情報保護法準拠
  - 著作権・商標権チェック
  - 業界規制準拠
  - 社内ポリシー準拠
  - 反社チェック（取引先関連）
  - 輸出管理規制チェック
```

### 5.3 Quality Auditor

```yaml
id: t5.evaluation.quality_auditor
type: singleton

品質スコアリング:
  accuracy:     0-100  # 正確性
  completeness: 0-100  # 完全性（要件充足度）
  consistency:  0-100  # 一貫性（過去の成果物との整合性）
  clarity:      0-100  # 明瞭性

  overall = weighted_average(above)
  合格基準: overall >= 70
```

### 5.4 HITL Gateway

```yaml
id: t5.evaluation.hitl_gateway
type: singleton

エスカレーションルール:
  risk_tier == "low":      auto_approve, log_only
  risk_tier == "medium":   auto_approve, notify_human(24h review)
  risk_tier == "high":     require_human_approval(single)
  risk_tier == "critical": require_human_approval(multi, 2+ approvers)

通知チャネル:
  primary: Slack DM to designated approver
  secondary: Email notification
  escalation: Phone call (if no response in SLA)

SLA:
  high:     4時間以内に承認/却下
  critical: 1時間以内に承認/却下
```

---

## Tier 6: Interface Agents

### 6.1 Customer Agent

```yaml
id: t6.interface.customer_agent
type: scalable (同時接続数に応じて)
always_on: true

対応チャネル:
  - Webチャット
  - メール
  - 電話（音声合成/認識経由）
  - SNS DM

記憶活用:
  - 顧客別エピソード記憶（過去のやり取り）
  - 製品Semantic Memory（回答の正確性）
  - FAQ Procedural Memory（標準対応手順）

エスカレーション条件:
  - 顧客のsentimentがnegative + 解決不能
  - 金額が一定以上の案件
  - 契約解除の申し出
  - 3回以上の同一問題の再発
```

### 6.2 Partner Agent

```yaml
id: t6.interface.partner_agent
type: scalable
always_on: true
protocol: A2A (Agent-to-Agent Protocol)

機能:
  - 発注書/受注書の自動処理
  - 在庫・納期の自動照会
  - 共同プロジェクトの進捗同期
  - SLA監視と違反通知
```

### 6.3 Channel Publisher

```yaml
id: t6.interface.channel_publisher
type: singleton

責務:
  - 出力層からの成果物の最終配信
  - チャネル別フォーマット変換
  - 配信スケジューリング
  - 配信結果の追跡

対応チャネル:
  - Slack, Email, CMS, GitHub, SNS (X, LinkedIn, Instagram)
  - Google Drive, Notion, Confluence
  - ERP, CRM, 会計ソフト
```

---

## Agent間通信プロトコル

### 同一Tier内通信
- **Direct Message:** 低レイテンシーのpoint-to-point通信
- 用途: Cluster内のLead-Worker間、同一機能内の調整

### Tier間通信
- **Task Queue:** 非同期のタスク委任
- 用途: Cortex → Motor（指示発行）、Motor → Limbic（成果物提出）

### 全体通知
- **Event Bus:** Pub/Sub型の非同期イベント配信
- 用途: KPIアラート、設定変更、緊急通知

### 記憶経由
- **Shared Memory:** Memory Layerを介した間接的な情報共有
- 用途: 長期的な知識共有、コンテキストの引き継ぎ

---

*次のドキュメント:* `03-memory-architecture.md` — 記憶アーキテクチャの詳細
