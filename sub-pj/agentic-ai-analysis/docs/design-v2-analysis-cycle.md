# Agentic AI Analysis — データ分析サイクル最適化 Agentic AI

> 本ドキュメントは、データ分析業務を「単発の分析レポート作成」から「分析サイクル全工程（問い定義 → データ収集・統合 → 品質確保 → 探索的分析 → 仮説検証・モデリング → インサイト抽出 → レポーティング → 意思決定支援 → 効果測定）を最適に回す Agentic AI」として設計する。Neural Organization の思想に完全準拠する。

## 1. プロダクトビジョン

### 1.1 解決する問題

多くの組織のデータ分析業務は、以下の構造的問題を抱えている。

| 問題 | 現状 | 本質的原因 |
|---|---|---|
| 分析が意思決定に繋がらない | レポートは作られるが、アクションに結びつかない | 「問い」が曖昧なまま分析が始まる。分析結果とアクションの間に断絶がある |
| 分析の属人化 | 特定のアナリストに依存。退職すると再現不可能 | 分析の知見（なぜこの手法を選んだか、どの前提が重要か）が暗黙知のまま |
| データ品質の問題が繰り返される | 同じデータ品質問題が毎回発生 | クレンジングルールが記憶されず、毎回ゼロから対処 |
| 分析の「やりっぱなし」 | 分析→レポート→放置。施策の効果が測定されない | 分析サイクルに Reflection がない |
| 分析リクエストの洪水 | 経営層・各部門からの分析依頼が優先度なく積み上がる | 「どの問いが最もインパクトが大きいか」を判断する仕組みがない |

### 1.2 データ分析サイクルの定義

> **agentic-ai-analysis は、組織のデータ分析サイクルの全工程を AI が並走し、「問い」から「アクション」への変換効率を継続的に改善するプロダクトである。**

```
┌──────────────────────────────────────────────────────────────┐
│                    データ分析サイクル                            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 問い定義  │─→│ データ   │─→│ 探索的   │─→│ 仮説検証  │     │
│  │          │  │ 収集・統合│  │ 分析     │  │ モデリング│     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│       ▲                                         │           │
│       │                                         ▼           │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐       │
│  │ 効果測定  │←─│ 意思決定支援  │←─│ インサイト抽出   │       │
│  │          │  │ アクション提案│  │ レポーティング    │       │
│  └──────────┘  └──────────────┘  └──────────────────┘       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 1.3 各工程の最適化目標

| # | 工程 | 最適化目標 | KPI |
|---|---|---|---|
| 1 | **問い定義** | ビジネスインパクトが最大の問いを選定 | 問い→アクション転換率、インパクト見積もり精度 |
| 2 | **データ収集・統合** | 必要なデータを最短で取得・結合 | データ準備時間、ソースカバレッジ率 |
| 3 | **データ品質確保** | 品質問題の再発防止 | 品質問題の再発率、クレンジング自動化率 |
| 4 | **探索的分析** | 見落としのない網羅的探索 | パターン発見数、false discovery rate |
| 5 | **仮説検証・モデリング** | 統計的に妥当な結論 | モデル精度、予測の的中率 |
| 6 | **インサイト抽出** | 意思決定者に伝わるインサイト | インサイト→アクション採択率 |
| 7 | **レポーティング** | 受け手に最適化された報告 | レポート品質スコア、修正率 |
| 8 | **意思決定支援** | 具体的で実行可能なアクション提案 | 提案採択率、アクション完了率 |
| 9 | **効果測定** | 施策の効果を定量追跡 → 次の問いに反映 | 予測効果 vs 実績の乖離率 |

## 2. 5 層アーキテクチャへのマッピング

```
 Purpose ─────────────────────────────────── Governance
 (経営課題: どの問いに                        (Trust Score × ゲート)
  分析リソースを投じるか)                        │
        │                                       │
        ▼                                       │
