# neumann v2 — 経営管理サイクル最適化 Agentic AI

> 本ドキュメントは、neumann を「週次報告の曖昧さ検知ツール」から「経営管理サイクル（予実管理 → 差異分析 → ネクストアクション定義 → 予実管理）を最適に回す Agentic AI プロダクト」として再構築する設計を定義する。Neural Organization の思想に完全準拠する。

## 1. 再構築の根拠

### 1.1 現行 v1 の位置づけ

v1 の neumann は「報告テキストの曖昧さ検知」に焦点を当てている。5 つのパターン（事実/解釈混在、定量化不足、アクション不明確、浅い分析、カバレッジ不足）を検出し、報告品質を担保する。

しかし、**報告品質の担保は経営管理サイクルの手段であり、目的ではない。**

経営管理の目的は「計画と現実の乖離を最速で検知し、構造的に原因を特定し、実効性のあるアクションで修正し、その結果を次の計画に反映する」ことである。報告の曖昧さ検知は、このサイクルの中間工程（差異分析の入力品質担保）に過ぎない。

### 1.2 再定義されたプロダクトビジョン

> **neumann は、経営管理サイクルの全工程を AI が並走し、計画と現実の乖離を「必然的に」縮小させるプロダクトである。**

v1 のビジョン「曖昧さの排除」は、このサイクルの中で「差異分析の解像度を上げる」という形で位置づけ直される。

### 1.3 経営管理サイクルの定義

```
┌──────────────────────────────────────────────────────────┐
│                 経営管理サイクル                            │
│                                                          │
│    ┌──────────┐     ┌──────────┐     ┌──────────────┐   │
│    │ 予実管理  │────→│ 差異分析  │────→│ ネクストアクション│   │
│    │ (Plan    │     │ (Analyze │     │ 定義 (Act)    │   │
│    │  vs Act) │     │  Gap)    │     │               │   │
│    └────▲─────┘     └──────────┘     └──────┬────────┘   │
│         │                                     │          │
│         └─────────────────────────────────────┘          │
│              結果の反映 (Reflect & Update)                 │
└──────────────────────────────────────────────────────────┘
```

| 工程 | 内容 | v1 でのカバー | v2 でのカバー |
|---|---|---|---|
| **予実管理** | KPI の目標設定、実績入力、達成率の自動計算 | KPI ツリーの表示のみ（モック） | KPI 定義 → 自動取得 → 達成率計算 → 異常検知 |
| **差異分析** | 計画と実績の乖離の原因を構造的に分析 | 報告テキストの曖昧さ検知（5 パターン） | 定量差異の自動検知 + 報告の品質担保 + 因果分析の支援 |
| **ネクストアクション** | 差異を埋めるための具体的な行動計画 | なし（検知のみ、改善提案は stub） | アクション案の自動生成 + Who/What/When の明確化 |
| **結果の反映** | アクションの効果測定 → 次サイクルの計画への反映 | なし | アクション効果の追跡 + 予測モデルの更新 |

## 2. 5 層アーキテクチャへのマッピング

### 2.1 全体像

