# Agentic AI Operations: 実装ガイド

> ステータス: **PoC（Proof of Concept）**
> 最終更新: 2026-02
> 簡略版 - PoC レベルの詳細度

## 1. テクノロジースタック

### 1.1 依存パッケージ一覧

**Runtime Dependencies**

| パッケージ | バージョン | 用途 |
|---|---|---|
| next | 15.1.0 | React フレームワーク（App Router） |
| react / react-dom | 19.0.0 | UI ライブラリ |
| @google/generative-ai | ^0.24.1 | Google Gemini API クライアント |
| prisma / @prisma/client | ^7.3.0 | ORM・データベースアクセス |
| rss-parser | ^3.13.0 | RSS フィードのパース |
| cheerio | ^1.2.0 | HTML パーサー（スクレイピング用） |
| @radix-ui/react-slot | ^1.2.4 | Radix UI プリミティブ |
| lucide-react | ^0.562.0 | アイコンコンポーネント |
| class-variance-authority | ^0.7.1 | コンポーネントバリアント管理 |
| clsx | ^2.1.1 | クラス名結合ユーティリティ |
| tailwind-merge | ^3.4.0 | Tailwind クラスのインテリジェントマージ |
| tw-animate-css | ^1.4.0 | Tailwind アニメーション |

**Dev Dependencies**

| パッケージ | バージョン | 用途 |
|---|---|---|
| typescript | ^5 | 型チェック |
| @biomejs/biome | ^2.3.11 | リンター・フォーマッター |
| tailwindcss / @tailwindcss/postcss | ^4.0.0 | CSS フレームワーク |
| tsx | ^4.21.0 | TypeScript の直接実行 |
| @types/node, @types/react, @types/react-dom, @types/cheerio | - | 型定義 |

### 1.2 NPM Scripts

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動（port 3007） |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動（port 3007） |
| `npm run lint` | Biome によるリント |
| `npm run typecheck` | TypeScript 型チェック |
| `npm run db:generate` | Prisma Client 生成 |
| `npm run db:migrate` | DB マイグレーション実行 |
| `npm run db:push` | DB スキーマプッシュ（マイグレーションなし） |
| `npm run db:seed` | シードデータ投入 |

## 2. セットアップ手順

### 2.1 前提条件

- Node.js 18 以上
- PostgreSQL 15 以上（ローカルまたはリモート）
- Google Gemini API キー

### 2.2 初回セットアップ

```bash
# 1. 依存関係のインストール
npm install

# 2. 環境変数の設定
cp .env.example .env
```

`.env` を編集して以下の値を設定する。

```env
# PostgreSQL 接続文字列
DATABASE_URL="postgresql://user:password@localhost:5432/ai_executive_dashboard"

# Google Gemini API キー
GEMINI_API_KEY="your-gemini-api-key"

# 管理エンドポイント認証用
ADMIN_API_KEY="your-admin-api-key"
```

```bash
# 3. Prisma Client の生成
npm run db:generate

# 4. データベーススキーマの反映
npm run db:push

# 5. 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:3007` にアクセスする。`/` は `/dashboard` にリダイレクトされる。

### 2.3 データベースの準備

PostgreSQL のセットアップ例:

```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# データベース作成
createdb ai_executive_dashboard
```

## 3. プロジェクト構造

```
agentic-ai-operations/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # / → /dashboard リダイレクト
│   ├── globals.css               # グローバルスタイル
│   ├── dashboard/
│   │   └── page.tsx              # ダッシュボードページ (Client Component)
│   └── api/
│       ├── ingest/
│       │   └── route.ts          # POST: 記事のインジェスト
│       ├── articles/
│       │   └── route.ts          # GET: 記事一覧取得
│       ├── reports/
│       │   ├── route.ts          # GET: レポート一覧取得
│       │   ├── [id]/
│       │   │   └── route.ts      # GET: レポート詳細取得
│       │   └── generate/
│       │       └── route.ts      # POST: レポート生成
│       └── admin/
│           └── sources/
│               ├── route.ts      # GET/POST: ソース管理
│               └── [id]/
│                   └── route.ts  # PATCH/DELETE: ソース個別操作
├── features/
│   └── dashboard/
│       └── components/
│           ├── ReportView.tsx     # レポート本文表示
│           ├── SidebarLeft.tsx    # レポート一覧サイドバー
│           ├── SidebarRight.tsx   # ライブフィード + フィルタ
│           └── ResearchConsole.tsx # Deep Research コンソール
├── components/
│   └── ui/                       # shadcn/ui ベースのコンポーネント
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       └── textarea.tsx
├── lib/
│   ├── db.ts                     # Prisma Client 初期化
│   ├── gemini.ts                 # Gemini AI 分類ロジック
│   ├── data.ts                   # モックデータ
│   ├── types.ts                  # TypeScript 型定義
│   ├── utils.ts                  # ユーティリティ関数 (cn)
│   ├── generated/
│   │   └── prisma/               # Prisma 生成コード (gitignore)
│   └── services/
│       ├── fetcher.ts            # RSS/Blog データ取得サービス
│       └── report-generator.ts   # レポート生成サービス
├── prisma/
│   └── schema.prisma             # データベーススキーマ定義
├── prisma.config.ts              # Prisma 設定
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── components.json               # shadcn/ui 設定
└── .env.example                  # 環境変数テンプレート
```