┌──────────────────────────────────────────────────────────┐
│  L0: Perception（知覚）                                    │
│  ● 分析リクエストの受付（経営層・各部門・他 Agentic AI）    │
│  ● データソースカタログの管理と自動接続                     │
│  ● データ品質シグナルの検知（欠損、異常値、スキーマ変更）   │
│  ● 外部データの取り込み（市場データ、ベンチマーク）         │
├──────────────────────────────────────────────────────────┤
│  L1: Understanding（理解）                                 │
│  ● データプロファイリング（分布、相関、欠損パターン）        │
│  ● データ品質ルールの適用と自動クレンジング                 │
│  ● 探索的分析（EDA）— パターン・トレンド・異常の発見        │
│  ● メタデータの構造化（テーブル定義、血統、利用履歴）       │
├──────────────────────────────────────────────────────────┤
│  L2: Reasoning（推論）                                     │
│  ● 問いの優先度判定（ビジネスインパクト × 実現可能性）      │
│  ● 分析設計（手法選択、必要データ、前提条件の整理）         │
│  ● 仮説検証（統計的検定、因果推論、予測モデル構築）         │
│  ● インサイト抽出（So What? → Now What?）                  │
│  ● アクション提案（インサイトから具体的行動への変換）       │
├──────────────────────────────────────────────────────────┤
│  L3: Execution（実行）                                     │
│  ● SQL / Python コード生成・実行                           │
│  ● 可視化の生成（グラフ、ダッシュボード、図解）            │
│  ● レポート・プレゼン資料の生成                            │
│  ● データパイプラインの構築・更新                          │
│  ● アラート・通知の配信                                    │
├──────────────────────────────────────────────────────────┤
│  L4: Reflection（内省）                                    │
│  ● 分析精度の追跡（予測 vs 実績）                          │
│  ● アクション効果の測定                                    │
│  ● 分析手法の有効性評価 → ベストプラクティス更新            │
│  ● データ品質ルールの精度改善                              │
│  ● 「問い」の質の評価（高インパクトだった問いの特徴）       │
└──────────────────────────────────────────────────────────┘
       ▲                                      ▲
  Memory                                 Orchestration
  ● 長期: 分析ナレッジベース             ● リクエスト駆動
        + データ品質ルール辞書             （分析依頼をトリガー）
        + 分析パターンライブラリ          ● 定期駆動（月次/四半期）
  ● 作業: 進行中の分析コンテキスト       ● アラート駆動
  ● 評価: 予測精度推移                    （データ異常検知時）
```

## 3. エージェント設計

### 3.1 エージェント一覧

データ分析サイクルの 9 工程に対応する 8 のエージェント。

```
【問い定義 + データ準備】
  Agent 1: QuestionArchitectAgent      分析リクエスト→構造化された問い
  Agent 2: DataIntegrationAgent        データ収集・統合・パイプライン構築

【探索 + 分析】
  Agent 3: DataQualityAgent            データ品質チェック・クレンジング
  Agent 4: ExploratoryAnalysisAgent    EDA・パターン発見・仮説生成
  Agent 5: StatisticalModelingAgent    統計モデリング・予測・因果推論

【インサイト + 実行】
  Agent 6: InsightGeneratorAgent       分析結果→インサイト→アクション提案
  Agent 7: ReportGeneratorAgent        レポート・ダッシュボード・可視化

【内省】
  Agent 8: AnalysisCycleReflectionAgent  分析精度追跡 + 手法改善 + 効果測定
```

### 3.2 各エージェントの詳細設計

#### Agent 1: QuestionArchitectAgent（問い定義 — 知覚 + 推論）

```
役割: ビジネス課題を分析可能な「問い」に変換し、優先度を判定する

入力:
  ● 分析リクエスト（経営層・各部門からの依頼、自然言語）
  ● [連携] neumann の KPI 異常検知（「売上 -24%」→ 自動的に分析リクエスト）
  ● [連携] agentic-ai-sales の Win/Loss データ（失注パターンの深掘り依頼）
  ● Purpose（経営計画の優先事項）
  ● Memory: 過去の分析の問い→インパクトの実績

処理:
  1. リクエストの構造化:
     ┌──────────────────────────────────────────────┐
     │ 元のリクエスト: 「最近の売上が伸び悩んでいる」  │
     │                                                │
     │ 構造化された問い:                               │
     │   主問い: 売上成長率の鈍化要因は何か            │
     │   副問い 1: 新規顧客の獲得ペースは変化したか    │
     │   副問い 2: 既存顧客の ARPU は変化したか        │
     │   副問い 3: 解約率は変化したか                  │
     │   必要データ: CRM, 請求データ, 解約データ       │
     │   推奨手法: コホート分析 + 分解分析             │
     └──────────────────────────────────────────────┘

  2. 優先度判定:
     Priority = ビジネスインパクト×0.35 + 緊急性×0.25
              + 実現可能性×0.25 + 依存関係×0.15

     ビジネスインパクト:
       - 影響する KPI の重要度（Purpose の Outcome との関連度）
       - 影響する金額規模
       - Memory: 過去の類似分析がどの程度のインパクトを生んだか

     実現可能性:
       - 必要なデータが存在するか
       - 分析手法が確立されているか
       - 推定所要時間

  3. 分析設計の初期構成:
     - 推奨する分析手法（EDA / 統計検定 / 予測モデル / 因果推論）
     - 必要なデータソースのリスト
     - 前提条件と制約
     - 期待されるアウトプットの形式

