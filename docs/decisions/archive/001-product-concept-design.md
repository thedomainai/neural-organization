# Neural Organization プロダクトコンセプト設計

## 問い

Neural Organization を「あらゆる企業が AX を進められるプロダクト」として実現するために、どのようなアーキテクチャ・機能体系・市場展開戦略・差別化軸で構成すべきか。

## 論点

1. アーキテクチャをどのようなレイヤー構造で設計するか
2. 各職種にどのような AI 機能（エージェント）を提供するか
3. どの順序・戦略で市場に展開するか（Go-to-Market）
4. 差別化の軸をどこに置くか

## 論点分解

### 論点 1: アーキテクチャ設計

- AX の 4 フェーズ（データ基盤 → オペレーション → オーケストレーション → 運用）をどうレイヤーに対応させるか
- 各レイヤーにどのようなコンポーネントを配置するか
- レイヤー間の依存関係と疎結合性をどう担保するか

### 論点 2: 職種別 AI 機能

- スコープ内の全職種（プロダクト企画・デザイン・開発、マーケ、営業、CS、保守運用、人事、ファイナンス、バックオフィス）をどう網羅するか
- 各職種でどの業務を AI エージェント化すべきか
- エージェント間の連携（組織横断）をどう設計するか

### 論点 3: Go-to-Market

- 初期ターゲットをどの業種・職種に絞るか
- PLG か SLG か、あるいはハイブリッドか
- フェーズ間の移行をどう設計するか

### 論点 4: 差別化軸

- 技術（AI モデル性能）で差別化するか、UX で差別化するか、エコシステムで差別化するか
- AI と人間の協働体験をどう設計するか
- 参入障壁をどこに構築するか

## 仮説構築

### 論点 1: アーキテクチャ

5 レイヤー構成とし、AX フェーズとの対応を明確にする。

| レイヤー | 役割 | 対応する AX フェーズ |
|---|---|---|
| Data Foundation Layer（基盤層） | データ接続・統合・ガバナンス | Phase 1 |
| AI Engine Layer（知能層） | LLM ゲートウェイ・プロンプト管理・評価 | 横断基盤 |
| Operation Layer（業務層） | エージェント実行・ワークフロー・HITL | Phase 2 |
| Orchestration Layer（統制層） | マルチエージェント協調・意思決定ルーティング | Phase 3-4 |
| Interface Layer（体験層） | 会話 UI・ダッシュボード・ノーコードビルダー | 全フェーズ |

### 論点 2: 職種別 AI 機能

10 職種 × 各 4 エージェントで計 40 エージェントの体系を定義。すべて Operation Layer 上で稼働し、Orchestration Layer で横断連携する。

| 職種 | 代表的エージェント |
|---|---|
| プロダクト（企画） | Market Intelligence, Feature Prioritization, Spec Drafting, Impact Simulator |
| プロダクト（デザイン） | Design Research, UI Generation, Accessibility Checker, Design System Guardian |
| プロダクト（開発） | Code Agent, CI/CD Intelligence, Incident Responder, Tech Debt Analyst |
| マーケティング | Content Engine, Campaign Orchestrator, Attribution Analyzer, Persona Synthesizer |
| 営業 | Lead Scoring, Deal Coach, Proposal Generator, Forecast Agent |
| カスタマーサクセス | Health Score, Churn Predictor, Onboarding Copilot, QBR Preparer |
| 保守運用 | Monitoring Intelligence, Auto-remediation, Capacity Planner, Change Risk Assessor |
| 人事組織 | Talent Acquisition, People Analytics, Learning Curator, Organization Designer |
| ファイナンス | Expense Processor, Budget Intelligence, Financial Forecasting, Audit Preparation |
| バックオフィス | Contract Analyzer, Compliance Monitor, Procurement Agent, Facility & IT Helpdesk |

### 論点 3: Go-to-Market

4 フェーズの段階的展開とする。

| フェーズ | 期間 | テーマ | ターゲット |
|---|---|---|---|
| α Foundation | 0-6M | データ接続＋単一業務 AI 化 | テック・SaaS 企業の CS/営業 |
| β Expansion | 6-18M | 複数業務展開＋ワークフロー | 既存顧客他部門＋ミッドマーケット |
| γ Orchestration | 18-36M | 全社 AI オーケストレーション | エンタープライズ |
| δ Neural | 36M+ | 企業間連携＋エコシステム | AX 先進企業＋産業横断 |

