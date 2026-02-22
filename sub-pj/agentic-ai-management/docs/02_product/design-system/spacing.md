# Spacing & Layout

neumannのスペーシングとレイアウトシステム。

## Design Philosophy

- **余白は機能**: 余白は要素間の関係性を示す
- **一貫性**: 4pxグリッドベースで統一
- **呼吸感**: 経営ツールだからこそ、圧迫感のないデザイン

---

## Spacing Scale

4px基準の倍数システム。

| Token | Value | Tailwind | 用途 |
|-------|-------|----------|------|
| `--space-0` | 0px | `p-0` | なし |
| `--space-1` | 4px | `p-1` | 密接要素間（アイコンとラベル） |
| `--space-2` | 8px | `p-2` | 関連要素間（ボタン内padding） |
| `--space-3` | 12px | `p-3` | グループ内要素間 |
| `--space-4` | 16px | `p-4` | **基準値**（カード内padding） |
| `--space-5` | 20px | `p-5` | セクション内要素間 |
| `--space-6` | 24px | `p-6` | カード間、セクション間 |
| `--space-8` | 32px | `p-8` | 大きなセクション間 |
| `--space-10` | 40px | `p-10` | ページセクション間 |
| `--space-12` | 48px | `p-12` | ページ上下余白 |
| `--space-16` | 64px | `p-16` | ヒーロー余白 |

---

## Layout Grid

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header (h: 64px, fixed)                                 │
├─────────┬───────────────────────────────────────────────┤
│         │                                               │
│ Sidebar │  Main Content                                 │
│ (w:240px│  (padding: 24px)                              │
│  or     │                                               │
│  w:64px │  ┌─────────────────────────────────────────┐  │
│ collapsed)│ │  Content Area                           │  │
│         │  │  (max-width: 1200px, centered)          │  │
│         │  └─────────────────────────────────────────┘  │
│         │                                               │
└─────────┴───────────────────────────────────────────────┘
```

### Grid System

12カラムグリッド。Gap は 24px。

```css
--grid-columns: 12;
--grid-gap: 24px;
--grid-margin: 24px;     /* モバイル: 16px */
--content-max-width: 1200px;
```

### Breakpoints

| Name | Min Width | Columns | Gap | Margin |
|------|-----------|---------|-----|--------|
| Mobile | 0px | 4 | 16px | 16px |
| Tablet | 640px | 8 | 20px | 20px |
| Desktop | 1024px | 12 | 24px | 24px |
| Wide | 1440px | 12 | 32px | auto |

---

## Component Spacing

### Card

```css
.card {
  padding: var(--space-6);        /* 24px */
  border-radius: var(--radius-lg); /* 8px */
  gap: var(--space-4);            /* 16px between elements */
}
```

```
┌─────────────────────────────┐
│ ← 24px →                    │
│ ↑                           │
│ 24px  [Title]               │
│ ↓                           │
│ ← 16px gap →                │
│                             │
│        [Content]            │
│                             │
│ ← 16px gap →                │
│                             │
│        [Actions]            │
│ ↑                           │
│ 24px                        │
│ ↓                           │
└─────────────────────────────┘
```

### Form Elements

| Element | Height | Padding (x) | Padding (y) | Gap |
|---------|--------|-------------|-------------|-----|
| Input (sm) | 32px | 12px | 6px | - |
| Input (md) | 40px | 16px | 8px | - |
| Input (lg) | 48px | 20px | 12px | - |
| Button (sm) | 32px | 12px | 6px | 8px |
| Button (md) | 40px | 16px | 8px | 8px |
| Button (lg) | 48px | 24px | 12px | 12px |

### Dashboard Grid

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ KPI     │  │ KPI     │  │ KPI     │  │ KPI     │    │
│  │ Card    │  │ Card    │  │ Card    │  │ Card    │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│       ↕ 24px gap                                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │                  Chart Area                       │  │
│  │                  (span 8 cols)                    │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Border Radius

| Token | Value | 用途 |
|-------|-------|------|
| `--radius-none` | 0px | 角なし |
| `--radius-sm` | 4px | 小さな要素（タグ、バッジ） |
| `--radius-md` | 6px | ボタン、入力フィールド |
| `--radius-lg` | 8px | **カード、モーダル** |
| `--radius-xl` | 12px | 大きなパネル |
| `--radius-full` | 9999px | 丸（アバター、ピル） |

---

## Shadow

| Token | Value | 用途 |
|-------|-------|------|
| `--shadow-none` | none | フラット |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | サブtル |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | **カード** |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | ドロップダウン |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | モーダル |

**Note**: 影は控えめに。ボーダーで十分な場合は影を使わない。

---

## Z-Index Scale

| Token | Value | 用途 |
|-------|-------|------|
| `--z-base` | 0 | 通常コンテンツ |
| `--z-dropdown` | 10 | ドロップダウン |
| `--z-sticky` | 20 | スティッキーヘッダー |
| `--z-overlay` | 30 | オーバーレイ背景 |
| `--z-modal` | 40 | モーダル |
| `--z-popover` | 50 | ポップオーバー |
| `--z-toast` | 60 | トースト通知 |
| `--z-tooltip` | 70 | ツールチップ |

---

## Tailwind Configuration

```javascript
// tailwind.config.ts
const spacing = {
  theme: {
    spacing: {
      '0': '0px',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '8': '32px',
      '10': '40px',
      '12': '48px',
      '16': '64px',
    },
    borderRadius: {
      'none': '0px',
      'sm': '4px',
      'md': '6px',
      'lg': '8px',
      'xl': '12px',
      'full': '9999px',
    },
    boxShadow: {
      'none': 'none',
      'sm': '0 1px 2px rgba(0,0,0,0.05)',
      'md': '0 4px 6px rgba(0,0,0,0.07)',
      'lg': '0 10px 15px rgba(0,0,0,0.1)',
      'xl': '0 20px 25px rgba(0,0,0,0.15)',
    },
  },
};
```

---

**ステータス**: ✅ 確定
**最終更新**: 2026-02-01

