# HR Policy Advisor — 実装ガイド

> 本ドキュメントは HR Policy Advisor のセットアップ、API、デプロイ手順を定義する。アーキテクチャは [02_architecture.md](02_architecture.md)、コンセプトは [01_concept.md](01_concept.md) を参照。

## 1. 技術スタック

### 1.1 バックエンド

| カテゴリ | 技術 | 用途 |
|---|---|---|
| Language | Python 3.11+ | アプリケーション全体 |
| Framework | FastAPI | REST API、非同期対応、OpenAPI 自動生成 |
| AI/LLM | Google Generative AI (Gemini) | エージェントの推論エンジン |
| Task Queue | RabbitMQ | エージェント間の非同期メッセージング |
| Cache/State | Redis | セッション管理、ワークフロー状態（作業記憶） |
| Database | PostgreSQL | リレーショナルデータ（長期記憶、評価記憶） |
| Secrets | HashiCorp Vault | API キー等の安全な管理 |
| Validation | Pydantic v2 | データモデル、設定管理 |
| Logging | structlog | 構造化ログ出力 |

### 1.2 インフラストラクチャ

| カテゴリ | 技術 |
|---|---|
| Container | Docker / Docker Compose |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes（Phase 2） |

### 1.3 開発ツール

| カテゴリ | 技術 |
|---|---|
| Linter | ruff |
| Type Check | mypy |
| Test | pytest / pytest-asyncio / pytest-cov |
| Build | hatchling |

## 2. プロジェクト構成

```
agentic-ai-hr/
├── 00_overview.md              # プロジェクト概要
├── 01_concept.md               # コンセプト設計
├── 02_architecture.md          # アーキテクチャ
├── 03_implementation.md        # 実装ガイド（本ドキュメント）
├── README.md                   # 英語 README
├── pyproject.toml              # Python パッケージ設定
├── Dockerfile                  # コンテナビルド定義
├── docker-compose.yml          # ローカル開発環境
├── .env.example                # 環境変数テンプレート
├── docs/                       # 詳細設計ドキュメント
│   ├── design-v2-neural-org-aligned.md
│   ├── 00_overview/
│   ├── 01_requirements/
│   │   ├── functional/
│   │   ├── non-functional/
│   │   ├── user-stories/
│   │   └── plan.md
│   ├── 02_design/
│   │   ├── agents/
│   │   ├── domain/
│   │   ├── hitl/
│   │   └── ui/
│   ├── 03_api/
│   └── 04_operations/
├── src/                        # アプリケーションソースコード
│   ├── main.py                 # FastAPI エントリーポイント
│   ├── config/
│   │   └── settings.py         # 設定管理（pydantic-settings）
│   ├── core/
│   │   ├── agent_base.py       # エージェント基底クラス
│   │   ├── orchestrator.py     # ワークフローオーケストレーター
│   │   └── hitl_manager.py     # HITL 管理
│   ├── agents/                 # 各エージェント実装
│   │   ├── context_collector.py
│   │   ├── talent_profile_generator.py
│   │   ├── grading_designer.py
│   │   ├── evaluation_designer.py
│   │   ├── compensation_designer.py
│   │   ├── policy_analyst.py
│   │   ├── compliance_checker.py
│   │   ├── industry_researcher.py
│   │   ├── recommendation_engine.py
│   │   └── document_generator.py
│   ├── domain/
│   │   ├── models/             # ドメインモデル
│   │   │   ├── company.py
│   │   │   ├── grading.py
│   │   │   ├── evaluation.py
│   │   │   └── compensation.py
│   │   ├── repositories/
│   │   └── services/
│   ├── api/
│   │   ├── routes/             # API エンドポイント
│   │   │   ├── companies.py
│   │   │   ├── policies.py
│   │   │   └── reviews.py
│   │   ├── schemas/
│   │   └── middleware/
│   ├── hitl/                   # HITL ワークフロー
│   │   ├── review_queue.py
│   │   ├── approval_workflow.py
│   │   └── feedback_handler.py
│   ├── services/               # インフラサービスクライアント
│   │   ├── redis_client.py
│   │   ├── rabbitmq_client.py
│   │   ├── storage_client.py
│   │   └── vault_client.py
│   └── utils/
│       └── logging.py
├── knowledge/                  # Knowledge Layer（v2 で拡充予定）
│   ├── industry/
│   ├── case-studies/
│   └── regulations/
│       └── labor-standards.md
├── templates/                  # テンプレートファイル
│   ├── grading/
│   ├── evaluation/
│   └── compensation/
├── memory/                     # エージェントの作業ログ
└── tests/
    ├── conftest.py
    ├── unit/
    │   ├── test_domain.py
    │   ├── test_agents.py
    │   └── test_hitl.py
    ├── integration/
    └── e2e/
```

