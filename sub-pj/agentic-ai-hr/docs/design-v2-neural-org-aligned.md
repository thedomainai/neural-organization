# HR Policy Advisor v2 — Neural Organization 準拠 Agentic AI 設計

> 本ドキュメントは、hr-system-lings の普遍的 HR フレームワーク知識と agentic-ai-hr の Agentic AI アーキテクチャを統合し、Neural Organization の思想に完全準拠した「HR 制度設計 Agentic AI」の設計を定義する。

## 1. ビジョン

### 1.1 このシステムは何か

企業の人事制度（等級・評価・報酬）を、AI と人間の協働によって**設計・導入・運用・進化**させる Agentic AI である。

現行の agentic-ai-hr v1 は「設計」までをカバーする。v2 では Neural Organization の 5 層パイプラインに沿って、**制度が組織の現実から学習し、自律的に進化し続ける**状態を実現する。

### 1.2 v1 からの根本的な変化

| 観点 | v1（現行） | v2（本設計） |
|---|---|---|
| スコープ | 制度の設計（5 段階ワークフロー → 成果物出力） | 制度の設計 → 導入 → 運用 → 進化の全ライフサイクル |
| 知識基盤 | Gemini API の汎用知識のみ | hr-system-lings の構造化フレームワーク + 蓄積された組織固有の学習 |
| 学習 | なし（生成して終わり） | Reflection による継続的学習。人間の修正から暗黙の価値観を抽出 |
| 自律性 | 固定（全 7 ゲートで毎回承認） | 段階的（Trust Score に応じてゲートの閾値が動的に変化） |
| 記憶 | Redis TTL（揮発的）| 3 構造記憶（長期 / 作業 / 評価）の永続化 |
| 他システム連携 | なし | 共有記憶基盤を通じた neumann / ai-executive-dashboard との接続 |

## 2. 知識基盤 — hr-system-lings の普遍化

hr-system-lings には LINGS 社固有の要素と、あらゆる企業に適用可能な普遍的フレームワークが混在している。v2 ではこれを分離し、普遍的フレームワークを Knowledge Layer として組み込む。

### 2.1 普遍的フレームワーク（Knowledge Layer に組み込む）

#### Framework 1: コンピテンシー・トリアド

3 領域 × 2 要素 = 6 コンピテンシーの構造。業種・企業規模を問わず適用可能。

```
思考・構想（Thinking）
  ├─ A. 課題設定（Issue Finding）
  └─ B. 構造化・計画（Structuring）

実行・行動（Action）
  ├─ C. スピード（Speed）
  └─ D. 品質（Quality）

影響・対人（Relation）
  ├─ E. 受信・傾聴（Listening）
  └─ F. 発信・伝達（Delivery）
```

**v2 での活用**: TalentProfileGeneratorAgent がコンピテンシーを設計する際の**メタテンプレート**。企業の業種・文化に応じて要素名・重みをカスタマイズするが、3 領域の構造は不変の骨格として使用する。

#### Framework 2: スコープベース等級モデル

責任範囲（Scope of Impact）で等級を定義する 8 段階モデル。

| 段階 | スコープ | 概念 |
|---|---|---|
| 8 | 業界・社会 | 産業構造の再定義 |
| 7 | 全社・経営 | 経営資源の最適配分 |
| 6 | 本部・事業部 | 事業戦略・構造改革 |
| 5 | 部・機能 | 年単位の KPI 達成 |
| 4 | プロジェクト群 | 複数チーム横断支援 |
| 3 | チームリード | 単一チーム統括 |
| 2 | 自律・技術牽引 | 専門性 + リード支援 |
| 1 | タスク・定型業務 | 基本動作習得 |

**v2 での活用**: GradingDesignerAgent が等級を設計する際の**参照モデル**。企業規模に応じて 4〜8 段階を選択し、スコープ定義をカスタマイズする。v1 の J1/J2/S1/S2 命名よりも、スコープに基づく設計が本質的。

#### Framework 3: コンピテンシー進化マトリクス

各コンピテンシーが等級ごとにどう進化するかの 8 段階記述。

```
例: 課題設定（Issue Finding）の進化
  G1: 違和感のアラート → 異常に気づいて報告できる
  G2: 自律的な解決策提示 → 複数案を持って上司に相談
  G3: チーム課題の発見 → 改善テーマを自ら設定
  G4: プロジェクト群の最適化 → 横断的課題を発見
  G5: 部門方針の策定 → 戦略を KPI に落とし込む
  G6: 構造的課題の特定 → 根本原因を見抜く
  G7: 事業創造と破壊 → ピボット判断をする
  G8: 産業構造の再定義 → 業界ルール自体を書き換える
```

