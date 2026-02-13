# Neural Organization 思想監査 — 各サブプロジェクトの整合性評価と統合設計

> 本ドキュメントは、各サブプロジェクトに Neural Organization の思想が**どの程度組み込まれているか**を監査し、v2 設計による進化を経て、最終的にすべてのプロジェクトが**一つの組織知能として合体できる状態**に向けたロードマップを定義する。

## 1. 監査フレームワーク

### 1.1 「Neural Organization に整合している」とは何か

各プロジェクトが以下の 7 つの監査軸を満たしている状態を「整合」と定義する。

| # | 監査軸 | 根拠（concept.md / design.md の原則） | 監査の問い |
|---|---|---|---|
| A1 | **Reflection（内省）** | Layer 4: アウトプットの結果を観測し、全層を更新する学習ループ | プロジェクトは自身の出力の成否から学習し、振る舞いを改善しているか |
| A2 | **Memory（記憶）** | 横断的要素: 長期記憶・作業記憶・評価記憶の 3 構造 | 判断履歴・成功/失敗パターン・暗黙の価値観が永続化されているか |
| A3 | **Governance（統治）** | 横断的要素: 二重フィルタリング原則、Trust Score による段階的自律 | 人間の承認ゲートが設計されているか。自律範囲は信頼の蓄積に応じて動的か |
| A4 | **認知パイプライン** | 5 層アーキテクチャ: Perception → Understanding → Reasoning → Execution → Reflection | データの取り込みからアウトプット生成まで、5 層の変換が意識されているか |
| A5 | **Trust Score / 段階的自律** | design.md §2.2: 信頼スコアの算出式と 4 レベル | 信頼を定量化し、自律範囲を段階的に拡大する仕組みがあるか |
| A6 | **共有記憶への接続準備** | 5 層 + Memory: 他プロジェクトと記憶を共有できるインターフェース | 他プロジェクトが読み書きできる形式でデータが公開・永続化されているか |
| A7 | **設計原則の体現** | 6 原則: Intent over Instruction, Governance not Control, Ambient Presence, Radical Transparency, Agency Preservation, Mutual Evolution | 指示ではなく意志を受け取る設計か。透明性・人間の主体性は守られているか |

### 1.2 評価スケール

| スコア | 意味 | 記号 |
|---|---|---|
| 🟢 実装済み | 設計・実装の両方が完了し、動作している | 2 |
| 🟡 設計済み | 設計または構造は存在するが、実装が未完了または空 | 1 |
| 🔴 未着手 | 設計も実装もない | 0 |

**整合度** = 各軸のスコア合計 / 14（満点） × 100

## 2. 現状監査（v1 ベースライン）

### 2.1 整合度サマリー

| プロジェクト | v1 の姿 | 整合度 | 最大の強み | 最大の弱点 |
|---|---|---|---|---|
| agentic-ai-hr | HR 制度設計の 5 段階ワークフロー | **57%** | Governance（7 HITL ゲート） | Reflection の自動化、Trust Score |
| hr-system-lings | 等級・評価・報酬の制度定義ナレッジベース | **50%** | Memory（完全な長期記憶） | 機械可読性、認知パイプラインの欠如 |
| neumann | 週次報告の曖昧さ検知 AI | **36%** | Governance（dismiss reason）+ 型設計 | コアロジック未実装、Reflection なし |
| ai-executive-dashboard | 市場情報の自動収集・週次レポート生成 | **29%** | Perception（実動作する外部データ収集） | Reflection、Governance Gate |
| agentic-ai-sales | SPIN プレゼン自動生成 CLI | **7%** | コンセプトドキュメントの思想的深さ | 全軸で未実装 |
| agentic-ai-analysis | （v1 なし） | **—** | — | 新規プロジェクトのため v1 ベースライン なし |

### 2.2 全プロジェクト共通の弱点（v1 時点）

**Reflection（内省）が最も普遍的な欠落。** 5 プロジェクト中、Reflection を実装しているプロジェクトはゼロ。全プロジェクトが「生成して終わり」の状態。

**Trust Score / 段階的自律も全プロジェクトで未実装。** agentic-ai-hr の 7 ゲートは固定的であり、信頼蓄積に応じた動的調整がない。

## 3. v2 設計 — プロダクトの再定義

v1 の監査で明らかになった根本的な問題は、各プロジェクトが**業務サイクルの一工程のツール**にとどまっていたことである。v2 では、各プロジェクトを**業務サイクル全体を最適化する Agentic AI**として再定義した。

### 3.1 再定義の全体像

