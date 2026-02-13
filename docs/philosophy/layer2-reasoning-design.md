# Layer 2: Reasoning の詳細設計

## 論点

Understanding で構築した世界モデルと、Purpose で定義された意志から、どのように行動計画を導出するべきか。特に、従来の組織が実現できなかった「領域横断的な統合的行動」をどう構成するべきか。

## Reasoning の本質

### 変換: 世界モデル × 目的 → 行動計画

Layer 2 (Reasoning) は、Neural Organization の「戦略的思考」の中核である。

**入力**:
- Layer 1 (Understanding) からの世界モデル: 「現実は実際にどうなっているか」
- Purpose: 「何を目指すべきか」

**出力**:
- 行動計画: 「何をすべきか」

従来の組織では、この推論は「人間の頭の中」で行われる。マネージャーが現状を理解し、目標を設定し、行動を決定する。しかし、これには本質的な限界がある：

| 従来の組織の限界 | Neural Organization の解 |
|---|---|
| 人間の認知容量は有限 | システムは膨大な情報を統合して推論できる |
| 部門の壁を超えた統合が困難 | 領域横断的な行動を自然に構成できる |
| 一度に扱える選択肢は 3-5 個 | 数百の選択肢を評価し、最適解を導出できる |
| トレードオフの評価が主観的 | Purpose に基づいて定量的に評価できる |
| 状況の変化への適応が遅い | リアルタイムに状況を評価し、行動を調整できる |

### Reasoning の設計原理

**原理 1: ワークフローではなく創発的推論**

従来のシステムは「あらかじめ定義されたワークフロー」に従う。Neural Organization は状況と目的から「その場で最適な行動を導出」する。

```
従来: IF 顧客健全性 < 70 THEN CSMに通知

Neural:
  現状: 顧客健全性 65（原因: プロダクト UX 問題）
  目的: 顧客維持率 95%
  推論: UX 問題を解決しない限り、CSM の介入は一時的効果しかない
  行動: プロダクトチームに UX 改善を優先依頼 + CSM が暫定的にサポート強化
```

**原理 2: 領域横断的な統合**

従来の組織では、部門ごとに独立した判断が行われる。Neural Organization は複数領域を横断した統合的な行動を構成する。

**原理 3: トレードオフの明示的評価**

すべての選択肢にはトレードオフがある。Reasoning はこれを明示的に評価し、Purpose に基づいて判断する。

**原理 4: 不確実性の定量化**

判断には不確実性が伴う。「確率 70% で成功する」という不確実性を明示し、リスクを考慮した判断を行う。

**原理 5: 人間との協働**

重要度・不可逆性・不確実性が高い判断は、人間（Governance）にエスカレーションする。

## Reasoning のプロセス

Reasoning は 5 つのステップで構成される：

### ステップ 1: ギャップ分析

**現在の状態（Understanding）と目指す状態（Purpose）の間のギャップを特定する**

#### 例 1: 顧客維持率のギャップ

```yaml
current_state:
  metric: "customer_retention_rate"
  value: 0.88
  trend: "declining"
  velocity: -0.02 per quarter

desired_state:
  metric: "customer_retention_rate"
  value: 0.95
  source: "purpose.where.strategic_objectives"

gap:
  absolute: -0.07
  relative: -7.4%
  severity: "high"
  urgency: "medium"
  reasoning: |
    現在のトレンドが続けば、6 ヶ月後には 84% まで低下。
    目標との乖離が拡大し、事業成長に深刻な影響。
```

#### 例 2: 新規契約のギャップ

```yaml
current_state:
  metric: "new_contracts_per_month"
  value: 12
  trend: "flat"

desired_state:
  metric: "new_contracts_per_month"
  value: 25
  source: "purpose.where.vision (2027 年 10,000 社達成のための逆算)"

gap:
  absolute: -13
  relative: -52%
  severity: "critical"
  urgency: "high"
```

#### ギャップの優先順位付け

複数のギャップが存在する場合、以下の基準で優先順位を付ける：

