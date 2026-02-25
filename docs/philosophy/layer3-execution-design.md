# Layer 3: Execution の詳細設計

## 論点

Reasoning で決定された行動計画を、どのように高品質なアウトプット（コンテンツ、コミュニケーション、外部システム操作）に変換し、確実にデリバリーするべきか。

## Execution の本質

### 変換: 行動計画 → アウトプット

Layer 2 (Reasoning) は「何をすべきか」を導出する。Layer 3 (Execution) は「それを実際に実行する」。

**入力**:
- 行動計画: 「顧客 Acme に UX 改善の進捗を報告するメールを送る」

**出力**:
- 実際のアウトプット: パーソナライズされたメール、適切なタイミングで送信

従来のシステムとの違い：

| 従来のシステム | Neural Organization |
|---|---|
| テンプレートにデータを埋め込む | 文脈に基づいて内容を生成 |
| 人間が最終調整 | 品質保証を自動化 |
| 一律のタイミングで実行 | 最適なタイミングを判断 |
| エラー時は停止 | 自律的に回復 |

### Execution の設計原理

**原理 1: 品質は妥協しない**

自動化によって品質が低下してはならない。システムが生成するアウトプットは、人間が作成するものと同等以上の品質を持つ。

**原理 2: 文脈を保持する**

Execution は Reasoning の文脈を理解している。「なぜこの行動を取るのか」を理解した上で、適切なアウトプットを生成する。

**原理 3: ブランドとトーンの一貫性**

組織のブランドガイドライン、コミュニケーションスタイル、文化的規範を反映する。

**原理 4: 適応的なデリバリー**

「誰に」「いつ」「どのチャネルで」届けるかを状況に応じて最適化する。

**原理 5: 可逆性の考慮**

不可逆性の高いアクションは Governance Gate 2 を通す。

## Capability Registry — 能力と実行リソースの間接参照

### 設計の必要性

Execution が行動計画をアウトプットに変換する際、「誰が実行するか」（LLM、テンプレートエンジン、外部 API、人間エージェント等）は、能力要件に対する現時点での最適解である。実行主体を固定すると、以下の問題が生じる：

- 新しいツールや改善されたモデルへの移行が困難
- 実行リソースの障害時にシステム全体が停止
- 上位層（Reasoning, Purpose）が具体的なツール名に依存してしまう

Capability Registry は、不変原理「能力による間接参照」（[invariant-principles.md](../invariant-principles.md) 原理1）の実装であり、能力要件→実行リソースの動的解決を担う。この設計の直接的な先行概念は Smith (1980) の Contract Net Protocol である。Contract Net では、タスクを持つ「マネージャ」がタスク公告を発信し、能力を持つ「コントラクタ」が入札し、最適なコントラクタにタスクが配分される。Capability Registry の resolve_chain は、この能力ベースの動的タスク配分を静的な優先順位リストとして事前計算したものと位置づけられる。

さらに、複数の実行リソースを保持しフォールバックチェインを構成する設計は、Ashby (1956) の必要多様性の法則（Law of Requisite Variety）に根拠を持つ。必要多様性の法則は「制御システムは、制御対象と同等以上の多様性を持たなければならない」と述べる。多様な実行要件（高品質・低コスト・高速・高信頼性など）に対応するためには、多様な実行リソースのプールが必要であり、単一の実行手段では環境の多様性に対応できない。

### Registry の構造

