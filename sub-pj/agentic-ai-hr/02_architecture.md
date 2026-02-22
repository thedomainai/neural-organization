# HR Policy Advisor — アーキテクチャ

> 本ドキュメントは HR Policy Advisor のシステムアーキテクチャを定義する。コンセプトは [01_concept.md](01_concept.md)、実装詳細は [03_implementation.md](03_implementation.md) を参照。

## 1. Neural Organization 5 層マッピング

HR Policy Advisor は Neural Organization の 5 層パイプラインに準拠して設計されている。各層は不可分な認知変換に対応し、横断的要素（Purpose, Governance, Memory, Orchestration）が全層に作用する。

```
 Purpose ──────────────────────────────────── Governance
 (企業の Mission/Vision/Values               (Trust Score x HITL Gate)
  + 3 つの究極の問いへの回答)                     |
        |                                       |
        ▼                                       |
┌──────────────────────────────────────────────────────────┐
│  L0: Perception（知覚）                                    │
│  企業コンテキスト収集、外部データ取り込み、運用データ収集      │
├──────────────────────────────────────────────────────────┤
│  L1: Understanding（理解）                                 │
│  組織能力の構造化、現行制度の因果分析、業界ベンチマーク比較    │
├──────────────────────────────────────────────────────────┤
│  L2: Reasoning（推論）                                     │
│  人材像設計、等級設計、評価設計、報酬設計                     │
├──────────────────────────────────────────────────────────┤
│  L3: Execution（実行）                                     │
│  制度ドキュメント生成、導入計画生成、運用ツール生成            │
├──────────────────────────────────────────────────────────┤
│  L4: Reflection（内省）                                    │
│  HITL 修正パターン分析、運用結果評価、制度改定提案            │
└──────────────────────────────────────────────────────────┘
       ▲                                      ▲
  Memory                                 Orchestration
  長期 / 作業 / 評価                       DAG ワークフロー
```

### 1.1 L0: Perception（知覚）

企業の現実を知覚し、シグナルを検出する層。

| 要素 | v1 | v2 |
|---|---|---|
| 企業情報 | 手動入力のみ | 手動入力 + 外部データ自動取得 |
| 市場データ | なし | 労働市場 API（業界平均報酬、求人倍率） |
| 法規制データ | なし | 法規制 DB（最低賃金、労基法要件） |
| 運用データ | なし | 離職率、評価結果分布、サーベイ結果 |

**担当エージェント**: ContextPerceptionAgent（v1: ContextCollectorAgent）

### 1.2 L1: Understanding（理解）

知覚したシグナルを統合し、組織の世界モデルを構築する層。

| 要素 | 内容 |
|---|---|
| 組織能力の構造化 | コンピテンシー・トリアドへのマッピング |
| 現行制度の因果分析 | 制度設計 <-> 人材行動 <-> 組織成果の因果構造 |
| 業界ベンチマーク比較 | 報酬水準、等級数、評価方式の比較 |

**担当エージェント**: TalentModelingAgent（v1: TalentProfileGeneratorAgent）— L1 と L2 を跨ぐ

### 1.3 L2: Reasoning（推論）

世界モデルと Purpose を接続し、制度の設計方針を導出する層。制度設計の中核。

| 要素 | 内容 |
|---|---|
| 人材像設計 | コンピテンシーモデリング（トリアドのカスタマイズ） |
| 等級設計 | スコープベースモデル適用（4-8 段階選択） |
| 評価設計 | 3 ゲート + 5 段階採点の適用 |
| 報酬設計 | 3 つの究極の問いに基づく方針駆動設計 |

**担当エージェント**: GradingArchitectAgent, EvaluationArchitectAgent, CompensationArchitectAgent

### 1.4 L3: Execution（実行）

設計結果を具体的なアウトプットに変換する層。