## 3. セットアップ

### 3.1 前提条件

- Python 3.11+
- Docker / Docker Compose
- Gemini API キー

### 3.2 環境構築

```bash
# リポジトリのクローン
git clone <repository-url>
cd agentic-ai-hr

# 環境変数の設定
cp .env.example .env
# .env ファイルを編集して GEMINI_API_KEY を設定

# 依存関係のインストール（開発用）
pip install -e ".[dev]"

# インフラサービスの起動
docker-compose up -d redis rabbitmq postgres vault

# アプリケーションの起動
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3.3 Docker Compose による起動

```bash
# 全サービス一括起動
docker-compose up -d

# ログ確認
docker-compose logs -f app

# サービス停止
docker-compose down
```

### 3.4 環境変数

| 変数 | デフォルト | 説明 |
|---|---|---|
| `ENV` | development | 実行環境（development / staging / production） |
| `GEMINI_API_KEY` | - | Google Gemini API キー（必須） |
| `GEMINI_MODEL` | gemini-2.0-flash | 使用する Gemini モデル |
| `REDIS_URL` | redis://localhost:6379/0 | Redis 接続 URL |
| `RABBITMQ_URL` | amqp://guest:guest@localhost:5672/ | RabbitMQ 接続 URL |
| `DATABASE_URL` | postgresql+asyncpg://... | PostgreSQL 接続 URL |
| `VAULT_ADDR` | http://localhost:8200 | Vault アドレス |
| `VAULT_TOKEN` | dev-token | Vault トークン |
| `HITL_DEFAULT_TIMEOUT_HOURS` | 72 | HITL デフォルトタイムアウト |
| `HITL_CRITICAL_TIMEOUT_HOURS` | 48 | HITL クリティカルタイムアウト |
| `LOG_LEVEL` | INFO | ログレベル |
| `LOG_FORMAT` | json | ログフォーマット（json / console） |

## 4. API ドキュメント

### 4.1 エンドポイント一覧

開発環境では Swagger UI（`/docs`）と ReDoc（`/redoc`）が利用可能。

**ヘルスチェック**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | ヘルスチェック |
| GET | `/` | ルートエンドポイント |

**Companies API**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/companies` | 企業登録 |
| GET | `/api/v1/companies/{id}` | 企業詳細取得 |
| PUT | `/api/v1/companies/{id}` | 企業情報更新 |
| POST | `/api/v1/companies/{id}/analyze` | 現状分析開始 |
| GET | `/api/v1/companies/{id}/analysis` | 現状分析結果取得 |

**Ideal Talent Profile API**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/companies/{id}/talent-profile` | 求める人材像取得 |
| POST | `/api/v1/companies/{id}/talent-profile/generate` | 求める人材像生成 |
| PUT | `/api/v1/companies/{id}/talent-profile` | 求める人材像更新 |

**Policies API**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/companies/{id}/policies` | 制度一覧取得 |
| POST | `/api/v1/companies/{id}/policies/grading` | 等級制度案生成 |
| POST | `/api/v1/companies/{id}/policies/evaluation` | 評価制度案生成 |
| POST | `/api/v1/companies/{id}/policies/compensation` | 報酬制度案生成 |
| GET | `/api/v1/policies/{id}` | 制度詳細取得 |
| PUT | `/api/v1/policies/{id}` | 制度更新 |
| GET | `/api/v1/policies/grading/{id}/competencies` | コンピテンシー一覧 |
| PUT | `/api/v1/policies/grading/{id}/competencies` | コンピテンシー更新 |
| GET | `/api/v1/policies/grading/{id}/requirements` | 卒業要件一覧 |
| PUT | `/api/v1/policies/grading/{id}/requirements` | 卒業要件更新 |

**Reviews API (HITL)**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/reviews` | レビュータスク一覧 |
| GET | `/api/v1/reviews/{id}` | レビュー詳細取得 |
| POST | `/api/v1/reviews/{id}/approve` | 承認 |
| POST | `/api/v1/reviews/{id}/reject` | 差し戻し |
| POST | `/api/v1/reviews/{id}/feedback` | フィードバック送信 |

**Documents API**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/companies/{id}/documents/generate` | ドキュメント生成 |
| GET | `/api/v1/documents/{id}` | ドキュメント取得 |
| GET | `/api/v1/documents/{id}/download` | ダウンロード |

