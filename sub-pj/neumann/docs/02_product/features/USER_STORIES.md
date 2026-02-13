# User Stories

## Format

```
As a [ユーザータイプ],
I want to [実現したいこと],
So that [得られる価値・理由].
```

## Personas Reference

| ペルソナ | 説明 | 詳細 |
|----------|------|------|
| CEO | The Lonely Visionary（孤高の論理的CEO） | `01_concept/personas.md` |
| Manager | Operation Manager（現場マネージャー） | `01_concept/personas.md` |

---

## Epic 1: 曖昧性の検出・可視化

CEOとマネージャーがレポートの曖昧性を把握できるようにする。

### US-001: レポートの曖昧性を自動検出したい

| 項目 | 内容 |
|------|------|
| ユーザー | CEO |
| 優先度 | Must |
| ステータス | Ready |
| 関連機能 | F-001 |

**ストーリー:**
> As a CEO,
> I want to automatically detect ambiguities in weekly reports,
> So that I can identify unclear points without reading every detail myself.

**受け入れ条件:**
- [ ] レポートを入力すると、3秒以内に検出が開始される
- [ ] 5つのパターン（FI, LQ, UA, SA, MC）を検出できる
- [ ] 検出箇所が本文中にハイライト表示される
- [ ] 各検出項目に重要度（Critical/Warning/Info）が付与される

**補足・制約:**
- 日本語レポートが対象（英語は将来対応）
- 検出精度目標: Precision 80%以上, Recall 70%以上

---

### US-002: 曖昧性の詳細を確認したい

| 項目 | 内容 |
|------|------|
| ユーザー | CEO |
| 優先度 | Must |
| ステータス | Ready |
| 関連機能 | F-001 |

**ストーリー:**
> As a CEO,
> I want to see the details of each detected ambiguity,
> So that I can understand why it was flagged and what needs to be fixed.

**受け入れ条件:**
- [ ] 検出項目をクリックすると、詳細パネルが表示される
- [ ] 詳細には「問題点」「パターン」「重要度」「該当箇所（引用）」が含まれる
- [ ] 問題点は具体的で理解しやすい文章で記載される

---

### US-003: レポートの品質を数値で把握したい

| 項目 | 内容 |
|------|------|
| ユーザー | CEO |
| 優先度 | Must |
| ステータス | Ready |
| 関連機能 | F-002 |

**ストーリー:**
> As a CEO,
> I want to see a quality score for each report,
> So that I can quickly assess report quality without reviewing every issue.

**受け入れ条件:**
- [ ] 品質スコア（0-100）がエディター上部に表示される
- [ ] スコアに応じて色分けされる（緑/黄/オレンジ/赤）
- [ ] スコアの内訳（パターン別の問題数）が確認できる
- [ ] スコア基準（90以上=Excellent等）が明示される

---

### US-004: 曖昧性の改善案を確認したい

| 項目 | 内容 |
|------|------|
| ユーザー | Manager |
| 優先度 | Must |
| ステータス | Ready |
| 関連機能 | F-003 |

**ストーリー:**
> As a Manager,
> I want to see specific suggestions for fixing ambiguities,
> So that I can quickly improve my report without guessing what's expected.

**受け入れ条件:**
- [ ] 検出項目に「改善案を表示」ボタンがある
- [ ] 改善案はBefore/After形式で表示される
- [ ] 「適用」ボタンで本文に反映できる
- [ ] 改善案は編集可能（そのまま適用しなくてもよい）

---

## Epic 2: レポート作成・編集

マネージャーがレポートを作成・編集できるようにする。

### US-005: レポートを作成・編集したい

| 項目 | 内容 |
|------|------|
| ユーザー | Manager |
| 優先度 | Must |
| ステータス | Ready |
| 関連機能 | F-004 |

**ストーリー:**
> As a Manager,
> I want to create and edit reports in a dedicated editor,
> So that I can write structured weekly reports efficiently.

**受け入れ条件:**
- [ ] 新規レポートを作成できる
- [ ] タイトルと本文を入力できる
- [ ] リッチテキスト（見出し、箇条書き、表）が使える
- [ ] 下書き保存と提出を区別できる
- [ ] オートセーブが有効（30秒間隔）

---

### US-006: 入力中にリアルタイムで検出してほしい

| 項目 | 内容 |
|------|------|
| ユーザー | Manager |
| 優先度 | Should |
| ステータス | Backlog |
| 関連機能 | F-010 |

**ストーリー:**
> As a Manager,
> I want to see ambiguity detection results in real-time as I type,
> So that I can fix issues immediately without running a separate check.