| 要素 | 内容 |
|---|---|
| 制度ドキュメント生成 | 等級定義書、評価シートテンプレート、報酬テーブル |
| 導入計画生成 | Phase 0-4 のカスタマイズ計画、タイムライン |
| 運用ツール生成 | ミッションレター、1on1 テンプレート |
| 品質チェック | 4 段階品質チェック（基準適合、論理整合、安全性、最適化） |

**担当エージェント**: PolicyDocumentAgent, DeploymentPlannerAgent（v2 新規）

### 1.5 L4: Reflection（内省）

アウトプットの結果を分析し、全層を改善する層。Neural Organization の核心。

| 要素 | 内容 |
|---|---|
| HITL 修正パターン分析 | 人間の修正行為から暗黙の価値観を抽出 |
| 運用結果評価 | 評価結果分布、離職率、エンゲージメントの分析 |
| 制度改定提案 | データに基づく改善提案の自動生成 |
| Knowledge Layer 更新 | 学習結果の匿名化と汎化 |

**担当エージェント**: ReflectionAgent（v2 新規、最重要）

## 2. エージェント構成

### 2.1 エージェント一覧

```
【設計フェーズ — v1 の強化版】
  Agent 1: ContextPerceptionAgent     (L0)  企業コンテキスト収集
  Agent 2: TalentModelingAgent        (L1+L2) 人材像設計
  Agent 3: GradingArchitectAgent      (L2)  等級制度設計
  Agent 4: EvaluationArchitectAgent   (L2)  評価制度設計
  Agent 5: CompensationArchitectAgent (L2)  報酬制度設計

【実行フェーズ — v2 新規】
  Agent 6: PolicyDocumentAgent        (L3)  制度ドキュメント生成
  Agent 7: DeploymentPlannerAgent     (L3)  導入計画策定

【内省フェーズ — v2 新規】
  Agent 8: ReflectionAgent            (L4)  HITL 分析 + 運用評価 + 制度改定提案

【補助エージェント — v1】
  PolicyAnalystAgent                        現行制度の分析
  ComplianceCheckerAgent                    法令適合性チェック
  IndustryResearcherAgent                   業界ベンチマーク調査
```

### 2.2 v1 実装済みエージェントの詳細

v1 で実装済みのエージェント構成は以下の通りである。

| エージェント | 入力 | 出力 | HITL Gate |
|---|---|---|---|
| ContextCollectorAgent | 企業基本情報（フォーム入力） | CompanyContext | COMPANY_CONTEXT |
| TalentProfileGeneratorAgent | CompanyContext | IdealTalentProfile | TALENT_PROFILE |
| GradingDesignerAgent | CompanyContext + TalentProfile | GradingSystem（等級 + コンピテンシー + 卒業要件） | GRADING_SYSTEM |
| EvaluationDesignerAgent | CompanyContext + GradingSystem | EvaluationSystem | EVALUATION_SYSTEM |
| CompensationDesignerAgent | CompanyContext + GradingSystem + EvaluationSystem | CompensationSystem | COMPENSATION_SYSTEM |

### 2.3 v2 新規エージェントの詳細

**Agent 6: PolicyDocumentAgent（L3）**

全設計結果と 4 フェーズ運用体系を入力として、制度ドキュメント一式を生成する。

| 生成物 | 内容 |
|---|---|
| 等級定義書 | G1-Gn の等級別ドキュメント |
| コンピテンシー定義書 | 進化マトリクス付き |
| 評価シートテンプレート | 等級グループ別 |
| 報酬テーブル | サラリーバンド + 手当一覧 |
| 運用マニュアル | Phase 3 サイクルの詳細 |
| 制度説明資料 | 全社 Town Hall 用 + マネージャー向け |

生成前に 4 段階品質チェック（基準適合、論理整合性、安全性、最適化）を実行する。

**Agent 7: DeploymentPlannerAgent（L3）**

設計結果と企業コンテキストを入力として、導入計画を策定する。

| 処理 | 内容 |
|---|---|
| Phase カスタマイズ | 現行制度の有無に応じて Phase 0-4 を調整 |
| 初期格付けシミュレーション | 全従業員の推定等級と報酬増減を算出 |
| タイムライン生成 | 企業の状況に応じたスケジュール策定 |
| リスク特定 | 想定されるリスクと対策の提示 |

