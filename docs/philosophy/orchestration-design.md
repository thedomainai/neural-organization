# Orchestration の詳細設計

## 論点

5 つのレイヤー（Perception, Understanding, Reasoning, Execution, Reflection）の実行フローを、どのように統率し、リソースを最適配分し、優先度を管理し、エラーから回復し、パフォーマンスを最適化するべきか。

## Orchestration の本質

### 役割: HOW（どのように実行するか）

各レイヤーは「何を変換するか」を定義する：
- Perception: 現実世界 → シグナル
- Understanding: シグナル → 世界モデル
- Reasoning: 世界モデル × Purpose → 行動計画
- Execution: 行動計画 → アウトプット
- Reflection: アウトプット + 結果 → 学習

しかし、「いつ・どの順序で・どのリソースで・どう優先順位をつけて実行するか」は定義されていない。これを決定するのが Orchestration である。

### Orchestration の設計原理

**原理 1: レイヤーは疎結合である**

各レイヤーは他のレイヤーに直接依存しない。Orchestration が層間の接続を管理する。

**原理 2: フローは動的に構成される**

固定されたワークフローではなく、状況に応じて実行フローを動的に決定する。

**原理 3: リソースは有限であり、最適配分される**

計算リソース、API コスト、時間は有限である。Orchestration はこれらを最も価値の高いタスクに配分する。

**原理 4: 複数のタスクが並行実行される**

組織は同時に多数の活動を行う。Orchestration はこれらの優先度を管理し、適切に並行実行する。

**原理 5: 失敗は想定され、自律的に回復される**

エラーは不可避である。Orchestration はリトライ・フォールバック・エスカレーションを自律的に実行する。

### 学術的基盤

Orchestration の設計は、サイバネティクス・複雑系科学・レジリエンスエンジニアリングの原理に基づいている。

**サイバネティクスとフィードバック制御**: Wiener (1948) のサイバネティクスは、フィードバックによるシステム制御の基本理論を確立した。Orchestration のフロー制御 — 層間のループバック、品質チェックによる再実行、動的な優先度調整 — はサイバネティクスの直接的な実装である。システムの出力を観測し、目標との差分に基づいて入力を調整するフィードバックループが、Orchestration の 4 つの機能すべてに埋め込まれている。

**必要多様性の法則**: Ashby (1956) の「必要多様性の法則」は、「多様性のみが多様性を吸収しうる」と述べる。組織が直面する状況の多様性（顧客の多様なニーズ、予測不能な障害、変動するリソース）に対処するには、Orchestration 自身が十分な多様性（複数のフロー制御パターン、フォールバック戦略、動的リソース配分）を持つ必要がある。原理 2（動的フロー構成）と原理 3（最適リソース配分）は、この法則の実装である。

## Orchestration の 4 つの機能

### 1. フロー制御

**層間の実行順序・並列実行・スキップ・ループバックを制御する**

#### 基本フロー

```yaml
basic_flow:
  standard_pipeline:
    sequence:
      - layer: "Perception"
        output: "signals"
      - layer: "Understanding"
        input: "signals"
        output: "world_model"
      - layer: "Reasoning"
        input: ["world_model", "purpose"]
        output: "action_plan"
      - layer: "Execution"
        input: "action_plan"
        output: "artifacts"
      - layer: "Reflection"
        input: ["artifacts", "outcomes"]
        output: "learnings"
```

#### 並列実行

```yaml
parallel_execution:
  scenario: "複数の顧客へのアウトリーチを同時実行"

  tasks:
    - task_id: "outreach_customer_1"
      layers: [Reasoning, Execution]
      priority: "high"

    - task_id: "outreach_customer_2"
      layers: [Reasoning, Execution]
      priority: "high"

    - task_id: "outreach_customer_3"
      layers: [Reasoning, Execution]
      priority: "medium"

  orchestration:
    strategy: "parallel"
    max_concurrent: 10
    reasoning: "タスク間に依存関係がないため、並行実行で効率化"
```

#### ループバック

