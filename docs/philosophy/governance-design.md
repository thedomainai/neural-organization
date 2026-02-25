# Governance の詳細設計

## 論点

人間がシステムの自律的な行動をどのように統治し、信頼の蓄積に応じて自律範囲をどう拡大し、AGI 時代の「立憲的な統治」をどう実現するべきか。

## Governance の本質

### なぜ Governance が必要か

Neural Organization は高度な自律性を持つ。しかし、無制限の自律は危険である。

**Governance なしで起こりうる問題**:
- システムが組織の価値観に反する行動を取る
- 不可逆的な損害を生む判断を自律的に実行する
- 人間が意図しない方向に組織が進化する
- システムへの過度な依存により、人間が判断能力を失う（deskilling）

Governance は、システムの自律性と人間の統制のバランスを取る仕組みである。

### Governance と Control の違い

| Control（制御） | Governance（統治） |
|---|---|
| 逐一の指示 | 原則の設定 |
| マイクロマネジメント | 戦略的監督 |
| 「何をするか」を指示 | 「何を許容するか」を定義 |
| システムは受動的 | システムは能動的 |
| 人間の負荷が高い | 人間の負荷が最適化される |

Governance は**立憲的統治**である。Ostrom (1990) が共有資源の管理において「ルールと原則による統治」が持続可能な協調を生むことを実証したように、憲法が権力を制約するのと同じ構造で、Governance はシステムの行動を制約する。Davis, Schoorman & Donaldson (1997) のスチュワードシップ理論は、エージェントを監視・統制するモデル（エージェンシー理論）よりも、信頼に基づいて自律性を付与するモデルの方が、組織パフォーマンスが高くなることを示した。Governance が Control ではなく統治である理由は、この実証的知見に基づく。

### Governance の設計原理

**原理 1: 段階的な信頼構築**

初期は厳格に統治し、信頼が蓄積されるにつれて自律範囲を拡大する。Hersey & Blanchard (1977) の状況適応型リーダーシップでは、部下の成熟度に応じてリーダーシップスタイルを段階的に変化させる（指示型→説得型→参加型→委任型）。Lewicki, Tomlinson & Gillespie (2006) の信頼段階モデルも、信頼は計算的信頼→知識ベースの信頼→同一化に基づく信頼へと発展することを示す。本設計の信頼レベル（Cold Start→Learning→Trusted→Highly Trusted）はこれらの段階モデルを Human-AI 文脈に適用したものである。

**原理 2: 例外処理としての人間**

すべての判断を人間が承認するのではなく、「例外的な判断」のみを人間が扱う。

**原理 3: 人間の注意の最適配分**

人間の注意は有限であり、最もレバレッジの高い判断に集中させる。

**原理 4: 透明性の保証**

システムのあらゆる判断は、人間が望めば理由と根拠を確認できる。Lee & See (2004) は、自動化への信頼が適切に較正されるためには、システムの内部状態・推論過程・能力限界が透明であることが不可欠であると論じた。透明性なしには、過信（overtrust）または不信（distrust）のいずれかに偏る。

**原理 5: 人間の最終決定権**

システムがどれだけ自律的でも、人間はいつでも判断を覆せる。

## Governance の構造

Governance は 2 つの Gate を持つ：

### Gate 1: Layer 2 (Reasoning) の出口

**判断の重要度・不可逆性・不確実性が閾値を超える場合、人間の承認を要求する**

#### トリガー条件

```yaml
layer2_gate_triggers:
  high_impact:
    condition: "組織の重要 KPI に 10% 以上の影響"
    examples:
      - "売上、顧客維持率、利益率への大きな影響"
      - "組織構造の変更"
    threshold: 0.10

  high_irreversibility:
    condition: "元に戻すコストが実行コストの 5 倍以上"
    examples:
      - "人員削減（再雇用は困難）"
      - "価格変更（顧客の信頼に影響）"
      - "市場撤退（再参入は困難）"
    threshold: 5.0

  high_uncertainty:
    condition: "予測の信頼度が 60% 以下"
    examples:
      - "新市場進出（データが少ない）"
      - "未検証の施策"
    threshold: 0.60

  high_cost:
    condition: "コストが閾値を超える"
    default_threshold: "$10K"
    adjustable: true
    note: "組織の規模に応じて調整"

  boundary_proximity:
    condition: "Purpose の Boundary に抵触または近接"
    examples:
      - "予算上限の 90% を使用"
      - "倫理的境界に近い判断"
    threshold: 0.90

  cross_domain_coordination:
    condition: "3 つ以上の部門にまたがる施策"
    examples:
      - "全社的なプロセス変更"
      - "複数部門の予算再配分"
    threshold: 3
```

