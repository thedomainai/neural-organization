# Agentic AI Management 実装ガイド

> プロジェクト構成、セットアップ手順、開発ワークフロー、デプロイメントを定義する。

## 1. Tech Stack

### 1.1 現行スタック

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.2+ |
| UI Library | React | 18.3+ |
| Language | TypeScript | 5.4+ |
| State Management | Zustand | 4.5+ |
| Styling | Tailwind CSS | 3.4+ |
| Icons | Lucide React | 0.562+ |
| Build Tool | PostCSS + Autoprefixer | - |

### 1.2 計画スタック（v2）

Phase 2 以降で以下を追加予定。

| Category | Technology | 用途 |
|---|---|---|
| AI SDK | Vercel AI SDK v5 | Claude API ストリーミング |
| Database | Supabase PostgreSQL | データ永続化 |
| ORM | Drizzle | 型安全なスキーマ管理 |
| Auth | Supabase Auth | Google OAuth |
| Validation | Zod | スキーマ共有 |
| Testing | Vitest + Playwright | ユニット/E2E テスト |
| CI/CD | GitHub Actions | 自動テスト・デプロイ |
| Monitoring | Sentry | エラートラッキング |
| Lint/Format | Biome | 統合ツール |

## 2. プロジェクト構成

### 2.1 ディレクトリ構造

```
agentic-ai-management/
├── README.md                    # プロジェクト概要（英語）
├── 00_overview.md               # WHY/WHO/WHAT/Project Status
├── 01_concept.md                # コンセプト・設計思想
├── 02_architecture.md           # アーキテクチャ・5 層マッピング
├── 03_implementation.md         # 本ドキュメント
│
├── CLAUDE.md                    # Coding Agent instructions
├── .claude/                     # Claude Code 設定
│   └── rules/
│
├── docs/                        # 詳細ドキュメント（保全）
│   ├── 00_vision/               # ビジョン・ミッション・原則
│   ├── 01_concept/              # ペルソナ・課題・ソリューション
│   ├── 02_product/              # アーキテクチャ・機能仕様・デザインシステム
│   ├── 03_validation/           # 仮説検証・PoC データ
│   ├── 04_business/             # ビジネスモデル・市場分析
│   ├── 05_decisions/            # 意思決定記録
│   └── design-v2-management-cycle.md
│
├── src/                         # アプリケーションソースコード
│   ├── app/                     # Next.js App Router
│   ├── components/              # 共通 UI コンポーネント
│   ├── features/                # 機能ドメイン（Vertical Slice）
│   ├── domain/                  # ビジネスロジック（★ コア）
│   ├── services/                # 外部サービス統合
│   ├── lib/                     # ユーティリティ
│   ├── store/                   # 状態管理 (Zustand)
│   ├── types/                   # グローバル型定義
│   └── styles/                  # スタイル
│
├── .github/                     # GitHub 設定
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

### 2.2 src/ ディレクトリ詳細

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Dashboard (Home)
│   ├── editor/
│   │   └── [reportId]/
│   │       └── page.tsx          # Report Editor
│   ├── reports/
│   │   └── page.tsx              # Report List
│   └── api/                      # API Routes (BFF)
│       ├── audit/
│       │   └── route.ts          # 曖昧性検出 API
│       └── integrations/
│           └── [provider]/
│               └── route.ts      # Google/Notion Webhook
│
├── components/                   # 共通 UI コンポーネント
│   ├── ui/                       # Primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Icon.tsx
│   └── layouts/
│       ├── Sidebar.tsx
│       └── Header.tsx
│
├── features/                     # 機能ドメイン（Vertical Slice）
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   ├── editor/
│   │   ├── components/
│   │   │   ├── MarkdownEditor.tsx
│   │   │   ├── AuditPanel.tsx    # 曖昧性指摘パネル
│   │   │   └── AuditCard.tsx     # 個別の指摘カード
│   │   ├── hooks/
│   │   │   ├── useAudit.ts
│   │   │   └── useAuditLog.ts    # Dismiss/Resolve 管理
│   │   └── index.ts
│   └── reports/
│       ├── components/
│       ├── hooks/
│       └── index.ts
│
├── domain/                       # ビジネスロジック（★ コア）
│   ├── audit/                    # 曖昧性検出エンジン
│   │   ├── detector.ts           # 検出メインロジック
│   │   ├── patterns/             # 5 パターン実装
│   │   │   ├── shallow-analysis.ts
│   │   │   ├── missing-coverage.ts
│   │   │   ├── lack-of-quantification.ts
│   │   │   ├── unclear-action.ts
│   │   │   └── fact-interpretation-mixing.ts
│   │   ├── scorer.ts             # 品質スコアリング
│   │   └── types.ts              # 型定義
│   ├── intervention/
│   │   ├── question-generator.ts # 質問生成
│   │   └── types.ts
│   └── kpi/                      # KPI Tree Model
│       ├── tree.ts
│       └── types.ts
│
├── services/                     # 外部サービス統合
│   ├── ai/
│   │   ├── client.ts             # Anthropic Client
│   │   ├── prompts/
│   │   │   ├── audit.ts
│   │   │   └── intervention.ts
│   │   └── types.ts
│   ├── google/
│   │   ├── docs.ts
│   │   ├── slides.ts
│   │   ├── sheets.ts
│   │   └── auth.ts
│   └── notion/
│       ├── client.ts
│       └── parser.ts
│
├── lib/                          # ユーティリティ
│   ├── theme.ts                  # Midnight Logic Palette
│   ├── utils.ts                  # cn(), formatters
│   └── constants.ts
│
├── store/                        # 状態管理 (Zustand)
│   ├── editor.ts
│   ├── audit.ts
│   └── index.ts
│
├── types/                        # グローバル型定義
│   ├── index.ts
│   ├── report.ts
│   └── api.ts
│
└── styles/
    └── globals.css
```