```yaml
loopback_scenario:
  scenario: "Execution の品質チェックで不合格 → Reasoning に戻る"

  flow:
    - step_1: "Reasoning が行動計画を生成"
    - step_2: "Execution がアウトプットを生成"
    - step_3: "品質チェック: 不合格"
    - step_4: "Reasoning にフィードバック（より具体的な指示が必要）"
    - step_5: "Reasoning が再計画"
    - step_6: "Execution が再生成"
    - step_7: "品質チェック: 合格"

  max_loops: 3
  escalation: "3 回ループしても合格しない場合、人間にエスカレーション"
```

#### スキップ

```yaml
skip_scenario:
  scenario: "Understanding の世界モデルが十分に新しい場合、再構築をスキップ"

  decision:
    condition: "last_update_timestamp < 1 hour ago"
    action: "Understanding をスキップし、既存の世界モデルを使用"
    reasoning: "リソース節約。世界モデルは頻繁に変化しない"
```

#### 条件分岐

```yaml
conditional_flow:
  scenario: "Governance Gate の結果に応じて分岐"

  flow:
    - step: "Reasoning が行動計画を生成"
    - step: "Governance Gate 評価"
      branches:
        - condition: "approved"
          next: "Execution"

        - condition: "rejected"
          next: "Reasoning (代替案を生成)"

        - condition: "modification_requested"
          next: "Reasoning (修正を反映)"

        - condition: "escalated"
          next: "human_approval"
```

### 2. リソース配分

**計算資源・時間・API コストを各層に最適配分する**

#### リソースの種類

```yaml
resource_types:
  computational:
    - cpu_time
    - memory
    - gpu_time (大規模モデル実行時)

  financial:
    - api_costs (LLM API, 外部 API)
    - data_costs (データストレージ、転送)

  temporal:
    - wall_clock_time
    - deadline (タスクの期限)

  human_attention:
    - governance_approval_capacity
    - review_bandwidth
```

#### リソース配分の戦略

```yaml
resource_allocation_strategy:
  priority_based:
    description: "優先度の高いタスクに多くのリソースを配分"
    example:
      - task: "critical_customer_churn_prevention"
        priority: "critical"
        allocated_budget: "$50"
        reasoning: "顧客維持は最優先"

      - task: "routine_weekly_report"
        priority: "low"
        allocated_budget: "$2"
        reasoning: "定型業務は最小リソース"

  deadline_aware:
    description: "期限に間に合わせるためにリソースを配分"
    example:
      task: "quarterly_board_report"
      deadline: "2024-02-15 17:00"
      current_time: "2024-02-15 14:00"
      remaining: "3 hours"
      strategy: "高速だが高コストの LLM を使用"

  budget_constrained:
    description: "予算制約内で最大の価値を生む"
    example:
      daily_budget: "$100"
      tasks_queue: 50
      strategy: "タスクを価値/コストでランク付け、上位から実行"
```

#### API コストの管理

```yaml
api_cost_management:
  llm_model_selection:
    task_complexity:
      simple: "use haiku ($0.25 / 1M tokens)"
      medium: "use sonnet ($3 / 1M tokens)"
      complex: "use opus ($15 / 1M tokens)"

    example:
      - task: "メールの文法チェック"
        complexity: "simple"
        model: "haiku"
        cost: "$0.001"

      - task: "戦略的判断の生成"
        complexity: "complex"
        model: "opus"
        cost: "$0.50"

  rate_limiting:
    description: "API のレート制限を超えないように調整"
    example:
      openai_limit: "10K requests / minute"
      current_rate: "8K requests / minute"
      action: "新規タスクを一時的に待機"
```

### 3. 優先度管理

**複数の同時進行タスクの優先度を動的に管理する**

#### 優先度の決定

