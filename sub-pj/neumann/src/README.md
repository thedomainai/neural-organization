# src/ ディレクトリ構成

> 設計方針の詳細は [neumann-docs/02_product/architecture.md](../../neumann-docs/02_product/architecture.md) を参照

## ディレクトリマップ

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
│       │   └── route.ts          # 曖昧性検出API
│       └── integrations/
│           └── [provider]/
│               └── route.ts      # Google/Notion Webhook
│
├── components/                   # 共通UIコンポーネント
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
│   │   │   └── useAuditLog.ts    # Dismiss/Resolve管理
│   │   └── index.ts
│   └── reports/
│       ├── components/
│       ├── hooks/
│       └── index.ts
│
├── domain/                       # ビジネスロジック（★コア）
│   ├── audit/                    # 曖昧性検出エンジン
│   │   ├── detector.ts           # 検出メインロジック
│   │   ├── patterns/             # 4パターン実装
│   │   │   ├── shallow-analysis.ts
│   │   │   ├── missing-coverage.ts
│   │   │   ├── lack-of-quantification.ts
│   │   │   └── unclear-action.ts
│   │   ├── scorer.ts             # 品質スコアリング
│   │   └── types.ts              # 型定義
│   └── intervention/
│       ├── question-generator.ts # 質問生成
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

## レイヤー責務

### app/
Next.js App Routerのルーティング層。ページコンポーネントとAPI Routes。

### components/
再利用可能な共通UIコンポーネント。特定の機能に依存しない。

### features/
機能単位のVertical Slice。各機能のcomponents, hooks, utilsを含む。

### domain/ （★最重要）
UIから完全に隔離されたビジネスロジック。

**設計ルール:**
- React/Next.jsに依存しない（hooks禁止）
- 純粋関数として実装
- 入出力の型を明示
- 副作用を持たない

```typescript
// Good
export function detectShallowAnalysis(text: string): AuditResult { ... }

// Bad
export function useDetectShallowAnalysis(text: string) {
  const [result, setResult] = useState(...) // React依存
}
```

### services/
外部サービス（LLM API, Google, Notion）との統合層。

### lib/
汎用ユーティリティ。テーマ、フォーマッタ、定数など。

### store/
Zustandによるグローバル状態管理。

### types/
複数のレイヤーで共有される型定義。

## 依存関係の方向

```
app/ → features/ → domain/
                 → services/

components/ ← features/（参照される側）
domain/ ← services/（domain は services に依存しない）
```

## ファイル命名規則

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `AuditPanel.tsx` |
| hooks | camelCase (use-) | `useAuditLog.ts` |
| ユーティリティ | camelCase | `detector.ts` |
| 型定義 | types.ts | `types.ts` |
| 定数 | constants.ts | `constants.ts` |