```python
priority_score = (
    gap_severity * 0.40 +
    urgency * 0.30 +
    impact_on_purpose * 0.20 +
    feasibility * 0.10
)
```

### ステップ 2: 機会の特定

**ギャップを埋めるために取りうる行動の選択肢を生成する**

従来のシステムは「あらかじめ定義された選択肢」から選ぶ。Neural Organization は「状況から選択肢を創発的に生成」する。

#### 機会生成の方法

**方法 1: 因果モデルからの逆算**

因果モデルが「X すれば Y が起こる」を示しているなら、「Y を実現するには X をすればよい」と逆算できる。

```
因果モデル:
  顧客のログイン頻度減少 → 解約リスク増加

逆算:
  解約リスクを下げるには → ログイン頻度を増やす
  ログイン頻度を増やすには → プロダクトの価値を高める or 利用ハードルを下げる
```

**方法 2: 過去の成功パターンの適用**

Memory から過去の成功パターンを想起し、現在の状況に適用できるか評価する。

```
過去の成功パターン:
  "SMB 顧客の維持率改善には、早期オンボーディング強化が効果的"

現在の状況:
  SMB 顧客の維持率が低下中

適用可能性:
  高い → この成功パターンを選択肢として採用
```

**方法 3: 類似組織のベストプラクティス**

Network Intelligence（他の Neural Organization 導入組織からの匿名化された学習）から、類似状況での効果的な施策を参照する。

```
類似組織の事例:
  "SaaS 企業で維持率を改善した施策トップ 3:
   1. プロアクティブな CSM アウトリーチ
   2. プロダクト内オンボーディング改善
   3. コミュニティ構築"
```

**方法 4: 創造的な組み合わせ**

既存の施策を新しい形で組み合わせる。

```
組み合わせ例:
  施策 A: CSM によるアウトリーチ
  施策 B: プロダクト改善
  創造的組み合わせ: CSM が収集したフィードバックを即座にプロダクトチームに伝達し、
                    週次でマイクロ改善をリリースする
```

#### 例: 顧客維持率向上の選択肢

```yaml
opportunity_1:
  name: "リスク顧客へのプロアクティブアウトリーチ"
  description: "健全性スコア 70 以下の顧客 25 社に CSM が個別アプローチ"
  expected_impact:
    retention_improvement: +3%
    confidence: 0.75
  cost:
    time: "CSM 40 hours/week for 4 weeks"
    money: "$0"
  feasibility: 0.90
  timeframe: "4 weeks"

opportunity_2:
  name: "UX 問題の修正"
  description: "v2.3 で導入した UX 変更を部分的にロールバック + チュートリアル追加"
  expected_impact:
    retention_improvement: +5%
    confidence: 0.65
  cost:
    time: "開発 2 weeks"
    money: "$20K"
  feasibility: 0.80
  timeframe: "3 weeks"

opportunity_3:
  name: "顧客コミュニティの構築"
  description: "Slack コミュニティを開設し、顧客同士の知見共有を促進"
  expected_impact:
    retention_improvement: +2%
    confidence: 0.50
  cost:
    time: "初期セットアップ 1 week + 運営 10 hours/week"
    money: "$5K"
  feasibility: 0.70
  timeframe: "8 weeks (効果発現まで)"

opportunity_4:
  name: "統合アプローチ"
  description: "Opportunity 1 + 2 を並行実行"
  expected_impact:
    retention_improvement: +7%  # 単純和ではなく、相乗効果を考慮
    confidence: 0.70
  cost:
    time: "Opp1 + Opp2 の合計"
    money: "$20K"
  feasibility: 0.75
  timeframe: "4 weeks"
```

### ステップ 3: トレードオフ評価

**選択肢間のトレードオフを Purpose に基づいて定量的に評価する**

#### 評価軸の定義

Purpose から評価軸を抽出する。

