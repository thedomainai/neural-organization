# Execution Modules — 実行層モジュール詳細

> 8つのAgentクラスタの内部構成、Worker Agent の役割、ツール連携の完全定義

---

## 共通アーキテクチャ

全クラスタは Orchestrator-Worker パターンで統一的に構成される。

```
Strategic Directive (from Cortex Layer)
    │
    ▼
┌─────────────────────────────────────────┐
│            Cluster Lead Agent            │
│                                         │
│  1. Directive を受信                     │
│  2. タスクを分解（Sub-tasks）             │
│  3. 適切な Worker を選択/起動            │
│  4. タスクを割当                         │
│  5. 進捗を監視                          │
│  6. 結果を統合                          │
│  7. 成果物を Limbic Layer に提出          │
└────────┬───────────┬───────────┬────────┘
         │           │           │
    ┌────▼───┐  ┌───▼────┐  ┌──▼─────┐
    │Worker A│  │Worker B│  │Worker C│
    │        │  │        │  │        │
    │ Tool   │  │ Tool   │  │ Tool   │
    │ Access │  │ Access │  │ Access │
    │ (MCP)  │  │ (MCP)  │  │ (MCP)  │
    └────────┘  └────────┘  └────────┘
```

---

## 1. HR Cluster（人事クラスタ）

### Lead Agent: `t4.hr.lead`

```yaml
責務: HR関連タスクの全体調整
モデル: sonnet
```

### Workers

#### 1-1. Recruiter（採用Agent）

```yaml
id: t4.hr.recruiter
model: sonnet
max_instances: 3

責務:
  - 求人票の作成・更新
  - 候補者のスクリーニング（書類選考）
  - 面接スケジュール調整
  - 候補者への連絡

ツール (MCP):
  - mcp-ats: 応募者追跡システム（ATS）操作
  - mcp-calendar: 面接スケジュール管理
  - mcp-email: 候補者への連絡メール送信
  - mcp-linkedin: LinkedIn求人管理

記憶アクセス:
  Semantic: 採用基準、職務要件、企業文化
  Episodic: 過去の採用成功/失敗パターン
  Procedural: 採用フロー定義、面接テンプレート

タスク例:
  input:  "エンジニア2名を採用。予算500万円/人"
  process:
    1. 記憶から過去の成功した採用要件を想起
    2. 求人票を作成
    3. ATSに登録、求人サイトに公開
    4. 応募者のスクリーニング
    5. 面接設定、フィードバック収集
  output: 候補者リスト + 評価レポート
```

#### 1-2. Evaluator（人事評価Agent）

```yaml
id: t4.hr.evaluator
model: sonnet

責務:
  - 360度評価の設計・実施
  - パフォーマンスレポート作成
  - 昇進・昇給の推薦案作成

ツール:
  - mcp-hrms: 人事管理システム
  - mcp-survey: アンケートツール
```

#### 1-3. Trainer（研修Agent）

```yaml
id: t4.hr.trainer
model: haiku

責務:
  - 研修プログラムの設計
  - 研修コンテンツの作成
  - スキルギャップ分析
```

#### 1-4. Onboarder（オンボーディングAgent）

```yaml
id: t4.hr.onboarder
model: haiku

責務:
  - 新入社員オンボーディング自動化
  - アカウント設定、ツールアクセス付与
  - オリエンテーション資料の提供
```

---

## 2. Finance Cluster（財務クラスタ）

### Lead Agent: `t4.finance.lead`

### Workers

#### 2-1. Accountant（経理Agent）

```yaml
id: t4.finance.accountant
model: sonnet
risk_tier: HIGH (財務データ操作)

責務:
  - 請求書の作成・送付
  - 入金確認・消込
  - 仕訳入力
  - 月次/四半期決算資料作成

ツール:
  - mcp-erp: 会計ソフト操作
  - mcp-bank: 銀行API（残高確認、入出金照会）
  - mcp-invoice: 請求書発行システム

ガバナンス:
  仕訳入力: Tier 2 (AI自動承認 + 事後レビュー)
  振込実行: Tier 4 (複数人承認必須)
  決算資料: Tier 3 (Human事前承認)
```

