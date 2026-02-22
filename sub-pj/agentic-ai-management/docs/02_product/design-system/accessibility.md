# Accessibility

neumannのアクセシビリティガイドライン。WCAG 2.1 AA準拠を目標。

## Design Philosophy

> 「アクセシブルなデザインは、全員にとって良いデザイン」

- 経営者の中には視覚・聴覚に課題を持つ方もいる
- キーボード操作は効率的なパワーユーザーにも有益
- 明確な情報階層は全員の理解を助ける

---

## Color & Contrast

### Contrast Requirements

| 用途 | 最小コントラスト比 | レベル |
|------|-------------------|--------|
| 本文テキスト | 4.5:1 | AA |
| 大きなテキスト (18px+) | 3:1 | AA |
| UI コンポーネント | 3:1 | AA |
| 非装飾グラフィック | 3:1 | AA |

### Color Accessibility

```
✅ Gray 900 on White: 15.1:1 (AAA)
✅ Gray 700 on White: 8.6:1 (AAA)
✅ Primary 800 on White: 11.5:1 (AAA)
⚠️ Gray 500 on White: 4.6:1 (AA Large only)
❌ Gray 400 on White: 3.0:1 (Fail)
```

### Color Blindness

- 色だけで情報を伝えない
- アイコン、テキスト、パターンを併用

```
Good:
✅ 成功 (緑 + チェックアイコン + "完了"ラベル)
❌ エラー (赤 + Xアイコン + "失敗"ラベル)

Bad:
🟢 (色のみで成功を示す)
🔴 (色のみでエラーを示す)
```

---

## Keyboard Navigation

### Focus Management

すべてのインタラクティブ要素にフォーカス可能:

```css
/* フォーカスリング */
:focus-visible {
  outline: 2px solid var(--color-primary-800);
  outline-offset: 2px;
}

/* マウスクリック時は非表示 */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Tab Order

論理的な順序で Tab 移動:

```
1. ヘッダー（ロゴ → ナビ → ユーザーメニュー）
2. サイドバー
3. メインコンテンツ
4. フッター
```

### Keyboard Shortcuts

| キー | アクション |
|------|-----------|
| `Tab` | 次の要素へ |
| `Shift + Tab` | 前の要素へ |
| `Enter` / `Space` | アクション実行 |
| `Escape` | モーダル/メニューを閉じる |
| `Arrow Keys` | リスト/メニュー内移動 |

### Skip Link

```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  メインコンテンツへスキップ
</a>
```

---

## Screen Readers

### Semantic HTML

```html
<!-- Good -->
<nav aria-label="メインナビゲーション">
  <ul>
    <li><a href="/">ダッシュボード</a></li>
  </ul>
</nav>

<main id="main-content">
  <h1>レポート一覧</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title">今週のレポート</h2>
  </section>
</main>

<!-- Bad -->
<div class="nav">
  <div class="nav-item" onclick="...">ダッシュボード</div>
</div>
```

### ARIA Attributes

| 属性 | 用途 |
|------|------|
| `aria-label` | 要素のラベル（アイコンボタン等） |
| `aria-labelledby` | 別要素のIDで参照 |
| `aria-describedby` | 補足説明を参照 |
| `aria-expanded` | 展開状態 |
| `aria-hidden` | スクリーンリーダーから隠す |
| `aria-live` | 動的更新の通知 |
| `role` | 要素の役割を明示 |

### Live Regions

動的に更新されるコンテンツ:

```html
<!-- トースト通知 -->
<div role="status" aria-live="polite">
  保存しました
</div>

<!-- エラーメッセージ -->
<div role="alert" aria-live="assertive">
  入力に誤りがあります
</div>
```

---

## Forms

### Labels

```html
<!-- Good: 明示的なラベル -->
<label for="report-title">レポートタイトル</label>
<input id="report-title" type="text" />

<!-- Good: aria-label -->
<input type="search" aria-label="レポートを検索" />
```

### Error Messages

```html
<label for="email">メールアドレス</label>
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" class="error" role="alert">
  有効なメールアドレスを入力してください
</p>
```

### Required Fields

```html
<label for="title">
  タイトル
  <span aria-hidden="true">*</span>
  <span class="sr-only">（必須）</span>
</label>
<input id="title" required aria-required="true" />
```

---

## Images & Media

### Alt Text

```html
<!-- 情報を持つ画像 -->
<img src="chart.png" alt="品質スコア推移グラフ: 1月80点、2月85点、3月87点" />

<!-- 装飾画像 -->
<img src="decoration.svg" alt="" aria-hidden="true" />

<!-- アイコン（テキストあり） -->
<button>
  <svg aria-hidden="true">...</svg>
  保存
</button>

<!-- アイコン（テキストなし） -->
<button aria-label="メニューを開く">
  <svg aria-hidden="true">...</svg>
</button>
```

### Charts

データビジュアライゼーションにはテキスト代替を提供:

```html
<figure>
  <div role="img" aria-label="品質スコア推移: 1月80点から3月87点まで上昇傾向">
    <!-- Chart component -->
  </div>
  <figcaption>図1: 品質スコアの月次推移</figcaption>
</figure>

<!-- または、データテーブルを併記 -->
<details>
  <summary>グラフのデータを表で見る</summary>
  <table>...</table>
</details>
```

---

## Motion & Animation

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Auto-Playing Content

- 自動再生アニメーションは避ける
- 必要な場合は停止ボタンを提供
- 5秒以上続くアニメーションは制御可能に

---

## Touch & Mobile

### Touch Target Size

最小タッチターゲット: **44 x 44 px**

```css
.button {
  min-height: 44px;
  min-width: 44px;
}

/* 小さなアイコンボタンでもタップ領域を確保 */
.icon-button {
  padding: 12px;
}
```

### Spacing Between Targets

隣接するタッチターゲット間: 最低 **8px**

---

## Testing Checklist

### 自動テスト

- [ ] axe-core / Lighthouse でスキャン
- [ ] Color contrast checker
- [ ] HTML validator

### 手動テスト

- [ ] キーボードのみで操作可能
- [ ] Tab順序が論理的
- [ ] フォーカスが常に見える
- [ ] スクリーンリーダーで読み上げ確認 (VoiceOver / NVDA)
- [ ] 200%ズームでも使用可能
- [ ] 色のみで情報を伝えていない

### ツール

| ツール | 用途 |
|--------|------|
| axe DevTools | 自動アクセシビリティ監査 |
| Lighthouse | パフォーマンス + アクセシビリティ |
| WAVE | ビジュアル監査 |
| Colour Contrast Analyser | コントラスト計測 |
| VoiceOver (macOS) | スクリーンリーダーテスト |
| NVDA (Windows) | スクリーンリーダーテスト |

---

## Utility Classes

```css
/* スクリーンリーダーのみに表示 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* フォーカス時に表示 */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

**ステータス**: ✅ 確定
**最終更新**: 2026-02-01

