# Typography

neumannのタイポグラフィシステム。

## Design Philosophy

- **読みやすさ最優先**: 経営者は長時間画面を見ない。一目で理解できる必要がある
- **数字の視認性**: KPIダッシュボードでは数字が主役
- **日本語・英語の両立**: 両言語で美しく表示

---

## Font Family

### Primary Font

```css
--font-sans: "Inter", "Hiragino Sans", "Hiragino Kaku Gothic ProN",
             "Noto Sans JP", sans-serif;
```

| 言語 | フォント | 理由 |
|------|----------|------|
| 英語 | Inter | モダン、高視認性、無料 |
| 日本語 | Hiragino Sans | macOS標準、プロフェッショナル |
| 日本語(Fallback) | Noto Sans JP | クロスプラットフォーム |

### Monospace Font (数字・コード用)

```css
--font-mono: "JetBrains Mono", "SF Mono", "Consolas", monospace;
```

数値表示に使用。桁揃えが必要な場合に適用。

---

## Type Scale

### Scale Definition

| Token | Size | Weight | Line Height | Letter Spacing | 用途 |
|-------|------|--------|-------------|----------------|------|
| `--text-display` | 48px | 600 | 1.1 | -0.02em | 大見出し、ヒーロー |
| `--text-h1` | 36px | 600 | 1.2 | -0.02em | ページタイトル |
| `--text-h2` | 24px | 600 | 1.3 | -0.01em | セクション見出し |
| `--text-h3` | 20px | 500 | 1.4 | 0 | サブセクション |
| `--text-h4` | 18px | 500 | 1.4 | 0 | カード見出し |
| `--text-body` | 16px | 400 | 1.6 | 0 | **本文（デフォルト）** |
| `--text-body-sm` | 14px | 400 | 1.5 | 0 | 副次テキスト |
| `--text-caption` | 12px | 400 | 1.4 | 0.01em | キャプション、注釈 |
| `--text-overline` | 11px | 500 | 1.3 | 0.05em | ラベル、カテゴリ |

### KPI / Data Display

| Token | Size | Weight | 用途 |
|-------|------|--------|------|
| `--text-kpi-xl` | 64px | 700 | メインKPI |
| `--text-kpi-lg` | 48px | 600 | サブKPI |
| `--text-kpi-md` | 32px | 600 | カード内KPI |
| `--text-kpi-sm` | 24px | 500 | インライン数値 |

---

## Usage Examples

### Page Header

```html
<header>
  <h1 class="text-h1 text-gray-900">週次レポート</h1>
  <p class="text-body-sm text-gray-500">2026年1月27日 - 2月2日</p>
</header>
```

### KPI Card

```html
<div class="card">
  <span class="text-overline text-gray-500 uppercase">品質スコア</span>
  <div class="text-kpi-lg font-mono text-gray-900">87</div>
  <span class="text-caption text-success-600">+5 vs 先週</span>
</div>
```

### Data Table

```html
<table>
  <thead>
    <tr class="text-overline text-gray-500 uppercase">
      <th>指標</th>
      <th class="text-right">実績</th>
      <th class="text-right">目標</th>
    </tr>
  </thead>
  <tbody class="text-body">
    <tr>
      <td>売上</td>
      <td class="text-right font-mono">¥12,345,678</td>
      <td class="text-right font-mono text-gray-500">¥10,000,000</td>
    </tr>
  </tbody>
</table>
```

---

## Tailwind Configuration

```javascript
// tailwind.config.ts
const typography = {
  fontFamily: {
    sans: ['Inter', 'Hiragino Sans', 'Noto Sans JP', 'sans-serif'],
    mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
    'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
    'h2': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
    'h3': ['20px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
    'h4': ['18px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
    'body': ['16px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
    'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
    'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
    'overline': ['11px', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '500' }],
    'kpi-xl': ['64px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
    'kpi-lg': ['48px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '600' }],
    'kpi-md': ['32px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '600' }],
    'kpi-sm': ['24px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
  },
};
```

---

## Guidelines

### Do's

- **見出しは簡潔に**: 見出しは短く、一行に収める
- **本文は適度な長さ**: 1行60-80文字程度が読みやすい
- **数字は等幅フォント**: 桁揃えのため `font-mono` を使用
- **単位は小さめに**: 数字の横に小さく表示 `87<small>点</small>`

### Don'ts

- **太字の多用**: 本当に強調したい箇所のみ
- **斜体**: 日本語では使わない
- **下線**: リンク以外では使わない
- **CAPS LOCK**: 見出しには使わない（overlineのみ許可）

---

## Responsive Typography

| Breakpoint | Body | H1 | KPI-lg |
|------------|------|----|--------|
| Mobile (<640px) | 14px | 28px | 36px |
| Tablet (640-1024px) | 15px | 32px | 42px |
| Desktop (>1024px) | 16px | 36px | 48px |

```css
/* Tailwind responsive example */
<h1 class="text-[28px] sm:text-[32px] lg:text-h1">タイトル</h1>
```

---

**ステータス**: ✅ 確定
**最終更新**: 2026-02-01