```yaml
capabilities:
  # 能力1: コミュニケーション生成
  communication_generation:
    description: "顧客・パートナー・社内向けのメール、メッセージ、レポートを生成"

    resolve_chain:
      - resource: "email_generation_llm_v2"
        confidence: 0.88
        rationale: "高品質なパーソナライズが可能。顧客コミュニケーションで高評価"
        cost_per_invocation: 0.05
        avg_latency_ms: 3200

      - resource: "email_generation_llm_v1"
        confidence: 0.75
        rationale: "v2 の fallback。品質はやや劣るが、安定性が高い"
        cost_per_invocation: 0.02
        avg_latency_ms: 2100

      - resource: "template_based_generator"
        confidence: 0.50
        rationale: "最終 fallback。テンプレート + パラメータ埋め込み"
        cost_per_invocation: 0.001
        avg_latency_ms: 100

    governance_gate: "external_communication の場合は Gate 2 を通す"
    quality_threshold: 0.90

  # 能力2: コード生成
  code_generation:
    description: "プロダクトコード、テスト、設定ファイルを生成"

    resolve_chain:
      - resource: "code_generation_llm_specialized"
        confidence: 0.92
        rationale: "コード特化モデル。静的解析 pass 率 95%"
        cost_per_invocation: 0.08
        avg_latency_ms: 4500

      - resource: "general_purpose_llm"
        confidence: 0.70
        rationale: "汎用モデル。コード生成も可能だが品質は劣る"
        cost_per_invocation: 0.04
        avg_latency_ms: 2800

    governance_gate: "production deployment の場合は Gate 2 を通す"
    quality_threshold: 0.95

  # 能力3: データ分析
  data_analysis:
    description: "顧客データ、売上データ、行動データの分析とインサイト抽出"

    resolve_chain:
      - resource: "data_analysis_pipeline"
        confidence: 0.85
        rationale: "カスタムパイプライン。SQL + Python による分析"
        cost_per_invocation: 0.10
        avg_latency_ms: 15000

      - resource: "llm_based_analysis"
        confidence: 0.65
        rationale: "LLM にデータを渡して分析。柔軟性は高いが精度は劣る"
        cost_per_invocation: 0.12
        avg_latency_ms: 5000

    governance_gate: "なし（分析結果は Reasoning が判断に使用）"
    quality_threshold: 0.85

  # 能力4: 外部システム操作
  external_system_operation:
    description: "Salesforce, Stripe, GitHub 等の外部システムへの API 呼び出し"

    resolve_chain:
      - resource: "api_orchestrator"
        confidence: 0.95
        rationale: "エラーハンドリング、リトライ、レート制限管理を実装済み"
        cost_per_invocation: 0.02
        avg_latency_ms: 800

      - resource: "simple_api_client"
        confidence: 0.75
        rationale: "基本的な API 呼び出し。エラーハンドリングは限定的"
        cost_per_invocation: 0.01
        avg_latency_ms: 500

      - resource: "human_escalation"
        confidence: 0.50
        rationale: "最終フォールバック。人間が手動で外部システムを操作"
        cost_per_invocation: 0.00
        avg_latency_ms: 3600000  # 1時間（人間の対応待ち）

    governance_gate: "データ更新の場合は Gate 2 を通す"
    quality_threshold: 0.98
```

### Registry のフィールド定義

| フィールド | 説明 | 例 |
|---|---|---|
| **capability** | 能力の識別子（一意） | `communication_generation` |
| **description** | 能力の説明（人間が理解できる形式） | 「顧客向けメールを生成」 |
| **resolve_chain** | 実行リソースの優先順位付きリスト（フォールバック） | [primary, fallback1, fallback2] |
| **resource** | 実行リソースの識別子 | `email_generation_llm_v2` |
| **confidence** | このリソースの品質期待値（0.0-1.0） | 0.88 |
| **rationale** | なぜこのリソースを選択したか（監査可能性） | 「高品質なパーソナライズが可能」 |
| **cost_per_invocation** | 実行1回あたりのコスト（USD） | 0.05 |
| **avg_latency_ms** | 平均レイテンシ（ミリ秒） | 3200 |
| **governance_gate** | Governance Gate 2 が必要な条件 | 「external_communication の場合」 |
| **quality_threshold** | 品質チェックの最低基準 | 0.90 |

#### confidence と quality_threshold の関係

**定義**:

- **confidence**: そのリソースが過去の実績に基づいて期待される品質スコア（0.0-1.0）。Layer 4 (Reflection) によって継続的に更新される
- **quality_threshold**: その能力で生成されたアウトプットが満たすべき最低品質基準（0.0-1.0）。能力の性質に応じて設定される

**選択ルール**:

```yaml
resource_selection_rules:
  primary_resource:
    condition: "confidence >= quality_threshold - 0.05"
    rationale: "品質閾値に対して許容範囲（-5%）内であれば使用可能"
    example:
      quality_threshold: 0.90
      acceptable_confidence_range: [0.85, 1.00]

  fallback_resource:
    condition: "confidence < quality_threshold でも使用可能"
    rationale: "Primary が失敗した場合、品質が低くても代替手段として使用"
    post_execution_check: "品質チェックで quality_threshold を満たさない場合、さらに次のフォールバックへ"

  final_fallback:
    condition: "confidence に関わらず常に実行可能"
    rationale: "システムの継続性を保証（原理3: 優雅な劣化）"
    example: "human_escalation（人間が手動で処理）"
```

**実行後の品質チェック**:

リソースが選択され実行された後、生成されたアウトプットの品質スコアが `quality_threshold` を満たしているかチェックする。満たさない場合、resolve_chain の次のリソースにフォールバックする。

```yaml
post_execution_quality_check:
  scenario: "email_generation_llm_v2 でメールを生成"

  execution_result:
    output: "生成されたメール"
    measured_quality_score: 0.82  # 実際の品質

  comparison:
    quality_threshold: 0.90
    measured_quality: 0.82
    meets_threshold: false

  action: "fallback to email_generation_llm_v1"
  reasoning: "品質が閾値を満たさないため、次のリソースを試行"
```

この二段階チェック（事前の confidence ベース選択 + 事後の品質チェック）により、高品質なアウトプットと優雅な劣化の両立を実現する。