#### 2-2. Budgeter（予算管理Agent）

```yaml
id: t4.finance.budgeter
model: sonnet

責務:
  - 予算の策定・管理
  - 予実管理レポート作成
  - 予算超過アラート
```

#### 2-3. Forecaster（予測Agent）

```yaml
id: t4.finance.forecaster
model: opus (高度な分析が必要)

責務:
  - 売上予測
  - キャッシュフロー予測
  - シナリオ分析
```

---

## 3. Marketing Cluster（マーケティングクラスタ）

### Lead Agent: `t4.marketing.lead`

### Workers

#### 3-1. Content Writer（コンテンツ制作Agent）

```yaml
id: t4.marketing.content_writer
model: sonnet
max_instances: 5

責務:
  - ブログ記事の執筆
  - ホワイトペーパーの作成
  - ニュースレターの執筆
  - ケーススタディの作成

ツール:
  - mcp-cms: CMS操作（WordPress, Notion等）
  - mcp-seo: SEOツール（キーワード調査、メタ情報最適化）
  - mcp-image: 画像生成/編集

記憶アクセス:
  Semantic: ブランドガイドライン、ターゲットペルソナ
  Episodic: 過去の高パフォーマンス記事のパターン
  Procedural: 記事作成テンプレート、SEOチェックリスト
  Evaluative: PV、読了率、CVRのトレンド
```

#### 3-2. SEO Specialist

```yaml
id: t4.marketing.seo
model: haiku

責務:
  - キーワードリサーチ
  - テクニカルSEO監査
  - 既存コンテンツのSEO最適化提案
```

#### 3-3. SNS Manager

```yaml
id: t4.marketing.sns_manager
model: sonnet
max_instances: 3

責務:
  - SNS投稿の作成・スケジュール
  - エンゲージメント分析
  - トレンド対応投稿の作成

ツール:
  - mcp-x: X (Twitter) API
  - mcp-linkedin: LinkedIn API
  - mcp-instagram: Instagram API
```

#### 3-4. Designer（デザインAgent）

```yaml
id: t4.marketing.designer
model: sonnet

責務:
  - バナー画像生成
  - SNSビジュアル作成
  - プレゼン資料デザイン

ツール:
  - mcp-image: AI画像生成
  - mcp-figma: Figma API（テンプレート適用）
```

---

## 4. Sales Cluster（営業クラスタ）

### Workers

#### 4-1. Prospector（見込み客開拓Agent）

```yaml
id: t4.sales.prospector
model: sonnet

責務:
  - ターゲット企業のリストアップ
  - アプローチメールの作成・送信
  - リードスコアリング

ツール:
  - mcp-crm: CRM操作（Salesforce, HubSpot）
  - mcp-email: メール送信
  - mcp-linkedin: LinkedIn営業支援
```

#### 4-2. Negotiator（商談Agent）

```yaml
id: t4.sales.negotiator
model: opus (高度な交渉判断が必要)

責務:
  - 提案書の作成
  - 価格交渉のシミュレーション
  - 条件調整の提案

ガバナンス:
  価格変更: Tier 3 (Human事前承認)
  特別割引: Tier 4 (複数承認)
```

#### 4-3. Account Manager

```yaml
id: t4.sales.account_manager
model: sonnet

責務:
  - 既存顧客の健全性モニタリング
  - アップセル/クロスセル機会の特定
  - 定期レビューの準備
```

---

## 5. Engineering Cluster（開発クラスタ）

### Workers

#### 5-1. Developer（開発Agent）

