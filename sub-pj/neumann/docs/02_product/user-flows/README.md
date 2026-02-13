# User Flows

ユーザーフローを定義するディレクトリ。

## 設計思想

```
経営者は「作業」ではなく「確認」と「判断」のみに時間を使うべき。
neumann は経営者の認知負荷を最小化し、必要な時だけ介入を求める。
```

## 構成

各ユーザーフローは個別ファイルとして管理。

```
user-flows/
├── README.md                    # このファイル
├── v1-onboarding-flow.md        # v1.0 オンボーディングフロー
├── v1-ceo-daily-flow.md         # v1.0 CEO日常フロー
├── v1-manager-response-flow.md  # v1.0 マネージャー対応フロー
└── ...
```

## フロー一覧

| フロー | 対象 | 説明 | ステータス |
|--------|------|------|----------|
| [Onboarding Flow](./v1-onboarding-flow.md) | CEO | 初回利用〜価値体験 | 🟢 完了 |
| [CEO Daily Flow](./v1-ceo-daily-flow.md) | CEO | 朝のステータス確認、異常への介入 | 🟢 完了 |
| [Manager Response Flow](./v1-manager-response-flow.md) | マネージャー | 曖昧性指摘への対応 | 🟡 ドラフト (v1.1) |

## v1.0 MVP フロー概要

### CEO の1日

```
08:00  アプリを開く（30秒）
       └→ STATUS: HEALTHY なら閉じる
       └→ STATUS: DEGRADED なら詳細確認（5-10分）

       ※ 異常がなければ、1日のneumann利用時間は30秒
```

### 価値提供のポイント

| 体験 | 具体的な実現 |
|------|-------------|
| **Observability** | ダッシュボードで健全性が一目で分かる |
| **Zero Latency** | 異常は既に検知・分析済み |
| **Trusted Bad Cop** | AIが自動で曖昧さを指摘（CEOは判断のみ） |

## 記述フォーマット

各フローは以下の形式で記述:

1. 設計原則
2. ユーザーフロー概要（Mermaid sequence diagram）
3. 画面構成
4. 成功指標
5. スコープ決定（含む/含まない機能）
6. 前提条件

## バージョン管理

各ドキュメントには Changelog セクションを設置。
変更理由を明記し、意思決定の履歴を追跡可能にする。

→ 詳細: [Document Versioning Guide](../../_templates/document-versioning.md)

---

## Changelog

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| v1.0 | 2025-01-15 | AI | 初版作成。CEO Daily Flow / Manager Response Flow / Onboarding Flow を定義 |

**オーナー**: AI（Human承認）
