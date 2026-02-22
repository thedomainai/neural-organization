# Agentic AI Analysis - 技術アーキテクチャ

> 本ドキュメントは agentic-ai-analysis の技術アーキテクチャを定義する。コンセプトは [01_concept.md](01_concept.md)、プロジェクト概要は [00_overview.md](00_overview.md) を参照。

> **Project Status: Planning** — 本プロジェクトは設計段階にあり、実装はまだ存在しない。本ドキュメントは計画レベルのアーキテクチャ概要を示す。

## 1. Neural Organization 5 層マッピング

agentic-ai-analysis のデータ分析サイクル最適化は、Neural Organization の 5 層アーキテクチャ（L0 Perception ~ L4 Reflection）に準拠して設計する。横断的要素として Purpose、Governance、Memory、Orchestration が全層に作用する。

```
 Purpose ─────────────────────────────── Governance
 (経営課題: どの問いに                        (Trust Score x ゲート)
  分析リソースを投じるか)                        │
        │                                       │
        ▼                                       │
┌──────────────────────────────────────────────────────────┐
│  L0: Perception（知覚）                                    │
│  - 分析リクエストの受付（経営層・各部門・他 Agentic AI）    │
│  - データソースカタログの管理と自動接続                     │
│  - データ品質シグナルの検知（欠損、異常値、スキーマ変更）   │
│  - 外部データの取り込み（市場データ、ベンチマーク）         │
├──────────────────────────────────────────────────────────┤
│  L1: Understanding（理解）                                 │
│  - データプロファイリング（分布、相関、欠損パターン）        │
│  - データ品質ルールの適用と自動クレンジング                 │
│  - 探索的分析（EDA）— パターン・トレンド・異常の発見        │
│  - メタデータの構造化（テーブル定義、血統、利用履歴）       │
├──────────────────────────────────────────────────────────┤
│  L2: Reasoning（推論）                                     │
│  - 問いの優先度判定（ビジネスインパクト x 実現可能性）      │
│  - 分析設計（手法選択、必要データ、前提条件の整理）         │
│  - 仮説検証（統計的検定、因果推論、予測モデル構築）         │
│  - インサイト抽出（So What? → Now What?）                  │
│  - アクション提案（インサイトから具体的行動への変換）       │
├──────────────────────────────────────────────────────────┤
│  L3: Execution（実行）                                     │
│  - SQL / Python コード生成・実行                           │
│  - 可視化の生成（グラフ、ダッシュボード、図解）            │
│  - レポート・プレゼン資料の生成                            │
│  - データパイプラインの構築・更新                          │
│  - アラート・通知の配信                                    │
├──────────────────────────────────────────────────────────┤
│  L4: Reflection（内省）                                    │
│  - 分析精度の追跡（予測 vs 実績）                          │
│  - アクション効果の測定                                    │
│  - 分析手法の有効性評価 → ベストプラクティス更新            │
│  - データ品質ルールの精度改善                              │
│  - 「問い」の質の評価（高インパクトだった問いの特徴）       │
└──────────────────────────────────────────────────────────┘
       ▲                                      ▲
  Memory                                 Orchestration
  - 長期: 分析ナレッジベース             - リクエスト駆動
        + データ品質ルール辞書             （分析依頼をトリガー）
        + 分析パターンライブラリ          - 定期駆動（月次/四半期）
  - 作業: 進行中の分析コンテキスト       - アラート駆動
  - 評価: 予測精度推移                    （データ異常検知時）
```

### 1.1 各層のデータフロー

| 層 | 入力 | 処理 | 出力 |
|----|------|------|------|
| L0 | 分析リクエスト、データソース | 受付・接続・取得 | 生データ + メタデータ |
| L1 | 生データ | プロファイリング、品質チェック、EDA | CleanedDataset + EDAReport |
| L2 | CleanedDataset + EDAReport | 優先度判定、仮説検証、インサイト導出 | AnalysisDesign + ModelingResult + InsightPackage |
| L3 | InsightPackage + ModelingResult | コード生成、可視化、レポート生成 | AnalysisReport + 配信 |
| L4 | 全工程の結果 + 実績データ | 精度追跡、手法評価、ルール改善 | Memory 更新 |

## 2. エージェント構成計画

### 2.1 エージェント一覧と層配置

8 つの専門エージェントが分析サイクルの 9 工程を分担する。各エージェントは主に所属する層があるが、必要に応じて隣接層にまたがる。

