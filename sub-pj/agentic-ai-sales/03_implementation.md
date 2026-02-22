# Sales Presentation Automator - 実装ガイド

> 本ドキュメントは agentic-ai-sales の技術スタック、セットアップ、使い方、テストを定義する。コンセプトは [01_concept.md](01_concept.md)、アーキテクチャは [02_architecture.md](02_architecture.md) を参照。

## 1. Tech Stack

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| Runtime | Python | 3.11+ | アプリケーション実行環境 |
| CLI Framework | Click | - | 対話型コマンドラインインターフェース |
| LLM | Claude API | claude-3-5-sonnet | スライドコンテンツ生成 |
| Data Models | Pydantic | v2 | 入力バリデーション、データ構造定義 |
| Output | python-pptx | - | PowerPoint ファイル生成 |
| Config | YAML | - | プロンプトテンプレート、設定管理 |

## 2. プロジェクト構造

```
agentic-ai-sales/
├── src/spa/                  # メインパッケージ
│   ├── __init__.py
│   ├── cli.py               # CLI エントリポイント（Click）
│   ├── models.py            # データモデル定義（Pydantic）
│   ├── llm_client.py        # Claude API クライアント
│   ├── pptx_generator.py    # PPTX 生成エンジン
│   ├── agents/              # エージェント実装
│   ├── templates/           # Jinja2 テンプレート
│   ├── tools/               # ツール実装
│   └── utils/               # ユーティリティ
├── data/
│   └── prompts/
│       └── slide_generation.yaml  # SPIN プロンプトテンプレート
├── config/
│   └── settings.yaml        # アプリケーション設定
├── tests/                   # テストコード
├── pyproject.toml           # パッケージ設定
└── .env                     # 環境変数（Git管理外）
```

## 3. セットアップ

### 3.1 前提条件

- Python 3.11 以上
- Anthropic API キー

### 3.2 インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/thedomainai/agentic-ai-sales.git
cd agentic-ai-sales

# 仮想環境の作成と有効化
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 依存パッケージのインストール
pip install -e .

# API キーの設定
export ANTHROPIC_API_KEY="your-api-key-here"
```

### 3.3 開発環境のセットアップ

```bash
# 開発用依存パッケージを含めてインストール
pip install -e ".[dev]"
```

## 4. 使い方

### 4.1 基本的な使い方

```bash
# CLI の起動
spa