### 論点 4: 差別化軸

UX を最大の競争優位に据える。

| 差別化候補 | 評価 | 採否 |
|---|---|---|
| AI モデル性能 | コモディティ化が進み、持続的優位になりにくい | 必要条件だが差別化軸にしない |
| UX（人間と AI の協働体験） | 模倣困難。企業固有のデータ蓄積と相まって参入障壁になる | 最大の差別化軸とする |
| エコシステム | 中長期的にはネットワーク効果による優位を構築可能 | Phase δ 以降の差別化軸 |

## 仮説の評価

### アーキテクチャ: 5 レイヤー構成

- **利点**: AX フェーズとの対応が明確で、顧客に段階的な導入パスを提示しやすい。レイヤー分離により独立した開発・スケーリングが可能
- **リスク**: レイヤー間通信のオーバーヘッド。初期段階で全レイヤーを構築する必要はなく、Phase α では下位 3 レイヤーに集中すべき

### 職種別 40 エージェント体系

- **利点**: 全社 AX のビジョンを具体的に示せる。職種ごとに独立した価値提供が可能
- **リスク**: 初期に全エージェントを開発するのは非現実的。Phase α では 3-5 エージェントに絞り、PMF を検証すべき

### 4 フェーズ GTM

- **利点**: 顧客の AX 成熟度に合わせた段階的拡張が可能。各フェーズで明確な価値と収益モデルを提示できる
- **リスク**: Phase α での PMF 検証が不十分だと後続フェーズが成立しない。初期ターゲットの選定が極めて重要

### UX を差別化軸とする判断

- **利点**: AI モデルのコモディティ化が進む中で持続的な優位性を構築できる。利用データの蓄積が参入障壁を形成する
- **リスク**: UX の優位性を定量的に証明しにくい。初期段階では機能の充実も求められ、UX 投資とのバランスが必要

## 結論

Neural Organization のプロダクトコンセプトを以下の 4 軸で確定する。

1. **アーキテクチャ**: Data Foundation / AI Engine / Operation / Orchestration / Interface の 5 レイヤー構成。AX フェーズと対応させ、下層から順に立ち上げる
2. **機能体系**: 10 職種 × 各 4 エージェント（計 40）の体系。初期は CS・営業・マーケの 3-5 エージェントに集中
3. **GTM**: 4 フェーズ展開（α → β → γ → δ）。Phase α は PLG でテック・SaaS 企業をターゲットとし、PMF を検証する
4. **差別化**: UX（Progressive Disclosure / Transparent Autonomy / Appropriate Trust Calibration）を最大の競争優位とする。AI 技術はコモディティ化するが、人間と AI の協働体験は模倣困難

詳細な設計は `concept.md` に記載済み。

## ネクストアクション

- [ ] Phase α で提供する初期エージェント 3-5 個の選定と仕様策定
- [ ] 技術スタック（インフラ、フレームワーク、LLM プロバイダー）の選定
- [ ] 価格モデル（フリーミアム設計、エージェント実行課金の単価設定）の詳細設計
- [ ] 初期ターゲット顧客の具体的な選定基準とリスト作成
- [ ] UX プロトタイプ（Conversational UI + Command Center）の設計

## 残論点

- **セキュリティ・コンプライアンス**: 企業データを扱う上での SOC2、ISO27001 等の認証取得計画。業界固有の規制（金融: FISC、医療: HIPAA 等）への対応方針
- **マルチテナント設計**: 企業間のデータ隔離、カスタマイズ範囲、テナントごとのモデル管理の具体設計
- **AI の品質保証**: エージェントの精度基準、ハルシネーション対策、障害時のフォールバック設計
- **組織体制**: プロダクト開発チームの構成、Phase α に必要な人員と役割
- **競合分析**: 既存の AI プラットフォーム（ServiceNow, Salesforce Einstein, Microsoft Copilot 等）との差別化ポイントの精緻化
