# Components

neumannのUIコンポーネント仕様。shadcn/uiをベースにカスタマイズ。

## Component Philosophy

- **最小限のAPI**: propsは必要最小限に
- **コンポジション**: 小さなコンポーネントを組み合わせる
- **アクセシブル**: キーボード操作、スクリーンリーダー対応

---

## Core Components

### Button

| Variant | 用途 | 背景 | テキスト |
|---------|------|------|----------|
| `primary` | 主要アクション | Navy 800 | White |
| `secondary` | 副次アクション | Gray 100 | Gray 900 |
| `outline` | 三次アクション | Transparent | Gray 700 |
| `ghost` | 最小限のアクション | Transparent | Gray 700 |
| `destructive` | 削除・危険 | Error 600 | White |

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | 12px | 14px |
| `md` | 40px | 16px | 14px |
| `lg` | 48px | 24px | 16px |

```tsx
<Button variant="primary" size="md">
  レポートを提出
</Button>
```

**状態:**
- Default → Hover (darken 10%) → Active (darken 15%)
- Disabled: opacity 50%, cursor not-allowed
- Loading: spinner + text "処理中..."

---

### Input

| Variant | 用途 |
|---------|------|
| `default` | 通常入力 |
| `error` | エラー状態 |

```tsx
<Input
  label="レポートタイトル"
  placeholder="例: 2026年1月第4週 営業部"
  error="タイトルは必須です"
/>
```

**構造:**
```
┌─ Label ──────────────────────────┐
│                                  │
│  ┌─ Input ────────────────────┐  │
│  │ Placeholder...             │  │
│  └────────────────────────────┘  │
│                                  │
│  Error message (if error)        │
└──────────────────────────────────┘
```

---

### Card

コンテンツをグループ化するコンテナ。

```tsx
<Card>
  <CardHeader>
    <CardTitle>品質スコア</CardTitle>
    <CardDescription>今週のレポート品質</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-kpi-lg font-mono">87</div>
  </CardContent>
  <CardFooter>
    <span className="text-success-600">+5 vs 先週</span>
  </CardFooter>
</Card>
```

**Variants:**
- `default`: 背景 white, ボーダー gray-200
- `elevated`: 背景 white, シャドウ md
- `ghost`: 背景 transparent, ボーダーなし

---

### Badge / Tag

ステータスやカテゴリを示す小さなラベル。

| Variant | 背景 | テキスト | 用途 |
|---------|------|----------|------|
| `default` | Gray 100 | Gray 700 | 一般タグ |
| `success` | Success 100 | Success 600 | 完了、良好 |
| `warning` | Warning 100 | Warning 600 | 要注意 |
| `error` | Error 100 | Error 600 | エラー、重大 |
| `info` | Info 100 | Info 600 | 情報 |

```tsx
<Badge variant="warning">要確認</Badge>
```

---

### Table

データ表示用テーブル。

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>指標</TableHead>
      <TableHead className="text-right">実績</TableHead>
      <TableHead className="text-right">目標</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>売上</TableCell>
      <TableCell className="text-right font-mono">¥12,345,678</TableCell>
      <TableCell className="text-right font-mono text-gray-500">¥10,000,000</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**スタイル:**
- ヘッダー: 背景 gray-50, テキスト overline uppercase
- 行: ホバー時 背景 gray-50
- 数値セル: 右揃え, font-mono

---

### Tabs

コンテンツの切り替え。

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">概要</TabsTrigger>
    <TabsTrigger value="details">詳細</TabsTrigger>
    <TabsTrigger value="history">履歴</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>