# 出力ディレクトリを指定
spa --output-dir ./presentations
```

### 4.2 対話型フロー

CLI を起動すると、以下の順序で対話型の入力を求められる。

**Step 1: 顧客情報の入力**

| 項目 | 必須 | 説明 |
|------|------|------|
| 会社名 | Yes | 顧客企業の正式名称 |
| 業界 | Yes | 選択式（IT、金融、製造 等） |
| 企業規模 | Yes | 選択式（~50名、51-300名、301-1000名、1001名~） |

**Step 2: 商談コンテキストの入力**

| 項目 | 必須 | 説明 |
|------|------|------|
| プレゼン種類 | Yes | 現在は「新規1次商談」のみ対応 |
| 今回のゴール | Yes | 例: 「2次商談への移行承諾を得る」 |
| プレゼン時間 | Yes | 選択式（15分、30分、60分） |
| 課題仮説 | Yes | 顧客が抱えていると推測される課題 |

**Step 3: 確認と生成**

入力内容を確認後、Claude API でスライドコンテンツを生成し、PPTX ファイルとして出力する。

### 4.3 出力ファイル

生成されたプレゼン資料は指定ディレクトリ（デフォルト: カレントディレクトリ）に `.pptx` 形式で保存される。

現在の MVP では以下の 7 枚構成（SPIN フレームワーク）で生成する。

1. タイトルスライド
2. アジェンダ
3. Situation（現状認識）
4. Problem（課題提起）
5. Implication（影響・インパクト）
6. Need-payoff（解決価値・提案）
7. Next Steps

## 5. データモデル

### 5.1 主要モデル

`src/spa/models.py` で定義されている主要なデータモデル（Pydantic v2）。

**Enum 定義**

| Enum | 値 | 説明 |
|------|-----|------|
| Industry | it_software, manufacturing, finance, retail, healthcare, other | 業界分類。display_name で日本語名を返す |
| CompanySize | small, medium, large, enterprise | 企業規模（~50名 / 51-300名 / 301-1000名 / 1001名~） |
| ScenarioType | new_business_1st | プレゼンシナリオ種別。Phase 2 で拡張予定 |

**CustomerInfo**: 顧客情報を保持する。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| company_name | str | Yes | 顧客企業名 |
| industry | Industry | Yes | 業界分類 |
| company_size | CompanySize | Yes | 企業規模 |
| url | str / None | No | 企業 URL |

**DealContext**: 商談コンテキストを保持する。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| scenario_type | ScenarioType | Yes | プレゼンシナリオ種別 |
| goal | str | Yes | 商談のゴール |
| duration_minutes | int | No | プレゼン時間（デフォルト: 30分） |
| pain_hypothesis | str | Yes | 課題仮説 |

**SlideContent**: 1 枚のスライドの内容を保持する。

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| slide_type | str | Yes | スライドタイプ（title, agenda, situation 等） |
| title | str | Yes | スライドタイトル |
| main_message | str | Yes | メインメッセージ |
| bullet_points | list[str] | No | 箇条書き項目 |
| speaker_notes | str | No | スピーカーノート |

**PresentationContent**: プレゼン全体の内容を保持する。CustomerInfo + DealContext + SlideContent のリスト。

**GenerationRequest**: プレゼン生成リクエスト。CustomerInfo + DealContext をまとめる。

### 5.2 設定ファイル

`config/settings.yaml` でアプリケーション全体の設定を管理する。

- LLM モデル指定
- 出力設定
- テンプレート設定

## 6. パイプライン詳細

### 6.1 全体フロー

```
INPUT → PLANNING → CONTENT → DESIGN → QUALITY → OUTPUT
```

### 6.2 各フェーズの詳細

**INPUT（インプット収集）**
- 顧客情報: 基本属性、組織情報、関係性
- 商談コンテキスト: 基本情報、目的、競合状況、制約条件
- 過去のやり取り: コミュニケーション履歴、提案履歴

**PLANNING（計画）**
- 与件の整理: インプット検証、前提条件の明確化、スコープ定義
- ゴール設定: プレゼンゴール、メッセージゴール、アクションゴール
- 論理構成: ストーリーフレームワーク選択、ストーリーライン設計、時間配分

**CONTENT（コンテンツ生成）**
- ワイヤーフレーム選択: レイアウトタイプの決定
- アジェンダ設計: セクション定義、構成パターン選択
- メインメッセージ生成: スライドタイトル、キーメッセージ
- ボディコンテンツ: 本文テキスト、画像、グラフ、表、図解

**DESIGN（デザイン適用）**
- テンプレート適用: マスタースライド、要素マッピング
- ブランドガイドライン: カラー、タイポグラフィ、ロゴ使用
- レイアウト最適化: 余白管理、整列、視覚的階層
- 一貫性チェック: スタイル、フォーマット、構造、トーン

**QUALITY（品質保証）**
- 内容レビュー: ファクトチェック、ロジックチェック、メッセージチェック
- ビジュアルレビュー: 可読性、デザイン品質、ブランド準拠
- 制約条件レビュー: 禁止事項、機密情報、法的リスク
- 最終レビュー: 全体通しチェック、スピーカーノート確認

**OUTPUT（出力）**
- プレゼン資料: PPTX 形式（将来: Google Slides, PDF）
- 付随資料: スピーカーノート、想定Q&A、競合比較表

## 7. データソース分類

プレゼン資料生成に必要なデータは 4 種類に分類される。

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   PRESET    │  │   MASTER    │  │    AUTO     │  │    USER     │
│  プリセット  │  │   マスタ    │  │   自動取得   │  │  ユーザー入力 │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
      ↓                ↓                ↓                ↓
 初期設定時         継続的更新        リアルタイム      商談ごと
 1回設定           管理画面で         API/Web          都度入力
```