### 動的な解決プロセス

#### ステップ 1: 能力要件の特定

Reasoning が行動計画を出力する際、必要な能力を明示する。

```yaml
reasoning_output:
  action: "顧客 Acme に UX 改善の進捗報告メールを送信"
  capability_required: "communication_generation"
  context:
    urgency: "medium"
    quality_requirement: "high"
    cost_constraint: "none"
```

#### ステップ 2: リソースの選択

Capability Registry の `resolve_chain` を参照し、条件に基づいて最適なリソースを選択する。

```yaml
resolution_process:
  capability: "communication_generation"
  quality_threshold: 0.90

  candidates:
    - resource: "email_generation_llm_v2"
      confidence: 0.88
      acceptable: true  # confidence 0.88 >= threshold 0.90 - 0.05 (許容範囲内)
      available: true
      selected: true
      reasoning: "Primary resource。許容範囲内の confidence"

    - resource: "email_generation_llm_v1"
      confidence: 0.75
      acceptable: false  # confidence 0.75 < threshold 0.90 - 0.05
      available: true
      selected: false
      reasoning: "Fallback として待機。Primary が失敗した場合に使用"

    - resource: "template_based_generator"
      confidence: 0.50
      acceptable: false
      available: true
      selected: false
      reasoning: "最終フォールバック"

  selected_resource: "email_generation_llm_v2"
  reasoning: "confidence が許容範囲内（0.85-1.00）で利用可能"
```

#### ステップ 3: Fallback の処理

Primary resource が失敗した場合、resolve_chain の次のリソースを試行する。このフォールバックチェインの設計は、Woods (2015, 2018) の Graceful Extensibility 理論に基づく。Woods は、システムが想定外の状況に直面したとき、性能を段階的に低下させながらも機能を維持し続ける能力を「graceful extensibility」と定義した。resolve_chain の各段階（高品質 LLM → 旧バージョン LLM → テンプレートベース → 人間エスカレーション）は、品質を段階的に落としながらも「完全に停止しない」ことを保証する。

Carlson & Doyle (2002) の HOT（Highly Optimized Tolerance）理論が指摘するように、ロバスト性を一方向に最適化すると別方向に脆弱性が生じる。フォールバックチェインは頻度の高い障害パターン（API タイムアウト、モデル品質低下等）に対して堅牢だが、チェイン全体が依存するインフラ（ネットワーク、認証基盤等）の障害にはフラジャイルである。この構造的トレードオフを認識した上で、最終フォールバックとして human_escalation（人間の手動処理）を配置することで、完全なシステム停止を回避している。

```yaml
fallback_scenario:
  primary: "email_generation_llm_v2"
  error: "API timeout after 10s"

  fallback_to: "email_generation_llm_v1"
  result: "success"

  trace:
    - resource: "email_generation_llm_v2"
      status: "failed"
      error: "timeout"
    - resource: "email_generation_llm_v1"
      status: "success"
      latency_ms: 2100
```

### Registry の進化

Capability Registry は静的な設定ファイルではなく、Layer 4 (Reflection) と Orchestration の Evolution Engine によって継続的に最適化される（不変原理「設定のデータ化」、[invariant-principles.md](../invariant-principles.md) 原理5）。

#### 進化の例 1: confidence の調整

```yaml
learning_signal:
  capability: "communication_generation"
  resource: "email_generation_llm_v2"

  observation:
    past_30_executions:
      success_rate: 0.95
      human_modification_rate: 0.08
      avg_quality_score: 0.92

  adjustment:
    confidence:
      before: 0.88
      after: 0.91
      reason: "実績が期待を上回った"
```

#### 進化の例 2: resolve_chain の再順序付け

```yaml
learning_signal:
  capability: "code_generation"

  observation:
    primary_resource: "code_generation_llm_specialized"
    primary_success_rate: 0.75  (期待: 0.92)

    fallback_resource: "general_purpose_llm"
    fallback_success_rate: 0.85  (期待: 0.70)

  proposal:
    action: "resolve_chain の順序を入れ替え"
    reasoning: "fallback の方が実績が良い"
    new_chain:
      - resource: "general_purpose_llm"  # 昇格
        confidence: 0.85
      - resource: "code_generation_llm_specialized"  # 降格
        confidence: 0.75

  approval: "pending_human_review"
```

#### 進化の例 3: 新しいリソースの追加

```yaml
new_resource_proposal:
  capability: "communication_generation"
  new_resource: "email_generation_llm_v3"

  initial_confidence: 0.70  (保守的に設定)
  position_in_chain: 2  (primary と v1 の間)

  reasoning: "新モデルをテストするため、中位に配置"
  rollout_plan:
    phase_1: "10% のリクエストで試用"
    phase_2: "confidence を実績に基づいて調整"
    phase_3: "confidence が primary を超えたら昇格"
```