## 3. セットアップ

### 3.1 前提条件

- Node.js 20+
- npm 10+

### 3.2 インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd agentic-ai-management

# 依存関係のインストール
npm install
```

### 3.3 環境変数

```bash
# .env.local を作成
cp .env.example .env.local

# 必要な環境変数:
# ANTHROPIC_API_KEY=sk-ant-...    # Claude API キー
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.4 開発サーバーの起動

```bash
# 開発サーバー起動
npm run dev

# http://localhost:3000 でアクセス
```

## 4. 開発ワークフロー

### 4.1 Issue-Driven Development

本プロジェクトは Issue-Driven で開発する。GitHub Issue の作成からブランチ作成、PR 作成までを一連のフローとして管理する。

```
1. GitHub Issue 作成（gh issue create）
2. Feature ブランチ作成: <type>/<issue-number>-<description>
3. 実装
4. Conventional Commits でコミット（Issue 番号を参照）
5. Push + PR 作成（Closes #<issue>）
```

### 4.2 ブランチ命名規則

```
<type>/<issue-number>-<short-description>
```

Type: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

例:
- `feat/1-user-authentication`
- `fix/23-login-redirect-bug`
- `docs/45-api-documentation`

### 4.3 コミットメッセージ

Conventional Commits 形式。英語で記述。Issue 番号を必ず参照。