**v2 での活用**: 等級別の期待行動を生成する際の**パターンライブラリ**。企業固有のコンピテンシー名に対して、この進化パターンをテンプレートとして適用する。

#### Framework 4: 3 ゲート評価システム

昇格判定の 3 段階ゲート。

```
ゲート 1: 成果評価（チケット）      → 目標達成度が基準以上
ゲート 2: 行動評価（ゲートキーパー）  → バリュー体現度が基準以上（× は即足切り）
ゲート 3: コンピテンシー評価（卒業要件）→ 全領域で基準以上
```

5 段階採点: Outstanding(5) / Exceed(4) / Meet(3) / Below(2) / Unsatisfactory(1)

**v2 での活用**: EvaluationDesignerAgent が評価制度を設計する際の**設計パターン**。v1 の S/A/B/C/D 評定をこの 5 段階に統合し、3 ゲートの構造を推奨デフォルトとする。

#### Framework 5: 報酬設計の 3 つの究極の問い

```
Q1: 評価ソース — Competency（能力）vs. Role（職務）?
Q2: 報酬ロジック — Accumulation（安定性）vs. Wash-replacement（市場競争力）?
Q3: 管理定義 — Status（階級）vs. Function（機能）?
```

**v2 での活用**: CompensationDesignerAgent が報酬制度を設計する前に、Governor に対してこの 3 つの問いを提示し、方針を明確化する。これにより「Intent over Instruction」— 指示ではなく意志を受け取る設計が実現する。

#### Framework 6: 4 フェーズ運用体系

```
Phase 0: 準備・合意（マネージャー先行説明会、ツール整備）
Phase 1: 展開（全社 Town Hall、FAQ 設置）
Phase 2: 導入・移行（初期格付け、キャリブレーション、激変緩和）
Phase 3: 運用サイクル（期初ミッションレター → 期中 1on1 → 期末評価 → フィードバック）
Phase 4: メンテナンス（制度サーベイ、マイナーアップデート）
```

**v2 での活用**: v1 にはなかった**設計後のライフサイクル**をカバーする新エージェント群の基盤。

### 2.2 除外する LINGS 固有要素

| 要素 | 内容 | 除外理由 |
|---|---|---|
| 具体的年俸テーブル | G1: 300〜340 万 〜 G8: 1,800〜2,200 万 | 企業の予算・市場・業種に依存 |
| 役職手当の金額 | 本部長 +10 万、部長 +7 万、リーダー +3 万 | 同上 |
| 評価サイクル日程 | 上期 12〜5 月、下期 6〜11 月 | 企業の会計年度に依存 |
| 会社名・ブランディング | 「LINGs 人事制度 ver1.0」 | 自明 |
| ボーナス廃止方針 | 年俸制への一本化 | 経営方針として個社判断 |

これらは Knowledge Layer に「パラメータ化されたテンプレート」として保持し、企業ごとに Governor が値を設定する。

## 3. 5 層アーキテクチャへのマッピング

### 3.1 全体像

