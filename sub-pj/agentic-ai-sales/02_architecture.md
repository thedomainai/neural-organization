# Sales Presentation Automator - 技術アーキテクチャ

> 本ドキュメントは agentic-ai-sales の技術アーキテクチャを定義する。コンセプトは [01_concept.md](01_concept.md)、実装ガイドは [03_implementation.md](03_implementation.md) を参照。

## 1. Neural Organization 5層マッピング

agentic-ai-sales のレベニューサイクル最適化は、Neural Organization の 5 層アーキテクチャ（L0 Perception ~ L4 Reflection）に準拠して設計する。横断的要素として Purpose、Governance、Memory、Orchestration が全層に作用する。

```
 Purpose ────────────────────────────── Governance
 (事業計画: 売上目標 + GTM 戦略               (Trust Score × ゲート)
  + ICP 定義 + 価値提案)                         │
        │                                       │
        ▼                                       │
┌──────────────────────────────────────────────────────────┐
│  L0: Perception（知覚）                                    │
│  ● リードデータ取得（マーケ施策、Web行動、インバウンド）      │
│  ● CRM パイプラインデータ（商談ステージ、活動履歴）          │
│  ● プロダクト利用データ（利用状況、機能活用率、ログイン頻度）│
│  ● 顧客の声（サポートチケット、NPS、問い合わせ）            │
│  ● 市場データ（競合動向、業界トレンド）                     │
├──────────────────────────────────────────────────────────┤
│  L1: Understanding（理解）                                 │
│  ● リードスコアリング（ICP 適合度 × エンゲージメント）       │
│  ● 顧客ジャーニーマッピング（現在のステージ + 次の転換点）   │
│  ● 顧客健全性スコアリング（利用状況 × 満足度 × 成長性）     │
│  ● 解約リスク予測（行動シグナル + 感情シグナル）             │
│  ● プロダクトフィードバック構造化（要望分類 + 優先度）       │
├──────────────────────────────────────────────────────────┤
│  L2: Reasoning（推論）                                     │
│  ● リード優先度判断（LTV/CAC 最適化）                       │
│  ● 商談戦略立案（ステージ別の最適アプローチ）                │
│  ● 提案戦略（フレームワーク選択 + ストーリー構成）           │
│  ● 価格戦略（顧客価値 × 市場環境 × 競合状況）              │
│  ● アップセル/クロスセル機会特定（タイミング × 商材 × 表現） │
│  ● プロダクトロードマップ提案（フィードバック → 機能優先度） │
├──────────────────────────────────────────────────────────┤
│  L3: Execution（実行）                                     │
│  ● プレゼン資料生成（← v1 の SPIN 生成がここ）              │
│  ● 提案書・見積書生成                                      │
│  ● アウトリーチメール/メッセージ生成                        │
│  ● CS コミュニケーション生成                                │
│  ● プロダクトフィードバックレポート生成                     │
├──────────────────────────────────────────────────────────┤
│  L4: Reflection（内省）                                    │
│  ● Win/Loss 分析（受注/失注の要因分析）                     │
│  ● 提案効果測定（どのスライド/メッセージが効果的だったか）   │
│  ● CS 施策効果測定（解約防止/エクスパンションの実績）        │
│  ● 勝ちパターン/負けパターンの自動抽出 → Knowledge 更新     │
│  ● フィードバック→プロダクト反映の追跡                      │
└──────────────────────────────────────────────────────────┘
       ▲                                      ▲
  Memory                                 Orchestration
  ● 長期: 勝ち/負けパターン辞書         ● パイプライン駆動
        + 顧客エンティティモデル          （ステージ変化がトリガー）
        + ICP プロファイル               ● CS サイクル（月次/四半期）
  ● 作業: 進行中の商談文脈              ● アラート駆動
  ● 評価: 受注率推移、解約率推移           （解約リスク検知等）
```

### 1.1 v1 における実装範囲

v1（現在の MVP）では、5 層のうち以下のサブセットを実装する。