| Agent | 名前 | 主要層 | 担当工程 |
|-------|------|-------|---------|
| Agent 1 | QuestionArchitectAgent | L0 + L2 | 問い定義（リクエスト受付 + 優先度判定） |
| Agent 2 | DataIntegrationAgent | L0 | データ収集・統合 |
| Agent 3 | DataQualityAgent | L1 | データ品質確保 |
| Agent 4 | ExploratoryAnalysisAgent | L1 + L2 | 探索的分析 |
| Agent 5 | StatisticalModelingAgent | L2 | 仮説検証・モデリング（中核） |
| Agent 6 | InsightGeneratorAgent | L2 + L3 | インサイト抽出 + アクション提案 |
| Agent 7 | ReportGeneratorAgent | L3 | レポーティング + 配信 |
| Agent 8 | AnalysisCycleReflectionAgent | L4 | 効果測定 + 継続的改善（最重要） |

### 2.2 エージェント間のデータフロー

```
Agent 1 (QuestionArchitect)
  │ AnalysisDesign
  ▼
Agent 2 (DataIntegration)
  │ IntegratedDataset
  ▼
Agent 3 (DataQuality)
  │ CleanedDataset
  ├──────────────────────┐
  ▼                      ▼
Agent 4 (EDA)          Agent 5 (StatisticalModeling)
  │ EDAReport              │ ModelingResult
  │                        │
  └──────┐   ┌────────────┘
         ▼   ▼
Agent 6 (InsightGenerator)
  │ InsightPackage
  ▼
Agent 7 (ReportGenerator)
  │ AnalysisReport
  ▼
Agent 8 (AnalysisCycleReflection)
  │ Memory 更新 → Agent 1, 3, 4, 5, 6 にフィードバック
  └─→ 次のサイクルの Agent 1 へ
```

### 2.3 各エージェントの概要

#### Agent 1: QuestionArchitectAgent

問いを構造化し、優先度を判定する。分析サイクルの起点。

- **優先度計算**: ビジネスインパクト(0.35) + 緊急性(0.25) + 実現可能性(0.25) + 依存関係(0.15)
- **HITL Gate**: DA-001（ANALYSIS_REQUEST）— 全リクエストで承認必要（Cold Start 時）
- **Memory 参照**: 過去の分析の「問い→インパクト」実績

#### Agent 2: DataIntegrationAgent

分析に必要なデータを収集・統合する。

- **主な処理**: データソースカタログ検索、結合条件推定、パイプライン構築、リネージ記録
- **HITL Gate**: なし（データ取得は自律実行。新規ソース接続時のみ Custodian 承認）
- **Memory 参照**: データソースカタログ + メタデータ

#### Agent 3: DataQualityAgent

データ品質を検証し、ルールベースでクレンジングする。

- **主な処理**: プロファイリング、既知ルール適用、新規問題検出、ルール登録
- **HITL Gate**: DA-002（DATA_QUALITY）— 新規ルール追加時のみ
- **Memory 参照**: データ品質ルール辞書

#### Agent 4: ExploratoryAnalysisAgent

データからパターンを発見し、仮説を生成する。

- **主な処理**: 単変量/二変量/多変量分析、変化点検出、仮説生成、可視化
- **HITL Gate**: なし（探索は自律実行）
- **Memory 参照**: 過去の EDA で有効だったアプローチ

#### Agent 5: StatisticalModelingAgent（中核）

仮説を統計的に検証し、モデルを構築する。分析サイクルの中核エージェント。

- **主な処理**: 手法選択、モデル構築・比較、統計的検証、解釈性確保
- **HITL Gate**: DA-003（MODEL_VALIDATION）— Governor + Sensemaker
- **Memory 参照**: 過去のモデル精度実績、有効だった手法パターン

#### Agent 6: InsightGeneratorAgent

分析結果を So What → Now What に変換する。

- **主な処理**: ビジネスインパクト変換、アクション提案、受け手別粒度調整
- **HITL Gate**: DA-004（INSIGHT_REVIEW）— Governor
- **Memory 参照**: 過去のインサイト→アクション→効果の実績

#### Agent 7: ReportGeneratorAgent

分析結果を最適な形式で報告する。

- **主な処理**: レポート形式選択、可視化最適化、品質チェック、配信
- **HITL Gate**: DA-005（REPORT_OUTPUT）— Custodian（対外共有時）
- **Memory 参照**: レポートテンプレート、ブランドガイドライン