### Registry と Orchestration の統合

Orchestration のリソース配分（[orchestration-design.md](orchestration-design.md)）は、Capability Registry を参照してリソースの優先度を決定する。

```yaml
orchestration_decision:
  task: "顧客 50 社にメール送信"
  capability: "communication_generation"

  resource_allocation:
    selected_resource: "email_generation_llm_v2"
    batch_size: 10  (並列度)
    timeout_per_request: 5000ms

    reasoning: |
      - Registry の confidence 0.88 → 高品質が期待できる
      - cost_per_invocation $0.05 × 50 = $2.50 → 予算内
      - avg_latency 3200ms × 50 / 10 = 16s → 許容範囲
```

## Execution の 4 つの機能

### 1. アーティファクト生成

**コンテンツ、コード、分析レポート、提案書、コミュニケーション等を生成する**

#### カテゴリ 1: コミュニケーション

**顧客・パートナー・社内へのメール、メッセージ、レポート**

**例 1: 顧客へのアウトリーチメール**

```yaml
input_from_reasoning:
  action: "顧客 Acme への UX 改善進捗報告"
  context:
    customer: "Acme Corp"
    issue: "v2.3 の UX 問題でログイン頻度が 40% 減少"
    action_taken: "UX ロールバック + チュートリアル追加"
    status: "実装完了、来週デプロイ"
    relationship: "良好（健全性スコア 85）"

generation_process:
  step_1_tone_selection:
    selected: "professional_friendly"
    reasoning: "既存顧客、良好な関係、問題解決の報告"
    alternatives:
      - "formal": "新規顧客や重要な契約時"
      - "casual": "親密な関係の顧客"

  step_2_structure:
    opening: "パーソナライズされた挨拶 + 文脈の共有"
    body: "問題の認識 → 対応内容 → 期待される改善"
    closing: "サポート提供 + 次のステップ"

  step_3_content_generation:
    draft: |
      件名: Acme Corp 様 - プラットフォーム UX 改善のお知らせ

      John 様

      いつも Acme Corp 様には弊社プラットフォームをご利用いただき、
      ありがとうございます。

      先月、v2.3 のリリース後、一部のお客様から新しい UI についての
      フィードバックをいただきました。Acme Corp 様のチームも、
      ログイン頻度が以前より減少していることに気づいておりました。

      皆様のフィードバックを真摯に受け止め、以下の改善を実施いたしました：

      1. 慣れ親しんだワークフローへの復帰オプション
      2. 新 UI の使い方を解説するインタラクティブチュートリアル
      3. ショートカットキーの追加（パワーユーザー向け）

      これらの改善は来週月曜日にデプロイされます。
      Acme Corp 様のチームの生産性が向上することを期待しております。

      何かご質問やご要望がございましたら、お気軽にお知らせください。
      引き続きよろしくお願いいたします。

      Sarah Chen
      Customer Success Manager

  step_4_quality_check:
    grammar: 1.00
    tone: 0.95
    brand_alignment: 0.93
    personalization: 0.92
    clarity: 0.94
    overall_quality: 0.95
    outcome: "pass"

  step_5_brand_guidelines:
    checked:
      - "敬語の使用: OK"
      - "会社名の表記: OK"
      - "署名フォーマット: OK"
      - "禁止表現（誇大広告等）: なし"

output:
  artifact_type: "email"
  content: [上記の draft]
  metadata:
    language: "japanese"
    tone: "professional_friendly"
    length: "medium"
    personalization_level: "high"
  ready_for_gate2: true
```

**例 2: 週次レポートの生成**

```yaml
input_from_reasoning:
  action: "経営層向け週次売上レポート"
  data_sources:
    - "salesforce_deals"
    - "stripe_revenue"
    - "customer_health"

generation_process:
  step_1_data_collection:
    deals_closed: 8
    revenue_this_week: "$120K"
    pipeline_value: "$850K"
    at_risk_customers: 3

  step_2_insight_extraction:
    positive:
      - "大型商談 1 件成約（$40K）"
      - "パイプラインが前週比 +15%"
    negative:
      - "リスク顧客が 3 社（前週 2 社）"
      - "平均商談サイクルが 5 日延長"

  step_3_report_generation:
    structure:
      - "Executive Summary（重要な 3 点）"
      - "Key Metrics（数字）"
      - "Insights（なぜそうなったか）"
      - "Actions（何をしているか）"

    content: |
      # 週次売上レポート - 2024 年 2 月 5-11 日

      ## Executive Summary
      - 今週 8 件成約、売上 $120K（目標 $100K の 120%）
      - 大型商談 1 件（$40K）が成約
      - リスク顧客が 3 社に増加（要注意）

      ## Key Metrics
      | 指標 | 今週 | 先週 | 変化 |
      |---|---|---|---|
      | 成約件数 | 8 | 6 | +33% |
      | 売上 | $120K | $95K | +26% |
      | パイプライン | $850K | $740K | +15% |
      | リスク顧客 | 3 | 2 | +1 |

      ## Insights
      **売上好調の要因**:
      大型商談（Acme Corp, $40K）が想定より早く成約。
      営業チームの ROI 資料提供が効果的だった。

      **懸念事項**:
      リスク顧客が増加。主な理由は v2.3 の UX 問題。
      プロダクトチームが改善中（来週デプロイ予定）。

      ## Actions
      - リスク顧客 3 社に CSM がアプローチ中
      - UX 改善を来週月曜デプロイ
      - パイプラインの勢いを維持するため、マーケ予算を 20% 増額

output:
  artifact_type: "report"
  format: "markdown"
  audience: "executive"
  delivery_channel: "slack_exec_channel"
```

