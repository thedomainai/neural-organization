# Agentic AI Operations: アーキテクチャ

> ステータス: **PoC（Proof of Concept）**
> 最終更新: 2026-02
> 簡略版 - PoC レベルの詳細度

## 1. システム全体像

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Sidebar   │  │ Report View  │  │ Sidebar Right            │  │
│  │ Left      │  │              │  │ (Live Feed + Filters)    │  │
│  │ (Reports) │  │              │  │                          │  │
│  └───────────┘  └──────────────┘  └──────────────────────────┘  │
│                 ┌──────────────────────────────────────────────┐ │
│                 │ Research Console (Deep Research)             │ │
│                 └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (Next.js App Router)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 15.1 Server                        │
│                                                                 │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐  │
│  │ API Routes          │  │ Services                         │  │
│  │ /api/ingest         │  │ ┌────────────┐ ┌──────────────┐ │  │
│  │ /api/articles       │  │ │ Fetcher    │ │ Report       │ │  │
│  │ /api/reports        │  │ │ Service    │ │ Generator    │ │  │
│  │ /api/admin/sources  │  │ └─────┬──────┘ └──────┬───────┘ │  │
│  └─────────────────────┘  │       │               │         │  │
│                           └───────┼───────────────┼─────────┘  │
│                                   │               │            │
│  ┌────────────────────────────────┼───────────────┼─────────┐  │
│  │ AI Layer                       │               │         │  │
│  │ ┌──────────────┐  ┌───────────┴───────────────┴──────┐  │  │
│  │ │ Gemini Flash │  │ Gemini Pro                       │  │  │
│  │ │ (分類)        │  │ (統合分析・サマリー)              │  │  │
│  │ └──────────────┘  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Data Layer                                                 │  │
│  │ ┌──────────────┐  ┌────────────────────────────────────┐  │  │
│  │ │ Prisma ORM   │  │ PostgreSQL                         │  │  │
│  │ │ (Client 7.3) │  │ Source | Article | Report          │  │  │
│  │ └──────────────┘  └────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Data Sources                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ RSS Feed │  │ RSS Feed │  │ Blog     │  ...                  │
│  │ (AI系)   │  │ (Tech系) │  │ (企業)   │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 5 レイヤーマッピング

Neural Organization の 5 レイヤーアーキテクチャに対する本プロジェクトの実装マッピングを示す。

### L0: Perception（検知）

**役割**: 外部世界からデータを取得し、正規化されたシグナルに変換する

| 要素 | 実装 |
|---|---|
| 受動的接続 | Fetcher Service: RSS フィード取得（rss-parser） |
| 能動的接続 | Fetcher Service: ブログスクレイピング（cheerio） |
| 正規化 | RSS Item / HTML → `{ title, link, content, pubDate }` の共通形式 |
| シグナル検出 | URL ユニーク制約による新着記事の特定 |
| 注意配分 | Source.enabled と fetchInterval による制御 |

**コンポーネント**: `lib/services/fetcher.ts`

**永続状態**: Source テーブル（接続レジストリ、フェッチ状態、障害カウンタ）

### L1: Understanding（解釈）

**役割**: シグナルを分類し、構造化された理解に変換する

| 要素 | 実装 |
|---|---|
| エンティティモデル | Article テーブル: 記事の構造化表現 |
| 分類 | Gemini Flash: 7 カテゴリ分類 |
| 影響度評価 | Gemini Flash: Impact Level (High/Medium/Low) |
| 関連度評価 | Gemini Flash: Relevance Score (0-100) |
| 要約 | Gemini Flash: 2-3 文のエグゼクティブサマリー |

**コンポーネント**: `lib/gemini.ts` (`classifyArticle`)

**永続状態**: Article テーブル（分類済み記事のアーカイブ）

### L2: Reasoning（推論）

**役割**: 分類済みデータを横断的に分析し、戦略的判断を導出する

| 要素 | 実装 |
|---|---|
| トレンド分析 | Gemini Pro: カテゴリ別のトレンド抽出 |
| 統合推論 | Gemini Pro: エグゼクティブサマリーの合成 |
| 行動提案 | Gemini Pro: アクショナブルインサイトの導出 |
| フィルタリング | 関連度スコア >= 60 の記事のみ分析対象 |

**コンポーネント**: `lib/services/report-generator.ts` (`generateCategorySummary`, `generateExecutiveSummary`)

