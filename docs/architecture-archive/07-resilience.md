# Resilience Design — 障害耐性設計

> 全企業活動がAI依存の組織における、可用性・障害回復・縮退運転の設計

---

## 前提

Neural Organizationにおいて、システム障害は即座に事業活動の停止を意味する。
従来の企業では「システムが落ちても人間が代行する」ことが可能だったが、
AI-native組織ではその前提が成立しない。

**したがって、障害耐性は最優先の設計要件である。**

---

## 可用性目標

| コンポーネント | 目標可用性 | 最大許容停止時間/月 |
|-------------|----------|-----------------|
| Autonomic Layer | 99.99% | 4.3分 |
| Memory Layer | 99.95% | 21.6分 |
| Cortex Layer | 99.9% | 43.2分 |
| Motor Layer | 99.9% | 43.2分 |
| Limbic Layer | 99.9% | 43.2分 |
| Sensory Layer | 99.5% | 3.6時間 |
| Interface Layer | 99.9% | 43.2分 |
| Output Layer | 99.5% | 3.6時間 |

---

## 障害耐性パターン

### 1. 冗長化（Redundancy）

```
重要度 HIGH のコンポーネント:
┌─────────────┐  ┌─────────────┐
│ Primary     │  │ Standby     │
│ Instance    │  │ Instance    │
│ (Active)    │  │ (Hot Standby)│
└──────┬──────┘  └──────┬──────┘
       │                │
       └───── VIP ──────┘
              │
        Health Check
        (5秒間隔)
```

**冗長化対象:**
| コンポーネント | 冗長方式 | フェイルオーバー時間 |
|-------------|---------|-----------------|
| Lifecycle Manager | Active-Standby | < 10秒 |
| Health Monitor | Active-Active | 0秒（即時） |
| Memory Layer (Redis) | Redis Cluster (3 node) | < 5秒 |
| Memory Layer (Neo4j) | Causal Cluster | < 30秒 |
| Event Bus (Kafka) | Multi-broker (3+) | < 5秒 |
| CEO Agent | Active-Standby | < 30秒 |

### 2. フォールバック（Fallback）

LLMプロバイダーの障害に備え、複数のプロバイダーを用意。

```
Primary:   Anthropic Claude (Opus/Sonnet/Haiku)
Secondary: OpenAI GPT-4o
Tertiary:  Google Gemini

フォールバック条件:
- API応答時間 > 30秒
- エラーレート > 10%
- HTTPステータス 5xx が連続3回

フォールバック手順:
1. Primary へリトライ（1回、exponential backoff）
2. 失敗 → Secondary に切り替え
3. Secondary も失敗 → Tertiary に切り替え
4. 全プロバイダー障害 → タスクをキューに保留 + 人間通知
```

### 3. 回路遮断器（Circuit Breaker）

```
状態遷移:
  CLOSED (正常) → error_count > threshold → OPEN (遮断)
  OPEN → cooldown_period経過 → HALF-OPEN (試行)
  HALF-OPEN → 成功 → CLOSED
  HALF-OPEN → 失敗 → OPEN

設定値:
  外部API呼び出し:
    threshold: 5回連続失敗
    cooldown: 60秒
    half_open_max_calls: 3

  Agent間通信:
    threshold: 10回連続失敗
    cooldown: 30秒
    half_open_max_calls: 5
```

### 4. グレースフルデグラデーション（Graceful Degradation）

全体障害時、優先度に応じて機能を段階的に縮退する。

```
Phase 0: 正常運転（全機能稼働）

Phase 1: 軽微障害（非必須機能の停止）
  停止: Market Sensor, SNS Publisher
  継続: 全コア機能

Phase 2: 中度障害（低優先度タスクの停止）
  停止: P3タスク, Level 2/3学習, メトリクス収集
  継続: P0-P2タスク, Level 1学習, コアモニタリング

Phase 3: 重度障害（必須機能のみ）
  停止: 全P2-P3タスク, 全学習, 大半のExecution Cluster
  継続: P0-P1タスク, Memory Layer, 人間通知, 監査ログ

Phase 4: 緊急停止（保全モード）
  停止: 全Execution
  継続: Autonomic Layer, Memory Layer (read-only), 人間通知
  行動: 全未完了タスクをキューに保存、人間に全権委譲
```

### 5. チェックポイント（Checkpoint）