#### 判断フロー

```
Reasoning が行動計画を生成
    ↓
Gate 1 評価: トリガー条件を満たすか？
    ↓
YES → 人間に提示
    ↓
人間の判断:
  - 承認 → Layer 3 (Execution) へ
  - 修正 → Reasoning で再計画
  - 却下 → 代替案を検討
    ↓
NO → Layer 3 (Execution) へ（自律実行）
```

### Gate 2: Layer 3 (Execution) の出口

**不可逆性の高いアクション（外部への送信、資金移動等）は人間の承認を要求する**

#### トリガー条件

```yaml
layer3_gate_triggers:
  external_communication:
    condition: "外部への重要なコミュニケーション"
    examples:
      - "顧客へのメール送信（契約変更、価格変更）"
      - "プレスリリース"
      - "パートナーへの提案"
    threshold: "medium importance 以上"

  financial_transaction:
    condition: "金銭の移動"
    examples:
      - "支払い実行"
      - "契約締結"
      - "返金処理"
    threshold: "$1K 以上"

  data_modification:
    condition: "重要データの変更・削除"
    examples:
      - "顧客データの削除"
      - "契約条件の変更"
    threshold: "critical data"

  system_changes:
    condition: "本番システムへの変更"
    examples:
      - "プロダクトのデプロイ"
      - "価格設定の変更"
    threshold: "high impact changes"
```

## 二重フィルタリング原則

人間の注意は有限である。Governance Gate に到達する前に、システムは自己評価を行う。

### 自己評価のプロセス

```yaml
self_evaluation:
  step_1_quality_check:
    description: "アウトプットが基準を満たすか"
    criteria:
      - "文法・スペルミスがない"
      - "ブランドガイドラインに準拠"
      - "データの正確性"
      - "論理的整合性"
    pass_threshold: 0.95

  step_2_alignment_check:
    description: "Purpose との整合性"
    criteria:
      - "Why（存在目的）に貢献するか"
      - "Where（目標）に向かうか"
      - "How（価値観）と一致するか"
      - "Boundary（制約）を侵害しないか"
    pass_threshold: 0.90

  step_3_risk_assessment:
    description: "リスクの評価"
    criteria:
      - "予期しない副作用のリスク"
      - "ステークホルダーへの影響"
      - "長期的な影響"
    acceptable_risk: 0.20

  outcome:
    pass: "Governance Gate へ進む"
    fail: "自動却下 or 再生成"
```

### 人間の注意の最適配分

```
全ての提案: 100 件
    ↓
自己評価で不合格: 30 件（自動却下）
    ↓
残り: 70 件
    ↓
Governance Gate 評価:
  - 自律実行: 50 件（低リスク・低影響）
  - 人間の承認が必要: 20 件
    ↓
人間が扱う判断: 20 件のみ（全体の 20%）
```

人間の注意は、**品質確認**ではなく、**価値判断・倫理判断・戦略判断**— 人間にしかできない判断 — に集中する。

### Context Budget（人間の注意予算）

不変原理「コンテキストは有限資源」（[invariant-principles.md](../invariant-principles.md) 原理4）は、人間の注意を「予算」として定量化し、Governance Gate に到達する情報量を制御する必要性を主張する。

**原理4 の形式的表現**:
```
human_attention_budget = available_attention - governance_overhead
governance_overhead <= 0.20 * available_attention  (上限)
```

この制約は、二重フィルタリングが単なる品質保証ではなく、**人間の認知容量を保護するメカニズム**であることを明示する。

#### 参与形態別の注意予算

各参与形態は、週あたりの利用可能な注意容量が異なる。