### 4.2 共有記憶基盤 API（v2）

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v2/knowledge/grading/{company_id}` | 等級定義取得 |
| GET | `/api/v2/knowledge/competencies/{company_id}` | コンピテンシー定義取得 |
| GET | `/api/v2/metrics/evaluations/{company_id}` | 評価結果データ取得 |
| POST | `/api/v2/events/policy-updated` | 制度更新イベント発行 |

## 5. 開発ガイドライン

### 5.1 コーディング規約

| 項目 | 規約 |
|---|---|
| コードスタイル | ruff（target-version: py311, line-length: 100） |
| 型ヒント | 必須（mypy strict mode） |
| クラス命名 | PascalCase（例: `PolicyAnalyst`） |
| 関数/メソッド命名 | snake_case（例: `analyze_company`） |
| 定数命名 | UPPER_SNAKE_CASE（例: `MAX_RETRY_COUNT`） |
| ファイル命名 | snake_case（例: `policy_analyst.py`） |
| エージェント命名 | `{Role}Agent`（例: `ComplianceCheckerAgent`） |

### 5.2 テスト

```bash
# ユニットテスト実行
pytest tests/unit/ -v

# 全テスト実行（カバレッジ付き）
pytest --cov=src --cov-report=html

# 特定マーカーのテスト実行
pytest -m unit
pytest -m integration
```

テストカバレッジ目標: 70% 以上

### 5.3 品質チェック

```bash
# Lint チェック
ruff check src/ tests/

# フォーマット
ruff format src/ tests/

# 型チェック
mypy src/
```

## 6. デプロイメント

### 6.1 Docker ビルド

```bash
# イメージビルド
docker build -t hr-policy-advisor:latest .

# 本番用実行
docker run -d \
  --name hr-policy-advisor \
  -p 8000:8000 \
  -e ENV=production \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  -e REDIS_URL=$REDIS_URL \
  -e DATABASE_URL=$DATABASE_URL \
  hr-policy-advisor:latest
```

### 6.2 インフラ構成

| サービス | イメージ | ポート | 永続化 |
|---|---|---|---|
| app | hr-policy-advisor:latest | 8000 | - |
| redis | redis:7-alpine | 6379 | redis_data volume |
| rabbitmq | rabbitmq:3-management-alpine | 5672, 15672 | rabbitmq_data volume |
| postgres | postgres:16-alpine | 5432 | postgres_data volume |
| vault | hashicorp/vault:1.15 | 8200 | - |

### 6.3 ヘルスチェック

各サービスには Docker ヘルスチェックが設定されている。

| サービス | チェック方法 | 間隔 |
|---|---|---|
| app | `GET /health` | - |
| redis | `redis-cli ping` | 10 秒 |
| rabbitmq | `rabbitmq-diagnostics check_running` | 10 秒 |
| postgres | `pg_isready -U postgres` | 10 秒 |
| vault | `vault status` | 10 秒 |

## 7. 運用

### 7.1 ログ

構造化ログ（JSON 形式）を structlog で出力する。

```json
{
  "event": "workflow_started",
  "workflow_id": "abc-123",
  "company_id": "xyz-456",
  "timestamp": "2025-01-15T10:30:00Z",
  "level": "info"
}
```

### 7.2 監視指標

| 指標 | 説明 |
|---|---|
| ワークフロー完了率 | 開始されたワークフローのうち、正常完了した割合 |
| HITL 応答時間 | レビュータスク作成から人間の判断までの時間 |
| エージェント実行時間 | 各エージェントの処理にかかった時間 |
| LLM API エラー率 | Gemini API 呼び出しの失敗率 |
| HITL 差し戻し率 | 差し戻しが発生した割合（品質の指標） |

### 7.3 エラーハンドリング

| エラー種別 | 対応 |
|---|---|
| LLM API タイムアウト | 最大 3 回リトライ（エクスポネンシャルバックオフ） |
| LLM API レート制限 | レートリミッター + キュー待ち |
| Redis 接続エラー | 警告ログ出力、サービス起動は継続 |
| RabbitMQ 接続エラー | 警告ログ出力、サービス起動は継続 |
| HITL タイムアウト | デフォルト 72 時間、クリティカル 48 時間でタイムアウト |
