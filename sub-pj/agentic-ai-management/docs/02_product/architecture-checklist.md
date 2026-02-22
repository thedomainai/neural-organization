# Architecture Checklist - Human Required Items

プロダクト実装に必要な項目一覧。
`<!-- HUMAN: ... -->` コメントが付いている箇所は、人間が定義・決定する必要がある。

---

## 1. Vision & Strategy

| 項目 | ファイル | ステータス |
|------|----------|----------|
| Vision/Mission | `00_vision/mission.md` | 🟡 ドラフト |
| North Star Metric | `00_vision/north-star.md` | 🔴 未定義 |
| 設計原則 | `00_vision/principles.md` | ✅ 定義済 |

```markdown
<!-- HUMAN: North Star Metricを定義してください -->
<!-- 例: 「月間曖昧性解消数」「レポート品質スコア80以上の割合」 -->
<!-- 参考: 00_vision/north-star.md を編集 -->
```

---

## 2. Tech Stack（承認済）

| Category | Technology | Status |
|----------|------------|--------|
| Hosting | Vercel | ✅ 決定 |
| Framework | Next.js 15 (App Router) | ✅ 決定 |
| AI | Vercel AI SDK + Claude | ✅ 決定 |
| Database | Supabase PostgreSQL | ✅ 決定 |
| ORM | Drizzle | ✅ 決定 |
| Auth | Supabase Auth (Google OAuth) | ✅ 決定 |
| Storage | Supabase Storage | ✅ 決定 |
| Styling | Tailwind CSS + shadcn/ui | ✅ 決定 |
| Validation | Zod | ✅ 決定 |
| Testing | Vitest + Playwright | ✅ 決定 |
| CI/CD | GitHub Actions | ✅ 決定 |
| Monitoring | Sentry + Vercel Analytics | ✅ 決定 |

→ **Human作業不要**（DEC-005で承認済）

---

## 3. Domain Layer（ビジネスロジック）

### 3.1 Audit（曖昧性検出）- ✅ 仕様承認済

| パターン | コード | ステータス |
|----------|--------|----------|
| Fact/Interpretation Mixing | FI | ✅ 定義済 |
| Lack of Quantification | LQ | ✅ 定義済 |
| Unclear Action | UA | ✅ 定義済 |
| Shallow Analysis | SA | ✅ 定義済 |
| Missing Coverage | MC | ✅ 定義済 |

→ **Human作業不要**（DEC-007で承認済）

### 3.2 Intervention（自律介入）

```markdown
<!-- HUMAN: 介入ロジックの仕様を定義してください -->
<!--
  質問すべき項目:
  1. どのタイミングで介入するか（リアルタイム or 提出時）
  2. 介入の強度（提案 vs 必須）
  3. CEOへのエスカレーション条件

  推奨ファイル: 02_product/features/intervention-spec.md
-->
```

### 3.3 KPI Tree（KPIツリー）

```markdown
<!-- HUMAN: KPIツリーの仕様を定義してください -->
<!--
  質問すべき項目:
  1. 初期テンプレートは提供するか
  2. ユーザーが自由に編集可能か
  3. 外部連携（Notion/Spreadsheet）は必要か

  推奨ファイル: 02_product/features/kpi-tree-spec.md
-->
```

---

## 4. Features Layer

### 4.1 MVP機能一覧

```markdown
<!-- HUMAN: MVP（Phase 2）に含める機能を決定してください -->
<!--
  候補機能:
  [ ] レポートエディター（手動入力）
  [ ] 曖昧性検出（リアルタイム）
  [ ] 品質スコア表示
  [ ] 改善提案表示
  [ ] Google Docs連携
  [ ] Notion連携
  [ ] ダッシュボード
  [ ] KPIツリー表示
  [ ] チーム管理

  推奨ファイル: 02_product/features/mvp-spec.md
-->
```

### 4.2 ユーザーストーリー

```markdown
<!-- HUMAN: ユーザーストーリーを作成してください -->
<!--
  フォーマット:
  「[ペルソナ]として、[機能]をしたい。なぜなら[価値]だから。」

  例:
  - 「CEOとして、週次レポートの曖昧な箇所を自動検出したい。なぜなら、
    限られた時間で重要な問題を把握したいから。」

  推奨ファイル: 02_product/features/user-stories.md
-->
```

---

## 5. UI/UX

### 5.1 画面一覧

| 画面 | Path | 仕様 |
|------|------|------|
| ログイン | `/login` | 🔴 未定義 |
| ダッシュボード | `/` | 🔴 未定義 |
| レポートエディター | `/editor/[id]` | 🔴 未定義 |
| レポート一覧 | `/reports` | 🔴 未定義 |
| 設定 | `/settings` | 🔴 未定義 |

```markdown
<!-- HUMAN: 各画面のワイヤーフレームを作成してください -->
<!--
  最低限必要な画面:
  1. レポートエディター（曖昧性検出パネル付き）
  2. ダッシュボード（サマリ表示）

  推奨ツール: Figma, Excalidraw, 手書きスケッチ
  推奨フォルダ: 02_product/wireframes/
-->
```

### 5.2 デザインシステム

| 項目 | ステータス |
|------|----------|
| カラーパレット | 🟡 shadcn/ui デフォルト |
| タイポグラフィ | 🟡 shadcn/ui デフォルト |
| コンポーネント | 🟡 shadcn/ui デフォルト |