**Agent 8: ReflectionAgent（L4）**

全 HITL 修正履歴と運用データを入力として、システム全体の改善を駆動する。最重要エージェント。

| 処理 | 内容 |
|---|---|
| HITL 修正パターン分析 | 人間の修正行為から暗黙の価値観を抽出 |
| 運用結果評価 | 評価結果分布、離職率、エンゲージメントの分析 |
| 制度改定提案 | データに基づく改善提案の自動生成 |
| Knowledge 更新 | 学習結果の匿名化と汎化（パターンライブラリへの還元） |

### 2.4 エージェント間データフロー

```
┌─────────────────── 設計フェーズ ───────────────────┐
│                                                   │
│  Agent 1          Agent 2          Agent 3         │
│  Context    ──>  Talent     ──>  Grading          │
│  Perception      Modeling         Architect        │
│  (L0)            (L1+L2)          (L2)             │
│    |HITL           |HITL            |HITL           │
│                                                   │
│                   Agent 4          Agent 5         │
│              ──>  Evaluation ──>  Compensation     │
│                   Architect        Architect        │
│                   (L2)             (L2)             │
│                     |HITL            |HITL          │
└───────────────────────────────────────────────────┘
                        |
                        ▼
┌─────────────────── 実行フェーズ ───────────────────┐
│                                                   │
│  Agent 6                    Agent 7               │
│  PolicyDocument       ──>  Deployment             │
│  (L3)                      Planner                │
│    |HITL                    (L3)                   │
│                              |HITL                 │
└───────────────────────────────────────────────────┘
                        |
                        ▼
                    【制度運用】
                        |
                        ▼
┌─────────────────── 内省フェーズ ───────────────────┐
│                                                   │
│  Agent 8: ReflectionAgent (L4)                    │
│  - HITL 修正分析                                   │
│  - 運用結果評価                                    │
│  - 制度改定提案 ──> |HITL ──> 設計フェーズに戻る    │
│  - Knowledge 更新                                  │
└───────────────────────────────────────────────────┘
```

## 3. システムアーキテクチャ

### 3.1 全体構成

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer (FastAPI)                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Companies│  │Policies │  │ Reviews │  │ Reports │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        |            |            |            |
┌───────▼────────────▼────────────▼────────────▼──────────────┐
│                     Orchestrator (DAG)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Task Router / Dependency Resolution / HITL Control  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           |
        ┌──────────────────┼──────────────────┐
        |                  |                  |
┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐
│ Design Agents │  │ Execution     │  │ Reflection    │
│ (Agent 1-5)   │  │ Agents (6-7)  │  │ Agent (8)     │
└───────────────┘  └───────────────┘  └───────────────┘
        |                  |                  |
┌───────▼──────────────────▼──────────────────▼───────────────┐
│                    Infrastructure Layer                       │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐      │
│  │  Redis  │  │ RabbitMQ │  │PostgreSQL│  │  Vault  │      │
│  │(作業記憶)│  │(メッセージ)│  │(長期記憶) │  │(秘密管理)│      │
│  └─────────┘  └──────────┘  └──────────┘  └─────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 コンポーネント責務

| コンポーネント | 責務 |
|---|---|
| API Layer | REST API エンドポイントの提供。企業登録、制度操作、レビュー管理 |
| Orchestrator | ワークフローの DAG 管理。エージェント間の依存関係解決、HITL 待ち制御 |
| Design Agents | 企業コンテキスト収集から報酬制度設計までの知的処理 |
| Execution Agents | 設計結果のドキュメント化と導入計画策定 |
| Reflection Agent | HITL 修正分析、運用評価、Knowledge 更新 |
| Redis | 作業記憶（進行中のワークフロー状態、エージェント中間出力）。TTL 7 日 |
| RabbitMQ | エージェント間の非同期メッセージング |
| PostgreSQL | 長期記憶（企業別の学習）、評価記憶（HITL 修正履歴、制度運用 KPI） |
| Vault | API キー等の秘密情報管理 |