```yaml
priority_calculation:
  factors:
    urgency:
      weight: 0.30
      examples:
        - "deadline が 1 時間以内: 1.0"
        - "deadline が 1 日以内: 0.7"
        - "deadline なし: 0.3"

    impact:
      weight: 0.35
      examples:
        - "顧客解約防止: 1.0"
        - "売上に直接影響: 0.8"
        - "内部プロセス改善: 0.4"

    purpose_alignment:
      weight: 0.25
      examples:
        - "Purpose の Why と直接関連: 1.0"
        - "戦略目標に貢献: 0.7"
        - "定型業務: 0.3"

    resource_efficiency:
      weight: 0.10
      examples:
        - "低コスト・高効果: 1.0"
        - "中コスト・中効果: 0.5"
        - "高コスト・低効果: 0.2"

  formula: |
    priority = (urgency * 0.30) +
               (impact * 0.35) +
               (purpose_alignment * 0.25) +
               (resource_efficiency * 0.10)

  example:
    task: "critical_customer_outreach"
    urgency: 0.9 (deadline: 今日中)
    impact: 1.0 (解約防止)
    purpose_alignment: 1.0 (顧客中心主義)
    resource_efficiency: 0.8 (低コスト)
    priority: 0.945 (最高優先)
```

#### 優先度の動的調整

```yaml
dynamic_priority_adjustment:
  scenario: "新たな緊急タスクが発生"

  before:
    executing:
      - task: "weekly_report"
        priority: 0.40

  event: "critical_customer_issue"
  new_task:
    task: "customer_escalation"
    priority: 0.95

  action:
    - "weekly_report を一時停止"
    - "customer_escalation を即座に実行"
    - "完了後、weekly_report を再開"
```

#### タスクキューの管理

```yaml
task_queue:
  structure:
    - queue_name: "critical"
      priority_range: [0.90, 1.00]
      max_wait_time: "5 minutes"
      tasks: 3

    - queue_name: "high"
      priority_range: [0.70, 0.89]
      max_wait_time: "30 minutes"
      tasks: 12

    - queue_name: "medium"
      priority_range: [0.50, 0.69]
      max_wait_time: "4 hours"
      tasks: 35

    - queue_name: "low"
      priority_range: [0.00, 0.49]
      max_wait_time: "24 hours"
      tasks: 50

  scheduling_strategy:
    - "critical キューを優先的に処理"
    - "各キューから round-robin で取得（starvation 防止）"
    - "max_wait_time を超えたタスクは優先度を引き上げ"
```

### 4. エラー回復

**層の失敗時のリトライ・フォールバック・エスカレーションを制御する**

#### エラーの分類

```yaml
error_categories:
  transient_errors:
    description: "一時的なエラー（リトライで回復可能）"
    examples:
      - "API レート制限"
      - "ネットワークタイムアウト"
      - "一時的なサービス停止"
    strategy: "exponential backoff でリトライ"

  permanent_errors:
    description: "永続的なエラー（リトライしても無意味）"
    examples:
      - "認証エラー"
      - "データの不整合"
      - "不正なリクエスト"
    strategy: "即座にエスカレーション"

  quality_errors:
    description: "品質基準を満たさない"
    examples:
      - "生成されたコンテンツが基準以下"
      - "予測の信頼度が低い"
    strategy: "パラメータ調整して再生成"
```

#### リトライ戦略

```yaml
retry_strategy:
  exponential_backoff:
    initial_delay: "1 second"
    max_delay: "60 seconds"
    max_retries: 5
    backoff_multiplier: 2

    example:
      attempt_1: "即座に実行"
      attempt_2: "1 秒後"
      attempt_3: "2 秒後"
      attempt_4: "4 秒後"
      attempt_5: "8 秒後"
      attempt_6: "16 秒後"

  circuit_breaker:
    description: "連続失敗時にサービスを一時的に遮断"
    threshold: "5 連続失敗"
    cooldown: "5 minutes"
    reasoning: "外部サービスが完全にダウンしている可能性が高い"
```

#### Graceful Degradation の原理（原理3）

Orchestration のエラー回復は、不変原理「優雅な劣化」（[invariant-principles.md](../invariant-principles.md) 原理3）に基づいて設計される。

**原理3 の形式的制約**:
```
For every capability c:
  |resolve_chain(c)| >= 2
  resolve_chain(c)[-1] = system_core_capability
```