```yaml
evaluation_axes:
  - axis: "impact_on_goal"
    weight: 0.40
    source: "purpose.where (目標達成への貢献度)"

  - axis: "alignment_with_values"
    weight: 0.25
    source: "purpose.how (価値観との整合性)"

  - axis: "resource_efficiency"
    weight: 0.20
    source: "purpose.boundary (リソース制約)"

  - axis: "risk"
    weight: 0.15
    source: "リスク許容度"
```

#### 多軸評価

```yaml
opportunity_1_scores:
  impact_on_goal: 0.43  # +3% 改善 / 7% ギャップ = 0.43
  alignment_with_values: 0.90  # 顧客中心的アプローチ
  resource_efficiency: 0.95  # コスト $0
  risk: 0.85  # 低リスク（過去に実績あり）

  weighted_score:
    (0.43 * 0.40) + (0.90 * 0.25) + (0.95 * 0.20) + (0.85 * 0.15)
    = 0.172 + 0.225 + 0.190 + 0.128
    = 0.715

opportunity_2_scores:
  impact_on_goal: 0.71  # +5% / 7% = 0.71
  alignment_with_values: 0.80  # 品質重視
  resource_efficiency: 0.60  # コスト $20K
  risk: 0.70  # 中リスク（UX 変更の影響予測が難しい）

  weighted_score: 0.698

opportunity_4_scores:  # 統合アプローチ
  impact_on_goal: 1.00  # +7% / 7% = 1.00（ギャップを完全に埋める）
  alignment_with_values: 0.85
  resource_efficiency: 0.60
  risk: 0.65  # 複数施策の統合によるリスク

  weighted_score: 0.813  # 最高スコア
```

#### トレードオフの可視化

```yaml
trade_off_summary:
  highest_impact: "opportunity_4 (統合アプローチ)"
  lowest_cost: "opportunity_1 (プロアクティブアウトリーチ)"
  lowest_risk: "opportunity_1"
  best_overall: "opportunity_4"

  recommendation: "opportunity_4"
  rationale: |
    統合アプローチが最高の総合スコア (0.813) を獲得。
    コストは $20K だが、ギャップを完全に埋める可能性が高い。
    Purpose の「顧客中心主義」とも強く整合。
```

### ステップ 4: 判断

**最適な行動を選択する。または Governance にエスカレーションする**

#### 自律的な判断

判断が以下の条件を満たす場合、システムは自律的に決定する：

```yaml
autonomous_decision_criteria:
  - impact_severity: "low or medium"
  - reversibility: "high"
  - uncertainty: "low"
  - cost: "< $10K"
  - boundary_compliance: true
```

```yaml
decision:
  selected: "opportunity_4"
  confidence: 0.81
  autonomous: false  # コストが $20K のため、人間の承認が必要
  escalation_reason: "コストが自律判断の閾値 ($10K) を超過"
  governance_gate: true
```

#### Governance へのエスカレーション

重要度・不可逆性・不確実性が高い判断は、人間に提示される。

```yaml
governance_request:
  decision_id: "dec_20240212_retention_improvement"
  type: "strategic_initiative"

  context:
    gap: "顧客維持率 88% → 目標 95%"
    urgency: "medium"
    current_trend: "悪化中 (-2% per quarter)"

  recommendation:
    action: "opportunity_4 (統合アプローチ)"
    expected_impact: "+7% 維持率改善"
    cost: "$20K + CSM 160 hours"
    timeframe: "4 weeks"
    confidence: 0.70

  alternatives:
    - name: "opportunity_1"
      pros: "低コスト、低リスク"
      cons: "効果が限定的 (+3%)"
    - name: "opportunity_2"
      pros: "高い効果 (+5%)"
      cons: "UX 変更のリスク"

  risks:
    - risk: "UX 変更が予期しない副作用を生む"
      probability: 0.30
      mitigation: "段階的ロールアウト + A/B テスト"

  approval_request:
    required_approvers: ["csm_lead", "product_lead", "cfo"]
    reason: "複数部門にまたがる施策 + $20K の予算"
```