```yaml
attention_budget_by_role:
  governor:
    weekly_capacity: "2 hours"
    allocation:
      strategic_decisions: 0.50    # 1h/week
      governance_gate_review: 0.30  # 36min/week
      system_health_check: 0.20    # 24min/week

    overload_threshold: "承認待ち件数 > 5件/日"
    overload_response: |
      信頼スコアの高い領域（trust_score > 0.85）の Gate 閾値を
      一時的に引き上げ、自律実行の範囲を拡大

  sensemaker:
    weekly_capacity: "3 hours"
    allocation:
      qualitative_input: 0.50       # 1.5h/week
      system_verification: 0.30     # 54min/week
      blind_spot_identification: 0.20  # 36min/week

    overload_threshold: "入力要求 > 10件/週"
    overload_response: "優先度の低い入力要求を翌週に延期"

  creator:
    weekly_capacity: "variable (継続的)"
    allocation:
      ideation: "非構造的（創造活動は予算化しない）"
      system_feedback: 0.20

  connector:
    weekly_capacity: "variable (対人関係構築)"
    allocation:
      relationship_building: "非構造的"
      system_integration: 0.10

  custodian:
    weekly_capacity: "5 hours"
    allocation:
      monitoring: 0.40              # 2h/week
      ethical_review: 0.30          # 1.5h/week
      rule_setting: 0.30            # 1.5h/week

    overload_threshold: "アラート > 15件/週"
    overload_response: "軽微なアラートを抑制、重大度の高いもののみ表示"
```

#### Gate 通過率の予算制約

二重フィルタリングの「全体の20%のみが人間に到達」という設計は、原理4 の `governance_overhead <= 0.20 * available_attention` を実装したものである。

```yaml
gate_throughput_budget:
  total_proposals_per_week: 100  # システムが生成する提案総数

  stage_1_self_evaluation:
    input: 100
    auto_rejected: 30  # 品質・整合性・リスク基準で不合格
    output: 70

  stage_2_governance_gate:
    input: 70
    auto_approved: 50  # 低リスク・低影響・高信頼領域
    requires_human_approval: 20

  human_attention_consumed:
    proposals_to_review: 20
    avg_time_per_proposal: "5 minutes"
    total_time: "100 minutes/week = 1.67 hours/week"

  budget_compliance:
    governor_budget: "2 hours/week"
    consumed: "1.67 hours"
    remaining: "0.33 hours (20 minutes)"
    status: "within budget"
```

#### 予算オーバーフロー時の対策

人間の注意予算が枯渇しそうな場合、システムは以下の対策を自律的に実行する。

```yaml
overflow_mitigation:
  trigger_conditions:
    - "承認待ちキューの深さ > 閾値"
    - "週次予算の 80% を水曜日までに消費"
    - "複数の参与形態が同時にオーバーロード"

  mitigation_strategies:
    priority_1_defer_low_priority:
      description: "優先度の低い提案を翌週に延期"
      criteria: "priority < 0.50"
      expected_reduction: "20-30%"

    priority_2_batch_similar:
      description: "類似した提案をバッチ化して一括承認"
      criteria: "同一カテゴリ・同一リスクレベル"
      expected_reduction: "15-20%"

    priority_3_raise_autonomy:
      description: "信頼スコアの高い領域の自律範囲を一時的に拡大"
      criteria: "trust_score > 0.85 and historical_approval_rate > 0.95"
      expected_reduction: "30-40%"
      duration: "一時的（翌週には元に戻す）"

    priority_4_escalate:
      description: "人間に予算枯渇を通知し、優先度の再評価を依頼"
      trigger: "上記3策でも解消しない場合"
```

#### Context Budget と Trust Score の相互作用

信頼スコアの向上は、Governance Gate を通過する提案数を自然減少させ、人間の注意予算を保全する。

```yaml
trust_score_impact_on_budget:
  scenario_low_trust:
    trust_score: 0.40  # Cold Start
    auto_approval_rate: 0.10  # 10% のみ自律実行
    human_review_required: 0.90  # 90% が承認必要
    attention_consumed: "9 hours/week（予算を大幅超過）"

  scenario_medium_trust:
    trust_score: 0.70  # Learning → Trusted
    auto_approval_rate: 0.50  # 50% 自律実行
    human_review_required: 0.50
    attention_consumed: "5 hours/week（予算内）"

  scenario_high_trust:
    trust_score: 0.90  # Highly Trusted
    auto_approval_rate: 0.85  # 85% 自律実行
    human_review_required: 0.15
    attention_consumed: "1.5 hours/week（予算の 75% が空く）"

  insight: |
    信頼の蓄積は、人間の注意を戦略的判断に再配分できることを意味する。
    Cold Start では予算の大半が承認作業に消費されるが、
    Highly Trusted に到達すれば、人間は新しい領域の探索や
    Purpose の進化に注意を向けられる。
```

## 信頼の蓄積と自律範囲の拡大