この制約は以下を保証する：
- すべてのケイパビリティは少なくとも2つの実行経路を持つ（primary + fallback）
- フォールバックチェインの末尾は常にシステム自身の基本能力である
- 任意の単一コンポーネントの除去は、システムを停止させず、品質の低下のみをもたらす

**フォールバックチェインの設計原則**:

1. **段階的な品質低下**: フォールバックは品質の段階的な低下を実現する。突然の機能停止ではなく、徐々に degraded mode に移行する

2. **最終手段の保証**: チェインの最後は必ずシステム自身の基本能力（テンプレートベース、ルールベース、または人間へのエスカレーション）で終端する

3. **コスト-品質のトレードオフ**: フォールバックは通常、コストの低下と品質の低下を同時にもたらす。これにより障害時のコスト爆発を防ぐ

4. **独立した障害モード**: 各フォールバックリソースは独立した障害モードを持つべき。同じ依存関係（例: 同じAPIプロバイダー）を持つリソースをチェインに並べない

**Layer 3 Capability Registry との統合**:

Orchestration のフォールバック戦略は、Layer 3 の Capability Registry（[layer3-execution-design.md](layer3-execution-design.md) Capability Registry）の `resolve_chain` を参照する。Orchestration はこのチェインを実行時に解釈し、primary リソースの失敗時に自動的に次のリソースを試行する。

#### フォールバック

```yaml
fallback_strategy:
  scenario: "高性能 LLM が利用不可"

  primary: "opus (最高品質)"
  fallback_1: "sonnet (中品質)"
  fallback_2: "haiku (基本品質)"
  fallback_3: "テンプレートベース（最低品質）"

  decision_flow:
    - try: "opus"
      if_fail: "sonnet"
    - try: "sonnet"
      if_fail: "haiku"
    - try: "haiku"
      if_fail: "template"
    - try: "template"
      if_fail: "human_escalation"
```

#### エスカレーション

```yaml
escalation_strategy:
  level_1_auto_recovery:
    condition: "transient error"
    action: "自動リトライ"

  level_2_degraded_mode:
    condition: "primary service unavailable"
    action: "フォールバックサービスに切り替え"

  level_3_human_notification:
    condition: "複数の失敗"
    action: "人間に通知（ただし自動復旧を試行中）"

  level_4_human_intervention:
    condition: "すべての復旧策が失敗"
    action: "人間の介入を要求"
```

## 実行モデル

### イベント駆動アーキテクチャ

```yaml
event_driven_model:
  description: "イベントをトリガーにレイヤーが起動する"

  events:
    - event: "new_signal_detected"
      trigger: "Perception"
      next: "Understanding"

    - event: "world_model_updated"
      trigger: "Understanding"
      next: "Reasoning (if gap detected)"

    - event: "action_plan_generated"
      trigger: "Reasoning"
      next: "Governance Gate → Execution"

    - event: "artifact_delivered"
      trigger: "Execution"
      next: "Reflection (when outcome observed)"

  benefits:
    - "非同期実行が可能"
    - "スケーラビリティが高い"
    - "レイヤー間の疎結合"
```

### ストリーム処理

```yaml
stream_processing:
  scenario: "リアルタイムの顧客行動データを処理"

  stream:
    source: "product_usage_events"
    rate: "1000 events / second"

  processing:
    - stage: "Perception"
      operation: "シグナル検出（異常、トレンド）"
      output: "filtered_signals (10 signals / second)"

    - stage: "Understanding"
      operation: "世界モデル更新（バッチ処理）"
      frequency: "5 minutes"

    - stage: "Reasoning"
      operation: "リスク検出時のみ起動"
      frequency: "as needed"
```

### バッチ処理

```yaml
batch_processing:
  scenario: "夜間に大規模な分析を実行"

  schedule:
    frequency: "daily"
    time: "2:00 AM"

  tasks:
    - task: "全顧客の健全性スコア再計算"
      layer: "Understanding"
      duration: "30 minutes"

    - task: "週次レポート生成"
      layer: "Execution"
      duration: "10 minutes"

    - task: "Memory の最適化"
      layer: "Reflection"
      duration: "20 minutes"
```