人間は以下を判断する：
- 提案を承認する
- 代替案を選択する
- 追加情報を要求する
- 却下する

### ステップ 5: 領域横断構成

**これが Neural Organization の最も革新的な部分である**

従来の組織では、各部門が独立して行動する。Neural Organization は、複数領域を横断した統合的な行動計画を構成する。

#### 例: 「顧客維持率を改善する」という目的に対する領域横断構成

**単一領域のアプローチ（従来型）**:

```
CS 部門:
  - リスク顧客 25 社にアウトリーチ

プロダクト部門:
  - UX 問題を修正

マーケティング部門:
  - (何もしない。顧客維持は CS の仕事)

営業部門:
  - (何もしない。既存顧客は CS の管轄)
```

**領域横断構成（Neural Organization）**:

```yaml
integrated_action_plan:
  goal: "顧客維持率を 88% → 95% に改善"

  cs_actions:
    - action: "リスク顧客 25 社へのプロアクティブアウトリーチ"
      timeline: "week 1-4"
      expected_contribution: "+3%"

    - action: "顧客フィードバックの構造化収集"
      timeline: "week 1-2"
      purpose: "プロダクト改善のインプット + マーケティングメッセージの精緻化"
      feeds_into: ["product.ux_fix", "marketing.case_study"]

  product_actions:
    - action: "v2.3 UX 問題の修正"
      timeline: "week 1-3"
      expected_contribution: "+5%"
      input_from: "cs.customer_feedback"

    - action: "オンボーディングチュートリアルの追加"
      timeline: "week 2-4"
      expected_contribution: "+2%"
      coordinates_with: "cs.outreach (CSM がチュートリアルを案内)"

  marketing_actions:
    - action: "既存顧客向け成功事例コンテンツの制作"
      timeline: "week 2-4"
      expected_contribution: "+1%"
      rationale: "顧客に『他社の成功』を示すことで、価値認識を高める"
      input_from: "cs.success_stories"

    - action: "休眠顧客向けリエンゲージメントキャンペーン"
      timeline: "week 3-6"
      expected_contribution: "+1%"
      target: "30 日以上ログインしていない 50 社"

  sales_actions:
    - action: "既存顧客のアップセル機会の特定"
      timeline: "week 2-4"
      expected_contribution: "維持率 +0.5% + 売上 +$50K"
      rationale: "満足度の高い顧客にアップセルすることで、コミットメントを強化"
      coordinates_with: "cs.health_score"

  coordination_mechanisms:
    - mechanism: "週次の統合レビュー"
      participants: ["cs_lead", "product_lead", "marketing_lead"]
      agenda: "進捗共有、ブロッカー解消、学習の統合"

    - mechanism: "リアルタイムデータ共有"
      description: "顧客の健全性スコア、フィードバック、プロダクト利用状況を全チームが参照可能"

  total_expected_impact: "+12.5%"  # 個別施策の合計を超える（相乗効果）

  synergies:
    - synergy: "CS のフィードバック → プロダクト改善 → 顧客満足向上 → CS の負荷軽減"
      type: "positive_feedback_loop"

    - synergy: "マーケティングの事例コンテンツ → CS がアウトリーチで活用 → 説得力向上"
      type: "resource_reuse"
```

**従来の組織との比較**:

| 従来の組織 | Neural Organization |
|---|---|
| CS のみが対応 → +3% 改善 | CS + Product + Marketing + Sales → +12.5% 改善 |
| 各部門が独立 | 各部門の行動が統合され、相乗効果 |
| 調整に会議が必要 | システムが最適な統合プランを構成 |
| 誰が何をするか不明確 | 各部門の役割・タイムライン・期待貢献が明確 |

#### 領域横断構成の原則

**原則 1: 目的の共有**

すべての行動は共通の目的（この例では「維持率 95%」）に向かう。

**原則 2: 相乗効果の最大化**

単なる並行実行ではなく、行動間の相乗効果を設計する。

**原則 3: リソースの最適配分**

組織全体のリソースを、最も効果の高い行動に配分する。