| プロジェクト | v1（ツール） | v2（サイクル最適化 AI） | 設計書 |
|---|---|---|---|
| **agentic-ai-hr** + **hr-system-lings** | HR 制度の設計（5 段階 → 成果物出力） | HR 制度の**設計 → 導入 → 運用 → 進化**の全ライフサイクル。hr-system-lings の普遍的フレームワークを Knowledge Layer として統合 | `agentic-ai-hr/docs/design-v2-neural-org-aligned.md` |
| **neumann** | 週次報告の曖昧さ検知 | **経営管理サイクル**（予実管理 → 差異分析 → ネクストアクション定義 → 効果測定）の全工程最適化 | `neumann/docs/design-v2-management-cycle.md` |
| **agentic-ai-sales** | SPIN プレゼン自動生成 | **レベニューサイクル**（リード獲得 → 商談化 → 提案 → 受注 → CS → アップセル/クロスセル → プロダクトフィードバック）の全工程最適化 | `agentic-ai-sales/docs/design-v2-revenue-cycle.md` |
| **agentic-ai-analysis** | （v1 なし・新規） | **データ分析サイクル**（問い定義 → データ収集・統合 → 品質確保 → 探索的分析 → 仮説検証・モデリング → インサイト抽出 → レポーティング → 意思決定支援 → 効果測定）の全工程最適化。他 Agentic AI の「深掘り分析ハブ」としても機能 | `agentic-ai-analysis/docs/design-v2-analysis-cycle.md` |
| **ai-executive-dashboard** | 市場情報の収集・レポート生成 | v2 設計は未着手。他プロジェクトの共有記憶基盤を通じた**経営インテリジェンスの統合ハブ**への進化が期待される | — |

### 3.2 v1 資産の再配置

各プロジェクトの v1 機能は**消えるのではなく、v2 のサイクルの中の一工程に再配置される。**

| v1 の機能 | v2 での位置づけ |
|---|---|
| neumann の曖昧さ検知（5 パターン） | 経営管理サイクルの L1 Understanding 内の報告品質チェック機能。Agent 2: ReportIntakeAgent が担当 |
| agentic-ai-sales の SPIN 生成 | レベニューサイクルの L3 Execution 内の提案資料生成ツール。Agent 4: ProposalAgent が担当 |
| agentic-ai-hr の 5 段階ワークフロー | HR ライフサイクルの設計フェーズ。Agent 1-5 が Knowledge Layer 参照型に強化 |
| hr-system-lings の制度定義 | agentic-ai-hr v2 の Knowledge Layer（6 つの普遍的フレームワーク）として統合 |
| （agentic-ai-analysis は v1 なし） | 新規プロジェクト。他 Agentic AI の分析ニーズを深掘りする「分析ハブ」として設計 |

### 3.3 エージェント構成

| プロジェクト | v1 | v2 | Reflection Agent |
|---|---|---|---|
| agentic-ai-hr | 5 エージェント + 7 HITL ゲート | **8 エージェント** + 9 HITL ゲート + Trust Score | Agent 8: ReflectionAgent（HITL 修正分析 + 運用評価 + 制度改定提案） |
| neumann | 0（UI のみ） | **6 エージェント** + 5 HITL ゲート + Trust Score | Agent 6: CycleReflectionAgent（アクション効果測定 + 因果モデル更新） |
| agentic-ai-sales | 0（CLI のみ） | **10 エージェント** + 7 HITL ゲート + Trust Score | Agent 10: RevenueCycleReflectionAgent（Win/Loss 分析 + パターン学習） |
| agentic-ai-analysis | 0（新規） | **8 エージェント** + 6 HITL ゲート + Trust Score | Agent 8: AnalysisCycleReflectionAgent（分析精度追跡 + 手法改善 + 効果測定） |
| **合計** | 5 エージェント | **32 エージェント** | 4 つの専任 Reflection Agent |

### 3.4 v2 設計による整合度の変化（予測）

v2 設計が完全に実装された場合の整合度予測。

| プロジェクト | v1 整合度 | v2 整合度（予測） | 変化 | 根拠 |
|---|---|---|---|---|
| agentic-ai-hr + hr-system-lings | 57% / 50% | **93%** | +36pt / +43pt | Reflection Agent + Trust Score + Knowledge Layer + 共有記憶 API。A5 以外は全て 🟢 |
| neumann | 36% | **93%** | +57pt | 6 エージェントで全 5 層をカバー + Trust Score + 共有記憶 API |
| agentic-ai-sales | 7% | **93%** | +86pt | 10 エージェントで全 5 層 + 全サイクルをカバー + Trust Score + 共有記憶 API |
| agentic-ai-analysis | — | **93%** | — | 8 エージェントで全 5 層 + 9 工程をカバー + Trust Score + 共有記憶 API。他 Agentic AI との自動連携設計あり |
| ai-executive-dashboard | 29% | **29%** | ±0 | v2 設計未着手。他 PJ との接続により間接的に向上する余地あり |