```
 Purpose ─────────────────────────────────── Governance
 (経営計画: KPI 目標 + 戦略方針)              (Trust Score × ゲート)
        │                                       │
        ▼                                       │
┌──────────────────────────────────────────────────────────┐
│  L0: Perception（知覚）                                    │
│  ● KPI 実績データの自動取得（Salesforce, GA, freee 等）     │
│  ● 週次報告の取り込み（Google Docs / Notion / 直接入力）    │
│  ● 外部データ（市場動向、競合情報 — ai-exec-dashboard 連携）│
├──────────────────────────────────────────────────────────┤
│  L1: Understanding（理解）                                 │
│  ● KPI ツリー上の異常検知（閾値超過、トレンド変化）          │
│  ● 報告テキストの曖昧さ検知（v1 の 5 パターン ← ここに残る）│
│  ● 差異の構造化（定量差異 × 定性要因のマッピング）          │
├──────────────────────────────────────────────────────────┤
│  L2: Reasoning（推論）                                     │
│  ● 差異の因果分析（なぜ乖離が生じたか）                     │
│  ● 要因の分解（市場要因 vs. 固有要因 vs. 一時要因）         │
│  ● ネクストアクションの構成（Who/What/When/完了基準）       │
│  ● アクション間の優先度付け + 依存関係の整理                │
├──────────────────────────────────────────────────────────┤
│  L3: Execution（実行）                                     │
│  ● 差異分析レポートの自動生成                               │
│  ● ネクストアクションシートの生成                           │
│  ● 高解像度化された週次報告の出力                           │
│  ● Slack / メール通知（異常検知時の即時アラート）           │
├──────────────────────────────────────────────────────────┤
│  L4: Reflection（内省）                                    │
│  ● アクションの効果測定（予測 vs. 実際のインパクト）         │
│  ● 因果モデルの精度検証 → 更新                             │
│  ● 曖昧さ検知の false positive 分析（dismiss 理由の学習）  │
│  ● 予測モデルの改善                                        │
└──────────────────────────────────────────────────────────┘
       ▲                                      ▲
  Memory                                 Orchestration
  ● 長期: 差異パターン辞書              ● サイクル駆動（週次/月次）
        + 因果モデル                    ● 異常検知時の即時起動
        + アクション効果実績            ● 定例報告フロー制御
  ● 作業: 今期の予実状態
  ● 評価: 予測精度推移
```

### 2.2 v1 の 5 パターン検知の再配置

v1 の曖昧さ検知（5 パターン）はなくなるのではなく、**L1: Understanding の中に組み込まれる。** 差異分析の入力品質を担保する機能として位置づけ直される。

| v1 パターン | v2 での位置づけ | サイクルとの関係 |
|---|---|---|
| P1: 事実/解釈混在 | L1 Understanding: 報告品質チェック | 差異分析の入力が事実ベースであることを担保 |
| P2: 定量化不足 | L1 Understanding: 報告品質チェック | 差異の数値化を促進（予実管理の前提） |
| P3: アクション不明確 | L2 Reasoning: アクション構成の入力チェック | ネクストアクション工程の品質担保 |
| P4: 浅い分析 | L2 Reasoning: 因果分析の深度チェック | 差異分析工程の品質担保 |
| P5: カバレッジ不足 | L1 Understanding: 報告完全性チェック | 全 KPI の報告漏れを検知 |

## 3. エージェント設計

### 3.1 エージェント一覧

経営管理サイクルの 4 工程 + 内省の 5 つの工程に対応するエージェント群。

```
【予実管理工程】
  Agent 1: KPIPerceptionAgent           KPI 実績データの取得 + 異常検知
  Agent 2: ReportIntakeAgent            週次報告の取り込み + 品質チェック（v1 の検知機能）

【差異分析工程】
  Agent 3: VarianceAnalysisAgent        定量差異の構造化 + 因果分析

【ネクストアクション工程】
  Agent 4: ActionPlannerAgent           アクション案の生成 + 優先度付け

【実行・出力工程】
  Agent 5: ReportGeneratorAgent         差異分析レポート + アクションシートの生成

【内省工程】
  Agent 6: CycleReflectionAgent         アクション効果測定 + モデル更新
```

### 3.2 各エージェントの詳細設計

#### Agent 1: KPIPerceptionAgent（予実管理 — 知覚）

```
役割: KPI の計画値と実績値を取得し、異常を検知する

入力:
  ● KPI 定義（KPITreeNode — v1 のドメインモデルを継承）
  ● 実績データソース接続（初期: 手動入力、将来: API 自動取得）
  ● 計画値（期初に Governor が設定）

処理:
  1. 各 KPI の実績値を取得
  2. 計画値との差異を算出（絶対差異 + 相対差異）
  3. 異常検知:
     - 閾値超過: 達成率が warning/critical 閾値を下回った
     - トレンド変化: 3 期連続の悪化傾向
     - 急変: 前期比で ±20% 以上の変動
  4. KPI ツリー上で異常の伝播を分析
     （子 KPI の異常が親 KPI にどう影響するか）

出力:
  ● KPIStatusReport:
    - 全 KPI の達成率
    - 異常フラグ付き KPI リスト
    - 異常の伝播マップ（どの子 KPI が親の未達を引き起こしているか）

HITL Gate: なし（データ取得は自律実行）
  ※ ただし異常検知のロジック変更は Governor 承認が必要
```

