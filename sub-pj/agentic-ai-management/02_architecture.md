# Agentic AI Management アーキテクチャ

> システムアーキテクチャ、5 層マッピング、エージェント設計、Tech Stack を定義する。

## 1. アーキテクチャ概要

Phase 1（MVP）では vercel-stack をベースとしたモダンスタックを採用する。本番運用可能な品質（テスト、CI/CD、監視）を初期から組み込む。

```
┌─────────────────────────────────────────────────────────┐
│              agentic-ai-management (Next.js App Router)   │
│  ┌─────────────┬─────────────┬─────────────┐            │
│  │   UI Layer  │  Features   │  Server     │            │
│  │   (RSC)     │  Layer      │  Actions    │            │
│  └──────┬──────┴──────┬──────┴──────┬──────┘            │
│         │             │             │                    │
│         ▼             ▼             ▼                    │
│  ┌─────────────────────────────────────────┐            │
│  │         Domain Layer (★ Core)           │            │
│  │   Audit / Intervention / KPI            │            │
│  └──────────────────┬──────────────────────┘            │
└─────────────────────┼───────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │ AI       │ │ Supabase │ │ External     │
   │ (Claude  │ │ (Auth,   │ │ (Google,     │
   │  API)    │ │  DB)     │ │  Notion)     │
   └──────────┘ └──────────┘ └──────────────┘
```

## 2. 5 層マッピング（Neural Organization）

### 2.1 全体像

本プロダクトの全機能を Neural Organization の 5 層アーキテクチャにマッピングする。

```
 Purpose ─────────────────────────────────── Governance
 (経営計画: KPI 目標 + 戦略方針)              (Trust Score x ゲート)
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
│  ● 報告テキストの曖昧さ検知（5 パターン）                   │
│  ● 差異の構造化（定量差異 x 定性要因のマッピング）          │
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

### 2.2 曖昧さ検知 5 パターンの層内配置

v1 の曖昧さ検知は消滅するのではなく、L1/L2 の中に組み込まれる。

| v1 パターン | v2 での層 | サイクルとの関係 |
|---|---|---|
| P1: 事実/解釈混在 | L1 Understanding | 差異分析の入力が事実ベースであることを担保 |
| P2: 定量化不足 | L1 Understanding | 差異の数値化を促進（予実管理の前提） |
| P3: アクション不明確 | L2 Reasoning | ネクストアクション工程の品質担保 |
| P4: 浅い分析 | L2 Reasoning | 差異分析工程の品質担保 |
| P5: カバレッジ不足 | L1 Understanding | 全 KPI の報告漏れを検知 |

## 3. エージェント設計

経営管理サイクルの 4 工程 + 内省に対応する 6 つのエージェント。

### 3.1 エージェント一覧

```
【予実管理工程 — L0/L1】
  Agent 1: KPIPerceptionAgent       KPI 実績データの取得 + 異常検知
  Agent 2: ReportIntakeAgent        週次報告の取り込み + 品質チェック

【差異分析工程 — L1/L2】
  Agent 3: VarianceAnalysisAgent    定量差異の構造化 + 因果分析

【ネクストアクション工程 — L2】
  Agent 4: ActionPlannerAgent       アクション案の生成 + 優先度付け

【実行・出力工程 — L3】
  Agent 5: ReportGeneratorAgent     レポート + アクションシートの生成

【内省工程 — L4】
  Agent 6: CycleReflectionAgent     効果測定 + モデル更新