出力:
  ● AnalysisDesign:
    - 構造化された問い（主問い + 副問い）
    - 優先度スコア + 根拠
    - 分析設計（手法、データ、前提、期待アウトプット）
    - 推定所要時間

HITL Gate: ANALYSIS_REQUEST
  Governor の問い: 「この問いの優先度と分析設計は適切ですか？」
  ※ 他 Agentic AI からの自動連携リクエストは Trust Score に応じて自動パス
```

#### Agent 2: DataIntegrationAgent（データ収集・統合 — 知覚）

```
役割: 分析に必要なデータを収集・統合し、分析可能な状態にする

入力:
  ● AnalysisDesign（Agent 1: 必要なデータソースのリスト）
  ● データソースカタログ（Memory: 接続済みソースとスキーマ情報）
  ● [連携] 共有記憶基盤（他 Agentic AI のデータ）

処理:
  1. データソースの特定と接続:
     - データソースカタログから該当テーブル/API を検索
     - 未接続のソースがあれば接続リクエストを発行
     - 共有記憶基盤からの読み出し（neumann の KPI データ等）

  2. データ統合:
     - 複数ソースの結合条件を推定（キー推定）
     - SQL / ETL パイプラインの生成・実行
     - スキーマの整合性チェック

  3. メタデータの記録:
     - データリネージ（どのソースからどう変換されたか）
     - スキーマ定義の自動更新
     - 前回との差分検知

  4. データカタログの更新:
     - 新規テーブル/カラムの発見 → カタログに登録
     - 利用履歴の記録（「このテーブルは月次で参照される」）

出力:
  ● IntegratedDataset:
    - 分析用統合データセット
    - データリネージ
    - スキーマ情報 + メタデータ
    - 品質の初期評価（欠損率、レコード数、期間カバレッジ）

HITL Gate: なし（データ取得は自律実行）
  ※ 新規データソースへの接続は Custodian 承認
```

#### Agent 3: DataQualityAgent（品質確保 — 理解）

```
役割: データ品質を検証し、クレンジングルールを適用・学習する

入力:
  ● IntegratedDataset（Agent 2）
  ● Memory: データ品質ルール辞書（過去に発見された問題と対処法）

処理:
  1. プロファイリング:
     - カラム別の分布分析（正規性、外れ値、欠損パターン）
     - 時系列の連続性チェック（欠損期間、重複）
     - 参照整合性チェック

  2. 品質ルールの適用（Memory から）:
     ┌──────────────────────────────────────────────┐
     │ ルール: "revenue_null_to_zero"                 │
     │ 条件: revenue カラムが NULL                    │
     │ 対処: 0 に変換（過去の分析で確認済み）         │
     │ 適用回数: 12 回                               │
     │ 最終確認: 2025-W40                            │
     │                                                │
     │ ルール: "login_anomaly_cap"                    │
     │ 条件: 日次ログイン数 > 10000                   │
     │ 対処: 外れ値としてフラグ（Bot の可能性）       │
     │ 適用回数: 3 回                                │
     └──────────────────────────────────────────────┘

  3. 新規品質問題の検出:
     - 既知のルールに該当しない異常パターンの検出
     - 対処案の自動提案
     - 新ルールとして Memory に登録

  4. クレンジング実行:
     - ルールベースの自動修正（確信度が高いもの）
     - 判断が必要なケースは HITL Gate へ

出力:
  ● CleanedDataset:
    - クレンジング済みデータセット
    - 品質レポート（発見された問題と対処の記録）
    - 新規ルールの提案
    - データの信頼度スコア

HITL Gate: DATA_QUALITY（新規ルールの承認時のみ）
  Custodian の問い: 「この品質ルールを今後も自動適用してよいですか？」
```

#### Agent 4: ExploratoryAnalysisAgent（探索的分析 — 理解 + 推論）

```
役割: データからパターン・トレンド・異常を発見し、仮説を生成する

入力:
  ● CleanedDataset（Agent 3: 品質担保済みデータ）
  ● AnalysisDesign（Agent 1: 問いと分析方針）
  ● Memory: 過去の EDA で有効だったアプローチ