**v1 からの活用:**
- `domain/kpi/types.ts` の `KPITreeNode` 型をそのまま継承
- `domain/settings/types.ts` の `KPIDefinition`（閾値含む）を活用
- DashboardView のツリー表示をリアルデータで駆動

#### Agent 2: ReportIntakeAgent（予実管理 — 知覚 + 理解）

```
役割: 週次報告を取り込み、品質チェック（v1 の曖昧さ検知）を行う

入力:
  ● 週次報告テキスト（Google Docs / Notion / 直接入力）
  ● KPIStatusReport（Agent 1 の出力 — KPI との照合用）
  ● [新規] 報告者の等級情報（agentic-ai-hr 共有記憶から取得）

処理:
  1. 報告テキストの構造解析（セクション分割、KPI への紐付け）
  2. 曖昧さ検知 — v1 の 5 パターンを実行:
     - P1: 事実/解釈混在
     - P2: 定量化不足
     - P3: アクション不明確（→ Agent 4 の入力品質担保）
     - P4: 浅い分析（→ Agent 3 の入力品質担保）
     - P5: カバレッジ不足（KPI ツリーとの照合で未言及 KPI を検出）
  3. [新規] 等級に応じた期待水準の動的調整
     - G2 リーダーサポート: P4（浅い分析）の閾値を緩和
     - G5 マネージャー: P4 を厳格に適用、P1 は Critical 扱い
  4. 品質スコアの算出（v1 仕様: 100 - (Critical×5 + Warning×2 + Info×1)）

出力:
  ● AuditResult（v1 のドメインモデルをそのまま使用）
  ● StructuredReport: KPI ごとにセグメント化された報告内容

HITL Gate: REPORT_QUALITY
  指摘への対応: [解決済み] [却下（理由入力）]
  → 却下理由は Agent 6（Reflection）の学習入力
```

**v1 からの活用:**
- `domain/audit/types.ts` の全型定義をそのまま使用
- `useAuditLog` フックの resolve/dismiss ロジックを継承
- AuditPanel コンポーネントをそのまま再利用
- EditorView のレイアウト（左: 報告、右: 指摘パネル）を継承

#### Agent 3: VarianceAnalysisAgent（差異分析 — 理解 + 推論）

**v2 の中核エージェント。v1 には存在しない。**

```
役割: KPI の差異を構造的に分析し、因果関係を特定する

入力:
  ● KPIStatusReport（Agent 1: どの KPI が異常か）
  ● StructuredReport（Agent 2: 報告者が述べた定性的な要因）
  ● [新規] 外部データ（ai-executive-dashboard: 市場動向）
  ● [新規] Memory: 過去の差異パターン辞書 + 因果モデル

処理:
  1. 差異の分解:
     ┌──────────────────────────────────────┐
     │ 全体差異 = 市場要因 + 固有要因 + 一時要因 │
     │                                        │
     │ 例: 売上 -8%                            │
     │   市場要因: 業界全体 -3%（ai-exec-dash）│
     │   固有要因: 新規受注の遅延 -4%          │
     │   一時要因: 大型案件の期ずれ -1%        │
     └──────────────────────────────────────┘

  2. 因果チェーンの構築:
     「新規受注の遅延」→ なぜ？
       → 「SDR のアポ獲得数が目標比 72%」→ なぜ？
         → 「新規リードの質が低下」+ 「架電効率の低下」

     この因果チェーンを構造化データとして出力。

  3. 報告内容との照合:
     - 報告者が述べた要因と、データから導出された要因の一致/不一致を検出
     - 「報告では "競合の攻勢" が主因とされているが、データは "リード品質の低下" を示唆」

  4. 過去パターンとの照合:
     - Memory から「過去に同様の差異パターンがあったか」を検索
     - あった場合: そのときのアクションと効果を提示

出力:
  ● VarianceAnalysisReport:
    - KPI 別の差異分解（市場/固有/一時）
    - 因果チェーン（構造化データ）
    - 報告内容との整合性評価
    - 過去の類似パターン参照（あれば）

HITL Gate: VARIANCE_ANALYSIS
  Governor の問い: 「この因果分析は現場の実感と合っていますか？見落としている要因はありますか？」
  Sensemaker の問い: 「データに表れない定性的な要因（チームの士気、顧客の心理等）はありますか？」
```