長時間タスクの中間状態を保存し、障害後の再開を可能にする。

```yaml
チェックポイント戦略:
  短時間タスク (< 5分):
    チェックポイントなし（最初からリトライ）

  中時間タスク (5-30分):
    主要ステップ完了ごとにチェックポイント
    例: 記事作成 → 「アウトライン完成」「初稿完成」「校正完了」

  長時間タスク (> 30分):
    5分間隔で定期チェックポイント
    例: データ分析 → 中間結果を随時保存

チェックポイントデータ:
  {
    "checkpoint_id": "uuid",
    "task_id": "uuid",
    "agent_id": "agent_id",
    "step": "current_step_description",
    "state": { ... },  // 再開に必要な全状態
    "created_at": "ISO-8601"
  }
  保存先: Redis (TTL: タスク完了後24時間)
```

### 6. 監査ログの耐障害性

```
監査ログは組織にとって最も重要なデータの一つ。
障害時でも絶対に失われないように設計する。

Write Path:
  Agent → Local Buffer → Kafka → Primary Store (PostgreSQL)
                                → Secondary Store (S3/GCS)

保証:
  - Write-ahead logging（先行書き込み）
  - At-least-once delivery（最低1回の配信保証）
  - 30日間のKafka保持（再処理可能）
  - S3/GCSへの日次バックアップ

データ保持:
  Hot (PostgreSQL): 90日
  Warm (S3 Standard): 1年
  Cold (S3 Glacier): 7年（法的要件に応じて）
```

---

## 障害対応フロー

```
障害検知 (Health Monitor)
    │
    ├── 自動回復可能？
    │   ├── YES → 自動回復実行 → ログ記録 → 完了
    │   └── NO ↓
    │
    ├── 縮退運転可能？
    │   ├── YES → 該当Phase移行 → 人間通知 → 監視継続
    │   └── NO ↓
    │
    ├── 緊急停止が必要？
    │   ├── YES → Phase 4移行 → 全チャネルで人間に緊急通知
    │   └── NO → Phase 3移行 → 人間に判断を委任
    │
    └── 人間が復旧判断
        ├── 原因特定 → 修正 → 段階的にPhase解除
        └── 長期障害 → 代替手段の確立
```

---

## 障害シミュレーション（Chaos Engineering）

### 定期的な障害テスト

| テスト | 頻度 | 内容 |
|--------|------|------|
| Agent Kill | 週次 | ランダムに1つのAgentを停止し、自動復旧を検証 |
| LLM Provider Outage | 月次 | Primary LLMを遮断し、フォールバックを検証 |
| Memory Layer Failure | 月次 | Redis/Neo4jの部分障害をシミュレート |
| Full Degradation Drill | 四半期 | Phase 1→4 の段階的縮退を実際に実行 |
| Network Partition | 四半期 | Cluster間のネットワーク分断をシミュレート |

### テスト結果の学習

障害テストの結果は Episodic Memory に保存され、
Level 2/3 学習の入力として活用される。

---

## バックアップと復旧

### バックアップ戦略

| データ | 方式 | 頻度 | 保持期間 | RPO |
|--------|------|------|---------|-----|
| Semantic Memory (Neo4j) | フルバックアップ | 日次 | 30日 | 24時間 |
| Episodic Memory (Graphiti) | 増分バックアップ | 6時間 | 30日 | 6時間 |
| Working Memory (Redis) | RDB + AOF | 継続 | 7日 | 1秒 |
| Procedural Memory (PostgreSQL) | WAL + ベースバックアップ | 日次 | 30日 | 数秒 |
| Evaluative Memory (TimescaleDB) | 増分バックアップ | 6時間 | 1年 | 6時間 |
| 監査ログ | 多重書き込み | リアルタイム | 7年 | 0 |
| 設定 | Git管理 | 変更時 | 全履歴 | 0 |

> RPO = Recovery Point Objective（復旧時点目標）

### 復旧手順

```
1. 障害範囲の特定
2. 影響を受けるサービスの特定
3. 最新のバックアップポイントの確認
4. 復旧実行（バックアップからのリストア）
5. データ整合性の検証
6. サービスの段階的再開
7. 全サービスの動作確認
8. 事後レポートの作成（Episodic Memoryに保存）
```

---

*以上で architecture/ の全ドキュメントが完成。*
*次のセクション:* `modules/` — 各モジュールの詳細定義