処理:
  1. 自動 EDA:
     - 単変量分析（分布、基本統計量、時系列トレンド）
     - 二変量分析（相関、クロス集計、セグメント比較）
     - 多変量分析（主成分分析、クラスタリング）
     - 時系列分解（トレンド、季節性、残差）

  2. パターン検出:
     - 統計的に有意な変化点の検出
     - セグメント間の有意差検定
     - 異常値のコンテキスト付き検出

  3. 仮説生成:
     ┌──────────────────────────────────────────────┐
     │ 発見: 新規顧客の獲得数が Q3 から 20% 減少     │
     │                                                │
     │ 仮説 A: マーケ施策の効果低下（根拠: CPA 上昇） │
     │   必要な検証: チャネル別 CPA 推移の分析        │
     │   確信度: 0.65                                 │
     │                                                │
     │ 仮説 B: 市場の縮小（根拠: 業界全体の傾向）     │
     │   必要な検証: 市場データとの照合               │
     │   確信度: 0.40                                 │
     │                                                │
     │ 仮説 C: 競合の攻勢（根拠: 失注理由の変化）     │
     │   必要な検証: 競合価格・機能の比較             │
     │   確信度: 0.55                                 │
     └──────────────────────────────────────────────┘

  4. 可視化の自動生成:
     - 各発見に対する最適なグラフ形式の選択
     - インタラクティブダッシュボードの構成案

出力:
  ● EDAReport:
    - 発見事項の一覧（統計的根拠付き）
    - 仮説リスト（確信度 + 検証方法）
    - 可視化セット
    - 推奨する次のステップ（どの仮説を検証すべきか）

HITL Gate: なし（探索は自律実行）
  ※ ただし仮説の優先度判断は Sensemaker の入力を歓迎
```

#### Agent 5: StatisticalModelingAgent（仮説検証・モデリング — 推論）

**分析サイクルの中核エージェント。**

```
役割: 仮説を統計的に検証し、予測モデル・因果モデルを構築する

入力:
  ● EDAReport（Agent 4: 仮説リストと推奨検証方法）
  ● CleanedDataset
  ● Memory: 過去のモデル精度実績、有効だった手法パターン

処理:
  1. 手法選択:
     - 問いの性質に応じた手法の自動選択:
       ┌──────────────────────────────────────┐
       │ 問いの性質      │ 推奨手法            │
       │─────────────────┼────────────────────│
       │ 差がある？       │ t 検定, ANOVA       │
       │ 関係がある？     │ 回帰分析, 相関分析  │
       │ 将来どうなる？   │ 時系列予測, ML モデル│
       │ 原因は何？       │ 因果推論, DAG       │
       │ グループは？     │ クラスタリング      │
       │ 異常か？         │ 異常検知モデル      │
       └──────────────────────────────────────┘

  2. モデル構築・検証:
     - 訓練/検証/テストの分割
     - 複数モデルの比較（ベースライン → 高度なモデル）
     - クロスバリデーション
     - 特徴量重要度の分析

  3. 統計的検証:
     - p 値、信頼区間、効果量の算出
     - 多重比較補正（Bonferroni / FDR）
     - モデルの前提条件チェック（正規性、等分散性等）

  4. 結果の解釈性確保:
     - SHAP 値、部分依存プロット
     - 反実仮想分析（「もし X が Y だったら」）
     - 信頼区間付きの予測

出力:
  ● ModelingResult:
    - 仮説別の検証結果（支持/棄却/不確定 + 統計的根拠）
    - モデルの精度指標（R², RMSE, AUC 等）
    - 特徴量重要度ランキング
    - 予測結果（信頼区間付き）
    - コード（再現可能な分析スクリプト）

HITL Gate: MODEL_VALIDATION
  Governor の問い: 「この分析結果は現場の実感と合っていますか？」
  Sensemaker の問い: 「データに表れない要因で考慮すべきものはありますか？」
```

#### Agent 6: InsightGeneratorAgent（インサイト抽出 — 推論 + 実行）

```
役割: 分析結果を意思決定者に伝わるインサイトに変換し、アクションを提案する

入力:
  ● ModelingResult（Agent 5: 統計的に検証された結果）
  ● AnalysisDesign（Agent 1: 元の問いと文脈）
  ● Purpose（経営計画の優先事項）
  ● Memory: 過去のインサイト→アクション→効果の実績