## パフォーマンス最適化

### キャッシング

```yaml
caching_strategy:
  layer0_perception:
    cache: "頻繁にアクセスされるデータソース"
    ttl: "1 hour"
    example: "顧客マスタデータ"

  layer1_understanding:
    cache: "世界モデルのスナップショット"
    ttl: "30 minutes"
    reasoning: "世界モデルは頻繁に変化しない"

  layer2_reasoning:
    cache: "類似した状況での判断"
    ttl: "1 day"
    example: "同じタイプの顧客アウトリーチ計画"
```

### 並列化

```yaml
parallelization:
  scenario: "100 社の顧客に同時にアウトリーチ"

  sequential_execution:
    time: "100 customers × 30 seconds = 50 minutes"

  parallel_execution:
    workers: 10
    time: "100 customers / 10 workers × 30 seconds = 5 minutes"
    speedup: "10x"
```

### プリエンプティブ実行

```yaml
preemptive_execution:
  scenario: "Reasoning の結果を予測して、Execution を事前開始"

  traditional:
    flow: "Reasoning 完了 → Execution 開始"
    latency: "Reasoning time + Execution time"

  preemptive:
    flow: "Reasoning 中 → 高確率の選択肢を事前に Execution 準備"
    latency: "max(Reasoning time, Execution time)"
    risk: "予測が外れた場合、無駄な計算"
```

## Orchestration の監視

### メトリクス

```yaml
orchestration_metrics:
  throughput:
    - "tasks_completed_per_hour: 150"
    - "events_processed_per_second: 45"

  latency:
    - "avg_task_completion_time: 12 seconds"
    - "p95_task_completion_time: 45 seconds"

  resource_utilization:
    - "cpu_utilization: 65%"
    - "api_budget_used: $45 / $100"

  error_rate:
    - "transient_error_rate: 2%"
    - "permanent_error_rate: 0.1%"

  queue_depth:
    - "critical_queue: 0"
    - "high_queue: 5"
    - "medium_queue: 20"
    - "low_queue: 35"
```

## Evolution Engine — Orchestration の自己改善

### 設計の必要性

Orchestration のパラメータ（優先度の重み付け、リソース配分戦略、フロー制御パターン、フォールバックチェイン）は、初期設定時の仮説に基づいている。しかし、実際の運用を通じて、これらの仮説が最適でないことが判明する可能性が高い。

Evolution Engine は、不変原理「設定のデータ化」（[invariant-principles.md](../invariant-principles.md) 原理5）の実装であり、Orchestration の設定を Execution Trace（[layer4-reflection-design.md](layer4-reflection-design.md) ステップ0）から自動的に改善する。

### 学術的基盤

Evolution Engine は、複数の学術的系譜が交差する設計である。

**PDCA/PDSA サイクル**: Deming の継続的改善サイクル（Plan-Do-Check/Study-Act）は、Evolution Engine の進化サイクル（Collect → Analyze → Generate → Review → Apply → Observe）と構造的に対応する。Evolution Engine はこのサイクルをデータ駆動で自動化したものである。

**レジリエンスの 4 つの礎石**: Hollnagel (2011) はレジリエントなシステムの能力を 4 つに分類した — Respond（応答する）、Monitor（監視する）、Anticipate（予見する）、Learn（学習する）。Evolution Engine は特に Learn の実装であり、過去の実行トレースからパターンを抽出し、将来の設定を改善する。Orchestration 全体で見ると、フロー制御が Respond、メトリクス監視が Monitor、プリエンプティブ実行が Anticipate、Evolution Engine が Learn に対応する。

**複雑適応系**: Holland (1995) は複雑適応系の特性として、ビルディングブロック（再利用可能な基本要素の組み合わせ）、適応（環境からのフィードバックによるルール変更）、内部モデル（環境の予測モデル）を挙げた。Evolution Engine はこれらすべてを実装する — Capability Registry のリソースがビルディングブロック、進化サイクルによるパラメータ調整が適応、5 つの分析シグナルパターンが内部モデルに相当する。