```

---

### Modal / Dialog

確認やフォーム入力用のオーバーレイ。

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>レポートを削除</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>本当に削除しますか？</DialogTitle>
      <DialogDescription>
        この操作は取り消せません。
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">キャンセル</Button>
      <Button variant="destructive">削除する</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**サイズ:**
- `sm`: max-width 400px
- `md`: max-width 500px (default)
- `lg`: max-width 640px
- `xl`: max-width 800px

---

### Toast / Notification

フィードバック通知。

| Variant | アイコン | 用途 |
|---------|---------|------|
| `success` | CheckCircle | 成功 |
| `error` | XCircle | エラー |
| `warning` | AlertTriangle | 警告 |
| `info` | Info | 情報 |

```tsx
toast({
  variant: "success",
  title: "保存しました",
  description: "レポートが正常に保存されました。",
});
```

**位置:** 画面右下 (bottom-right)
**自動消去:** 5秒後

---

## Data Display Components

### KPI Card

主要KPIを目立たせるカード。

```tsx
<KPICard
  label="品質スコア"
  value={87}
  unit="点"
  change={+5}
  changeLabel="vs 先週"
  trend="up" // up | down | neutral
/>
```

```
┌─────────────────────────────┐
│ 品質スコア                  │  ← overline, gray-500
│                             │
│         87 点               │  ← kpi-lg, mono + body-sm
│                             │
│     ↑ +5 vs 先週            │  ← caption, success-600
└─────────────────────────────┘
```

---

### Score Ring

スコアを円グラフで表示。

```tsx
<ScoreRing
  score={87}
  max={100}
  size="lg" // sm: 64px, md: 96px, lg: 128px
  color="success" // 自動判定も可
/>
```

---

### Progress Bar

進捗表示。

```tsx
<ProgressBar
  value={75}
  max={100}
  showLabel
  color="primary"
/>
```

---

### Chart (Recharts wrapper)

```tsx
<LineChart
  data={weeklyScores}
  xKey="week"
  yKey="score"
  height={300}
/>

<BarChart
  data={categoryScores}
  xKey="category"
  yKey="count"
  height={200}
/>
```

**チャート共通ルール:**
- Y軸は0から始める
- グリッド線は控えめ（gray-100）
- ツールチップはシンプルに
- 凡例は必要な場合のみ

---

## Form Components

### Select

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="期間を選択" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="week">今週</SelectItem>
    <SelectItem value="month">今月</SelectItem>
    <SelectItem value="quarter">今四半期</SelectItem>
  </SelectContent>
</Select>
```

---

### Checkbox / Radio

```tsx
<Checkbox id="terms" />
<label htmlFor="terms">利用規約に同意する</label>

<RadioGroup defaultValue="week">
  <RadioGroupItem value="week" id="r1" />
  <label htmlFor="r1">週次</label>
  <RadioGroupItem value="month" id="r2" />
  <label htmlFor="r2">月次</label>
</RadioGroup>
```

---

### Textarea

```tsx
<Textarea
  label="レポート内容"
  placeholder="今週の活動内容を記入してください..."
  rows={6}
/>
```

---

## Navigation Components

### Sidebar

```tsx
<Sidebar>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  <SidebarContent>
    <SidebarItem icon={Home} href="/">ダッシュボード</SidebarItem>
    <SidebarItem icon={FileText} href="/reports">レポート</SidebarItem>
    <SidebarItem icon={Settings} href="/settings">設定</SidebarItem>
  </SidebarContent>
  <SidebarFooter>
    <UserMenu />
  </SidebarFooter>
</Sidebar>
```

**状態:**
- 展開時: 240px width
- 折りたたみ時: 64px width (アイコンのみ)

---

### Breadcrumb

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">ホーム</BreadcrumbItem>
  <BreadcrumbItem href="/reports">レポート</BreadcrumbItem>
  <BreadcrumbItem current>2026年1月第4週</BreadcrumbItem>
</Breadcrumb>
```

---

## Component Checklist

新しいコンポーネントを作成する際の確認事項:

- [ ] キーボードで操作可能か？
- [ ] フォーカス状態は明確か？
- [ ] aria属性は適切か？
- [ ] エラー状態は定義されているか？
- [ ] ローディング状態は定義されているか？
- [ ] 空状態は定義されているか？
- [ ] レスポンシブか？

---

**ステータス**: 🟡 Draft
**最終更新**: 2026-02-01