```
 Purpose ─────────────────────────────────── Governance
 (企業の Mission/Vision/Values               (Trust Score × 7+α ゲート)
  + 3 つの究極の問いへの回答)                     │
        │                                       │
        ▼                                       │
┌──────────────────────────────────────────────────────────┐
│  L0: Perception（知覚）                                    │
│  ● 企業コンテキスト収集（業種、規模、現行制度、課題）         │
│  ● 外部データ取り込み（労働市場、法規制、業界標準報酬）       │
│  ● 運用データ収集（評価結果、離職率、従業員サーベイ）         │
├──────────────────────────────────────────────────────────┤
│  L1: Understanding（理解）                                 │
│  ● 組織能力の構造化（コンピテンシー・トリアドへのマッピング）   │
│  ● 現行制度の因果分析（制度設計 ↔ 人材行動 ↔ 組織成果）      │
│  ● 業界ベンチマーク比較（報酬水準、等級数、評価方式）         │
├──────────────────────────────────────────────────────────┤
│  L2: Reasoning（推論）                                     │
│  ● 求める人材像の設計（コンピテンシーモデリング）              │
│  ● 等級制度の設計（スコープベースモデル適用）                 │
│  ● 評価制度の設計（3 ゲート + 5 段階採点）                   │
│  ● 報酬制度の設計（3 つの究極の問いに基づく方針 → 設計）      │
├──────────────────────────────────────────────────────────┤
│  L3: Execution（実行）                                     │
│  ● 制度ドキュメント生成（等級定義書、評価シート、報酬テーブル） │
│  ● 導入計画の生成（Phase 0〜4 のカスタマイズ計画）            │
│  ● 運用ツール生成（ミッションレター、1on1 テンプレート）       │
│  ● 制度説明資料の生成（Town Hall 用、マネージャー向け）        │
├──────────────────────────────────────────────────────────┤
│  L4: Reflection（内省）                                    │
│  ● HITL 修正パターンの分析 → 暗黙の価値観抽出                │
│  ● 制度運用結果の評価（離職率、エンゲージメント、評価偏り）    │
│  ● 他社制度の成功/失敗パターンの蓄積 → Knowledge 更新         │
│  ● 制度改定提案の自動生成                                   │
└──────────────────────────────────────────────────────────┘
       ▲                                      ▲
  Memory                                 Orchestration
  ● 長期: フレームワーク知識                ● DAG ワークフロー
        + 組織固有の学習                   ● 依存関係解決
  ● 作業: 進行中の設計セッション            ● HITL 待ち制御
  ● 評価: 制度運用の KPI 推移              ● リソース配分
```

### 3.2 v1 との差分

| 層 | v1 の実装 | v2 で追加・強化するもの |
|---|---|---|
| L0 Perception | ContextCollectorAgent（企業情報の手動入力のみ） | 外部データソース自動接続（労働市場 API、法規制 DB）、運用データの自動取り込み |
| L1 Understanding | Gemini API による汎用分析 | Knowledge Layer（6 フレームワーク）を参照した構造的分析。因果モデルの構築 |
| L2 Reasoning | 5 エージェントの逐次設計 | フレームワークをベースにした設計 + 企業固有カスタマイズ。Purpose（3 つの究極の問い）に基づく方針駆動 |
| L3 Execution | なし（設計結果の JSON 出力のみ） | ドキュメント生成、導入計画、運用ツール生成 |
| L4 Reflection | なし | HITL 修正分析、運用結果評価、制度改定提案 |

## 4. エージェント設計

### 4.1 エージェント一覧

v1 の 5 エージェントを拡張し、3 つの新エージェントを追加する。

```
【設計フェーズ】（v1 の強化版）
  Agent 1: ContextPerceptionAgent      ← v1 ContextCollectorAgent の強化
  Agent 2: TalentModelingAgent         ← v1 TalentProfileGeneratorAgent の強化
  Agent 3: GradingArchitectAgent       ← v1 GradingDesignerAgent の強化
  Agent 4: EvaluationArchitectAgent    ← v1 EvaluationDesignerAgent の強化
  Agent 5: CompensationArchitectAgent  ← v1 CompensationDesignerAgent の強化

【実行フェーズ】（v2 新規）
  Agent 6: PolicyDocumentAgent         制度ドキュメント・ツールの生成
  Agent 7: DeploymentPlannerAgent      導入計画（Phase 0〜4）の策定

【内省フェーズ】（v2 新規）
  Agent 8: ReflectionAgent             HITL 修正分析 + 運用結果評価 + 制度改定提案
```

### 4.2 各エージェントの詳細設計

#### Agent 1: ContextPerceptionAgent（知覚）

**v1 からの変化**: 手動入力のみ → 外部データソースの自動取得を追加

```
入力:
  ● 企業基本情報（手動: 業種、規模、Mission/Vision/Values）
  ● 現行制度情報（手動 or ドキュメント読み込み）
  ● [新規] 労働市場データ（API: 業界平均報酬、求人倍率）
  ● [新規] 法規制データ（DB: 最低賃金、労基法要件）
  ● [新規] 運用データ（連携: 離職率、評価結果分布、サーベイ結果）

処理:
  1. 企業情報のバリデーション（v1 と同様）
  2. [新規] 業界標準との比較分析（Knowledge Layer のベンチマーク参照）
  3. [新規] 現行制度の課題構造化（因果モデルの初期構築）
  4. Gemini API によるコンテキスト enrichment

出力:
  ● EnrichedCompanyContext（v1 の CompanyContext + 市場データ + 因果仮説）

HITL Gate: COMPANY_CONTEXT（企業コンテキストの確認）
  Governor の問い: 「この企業理解は正確ですか？見落としている文脈はありますか？」
```