**秩序の縁**: Kauffman (1993) は、最適な適応は秩序とカオスの境界（edge of chaos）で生じることを示した。Evolution Engine の Trust Gradient（段階的自律化）は、完全な人間制御（秩序）と完全な自律（カオス）の間で動的に均衡点を探索する設計であり、秩序の縁における適応の実装と見なせる。

### 進化サイクル

```yaml
evolution_cycle:
  step_1_collect:
    description: "実行トレースを蓄積"
    minimum_data: "能力あたり最低 20 イベント"
    sources:
      - "execution_traces.jsonl"
      - "orchestration_metrics"
      - "human_feedback"

  step_2_analyze:
    description: "パターンとアノマリーを検出"
    analyses:
      - "能力別成功率"
      - "リソース別レイテンシ"
      - "コスト分析"
      - "フォールバック頻度"
      - "優先度重み付けの妥当性"

  step_3_generate:
    description: "改善提案を生成"
    output: "evolution_proposal.yaml"
    includes:
      - "変更内容"
      - "エビデンス"
      - "期待される効果"
      - "ロールバック手順"

  step_4_review:
    description: "人間が提案をレビュー"
    options:
      - "approve: 即座に適用"
      - "reject: 却下"
      - "modify: 修正して適用"
    auto_apply: false  # 初期は人間承認必須

  step_5_apply:
    description: "設定を更新"
    targets:
      - "orchestration_config.yaml"
      - "capability_registry.yaml (layer3)"
    backup: "変更前の設定をバックアップ"

  step_6_observe:
    description: "変更の影響を監視"
    duration: "次の 20 イベント"
    auto_rollback_trigger: "成功率が変更前を 10% 以上下回った場合"
```

### 5つの分析シグナルパターン

#### Signal 1: 不要な複雑性

```yaml
signal_1_unnecessary_complexity:
  detection:
    condition: "特定のフロー制御パターンが頻繁にスキップされる"
    threshold: "80% の実行でスキップ"

  example:
    pattern: "Understanding の再構築"
    skip_rate: 0.85
    reasoning: "世界モデルが十分に新しい場合、再構築不要"

  proposal:
    action: "スキップ条件を緩和（1 hour → 4 hours）"
    expected_impact:
      resource_savings: "15% の計算リソース削減"
      quality_risk: "low（世界モデルは 4 時間で大きく変化しない）"
```

#### Signal 2: リソース割り当ての不均衡

```yaml
signal_2_resource_imbalance:
  detection:
    condition: "特定のタスクが常にリソース不足で遅延"
    threshold: "30% 以上のタスクが max_wait_time を超過"

  example:
    queue: "high_priority"
    wait_time_exceeded_rate: 0.35
    reason: "優先度計算で impact の重みが高すぎる"

  proposal:
    action: "優先度重み付けの調整"
    change:
      before: "impact: 0.35, urgency: 0.30"
      after: "impact: 0.30, urgency: 0.35"
    expected_impact:
      wait_time_reduction: "20%"
      quality_risk: "low"
```

#### Signal 3: フォールバック頻度の異常

```yaml
signal_3_fallback_anomaly:
  detection:
    condition: "primary resource の失敗率が高く、常に fallback が使われている"
    threshold: "fallback 使用率 > 40%"

  example:
    capability: "code_generation"
    primary: "code_generation_llm_specialized"
    primary_failure_rate: 0.55
    fallback: "general_purpose_llm"
    fallback_success_rate: 0.85

  proposal:
    action: "resolve_chain の再順序付け"
    change: "general_purpose_llm を primary に昇格"
    expected_impact:
      success_rate_improvement: "+15%"
      cost_reduction: "$0.04 per invocation"
```

#### Signal 4: 新しいパターンの出現