```

### 3.2 Agent 1: KPIPerceptionAgent

KPI の計画値と実績値を取得し、異常を検知する。

- **入力**: KPI 定義（KPITreeNode）、実績データソース、計画値
- **処理**: 実績値取得、差異算出、異常検知（閾値超過/トレンド変化/急変）、KPI ツリー上の異常伝播分析
- **出力**: KPIStatusReport（達成率、異常フラグ付きリスト、伝播マップ）
- **HITL Gate**: なし（データ取得は自律実行）

### 3.3 Agent 2: ReportIntakeAgent

週次報告を取り込み、品質チェック（v1 の曖昧さ検知）を行う。

- **入力**: 週次報告テキスト、KPIStatusReport（Agent 1）、報告者の等級情報
- **処理**: 構造解析、曖昧さ 5 パターン検知、等級別の期待水準調整、品質スコア算出
- **出力**: AuditResult、StructuredReport
- **HITL Gate**: REPORT_QUALITY（指摘への対応: 解決済み / 却下）

### 3.4 Agent 3: VarianceAnalysisAgent

**v2 の中核エージェント。** 差異を構造的に分析し、因果関係を特定する。

- **入力**: KPIStatusReport、StructuredReport、外部データ（市場動向）、Memory（過去パターン）
- **処理**: 差異の分解（市場/固有/一時）、因果チェーン構築、報告内容との照合、過去パターン参照
- **出力**: VarianceAnalysisReport（差異分解、因果チェーン、整合性評価）
- **HITL Gate**: VARIANCE_ANALYSIS（Governor + Sensemaker 確認）

### 3.5 Agent 4: ActionPlannerAgent

差異を埋めるための具体的なアクション計画を生成する。

- **入力**: VarianceAnalysisReport、Purpose（経営計画の優先事項）、Memory（過去のアクション効果）
- **処理**: アクション案生成、Who/What/When 構造化、優先度スコアリング、依存関係整理
- **出力**: ActionPlan（優先度順リスト、依存関係マップ、合計期待効果）
- **HITL Gate**: ACTION_PLAN（Governor 承認）

### 3.6 Agent 5: ReportGeneratorAgent

差異分析結果とアクション計画を、意思決定に使える形式で出力する。

- **入力**: KPIStatusReport + VarianceAnalysisReport + ActionPlan
- **処理**: レポート生成、アクションシート生成、品質チェック、受け手別粒度調整
- **出力**: WeeklyManagementReport
- **HITL Gate**: REPORT_OUTPUT（Custodian 確認）

### 3.7 Agent 6: CycleReflectionAgent

経営管理サイクル全体の学習ループを駆動する。

- **入力**: 前サイクルの ActionPlan + 今サイクルの KPIStatusReport、HITL 修正履歴、dismiss 理由
- **処理**: アクション効果測定、因果モデル精度検証・更新、検知精度改善、サイクル全体のメタ分析
- **出力**: CycleReflectionReport、Memory 更新
- **HITL Gate**: なし（大幅変更時のみ Governor 承認）

### 3.8 週次ワークフロー

```
【毎週月曜 朝】Agent 1: KPI データ取得 → 異常検知
    ↓
【月曜-火曜】 Agent 2: 報告取り込み → 品質チェック → マネージャー修正 → 再チェック
    ↓
【水曜】      Agent 3: 差異分析 → HITL 確認
              Agent 4: アクション計画 → Governor 承認
    ↓
【木曜】      Agent 5: 統合レポート生成 → 配信
    ↓