#### Agent 2: TalentModelingAgent（理解 + 推論）

**v1 からの変化**: Gemini 依存の自由生成 → コンピテンシー・トリアドをメタテンプレートとして使用

```
入力:
  ● EnrichedCompanyContext
  ● [新規] Knowledge Layer: コンピテンシー・トリアド（3 領域 × 2 要素）

処理:
  1. コンピテンシー・トリアドを基本骨格として提示
  2. 企業の Mission/Vision/Values に基づいて要素名・重みをカスタマイズ
     例: 「受信・傾聴」→ コンサル企業なら「顧客課題の深掘り」に具体化
  3. 企業固有の追加コンピテンシーの必要性を判断
  4. 各コンピテンシーの行動指標を生成

出力:
  ● TalentModel（3 領域 × 2 要素 + 企業固有拡張）
  ● [新規] 設計根拠（なぜこのカスタマイズにしたかの説明 — Radical Transparency）

HITL Gate: TALENT_MODEL
  Governor の問い: 「この人材像は、御社が目指す組織の姿と合致していますか？」
  Sensemaker の問い: 「データに表れない御社の文化や価値観で、反映すべきものはありますか？」
```

**設計原則の体現:**
- **Intent over Instruction**: 企業の Mission/Vision を受け取り、コンピテンシーを自律的に導出
- **Radical Transparency**: カスタマイズの根拠を明示

#### Agent 3: GradingArchitectAgent（推論）

**v1 からの変化**: J1/S1/M1 の固定命名 → スコープベースモデルの適用

```
入力:
  ● EnrichedCompanyContext
  ● TalentModel
  ● [新規] Knowledge Layer: スコープベース等級モデル（8 段階）
  ● [新規] Knowledge Layer: コンピテンシー進化マトリクス

処理:
  1. 企業規模に応じた等級数の決定（4〜8 段階）
  2. スコープベースモデルから該当段階を選択
  3. TalentModel の各コンピテンシーに進化マトリクスを適用
     → 等級ごとの期待行動を生成（G1 の「課題設定」は「違和感のアラート」等）
  4. キャリアトラック（マネジメント / スペシャリスト）の要否判断
  5. [新規] 3 つの究極の問い Q3（Status vs. Function）への回答を反映

出力:
  ● GradingSystem（等級定義 + スコープ + コンピテンシー期待値）
  ● [新規] 等級間の昇格要件（3 ゲートの適用基準）

HITL Gate: GRADING_SYSTEM
  Governor の問い: 「この等級構造は、組織の意思決定層の構造と整合していますか？」
```

#### Agent 4: EvaluationArchitectAgent（推論）

**v1 からの変化**: S/A/B/C/D の自由設計 → 3 ゲート評価システムを推奨デフォルトとして提示

```
入力:
  ● EnrichedCompanyContext + TalentModel + GradingSystem
  ● [新規] Knowledge Layer: 3 ゲート評価システム + 5 段階採点

処理:
  1. 3 ゲート評価システムを推奨デフォルトとして提示
     - ゲート 1: 成果評価（OKR / MBO 連動）
     - ゲート 2: 行動評価（バリュー体現度）
     - ゲート 3: コンピテンシー評価（卒業要件）
  2. 企業の状況に応じたカスタマイズ提案
     - スタートアップ: ゲート 1 の重みを増（成果重視）
     - 大企業: ゲート 2 の重みを増（文化適合重視）
  3. 等級グループ別の評価テンプレート生成
  4. 評価期間・サイクルの設計
  5. [新規] キャリブレーション方法の設計

出力:
  ● EvaluationSystem（3 ゲート構造 + 採点基準 + テンプレート）

HITL Gate: EVALUATION_SYSTEM
  Custodian の問い: 「この評価制度は公平性を担保できていますか？バイアスのリスクは？」
```

#### Agent 5: CompensationArchitectAgent（推論）

**v1 からの変化**: 業種別倍率の単純適用 → 3 つの究極の問いに基づく方針駆動設計