#### カテゴリ 2: コード

**プロダクトの機能、修正、テスト、インフラ設定**

**例: バグ修正のコード生成**

```yaml
input_from_reasoning:
  action: "顧客ダッシュボードの日付フィルタのバグを修正"
  bug_description: "先月のデータが表示されない"
  root_cause: "timezone の扱いに問題"

generation_process:
  step_1_code_generation:
    file: "src/dashboard/filters.ts"
    change: |
      // Before
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      // After
      const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

  step_2_test_generation:
    file: "tests/dashboard/filters.test.ts"
    tests: |
      describe('Date Filter', () => {
        it('should include all days in the month', () => {
          const filter = createDateFilter({ year: 2024, month: 1 });
          expect(filter.startDate.getUTCDate()).toBe(1);
          expect(filter.endDate.getUTCDate()).toBe(29);  // Feb 2024 is 29 days
        });

        it('should handle timezone correctly', () => {
          // Test for timezone edge cases
        });
      });

  step_3_quality_check:
    type_safety: "pass"
    test_coverage: 0.95
    code_style: "pass"
    security: "pass"

output:
  artifact_type: "code_change"
  files_changed: ["src/dashboard/filters.ts", "tests/dashboard/filters.test.ts"]
  ready_for_pr: true
```

#### カテゴリ 3: 分析

**データ分析、予測、シミュレーション**

**例: 解約要因分析**

```yaml
input_from_reasoning:
  action: "顧客維持率低下の要因を分析"
  data_period: "過去 6 ヶ月"

generation_process:
  step_1_data_analysis:
    churned_customers: 45
    analysis_dimensions:
      - "顧客セグメント"
      - "契約期間"
      - "利用頻度の変化"
      - "サポートチケット数"
      - "プロダクト変更のタイミング"

  step_2_correlation_analysis:
    findings:
      - factor: "v2.3 リリース後のログイン減少"
        correlation: 0.75
        affected_customers: 25
      - factor: "契約更新前 30 日のサポートチケット増加"
        correlation: 0.60
        affected_customers: 15

  step_3_visualization:
    chart_1:
      type: "timeline"
      title: "解約数と主要イベントの関係"
      data: [v2.3 リリース → 解約増加]
    chart_2:
      type: "cohort_analysis"
      title: "契約期間別の解約率"

  step_4_report_generation:
    content: |
      # 顧客解約要因分析

      ## 主要な発見
      1. v2.3 の UX 変更が最大の要因（55% の解約に関連）
      2. 契約更新前のサポート品質が重要（33% に関連）

      ## 推奨アクション
      1. UX 改善の優先実施
      2. 契約更新前 60 日のプロアクティブサポート
```

### 2. 外部システム操作

**メール送信、API 呼び出し、データベース更新、デプロイ等**

#### カテゴリ 1: データ更新

**例: Salesforce の商談ステージ更新**

```yaml
action: "商談 deal_456 のステージを 'Closed Won' に更新"

execution_process:
  step_1_validation:
    check: "更新権限があるか"
    result: true

  step_2_api_call:
    system: "Salesforce"
    endpoint: "PATCH /services/data/v57.0/sobjects/Opportunity/deal_456"
    payload:
      {
        "StageName": "Closed Won",
        "CloseDate": "2024-02-12",
        "Amount": 40000
      }

  step_3_verification:
    check: "更新が成功したか"
    result: "200 OK"

  step_4_cascade_updates:
    related_systems:
      - system: "Stripe"
        action: "契約を作成"
      - system: "CS Platform"
        action: "オンボーディングタスクを作成"
      - system: "Finance"
        action: "売上を記録"
```

#### カテゴリ 2: コミュニケーション送信

**例: メール送信**