**v2 設計後に残る唯一の未達項目は A5（Trust Score）の「実装済み」への到達。** 全プロジェクトで設計は完了するが、実データでの検証に時間を要するため 🟡 にとどまる可能性がある。

## 4. 統合設計 — 3 つのサイクルの合体

### 4.1 合体の構造

v2 の 3 プロジェクトは、それぞれが独立した業務サイクルを最適化する Agentic AI である。これらが**共有記憶基盤**を通じて接続されることで、「組織知能」が出現する。

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              AX Company — 組織知能                                │
│                                                                                  │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────────────┐│
│  │ 経営管理       │ │ HR ライフ     │ │ レベニュー    │ │ データ分析サイクル     ││
│  │ サイクル       │ │ サイクル      │ │ サイクル      │ │                       ││
│  │ neumann v2     │ │ agentic-ai-hr │ │ agentic-ai-   │ │ agentic-ai-analysis   ││
│  │ 6 Agents       │ │ v2 + lings    │ │ sales v2      │ │ v2  8 Agents          ││
│  │                │ │ 8 Agents      │ │ 10 Agents     │ │                       ││
│  │ 予実管理       │ │ 制度設計      │ │ リード獲得    │ │ 問い定義              ││
│  │ → 差異分析     │ │ → 導入        │ │ → 商談化      │ │ → データ収集・統合     ││
│  │ → アクション   │ │ → 運用        │ │ → 提案        │ │ → 品質確保・EDA       ││
│  │   定義         │ │ → 進化        │ │ → 受注        │ │ → 仮説検証・モデリング ││
│  │ → 効果測定     │ │               │ │ → CS          │ │ → インサイト抽出      ││
│  │                │ │               │ │ → アップセル  │ │ → レポーティング      ││
│  │                │ │               │ │ → PdM FB      │ │ → 効果測定            ││
│  └───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └───────────┬───────────┘│
│          │                 │                  │                     │            │
│          │                 │                  │    ┌────────────────┘            │
│          │                 │                  │    │ 深掘り分析の依頼・結果返却   │
│          ▼                 ▼                  ▼    ▼                             │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                            共有記憶基盤                                    │   │
│  │                                                                          │   │
│  │  長期記憶:                                                               │   │
│  │    等級定義 / コンピテンシー / 勝ち負けパターン辞書 / 因果モデル /        │   │
│  │    ICP プロファイル / 市場トレンド / 分析パターンライブラリ /             │   │
│  │    データ品質ルール辞書                                                   │   │
│  │                                                                          │   │
│  │  作業記憶:                                                               │   │
│  │    進行中の商談 / 今週の予実状態 / 設計中の制度案 /                       │   │
│  │    進行中の分析コンテキスト                                               │   │
│  │                                                                          │   │
│  │  評価記憶:                                                               │   │
│  │    受注率推移 / 報告品質推移 / 制度提案採択率 /                           │   │
│  │    各モデルの予測精度 / Trust Score 推移 / 分析→アクション転換率           │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│          ▲                                                                      │
│          │                                                                      │
│  ┌───────┴───────────┐                                                          │
│  │ ai-exec-dashboard │ ← 市場データの供給 + 経営レポートの統合                  │
│  │（経営インテリ      │                                                          │
│  │  ジェンスハブ）    │                                                          │
│  └───────────────────┘                                                          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 エージェント間のデータフロー

v2 のエージェント同士が共有記憶を通じて接続する具体的なデータフロー。

#### 経営管理 × HR（neumann ↔ agentic-ai-hr）

```
neumann Agent 2: ReportIntakeAgent
  ← 読み出し: 等級定義（agentic-ai-hr Knowledge Layer）
  → 書き込み: マネージャー別の報告品質スコア

  活用: 報告者の等級（G1-G8）に応じた曖昧さ検知の閾値動的調整
        G2 の報告に「戦略的視座の欠如」を検知しない
        G5 の報告には厳格に適用

agentic-ai-hr Agent 8: ReflectionAgent
  ← 読み出し: 報告品質スコア（neumann の評価記憶）
  → 書き込み: コンピテンシー定義の改善提案

  活用: 「G3 以上で "行動不明確" が 40% 発生」を検出
        → コンピテンシー「実行・行動」の期待基準を具体化する改定提案を自動生成
```