### 信頼スコアの算出

システムへの信頼は、過去のパフォーマンスに基づいて定量化される。Mayer, Davis & Schoorman (1995) の信頼の統合モデルは、信頼が **Ability**（能力）、**Benevolence**（善意）、**Integrity**（誠実さ）の 3 要素で構成されることを示した。本設計の Trust Score 4 要素は、このモデルを操作的に分解したものである：

- **success_rate**（提案承認率）→ Ability の近似指標
- **outcome_quality**（結果品質）→ Ability の実績検証
- **alignment_score**（Purpose 整合性）→ Integrity の近似指標
- **risk_management**（リスク評価精度）→ Ability + Integrity の複合指標

なお、Mayer et al. の Benevolence（善意）に直接対応する要素は含まれていない。AI に善意を帰属させることの理論的妥当性は活発に議論中であり（学術的根拠セクション参照）、本設計では善意の代わりに行動実績（outcome_quality, alignment_score）で信頼を構成する判断を取っている。

```yaml
trust_score_components:
  success_rate:
    description: "提案が承認される割合"
    weight: 0.30
    calculation: "承認数 / 総提案数"
    example: "80 件承認 / 100 件提案 = 0.80"

  outcome_quality:
    description: "実行された行動の結果の品質"
    weight: 0.35
    calculation: "期待した結果が得られた割合"
    example: "予測: 売上 +$50K、実績: +$48K → quality = 0.96"

  alignment_score:
    description: "Purpose との整合性"
    weight: 0.20
    calculation: "人間の修正が少ないほど高い"
    example: "100 件中 10 件修正 → alignment = 0.90"

  risk_management:
    description: "リスク評価の正確性"
    weight: 0.15
    calculation: "予測したリスクが実際に発生したか"
    example: "リスク予測 30%、実際の発生率 28% → accuracy = 0.93"

overall_trust_score:
  formula: |
    (success_rate * 0.30) +
    (outcome_quality * 0.35) +
    (alignment_score * 0.20) +
    (risk_management * 0.15)
  example: |
    (0.80 * 0.30) + (0.96 * 0.35) + (0.90 * 0.20) + (0.93 * 0.15)
    = 0.24 + 0.336 + 0.18 + 0.140
    = 0.896
```

### 信頼レベルと自律範囲

```yaml
trust_levels:
  level_0_cold_start:
    trust_score: "< 0.50"
    period: "導入後 0-3 ヶ月"
    autonomous_threshold:
      cost: "$1K"
      impact: "5%"
      irreversibility: "low"
    approval_required: "ほぼすべての判断"
    description: "システムの能力が未検証。厳格に統治"

  level_1_learning:
    trust_score: "0.50 - 0.70"
    period: "3-12 ヶ月"
    autonomous_threshold:
      cost: "$5K"
      impact: "10%"
      irreversibility: "low-medium"
    approval_required: "中程度以上の影響"
    description: "パターンが形成され始める。部分的に委譲"

  level_2_trusted:
    trust_score: "0.70 - 0.85"
    period: "12-24 ヶ月"
    autonomous_threshold:
      cost: "$20K"
      impact: "15%"
      irreversibility: "medium"
    approval_required: "高影響・高リスクの判断"
    description: "信頼が確立。多くの判断を自律実行"

  level_3_highly_trusted:
    trust_score: "> 0.85"
    period: "24 ヶ月以降"
    autonomous_threshold:
      cost: "$50K"
      impact: "20%"
      irreversibility: "medium-high"
    approval_required: "戦略的・不可逆的な判断のみ"
    description: "高度な自律性。人間は例外処理に集中"
```

### 信頼の動的調整

信頼は固定ではなく、パフォーマンスに応じて動的に調整される。de Visser et al. (2020) は、Human-AI 協調において適応的な信頼較正（adaptive trust calibration）が不可欠であることを示した。信頼が静的であると、システムの能力変化や環境変化に対応できず、過信または不信が固定化する。本設計の動的調整メカニズム — 成功による信頼増加、失敗による信頼減少、非活動時の減衰 — は、この適応的信頼較正の実装である。