**受け入れ条件:**
- [ ] 入力停止から2秒後に自動検出が実行される
- [ ] 新しい検出結果が既存のリストに追加される
- [ ] 修正済みの項目は自動的に消える
- [ ] パフォーマンスに影響しない（エディターがカクつかない）

**補足・制約:**
- MVP後の実装を検討（F-010はShould Have）

---

## Epic 3: 全体可視化・管理

CEOが組織全体のレポート品質を把握できるようにする。

### US-007: 全レポートの品質をダッシュボードで確認したい

| 項目 | 内容 |
|------|------|
| ユーザー | CEO |
| 優先度 | Should |
| ステータス | Backlog |
| 関連機能 | F-011 |

**ストーリー:**
> As a CEO,
> I want to see a dashboard with all reports and their quality scores,
> So that I can identify which managers need support at a glance.

**受け入れ条件:**
- [ ] 今週のレポート一覧が表示される
- [ ] 各レポートに品質スコアが表示される
- [ ] スコアでソート・フィルタできる
- [ ] 品質スコアの推移グラフが表示される

---

### US-008: チームメンバーを管理したい

| 項目 | 内容 |
|------|------|
| ユーザー | CEO |
| 優先度 | Should |
| ステータス | Backlog |
| 関連機能 | F-012 |

**ストーリー:**
> As a CEO,
> I want to manage team members and their roles,
> So that I can control who can access and edit reports.

**受け入れ条件:**
- [ ] メンバーを招待できる（メールアドレス）
- [ ] 権限を設定できる（CEO / Manager）
- [ ] メンバーを削除できる
- [ ] メンバー一覧を確認できる

---

## Epic 4: 外部連携

外部ツールからレポートをインポートできるようにする。

### US-010: 外部ツールからレポートをインポートしたい

| 項目 | 内容 |
|------|------|
| ユーザー | Manager |
| 優先度 | Could |
| ステータス | Backlog |
| 関連機能 | F-020, F-021, F-022 |

**ストーリー:**
> As a Manager,
> I want to import reports from Google Docs, Slides, or Notion,
> So that I don't have to copy-paste my existing documents.

**受け入れ条件:**
- [ ] Google Docs/Slides/Notionにログインできる
- [ ] ドキュメント一覧から選択できる
- [ ] 選択したドキュメントがレポートとしてインポートされる
- [ ] インポート後も元ドキュメントとの同期は不要（ワンタイム）

**補足・制約:**
- MVP後の実装を検討（Could Have）

---

### US-011: 検出結果をSlackで受け取りたい

| 項目 | 内容 |
|------|------|
| ユーザー | Manager |
| 優先度 | Could |
| ステータス | Backlog |
| 関連機能 | F-023 |

**ストーリー:**
> As a Manager,
> I want to receive detection results via Slack,
> So that I can be notified without opening the neumann app.

**受け入れ条件:**
- [ ] Slackワークスペースと連携できる
- [ ] 検出完了時にDMまたはチャンネルに通知される
- [ ] 通知にはスコアと主要な問題点が含まれる
- [ ] 通知のオン/オフを設定できる

---

### US-012: KPIツリーを確認したい

| 項目 | 内容 |
|------|------|
| ユーザー | CEO |
| 優先度 | Could |
| ステータス | Backlog |
| 関連機能 | F-024 |

**ストーリー:**
> As a CEO,
> I want to see a visual KPI tree for my organization,
> So that I can understand the relationship between metrics and goals.

**受け入れ条件:**
- [ ] KPIツリーがツリー形式で表示される
- [ ] 各ノードに現在値/目標値が表示される
- [ ] 未達のノードがハイライトされる
- [ ] ノードをクリックすると詳細が表示される

---

## Priority Matrix

| ID | ストーリー | 価値 | 工数 | 優先度 |
|----|-----------|------|------|--------|
| US-001 | 曖昧性の自動検出 | High | Medium | Must |
| US-002 | 詳細確認 | High | Low | Must |
| US-003 | 品質スコア表示 | High | Low | Must |
| US-004 | 改善案表示 | High | Medium | Must |
| US-005 | レポート作成・編集 | High | High | Must |
| US-006 | リアルタイム検出 | Medium | High | Should |
| US-007 | ダッシュボード | Medium | Medium | Should |
| US-008 | チーム管理 | Medium | Medium | Should |
| US-010 | 外部連携 | Low | High | Could |
| US-011 | Slack通知 | Low | Medium | Could |
| US-012 | KPIツリー | Low | High | Could |

---

## Changelog

| 日付 | 変更内容 | 担当 |
|------|----------|------|
| 2026-01-23 | 初版作成（US-001〜US-012） | AI |

---

*最終更新: 2026-01-23*