#### 経営管理 × レベニュー（neumann ↔ agentic-ai-sales）

```
neumann Agent 1: KPIPerceptionAgent
  ← 読み出し: 受注/失注データ、パイプライン進捗（agentic-ai-sales v2 の評価記憶）
  → 書き込み: KPI 達成率（売上系 KPI）

  活用: 営業 KPI の予実管理データとして自動取り込み

neumann Agent 3: VarianceAnalysisAgent
  ← 読み出し: 市場トレンド（ai-executive-dashboard）
  → 書き込み: 差異分解結果（市場要因 / 固有要因 / 一時要因）

  活用: 売上未達の因果分析で市場要因を自動分離
        「業界全体 -3% を考慮すると固有要因は -2pt」

agentic-ai-sales v2 Agent 3: DealStrategyAgent
  ← 読み出し: ネクストアクション（neumann Agent 4 の出力）

  活用: 経営管理サイクルで決定されたアクション（「新規受注にフォーカス」）
        を商談戦略に反映
```

#### レベニュー × HR（agentic-ai-sales ↔ agentic-ai-hr）

```
agentic-ai-sales v2 Agent 4: ProposalAgent
  ← 読み出し: 営業担当者の等級（agentic-ai-hr Knowledge Layer）

  活用: 担当者のスキルレベルに応じた支援度調整
        ジュニア（G1-G2）→ 詳細スピーカーノート + ロールプレイスクリプト
        シニア（G4+）→ 要点のみ + カスタマイズ余地を広く

agentic-ai-sales v2 Agent 10: RevenueCycleReflectionAgent
  → 書き込み: 営業活動データ（アクション完了率、商談進捗）

agentic-ai-hr Agent 8: ReflectionAgent
  ← 読み出し: 営業活動データ

  活用: マネージャーの評価入力データとして活用
        「営業マネージャー A のチームは商談化率が平均 +15pt」
        → 評価制度のデータ駆動化
```

#### 経営管理 × データ分析（neumann ↔ agentic-ai-analysis）

```
neumann Agent 1: KPIPerceptionAgent
  → 書き込み: KPI 異常検知結果
  → 自動トリガー: agentic-ai-analysis Agent 1 に分析リクエストを発行

  活用: 「売上 -24%」→ 自動的に「なぜ売上が減少したか？」の分析サイクルが起動
        人間が分析を依頼する前に、問いの構造化と優先度判定が完了している

agentic-ai-analysis Agent 6: InsightGeneratorAgent
  → 書き込み: インサイト + アクション提案

neumann Agent 3: VarianceAnalysisAgent
  ← 読み出し: 統計モデルベースの因果分析結果

  活用: neumann の差異分析が「経験則」から「統計的に検証された因果モデル」に進化
        「CPA 上昇が売上鈍化の 60% を説明（p < 0.01）」
```

#### レベニュー × データ分析（agentic-ai-sales ↔ agentic-ai-analysis）

```
agentic-ai-sales Agent 10: RevenueCycleReflectionAgent
  → 書き込み: Win/Loss データ、失注パターン

agentic-ai-analysis Agent 5: StatisticalModelingAgent
  ← 読み出し: Win/Loss データ
  → 書き込み: 因果推論結果（「価格」「機能」「競合」の影響度定量化）

agentic-ai-sales Agent 3: DealStrategyAgent
  ← 読み出し: 因果推論結果

  活用: 商談戦略が「感覚」から「統計的根拠に基づく優先度付け」に進化
        「価格が失注の 45% を説明。ただし CTO 直接接点がある場合は影響度 15% に低下」

agentic-ai-analysis Agent 5: StatisticalModelingAgent
  → 書き込み: リードスコアリングモデル、解約予測モデル

agentic-ai-sales Agent 1: LeadIntelligenceAgent
  ← 読み出し: リードスコアリングモデル

  活用: リード評価が統計モデルに基づいて精緻化
```

#### HR × データ分析（agentic-ai-hr ↔ agentic-ai-analysis）

```
agentic-ai-analysis Agent 5: StatisticalModelingAgent
  → 書き込み: セグメンテーション結果（従業員クラスター分析）

agentic-ai-hr Agent 8: ReflectionAgent
  ← 読み出し: セグメンテーション結果

  活用: 制度効果が従業員セグメント別に分析される
        「G3-G4 の技術職で、現在の評価基準と実績の相関が低い（r=0.35）」
        → 技術職の評価基準改定提案の根拠データとして活用
```

#### 全プロジェクト ← ai-executive-dashboard

