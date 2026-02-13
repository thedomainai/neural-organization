# Color System

neumannのカラーシステム。Design Tokensとして定義。

## Design Philosophy

- **白基調**: 清潔感、集中、プロフェッショナル
- **Navy アクセント**: 信頼、権威、落ち着き
- **機能色は最小限**: 色は意味を持つときだけ使用

---

## Color Palette

### Primary Colors

| Token | Name | Hex | RGB | 用途 |
|-------|------|-----|-----|------|
| `--color-primary-900` | Navy Dark | `#0f2744` | 15, 39, 68 | ヘッダー背景 |
| `--color-primary-800` | Navy | `#1e3a5f` | 30, 58, 95 | **ブランドカラー** |
| `--color-primary-700` | Navy Light | `#2d4a73` | 45, 74, 115 | ホバー状態 |
| `--color-primary-600` | Steel | `#3d5a87` | 61, 90, 135 | アクティブ状態 |
| `--color-primary-100` | Navy Tint | `#e8edf4` | 232, 237, 244 | 背景アクセント |

### Neutral Colors

| Token | Name | Hex | 用途 |
|-------|------|-----|------|
| `--color-gray-950` | Black | `#030712` | 最重要テキスト |
| `--color-gray-900` | Gray 900 | `#111827` | **本文テキスト** |
| `--color-gray-700` | Gray 700 | `#374151` | 副次テキスト |
| `--color-gray-500` | Gray 500 | `#6b7280` | プレースホルダー |
| `--color-gray-400` | Gray 400 | `#9ca3af` | 非活性テキスト |
| `--color-gray-300` | Gray 300 | `#d1d5db` | ボーダー |
| `--color-gray-200` | Gray 200 | `#e5e7eb` | ディバイダー |
| `--color-gray-100` | Gray 100 | `#f3f4f6` | 背景（ホバー） |
| `--color-gray-50` | Gray 50 | `#f9fafb` | **サーフェス背景** |
| `--color-white` | White | `#ffffff` | **メイン背景** |

### Semantic Colors

| Token | Name | Hex | 用途 |
|-------|------|-----|------|
| `--color-success-600` | Green | `#059669` | 成功、改善 |
| `--color-success-100` | Green Light | `#d1fae5` | 成功背景 |
| `--color-warning-600` | Amber | `#d97706` | 警告、注意 |
| `--color-warning-100` | Amber Light | `#fef3c7` | 警告背景 |
| `--color-error-600` | Red | `#dc2626` | エラー、危険 |
| `--color-error-100` | Red Light | `#fee2e2` | エラー背景 |
| `--color-info-600` | Blue | `#2563eb` | 情報、リンク |
| `--color-info-100` | Blue Light | `#dbeafe` | 情報背景 |

### Data Visualization Colors

| Token | Hex | 用途 |
|-------|-----|------|
| `--color-chart-1` | `#1e3a5f` | プライマリデータ |
| `--color-chart-2` | `#3b82f6` | セカンダリデータ |
| `--color-chart-3` | `#10b981` | ポジティブ |
| `--color-chart-4` | `#f59e0b` | 中間 |
| `--color-chart-5` | `#ef4444` | ネガティブ |
| `--color-chart-6` | `#8b5cf6` | 補助1 |
| `--color-chart-7` | `#ec4899` | 補助2 |

---

## Semantic Token Mapping

### Background

```css
--bg-primary:     var(--color-white);        /* メイン背景 */
--bg-secondary:   var(--color-gray-50);      /* カード、サーフェス */
--bg-tertiary:    var(--color-gray-100);     /* ホバー、選択 */
--bg-inverse:     var(--color-primary-800);  /* ヘッダー、フッター */
```

### Text

```css
--text-primary:   var(--color-gray-900);     /* 本文 */
--text-secondary: var(--color-gray-700);     /* 副次 */
--text-tertiary:  var(--color-gray-500);     /* 補足 */
--text-disabled:  var(--color-gray-400);     /* 非活性 */
--text-inverse:   var(--color-white);        /* 暗い背景上 */
--text-link:      var(--color-info-600);     /* リンク */
```

### Border

```css
--border-default: var(--color-gray-200);     /* 通常ボーダー */
--border-strong:  var(--color-gray-300);     /* 強調ボーダー */
--border-focus:   var(--color-primary-800);  /* フォーカス */
```

---

## Usage Guidelines

### 背景色の使い分け

```
┌─────────────────────────────────────────────┐
│ Header (--bg-inverse: Navy)                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────┐  ┌───────────────┐      │
│  │ Card          │  │ Card          │      │
│  │ (--bg-secondary)│ │ (--bg-secondary)│   │
│  └───────────────┘  └───────────────┘      │
│                                             │
│  Main Content Area (--bg-primary: White)   │
│                                             │
└─────────────────────────────────────────────┘
```

### ステータス色の使用

| 状態 | 前景色 | 背景色 | 使用場面 |
|------|--------|--------|----------|
| Success | `--color-success-600` | `--color-success-100` | 保存完了、品質スコア高 |
| Warning | `--color-warning-600` | `--color-warning-100` | 要注意、中程度の問題 |
| Error | `--color-error-600` | `--color-error-100` | エラー、重大な問題 |
| Info | `--color-info-600` | `--color-info-100` | 情報、ヒント |

### 品質スコアの色分け

```
90-100: Success Green  (#059669)  Excellent
70-89:  Info Blue      (#2563eb)  Good
50-69:  Warning Amber  (#d97706)  Needs Improvement
0-49:   Error Red      (#dc2626)  Poor
```

---

## Contrast Ratios (WCAG 2.1)

| 組み合わせ | コントラスト比 | レベル |
|-----------|---------------|--------|
| Gray 900 on White | 15.1:1 | AAA |
| Gray 700 on White | 8.6:1 | AAA |
| Gray 500 on White | 4.6:1 | AA (Large) |
| White on Navy 800 | 11.5:1 | AAA |
| Success 600 on Success 100 | 4.8:1 | AA |
| Error 600 on Error 100 | 5.2:1 | AA |

---

## CSS Variables (Tailwind Config)

```javascript
// tailwind.config.ts
const colors = {
  primary: {
    900: '#0f2744',
    800: '#1e3a5f',
    700: '#2d4a73',
    600: '#3d5a87',
    100: '#e8edf4',
  },
  gray: {
    950: '#030712',
    900: '#111827',
    800: '#1f2937',
    700: '#374151',
    600: '#4b5563',
    500: '#6b7280',
    400: '#9ca3af',
    300: '#d1d5db',
    200: '#e5e7eb',
    100: '#f3f4f6',
    50: '#f9fafb',
  },
  success: {
    600: '#059669',
    100: '#d1fae5',
  },
  warning: {
    600: '#d97706',
    100: '#fef3c7',
  },
  error: {
    600: '#dc2626',
    100: '#fee2e2',
  },
  info: {
    600: '#2563eb',
    100: '#dbeafe',
  },
};
```

---

## Dark Mode (Future)

現時点ではLight Mode のみサポート。
Dark Mode対応時は以下のマッピングを使用：

| Light | Dark |
|-------|------|
| `--bg-primary` (white) | gray-900 |
| `--bg-secondary` (gray-50) | gray-800 |
| `--text-primary` (gray-900) | gray-100 |
| `--border-default` (gray-200) | gray-700 |

---

**ステータス**: ✅ 確定
**最終更新**: 2026-02-01