**Neural Organization 原則の体現:**
- **Radical Transparency**: 差異の分解過程と根拠を完全に開示
- **Mutual Evolution**: Governor/Sensemaker のフィードバックが因果モデルを進化させる

#### Agent 4: ActionPlannerAgent（ネクストアクション — 推論）

**v1 では stub だった改善提案生成を、構造化されたアクション計画に昇華。**

```
役割: 差異を埋めるための具体的なアクション計画を生成する

入力:
  ● VarianceAnalysisReport（Agent 3: 因果分析結果）
  ● Purpose（経営計画の優先事項）
  ● Memory: 過去のアクション効果実績

処理:
  1. 因果チェーンの末端（根本原因）それぞれに対するアクション案を生成

  2. 各アクションを Who/What/When/完了基準 で構造化:
     ┌────────────────────────────────────────────────┐
     │ アクション: SDR 向けリード選定基準の見直し          │
     │ 担当（Who）: 営業企画 山田                        │
     │ 期限（When）: 10/25（金）                        │
     │ 完了基準: 新基準ドキュメント作成 + SDR チーム共有  │
     │ 期待効果: アポ獲得率 +5pt（72% → 77%）           │
     │ 根拠: 過去の類似施策で平均 +4-6pt の改善実績       │
     └────────────────────────────────────────────────┘

  3. アクション間の優先度付け:
     Priority Score = 緊急性×0.30 + 影響度×0.35 + 依存関係×0.20 + リソース効率×0.15
     （design.md §2.4 の Orchestration 優先度管理を適用）

  4. アクション間の依存関係の整理:
     「リード選定基準の見直し」→ 完了後に →「SDR トレーニング」

  5. [新規] 過去の類似アクションの効果参照:
     Memory から「この種のアクションの過去の効果」を検索し、期待効果の妥当性を検証

出力:
  ● ActionPlan:
    - アクションリスト（優先度順）
    - 各アクションの Who/What/When/完了基準/期待効果
    - アクション間の依存関係マップ
    - 合計期待効果（差異のうちどれだけ回復できるか）

HITL Gate: ACTION_PLAN
  Governor の問い: 「このアクション計画を承認しますか？追加・修正すべきアクションはありますか？」
```

**v1 の P3（アクション不明確）パターンとの関係:**
Agent 2 が報告中のアクションの曖昧さを検知し、Agent 4 がそれを**構造化されたアクション計画に変換する**。検知と生成が連携する。

#### Agent 5: ReportGeneratorAgent（実行）

```
役割: 差異分析結果とアクション計画を、経営者が意思決定に使える形式で出力する

入力:
  ● KPIStatusReport + VarianceAnalysisReport + ActionPlan

処理:
  1. 差異分析レポートの生成:
     - 経営サマリー（3 行で現状を要約）
     - KPI ダッシュボード（達成率一覧 + 異常フラグ）
     - 差異分解テーブル（市場/固有/一時 × KPI 別）
     - 因果チェーン図

  2. ネクストアクションシートの生成:
     | # | アクション | 担当 | 期限 | 完了基準 | 期待効果 | 優先度 |
     |---|-----------|------|------|----------|---------|-------|
     | 1 | ...       | ...  | ...  | ...      | ...     | High  |

  3. 品質チェック（design.md §1.4 の 4 段階準拠）:
     - 基準適合: フォーマット統一、用語一貫性
     - 論理整合性: 数値の正確性、因果ロジックの一貫性
     - 安全性: 機密情報の漏洩チェック
     - 最適化: 受け手（CEO / VP / マネージャー）に応じた粒度調整

出力:
  ● WeeklyManagementReport（差異分析 + アクション計画の統合レポート）

HITL Gate: REPORT_OUTPUT
  Custodian の問い: 「このレポートは関係者に共有して問題ありませんか？」
```

#### Agent 6: CycleReflectionAgent（内省）— 最重要