```
入力:
  ● EnrichedCompanyContext + GradingSystem + EvaluationSystem
  ● [新規] Knowledge Layer: 3 つの究極の問い + 報酬設計原則

処理:
  1. [新規] Purpose Interface: Governor に 3 つの究極の問いを提示
     Q1: 能力ベース vs. 職務ベース？
     Q2: 蓄積型 vs. 洗い替え型？
     Q3: 階級管理 vs. 機能管理？
  2. 回答に基づいて報酬構造の骨格を設計
  3. 等級別サラリーバンドの設計（市場データ参照）
  4. 変動報酬の設計（評価連動率の決定）
  5. 手当・福利厚生の設計

出力:
  ● CompensationSystem（方針 + 構造 + 具体的数値）

HITL Gate: COMPENSATION_SYSTEM
  Governor の問い: 「この報酬体系は、御社の経営戦略（人材獲得 vs. コスト最適化）と整合していますか？」
```

**設計原則の体現:**
- **Intent over Instruction**: 3 つの究極の問いで「意志」を受け取り、具体的な制度を自律的に導出
- **Governance not Control**: Governor は方針を設定し、詳細設計はシステムに委ねる

#### Agent 6: PolicyDocumentAgent（実行）— v2 新規

```
入力:
  ● 全設計結果（TalentModel + GradingSystem + EvaluationSystem + CompensationSystem）
  ● [新規] Knowledge Layer: 4 フェーズ運用体系

処理:
  1. 等級定義書の生成（G1〜Gn の等級別ドキュメント）
  2. コンピテンシー定義書の生成（進化マトリクス付き）
  3. 評価シートテンプレートの生成（等級グループ別）
  4. 報酬テーブルの生成
  5. 運用マニュアルの生成（Phase 3 サイクルの詳細）
  6. 制度説明資料の生成（全社 Town Hall 用 + マネージャー向け）
  7. [新規] 品質チェック（design.md §1.4 の 4 段階品質チェック準拠）
     - 基準適合: フォーマット・用語の統一
     - 論理整合性: 等級間の一貫性、報酬と評価の整合
     - 安全性: 労基法との適合確認
     - 最適化: 受け手に合わせた表現調整

出力:
  ● PolicyDocumentPackage（制度ドキュメント一式）

HITL Gate: OUTPUT_CONFIRMATION
  Custodian の問い: 「このドキュメントは従業員に公開して問題ありませんか？」
```

#### Agent 7: DeploymentPlannerAgent（実行）— v2 新規

```
入力:
  ● 全設計結果 + PolicyDocumentPackage
  ● EnrichedCompanyContext（組織の現在の状態）

処理:
  1. Phase 0〜4 のカスタマイズ
     - 現行制度からの移行が必要 → Phase 2 に激変緩和措置を追加
     - 新規制度 → Phase 2 を簡略化
  2. 初期格付けシミュレーション
     - 全従業員の現在の役職・年次から推定等級を算出
     - 報酬の増減シミュレーション
  3. タイムラインの生成
  4. リスクの特定と対策

出力:
  ● DeploymentPlan（フェーズ別計画 + タイムライン + リスク対策）

HITL Gate: DEPLOYMENT_PLAN（新設）
  Governor の問い: 「この導入計画のタイムラインは、経営の他の優先事項と整合していますか？」
```

#### Agent 8: ReflectionAgent（内省）— v2 新規・最重要

```
入力:
  ● 全 HITL 修正履歴（Memory から読み出し）
  ● 運用データ（評価結果分布、離職率、サーベイ結果）
  ● 他社の制度設計パターン（Knowledge Layer の蓄積）

処理:
  1. HITL 修正パターンの分析
     - 「Governor が報酬テーブルを 2 回連続で上方修正した」
       → 学習: 「この企業は市場の 75 パーセンタイルを目指す傾向がある」
     - 「Custodian が評価基準の表現を 3 回修正して柔らかくした」
       → 学習: 「この企業は評価の表現にケアを重視する文化」
  2. 運用結果の評価
     - 評価結果の分布分析（正規分布か、偏りがあるか）
     - 等級別の離職率分析（特定等級で高い → 制度の問題の可能性）
     - エンゲージメントサーベイとの相関分析
  3. 制度改定提案の生成
     - 「G3→G4 の昇格率が極端に低い。コンピテンシー要件の見直しを提案」
     - 「営業部門の評価が成果偏重。行動評価のウェイト増を提案」
  4. Knowledge Layer の更新
     - この企業での学習を匿名化して Knowledge に還元
     - 「SaaS 企業 50 名規模では 5 等級が最適」→ 次の同規模企業への推奨値

出力:
  ● ReflectionReport（学習内容 + 改定提案）
  ● Memory 更新（長期記憶 + 評価記憶）
  ● Knowledge Layer 更新（パターンの汎化）

HITL Gate: POLICY_REVISION（新設）
  Governor の問い: 「この制度改定提案を採用しますか？」
  → 承認された改定は Agent 3-7 に戻り、制度を更新する
```