【月末】      Agent 6: 効果測定 → モデル更新 → 検知精度改善
```

## 4. Governance 設計

### 4.1 HITL ゲート一覧

| Gate ID | ゲート名 | エージェント | 承認者 |
|---|---|---|---|
| MG-001 | REPORT_QUALITY | Agent 2 | マネージャー（報告者本人） |
| MG-002 | VARIANCE_ANALYSIS | Agent 3 | Governor + Sensemaker |
| MG-003 | ACTION_PLAN | Agent 4 | Governor |
| MG-004 | REPORT_OUTPUT | Agent 5 | Custodian |
| MG-005 | CAUSAL_MODEL_UPDATE | Agent 6 | Governor（大幅変更時のみ） |

### 4.2 Trust Score

```
Trust Score = 成功率 x 0.30 + 結果品質 x 0.35 + 整合性 x 0.20 + リスク管理 x 0.15
```

| Trust Score 範囲 | 自動化されるゲート |
|---|---|
| Cold Start (0.00-0.39) | 全ゲート承認必要 |
| Learning (0.40-0.69) | MG-001, MG-004 を自動パス |
| Trusted (0.70-0.89) | MG-002 も自動パス。MG-003 のみ承認必要 |
| Highly Trusted (0.90+) | 全自動。前例のないパターンのみゲート起動 |

## 5. Tech Stack

### 5.1 現行実装（v1 / Phase 1）

| Category | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | RSC, Server Actions |
| **UI** | React 18 + Tailwind CSS | Zustand で状態管理 |
| **AI** | Claude API (Anthropic) | 曖昧さ検知、質問生成 |
| **Language** | TypeScript 5.4 | 型安全 |
| **Icons** | Lucide React | |

### 5.2 計画スタック（v2 / Phase 2）

| Category | Technology | Notes |
|---|---|---|
| **Hosting** | Vercel | Edge Functions, Preview Deployments |
| **Framework** | Next.js 15 (App Router) | RSC, Server Actions, Turbopack |
| **AI** | Vercel AI SDK v5 | `@ai-sdk/anthropic`, streamText |
| **Database** | Supabase PostgreSQL | Managed, RLS support |
| **ORM** | Drizzle | Type-safe, migrations, schema-first |
| **Auth** | Supabase Auth | Google OAuth, RLS integration |
| **Storage** | Supabase Storage | File uploads, signed URLs |
| **Styling** | Tailwind CSS + shadcn/ui | Design system, accessibility |
| **Validation** | Zod | Schema sharing (API - Client) |
| **Unit Test** | Vitest + Testing Library | Fast, ESM-native |
| **E2E Test** | Playwright | Cross-browser, visual regression |
| **CI/CD** | GitHub Actions | lint, test, deploy |
| **Error Tracking** | Sentry | Source maps, performance |
| **Rate Limiting** | Upstash Ratelimit | Redis-based |
| **Analytics** | Vercel Analytics | Web Vitals, traffic |
| **Lint/Format** | Biome | Fast, unified tooling |

## 6. レイヤー設計原則

### 6.1 domain/ 層の設計ルール（最重要）

`domain/` はビジネスコアであり、将来的な移植性を確保するため以下を遵守する。

1. **React/Next.js に依存しない**: hooks, useState, useEffect 等を使わない。純粋関数として実装
2. **外部サービスに直接依存しない**: LLM API 呼び出しは `lib/ai/` 経由で抽象化
3. **入出力が明確**: 引数と返り値の型を明示。副作用を持たない

```typescript
// Good: 純粋関数
export function detectShallowAnalysis(text: string): AuditResult {
  // ロジックのみ
}

// Bad: React に依存
export function useDetectShallowAnalysis(text: string) {
  const [result, setResult] = useState<AuditResult | null>(null);
}
```

### 6.2 依存関係の方向

```
app/ → features/ → domain/
                 → lib/

shared/components/ ← features/（参照される側）
domain/ ← lib/ai/, lib/db/（domain は lib に依存しない）
```

## 7. データベーススキーマ

### 7.1 主要テーブル

```typescript
// Users (Supabase Auth 連携)
users: { id, email, displayName, role, createdAt }

// Reports
reports: { id, userId, title, content, sourceType, sourceId, status, createdAt, updatedAt }

// Audit Results
auditResults: { id, reportId, items, score, patternCounts, status, auditedAt }