| レイヤー | v1 の実装範囲 | v2 での拡張 |
|---------|-------------|------------|
| L0: Perception | CLI からの手動入力（顧客情報、商談コンテキスト） | CRM連携、Web自動取得、プロダクト利用データ |
| L1: Understanding | 入力された課題仮説の構造化 | リードスコアリング、顧客ジャーニー、解約リスク |
| L2: Reasoning | SPIN フレームワークによるストーリー構成 | 複数フレームワーク、商談戦略、価格戦略 |
| L3: Execution | PPTX プレゼン資料生成 | 提案書、見積書、メール、CSコミュニケーション |
| L4: Reflection | （未実装） | Win/Loss分析、パターン学習、予測モデル更新 |

### 1.2 SPIN フレームワークの層別マッピング

v1 のコア機能である SPIN フレームワークは、5 層に以下のように分布する。

| SPIN 要素 | レイヤー | 処理内容 |
|-----------|---------|---------|
| Situation（状況） | L0 + L1 | 顧客情報の取得と構造化。業界、規模、現状の把握 |
| Problem（問題） | L1 + L2 | 課題仮説の解釈と深堀り。潜在課題の推論 |
| Implication（影響） | L2 | 課題を放置した場合の影響を推論。ビジネスインパクトの定量化 |
| Need-payoff（解決価値） | L2 + L3 | 解決策の価値提案を設計し、スライドとして実行・出力 |

### 1.3 プレゼン生成パイプラインの層別マッピング

01_concept.md で定義した 6 段階パイプラインと 5 層の対応関係。

| パイプライン | レイヤー | 処理内容 |
|-------------|---------|---------|
| Phase 1: 情報収集・分析 | L0 Perception | インプット取得、データソース参照 |
| Phase 2: 戦略立案 | L2 Reasoning | フレームワーク選択、キーメッセージ決定 |
| Phase 3: 構成設計 | L2 Reasoning | スライド構成、時間配分設計 |
| Phase 4: コンテンツ生成 | L3 Execution | テキスト、図表、画像の生成 |
| Phase 5: デザイン適用 | L3 Execution | テンプレート適用、ブランドガイドライン準拠 |
| Phase 6: 品質保証 | L4 Reflection | 制約チェック、ファクトチェック、最終レビュー |

## 2. エージェント構成

### 2.1 v1 エージェント階層

v1 では以下のエージェント構成でプレゼン資料生成を実現する。

```
エージェント階層（v1）
│
├── Orchestrator Agent
│   ├── 役割: 全体制御、エージェント調整
│   ├── 判断: どのエージェントを呼ぶか
│   └── 状態管理: 生成プロセスの進行管理
│
├── Planning Agents
│   ├── Customer Analyst Agent
│   │   └── 顧客情報分析、課題仮説生成
│   ├── Strategy Agent
│   │   └── ストーリー戦略立案
│   └── Structure Agent
│       └── スライド構成設計
│
├── Content Agents
│   ├── Messaging Agent
│   │   └── キーメッセージ、見出し生成
│   ├── Body Writer Agent
│   │   └── 本文テキスト生成
│   ├── Data Visualization Agent
│   │   └── グラフ、表生成
│   ├── Diagram Agent
│   │   └── 図解、フロー図生成
│   └── Image Agent
│       └── 画像選定、生成
│
├── Quality Agents
│   ├── Fact Checker Agent
│   │   └── 事実確認、数値検証
│   ├── Brand Checker Agent
│   │   └── ブランドガイドライン準拠確認
│   ├── Constraint Checker Agent
│   │   └── 制約違反チェック
│   └── Reviewer Agent
│       └── 全体レビュー、改善提案
│
└── Utility Agents
    ├── Data Fetcher Agent
    │   └── 外部データ取得
    ├── Template Agent
    │   └── テンプレート適用
    └── Export Agent
        └── 各形式への出力
```

### 2.2 v2 エージェント一覧

v2 ではレベニューサイクルの 7 工程 + 内省に対応する 10 のエージェントに拡張する。

