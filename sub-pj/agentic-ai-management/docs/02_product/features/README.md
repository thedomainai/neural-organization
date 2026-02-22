# Features

機能定義を管理するディレクトリ。

## 構成

```
features/
├── README.md           # このファイル
├── FEATURES.md         # 機能一覧（vercel-stack形式）
├── USER_STORIES.md     # ユーザーストーリー（vercel-stack形式）
├── audit-patterns.md   # 曖昧性検出パターン詳細仕様
└── ...
```

## ドキュメント一覧

| ファイル | 内容 | ステータス |
|----------|------|----------|
| `FEATURES.md` | 機能一覧・詳細仕様 | ✅ 作成済 |
| `USER_STORIES.md` | ユーザーストーリー | ✅ 作成済 |
| `audit-patterns.md` | 曖昧性検出パターン仕様（F-001詳細） | ✅ 承認済 |

## 機能サマリ

### Core Features (Must Have)

| ID | 機能名 | 関連US | ステータス |
|----|--------|--------|-----------|
| F-001 | 曖昧性検出エンジン | US-001, US-002 | ✅ 仕様承認済 |
| F-002 | 品質スコア算出 | US-003 | Planning |
| F-003 | 改善提案生成 | US-004 | Planning |
| F-004 | レポートエディター | US-005 | Planning |

### Important Features (Should Have)

| ID | 機能名 | 関連US | ステータス |
|----|--------|--------|-----------|
| F-010 | リアルタイム検出 | US-006 | Backlog |
| F-011 | ダッシュボード | US-007 | Backlog |
| F-012 | チーム管理 | US-008 | Backlog |

→ 詳細は `FEATURES.md` を参照

## ID体系

| 種類 | フォーマット | 例 |
|------|-------------|-----|
| 機能 | F-XXX | F-001, F-010 |
| ユーザーストーリー | US-XXX | US-001, US-010 |
| マイルストーン | MX.X | M1.1, M2.1 |
| 意思決定 | DEC-XXX | DEC-001 |

---

**オーナー**: AI（Human承認）
**最終更新**: 2026-01-23