```yaml
action: "顧客 Acme にメールを送信"

execution_process:
  step_1_governance_gate2:
    trigger: "external_communication"
    approval: "required"
    approver: "csm_lead"
    status: "approved"

  step_2_send:
    system: "SendGrid API"
    to: "john@acme.com"
    from: "sarah@ourcompany.com"
    subject: "Acme Corp 様 - プラットフォーム UX 改善のお知らせ"
    body: [生成されたコンテンツ]

  step_3_tracking:
    record:
      - "送信日時: 2024-02-12T10:30:00Z"
      - "送信先: john@acme.com"
      - "件名: ..."
    store_in: "crm.communication_log"

  step_4_monitoring:
    track:
      - "開封率"
      - "返信"
      - "クリック（リンクがあれば）"
```

#### カテゴリ 3: デプロイ

**例: プロダクトのデプロイ**

```yaml
action: "UX 改善を本番環境にデプロイ"

execution_process:
  step_1_pre_deployment_checks:
    checks:
      - "全テストが pass"
      - "コードレビュー完了"
      - "ステージング環境で検証済み"
    result: "all pass"

  step_2_governance_gate2:
    trigger: "system_changes (high impact)"
    approval: "required"
    approver: "cto"
    status: "approved"

  step_3_deployment:
    strategy: "canary"
    steps:
      - "5% のユーザーに展開"
      - "エラー率を監視（15 分）"
      - "問題なければ 50% に拡大"
      - "さらに監視（30 分）"
      - "100% に展開"

  step_4_monitoring:
    metrics:
      - "エラー率"
      - "レスポンス時間"
      - "ユーザーフィードバック"

  step_5_rollback_plan:
    trigger: "エラー率 > 1% or ユーザーからの深刻な報告"
    action: "即座にロールバック"
```

### 3. 品質保証

**アウトプットが組織の基準を満たしているかを検証する**

#### 品質基準のカテゴリ

```yaml
quality_dimensions:
  content_quality:
    - "文法・スペルミス"
    - "論理的整合性"
    - "わかりやすさ"

  brand_alignment:
    - "トーン・スタイル"
    - "用語の一貫性"
    - "ビジュアルガイドライン"

  technical_quality:
    - "コードの品質（静的解析）"
    - "テストカバレッジ"
    - "パフォーマンス"

  legal_compliance:
    - "誇大広告の禁止"
    - "プライバシー規制（GDPR, CCPA）"
    - "契約条件との整合性"

  accuracy:
    - "データの正確性"
    - "引用の正確性"
    - "計算の正確性"
```

#### 品質チェックのプロセス

```yaml
quality_assurance_process:
  stage_1_automated_checks:
    tools:
      - "文法チェッカー"
      - "コード静的解析（ESLint, TypeScript）"
      - "テスト実行"
      - "セキュリティスキャン"
    threshold: "すべて pass"

  stage_2_ai_evaluation:
    dimensions:
      - tone_appropriateness: 0.95
      - brand_alignment: 0.93
      - clarity: 0.94
      - accuracy: 0.98
    threshold: "all >= 0.90"

  stage_3_rule_based_validation:
    rules:
      - "顧客名のスペルミス → 自動却下"
      - "禁止表現の使用 → 自動却下"
      - "データの不整合 → 自動却下"

  outcome:
    pass: "Governance Gate 2 へ進む（該当する場合）"
    fail: "再生成 or 人間にエスカレーション"
```

#### 品質基準の学習

```yaml
learning_from_human_modifications:
  scenario: "人間が生成されたメールを修正"

  original: "We noticed your usage has declined."
  modified: "Is there anything we can help with?"

  learning_extraction:
    pattern: "問題の指摘よりも、サポート提供を前面に出す"
    category: "customer_communication_tone"
    store_in: "long_term_memory.communication_patterns"

  future_impact:
    "次回の顧客コミュニケーションから、このパターンを適用"
```

### 品質保証の実装パターン: 否定的定義と多段編集

> 本セクションは、Personal Brain OS（Muratcan Koylan 氏）の Voice System / Anti-patterns 設計から、Layer 3 の品質保証に反映すべき実践知見を整理したものである。参照元: `inbox/file-system.md`

#### 否定的定義（Anti-patterns）による品質制御

**知見**: 「何であるか」を定義するよりも「何でないか」を定義する方が、エージェントの出力品質を効果的に制御できる。

従来の品質基準は「トーンは professional but approachable」のような肯定的定義が多いが、これはエージェントにとって曖昧である。代わりに、**禁止パターンリスト**を用いることで、品質のガードレールを具体的に設定できる。