```markdown
<!-- HUMAN: カスタムデザインが必要な場合は定義してください -->
<!--
  決定事項:
  - [ ] ブランドカラーを指定するか
  - [ ] ロゴを用意するか
  - [ ] カスタムフォントを使用するか

  現状はshadcn/uiデフォルトで進行可能
-->
```

---

## 6. AI/Prompts

### 6.1 プロンプト設計

```markdown
<!-- HUMAN: プロンプトのトーン・スタイルを決定してください -->
<!--
  決定事項:
  1. 検出結果の伝え方（直接的 vs 婉曲的）
  2. 言語（日本語固定 or 多言語対応）
  3. 改善提案の詳細度（簡潔 vs 詳細）

  推奨ファイル: 02_product/features/prompt-design.md

  例:
  - 「厳しく指摘するBad Copスタイル」
  - 「建設的な改善提案スタイル」
-->
```

### 6.2 AI設定

| 項目 | 現状 | 要決定 |
|------|------|--------|
| モデル | Claude Sonnet | ✅ 決定 |
| Temperature | TBD | 🔴 未定義 |
| Max Tokens | TBD | 🔴 未定義 |

```markdown
<!-- HUMAN: AI設定パラメータを決定してください（または AI に任せる） -->
<!--
  提案:
  - Temperature: 0.3（一貫性重視）
  - Max Tokens: 4096（詳細な分析用）

  AIに任せる場合はこのセクションをスキップ可能
-->
```

---

## 7. Data Model

### 7.1 データベーススキーマ（ドラフト定義済）

| テーブル | 用途 | ステータス |
|----------|------|----------|
| users | ユーザー情報 | ✅ ドラフト |
| reports | レポート | ✅ ドラフト |
| audit_results | 検出結果 | ✅ ドラフト |
| kpi_nodes | KPIツリー | ✅ ドラフト |

```markdown
<!-- HUMAN: 追加で必要なテーブル/フィールドがあれば指定してください -->
<!--
  候補:
  - teams テーブル（チーム管理）
  - comments テーブル（レビューコメント）
  - notifications テーブル（通知）

  現状のスキーマで開始可能。後から追加も可。
-->
```

---

## 8. Integrations

### 8.1 外部連携

| サービス | 用途 | MVP必須 | ステータス |
|----------|------|---------|----------|
| Google Docs | レポート取得 | 🔴 未定義 | 仕様未定義 |
| Google Slides | レポート取得 | 🔴 未定義 | 仕様未定義 |
| Google Sheets | KPI取得 | 🔴 未定義 | 仕様未定義 |
| Notion | レポート取得 | 🔴 未定義 | 仕様未定義 |
| Slack | 通知 | 🔴 未定義 | 仕様未定義 |

```markdown
<!-- HUMAN: MVP で必要な外部連携を決定してください -->
<!--
  質問:
  1. MVPで外部連携は必須か、手動入力のみでよいか
  2. 必須の場合、どのサービスを優先するか

  推奨: MVPは手動入力のみ、外部連携はPhase 3以降
-->
```

---

## 9. Validation & Testing

### 9.1 仮説検証計画

```markdown
<!-- HUMAN: 検証計画を承認してください -->
<!--
  Phase 1 検証項目（DEC-006で優先順位決定済）:
  1. 曖昧性検出精度（PoC実施待ち）
  2. CEO受容性（検出精度確認後）

  推奨ファイル: 03_validation/experiments/validation-plan.md
-->
```

### 9.2 PoC実施

| 項目 | ステータス |
|------|----------|
| サンプルデータ | ✅ 作成済 |
| アノテーション | ✅ 作成済 |
| 検出精度テスト | 🔴 未実施 |

---

## 10. Business

### 10.1 ビジネスモデル

```markdown
<!-- HUMAN: ビジネスモデルを定義してください（MVP後で可） -->
<!--
  決定事項:
  1. 課金モデル（サブスク/従量課金/ハイブリッド）
  2. 価格帯（中小企業向け/エンタープライズ向け）
  3. フリーミアム有無

  推奨ファイル: 04_business/business-model.md
-->
```

---

## 優先度別サマリ

### 🔴 即時対応（Phase 1開始前）

| 項目 | ファイル |
|------|----------|
| North Star Metric | `00_vision/north-star.md` |

### 🟠 MVP開発前に必要

| 項目 | ファイル |
|------|----------|
| MVP機能仕様 | `02_product/features/mvp-spec.md` |
| ユーザーストーリー | `02_product/features/user-stories.md` |
| UI/UXワイヤーフレーム | `02_product/wireframes/` |
| プロンプト設計（トーン） | `02_product/features/prompt-design.md` |

### 🟡 MVP開発中に決定可

| 項目 | ファイル |
|------|----------|
| 外部連携要否 | MVP仕様内で決定 |
| AI設定パラメータ | 実装時に調整 |
| 追加データモデル | 必要に応じて |

### 🟢 MVP後で可

| 項目 | ファイル |
|------|----------|
| ビジネスモデル | `04_business/business-model.md` |
| GTM戦略 | `04_business/go-to-market.md` |
| 介入ロジック詳細 | Phase 3以降 |

---

**作成日**: 2026-01-23
**目的**: 人間が記載すべき項目の可視化