// KPI Tree
kpiNodes: { id, parentId, label, targetValue, currentValue, ownerId, order, createdAt }
```

### 7.2 v2 追加モデル（計画）

- **VarianceItem**: KPI 別の差異分析結果（計画値、実績値、差異分解、因果チェーン）
- **ActionItem**: アクション計画（Who/What/When/完了基準/期待効果/実績効果）
- **ManagementCycle**: サイクル記録（全エージェント出力の統合）

## 8. Memory 設計

### 8.1 3 構造

| 構造 | 内容 | 技術 |
|---|---|---|
| **長期記憶** | 差異パターン辞書、因果モデル、アクション効果実績 | PostgreSQL + ベクトル DB |
| **作業記憶** | 今週の KPI 状態、進行中のアクション、分析コンテキスト | Redis |
| **評価記憶** | 予測精度推移、検知精度推移、アクション完了率推移 | PostgreSQL（時系列） |

### 8.2 共有記憶基盤（他プロジェクト連携）

**書き出し（本プロダクトが提供するデータ）**:
- 報告品質スコア（マネージャー別・週次）→ agentic-ai-hr
- KPI 達成率推移 → ai-executive-dashboard
- アクション完了率 → agentic-ai-hr
- 差異パターン辞書 → ai-executive-dashboard

**読み出し（本プロダクトが取得するデータ）**:
- 等級定義（G1-G8）← agentic-ai-hr / hr-system-lings
- 市場トレンド ← ai-executive-dashboard
- 報酬・評価制度 ← agentic-ai-hr

## 9. 非機能要件

| 要件 | 目標値 | 実装方法 |
|---|---|---|
| 可用性 | 99.9% | Vercel Edge + Supabase |
| レイテンシ | 曖昧性検出 < 3 秒 | Streaming, Edge Functions |
| スケーラビリティ | 1000 同時ユーザー | Serverless auto-scaling |
| セキュリティ | SOC2 準拠 | Supabase RLS, Sentry |
| 監視 | リアルタイム | Sentry + Vercel Analytics |

## 10. 設計判断の根拠

### 10.1 なぜ vercel-stack ベースか

1. **Coding Agent 最適化**: Claude Code が理解しやすい明確な構造
2. **本番品質**: テスト、CI/CD、監視が初期から組み込み
3. **スケーラビリティ**: Serverless + Edge による自動スケール
4. **DX 向上**: Turbopack, RSC, Server Actions による高速開発

### 10.2 なぜ Supabase か（NextAuth.js ではなく）

1. **統合されたスタック**: Auth + DB + Storage が一体
2. **RLS（Row Level Security）**: セキュリティが DB 層で担保
3. **管理画面**: 非エンジニアでもデータ確認可能
4. **コスト効率**: 無料枠が充実

### 10.3 なぜ Drizzle か（Supabase Client ではなく）

1. **Type-safe**: スキーマから型が自動生成
2. **可視性**: スキーマがコードベースに存在
3. **マイグレーション**: drizzle-kit による管理
4. **Coding Agent 理解**: schema.ts から DB 構造を把握可能

## 11. 画面構成

### v1: 3 画面

- Dashboard（KPI ツリー表示）
- Editor（報告 + 監査パネル）
- Settings（KPI 定義）

### v2: 5 画面（計画）

1. **Dashboard**: KPI 達成状況 + 異常検知（Agent 1 出力）
2. **Report Editor**: 週次報告 + 品質チェック（Agent 2 出力）← v1 継承
3. **Variance Analysis**: 差異分析 + 因果チェーン（Agent 3 出力）← 新規
4. **Action Board**: アクション計画 + 進捗追跡（Agent 4 出力）← 新規
5. **Settings**: KPI 定義 + サイクル設定

## 12. 将来の進化（Phase 2）

MVP 検証成功後、Agentic AI バックエンドを追加する。

```
agentic-ai-management/
├── web/                    # 現在の Next.js アプリ
│   └── src/
├── orchestrator/           # 新規追加（Python）
│   └── src/
│       ├── agents/         # 6 エージェント
│       ├── core/           # オーケストレーター
│       └── domain/         # web/domain/ から移植
└── shared/                 # 共有ロジック
    └── prompts/
```

`domain/` 層が適切に分離されていれば、移植コストは最小限。

## 13. v1 資産の活用

v1 の実装資産を最大限に活用する。

| v1 資産 | v2 での活用 | 変更の程度 |
|---|---|---|
| `domain/audit/types.ts` | Agent 2 がそのまま使用 | 変更なし |
| `domain/kpi/types.ts` | Agent 1 が拡張して使用 | plannedValue, variance 追加 |
| `features/editor/` | Report Editor 画面として継続 | API 接続の追加 |
| `features/dashboard/` | Dashboard 画面として継続 | リアルデータ接続 |
| `lib/theme.ts` | 全画面で継続使用 | 変更なし |

## 参照

- アーキテクチャ詳細: [docs/02_product/architecture.md](docs/02_product/architecture.md)
- v2 経営管理サイクル詳細設計: [docs/design-v2-management-cycle.md](docs/design-v2-management-cycle.md)
- 機能仕様: [docs/02_product/features/](docs/02_product/features/)
- デザインシステム: [docs/02_product/design-system/](docs/02_product/design-system/)
- ロードマップ: [docs/02_product/roadmap.md](docs/02_product/roadmap.md)