**これが Neural Organization の核心。** concept.md §2.5 の「人間の修正行為そのものが最も価値の高い学習データ」を具体的に実装する。

### 4.3 ワークフロー全体像

```
┌─────────────────── 設計フェーズ ───────────────────┐
│                                                   │
│  Agent 1          Agent 2          Agent 3         │
│  Context    ──→  Talent     ──→  Grading          │
│  Perception      Modeling         Architect        │
│  (L0)            (L1+L2)          (L2)             │
│    │HITL           │HITL            │HITL           │
│                                                   │
│                   Agent 4          Agent 5         │
│              ──→  Evaluation ──→  Compensation     │
│                   Architect        Architect        │
│                   (L2)             (L2)             │
│                     │HITL            │HITL          │
└───────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────── 実行フェーズ ───────────────────┐
│                                                   │
│  Agent 6                    Agent 7               │
│  PolicyDocument       ──→  Deployment             │
│  (L3)                      Planner                │
│    │HITL                    (L3)                   │
│                              │HITL                 │
└───────────────────────────────────────────────────┘
                        │
                        ▼
                    【制度運用】
                        │
                        ▼
┌─────────────────── 内省フェーズ ───────────────────┐
│                                                   │
│  Agent 8: ReflectionAgent (L4)                    │
│  ● HITL 修正分析                                   │
│  ● 運用結果評価                                    │
│  ● 制度改定提案 ──→ │HITL ──→ 設計フェーズに戻る    │
│  ● Knowledge 更新                                  │
│                                                   │
└───────────────────────────────────────────────────┘
```

## 5. Memory 設計

### 5.1 3 構造の具体的内容

| 構造 | 技術 | 内容 | TTL |
|---|---|---|---|
| **長期記憶** | PostgreSQL + ベクトル DB | Knowledge Layer（6 フレームワーク）、企業別の暗黙の価値観（Reflection が抽出）、制度設計パターンの蓄積 | 永続 |
| **作業記憶** | Redis | 進行中のワークフロー状態、エージェント間の中間出力、HITL 待ち状態 | 7 日 → セッション終了時に長期記憶に昇格判定 |
| **評価記憶** | PostgreSQL（時系列） | 制度運用 KPI（離職率推移、評価分布、昇格率）、HITL 修正履歴、エージェント出力の品質スコア | 3 年 → 統計パターンに集約 |

### 5.2 v1 からの移行

| v1 | v2 |
|---|---|
| Redis のみ（TTL 7 日で揮発） | Redis（作業記憶）+ PostgreSQL（長期・評価記憶） |
| JSONL ファイル（DECISIONS/DISCOVERIES/FAILURES — 空） | PostgreSQL テーブルに構造化して永続化 |
| Knowledge なし | knowledge/ ディレクトリに 6 フレームワークを構造化データ（YAML）として格納 |

### 5.3 Memory スキーマ（PostgreSQL）

```sql
-- 長期記憶: 企業別の学習
CREATE TABLE organizational_learnings (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    learning_type VARCHAR(50) NOT NULL,  -- 'value', 'preference', 'pattern', 'constraint'
    content TEXT NOT NULL,
    source VARCHAR(50) NOT NULL,  -- 'hitl_modification', 'operation_result', 'reflection'
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
    metric_type VARCHAR(50) NOT NULL,  -- 'turnover_rate', 'eval_distribution', 'promotion_rate'
    metric_value JSONB NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    recorded_at TIMESTAMP NOT NULL
);
```

## 6. Governance 設計 — Trust Score の導入

### 6.1 信頼スコアの適用

design.md §2.2 の信頼スコアモデルを HR Policy Advisor に適用する。

```
Trust Score = 成功率 × 0.30 + 結果品質 × 0.35 + 整合性 × 0.20 + リスク管理 × 0.15
```

**HR 領域での各因子の測定:**