```
役割: 経営管理サイクル全体の学習ループを駆動する

入力:
  ● 前サイクルの ActionPlan + 今サイクルの KPIStatusReport（効果測定用）
  ● 全 HITL 修正履歴
  ● Agent 2 の dismiss 理由（曖昧さ検知の false positive 分析）

処理:
  1. アクション効果測定:
     ┌────────────────────────────────────────────────┐
     │ アクション: SDR 向けリード選定基準の見直し          │
     │ 予測効果: アポ獲得率 +5pt                         │
     │ 実際の効果: アポ獲得率 +3pt                       │
     │ 評価: 予測の 60%。リード品質は改善したが、         │
     │       架電スクリプトの更新が不足していた可能性      │
     └────────────────────────────────────────────────┘
     → 因果モデルの更新: 「リード選定基準の見直し」の効果係数を修正
     → 新たな因果リンクの追加: 「架電スクリプト」→「アポ獲得率」

  2. 因果モデルの精度検証:
     - 過去 N サイクルの予測 vs. 実績を比較
     - 精度が低い因果リンクを特定 → 修正 or 削除
     - 新たなパターンの検出 → 因果モデルに追加

  3. 曖昧さ検知の精度改善:
     - dismiss 理由の分析:
       「この指摘は的外れ。営業現場では "概ね順調" は受注確度 70%+ を意味する」
       → 学習: 営業部門の文脈では "概ね順調" を P2（定量化不足）として検出しない
     - パターン別の precision/recall 追跡

  4. サイクル全体のメタ分析:
     - 「3 サイクル連続で同じ KPI が異常を出している」→ 構造的問題の示唆
     - 「アクションの完了率が 60% にとどまっている」→ アクション設計の問題
     - 「Governor が差異分析で毎回要因を追加している」→ Perception の盲点

出力:
  ● CycleReflectionReport:
    - アクション効果のサマリー
    - 因果モデルの更新内容
    - 検知精度の改善内容
    - 構造的問題の指摘（あれば）
  ● Memory 更新:
    - 長期記憶: 差異パターン辞書 + 因果モデル + アクション効果実績
    - 評価記憶: 予測精度推移、検知精度推移

HITL Gate: なし（学習結果は自動適用。ただし因果モデルの大幅な変更は Governor 承認）
```

### 3.3 サイクル駆動ワークフロー

経営管理サイクルは**週次**で駆動される。

```
【毎週月曜 朝】
  Agent 1: KPIPerceptionAgent
    KPI 実績データを取得 → 異常検知
    ↓
  [異常あり?]──→ No → サマリーのみ出力（平常運転）
    │
    Yes
    ↓
【毎週月曜〜火曜】
  Agent 2: ReportIntakeAgent
    マネージャーの週次報告を取り込み → 品質チェック
    → マネージャーが修正 → 再チェック（ループ）
    ↓
【毎週水曜】
  Agent 3: VarianceAnalysisAgent
    差異分析（品質担保済みの報告 + KPI データ + 外部データ）
    → HITL: Governor/Sensemaker の確認
    ↓
  Agent 4: ActionPlannerAgent
    アクション計画の生成
    → HITL: Governor の承認
    ↓
【毎週木曜】
  Agent 5: ReportGeneratorAgent
    統合レポート生成 → 配信
    ↓
【毎月末（月次）】
  Agent 6: CycleReflectionAgent
    前月のアクション効果測定 → 因果モデル更新 → 検知精度改善
```

## 4. ドメインモデルの拡張

### 4.1 v1 のモデルの継承

| v1 モデル | v2 での扱い | 変更点 |
|---|---|---|
| `AuditItem` | そのまま継承 | なし |
| `AuditResult` | そのまま継承 | なし |
| `AuditPatternType` (5 種) | そのまま継承 | なし |
| `KPITreeNode` | 継承 + 拡張 | `plannedValue`, `variance` フィールド追加 |
| `KPIDefinition` | そのまま継承 | なし |
| `KPIDataEntry` | 継承 + 拡張 | `plannedValue`, `varianceType` 追加 |

### 4.2 v2 の新規モデル