### 3.1 ディレクトリの設計方針

| ディレクトリ | 方針 |
|---|---|
| `app/api/` | Next.js Route Handlers。ビジネスロジックは `lib/services/` に委譲 |
| `features/` | 機能単位のコンポーネント。dashboard 機能をまとめる |
| `components/ui/` | 汎用 UI コンポーネント（shadcn/ui ベース） |
| `lib/` | ビジネスロジック、サービス、型定義、ユーティリティ |
| `lib/services/` | 外部サービスとの統合ロジック |
| `prisma/` | データベーススキーマとマイグレーション |

## 4. API エンドポイント詳細

### 4.1 記事インジェスト

**`POST /api/ingest`**

外部ソースから記事を取得し、AI 分類して保存する。

| 項目 | 値 |
|---|---|
| 認証 | `x-api-key` ヘッダ（ADMIN_API_KEY） |
| Content-Type | application/json |

Request Body:
```json
{
  "sourceId": "optional-source-id"
}
```

- `sourceId` を指定: そのソースのみインジェスト
- `sourceId` 省略: 全有効ソースをインジェスト（4 時間以上未取得のもの）

Response:
```json
{
  "data": {
    "sourceId": "...",
    "sourceName": "...",
    "fetched": 10,
    "processed": 8,
    "errors": ["Failed to process \"...\": ..."]
  }
}
```

### 4.2 記事一覧取得

**`GET /api/articles`**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| category | string | - | カテゴリでフィルタ |
| impact | string | - | インパクトレベルでフィルタ |
| limit | number | 20 | 取得件数（最大 100） |
| offset | number | 0 | オフセット |
| from | string (ISO) | - | 公開日の開始 |
| to | string (ISO) | - | 公開日の終了 |

Response:
```json
{
  "data": [
    {
      "id": "...",
      "title": "...",
      "summary": "...",
      "category": "Foundation Models",
      "impactLevel": "High",
      "relevanceScore": 95,
      "sourceUrl": "https://...",
      "sourceName": "...",
      "publishedAt": "2025-10-25T08:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
```

### 4.3 レポート一覧取得

**`GET /api/reports`**

| パラメータ | 型 | デフォルト | 説明 |
|---|---|---|---|
| year | number | - | 年でフィルタ |
| limit | number | 10 | 取得件数（最大 50） |
| offset | number | 0 | オフセット |

Response:
```json
{
  "data": [
    {
      "id": "...",
      "title": "Weekly AI Strategic Briefing",
      "week": 42,
      "year": 2025,
      "status": "published",
      "articleCount": 35,
      "publishedAt": "2025-10-26T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "offset": 0
  }
}
```

### 4.4 レポート詳細取得

**`GET /api/reports/:id`**

Response:
```json
{
  "data": {
    "id": "...",
    "title": "Weekly AI Strategic Briefing",
    "week": 42,
    "year": 2025,
    "content": "# Executive Summary\n...",
    "status": "draft",
    "version": 1,
    "articleCount": 35,
    "categoryBreakdown": {
      "Foundation Models": 8,
      "Orchestration & Agents": 5
    },
    "generatedAt": "...",
    "publishedAt": null,
    "articles": [
      {
        "id": "...",
        "title": "...",
        "sourceUrl": "...",
        "category": "..."
      }
    ]
  }
}
```

### 4.5 レポート生成

**`POST /api/reports/generate`**

| 項目 | 値 |
|---|---|
| 認証 | `x-api-key` ヘッダ（ADMIN_API_KEY） |
| Content-Type | application/json |

Request Body:
```json
{
  "week": 42,
  "year": 2025
}
```

- `week` / `year` 省略時は現在の週

Response:
```json
{
  "data": {
    "reportId": "..."
  }
}
```

### 4.6 ソース管理

**`GET /api/admin/sources`** - ソース一覧

**`POST /api/admin/sources`** - ソース追加