```yaml
trust_adjustment:
  positive_events:
    - event: "提案が承認され、期待した結果を生んだ"
      impact: "+0.01 per success"

    - event: "人間が修正なく承認"
      impact: "+0.02"

    - event: "予測が正確だった"
      impact: "+0.01"

  negative_events:
    - event: "提案が却下された"
      impact: "-0.02 per rejection"

    - event: "実行後、期待した結果が得られなかった"
      impact: "-0.05"

    - event: "重大なミス（顧客への損害、財務損失）"
      impact: "-0.10 to -0.20"

  decay:
    description: "信頼は時間とともに減衰（継続的なパフォーマンスが必要）"
    rate: "-0.005 per month without activity"
```

## 人間の参与形態と Governance

### Governor（統治者）

**役割**: 組織の Purpose を定義し、システムの方向性を監督する。

**Governance における責任**:
- Purpose の定義・更新
- 信頼レベルと自律範囲の承認
- 戦略的判断の最終承認
- システムの行動が Purpose と整合しているかの監査

**関与頻度**:
- 定期的な戦略レビュー（月次・四半期）
- 重要判断のエスカレーション時（随時）

### Sensemaker（意味付与者）

**役割**: データが捉えられない主観的現実をシステムに翻訳する。

**Governance における責任**:
- システムの理解が現実と乖離していないかを監視
- 「データでは見えないが重要なこと」を指摘
- 文化・感情・空気感に関する判断への関与

### Creator（創造者）

**役割**: まだ存在しないものを構想する。

**Governance における責任**:
- イノベーションに関わる判断の承認
- システムが提案しない「まだ存在しない選択肢」の提示

### Connector（接続者）

**役割**: 人間同士の信頼・共感・関係性を構築する。

**Governance における責任**:
- 外部とのコミュニケーション（顧客、パートナー）の承認
- システムが生成した対外メッセージの最終確認

### Custodian（守護者）

**役割**: システムの行動が倫理・法規制・社会規範と整合しているかを監視する。

**Governance における責任**:
- 倫理的境界に近い判断の審査
- 法的リスクの評価
- コンプライアンス違反の検出
- システムの暴走の監視

## Governance の実装例

### 例 1: 価格変更の判断

```yaml
scenario: "エンタープライズプランの価格を 20% 引き下げる提案"

layer2_reasoning:
  proposal:
    action: "価格を $1000/月 → $800/月 に変更"
    expected_impact: "新規契約 +20%, 既存顧客満足度 +10%"
    cost: "短期的な売上減 -$50K/月"
    confidence: 0.65

  gate1_evaluation:
    high_impact: true  # 売上に直接影響
    high_irreversibility: true  # 値上げは困難
    high_cost: true  # -$600K/年
    → Governance Gate トリガー

governance_request:
  decision_type: "strategic_pricing"
  approvers_required: ["cfo", "ceo"]

  presentation:
    context: |
      エンタープライズセグメントの新規獲得が低迷。
      競合が平均 $850/月。我々の価格が 18% 高い。

    recommendation: "価格を $800/月 に引き下げ"

    expected_outcomes:
      positive:
        - "新規契約 月 5 件 → 8 件 (+60%)"
        - "市場競争力の向上"
        - "既存顧客の満足度向上（自動適用）"
      negative:
        - "短期的な売上減 -$50K/月"
        - "ブランド価値の低下リスク"

    alternatives:
      - name: "機能追加で差別化"
        pros: "価格維持、付加価値向上"
        cons: "時間がかかる（3-6 ヶ月）"

      - name: "セグメント別価格設定"
        pros: "柔軟性、既存顧客への影響なし"
        cons: "複雑性、公平性の問題"

    recommendation_rationale: |
      価格が最大の障壁。機能ギャップは小さい。
      早期に競争力を回復することが重要。

  cfo_decision:
    decision: "承認（条件付き）"
    condition: "6 ヶ月後に再評価。新規契約が +50% 未満なら値上げ検討"
    reasoning: "短期的な売上減は許容できるが、成果が出なければ是正"

  ceo_decision:
    decision: "承認"
    reasoning: "顧客中心主義の Purpose と整合。長期的な市場シェアを優先"

outcome:
  approved: true
  execution_plan:
    - "2024-03-01 から新価格適用"
    - "既存顧客にも自動適用（満足度向上のため）"
    - "月次で契約数を監視"
    - "6 ヶ月後に CFO + CEO で再評価"
```

### 例 2: 顧客へのメール送信