**原則 4: 調整コストの最小化**

従来は「会議」で調整していたが、システムが自動的に調整する。

## 実例: エンドツーエンドの Reasoning

### シナリオ: 「Q1 売上目標未達」

#### 入力

```yaml
understanding:
  current_state:
    q1_revenue: "$420K"
    target: "$500K"
    gap: "-$80K (-16%)"

  causal_analysis:
    primary_causes:
      - cause: "大型商談 2 件の遅延"
        impact: "-$60K"
      - cause: "新規契約数の減少"
        impact: "-$30K"
      - cause: "既存顧客のダウングレード"
        impact: "-$10K"

  entity_states:
    deal_456:
      status: "negotiation"
      amount: "$40K"
      delay: "30 days"
      reason: "顧客の予算承認プロセス遅延"

    deal_789:
      status: "proposal"
      amount: "$20K"
      delay: "20 days"
      reason: "競合との比較検討"

purpose:
  where: "Q2 売上目標 $550K 達成"
  how:
    customer_satisfaction: 0.70
    short_term_revenue: 0.30
  boundary:
    discount_limit: "最大 15%"
```

#### ステップ 1: ギャップ分析

```yaml
gap:
  q1_shortfall: "-$80K"
  q2_target: "$550K"
  required_growth: "$130K from Q1 actual"
  growth_rate_required: "+31%"
  severity: "critical"
```

#### ステップ 2: 機会の特定

```yaml
opportunities:
  1_accelerate_delayed_deals:
    description: "遅延している大型商談 2 件を加速"
    actions:
      - "deal_456: 顧客の予算承認を支援（ROI 資料提供）"
      - "deal_789: 競合との差別化を明確にする"
    expected_revenue: "+$50K (60K のうち、Q2 中に 50K が成約すると予測)"
    timeframe: "6 weeks"

  2_new_customer_acquisition:
    description: "新規顧客獲得を強化"
    actions:
      - "マーケティング: リード生成予算を 2 倍"
      - "営業: 商談パイプラインを 20% 増加"
    expected_revenue: "+$40K"
    timeframe: "8 weeks"

  3_existing_customer_expansion:
    description: "既存顧客のアップセル"
    actions:
      - "健全性スコア 80 以上の顧客 30 社にアップセル提案"
    expected_revenue: "+$30K"
    timeframe: "4 weeks"

  4_churn_prevention:
    description: "ダウングレード・解約を防ぐ"
    actions:
      - "リスク顧客への介入"
    expected_revenue_protection: "+$10K"
    timeframe: "ongoing"
```

#### ステップ 3: トレードオフ評価

```yaml
evaluation:
  opportunity_1:
    impact: 0.85
    alignment: 0.90  # 既存顧客重視
    efficiency: 0.95  # 低コスト
    risk: 0.75
    score: 0.864

  opportunity_3:
    impact: 0.60
    alignment: 0.85
    efficiency: 0.90
    risk: 0.80
    score: 0.744

  combined_1_3:
    impact: 1.00  # $50K + $30K = $80K (Q2 目標に大きく貢献)
    alignment: 0.88
    efficiency: 0.92
    risk: 0.77
    score: 0.904  # 最高
```

#### ステップ 4: 判断

```yaml
decision:
  selected: "combined_1_3"
  autonomous: false
  governance_gate: true
  reason: "売上目標は戦略的判断。CEO 承認が必要"
```

#### ステップ 5: 領域横断構成