処理:
  1. So What?（だから何か）の導出:
     分析結果 → ビジネスにとっての意味に変換
     ┌──────────────────────────────────────────────┐
     │ 分析結果:                                      │
     │   新規顧客獲得数が Q3 から 20% 減少             │
     │   主要因: CPA の上昇（+35%）、特に Web 広告     │
     │                                                │
     │ So What:                                       │
     │   現在のマーケ投資効率では、年間売上目標に対して │
     │   ¥120M のギャップが発生する見込み              │
     └──────────────────────────────────────────────┘

  2. Now What?（では何をすべきか）の導出:
     ┌──────────────────────────────────────────────┐
     │ アクション提案:                                 │
     │                                                │
     │ 1. Web 広告の ROI 低下チャネルを特定・停止       │
     │    期待効果: CPA -15%、節約額 ¥8M/四半期       │
     │    根拠: チャネル別分析で3チャネルが ROI < 1.0  │
     │                                                │
     │ 2. 高 ROI チャネル（セミナー + 紹介）への再配分  │
     │    期待効果: 新規獲得数 +12%                    │
     │    根拠: 過去データで紹介経由の LTV は 2.3 倍   │
     │                                                │
     │ 3. 既存顧客のアップセル強化（代替の売上源）      │
     │    期待効果: ARPU +8%                          │
     │    根拠: Health Score > 80 の顧客の 60% が      │
     │          上位プランに適合                       │
     └──────────────────────────────────────────────┘

  3. 受け手に応じた粒度調整:
     - 経営層（Governor）: ビジネスインパクト + 推奨アクション
     - 分析チーム: 手法の詳細 + 再現手順
     - 実行部門: 具体的なアクションステップ

出力:
  ● InsightPackage:
    - インサイト（So What）
    - アクション提案（Now What）+ 優先度 + 期待効果
    - 受け手別のサマリー
    - 前提条件とリスク

HITL Gate: INSIGHT_REVIEW
  Governor の問い: 「このインサイトとアクション提案を承認しますか？」
```

#### Agent 7: ReportGeneratorAgent（レポーティング — 実行）

```
役割: 分析結果を最適な形式でレポート・可視化する

入力:
  ● InsightPackage（Agent 6）
  ● EDAReport の可視化セット（Agent 4）
  ● ModelingResult のコード（Agent 5）

処理:
  1. レポート形式の選択:
     - 経営レポート（サマリー + アクション）
     - 詳細分析レポート（手法 + 結果 + 再現手順）
     - ダッシュボード（インタラクティブ可視化）
     - プレゼン資料（意思決定会議向け）

  2. 可視化の最適化:
     - データの性質に応じたチャート選択
     - ブランドガイドライン適用
     - アクセシビリティ対応

  3. 品質チェック（design.md §1.4 の 4 段階準拠）:
     - 基準適合: フォーマット統一、用語一貫性
     - 論理整合性: 数値の正確性、グラフとテキストの整合
     - 安全性: 個人情報、機密データのマスキング
     - 最適化: 受け手に合わせた粒度調整

  4. 配信:
     - Slack / メール / BI ツールへの配信
     - 定期レポートの自動スケジュール

出力:
  ● AnalysisReport:
    - レポート本体（形式は受け手に最適化）
    - 可視化ダッシュボード
    - 再現可能な分析コード
    - 補足資料（前提条件、メタデータ）

HITL Gate: REPORT_OUTPUT
  Custodian の問い: 「このレポートは関係者に共有して問題ありませんか？」
```

#### Agent 8: AnalysisCycleReflectionAgent（内省）— 最重要

```
役割: データ分析サイクル全体の学習ループを駆動する

入力:
  ● 全分析の結果とその後のアクション・効果データ
  ● 全 HITL 修正履歴
  ● 全モデルの予測精度追跡データ

