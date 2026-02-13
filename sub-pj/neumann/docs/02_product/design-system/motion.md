# Motion & Animation

neumannのモーションシステム。

## Design Philosophy

> 「モーションは機能のため。装飾のためではない。」

- **目的**: ユーザーの理解を助ける
- **控えめ**: 経営ツールに過剰なアニメーションは不要
- **高速**: 待たせない

---

## Duration Scale

| Token | Duration | 用途 |
|-------|----------|------|
| `--duration-instant` | 0ms | なし |
| `--duration-fast` | 100ms | ホバー、フォーカス |
| `--duration-normal` | 200ms | **デフォルト**（トランジション） |
| `--duration-slow` | 300ms | モーダル開閉、展開 |
| `--duration-slower` | 500ms | ページ遷移 |

**原則:** 200ms以下を基本とする。長いアニメーションは待たされる感覚を与える。

---

## Easing Functions

| Token | Value | 用途 |
|-------|-------|------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | 汎用 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 画面から出る |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 画面に入る |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 往復 |

---

## Standard Transitions

### Hover / Focus

```css
.button {
  transition: background-color 100ms var(--ease-default),
              transform 100ms var(--ease-default);
}

.button:hover {
  background-color: var(--color-primary-700);
}

.button:active {
  transform: scale(0.98);
}
```

### Fade

```css
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 200ms var(--ease-out);
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 150ms var(--ease-in);
}
```

### Slide

```css
.slide-enter {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: transform 200ms var(--ease-out),
              opacity 200ms var(--ease-out);
}
```

### Scale (Modal)

```css
.modal-enter {
  transform: scale(0.95);
  opacity: 0;
}
.modal-enter-active {
  transform: scale(1);
  opacity: 1;
  transition: transform 200ms var(--ease-out),
              opacity 200ms var(--ease-out);
}
```

---

## Component Animations

### Button

| State | Animation |
|-------|-----------|
| Hover | background darken, 100ms |
| Active | scale(0.98), 100ms |
| Loading | spinner rotation, infinite |
| Disabled | none |

### Dropdown / Menu

```
閉じた状態 → 開いた状態
- opacity: 0 → 1
- translateY: -4px → 0
- duration: 150ms
- easing: ease-out
```

### Modal

```
表示
- overlay: opacity 0 → 1, 200ms
- content: scale 0.95 → 1, opacity 0 → 1, 200ms

非表示
- content: scale 1 → 0.95, opacity 1 → 0, 150ms
- overlay: opacity 1 → 0, 150ms
```

### Toast

```
表示（右下から）
- translateX: 100% → 0
- opacity: 0 → 1
- duration: 300ms
- easing: ease-out

非表示
- translateX: 0 → 100%
- opacity: 1 → 0
- duration: 200ms
- easing: ease-in
```

### Accordion / Expand

```
展開
- height: 0 → auto (use max-height trick)
- opacity: 0 → 1
- duration: 200ms

収縮
- height: auto → 0
- opacity: 1 → 0
- duration: 150ms
```

### Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Page Transitions

### Route Change

```
現在のページ → 新しいページ
- 現在: opacity 1 → 0, 100ms
- 新規: opacity 0 → 1, 200ms
```

**Note:** Next.js App RouterのLoading UIを活用

---

## Data Visualization

### Chart Animations

```
初回表示
- バーチャート: height 0 → target, 500ms, staggered
- ラインチャート: pathLength 0 → 1, 800ms
- 円グラフ: dashoffset animation, 600ms
```

### Counter Animation

数値が変化するとき：

```tsx
// フレーマーモーションまたはカスタム実装
<AnimatedNumber value={87} duration={500} />
```

---

## Tailwind Configuration

```javascript
// tailwind.config.ts
const animation = {
  theme: {
    transitionDuration: {
      'instant': '0ms',
      'fast': '100ms',
      'normal': '200ms',
      'slow': '300ms',
      'slower': '500ms',
    },
    transitionTimingFunction: {
      'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'in': 'cubic-bezier(0.4, 0, 1, 1)',
      'out': 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    animation: {
      'spin': 'spin 1s linear infinite',
      'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'skeleton': 'skeleton-pulse 1.5s ease-in-out infinite',
    },
  },
};
```

---

## Reduced Motion

アクセシビリティのため、`prefers-reduced-motion` を尊重。

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Guidelines

### Do's

- 状態変化を示すためにアニメーションを使う
- 200ms以下の短いdurationを使う
- ユーザーのアクションに即座に反応する
- `prefers-reduced-motion` を尊重する

### Don'ts

- 装飾目的のアニメーション
- 自動再生のアニメーション（ローディング除く）
- 500ms以上の長いアニメーション
- 画面全体が動くアニメーション

---

**ステータス**: ✅ 確定
**最終更新**: 2026-02-01

