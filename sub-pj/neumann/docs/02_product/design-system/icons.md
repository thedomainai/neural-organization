# Icons

neumannのアイコンシステム。

## Icon Library

**Lucide Icons** を採用。

- オープンソース (ISC License)
- 一貫したスタイル
- 軽量 (tree-shakable)
- React対応

```bash
npm install lucide-react
```

---

## Icon Sizes

| Size | Pixels | 用途 |
|------|--------|------|
| `xs` | 12px | インライン、密集UI |
| `sm` | 16px | ボタン内、テーブル |
| `md` | 20px | **デフォルト**、ナビゲーション |
| `lg` | 24px | 見出し、強調 |
| `xl` | 32px | 空状態、ヒーロー |
| `2xl` | 48px | 大きなイラスト |

---

## Core Icons

### Navigation

| アイコン | 名前 | 用途 |
|----------|------|------|
| `Home` | ホーム | ダッシュボード |
| `FileText` | ファイル | レポート |
| `Settings` | 設定 | 設定画面 |
| `User` | ユーザー | プロフィール |
| `LogOut` | ログアウト | ログアウト |
| `Menu` | メニュー | ハンバーガー |
| `ChevronLeft/Right` | 矢印 | ナビゲーション |

### Actions

| アイコン | 名前 | 用途 |
|----------|------|------|
| `Plus` | 追加 | 新規作成 |
| `Edit` | 編集 | 編集開始 |
| `Trash` | 削除 | 削除 |
| `Save` | 保存 | 保存 |
| `Send` | 送信 | 提出 |
| `Download` | ダウンロード | エクスポート |
| `Upload` | アップロード | インポート |
| `Search` | 検索 | 検索 |
| `Filter` | フィルター | フィルター |
| `RefreshCw` | 更新 | リロード |

### Status

| アイコン | 名前 | 用途 |
|----------|------|------|
| `CheckCircle` | 成功 | 完了、良好 |
| `XCircle` | エラー | 失敗、問題 |
| `AlertTriangle` | 警告 | 要注意 |
| `Info` | 情報 | ヒント |
| `HelpCircle` | ヘルプ | ヘルプ |
| `Clock` | 時計 | 保留、履歴 |
| `Loader` | ローディング | 処理中 |

### Data / Charts

| アイコン | 名前 | 用途 |
|----------|------|------|
| `TrendingUp` | 上昇 | 増加トレンド |
| `TrendingDown` | 下降 | 減少トレンド |
| `BarChart` | 棒グラフ | チャート |
| `PieChart` | 円グラフ | 分布 |
| `Activity` | アクティビティ | 推移 |

### Communication

| アイコン | 名前 | 用途 |
|----------|------|------|
| `MessageSquare` | コメント | フィードバック |
| `Bell` | 通知 | アラート |
| `Mail` | メール | メール |

---

## Usage

### Basic Usage

```tsx
import { Home, FileText, Settings } from 'lucide-react';

<Home className="h-5 w-5" />
<FileText className="h-5 w-5 text-gray-500" />
```

### With Button

```tsx
<Button>
  <Plus className="h-4 w-4 mr-2" />
  新規作成
</Button>
```

### Status Icon

```tsx
function StatusIcon({ status }: { status: 'success' | 'error' | 'warning' }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success-600" />,
    error: <XCircle className="h-5 w-5 text-error-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning-600" />,
  };
  return icons[status];
}
```

---

## Guidelines

### Do's

- **ラベルと併用**: アイコンのみのボタンは避ける（ツールバー除く）
- **一貫性**: 同じ意味には同じアイコンを使う
- **サイズ統一**: 隣接するアイコンは同じサイズに
- **色は意味を持たせる**: ステータスアイコンは色で区別

### Don'ts

- **装飾目的で使わない**: 意味のないアイコンは削除
- **カスタムアイコン**: Lucideにないものは原則作らない
- **サイズ不揃い**: 並んだアイコンのサイズを揃える

---

## Accessibility

```tsx
// アイコンのみの場合は aria-label 必須
<button aria-label="メニューを開く">
  <Menu className="h-5 w-5" />
</button>

// テキストがある場合は aria-hidden
<button>
  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
  新規作成
</button>
```

---

## Custom Icons (例外)

Lucideにない場合のみ、以下のルールでカスタム作成:

- 24x24 viewBox
- stroke-width: 2
- stroke-linecap: round
- stroke-linejoin: round
- 塗りなし (stroke only)

```tsx
// カスタムアイコンの例
function CustomIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* paths */}
    </svg>
  );
}
```

---

**ステータス**: ✅ 確定
**最終更新**: 2026-02-01