```
ai-executive-dashboard
  → 書き込み: 市場トレンド、競合動向、業界シグナル

neumann Agent 3: VarianceAnalysisAgent
  ← 読み出し: 市場トレンド → 差異分解の市場要因推定

agentic-ai-sales v2 Agent 4: ProposalAgent
  ← 読み出し: 市場トレンド → 提案の文脈付け（「御社の業界では〜」）

agentic-ai-sales v2 Agent 3: DealStrategyAgent
  ← 読み出し: 競合動向 → 商談戦略の競合対策

agentic-ai-hr Agent 5: CompensationArchitectAgent
  ← 読み出し: 市場トレンド → 報酬制度の市場整合性評価
```

### 4.3 Reflection の連鎖 — 組織が学習するメカニズム

4 つの Reflection Agent が共有記憶を通じて連鎖し、**組織全体の学習ループ**を形成する。

```
┌──────────────────────────────────────────────────────────────────┐
│                      Reflection の連鎖                             │
│                                                                  │
│  neumann Agent 6                                                  │
│  CycleReflectionAgent                                             │
│  「アクション効果が予測の 60%。                                    │
│   架電スクリプトの更新が不足していた」                              │
│         │                                                         │
│         │ → 共有記憶に書き込み                                     │
│         ├──────────────────────────────────────┐                  │
│         ▼                                      ▼                  │
│  agentic-ai-sales v2 Agent 10          agentic-ai-analysis Agent 8│
│  RevenueCycleReflectionAgent           AnalysisCycleReflection    │
│  「架電スクリプトの更新が受注率に      「因果モデルの係数を更新:   │
│   影響。勝ちパターン辞書に             架電スクリプト鮮度→受注率  │
│   "スクリプト鮮度" を因子として追加」  の影響度を 0.15→0.28 に。  │
│         │                              手法有効性: 因果推論が      │
│         │                              営業 KPI 分析で有効」       │
│         │                                      │                  │
│         │ → 共有記憶に書き込み                  │                  │
│         ▼                                      │                  │
│  agentic-ai-hr Agent 8                         │                  │
│  ReflectionAgent                                │                  │
│  「営業チームの "実行・行動" コンピテンシーに   │                  │
│   "ツール・ナレッジの継続的更新" を追加提案」    │                  │
│         │                                      │                  │
│         │ → HITL: Governor 承認 → 制度改定      │                  │
│         ▼                                      ▼                  │
│  次サイクルで neumann が改定後の       analysis が更新された因果   │
│  コンピテンシー基準で報告品質を評価    モデルで次の差異分析を実行   │
└──────────────────────────────────────────────────────────────────┘
```

**これが Neural Organization の核心。** 個別プロジェクトの学習が共有記憶を通じて他プロジェクトに伝播し、組織全体が一つの知能として学習する。agentic-ai-analysis の Reflection Agent は特に、**全プロジェクトの因果モデルの精度を統計的に検証し、学習の質そのものを向上させる「メタ学習」の役割**を担う。

## 5. AX Company の具体像 — v2 が実現する世界

### 5.1 月曜日の朝

```
07:00  neumann Agent 1（KPIPerception）が先週の KPI 実績を自動取得。
       売上 KPI に異常検知: 新規受注 ARR が計画比 -24%。
       → 共有記憶に KPIStatusReport を書き込み

08:00  営業マネージャー（G5）が週次報告を入力。
       neumann Agent 2（ReportIntake）が品質チェック:
       「"概ね順調" → 定量化不足。達成率と具体的な数値を記載してください」
       「"フォローアップする" → アクション不明確。Who/When/完了基準を」
       等級 G5 に応じた厳格な基準で検知。
       マネージャーが修正 → 報告が高解像度化

08:30  agentic-ai-analysis Agent 1（QuestionArchitect）が neumann の KPI 異常検知を受信:
       自動連携: 「売上 ARR -24%」→ 分析リクエストを自動構造化
       主問い: 「新規受注 ARR 鈍化の主要因は何か」
       副問い: 「チャネル別 CPA は変化したか」「リード品質は変化したか」
       → Agent 4-5 が探索的分析 + 仮説検証を自律実行

09:00  neumann Agent 3（VarianceAnalysis）が差異分析:
       「売上 -24% の分解: 市場要因 -3%（ai-exec-dashboard）、固有要因 -20%、一時要因 -1%」
       agentic-ai-analysis の因果推論結果を活用:
       「CPA 上昇が固有要因の 60% を説明（p < 0.01）。特に Web 広告チャネル」
       → HITL: Governor が因果分析を確認、Sensemaker が定性要因を追加

10:00  neumann Agent 4（ActionPlanner）がアクション計画を生成:
       「1. リード選定基準の見直し（山田、10/25、期待効果 +3pt）」
       「2. 架電スクリプト更新（佐藤、10/28、期待効果 +2pt）」
       → Governor が承認

10:30  agentic-ai-sales v2 Agent 3（DealStrategy）が進行中の商談戦略を更新:
       「経営方針: 新規受注にフォーカス」を反映。
       商談 A 社: MEDDIC フレームワークを推奨、CTO との直接接点を確保
       → Agent 4（ProposalAgent）が ROI 定量化スライド付きの提案資料を自動生成
         ai-executive-dashboard の最新市場トレンドを引用:
         「御社の業界では AI 投資が前年比 +40%。競合 B 社は既に導入済み」

11:00  agentic-ai-hr Agent 8（Reflection）が前四半期の評価データを分析:
       「G3 リーダー層の "実行・行動" コンピテンシーが組織平均を下回っている」
       neumann の報告品質データと照合:
       「G3 の報告で "行動不明確" パターンが 40% 発生」
       → コンピテンシー定義の改善提案を Governor に提出
```