**永続状態**: Report テーブル（分析結果）、ReportArticle（根拠の関連付け）

### L3: Execution（実行）

**役割**: 分析結果をアウトプットとして生成・配信する

| 要素 | 実装 |
|---|---|
| アーティファクト生成 | `buildReportMarkdown`: Markdown レポートの構築 |
| デリバリー（UI） | Dashboard: ReportView, SidebarLeft, SidebarRight |
| デリバリー（API） | `/api/reports`, `/api/reports/:id`, `/api/articles` |
| 品質保証 | バージョニング（Report.version）、カテゴリ別ブレークダウン |

**コンポーネント**: `lib/services/report-generator.ts` (`buildReportMarkdown`), `features/dashboard/`, `app/api/`

### L4: Reflection（内省）

**役割**: 出力と結果を評価し、全層を改善する

| 要素 | 実装状態 |
|---|---|
| レポート評価 | 未実装 |
| 分類精度の検証 | 未実装 |
| ソースの品質評価 | 部分実装（failureCount による障害検出） |
| フィードバックループ | 未実装 |

PoC 段階では L4 は最小限の実装に留まる。failureCount によるソース障害の検出のみ。

## 3. エージェント/サービス構成

### 3.1 サービス一覧

| サービス | ファイル | 責務 |
|---|---|---|
| Fetcher Service | `lib/services/fetcher.ts` | 外部ソースからの記事取得 |
| Classification Service | `lib/gemini.ts` | AI による記事分類 |
| Report Generator | `lib/services/report-generator.ts` | 週次レポートの生成 |
| Database Service | `lib/db.ts` | Prisma Client の初期化・管理 |

### 3.2 データインジェストフロー

```
POST /api/ingest
      │
      ▼
┌─────────────────┐
│ isAdmin check   │ ← x-api-key ヘッダ検証
└────────┬────────┘
         │
    ┌────┴────┐
    │sourceId │
    │指定あり? │
    └────┬────┘
     Yes │     No
    ┌────┴────┐ ┌────────────────┐
    │fetchSource│ │fetchAllSources │
    └────┬────┘ └────────┬───────┘
         │              │
         ▼              ▼
    ┌────────────────────┐
    │ Per Source:         │
    │ 1. RSS/Blog取得    │
    │ 2. 重複チェック     │
    │ 3. classifyArticle │
    │ 4. DB保存          │
    │ 5. Source更新      │
    └────────────────────┘
```

### 3.3 レポート生成フロー

```
POST /api/reports/generate
      │
      ▼
┌─────────────────┐
│ isAdmin check   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 対象週の記事取得  │ ← relevanceScore >= 60, 最大 100 件
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ カテゴリ別       │ ← 7 カテゴリでグルーピング
│ グルーピング      │
└────────┬────────┘
         │
         ▼ (各カテゴリ)
┌─────────────────┐
│ generateCategory │ ← Gemini Pro: トレンド分析
│ Summary         │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ generateExecutive    │ ← Gemini Pro: 横断統合
│ Summary             │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ buildReportMarkdown │ ← Markdown レポート構築
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Report DB 保存      │ ← upsert (week + year で一意)
│ ReportArticle 関連  │
└─────────────────────┘
```

## 4. テクノロジースタック

### 4.1 ランタイム・フレームワーク

| 技術 | バージョン | 用途 |
|---|---|---|
| Next.js | 15.1 | アプリケーションフレームワーク（App Router） |
| React | 19.0 | UI ライブラリ |
| TypeScript | 5.x | 型安全な開発 |
| Node.js | - | サーバーランタイム |

### 4.2 データベース・ORM

| 技術 | バージョン | 用途 |
|---|---|---|
| PostgreSQL | - | リレーショナルデータベース |
| Prisma | 7.3 | ORM・スキーマ管理・マイグレーション |

### 4.3 AI

| 技術 | バージョン | 用途 |
|---|---|---|
| @google/generative-ai | 0.24 | Gemini API クライアント |
| Gemini 1.5 Flash | - | 記事分類（高速・低コスト） |
| Gemini 1.5 Pro | - | 統合分析・エグゼクティブサマリー生成 |

### 4.4 データ取得

| 技術 | バージョン | 用途 |
|---|---|---|
| rss-parser | 3.13 | RSS フィードのパース |
| cheerio | 1.2 | HTML のスクレイピング（jQuery 互換 API） |