```yaml
signal_4_emerging_pattern:
  detection:
    condition: "特定の種類のタスクが急増している"
    threshold: "過去 30 日で 3 倍以上"

  example:
    task_type: "customer_churn_analysis"
    volume_increase: "5 → 18 per day"
    current_handling: "汎用的な data_analysis capability"

  proposal:
    action: "新しい専用 capability を作成"
    new_capability: "churn_prediction"
    rationale: "専用リソースで品質向上とコスト削減"
    expected_impact:
      quality_improvement: "+20%"
      cost_reduction: "15%"
```

#### Signal 5: 優先度の逆転

```yaml
signal_5_priority_inversion:
  detection:
    condition: "低優先度タスクが高優先度タスクより良い結果を出している"
    threshold: "成功率で 15% 以上の差"

  example:
    low_priority_task: "routine_weekly_report"
    low_priority_success_rate: 0.95

    high_priority_task: "strategic_decision_support"
    high_priority_success_rate: 0.70

  proposal:
    action: "priority 計算の purpose_alignment 重みを引き上げ"
    reasoning: "Purpose 整合性が実際の成功率に強く相関"
    change:
      before: "purpose_alignment: 0.25"
      after: "purpose_alignment: 0.35"
```

### Evolution Proposal のフォーマット

```yaml
evolution_proposal:
  id: "evo_20260222_001"
  timestamp: "2026-02-22T15:30:00Z"
  trigger: "signal_3_fallback_anomaly"

  summary: |
    code_generation の primary resource が高頻度で失敗。
    fallback (general_purpose_llm) の方が成功率が高い。
    resolve_chain を再順序付けして fallback を primary に昇格する。

  evidence:
    traces_analyzed: 47
    period: "2026-02-01 to 2026-02-22"
    metrics:
      primary_failure_rate: 0.55
      fallback_success_rate: 0.85
      current_average_cost: 0.08
      fallback_average_cost: 0.04

  change:
    file: "layer3/capability_registry.yaml"
    capability: "code_generation"
    action: "reorder_resolve_chain"

    before:
      resolve_chain:
        - resource: "code_generation_llm_specialized"
          confidence: 0.92
        - resource: "general_purpose_llm"
          confidence: 0.70

    after:
      resolve_chain:
        - resource: "general_purpose_llm"
          confidence: 0.85
        - resource: "code_generation_llm_specialized"
          confidence: 0.55

  expected_impact:
    success_rate: "+15% (0.70 → 0.85)"
    cost_per_invocation: "-50% ($0.08 → $0.04)"
    latency: "-38% (4500ms → 2800ms)"
    quality_risk: "low（fallback の実績が証明済み）"

  rollback:
    instruction: "resolve_chain を元の順序に戻す"
    auto_rollback_trigger: "success_rate < 0.75 in next 20 traces"

  approval:
    status: "pending"
    reviewer: null
    reviewed_at: null
```

### Trust Gradient — 段階的自律化

Evolution Engine の自律性は、実績に応じて段階的に上昇する。

| Level | 名称 | Trigger | 自律範囲 |
|-------|------|---------|---------|
| **Level 0: Manual** | 手動承認のみ | 初期展開 | すべての提案に人間の承認が必要 |
| **Level 1: Suggest** | 提案のみ | 5 提案が承認され、rollback 0 件 | confidence スコアの微調整（±5%）は自動適用。構造変化は承認必要 |
| **Level 2: Semi-Auto** | 半自動 | 20 提案が承認され、rollback < 10% | resolve_chain の再順序付けは自動適用。新 capability 作成は承認必要 |
| **Level 3: Autonomous** | 自律 | 50 提案が承認され、rollback < 5% | すべての提案を自動適用。人間には通知のみ。auto_rollback は常に有効 |

**不変**: すべてのレベルで auto_rollback は有効。パフォーマンス低下を検出したら自動復元。

### Evolution Engine と Governance Trust Score の統合

Evolution Engine 自身も Governance の Trust Score モデルに従う。