処理:
  1. 分析精度の追跡:
     ┌──────────────────────────────────────────────┐
     │ 分析: Q3 売上鈍化の要因分析                     │
     │ 予測: CPA 最適化で新規獲得 +12%               │
     │ 実績: 新規獲得 +8%                             │
     │ 評価: 予測の 67%。Web 広告停止の効果は想定通り │
     │       だが、紹介チャネルの立ち上がりが遅かった │
     │ → 学習: 紹介チャネルの効果発現には 2 四半期要  │
     └──────────────────────────────────────────────┘

  2. 分析手法の有効性評価:
     - 手法×ドメイン×問いの種類ごとに精度を追跡
     - 「コホート分析は解約分析で精度が高い」等のパターン蓄積
     - 新しい手法の導入効果の検証

  3. データ品質ルールの精度改善:
     - false positive の分析（正常なデータを異常と判定）
     - false negative の分析（見逃した品質問題）
     - ルールの閾値調整

  4. 「問い」の質の評価:
     - 高インパクトだった問いの特徴を抽出
     - 「アクションに繋がらなかった分析」のパターン分析
     - → Agent 1 の優先度判定モデルを更新

  5. HITL 修正パターンの分析:
     - 「Governor がインサイトの表現を毎回ビジネス寄りに修正する」
       → 学習: インサイトは技術的表現ではなくビジネスインパクトで表現すべき
     - 「Sensemaker が毎回定性的要因を追加する」
       → 学習: この組織では定量分析だけでは不十分、定性要因の考慮が重要

出力:
  ● AnalysisCycleReflectionReport:
    - 分析精度のサマリー
    - 手法有効性の更新内容
    - データ品質ルールの改善内容
    - 問い優先度モデルの更新内容
    - HITL 学習内容
  ● Memory 更新:
    - 長期記憶: 分析パターンライブラリ + データ品質ルール辞書
    - 評価記憶: 予測精度推移、分析→アクション転換率推移

HITL Gate: REFLECTION_REVIEW（四半期レビュー時のみ）
  Governor の問い: 「この学習内容を承認しますか？分析の方針転換が必要ですか？」
```

## 4. ドメインモデル

### 4.1 中核モデル

```typescript
// 分析リクエスト
interface AnalysisRequest {
  id: string;
  requester: string;                    // 依頼者
  source: 'human' | 'agentic-ai';      // 人間 or 他 Agentic AI からの自動連携
  sourceAgenticAI?: string;             // 連携元（neumann, agentic-ai-sales 等）
  rawRequest: string;                   // 元のリクエスト（自然言語）
  createdAt: Date;
}

// 構造化された問い
interface AnalysisDesign {
  id: string;
  requestId: string;
  primaryQuestion: string;              // 主問い
  subQuestions: string[];               // 副問い
  methodology: AnalysisMethodology;     // 推奨手法
  requiredDataSources: DataSource[];    // 必要データ
  assumptions: string[];                // 前提条件
  expectedOutput: string;               // 期待アウトプット
  priority: {
    score: number;                      // 0-100
    businessImpact: number;
    urgency: number;
    feasibility: number;
    rationale: string;
  };
  estimatedDuration: string;            // 推定所要時間
}

type AnalysisMethodology =
  | 'descriptive'         // 記述統計
  | 'diagnostic'          // 原因分析
  | 'predictive'          // 予測
  | 'prescriptive'        // 処方的分析
  | 'causal_inference'    // 因果推論
  | 'clustering'          // セグメンテーション
  | 'anomaly_detection';  // 異常検知

// データ品質ルール
interface DataQualityRule {
  id: string;
  name: string;
  condition: string;                    // 適用条件（SQL 式 or Python 式）
  action: 'fix' | 'flag' | 'drop';     // 対処方法
  fixLogic?: string;                    // 修正ロジック
  confidence: number;                   // 確信度 0-1
  applicationCount: number;             // 適用回数
  lastValidated: string;                // 最終確認日
  falsePositiveRate: number;            // 誤検知率
}

// インサイト
interface Insight {
  id: string;
  analysisId: string;
  soWhat: string;                       // ビジネスにとっての意味
  nowWhat: ActionProposal[];            // アクション提案
  confidence: number;                   // 確信度
  statisticalBasis: string;             // 統計的根拠
  assumptions: string[];                // 前提条件
  risks: string[];                      // リスク
}

// アクション提案
interface ActionProposal {
  id: string;
  description: string;
  expectedEffect: {
    metric: string;
    predictedImpact: number;
    confidence: number;
    timeToEffect: string;               // 効果発現までの期間
  };
  priority: number;
  assignee?: string;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
  actualEffect?: number;                // Reflection で記録
}