```typescript
// 差異分析
interface VarianceItem {
  id: string;
  kpiId: string;
  plannedValue: number;
  actualValue: number;
  absoluteVariance: number;    // 実績 - 計画
  relativeVariance: number;    // (実績 - 計画) / 計画 × 100
  varianceType: 'favorable' | 'unfavorable';
  decomposition: VarianceDecomposition;
  causalChain: CausalChainNode[];
  period: string;              // YYYY-Wxx
}

interface VarianceDecomposition {
  marketFactor: number;        // 市場要因（%）
  specificFactor: number;      // 固有要因（%）
  temporaryFactor: number;     // 一時要因（%）
  rationale: string;           // 分解の根拠
}

interface CausalChainNode {
  id: string;
  description: string;         // 要因の説明
  depth: number;               // 因果チェーンの深度（0 = 表層、深いほど根本原因）
  children: CausalChainNode[]; // 下位の原因
  dataEvidence?: string;       // データによる裏付け
  reportEvidence?: string;     // 報告内容による裏付け
  confidence: number;          // 確信度 0-1
}

// ネクストアクション
interface ActionItem {
  id: string;
  description: string;
  who: string;                 // 担当者
  what: string;                // 具体的な行動内容
  when: string;                // 期限（YYYY-MM-DD）
  completionCriteria: string;  // 完了基準
  expectedEffect: {
    kpiId: string;
    predictedImpact: number;   // 期待効果（pt or %）
    confidence: number;        // 確信度 0-1
    basis: string;             // 根拠
  };
  priority: number;            // Priority Score
  dependsOn: string[];         // 依存するアクション ID
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  actualEffect?: number;       // 実際の効果（Reflection で記録）
}

// サイクル記録
interface ManagementCycle {
  id: string;
  period: string;              // YYYY-Wxx
  kpiStatus: KPIStatusReport;
  auditResult: AuditResult;
  varianceAnalysis: VarianceAnalysisReport;
  actionPlan: ActionPlan;
  report: WeeklyManagementReport;
  reflection?: CycleReflectionReport;
  createdAt: Date;
}
```

## 5. Memory 設計

### 5.1 3 構造の内容

| 構造 | 内容 | 技術 |
|---|---|---|
| **長期記憶** | 差異パターン辞書（「Q4 は季節性で売上 -5% が通常」）、因果モデル（構造化された因果チェーン集合）、アクション効果実績（「リード選定基準見直し → アポ率 +3-5pt」）| PostgreSQL + ベクトル DB |
| **作業記憶** | 今週の KPI 状態、進行中のアクション、現在の分析コンテキスト | Redis |
| **評価記憶** | 予測精度の推移（因果モデルの予測 vs. 実績）、検知精度の推移（precision/recall）、アクション完了率の推移 | PostgreSQL（時系列） |

### 5.2 差異パターン辞書の例

```yaml
pattern: quarterly_seasonality
description: "Q4（10-12月）は予算消化需要で受注が増加するパターン"
applicable_kpis: ["new_order_arr", "pipeline_amount"]
expected_effect: "+8-12%"
confidence: 0.85
evidence_count: 3  # 3サイクルで確認
first_observed: "2024-W40"
last_confirmed: "2025-W40"
```

### 5.3 因果モデルの例

```yaml
causal_link:
  cause: "lead_quality_decline"
  effect: "appointment_rate_decline"
  coefficient: 0.6  # リード品質が10%低下すると、アポ率は6%低下
  confidence: 0.72
  last_validated: "2025-W41"
  validation_history:
    - period: "2025-W38"
      predicted: -4.2%
      actual: -3.8%
      error: 0.4%
    - period: "2025-W41"
      predicted: -5.0%
      actual: -3.1%
      error: 1.9%  # ← 乖離が大きい → 係数の見直しが必要
```

## 6. Governance 設計

### 6.1 HITL ゲート一覧

| Gate ID | ゲート名 | 発動エージェント | 承認者 |
|---|---|---|---|
| MG-001 | REPORT_QUALITY | Agent 2 | マネージャー（報告者本人） |
| MG-002 | VARIANCE_ANALYSIS | Agent 3 | Governor（経営者）+ Sensemaker |
| MG-003 | ACTION_PLAN | Agent 4 | Governor（経営者） |
| MG-004 | REPORT_OUTPUT | Agent 5 | Custodian |
| MG-005 | CAUSAL_MODEL_UPDATE | Agent 6 | Governor（大幅変更時のみ） |

