# Neural Organization Visual - 仕様書

> 修正指示時は `[変数名]` と `現在のラベル` をセットで指定してください。
> 例：「`hero.tagline` を "Neural Organization v2.0" に変更」

---

## ファイル情報

| 項目 | 値 |
|------|-----|
| メインファイル | `index.html` |
| SNSカード | `card.html` |
| コンセプト | `docs/concept.md` |
| フレームワーク | Tailwind CSS (CDN) |
| フォント | Inter, Noto Sans JP |

---

## カラーパレット

### レイヤーカラー

| 変数名 | HEX | 用途 |
|--------|-----|------|
| `layer.input` | `#6366f1` | 入力層（indigo） |
| `layer.memory` | `#8b5cf6` | 記憶層（violet） |
| `layer.strategy` | `#ec4899` | 戦略層（pink） |
| `layer.execution` | `#f97316` | 実行層（orange） |
| `layer.evaluation` | `#10b981` | 評価層（emerald） |
| `layer.output` | `#06b6d4` | 出力層（cyan） |

### 背景

```css
background: linear-gradient(180deg, #0a0a0f 0%, #111118 100%);
```

---

## ページ構造

```
├── Hero Section
├── Architecture Section（Layer Stack + Detail Panel）
├── Value Chain Section（横スクロールフロー）
├── Principles Section（3つの原則）
├── CTA Section
└── Footer
```

---

## Section 1: Hero

| 変数名 | 現在のラベル |
|--------|-------------|
| `hero.tagline` | `Neural Organization v1.0` |
| `hero.title.main` | `忘れない組織` |
| `hero.title.sub` | `をつくる` |
| `hero.subtitle` | `記憶を持ち、戦略に基づいて動き、人と共に学ぶ` |
| `hero.description.line1` | `AIは手足。記憶は財産。判断は人間。` |
| `hero.description.line2` | `人が育てて、人と育つ組織アーキテクチャ。` |
| `hero.cta` | `アーキテクチャを見る` |

---

## Section 2: Architecture

### セクションヘッダー

| 変数名 | 現在のラベル |
|--------|-------------|
| `architecture.title` | `5層アーキテクチャ` |
| `architecture.subtitle` | `データの流れに沿って設計された、学習する組織のための基盤` |

### Layer Stack（左パネル）

| 変数名 | data-layer | name | description |
|--------|------------|------|-------------|
| `stack.output` | `output` | `Output Layer` | `外部システムへのデプロイ` |
| `stack.evaluation` | `evaluation` | `Evaluation Layer` | `品質評価 & フィードバック` |
| `stack.processing` | `processing` | `Processing Layer` | `戦略立案 & タスク実行` |
| `stack.memory` | `memory` | `Memory Layer` | `組織の記憶 & ナレッジ` |
| `stack.input` | `input` | `Input Layer` | `社内データの収集` |

### Detail Panel（右パネル）

#### Default View

| 変数名 | 現在のラベル |
|--------|-------------|
| `detail.default.title` | `レイヤーを選択` |
| `detail.default.subtitle` | `左のレイヤーをクリックすると、詳細が表示されます。` |

#### Input Detail（ID: `inputDetail`）

| 変数名 | 現在のラベル |
|--------|-------------|
| `detail.input.title` | `Input Layer` |
| `detail.input.subtitle` | `社内データの収集` |
| `detail.input.description` | `外部センシングを除外し、「社内の事実」に集中したデータ収集層。` |
| `detail.input.item1.title` | `定性データ` |
| `detail.input.item1.desc` | `会議ログ、チャット、ドキュメント` |
| `detail.input.item2.title` | `定量データ` |
| `detail.input.item2.desc` | `KPI数値、財務データ、タスク進捗` |
| `detail.input.item3.title` | `人間からの指示` |
| `detail.input.item3.desc` | `「このプロジェクトを始めて」などのトリガー` |

#### Memory Detail（ID: `memoryDetail`）