```
【リード獲得 + 商談化】
  Agent 1: LeadIntelligenceAgent        リードスコアリング + 優先度判断
  Agent 2: OutreachAgent                初回アプローチの最適化

【提案 + 受注】
  Agent 3: DealStrategyAgent            商談戦略の立案
  Agent 4: ProposalAgent                提案資料生成（v1 の SPIN 生成を内包）
  Agent 5: PricingAgent                 価格戦略の最適化

【CS + アップセル/クロスセル】
  Agent 6: CustomerHealthAgent          顧客健全性の監視
  Agent 7: ExpansionAgent               アップセル/クロスセル機会の特定 + 提案

【プロダクトフィードバック】
  Agent 8: ProductFeedbackAgent         顧客の声 → プロダクトロードマップへの還元

【実行支援】
  Agent 9: ContentGeneratorAgent        全工程のコンテンツ生成

【内省】
  Agent 10: RevenueCycleReflectionAgent  Win/Loss 分析 + パターン学習
```

v1 のエージェント（2.1 節）は Agent 4（ProposalAgent）の内部構成として継続する。詳細は [docs/design-v2-revenue-cycle.md](docs/design-v2-revenue-cycle.md) を参照。

## 3. ツール・スキル定義

### 3.1 ツール（外部システム連携）

```
Tools
├── データ取得系
│   ├── crm_connector: CRMからデータ取得
│   ├── company_db_connector: 企業DBから情報取得
│   ├── web_scraper: Webから情報取得
│   └── document_retriever: 社内文書検索
│
├── 生成系
│   ├── text_generator: テキスト生成（LLM）
│   ├── chart_generator: グラフ生成
│   ├── diagram_generator: 図解生成
│   ├── image_generator: 画像生成
│   └── table_generator: 表生成
│
├── レンダリング系
│   ├── pptx_renderer: PowerPoint出力
│   ├── google_slides_renderer: Google Slides出力
│   ├── pdf_renderer: PDF出力
│   └── html_renderer: Web出力
│
└── 検証系
    ├── fact_checker: 事実検証
    ├── brand_validator: ブランド準拠確認
    └── constraint_validator: 制約チェック
```

### 3.2 スキル（複合タスク）

```
Skills
├── customer_analysis: 顧客分析スキル
├── story_building: ストーリー構築スキル
├── slide_composition: スライド作成スキル
├── data_visualization: データ可視化スキル
└── quality_assurance: 品質保証スキル
```

## 4. MCP（Model Context Protocol）設計

```
MCP Servers
├── crm-server
│   ├── resources: accounts, opportunities, contacts, activities
│   └── tools: search_accounts, get_opportunity, list_activities
│
├── knowledge-server
│   ├── resources: products, cases, competitors, faqs
│   └── tools: search_knowledge, get_case_study, get_competitor_info
│
├── company-data-server
│   ├── resources: company_profiles, financials, news
│   └── tools: get_company_info, search_news, get_financials
│
├── design-server
│   ├── resources: templates, brand_guidelines, assets
│   └── tools: get_template, validate_brand, get_asset
│
└── presentation-server
    ├── resources: presentations, slides
    └── tools: create_presentation, add_slide, render_output
```

## 5. Memory 設計

### 5.1 3 構造

| 構造 | 内容 | 技術 |
|------|------|------|
| 長期記憶 | 勝ち/負けパターン辞書、ICP プロファイル、顧客エンティティモデル、業界別ベストプラクティス、提案テンプレートライブラリ | PostgreSQL + ベクトル DB |
| 作業記憶 | 進行中の商談文脈、作成中の提案資料の状態、HITL 待ち | Redis |
| 評価記憶 | 受注率推移、解約率推移、各スコアリングモデルの精度推移、チャネル別 ROAS 推移 | PostgreSQL（時系列） |

### 5.2 勝ちパターン辞書の例

```yaml
pattern_id: "wp-saas-50-cto"
name: "SaaS中規模・CTO直接商談パターン"
conditions:
  industry: "IT・ソフトウェア"
  company_size: "51-300名"
  key_person_role: "CTO"
success_factors:
  - "初回商談でCTOと直接対話"
  - "ROI定量化スライドを提示"
  - "同業界の具体的事例を2件以上提示"
  - "技術的なデモを含む"
anti_patterns:
  - "営業のみで技術者が不在"
  - "価格から入る"
average_deal_size: 5000000
average_lead_time_days: 42
win_rate: 0.68
sample_count: 15
```