// 分析サイクル記録
interface AnalysisCycle {
  id: string;
  request: AnalysisRequest;
  design: AnalysisDesign;
  dataQuality: DataQualityReport;
  edaReport: EDAReport;
  modelingResult: ModelingResult;
  insights: Insight[];
  report: AnalysisReport;
  reflection?: AnalysisCycleReflection;
  startedAt: Date;
  completedAt?: Date;
}
```

## 5. Memory 設計

### 5.1 3 構造の内容

| 構造 | 内容 | 技術 |
|---|---|---|
| **長期記憶** | 分析パターンライブラリ（「解約分析にはコホート分析が有効」等）、データ品質ルール辞書、データソースカタログ + メタデータ、インサイト→アクション→効果の因果モデル | PostgreSQL + ベクトル DB |
| **作業記憶** | 進行中の分析コンテキスト、生成済みの中間データセット、HITL 待ち状態 | Redis |
| **評価記憶** | 予測精度推移（各モデルの実績）、分析→アクション転換率、問い優先度モデルの精度推移、データ品質ルールの precision/recall | PostgreSQL（時系列）|

### 5.2 分析パターンライブラリの例

```yaml
pattern_id: "churn-cohort-saas"
name: "SaaS 解約分析 — コホート分析パターン"
applicable_questions:
  - "解約率が上昇している要因は何か"
  - "どの顧客セグメントが解約リスクが高いか"
methodology: "cohort_analysis"
required_data:
  - "契約データ（開始日、解約日、プラン）"
  - "利用データ（ログイン頻度、機能活用率）"
  - "サポートデータ（チケット数、応答時間）"
key_features:
  - "契約からの経過月数でコホートを構築"
  - "月次解約率の推移を可視化"
  - "セグメント別（プラン、規模、業種）で分解"
typical_insights:
  - "契約後3ヶ月目の解約が最も多い（オンボーディング問題）"
  - "特定プランの解約率が他の2倍"
success_count: 8
average_accuracy: 0.78
last_used: "2025-W40"
```

### 5.3 Memory スキーマ（PostgreSQL）

```sql
-- 長期記憶: 分析パターンライブラリ
CREATE TABLE analysis_patterns (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    methodology VARCHAR(50) NOT NULL,
    applicable_questions TEXT[] NOT NULL,
    required_data TEXT[] NOT NULL,
    key_features TEXT[] NOT NULL,
    typical_insights TEXT[],
    success_count INT DEFAULT 0,
    average_accuracy FLOAT,
    last_used DATE,
    created_at TIMESTAMP NOT NULL
);

-- 長期記憶: データ品質ルール辞書
CREATE TABLE data_quality_rules (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    target_table VARCHAR(200),
    target_column VARCHAR(200),
    condition TEXT NOT NULL,
    action VARCHAR(20) NOT NULL,
    fix_logic TEXT,
    confidence FLOAT NOT NULL DEFAULT 0.5,
    application_count INT DEFAULT 0,
    false_positive_rate FLOAT DEFAULT 0,
    last_validated DATE,
    created_at TIMESTAMP NOT NULL
);