```yaml
id: t4.engineering.developer
model: opus (高品質なコード生成)
max_instances: 10

責務:
  - 機能実装
  - バグ修正
  - テスト作成

ツール:
  - mcp-github: GitHub操作（PR作成、コードプッシュ）
  - mcp-terminal: ターミナル操作
  - mcp-browser: ブラウザ操作（E2Eテスト）
```

#### 5-2. Code Reviewer

```yaml
id: t4.engineering.reviewer
model: opus

責務:
  - PRのコードレビュー
  - セキュリティチェック
  - パフォーマンス評価
```

#### 5-3. DevOps

```yaml
id: t4.engineering.devops
model: sonnet

責務:
  - CI/CDパイプライン管理
  - インフラプロビジョニング
  - モニタリング設定

ツール:
  - mcp-github: GitHub Actions管理
  - mcp-cloud: クラウドインフラ操作（AWS/GCP/Azure）
  - mcp-monitoring: 監視ツール設定
```

---

## 6. Legal Cluster（法務クラスタ）

### Workers

#### 6-1. Contract Drafter

```yaml
id: t4.legal.contract_drafter
model: opus (法的正確性が必要)
risk_tier: HIGH-CRITICAL

責務:
  - 契約書ドラフト作成
  - 契約書レビュー（相手方からの契約書チェック）
  - リスク条項の特定

ガバナンス:
  全成果物: Tier 3以上（Human事前承認必須）
```

#### 6-2. Compliance Checker

```yaml
id: t4.legal.compliance_checker
model: sonnet

責務:
  - 社内ポリシー準拠チェック
  - 規制変更の追跡
  - コンプライアンスレポート作成
```

---

## 7. Operations Cluster（業務クラスタ）

### Workers

#### 7-1. Process Manager

```yaml
id: t4.operations.process_manager
model: haiku

責務:
  - 業務プロセスの実行管理
  - ボトルネック検出
  - プロセス改善提案
```

#### 7-2. Scheduler

```yaml
id: t4.operations.scheduler
model: haiku

責務:
  - 会議のスケジュール調整
  - タスクの優先度管理
  - リソーススケジューリング

ツール:
  - mcp-calendar: Google Calendar / Outlook
  - mcp-project: プロジェクト管理ツール
```

---

## 8. Support Cluster（カスタマーサポートクラスタ）

### Workers

#### 8-1. Responder（応答Agent）

```yaml
id: t4.support.responder
model: sonnet
max_instances: 10 (同時問い合わせ対応)

責務:
  - 問い合わせの初期対応
  - FAQ回答
  - チケット起票

ツール:
  - mcp-ticket: チケットシステム（Zendesk, Freshdesk）
  - mcp-kb: ナレッジベース検索

記憶アクセス:
  Semantic: 製品知識、FAQ、トラブルシューティング手順
  Episodic: 顧客別の過去問い合わせ履歴
  Working: 進行中の問い合わせスレッド
```

#### 8-2. Escalator（エスカレーションAgent）

```yaml
id: t4.support.escalator
model: sonnet

責務:
  - 解決困難な問い合わせの判定
  - 適切なエスカレーション先の決定
  - エスカレーション時の情報整理
```

#### 8-3. KB Author（ナレッジベース更新Agent）

```yaml
id: t4.support.kb_author
model: haiku

責務:
  - 新規FAQ記事の作成
  - 既存記事の更新
  - 問い合わせパターンからの記事候補抽出
```

---

## Worker起動ポリシー

| 条件 | アクション |
|------|---------|
| Directive受信時 | Lead AgentがWorkerの必要数を算出、Lifecycle Managerに起動要求 |
| タスク完了時 | Worker を idle 状態に（5分間待機後に停止） |
| 負荷増大時 | max_instances まで自動スケールアウト |
| リソース不足時 | Resource Governor が低優先度タスクのWorkerを停止 |

---

*次のドキュメント:* `enterprise-functions/` — 企業機能別のE2Eフロー定義