### 6.2 Trust Score の適用

```
Trust Score = 成功率 × 0.30 + 結果品質 × 0.35 + 整合性 × 0.20 + リスク管理 × 0.15
```

**neumann 固有の測定:**

| 因子 | 測定方法 |
|---|---|
| 成功率 | 差異分析が Governor に修正なしで承認された割合 |
| 結果品質 | 因果モデルの予測精度（予測効果 vs. 実際の効果） |
| 整合性 | アクション計画が経営計画の優先事項と整合している割合 |
| リスク管理 | 重大な見落とし（報告されなかった異常 KPI）が発生しなかった割合 |

**動的ゲート制御:**

| Trust Score | 自動化されるゲート |
|---|---|
| Cold Start (0.00-0.39) | 全ゲート承認必要 |
| Learning (0.40-0.69) | MG-001（報告品質）、MG-004（レポート出力）を自動パス |
| Trusted (0.70-0.89) | MG-002（差異分析）も自動パス。MG-003（アクション計画）のみ承認必要 |
| Highly Trusted (0.90+) | 全自動。ただし「前例のないパターン」の場合は MG-002, MG-003 を起動 |

## 7. 共有記憶基盤への接続

### 7.1 書き込み（他プロジェクトに提供するデータ）

| データ | 消費者 | 活用例 |
|---|---|---|
| 報告品質スコア（マネージャー別・週次） | agentic-ai-hr | コンピテンシー評価の入力データ（ReflectionAgent が活用） |
| KPI 達成率推移 | ai-executive-dashboard | 経営ダッシュボードの KPI セクション |
| アクション完了率 | agentic-ai-hr | マネージャー評価の「実行力」指標 |
| 差異パターン辞書 | ai-executive-dashboard | 市場要因の分離精度向上 |

### 7.2 読み出し（他プロジェクトから取得するデータ）

| データ | 提供元 | 活用例 |
|---|---|---|
| 等級定義（G1-G8） | agentic-ai-hr / hr-system-lings | 報告品質基準の等級別動的調整 |
| 市場トレンド | ai-executive-dashboard | 差異分解の市場要因推定 |
| 報酬・評価制度 | agentic-ai-hr | アクション設計時のインセンティブ考慮 |

## 8. v1 UI/UX の進化

### 8.1 画面構成の変化

```
v1: 3 画面
  Dashboard（KPI ツリー表示） / Editor（報告 + 監査パネル） / Settings（KPI 定義）

v2: 5 画面
  1. Dashboard（KPI 達成状況 + 異常検知 — Agent 1 の出力）
  2. Report Editor（週次報告 + 品質チェック — Agent 2 の出力）← v1 を継承
  3. Variance Analysis（差異分析 + 因果チェーン — Agent 3 の出力）← 新規
  4. Action Board（アクション計画 + 進捗追跡 — Agent 4 の出力）← 新規
  5. Settings（KPI 定義 + サイクル設定）
```

### 8.2 Variance Analysis 画面（新規）

```
┌──────────────────────────────────────────────────────────────┐
│ 差異分析 — 2025-W42                                          │
├─────────────────────────────┬────────────────────────────────┤
│ KPI 差異サマリー             │ 因果チェーン                    │
│                             │                                │
│ ■ 新規受注 ARR              │  売上未達 (-8%)                 │
│   計画: ¥120M  実績: ¥91M   │    ├─ 市場要因 (-3%)           │
│   差異: -24%  🔴 Critical   │    │   └─ 業界全体の縮小        │
│   ┌──────────────────────┐ │    ├─ 固有要因 (-4%)           │
│   │ 市場: -3% | 固有: -4%│ │    │   ├─ SDRアポ率低下 ← 🔍   │
│   │ 一時: -1%            │ │    │   │  ├─ リード品質低下      │
│   └──────────────────────┘ │    │   │  └─ 架電スクリプト陳腐化│
│                             │    │   └─ 提案→受注の転換率低下  │
│ ■ 解約率                    │    └─ 一時要因 (-1%)           │
│   計画: 1.0%  実績: 1.2%    │        └─ A社の期ずれ           │
│   差異: +0.2pt  🟡 Warning  │                                │
│                             │ [Governor確認] [Sensemaker追記] │
└─────────────────────────────┴────────────────────────────────┘
```