| 変数名 | 現在のラベル |
|--------|-------------|
| `detail.memory.title` | `Memory Layer` |
| `detail.memory.subtitle` | `組織の記憶 & ナレッジ` |
| `detail.memory.description` | `アーキテクチャの核心。全てのAgentがアクセスし、組織の「記憶」を共有します。` |
| `detail.memory.item1.title` | `Vector Database` |
| `detail.memory.item1.desc` | `長期記憶。過去の成功パターン、会社の「らしさ」を蓄積` |
| `detail.memory.item2.title` | `Context Store` |
| `detail.memory.item2.desc` | `短期記憶。進行中の会議、現在のタスク状態を保持` |
| `detail.memory.item3.title` | `KPI Store` |
| `detail.memory.item3.desc` | `評価基準。現在のスコアと目標値のギャップを管理` |

#### Processing Detail（ID: `processingDetail`）

| 変数名 | 現在のラベル |
|--------|-------------|
| `detail.processing.title` | `Processing Layer` |
| `detail.processing.subtitle` | `戦略立案 & タスク実行` |
| `detail.processing.description` | `「戦略」と「実行」を分離した階層的意思決定システム。` |
| `detail.processing.strategy.badge` | `WHAT` |
| `detail.processing.strategy.title` | `Strategy Agent` |
| `detail.processing.strategy.desc` | `KPIと記憶を参照し、「何をするべきか」を決定` |
| `detail.processing.strategy.input` | `入力: 「売上が5%低下している」` |
| `detail.processing.strategy.think` | `思考: 「過去データでは、リライトが効果的だった」` |
| `detail.processing.strategy.output` | `出力: 実行部隊への具体的な指示書` |
| `detail.processing.execution.badge` | `HOW` |
| `detail.processing.execution.title` | `Execution Agent` |
| `detail.processing.execution.desc` | `指示に基づいて実際に手を動かし、成果物を生成` |
| `detail.processing.execution.outputs` | `ドキュメント`, `コード`, `メール下書き`, `レポート` |

#### Evaluation Detail（ID: `evaluationDetail`）

| 変数名 | 現在のラベル |
|--------|-------------|
| `detail.evaluation.title` | `Evaluation Layer` |
| `detail.evaluation.subtitle` | `品質評価 & フィードバック` |
| `detail.evaluation.description` | `品質担保と「教育」の要。二重のフィードバックで継続的に学習。` |
| `detail.evaluation.step1.badge` | `Step 1` |
| `detail.evaluation.step1.title` | `AI Critic` |
| `detail.evaluation.step1.desc` | `成果物を評価用AIがチェック。誤字脱字、論理矛盾、ガイドライン違反を検出。NGなら自動で差し戻し。` |
| `detail.evaluation.step2.badge` | `Step 2` |
| `detail.evaluation.step2.title` | `Human-in-the-Loop` |
| `detail.evaluation.step2.desc` | `AI Criticを通過したものを人間が確認。修正指示はMemory Layerに保存され、次の学習データに。` |

#### Output Detail（ID: `outputDetail`）

| 変数名 | 現在のラベル |
|--------|-------------|
| `detail.output.title` | `Output Layer` |
| `detail.output.subtitle` | `外部システムへのデプロイ` |
| `detail.output.description` | `承認された成果物を、指定のツールへデプロイ。` |
| `detail.output.tools` | `Slack`, `CMS`, `GitHub`, `Mail`, `X (Twitter)`, `Notion` |

---

## Section 3: Value Chain（データフロー）

### セクションヘッダー

| 変数名 | 現在のラベル |
|--------|-------------|
| `flow.title` | `データフローの実例` |
| `flow.subtitle` | `「PVが下がった」シナリオで、どのように組織が自律的に動くか` |

### Flow Steps（横スクロール）