| 因子 | 測定方法 |
|---|---|
| 成功率 | HITL ゲートで修正なしに承認された割合 |
| 結果品質 | 制度運用後の KPI（離職率、エンゲージメント）が目標範囲内の割合 |
| 整合性 | 設計出力が企業の Purpose（Mission/Vision/Values）と整合している割合（Governor 評価） |
| リスク管理 | 労基法違反・公平性問題をエスカレーションした割合 |

### 6.2 ゲートの動的制御

| Trust Score | ゲートの挙動 |
|---|---|
| 0.00 - 0.39（Cold Start） | 全 9 ゲートで承認必要。初回利用企業のデフォルト |
| 0.40 - 0.69（Learning） | Agent 1, 6, 7 のゲートを自動パス可能（コンテキスト確認、ドキュメント生成、導入計画は定型的） |
| 0.70 - 0.89（Trusted） | Agent 2, 3, 4 のゲートも自動パス可能。Agent 5（報酬）と Agent 8（制度改定）のみ承認必要 |
| 0.90 - 1.00（Highly Trusted） | Agent 8 の制度改定提案のみ承認必要。報酬制度も自律設計 |

**重要**: Trust Score は**企業別**に蓄積される。A 社で Trusted でも、B 社では Cold Start から始まる。

### 6.3 二重フィルタリングの実装

```
エージェント出力
  → 品質チェック（Agent 6 の 4 段階チェック）
    → パスしたもののみ → Governance Gate（人間の判断）
```

人間は「フォーマットが正しいか」「数値に間違いがないか」を確認する必要がない。**「この制度は我が社の文化に合っているか」「この報酬水準で人材を獲得できるか」** — 人間にしかできない価値判断に集中する。

## 7. 共有記憶基盤への接続

### 7.1 書き込み（他プロジェクトに提供するデータ）

| データ | 消費者 | 活用例 |
|---|---|---|
| 等級定義（GradingSystem） | neumann | 報告者の等級に応じた報告品質基準の動的調整 |
| コンピテンシー定義 | neumann | 「行動不明確」パターンの検知精度向上（等級別の行動期待値を参照） |
| 評価結果データ | ai-executive-dashboard | 組織能力の経時的変化を経営レポートに反映 |
| 制度改定履歴 | 全プロジェクト | 組織の長期記憶の一部として |

### 7.2 読み出し（他プロジェクトから取得するデータ）

| データ | 提供元 | 活用例 |
|---|---|---|
| 報告品質スコア | neumann | 「G3 以上で行動不明確が 40%」→ コンピテンシー定義の改善提案（ReflectionAgent） |
| 市場トレンド | ai-executive-dashboard | 報酬制度の市場整合性評価（CompensationArchitectAgent） |

### 7.3 接続インターフェース

```
REST API:
  GET  /api/v2/knowledge/grading/{company_id}       等級定義の読み出し
  GET  /api/v2/knowledge/competencies/{company_id}   コンピテンシー定義の読み出し
  GET  /api/v2/metrics/evaluations/{company_id}      評価結果データの読み出し
  POST /api/v2/events/policy-updated                 制度更新イベントの発行
```

## 8. 実装ロードマップ

### Phase 1: Knowledge Layer の構築（2-3 週）

- hr-system-lings の 6 フレームワークを YAML 形式に構造化
- `knowledge/frameworks/` ディレクトリに格納
- 各エージェントから Knowledge Layer を参照する仕組みの実装

### Phase 2: 既存エージェントの強化（3-4 週）

- Agent 1-5 を Knowledge Layer 参照型に改修
- 3 つの究極の問いの Purpose Interface 実装
- 設計根拠の明示（Radical Transparency）の実装

### Phase 3: Memory の永続化（2-3 週）

- PostgreSQL スキーマの実装（§5.3）
- HITL 修正履歴の記録パイプライン
- Redis → PostgreSQL の昇格ロジック

### Phase 4: 新エージェントの実装（4-5 週）

- Agent 6: PolicyDocumentAgent（ドキュメント生成 + 4 段階品質チェック）
- Agent 7: DeploymentPlannerAgent（導入計画）
- Agent 8: ReflectionAgent（HITL 分析 + 運用評価 + 改定提案）

### Phase 5: Trust Score と動的ゲート（2-3 週）

- Trust Score の算出ロジック実装
- ゲートの動的制御（§6.2）
- 企業別 Trust Score の管理

### Phase 6: 共有記憶基盤接続（2-3 週）

- §7.3 の REST API 実装
- neumann / ai-executive-dashboard との接続テスト