### 4.5 UI

| 技術 | バージョン | 用途 |
|---|---|---|
| Tailwind CSS | 4.0 | ユーティリティファーストのスタイリング |
| Radix UI | - | アクセシブルな UI プリミティブ |
| Lucide React | 0.562 | アイコンライブラリ |
| class-variance-authority | 0.7 | バリアント管理 |
| tailwind-merge | 3.4 | Tailwind クラスのマージ |

### 4.6 開発ツール

| 技術 | バージョン | 用途 |
|---|---|---|
| Biome | 2.3 | リンター・フォーマッター |
| tsx | 4.21 | TypeScript の直接実行（seed 等） |

## 5. データベース設計

### 5.1 テーブル構成

```
┌─────────────────────┐
│ Source               │
├─────────────────────┤
│ id         (PK)     │
│ name                │
│ type       (rss|blog)│
│ url        (UNIQUE) │
│ categoryHint        │
│ enabled             │
│ fetchInterval       │
│ lastFetchedAt       │
│ failureCount        │
└────────┬────────────┘
         │ 1:N
         ▼
┌─────────────────────┐
│ Article              │
├─────────────────────┤
│ id         (PK)     │
│ title               │
│ summary     (TEXT)  │
│ content     (TEXT)  │
│ sourceUrl  (UNIQUE) │
│ sourceId   (FK)     │
│ category            │
│ impactLevel         │
│ relevanceScore      │
│ publishedAt         │
│ fetchedAt           │
└────────┬────────────┘
         │ N:M
         ▼
┌─────────────────────┐     ┌─────────────────────┐
│ ReportArticle        │────▶│ Report               │
├─────────────────────┤     ├─────────────────────┤
│ id         (PK)     │     │ id         (PK)     │
│ reportId   (FK)     │     │ title               │
│ articleId  (FK)     │     │ week                │
│                     │     │ year                │
│ UNIQUE(reportId,    │     │ content    (TEXT)   │
│        articleId)   │     │ status              │
└─────────────────────┘     │ version             │
                            │ articleCount        │
                            │ categoryBreakdown   │
                            │ UNIQUE(week, year)  │
                            └─────────────────────┘
```

### 5.2 インデックス戦略

| テーブル | インデックス | 目的 |
|---|---|---|
| Source | `enabled` | 有効ソースの高速取得 |
| Source | `type` | ソース種別でのフィルタリング |
| Article | `category` | カテゴリ別記事取得 |
| Article | `publishedAt` | 時系列ソート |
| Article | `relevanceScore` | 関連度でのフィルタリング |
| Article | `sourceId` | ソース別記事取得 |
| Report | `year, week` | 時系列のレポート取得 |
| Report | `status` | 公開済みレポートのフィルタリング |

## 6. セキュリティ

### 6.1 認証（PoC レベル）

| エンドポイント | 認証方式 | 備考 |
|---|---|---|
| GET /api/articles | なし（Public） | 読み取りのみ |
| GET /api/reports | なし（Public） | 公開済みレポートのみ |
| POST /api/ingest | x-api-key ヘッダ | ADMIN_API_KEY との一致 |
| POST /api/reports/generate | x-api-key ヘッダ | ADMIN_API_KEY との一致 |
| /api/admin/sources/* | x-api-key ヘッダ | ADMIN_API_KEY との一致 |

### 6.2 環境変数

| 変数 | 用途 | 必須 |
|---|---|---|
| DATABASE_URL | PostgreSQL 接続文字列 | Yes |
| GEMINI_API_KEY | Google Gemini API キー | Yes |
| ADMIN_API_KEY | 管理エンドポイントの認証キー | Optional |

## 7. PoC 段階のアーキテクチャ上の制約

| 制約 | 理由 | 将来の対応方針 |
|---|---|---|
| シングルプロセス | Next.js 内で全処理を実行 | ワーカーの分離（バックグラウンドジョブ） |
| 同期的なインジェスト | 記事を順次処理 | 並列処理・キューイング |
| モックデータの UI | ダッシュボードが API 未接続 | フロントエンドの API 統合 |
| 手動トリガー | cron なし | スケジューラーの導入 |
| 認証が最小限 | API キーのみ | OAuth / Session ベース認証 |
| エラーリカバリ最小限 | 基本的な try-catch のみ | リトライ戦略・Dead Letter Queue |