```
<type>(<scope>): <description> (#<issue>)

[optional body]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

例:
```
feat(audit): implement ambiguity detection for shallow analysis (#12)
fix(editor): resolve markdown rendering issue in audit panel (#34)
```

### 4.4 npm scripts

| Script | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | リント実行 |
| `npm run type-check` | 型チェック（tsc --noEmit） |

## 5. レイヤー別の実装ガイド

### 5.1 app/ 層

Next.js App Router のルーティング層。ページコンポーネントと API Routes を配置する。

### 5.2 components/ 層

再利用可能な共通 UI コンポーネント。特定の機能に依存しない汎用パーツ。

### 5.3 features/ 層

機能単位の Vertical Slice。各機能の components, hooks, utils を含む。

```
features/[feature-name]/
├── components/
│   ├── [ComponentName].tsx
│   └── index.ts
├── hooks/
│   └── use[HookName].ts
└── index.ts                # Public exports
```

### 5.4 domain/ 層（最重要）

UI から完全に隔離されたビジネスロジック。

**設計ルール:**
- React/Next.js に依存しない（hooks 禁止）
- 純粋関数として実装
- 入出力の型を明示
- 副作用を持たない

### 5.5 services/ 層

外部サービス（LLM API, Google, Notion）との統合層。domain/ はこの層に直接依存しない。

### 5.6 lib/ 層

汎用ユーティリティ。テーマ、フォーマッタ、定数など。

### 5.7 store/ 層

Zustand によるグローバル状態管理。

## 6. ファイル命名規則

| 種類 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `AuditPanel.tsx` |
| hooks | camelCase (use-) | `useAuditLog.ts` |
| ユーティリティ | camelCase | `detector.ts` |
| 型定義 | types.ts | `types.ts` |
| 定数 | constants.ts | `constants.ts` |

## 7. デプロイメント

### 7.1 現在の構成

開発段階のため、ローカル開発が主体。

### 7.2 計画構成（v2）

| 環境 | プラットフォーム | トリガー |
|---|---|---|
| Preview | Vercel | PR 作成時に自動デプロイ |
| Production | Vercel | main ブランチへのマージ |

### 7.3 CI/CD パイプライン（計画）

```
PR 作成
  → Biome lint check
  → TypeScript type check
  → Vitest unit tests
  → Playwright E2E tests
  → Vercel Preview deployment
  → PR レビュー
  → main マージ
  → Vercel Production deployment
```

## 8. Production Readiness チェックリスト

### Development

- [x] Framework (Next.js 14)
- [ ] Database (Supabase + Drizzle)
- [ ] Authentication (Supabase Auth)
- [x] Styling (Tailwind CSS)
- [ ] Validation (Zod)
- [ ] AI Integration (Vercel AI SDK)

### Testing

- [ ] Unit tests (Vitest)
- [ ] Integration tests (Vitest + Testing Library)
- [ ] E2E tests (Playwright)

### CI/CD

- [ ] Lint check (Biome)
- [ ] Type check (tsc)
- [ ] Test automation (GitHub Actions)
- [ ] Preview deployments (Vercel)
- [ ] Production deployments (Vercel)

### Monitoring & Security

- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics)
- [ ] Rate limiting (Upstash)
- [ ] Input validation (Zod)
- [ ] Auth & RLS (Supabase)

## 9. 実装ロードマップ

### Phase 1: コアロジックの完成（3-4 週）

v1 で stub だった検知ロジックの実装 + KPI データの入出力。

- `domain/audit/detector.ts` の LLM 連携実装
- `domain/audit/scorer.ts` のスコア計算式修正
- KPI データの手動入力、達成率自動計算
- Supabase DB 連携

### Phase 2: 差異分析エージェント（3-4 週）

v2 の中核。

- VarianceAnalysisAgent の実装
- 差異分解ロジック（市場/固有/一時）
- 因果チェーン構築の LLM 連携
- Variance Analysis 画面の実装

### Phase 3: アクション計画エージェント（2-3 週）

- ActionPlannerAgent の実装
- Who/What/When/完了基準の構造化生成
- 優先度スコアリング
- Action Board 画面の実装

### Phase 4: Reflection（2-3 週）

- CycleReflectionAgent の実装
- アクション効果測定
- 因果モデルの精度検証と更新

### Phase 5: 共有記憶基盤接続（2 週）

- hr-system-lings の等級データ読み出し
- ai-executive-dashboard の市場データ読み出し
- 報告品質データの書き出し API

## 参照

- アーキテクチャ詳細: [docs/02_product/architecture.md](docs/02_product/architecture.md)
- src/ ディレクトリ構成: [src/README.md](src/README.md)
- デザインシステム: [docs/02_product/design-system/](docs/02_product/design-system/)
- 機能仕様: [docs/02_product/features/](docs/02_product/features/)