### 7.1 PRESET（プリセット）

導入時に 1 回設定するデータ。年 1-2 回更新。

- ブランド設定: 企業情報、デザインシステム、スライドテンプレート
- 制約条件: 禁止表現、必須表現、スタイルルール
- ストーリーフレームワーク: SPIN、問題解決型、Before/After 等

### 7.2 MASTER（マスタデータ）

継続的に更新されるデータ。週次/月次で管理。

- 製品情報: カタログ、価格、技術仕様、FAQ
- 事例情報: 導入事例、業界タグ、定量効果
- 競合情報: プロファイル、比較表、対策
- 勝ち/負けパターン: 成功要因、失敗要因、ベストプラクティス

### 7.3 AUTO（自動取得）

資料生成時にリアルタイムで取得するデータ。

- CRM連携: 顧客情報、商談情報、活動履歴（Salesforce, HubSpot）
- 企業公開情報: IR、プレスリリース、ニュース、採用情報
- 業界情報: 市場データ、トレンド、ベンチマーク

### 7.4 USER（ユーザー入力）

商談ごとに都度入力するデータ。

- 必須: 会社名、業界、企業規模、プレゼン種類、ゴール、プレゼン時間、課題仮説
- 任意: キーパーソン情報、競合状況、特別な要望

### 7.5 入力負荷の最小化

| 戦略 | 効果 |
|------|------|
| CRM連携による自動補完 | 入力項目 70% 削減（10項目 → 3項目） |
| 選択式UIの活用 | テキスト入力の最小化 |
| 過去商談からの引き継ぎ | コンテキストの自動蓄積 |
| インテリジェントデフォルト | 推奨フレームワーク・事例の自動選択 |

## 8. テスト

### 8.1 テストの実行

```bash
# 全テストの実行
pytest

# カバレッジ付き
pytest --cov=src/spa

# 特定のテストファイル
pytest tests/test_models.py
```

### 8.2 リンター・型チェック

```bash
# リンター
ruff check .

# 型チェック
mypy src/
```

## 9. 開発ロードマップ

| フェーズ | 期間 | 内容 |
|---------|------|------|
| Phase 1（MVP） | 2週間 | 顧客情報入力（手動）、SPIN テンプレート（7枚）、PPTX出力 |
| Phase 2 | 2週間 | 4種類のシナリオ対応、フレームワーク選択、スピーカーノート |
| Phase 3 | 2週間 | 勝ちパターン登録、フィードバック収集、パターン適用 |
| Phase 4 | 2週間 | 企業情報自動取得、社内KB連携、複数出力形式 |

## 10. v1 資産の v2 活用マップ

v2 への移行時、v1 の実装資産は以下のように継続活用される。

| v1 資産 | v2 での位置づけ | 変更の程度 |
|---------|---------------|-----------|
| `models.py` | Agent 4（ProposalAgent）がそのまま使用 | ScenarioType の拡張のみ |
| `cli.py` | 将来 Web UI に移行。Phase 1 は CLI を維持 | Web UI 追加時に非推奨化 |
| `llm_client.py` | Agent 9（ContentGeneratorAgent）が継承 | マルチモデル対応を追加 |
| `pptx_generator.py` | Agent 9 の出力モジュールとして継続 | Google Slides / PDF 追加 |
| `data/prompts/slide_generation.yaml` | Agent 4 の SPIN テンプレートとして継続 | 他フレームワーク用を追加 |
| `config/settings.yaml` | 設定の基盤として継続 | 全エージェントの設定を追加 |