```yaml
anti_pattern_quality_control:
  # 組織のコミュニケーションにおける禁止パターンの例
  banned_expressions:
    tier_1_absolute_ban:
      - "弊社は業界をリードする..."
      - "お客様のご理解とご協力をお願い..."
      # 組織固有の禁止表現を蓄積
    tier_2_context_dependent:
      - pattern: "検討させていただきます"
        exception: "法的に回答を留保すべき場合"
    tier_3_overuse_warning:
      - pattern: "〜させていただく"
        limit: "1文書あたり2回まで"

  structural_traps:
    - "すべての段落を同じ長さにする"
    - "箇条書きの項目が常に3つ"
    - "結論が導入の繰り返し"

  check_process:
    - "生成後にanti-patternsリストと照合"
    - "トリガーがあれば該当箇所を書き直し"
    - "品質基準の肯定的定義と併用"
```

**Neural Organization での適用**:
- 各組織の長期記憶に、人間の修正から抽出された禁止パターンを蓄積する
- Layer 3 の品質チェック `stage_3_rule_based_validation` に禁止パターン照合を組み込む
- 禁止パターンは Reflection（Layer 4）から継続的に更新される

#### 定量的なスタイルプロファイル

**知見**: 声やトーンを形容詞ではなく、**数値スケール**で定義すると、エージェントに正確な着地点を伝えられる。

```yaml
# 組織のコミュニケーションスタイルプロファイルの例
style_profile:
  formal_casual: 6        # 1=非常にフォーマル, 10=非常にカジュアル
  serious_playful: 3      # 1=非常に真面目, 10=非常に遊び心
  technical_simple: 7     # 1=非常に専門的, 10=非常に平易
  reserved_expressive: 5  # 1=非常に抑制的, 10=非常に表現的
  cautious_bold: 6        # 1=非常に慎重, 10=非常に大胆
```

これは Long-term Memory に「組織の『らしさ』」として保存され、Layer 3 がアーティファクト生成時に参照する。

#### 多段編集プロセス

**知見**: 1回の生成 + 1回のチェックではなく、**目的の異なる複数の編集パス**を順次実行することで品質が大幅に向上する。

```yaml
multi_pass_editing:
  pass_1_structure:
    focus: "構造と論理の流れ"
    check: "導入は注意を引くか？論理は飛躍していないか？"
  pass_2_style:
    focus: "トーンとブランド整合性"
    check: "禁止パターンスキャン、スタイルプロファイルとの一致"
  pass_3_evidence:
    focus: "事実の正確性"
    check: "主張に根拠があるか？数値は正確か？出典は明示されているか？"
  pass_4_delivery:
    focus: "受け手の視点"
    check: "受け手にとって分かりやすいか？行動を促すか？"
```

これは既存の品質チェック4段階（基準適合→論理整合性→安全性→最適化）と補完関係にある。4段階チェックは合否判定（Gate）であり、多段編集は生成品質の向上（Improvement）である。

### 4. デリバリー

**適切な受信者に、適切なタイミングで、適切なチャネルで届ける**

#### デリバリーの最適化

**Who（誰に）**:

```yaml
recipient_selection:
  scenario: "顧客 Acme への UX 改善の通知"

  options:
    - recipient: "john@acme.com (メインコンタクト)"
      appropriateness: 0.95
    - recipient: "tech_team@acme.com (技術チーム全体)"
      appropriateness: 0.70
    - recipient: "jane@acme.com (決裁者)"
      appropriateness: 0.30

  decision: "john@acme.com"
  reasoning: "日常的な利用者であり、UX 改善の恩恵を直接受ける"
```

**When（いつ）**:

```yaml
timing_optimization:
  scenario: "リスク顧客へのアウトリーチメール"

  options:
    - timing: "immediate"
      pros: "緊急性を示す"
      cons: "夜間や週末だと印象が悪い"

    - timing: "next_business_day_morning"
      pros: "受信トレイの上部に表示される可能性が高い"
      cons: "緊急性が低く見える"

  decision: "next_tuesday_10am (受信者の timezone)"
  reasoning: |
    - 月曜は受信トレイが混雑
    - 火曜午前は開封率が高い
    - 受信者の過去の開封パターンから、10-11am が最適
```

**How（どのチャネルで）**:

```yaml
channel_selection:
  scenario: "緊急のシステム障害の通知"

  options:
    - channel: "email"
      latency: "数分〜数時間"
      appropriateness: 0.30

    - channel: "slack"
      latency: "即座"
      appropriateness: 0.70

    - channel: "sms"
      latency: "即座"
      appropriateness: 0.90

  decision: "sms (緊急連絡先) + slack (詳細)"
  reasoning: "緊急度が高いため、即座に届く SMS を使用。詳細は Slack で共有"
```

## Execution の失敗とリカバリー

### エラーハンドリング