### 5.2 四半期末

```
3 つの Reflection Agent が四半期内省を実行:

● neumann Agent 6（CycleReflection）:
  アクション効果測定: 「リード選定基準見直し → 予測 +3pt、実績 +1.5pt。
  因果モデルの係数を修正。"架電スクリプト鮮度" を新たな因果リンクとして追加」

● agentic-ai-sales v2 Agent 10（RevenueCycleReflection）:
  Win/Loss 分析: 「受注 12 件の共通パターン — CTO 直接接点 + ROI 定量化スライド。
  失注 8 件の共通パターン — 価格交渉で敗退。初期段階での ROI 訴求を強化すべき」
  → 勝ちパターン辞書を更新

● agentic-ai-hr Agent 8（Reflection）:
  制度運用評価: 「評価結果の分布 — G3 で "Below" が 25%。
  コンピテンシー定義が抽象的すぎる可能性。具体的な行動指標の追加を提案」
  → 制度改定案を Governor に提出

● agentic-ai-analysis Agent 8（AnalysisCycleReflection）:
  分析精度の追跡: 「Q3 の売上鈍化分析 — 予測効果 +12%、実績 +8%。
  紹介チャネルの効果発現が想定より遅い。学習: 効果発現に 2 四半期要」
  手法有効性: 「因果推論は営業 KPI 分析で精度が高い（平均 accuracy 0.78）」
  → 分析パターンライブラリを更新

● 統合 Reflection（横断分析 — agentic-ai-analysis が統計的に検証）:
  「営業チームの架電スクリプト陳腐化 → 受注率低下 → 売上 KPI 未達」の因果チェーンが
  4 つのサイクルを横断して検証された。
  agentic-ai-analysis が因果モデルの統計的有意性を確認（p < 0.01）
  → 組織レベルの学習: 「ツール・ナレッジの更新頻度」を全等級の評価基準に反映
```

### 5.3 1 年後

```
組織全体の状態:

● 経営管理: 報告品質スコア 45 → 88。因果分析の予測精度 60% → 82%
● レベニュー: 受注率 25% → 38%。新人の初受注までの日数 90 日 → 35 日
● HR: 制度改定サイクル 年次 → 四半期（データ駆動の継続的改善）
● データ分析: 分析→アクション転換率 30% → 75%。分析依頼の平均完了時間 2 週間 → 3 日
● 全体: Trust Score が Trusted レベルに到達。定型的な判断はシステムが自律実行

Governor の体験:
  「3 つのサイクルが回っていると、会社が何を知っていて、何をしていて、
   何がうまくいっていないかが、聞かなくても分かる。
   私の仕事は "どこへ向かうか" を決めることだけになった」
```

## 6. 統合準備度マトリクス

### 6.1 統合の前提条件

| 前提条件 | 説明 |
|---|---|
| P1: 外部公開可能なデータ構造 | 他プロジェクトが読み取れる形式でデータが構造化されている |
| P2: API / インターフェースの存在 | データの読み書きが API 経由で可能 |
| P3: Memory の 3 構造への対応 | 長期記憶・作業記憶・評価記憶の区分が存在する |
| P4: Reflection によるデータ品質の担保 | 学習ループにより出力品質が継続的に向上している |
| P5: Governance Gate の実装 | 人間の承認フローが存在し、共有記憶への書き込みが統治されている |

### 6.2 v1 → v2 の変化