```yaml
integrated_plan:
  sales_actions:
    - action: "deal_456 の加速"
      owner: "sales_mike"
      support_needed:
        - from: "cs"
          what: "顧客の現在の利用状況と成功事例"
        - from: "finance"
          what: "ROI 計算資料"
      timeline: "week 1-4"

    - action: "deal_789 の差別化強化"
      owner: "sales_jane"
      support_needed:
        - from: "product"
          what: "競合との機能比較表"
        - from: "marketing"
          what: "差別化メッセージング"
      timeline: "week 1-3"

    - action: "アップセル機会 30 社へのアプローチ"
      owner: "sales_team"
      support_needed:
        - from: "cs"
          what: "顧客の健全性データ + 拡大機会の分析"
      timeline: "week 2-6"

  cs_actions:
    - action: "アップセル対象顧客のサポート強化"
      purpose: "満足度を高め、アップセルの成功率を向上"
      timeline: "week 2-6"

    - action: "deal_456 顧客の成功事例を構造化"
      feeds_into: "sales.deal_456_acceleration"
      timeline: "week 1"

  product_actions:
    - action: "競合比較表の作成"
      feeds_into: "sales.deal_789_differentiation"
      timeline: "week 1"

  marketing_actions:
    - action: "差別化メッセージングの精緻化"
      feeds_into: "sales.deal_789_differentiation"
      timeline: "week 1-2"

  finance_actions:
    - action: "ROI 計算ツールの提供"
      feeds_into: "sales.deal_456_acceleration"
      timeline: "week 1"

  coordination:
    weekly_review:
      participants: ["sales_lead", "cs_lead", "cfo"]
      agenda: "商談進捗、ブロッカー、予測更新"
```

## Governance Gate の詳細

### Gate のトリガー条件

```yaml
governance_triggers:
  high_impact:
    condition: "予想される影響が組織の KPI に 10% 以上の変化"
    例: "売上、顧客維持率、コスト構造"

  high_irreversibility:
    condition: "一度実行すると元に戻せない、または戻すコストが高い"
    例: "人員削減、価格変更、市場撤退"

  high_uncertainty:
    condition: "結果の予測信頼度が 60% 以下"
    例: "新市場進出、未検証の施策"

  high_cost:
    condition: "コストが閾値を超える"
    例: "$10K 以上の支出"

  boundary_proximity:
    condition: "Purpose の Boundary に近い判断"
    例: "予算上限の 80% を使用"

  cross_domain:
    condition: "3 つ以上の部門にまたがる施策"
    例: "全社的な戦略転換"
```

### Gate でのプレゼンテーション

人間に提示される情報：

```yaml
governance_presentation:
  executive_summary:
    decision: "Q1 売上未達への対応"
    recommendation: "商談加速 + 既存顧客アップセル"
    expected_impact: "+$80K revenue in Q2"
    cost: "$5K"
    confidence: 0.77

  context:
    problem: "Q1 売上 $420K (目標 $500K)"
    root_cause: "大型商談遅延 + 新規契約減少"
    urgency: "Q2 で巻き返さないと、年間目標達成が困難"

  proposed_action:
    [詳細な行動計画]

  alternatives_considered:
    [評価された他の選択肢]

  risks_and_mitigation:
    risks:
      - "商談がさらに遅延するリスク (30%)"
      - "アップセル提案が顧客関係を損なうリスク (15%)"
    mitigation:
      - "商談は週次でレビューし、早期にエスカレーション"
      - "アップセルは健全性 80 以上の顧客のみに限定"

  required_approvals:
    - role: "CEO"
      reason: "売上目標に関わる戦略的判断"
    - role: "CFO"
      reason: "予算配分の変更"
```

人間の判断：
- **承認**: 計画が実行される
- **修正**: 人間が調整を加える（例: 「アップセル対象を 30 社→20 社に減らす」）
- **却下**: 代替案を検討するか、ギャップを受容する

## まとめ

Layer 2 (Reasoning) は、Neural Organization の「戦略的思考」である。

**設計の核心**:
1. **創発的推論**: ワークフローではなく、状況と目的から行動を導出
2. **領域横断構成**: 複数部門を統合した行動計画を自動的に構成
3. **トレードオフの定量評価**: Purpose に基づいて選択肢を評価
4. **不確実性の明示**: 判断の信頼度を定量化
5. **Governance との協働**: 重要な判断は人間にエスカレーション

この Reasoning により、Layer 3 (Execution) で実行される具体的な行動が決定される。