```yaml
scenario: "解約リスクの高い顧客 20 社にアウトリーチメールを送信"

layer3_execution:
  action: "パーソナライズされたメール 20 通を生成"
  content_sample: |
    件名: Acme Corp 様の成功をサポートさせてください

    John 様

    最近、Acme Corp 様のプラットフォーム利用が減少していることに気づきました。
    何か問題がございましたら、ぜひお聞かせください。

    我々のチームが...

  gate2_evaluation:
    external_communication: true  # 顧客へのメール
    importance: "medium-high"  # 解約リスク対応
    → Governance Gate トリガー

  self_evaluation:
    quality_check:
      grammar: 1.00
      brand_alignment: 0.95
      personalization: 0.90
      tone: 0.92
    outcome: "pass"

governance_request:
  approver: "csm_lead"
  review_type: "batch_approval"  # 20 件をまとめてレビュー

  sample_emails: [email_1, email_2, email_3]  # 代表例を提示

  csm_lead_decision:
    decision: "承認（一部修正）"
    modification: |
      "利用が減少していることに気づきました" → やや押し付けがましい
      → "最近お忙しいかと思いますが、何かサポートできることはありますか？" に変更

    approval: "修正版で 20 件すべて送信可"

outcome:
  emails_sent: 20
  modification_learned: |
    Memory に記録:
    「解約リスク顧客へのアウトリーチでは、
     問題を指摘するよりも、サポート提供を前面に出す」
```

## Governance の進化

### Phase 1: 厳格な統治（導入初期）

```yaml
characteristics:
  trust_level: "low (< 0.50)"
  approval_rate: "80%"  # 8 割の判断が人間の承認を要求
  autonomous_decisions: "定型的なタスクのみ"

human_experience:
  workload: "高い（多くの承認が必要）"
  role: "すべてを確認する"
```

### Phase 2: 選択的委譲（学習期）

```yaml
characteristics:
  trust_level: "medium (0.50 - 0.70)"
  approval_rate: "50%"
  autonomous_decisions: "繰り返しタスク + 低リスク判断"

human_experience:
  workload: "中程度"
  role: "重要な判断を承認"
```

### Phase 3: 例外処理（成熟期）

```yaml
characteristics:
  trust_level: "high (0.70 - 0.85)"
  approval_rate: "20%"
  autonomous_decisions: "ほとんどの判断"

human_experience:
  workload: "低い"
  role: "戦略的判断と例外処理に集中"
```

### Phase 4: 協働進化（最適化期）

```yaml
characteristics:
  trust_level: "very high (> 0.85)"
  approval_rate: "10%"
  autonomous_decisions: "戦略的判断以外のすべて"

human_experience:
  workload: "最小限"
  role: "Purpose の進化、イノベーション、倫理的監督"
```

## リスク管理

### Governance が失敗するパターン

| リスク | 説明 | 対策 |
|---|---|---|
| Over-delegation | 信頼が過度に高まり、人間が監視を怠る | 定期的な監査、重要判断は常に Gate を通す |
| Under-delegation | 信頼が蓄積されても自律範囲が拡大しない | 信頼スコアに基づく自動調整 |
| Gaming | システムが承認されやすい提案のみを出す | 多様性の評価、イノベーション提案の奨励 |
| Drift | システムの判断が Purpose から徐々に乖離 | 定期的な Purpose との整合性評価 |
| Human deskilling | 人間が判断能力を失う | 重要判断は常に人間が行う、教育・訓練 |

### 監査と是正

```yaml
regular_audit:
  frequency: "quarterly"
  scope:
    - "過去 3 ヶ月の全判断をレビュー"
    - "Purpose との整合性を評価"
    - "信頼スコアの妥当性を検証"

  output:
    - "Governance の効果レポート"
    - "信頼レベルの調整提案"
    - "Purpose の更新提案（必要に応じて）"

emergency_override:
  trigger: "重大なミス、倫理的違反、法的問題"
  action:
    - "システムの自律実行を一時停止"
    - "全判断を人間の承認必須に戻す"
    - "原因分析と是正"
    - "信頼レベルをリセット"
```

## まとめ

Governance は Neural Organization の「安全装置」であり、同時に「信頼の基盤」である。

**設計の核心**:
1. **二重 Gate**: Reasoning と Execution の両方で統治
2. **二重フィルタリング**: システムの自己評価 → 人間の判断
3. **段階的信頼**: 信頼の蓄積に応じて自律範囲を拡大
4. **人間の注意の最適化**: 品質確認ではなく、戦略・倫理判断に集中
5. **透明性**: すべての判断の理由を人間が確認可能
6. **最終決定権**: 人間はいつでもシステムを override 可能