#### Agent 8: AnalysisCycleReflectionAgent（最重要）

分析サイクル全体の学習ループを駆動する。本プロジェクトの設計思想上、最も重要なエージェント。

- **主な処理**: 分析精度追跡、手法有効性評価、品質ルール改善、問いの質評価、HITL 修正パターン分析
- **HITL Gate**: DA-006（REFLECTION_REVIEW）— 四半期レビュー時のみ
- **Memory 更新**: 長期記憶（パターンライブラリ + 品質ルール辞書）、評価記憶（精度推移）

## 3. Memory アーキテクチャ

### 3.1 3 構造の技術選定

| 構造 | 内容 | 技術（計画） |
|------|------|------------|
| 長期記憶 | 分析パターンライブラリ、データ品質ルール辞書、データソースカタログ + メタデータ、インサイト→アクション→効果の因果モデル | PostgreSQL + ベクトル DB |
| 作業記憶 | 進行中の分析コンテキスト、生成済みの中間データセット、HITL 待ち状態 | Redis |
| 評価記憶 | 予測精度推移、分析→アクション転換率、問い優先度モデルの精度推移、品質ルールの precision/recall | PostgreSQL（時系列） |

### 3.2 主要テーブル（計画）

**分析パターンライブラリ**: 「問いの種類 x ドメイン x 手法」の組み合わせで有効性を蓄積

**データ品質ルール辞書**: 対象テーブル/カラム単位で品質ルールを蓄積。適用回数、確信度、誤検知率を追跡

**分析精度追跡**: 分析 ID ごとに予測効果と実績効果を記録し、手法別の精度を評価

**問いインパクト追跡**: 問いの優先度スコアと実際のビジネスインパクトを比較し、優先度判定モデルを改善

## 4. Orchestration パターン

### 4.1 駆動モデル

分析サイクルは 3 つのトリガーで起動する。

| トリガー | 起動元 | 例 |
|---------|-------|-----|
| リクエスト駆動 | 人間または他 Agentic AI | 「売上鈍化の要因を分析して」 |
| 定期駆動 | スケジューラ | 月次/四半期の定期分析 |
| アラート駆動 | データ品質モニタ | スキーマ変更、異常値検知 |

### 4.2 実行フロー

```
1. トリガー発生
   │
2. Agent 1: 問い構造化 + 優先度判定
   │ [HITL Gate: DA-001]
   │
3. Agent 2: データ収集・統合
   │
4. Agent 3: データ品質チェック
   │ [HITL Gate: DA-002 (新規ルール時のみ)]
   │
5. Agent 4: 探索的分析 + Agent 5: 仮説検証
   │ [HITL Gate: DA-003]
   │
6. Agent 6: インサイト抽出 + アクション提案
   │ [HITL Gate: DA-004]
   │
7. Agent 7: レポート生成 + 配信
   │ [HITL Gate: DA-005 (対外共有時)]
   │
8. アクション実行（人間）
   │
9. Agent 8: 効果測定 + 学習
   │ [HITL Gate: DA-006 (四半期)]
   │
   └─→ 次のサイクルへ
```

## 5. 共有記憶基盤への接続

### 5.1 書き込み（他プロジェクトに提供するデータ）

| データ | 消費者 | 活用例 |
|--------|-------|-------|
| 分析結果・インサイト | neumann | 差異分析の精度向上（統計モデルの活用） |
| 予測モデルの出力 | agentic-ai-sales | リードスコアリング・解約予測の精緻化 |
| データ品質レポート | ai-executive-dashboard | データ基盤の健全性レポート |
| セグメンテーション結果 | agentic-ai-hr | 従業員セグメント別の制度効果分析 |

### 5.2 読み出し（他プロジェクトから取得するデータ）

| データ | 提供元 | 活用例 |
|--------|-------|-------|
| KPI 異常検知 | neumann | 分析リクエストの自動起動 |
| Win/Loss データ | agentic-ai-sales | 受注/失注の要因分析の入力 |
| 市場トレンド | ai-executive-dashboard | 外部要因の分離に活用 |
| 等級・評価データ | agentic-ai-hr | 人材分析・組織分析の入力 |
| 報告品質データ | neumann | 報告データの信頼度評価 |

## 6. 実装ロードマップ

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