### 8.3 Action Board 画面（新規）

```
┌──────────────────────────────────────────────────────────────┐
│ ネクストアクション — 2025-W42    合計期待効果: +6.5pt         │
├──────────────────────────────────────────────────────────────┤
│ # │ アクション           │ 担当  │ 期限  │ 期待効果 │ 状態  │
│───┼─────────────────────┼──────┼──────┼────────┼──────│
│ 1 │ リード選定基準見直し  │ 山田  │ 10/25│ +3.0pt │ 🟡進行│
│ 2 │ 架電スクリプト更新    │ 佐藤  │ 10/28│ +2.0pt │ ⬜未着│
│   │  └─ #1 完了後に着手   │       │      │        │      │
│ 3 │ 提案テンプレート改善  │ 田中  │ 10/30│ +1.5pt │ ⬜未着│
│───┼─────────────────────┼──────┼──────┼────────┼──────│
│   │ 前週アクションの効果  │      │      │        │      │
│ P1│ SDR研修実施          │ 山田  │ 済   │ 予:+2pt│ ✅+1.5│
│ P2│ CRM データ整備       │ 渡辺  │ 済   │ 予:+1pt│ ✅+0.8│
└──────────────────────────────────────────────────────────────┘
```

## 9. v1 資産の活用マップ

v1 の実装資産を最大限に活用する。

| v1 資産 | v2 での活用 | 変更の程度 |
|---|---|---|
| `domain/audit/types.ts` | Agent 2 がそのまま使用 | 変更なし |
| `domain/kpi/types.ts` | Agent 1 が拡張して使用 | `plannedValue`, `variance` 追加 |
| `domain/settings/types.ts` | Settings 画面で継続使用 | 変更なし |
| `features/editor/` | Report Editor 画面として継続 | API 接続の追加 |
| `features/editor/hooks/useAuditLog.ts` | Agent 2 の HITL インターフェース | スコア計算式を仕様に修正 |
| `features/dashboard/` | Dashboard 画面として継続 | リアルデータ接続 |
| `lib/theme.ts` | 全画面で継続使用（Midnight Logic） | 変更なし |
| `docs/02_product/features/audit-patterns.md` | Agent 2 の検知ルール仕様書として継続 | 変更なし |

**v1 の UI 品質は高い。** デザインシステム、コンポーネント構造、ドメイン型定義はほぼそのまま v2 に持ち込める。追加するのは Variance Analysis 画面と Action Board 画面、およびバックエンド（エージェント群）。

## 10. 実装ロードマップ

### Phase 1: コアロジックの完成（3-4 週）

v1 で stub だった検知ロジックの実装 + KPI データの入出力。

- `domain/audit/detector.ts` の LLM 連携実装（Agent 2 のコア）
- `domain/audit/scorer.ts` の仕様準拠実装（スコア計算式の修正）
- KPI データの手動入力 → 達成率自動計算（Agent 1 の最小版）
- Supabase DB 連携（reports, audit_results, kpi_data テーブル）

### Phase 2: 差異分析エージェント（3-4 週）

v2 の中核。

- Agent 3: VarianceAnalysisAgent の実装
- 差異分解ロジック（市場/固有/一時）
- 因果チェーン構築の LLM 連携
- Variance Analysis 画面の実装

### Phase 3: アクション計画エージェント（2-3 週）

- Agent 4: ActionPlannerAgent の実装
- Who/What/When/完了基準の構造化生成
- 優先度スコアリング
- Action Board 画面の実装

### Phase 4: Reflection（2-3 週）

- Agent 6: CycleReflectionAgent の実装
- アクション効果測定
- 因果モデルの精度検証 → 更新
- dismiss 理由の学習（false positive 改善）

### Phase 5: 共有記憶基盤接続（2 週）

- hr-system-lings の等級データ読み出し → 品質基準の動的調整
- ai-executive-dashboard の市場データ読み出し → 差異分解の精度向上
- 報告品質データの書き出し API