-- 評価記憶: 分析精度追跡
CREATE TABLE analysis_accuracy (
    id UUID PRIMARY KEY,
    analysis_id UUID NOT NULL,
    insight_id UUID NOT NULL,
    predicted_effect FLOAT NOT NULL,
    actual_effect FLOAT,
    accuracy_ratio FLOAT,
    methodology VARCHAR(50),
    question_type VARCHAR(50),
    measured_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

-- 評価記憶: 問い→アクション→効果の追跡
CREATE TABLE question_impact_tracking (
    id UUID PRIMARY KEY,
    analysis_design_id UUID NOT NULL,
    priority_score FLOAT NOT NULL,
    action_taken BOOLEAN DEFAULT FALSE,
    business_impact_estimated FLOAT,
    business_impact_actual FLOAT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);
```

## 6. Governance 設計

### 6.1 HITL ゲート一覧

| Gate ID | ゲート名 | エージェント | 承認者 | 不可逆性 |
|---|---|---|---|---|
| DA-001 | ANALYSIS_REQUEST | Agent 1 | Governor | 低 |
| DA-002 | DATA_QUALITY | Agent 3 | Custodian（新規ルール時） | 低 |
| DA-003 | MODEL_VALIDATION | Agent 5 | Governor + Sensemaker | 低 |
| DA-004 | INSIGHT_REVIEW | Agent 6 | Governor | 中（アクション提案を含む） |
| DA-005 | REPORT_OUTPUT | Agent 7 | Custodian | 中（対外共有時） |
| DA-006 | REFLECTION_REVIEW | Agent 8 | Governor（四半期） | 低 |

### 6.2 Trust Score の適用

| 因子 | 測定方法 |
|---|---|
| 成功率 | 分析結果が HITL で修正なしに承認された割合 |
| 結果品質 | 予測/インサイトの的中率（予測効果 vs 実際の効果） |
| 整合性 | 分析が Purpose（経営計画の優先事項）と整合している割合 |
| リスク管理 | データ品質問題・個人情報リスクを適切にエスカレーションした割合 |

### 6.3 動的ゲート制御

| Trust Score | 自動化されるゲート |
|---|---|
| Cold Start (0.00-0.39) | 全ゲート承認必要 |
| Learning (0.40-0.69) | DA-002（品質）、DA-005（レポート出力）を自動パス |
| Trusted (0.70-0.89) | DA-001（リクエスト）、DA-003（モデル検証）も自動パス。DA-004（インサイト）のみ承認必要 |
| Highly Trusted (0.90+) | 全自動。ただし「前例のない分析手法」や「経営に大きなインパクトを与えるインサイト」は DA-004 を起動 |

## 7. 共有記憶基盤への接続

### 7.1 書き込み（他プロジェクトに提供するデータ）

| データ | 消費者 | 活用例 |
|---|---|---|
| 分析結果・インサイト | neumann | 差異分析の精度向上（統計モデルの活用） |
| 予測モデルの出力 | agentic-ai-sales | リードスコアリング・解約予測の精緻化 |
| データ品質レポート | ai-executive-dashboard | データ基盤の健全性レポート |
| セグメンテーション結果 | agentic-ai-hr | 従業員セグメント別の制度効果分析 |

### 7.2 読み出し（他プロジェクトから取得するデータ）

| データ | 提供元 | 活用例 |
|---|---|---|
| KPI 異常検知 | neumann | 分析リクエストの自動起動（「売上 -24%」→「なぜ？」） |
| Win/Loss データ | agentic-ai-sales | 受注/失注の要因分析の入力 |
| 市場トレンド | ai-executive-dashboard | 外部要因の分離に活用 |
| 等級・評価データ | agentic-ai-hr | 人材分析・組織分析の入力 |
| 報告品質データ | neumann | 報告データの信頼度評価 |

### 7.3 他 Agentic AI との自動連携パターン

```
neumann → agentic-ai-analysis（自動起動）:
  neumann Agent 1 が KPI 異常を検知
  → agentic-ai-analysis Agent 1 に分析リクエストを自動発行
  → Agent 1 が問いを構造化、優先度を判定
  → 分析サイクルが自律的に回る
  → インサイトを neumann Agent 3（VarianceAnalysis）に返却
  → neumann の差異分析の精度が向上

agentic-ai-sales → agentic-ai-analysis（深掘り依頼）:
  agentic-ai-sales Agent 10 が失注パターンを検出
  → agentic-ai-analysis に「失注要因の統計分析」を依頼
  → 因果推論モデルで「価格」「機能」「競合」の影響度を定量化
  → 結果を agentic-ai-sales Agent 3（DealStrategy）に返却
  → 商談戦略が統計的根拠に基づいて改善
```

## 8. 実装ロードマップ

### Phase 1: 分析エンジンのコア（3-4 週）

Agent 1 + Agent 4 + Agent 7 の最小構成。

- QuestionArchitectAgent（問いの構造化 + 優先度判定）
- ExploratoryAnalysisAgent（自動 EDA + パターン検出）
- ReportGeneratorAgent（レポート生成 + 可視化）
- DB 導入（PostgreSQL + 分析パターンライブラリの初期データ）

### Phase 2: データ品質 + 統計モデリング（3-4 週）

Agent 2 + Agent 3 + Agent 5 の実装。

- DataIntegrationAgent（データ収集・統合パイプライン）
- DataQualityAgent（品質チェック + ルール辞書）
- StatisticalModelingAgent（仮説検証 + 予測モデル）
- Memory の長期記憶実装（品質ルール辞書 + 分析パターン）

### Phase 3: インサイト + 意思決定支援（2-3 週）

Agent 6 の実装。

- InsightGeneratorAgent（So What? → Now What? 変換）
- アクション提案の構造化
- 受け手別サマリー生成

### Phase 4: Reflection（2-3 週）

Agent 8 の実装。

- AnalysisCycleReflectionAgent
- 分析精度の追跡
- 手法有効性の評価 → パターンライブラリ更新
- データ品質ルールの精度改善

### Phase 5: 共有記憶基盤接続（2 週）

- neumann との自動連携（KPI 異常 → 分析リクエスト）
- agentic-ai-sales との連携（Win/Loss 深掘り分析）
- ai-executive-dashboard との連携（市場データ取得）