| 変数名 | Step | badge | title | description |
|--------|------|-------|-------|-------------|
| `flow.step1` | 1 | `Input` | `KPIアラート検知` | `Analyticsから「PV前月比90%」データが到達` |
| `flow.step2` | 2 | `Memory` | `過去パターンを想起` | `「前回はSNS拡散が効いた」と想起` |
| `flow.step3` | 3 | `Strategy` | `施策を立案` | `「X投稿作成」という指示書を発行` |
| `flow.step4` | 4 | `Execution` | `コンテンツ生成` | `過去記事を読み込み、投稿文を作成` |
| `flow.step5` | 5 | `AI評価` | `自動品質チェック` | `「文字数が多すぎます」→自動修正` |
| `flow.step6` | 6 | `Human` | `人間によるレビュー` | `「砕けた表現にして」とFB` |
| `flow.step7` | 7 | `Learning` | `記憶への追記` | `「砕けた表現を好む」と学習` |
| `flow.step8` | 8 | `Output` | `デプロイ完了` | `修正版がXに投稿される` |

---

## Section 4: Principles

| 変数名 | title | description |
|--------|-------|-------------|
| `principle1` | `記憶は財産` | `退職しても、組織改編があっても、知見は失われない。組織の記憶が資産として蓄積される。` |
| `principle2` | `AIは手足` | `AIが戦略を決め、人間が実行するのではない。人間が方向性を決め、AIが実行する。判断は常に人間。` |
| `principle3` | `共に育つ` | `人間のフィードバックがAIを育て、育ったAIが組織を強くする。教育と成長の循環。` |

---

## Section 5: CTA

| 変数名 | 現在のラベル |
|--------|-------------|
| `cta.title` | `組織を進化させる準備はできていますか？` |
| `cta.description.line1` | `Neural Organizationは、単なるAIツールの導入ではありません。` |
| `cta.description.line2` | `組織全体が「学習する生命体」へと進化するためのフレームワークです。` |
| `cta.button.primary` | `詳細資料をダウンロード` |
| `cta.button.secondary` | `お問い合わせ` |

---

## Section 6: Footer

| 変数名 | 現在のラベル |
|--------|-------------|
| `footer.text` | `Neural Organization v1.0 — 記憶を持ち、戦略に基づいて動き、人と共に学ぶ組織` |

---

## SNS Card (`neural-organization-card.html`)

### Left Content

| 変数名 | 現在のラベル |
|--------|-------------|
| `card.tagline` | `Neural Organization` |
| `card.title.main` | `忘れない組織` |
| `card.title.sub` | `をつくる` |
| `card.subtitle.line1` | `記憶を持ち、戦略に基づいて動き、` |
| `card.subtitle.line2` | `人と共に学ぶ組織アーキテクチャ` |
| `card.principle1` | `記憶は財産` |
| `card.principle2` | `AIは手足` |
| `card.principle3` | `共に育つ` |

### Right Content（Layer Stack）

| 変数名 | name | description |
|--------|------|-------------|
| `card.layer.output` | `Output Layer` | `外部システムへのデプロイ` |
| `card.layer.evaluation` | `Evaluation Layer` | `品質評価 & フィードバック` |
| `card.layer.processing` | `Processing Layer` | `戦略立案 & タスク実行` |
| `card.layer.memory` | `Memory Layer` | `組織の記憶 & ナレッジ` |
| `card.layer.input` | `Input Layer` | `社内データの収集` |

### Footer

| 変数名 | 現在のラベル |
|--------|-------------|
| `card.version` | `v1.0` |
| `card.url` | `neural-organization.example.com` |

---

## 修正指示の例

### テキスト変更
```
「hero.title.main」を「学習する組織」に変更
「detail.memory.item1.title」を「ベクトルDB」に変更
```

### 複数変更
```
以下を変更：
- flow.step3.title: 「施策を立案」→「戦略を決定」
- flow.step3.description: 「〜指示書を発行」→「〜タスクを作成」
```

### Output Toolsの追加
```
「detail.output.tools」に「Google Drive」を追加
```

---

*Generated: 2026-01-30*