## 4. Human-in-the-Loop ワークフロー

### 4.1 HITL ゲート一覧

| Gate ID | タイミング | 必要なアクション | タイムアウト |
|---|---|---|---|
| HITL-001 | 企業コンテキスト確認後 | 分析結果の確認 | 72 時間 |
| HITL-002 | 求める人材像生成後 | 承認/差し戻し | 72 時間 |
| HITL-003 | 等級制度案生成後 | 承認/差し戻し | 72 時間 |
| HITL-004 | 評価制度案生成後 | 承認/差し戻し | 72 時間 |
| HITL-005 | 報酬制度案生成後 | 承認/差し戻し | 72 時間 |
| HITL-006 | コンプライアンスチェック後 | リスク確認 | 48 時間 |
| HITL-007 | ドキュメント生成後 | 最終承認 | 48 時間 |
| HITL-008 | 導入計画策定後（v2） | 計画承認 | 72 時間 |
| HITL-009 | 制度改定提案後（v2） | 改定承認 | 72 時間 |

### 4.2 制度設計の依存関係

```
求める人材像 (HITL-002)
    | 承認後
    ▼
等級制度 (HITL-003)
    ├── 等級階層の定義
    ├── 3 つのコンピテンシー
    ├── コンピテンシー要素（各 2 つ、計 6 個）
    └── 等級別・コンピテンシー別の卒業要件
    | 承認後
    ▼
評価制度 (HITL-004)
    | 承認後
    ▼
報酬制度 (HITL-005)
```

各制度は前のステップの承認を前提とする。差し戻しが発生した場合、該当ステップからやり直しとなる。

### 4.3 二重フィルタリング

Neural Organization の Governance 原則に基づき、HITL ゲートに到達する前にシステムが自己評価を行う。

```
エージェント出力
  → 品質チェック（4 段階: 基準適合、論理整合性、安全性、最適化）
    → パスしたもののみ → HITL Gate（人間の判断）
```

人間は「フォーマットの正しさ」「数値の誤り」を確認する必要がない。「この制度は我が社の文化に合っているか」「この報酬水準で人材を獲得できるか」など、**人間にしかできない価値判断**に集中する。

### 4.4 Trust Score による動的制御（v2）

| Trust Score | ゲートの挙動 |
|---|---|
| 0.00 - 0.39（Cold Start） | 全ゲートで承認必要。初回利用企業のデフォルト |
| 0.40 - 0.69（Learning） | Agent 1, 6, 7 のゲートを自動パス可能 |
| 0.70 - 0.89（Trusted） | Agent 2, 3, 4 も自動パス可能。Agent 5, 8 のみ承認必要 |
| 0.90 - 1.00（Highly Trusted） | Agent 8 の制度改定提案のみ承認必要 |

Trust Score は企業別に蓄積される。A 社で Trusted でも B 社では Cold Start から始まる。

## 5. Memory 設計

### 5.1 3 構造記憶

| 構造 | 技術 | 内容 | TTL |
|---|---|---|---|
| 長期記憶 | PostgreSQL + ベクトル DB | Knowledge Layer、企業別の暗黙の価値観、制度設計パターン | 永続 |
| 作業記憶 | Redis | 進行中のワークフロー状態、エージェント中間出力、HITL 待ち状態 | 7 日 → 長期記憶に昇格判定 |
| 評価記憶 | PostgreSQL（時系列） | 制度運用 KPI、HITL 修正履歴、エージェント出力の品質スコア | 3 年 → 統計パターンに集約 |

### 5.2 Memory スキーマ（v2 PostgreSQL）