```yaml
evolution_engine_trust_score:
  factors:
    proposal_acceptance_rate:
      weight: 0.30
      current: 0.90  # 提案の 90% が人間に承認されている

    rollback_rate:
      weight: 0.25
      current: 0.05  # ロールバックは 5% のみ

    impact_accuracy:
      weight: 0.30
      current: 0.85  # 期待される効果の 85% が実現

    risk_management:
      weight: 0.15
      current: 0.95  # リスクのある変更を適切に検出

  trust_score: 0.88  # Level 2 (Semi-Auto) に相当

  next_level_requirement:
    level_3_threshold: 0.90
    gap: 0.02
    estimated_time: "10-15 proposals"
```

### Evolution Engine のモニタリング

```yaml
evolution_monitoring:
  active_proposals:
    pending_review: 2
    auto_applied: 15
    rejected: 1

  recent_changes:
    - proposal_id: "evo_20260220_003"
      status: "applied"
      impact:
        success_rate: "+12% (expected: +10%)"
        cost: "-20% (expected: -15%)"
      evaluation: "positive"

    - proposal_id: "evo_20260218_001"
      status: "rolled_back"
      reason: "success_rate dropped to 0.65 (threshold: 0.70)"
      action: "reverted to original config"

  performance_trends:
    overall_success_rate:
      before_evolution: 0.82
      after_evolution: 0.89
      improvement: "+8.5%"

    average_cost_per_task:
      before: "$0.15"
      after: "$0.11"
      savings: "27%"
```

## まとめ

Orchestration は Neural Organization の「神経系の統率者」である。

**設計の核心**:
1. **動的フロー制御**: 固定ワークフローではなく、状況に応じた実行
2. **リソース最適配分**: 有限なリソースを価値の高いタスクに配分
3. **優先度管理**: 緊急度・影響度・Purpose 整合性に基づく優先順位
4. **自律的エラー回復**: リトライ・フォールバック・エスカレーション
5. **パフォーマンス最適化**: キャッシング・並列化・プリエンプティブ実行
6. **自己改善（Evolution Engine）**: 実行トレースから設定を継続的に最適化

Evolution Engine により、Orchestration は時間とともに賢くなり、より効率的で正確な調整を実現する。これは Layer 4 Reflection の「学習」が Orchestration 自身に適用された形である。

## 学術的根拠

Orchestration の設計は、サイバネティクス・複雑系科学・レジリエンスエンジニアリングの知見に基づいている。

| 設計要素 | 学術的根拠 | 対応関係 |
|---|---|---|
| フロー制御（ループバック、動的調整） | Wiener (1948) サイバネティクス — フィードバックによるシステム制御 | 出力を観測し目標との差分で入力を調整する制御構造 |
| 多様なフロー制御・フォールバック戦略 | Ashby (1956) 必要多様性の法則 — 多様性のみが多様性を吸収する | 環境の多様性に対処するための制御の多様性 |
| Evolution Engine の進化サイクル | Deming PDCA/PDSA — 継続的改善サイクル | Collect → Analyze → Generate → Apply → Observe のデータ駆動的自動化 |
| Orchestration 全体の 4 能力 | Hollnagel (2011) レジリエンスの 4 つの礎石 | フロー制御=Respond、メトリクス=Monitor、プリエンプティブ実行=Anticipate、Evolution Engine=Learn |
| Evolution Engine の適応メカニズム | Holland (1995) 複雑適応系 — ビルディングブロック、適応、内部モデル | Capability Registry=ビルディングブロック、パラメータ調整=適応、分析シグナル=内部モデル |
| Trust Gradient（段階的自律化） | Kauffman (1993) 秩序の縁 — 最適な適応は秩序とカオスの境界で生じる | 人間制御と完全自律の間の動的均衡 |

**参考文献**:
- Wiener, N. (1948). *Cybernetics.* MIT Press.
- Ashby, W.R. (1956). *An Introduction to Cybernetics.* Chapman and Hall.
- Deming, W.E. (1986). *Out of the Crisis.* MIT Press.
- Hollnagel, E. (2011). "Epilogue: RAG — The Resilience Analysis Grid." In E. Hollnagel et al. (Eds.), *Resilience Engineering in Practice.* Ashgate.
- Holland, J.H. (1995). *Hidden Order.* Addison-Wesley.
- Kauffman, S.A. (1993). *The Origins of Order.* Oxford University Press.