| プロジェクト | P1 | P2 | P3 | P4 | P5 | v1 準備度 | v2 準備度（設計完了時） |
|---|---|---|---|---|---|---|---|
| agentic-ai-hr + hr-system-lings | 🟢 | 🟡→🟢 | 🟡→🟢 | 🔴→🟢 | 🟢 | 35% | **90%** |
| neumann | 🟡→🟢 | 🔴→🟢 | 🔴→🟢 | 🔴→🟢 | 🟡→🟢 | 15% | **90%** |
| agentic-ai-sales | 🔴→🟢 | 🔴→🟢 | 🔴→🟢 | 🔴→🟢 | 🔴→🟢 | 0% | **90%** |
| agentic-ai-analysis | —→🟢 | —→🟢 | —→🟢 | —→🟢 | —→🟢 | — | **90%** |
| ai-executive-dashboard | 🟢 | 🟡 | 🔴 | 🔴 | 🟡 | 25% | **25%** |

**v2 設計により、4 プロジェクトの統合準備度が 0-35% → 90% に跳躍する。** ai-executive-dashboard の v2 設計が残された課題。

## 7. 実装ロードマップ

### 7.1 全体の時間軸

```
Phase 1: 個別プロジェクトの v2 コア実装
  各プロジェクトが独立に v2 のコア機能を実装する。
  共有記憶基盤はまだ不要。各プロジェクト内の Memory で完結。

Phase 2: 最初の接続（2 プロジェクト間）
  hr-system-lings → agentic-ai-hr（Knowledge Layer 接続）
  hr-system-lings → neumann（等級別の品質基準調整）

Phase 3: 共有記憶基盤の構築 + 全プロジェクト接続
  共有記憶基盤の最小構成を構築し、全プロジェクトを接続。
  agentic-ai-analysis を「分析ハブ」として接続（neumann → analysis の自動連携が最優先）。
  ai-executive-dashboard の v2 設計もこの段階で着手。

Phase 4: 統合 Reflection + Trust Score の統合管理
  4 つの Reflection Agent が連鎖する統合学習ループの実現。
  agentic-ai-analysis の因果モデルが全プロジェクトの Reflection の質を底上げ。
```

### 7.2 Phase 1 の詳細（各プロジェクト並行）

**agentic-ai-hr v2（14-18 週）:**

| Step | 内容 | 期間 |
|---|---|---|
| H1 | Knowledge Layer の構築（hr-system-lings の 6 フレームワークを YAML 化） | 2-3 週 |
| H2 | 既存 Agent 1-5 を Knowledge Layer 参照型に改修 | 3-4 週 |
| H3 | Memory の永続化（PostgreSQL スキーマ + HITL 修正履歴の記録） | 2-3 週 |
| H4 | Agent 6-7 の新規実装（PolicyDocumentAgent + DeploymentPlannerAgent） | 4-5 週 |
| H5 | Agent 8: ReflectionAgent の実装 | 2-3 週 |

**neumann v2（11-15 週）:**

| Step | 内容 | 期間 |
|---|---|---|
| N1 | v1 コアロジック完成（detector, scorer の LLM 連携実装 + DB 連携） | 3-4 週 |
| N2 | Agent 3: VarianceAnalysisAgent（差異分解 + 因果チェーン構築） | 3-4 週 |
| N3 | Agent 4: ActionPlannerAgent（Who/What/When 構造化 + 優先度付け） | 2-3 週 |
| N4 | Agent 6: CycleReflectionAgent（アクション効果測定 + 因果モデル更新） | 2-3 週 |
| N5 | Variance Analysis 画面 + Action Board 画面の実装 | 含む |

**agentic-ai-sales v2（14-19 週）:**

| Step | 内容 | 期間 |
|---|---|---|
| S1 | 提案エンジン完成（複数フレームワーク + 品質チェック + DB 導入） | 3-4 週 |
| S2 | Agent 3 + 10（DealStrategy + RevenueCycleReflection — Win/Loss 分析） | 3-4 週 |
| S3 | Agent 1 + 2（LeadIntelligence + Outreach — CRM 連携） | 3-4 週 |
| S4 | Agent 6 + 7（CustomerHealth + Expansion） | 3-4 週 |
| S5 | Agent 5 + 8（Pricing + ProductFeedback + 共有記憶接続） | 2-3 週 |

**agentic-ai-analysis v2（11-14 週）:**