```sql
-- 長期記憶: 企業別の学習
CREATE TABLE organizational_learnings (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    learning_type VARCHAR(50) NOT NULL,  -- 'value', 'preference', 'pattern', 'constraint'
    content TEXT NOT NULL,
    source VARCHAR(50) NOT NULL,         -- 'hitl_modification', 'operation_result', 'reflection'
    confidence FLOAT NOT NULL DEFAULT 0.5,
    created_at TIMESTAMP NOT NULL,
    last_validated_at TIMESTAMP,
    validation_count INT DEFAULT 0
);

-- 評価記憶: HITL 修正履歴
CREATE TABLE hitl_modifications (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    workflow_id UUID NOT NULL,
    gate_id VARCHAR(50) NOT NULL,
    agent_type VARCHAR(50) NOT NULL,
    original_output JSONB NOT NULL,
    modified_output JSONB,
    modification_type VARCHAR(50) NOT NULL,  -- 'approved', 'modified', 'rejected'
    feedback TEXT,
    decided_by VARCHAR(100),
    decided_at TIMESTAMP NOT NULL
);

-- 評価記憶: 制度運用 KPI
CREATE TABLE policy_metrics (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    metric_type VARCHAR(50) NOT NULL,        -- 'turnover_rate', 'eval_distribution', 'promotion_rate'
    metric_value JSONB NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    recorded_at TIMESTAMP NOT NULL
);
```

### 5.3 v1 → v2 の移行

| v1 | v2 |
|---|---|
| Redis のみ（TTL 7 日で揮発） | Redis（作業記憶）+ PostgreSQL（長期/評価記憶） |
| JSONL ファイル（空） | PostgreSQL テーブルに構造化して永続化 |
| Knowledge なし | `knowledge/` に 6 フレームワークを YAML 格納 |

## 6. データモデル

### 6.1 コアエンティティ

```
Company (1) ─────┬──── (1) IdealTalentProfile
                 |              |
                 |              ▼ depends on
                 ├──── (1) GradingSystem
                 |              |
                 |              ├── (3) Competency
                 |              |       └── (2) CompetencyElement
                 |              |
                 |              └── (N) Grade
                 |                      └── (N) GraduationRequirement
                 |              |
                 |              ▼ depends on
                 ├──── (1) EvaluationSystem
                 |              |
                 |              ▼ depends on
                 └──── (1) CompensationSystem
```

### 6.2 主要なエンティティ

| エンティティ | 説明 |
|---|---|
| Company | 企業情報（業種、従業員数、経営理念、課題） |
| IdealTalentProfile | 求める人材像（ビジョン、価値観、期待行動） |
| Competency | コンピテンシー（3 つ定義、各 2 要素） |
| GradingSystem | 等級制度（等級階層、卒業要件） |
| EvaluationSystem | 評価制度（評価方式、評価期間、基準） |
| CompensationSystem | 報酬制度（サラリーバンド、賞与、手当） |
| ReviewTask | HITL レビュータスク（承認/差し戻し/タイムアウト） |

## 7. 共有記憶基盤

### 7.1 書き込み（他プロジェクトに提供）

| データ | 消費者 | 活用例 |
|---|---|---|
| 等級定義 | neumann | 報告者の等級に応じた報告品質基準の動的調整 |
| コンピテンシー定義 | neumann | 等級別の行動期待値を参照した検知精度向上 |
| 評価結果データ | ai-executive-dashboard | 組織能力の経時的変化を経営レポートに反映 |
| 制度改定履歴 | 全プロジェクト | 組織の長期記憶の一部として |

### 7.2 読み出し（他プロジェクトから取得）

| データ | 提供元 | 活用例 |
|---|---|---|
| 報告品質スコア | neumann | コンピテンシー定義の改善提案 |
| 市場トレンド | ai-executive-dashboard | 報酬制度の市場整合性評価 |

### 7.3 接続インターフェース（v2）

```
REST API:
  GET  /api/v2/knowledge/grading/{company_id}       等級定義
  GET  /api/v2/knowledge/competencies/{company_id}   コンピテンシー定義
  GET  /api/v2/metrics/evaluations/{company_id}      評価結果データ
  POST /api/v2/events/policy-updated                 制度更新イベント
```