```yaml
error_scenarios:
  api_failure:
    scenario: "Salesforce API が 500 エラーを返した"
    recovery:
      - "5 分後にリトライ（最大 3 回）"
      - "それでも失敗 → 人間にエスカレーション"

  validation_failure:
    scenario: "品質チェックで基準を満たさない"
    recovery:
      - "再生成（最大 3 回）"
      - "それでも失敗 → 人間にエスカレーション"

  rate_limit:
    scenario: "API のレート制限に達した"
    recovery:
      - "待機してリトライ"
      - "優先度の低いタスクを遅延"

  partial_failure:
    scenario: "20 件のメール送信のうち 5 件が失敗"
    recovery:
      - "成功分は完了とマーク"
      - "失敗分は別途リトライ"
      - "人間に部分的失敗を報告"
```

### ロールバック

```yaml
rollback_scenarios:
  deployment_failure:
    trigger: "デプロイ後にエラー率が急増"
    action:
      - "即座に前バージョンにロールバック"
      - "影響を受けた顧客に通知"
      - "根本原因を分析"
      - "修正後に再デプロイ"

  incorrect_data_update:
    trigger: "誤ったデータで更新してしまった"
    action:
      - "バックアップから復元"
      - "影響範囲を特定"
      - "関係者に通知"
```

## Execution のパフォーマンス測定

### 実行メトリクス

```yaml
execution_metrics:
  quality:
    - "品質チェック通過率: 95%"
    - "人間の修正率: 5%"

  efficiency:
    - "平均実行時間: 2.3 秒"
    - "API 呼び出し成功率: 99.2%"

  impact:
    - "メール開封率: 45%"
    - "返信率: 12%"
    - "デプロイ成功率: 98%"

  learning:
    - "人間の修正から学習したパターン数: 127"
    - "品質改善率（月次）: +5%"
```

## まとめ

Layer 3 (Execution) は、Neural Organization の「行動力」である。

**設計の核心**:
1. **高品質な生成**: 文脈を理解し、ブランドと整合したアウトプット
2. **確実な操作**: 外部システムとの統合、エラーハンドリング
3. **厳格な品質保証**: 多層的なチェックで基準を満たす
4. **最適化されたデリバリー**: 誰に、いつ、どのチャネルで届けるかを最適化
5. **Governance 統合**: 不可逆的なアクションは Gate 2 を通す

この Execution により、Reasoning で導出された行動が現実世界に具現化される。そして Layer 4 (Reflection) がその結果から学習する。

## 学術的根拠

Layer 3 の設計は、マルチエージェントシステム・サイバネティクス・レジリエンスエンジニアリングの知見に基盤を置く。

### Contract Net Protocol: 能力ベースの動的タスク配分

Smith, R.G. (1980). "The Contract Net Protocol: High-Level Communication and Control in a Distributed Problem Solver." *IEEE Transactions on Computers*, C-29(12), 1104-1113.

マルチエージェントシステムにおける古典的なタスク配分プロトコル。マネージャがタスクを公告し、コントラクタが能力に基づいて入札し、最適なコントラクタにタスクが割り当てられる。Capability Registry はこの Contract Net の設計思想 — 具体的なエージェントではなく「能力」を介してタスクと実行者を結びつける — を直接的に継承している。resolve_chain は入札プロセスを事前計算した優先順位リストとして実装したものである。

### 必要多様性の法則

Ashby, W.R. (1956). *An Introduction to Cybernetics.* Chapman and Hall.

「制御システムの多様性は、制御対象の多様性と同等以上でなければならない」という制御理論の基本法則。多様な実行要件（高品質・低コスト・高速・高信頼性）に対応するには、多様な実行リソースのプールが必要である。Capability Registry が単一リソースではなく複数リソースの resolve_chain を保持する設計は、この法則の直接的な適用である。

### Graceful Extensibility: フォールバックチェインの理論的基盤

Woods, D.D. (2015). "Four Concepts for Resilience and the Implications for the Future of Resilience Engineering." *Reliability Engineering & System Safety*, 141, 5-9.
Woods, D.D. (2018). "The Theory of Graceful Extensibility: Basic Rules that Govern Adaptive Systems." *Environment Systems and Decisions*, 38(4), 433-457.

システムが想定外の状況に直面したとき、性能を段階的に低下させながらも機能を維持し続ける能力（graceful extensibility）の理論。resolve_chain のフォールバック設計 — primary → fallback → final fallback と品質を段階的に落としながらも完全には停止しない — は、この理論の実装パターンである。

### HOT理論: ロバスト性とフラジリティのトレードオフ

Carlson, J.M. & Doyle, J.C. (2002). "Complexity and Robustness." *Proceedings of the National Academy of Sciences*, 99(S1), 2538-2545.

ロバスト性を一方向に最適化すると、必然的に別方向の脆弱性（fragility）が生じるという Highly Optimized Tolerance 理論。フォールバックチェインは頻繁な障害パターンには堅牢だが、共通インフラの障害にはフラジャイルである。この構造的トレードオフを認識し、最終フォールバックとして人間エスカレーションを配置することで、HOT 理論が予測する脆弱性を緩和している。