| Step | 内容 | 期間 |
|---|---|---|
| A1 | Agent 1 + 4 + 7（問い定義 + 自動 EDA + レポート生成）+ DB 導入 | 3-4 週 |
| A2 | Agent 2 + 3（データ統合 + 品質チェック + ルール辞書） | 3-4 週 |
| A3 | Agent 5 + 6（統計モデリング + インサイト生成 + アクション提案） | 3-4 週 |
| A4 | Agent 8: AnalysisCycleReflectionAgent（分析精度追跡 + 手法改善） | 2-3 週 |

### 7.3 Phase 2: 最初の接続

| 接続 | 内容 | 前提 |
|---|---|---|
| hr-system-lings → agentic-ai-hr | Knowledge Layer の 6 フレームワーク（YAML）読み込み | H1 完了 |
| hr-system-lings → neumann | 等級定義の読み出し → 報告品質基準の動的調整 | H1 + N1 完了 |

### 7.4 Phase 3: 共有記憶基盤 + 全接続

| 構成要素 | 技術 | 内容 |
|---|---|---|
| 長期記憶 | PostgreSQL + ベクトル DB | 等級定義、コンピテンシー、勝ち負けパターン、因果モデル、ICP プロファイル、分析パターンライブラリ、データ品質ルール辞書 |
| 作業記憶 | Redis | 進行中の商談、今週の予実状態、設計中の制度案、進行中の分析コンテキスト |
| 評価記憶 | PostgreSQL（時系列） | 受注率推移、報告品質推移、予測精度推移、Trust Score 推移、分析→アクション転換率 |
| API 層 | REST（各プロジェクト共通） | 言語を跨いだ読み書きインターフェース |

### 7.5 Phase 4: 統合 Reflection

- 4 つの Reflection Agent の連鎖学習ループの実現（§4.3）
- Trust Score の統合管理（全プロジェクト横断）
- 四半期統合内省の自動実行
- agentic-ai-analysis が統合 Reflection の統計的検証を担当（因果チェーンの有意性確認）

## 8. 未解決の問い

### 8.1 ai-executive-dashboard の v2 設計

4 プロジェクトの v2 設計は完了したが、ai-executive-dashboard の v2 設計は未着手。他 4 プロジェクトが共有記憶基盤を通じてデータを交換する中で、ai-executive-dashboard は「経営インテリジェンスの統合ハブ」としてどう進化すべきか。市場データの供給に加え、4 つのサイクルの KPI を統合する経営ダッシュボードへの進化が考えられる。特に agentic-ai-analysis のインサイトを経営ダッシュボードに統合することで、「データに基づく経営判断」が日常化する。

### 8.2 共有記憶基盤の技術選定

3 プロジェクトの実装言語が Python（agentic-ai-hr, agentic-ai-sales）と TypeScript（neumann, ai-executive-dashboard）に分かれている。REST API を共通インターフェースとするのが現実的だが、リアルタイム性が必要な接続（例: neumann の異常検知 → 即時アラート）にはイベント駆動（RabbitMQ / Redis Pub/Sub）の併用が必要か。

### 8.3 32 エージェントの運用コスト

v2 の全エージェントが稼働すると、LLM API コスト・インフラコストが大幅に増加する。Phase 1 では各プロジェクトのコアエージェントのみを実装し、段階的に拡張すべき。各エージェントの LLM 呼び出し頻度とコスト見積もりが必要。特に agentic-ai-analysis は統計モデリングにコンピュート集約的な処理を含むため、LLM 呼び出し以外のコスト（GPU / データ処理基盤）も考慮が必要。

### 8.4 Trust Score のプロジェクト横断管理

各プロジェクトの Trust Score は独立に算出されるが、「組織全体の Trust Score」をどう定義するか。各プロジェクトの Trust Score の加重平均か、それとも最も低いプロジェクトのスコアがボトルネックになるか。

### 8.5 neural-organization-v1-visual の位置づけ

5 層アーキテクチャの可視化 Web アプリ（v1.0 コンセプト）を、4 つのサイクル × 32 エージェントの状態をリアルタイムに可視化する「AX Company 指揮所（Command Center）」に進化させることは有効か。design.md §3.1 の Mode 5（Command Center）の実装として位置づけられる。

### 8.6 agentic-ai-analysis と ai-executive-dashboard の境界

agentic-ai-analysis（データ分析サイクル最適化）と ai-executive-dashboard（市場情報収集・経営レポート）は、ともにデータを扱い可視化を行う点で重なりがある。明確な境界として、ai-executive-dashboard は**外部データの収集と経営 KPI の統合表示**、agentic-ai-analysis は**問いに駆動される深掘り分析と因果推論**という区分が妥当か。あるいは、ai-executive-dashboard の v2 設計時に agentic-ai-analysis の一部機能を統合すべきか。