Request Body:
```json
{
  "name": "OpenAI Blog",
  "type": "rss",
  "url": "https://openai.com/blog/rss",
  "categoryHint": "Foundation Models",
  "fetchInterval": 240
}
```

- `name`, `type`, `url` は必須
- `type` は `"rss"` または `"blog"`

**`PATCH /api/admin/sources/:id`** - ソース更新

Request Body（すべてオプショナル）:
```json
{
  "name": "...",
  "type": "...",
  "url": "...",
  "categoryHint": "...",
  "enabled": false,
  "fetchInterval": 120
}
```

**`DELETE /api/admin/sources/:id`** - ソース削除

## 5. 主要コンポーネントの実装概要

### 5.1 Gemini AI 分類（`lib/gemini.ts`）

- **Flash モデル**: 記事の分類（カテゴリ、インパクト、関連度、サマリー）
- **Pro モデル**: トレンド統合とエグゼクティブサマリー生成
- プロンプトで JSON 出力を指定し、正規表現で抽出
- バリデーション: カテゴリのフォールバック、スコア範囲クリッピング

### 5.2 Fetcher Service（`lib/services/fetcher.ts`）

- `fetchSource(sourceId)`: 個別ソースのインジェスト
- `fetchAllSources()`: 全有効ソース（4 時間以上未取得）のインジェスト
- RSS は `rss-parser`、Blog は `cheerio` でパース
- 重複排除は `sourceUrl` の UNIQUE 制約

### 5.3 Report Generator（`lib/services/report-generator.ts`）

- `generateWeeklyReport(week?, year?)`: 週次レポート生成のエントリポイント
- カテゴリ別サマリー → エグゼクティブサマリー → Markdown 構築 → DB 保存
- 既存レポートがある場合はバージョン更新（upsert）
- 記事との関連付け（ReportArticle）

### 5.4 ダッシュボード UI（`features/dashboard/`）

| コンポーネント | 機能 |
|---|---|
| `SidebarLeft` | レポート一覧の表示、レポート選択 |
| `ReportView` | 選択されたレポートの Markdown レンダリング |
| `SidebarRight` | ライブフィード（記事カード一覧）、カテゴリフィルタ、記事モーダル |
| `ResearchConsole` | 展開可能なチャットコンソール（現在はモックレスポンス） |

**注意**: PoC 段階では UI はモックデータ（`lib/data.ts`）を使用しており、API とは未接続。

## 6. 開発ワークフロー

### 6.1 ローカル開発

```bash
# 開発サーバー起動
npm run dev

# リント
npm run lint

# 型チェック
npm run typecheck

# DB スキーマ変更後
npm run db:generate
npm run db:push
```

### 6.2 インジェストの手動実行

```bash
# ソースの追加
curl -X POST http://localhost:3007/api/admin/sources \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-admin-api-key" \
  -d '{
    "name": "OpenAI Blog",
    "type": "rss",
    "url": "https://openai.com/blog/rss"
  }'

# 全ソースのインジェスト
curl -X POST http://localhost:3007/api/ingest \
  -H "x-api-key: your-admin-api-key" \
  -d '{}'

# レポート生成
curl -X POST http://localhost:3007/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-admin-api-key" \
  -d '{"week": 42, "year": 2025}'
```

### 6.3 記事・レポートの確認

```bash
# 記事一覧
curl http://localhost:3007/api/articles?limit=5

# High インパクト記事
curl http://localhost:3007/api/articles?impact=High

# レポート一覧
curl http://localhost:3007/api/reports

# レポート詳細
curl http://localhost:3007/api/reports/{id}
```

## 7. 既知の制約事項

### 7.1 PoC における技術的な制約

| 制約 | 影響 | 対応時期 |
|---|---|---|
| UI がモックデータ使用 | ダッシュボードと API が未接続 | Alpha |
| Research Console がモック | 実際の AI 応答なし | Alpha |
| テストコード未整備 | 品質保証が手動 | Alpha |
| エラーハンドリング最小限 | API エラー時の UX が不十分 | Alpha |
| Gemini レート制限未考慮 | 大量インジェスト時にエラーの可能性 | Alpha |
| マイグレーション未実行 | `db:push` のみ。本番では `db:migrate` が必要 | Alpha |
| シードデータ未作成 | `seed.ts` が存在しない | Alpha |

### 7.2 環境に関する注意事項

- 開発サーバーのポートは **3007** 固定（package.json で指定）
- Prisma Client の出力先は `lib/generated/prisma/`（カスタムパス）
- PostgreSQL の接続先は `DATABASE_URL` 環境変数で設定
- GEMINI_API_KEY が未設定の場合、AI 機能は動作しないが警告のみで起動する