この Governance により、システムは高度な自律性を持ちながら、人間の統制下に置かれる。

## 学術的根拠

Governance の設計は、以下の学術的知見に基づいている。

### 信頼の統合モデル

Mayer, R.C., Davis, J.H. & Schoorman, F.D. (1995). "An Integrative Model of Organizational Trust." *AMR*, 20(3), 709-734.

信頼が Ability（能力）、Benevolence（善意）、Integrity（誠実さ）の 3 要素で構成されることを示した、組織信頼研究の基盤的論文である。Trust Score の 4 要素（success_rate, outcome_quality, alignment_score, risk_management）は、このモデルの Ability と Integrity を操作的に分解したものである。

### 信頼段階モデル

Lewicki, R.J., Tomlinson, E.C. & Gillespie, N. (2006). "Models of Interpersonal Trust Development." *JoM*, 32(6), 991-1022.

信頼が計算的信頼（calculus-based）→知識ベースの信頼（knowledge-based）→同一化に基づく信頼（identification-based）へと段階的に発展することを示した。本設計の 4 段階の信頼レベル（Cold Start→Learning→Trusted→Highly Trusted）はこの発展モデルに対応する。Cold Start は計算的信頼（実績の蓄積による予測可能性の確立）、Highly Trusted は知識ベースの信頼（パターン理解に基づく高い予測可能性）に相当する。

### 状況適応型リーダーシップ

Hersey, P. & Blanchard, K.H. (1977). *Management of Organizational Behavior.* Prentice-Hall.

部下の成熟度（能力 + 意欲）に応じてリーダーシップスタイルを変化させるモデルである。指示型（Telling）→説得型（Selling）→参加型（Participating）→委任型（Delegating）の 4 段階は、Governance の段階的権限拡大 — 承認必須→部分委譲→例外処理→戦略的監督 — と構造的に対応する。

### 自動化への信頼

Lee, J.D. & See, K.A. (2004). "Trust in Automation: Designing for Appropriate Reliance." *Human Factors*, 46(1), 50-80.

自動化への信頼が適切に較正されるための条件を体系化した論文である。過信（overtrust）と不信（distrust）の両方が有害であり、適切な信頼較正には透明性（システムの能力・限界・推論過程の可視化）が不可欠であることを示した。Governance の原理 4「透明性の保証」はこの知見の直接的実装である。

### 適応的信頼較正

de Visser, E.J. et al. (2020). "Adaptive Trust Calibration for Human-AI Collaboration." *PLOS ONE*.

Human-AI 協調において、信頼は静的に設定するのではなく、パフォーマンスフィードバックに基づいて動的に較正されるべきことを示した。信頼の動的調整メカニズム（成功/失敗による増減、非活動時の減衰）はこの知見に基づく。

### スチュワードシップ理論

Davis, J.H., Schoorman, F.D. & Donaldson, L. (1997). "Toward a Stewardship Theory of Management." *AMR*, 22(1), 20-47.

エージェンシー理論（監視と統制によるガバナンス）に対抗し、信頼と自律性の付与がより高い組織パフォーマンスをもたらすことを主張した。Governance が「Control ではなく統治」を標榜する根拠であり、段階的に自律範囲を拡大する設計の理論的基盤である。

### 批判的注記

**信頼の単一スコアへの縮約**: Mayer et al. の信頼モデルは多次元的であり、これを加重和の単一スコアに縮約することは情報の損失を伴う。たとえば、Ability が高く Integrity が低いエージェントと、Ability が低く Integrity が高いエージェントが同じスコアになりうる。本設計ではこの限界を認識した上で、Governance の自動化に必要な操作的簡潔さとのトレードオフとして単一スコアを採用している。

**AI への Benevolence 帰属**: Mayer et al. の 3 要素のうち Benevolence（善意）は、信頼対象が相手の利益を考慮する意図を持つことを前提とする。AI に意図や善意を帰属させることの理論的妥当性は、AI 倫理・哲学の分野で活発に議論されている。本設計では、善意の帰属ではなく行動実績（Purpose との整合性、結果品質）で代替する設計判断を取っている。

**Hersey-Blanchard モデルの限界**: 状況適応型リーダーシップモデルは直感的にわかりやすいが、実証的支持は限定的である（Graeff, 1997）。本設計では、モデルの詳細な段階区分ではなく「成熟度に応じた権限委譲」という基本的な方向性のみを採用している。