## 6. Governance 設計

### 6.1 HITL ゲート一覧

| Gate ID | ゲート名 | エージェント | 承認者 | 不可逆性 |
|---------|---------|------------|-------|---------|
| RC-001 | OUTREACH_PLAN | OutreachAgent | 営業マネージャー | 中（対外送信） |
| RC-002 | DEAL_STRATEGY | DealStrategyAgent | 営業マネージャー | 低 |
| RC-003 | PROPOSAL_REVIEW | ProposalAgent | 営業マネージャー | 高（対外提示） |
| RC-004 | PRICING_STRATEGY | PricingAgent | Governor（経営層） | 高（価格コミット） |
| RC-005 | EXPANSION_PLAN | ExpansionAgent | CS マネージャー | 中 |
| RC-006 | PRODUCT_FEEDBACK | ProductFeedbackAgent | プロダクトマネージャー | 低 |
| RC-007 | REFLECTION_REVIEW | ReflectionAgent | Governor | 低 |

### 6.2 Trust Score の適用

| 因子 | 測定方法 |
|------|---------|
| 成功率 | 提案が修正なしで承認された割合 |
| 結果品質 | 提案→受注の転換率、予測精度 |
| 整合性 | GTM 戦略・ブランドガイドラインとの整合割合 |
| リスク管理 | 禁止表現・機密情報漏洩をエスカレーションした割合 |

## 7. 技術スタック

### 7.1 v1（CLI MVP）

```
CLI（MVP）
├── Runtime: Python 3.11+
├── CLI Framework: Click
├── LLM: Claude API (claude-3-5-sonnet)
├── Data Models: Pydantic
├── Output: python-pptx
└── Config: YAML
```

### 7.2 v2（将来のSaaS化）

```
将来のSaaS化
├── Frontend: Next.js + TypeScript
├── Backend: FastAPI
├── Database: PostgreSQL + pgvector
├── Queue: Redis + Bull
├── Storage: S3 / GCS
├── Auth: Auth0 / Clerk
└── Infra: GCP + Kubernetes
```

## 8. 共有記憶基盤への接続

### 8.1 書き込み（他プロジェクトに提供するデータ）

| データ | 消費者 | 活用例 |
|--------|-------|-------|
| 受注/失注データ | ai-executive-dashboard | 経営ダッシュボードの売上セクション |
| 顧客健全性データ | ai-executive-dashboard | 経営レポートの顧客基盤セクション |
| プロダクトフィードバック | プロダクトチーム | ロードマップの優先度判断 |
| 営業活動データ | neumann | 経営管理サイクルの KPI 実績入力 |

### 8.2 読み出し（他プロジェクトから取得するデータ）

| データ | 提供元 | 活用例 |
|--------|-------|-------|
| 市場トレンド | ai-executive-dashboard | 提案の文脈付け（「業界では〜」） |
| 等級データ | agentic-ai-hr | 営業担当者のスキルレベルに応じた支援度調整 |
| 報告品質データ | neumann | 営業マネージャーの報告品質 → 商談管理の精度指標 |

## 9. ディレクトリ構造

```
agentic-ai-sales/
├── README.md               # プロジェクト概要（英語）
├── 00_overview.md           # WHY / WHO / WHAT / Status
├── 01_concept.md            # コンセプト詳細
├── 02_architecture.md       # 本ドキュメント
├── 03_implementation.md     # 実装ガイド
├── docs/
│   └── design-v2-revenue-cycle.md  # v2 設計
├── src/spa/
│   ├── cli.py               # CLIエントリポイント
│   ├── models.py            # データモデル（Pydantic）
│   ├── llm_client.py        # Claude API統合
│   ├── pptx_generator.py    # PowerPoint生成
│   ├── agents/              # エージェント実装
│   ├── templates/           # テンプレート
│   ├── tools/               # ツール実装
│   └── utils/               # ユーティリティ
├── data/
│   └── prompts/             # プロンプトテンプレート
├── config/
│   └── settings.yaml        # 設定
└── tests/                   # テスト
```
