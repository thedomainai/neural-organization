# Interface の詳細設計

## 論点

人間が Neural Organization とどのように相互作用し、Purpose を注入し、Governance を行い、Sensemaker として情報を提供し、透明性を確保し、Agency（主体性）を保つべきか。

## Interface の本質

### Interface とは何か

これは「UX デザイン」ではない。ツールの使い勝手の話ではないからである。

Interface は、**人間と組織知能がどのように共存するかという、新しい種類の関係性の設計**である。

従来のソフトウェア UI は「人間がツールを操作する」ことを前提とする。Neural Organization の Interface は「人間が組織知能と協働する」ことを前提とする。

| 従来の UI | Neural Organization Interface |
|---|---|
| ボタン・フォーム | 会話・意志の伝達 |
| 操作 | 統治 |
| データの入力 | 文脈・価値観の共有 |
| 結果の表示 | 能動的なインサイト表出 |
| 受動的（人間が開く） | 環境的（常にそこにいる） |

### Interface の設計原理

**原理 1: Intent over Instruction（指示ではなく意志を）**

人間はシステムに「何をしろ」と指示するのではなく、「何を望むか」を伝える。

**原理 2: Governance, not Control（制御ではなく統治を）**

人間はソフトウェアを「操作する」のではなく、組織知能を「統治する」。

**原理 3: Ambient Presence（環境的存在）**

システムは「開いて使う」ものではない。常にそこにいて、必要なときに適切な形で人間に関与する。

**原理 4: Radical Transparency（徹底的な透明性）**

システムのあらゆる推論・判断・行動は、人間が望めばいつでも理由と根拠を確認できる。

**原理 5: Agency Preservation（人間の主体性の保全）**

システムの自律性がどれだけ高まっても、人間は常に主体であり続ける。

**原理 6: Mutual Evolution（相互進化）**

人間とシステムは一方的な関係ではなく、相互に高め合う循環構造を形成する。

## Interface の 5 つのモード

### Mode 1: Intent Interface（意志の伝達）

**人間が Purpose を注入し、方向性を示す界面**

#### 初期 Purpose の定義

```yaml
interaction_example:
  system: |
    Neural Organization へようこそ。
    まず、組織の Purpose を定義しましょう。

    この組織はなぜ存在していますか？

  governor: |
    顧客のビジネスを成功させるためです。
    我々のプロダクトを使うことで、
    顧客がより効率的に働けるようにしたい。

  system: |
    素晴らしい。もう少し具体的に教えてください。
    「顧客の成功」とは、具体的にどのような状態ですか？

  governor: |
    - 業務時間を削減できる
    - より良い意思決定ができる
    - ビジネスを成長させられる

  system: |
    理解しました。次に、トレードオフについて教えてください。
    以下のどちらを優先しますか？

    A: 顧客満足を最優先し、短期収益を犠牲にしてもよい
    B: 短期収益を優先し、顧客満足はバランスを取る
    C: その他（具体的に教えてください）

  governor: |
    A です。顧客満足を優先します。

  system: |
    定量的には、どの程度の重み付けですか？

    [スライダー表示]
    顧客満足: 70%  ←→  収益: 30%

  governor: |
    これで良いです。

  system: |
    Purpose を定義しました。

    [Purpose の YAML を表示]

    これで問題ありませんか？
    "承認" すると、この Purpose に基づいて行動します。

  governor: |
    承認します。
```

#### 継続的な意志の伝達

```yaml
intent_communication:
  scenario: "Governor が新たな目標を伝える"

  input_modes:
    conversational:
      governor: "顧客維持率を 95% まで向上させたい"
      system: "理解しました。現在 88% です。+7% の改善が必要です"

    declarative:
      governor: "GOAL: retention_rate = 0.95 BY 2024-Q3"
      system: "目標を設定しました。達成のための計画を生成しています"

    contextual:
      governor: "最近、解約が増えている。何とかしてほしい"
      system: |
        過去 30 日で解約が 40% 増加しました。
        主な原因は v2.3 の UX 問題です。

        以下の対応を提案します:
        [行動計画]

        承認しますか？
```

### Mode 2: Governance Interface（統治の界面）

**人間がシステムの判断を承認・修正・却下する界面**

#### Governance Request の提示

```yaml
governance_ui:
  request_id: "gov_202402_price_change"

  presentation:
    summary:
      decision: "エンタープライズプランの価格を 20% 引き下げる"
      expected_impact: "新規契約 +60%, 売上 -$50K/月"
      confidence: 0.65

    context:
      problem: "エンタープライズ新規獲得が低迷"
      root_cause: "競合より価格が 18% 高い"
      urgency: "medium"

    recommendation:
      action: "$1000/月 → $800/月 に変更"
      reasoning: |
        価格が最大の障壁。機能ギャップは小さい。
        早期に競争力を回復することが重要。

    expected_outcomes:
      positive:
        - "新規契約 月 5 → 8 件 (+60%)"
        - "市場競争力の向上"
        - "既存顧客の満足度向上（自動適用）"
      negative:
        - "短期的な売上減 -$50K/月"
        - "ブランド価値低下のリスク"

    alternatives:
      - name: "機能追加で差別化"
        pros: "価格維持、付加価値向上"
        cons: "時間がかかる（3-6 ヶ月）"
        impact: "新規契約 +30% (delayed)"

      - name: "セグメント別価格"
        pros: "柔軟性、既存顧客への影響なし"
        cons: "複雑性、公平性の問題"

    risks:
      - risk: "ブランド価値の低下"
        probability: 0.25
        mitigation: "プレミアムプランを維持"

      - risk: "既存顧客の混乱"
        probability: 0.15
        mitigation: "丁寧なコミュニケーション"

    required_approvers:
      - role: "CFO"
        reason: "財務影響"
      - role: "CEO"
        reason: "戦略的判断"

  user_actions:
    - action: "approve"
      label: "承認"
      effect: "計画を実行"

    - action: "approve_with_modification"
      label: "修正して承認"
      effect: "調整を加えて実行"

    - action: "reject"
      label: "却下"
      effect: "代替案を検討"

    - action: "request_more_info"
      label: "追加情報を要求"
      effect: "質問に回答"

  interaction:
    cfo: |
      承認します。ただし、6 ヶ月後に再評価してください。
      新規契約が +50% 未満なら値上げを検討します。

    system: |
      条件付き承認を記録しました。
      2024-08-12 に自動的に再評価を行います。

    ceo: |
      承認します。顧客中心主義の Purpose と整合しています。

    system: |
      承認されました。2024-03-01 から新価格を適用します。
```

#### バッチ承認

```yaml
batch_approval:
  scenario: "20 件の顧客アウトリーチメールを一括レビュー"

  ui:
    summary: "20 件のメール（リスク顧客へのアウトリーチ）"

    sample_preview:
      - email_1: "Acme Corp - John Doe"
        subject: "サポートのご案内"
        preview: "いつもご利用いただきありがとうございます..."
      - email_2: "Beta Inc - Jane Smith"
        ...
      - email_3: "Gamma LLC - Bob Wilson"
        ...

    common_pattern:
      tone: "professional_friendly"
      structure: "挨拶 → 文脈 → サポート提供 → クロージング"

    quality_score: 0.95

  user_actions:
    - action: "approve_all"
      label: "全て承認"

    - action: "approve_with_modification"
      label: "パターンを修正して承認"
      example: "tone を 'casual' に変更"

    - action: "review_individually"
      label: "個別にレビュー"
```

### Mode 3: Sensemaker Interface（意味付与の界面）

**人間が主観的・定性的な情報をシステムに伝える界面**

#### 定性的フィードバックの提供

```yaml
sensemaker_input:
  scenario: "CSM が顧客との会話で感じた「違和感」を伝える"

  csm: |
    今日、顧客 Acme の John と話しました。
    データ上は健全性スコア 85 で問題なしですが、
    会話の雰囲気が微妙でした。何か隠していた感じがします。

  system: |
    重要なインサイトをありがとうございます。
    具体的にどのような点が気になりましたか？

  csm: |
    - 通常は雑談があるのに、今日は業務的だった
    - プロダクトの話題を避けるような感じ
    - 「上と相談してから」という言い方が多かった

  system: |
    理解しました。以下の可能性を検討します:

    1. 社内で何らかの問題が発生している
    2. 競合の検討を始めている
    3. 予算削減の検討中

    追加で調査すべきことはありますか？

  csm: |
    Acme 社の最近のニュースや、
    競合の動向を確認してみてください。

  system: |
    調査を開始しました。
    Acme 社は先月、CFO が交代しています。
    これがコスト見直しの兆候かもしれません。

    顧客の健全性スコアを "attention_required" にマークし、
    2 週間以内に再度コンタクトすることを提案します。
```

#### 市場の「空気感」の伝達

```yaml
market_sensing:
  scenario: "営業が市場の変化を感じ取る"

  sales: |
    最近、商談で価格への言及が増えました。
    数字には出ていないですが、市場が価格に敏感になっている気がします。

  system: |
    過去 30 日の商談データを分析しました:
    - 「価格」に関する言及: +45%
    - 価格を理由とした交渉難航: +30%
    - 競合の価格比較: +60%

    あなたの直感は正しいようです。
    競合が最近、価格を下げた可能性があります。

    調査を深めますか？

  sales: |
    はい、お願いします。
```

### Mode 4: Transparency Interface（透明性の界面）

**システムの判断の理由・根拠を人間が確認できる界面**

#### 判断の理由の説明

```yaml
transparency_ui:
  scenario: "システムが顧客 X の解約リスクを 'high' と評価"

  user_question: "なぜ顧客 X の解約リスクが高いのか？"

  system_explanation:
    risk_score: 0.75
    confidence: 0.82

    contributing_factors:
      - factor: "ログイン頻度の減少"
        contribution: 0.35
        detail: "過去 30 日で -40% (25 → 15 回/月)"
        causal_link: "ログイン頻度 → 価値認識 → 解約確率"

      - factor: "サポートチケットの増加"
        contribution: 0.25
        detail: "過去 30 日で +150% (3 → 8 件)"
        causal_link: "問題の増加 → 不満 → 解約確率"

      - factor: "契約更新まで 90 日"
        contribution: 0.10
        detail: "更新前 90 日は検討期間"

      - factor: "競合の言及"
        contribution: 0.05
        detail: "Slack で競合製品への言及が 1 件"

    baseline_comparison:
      similar_customers: "同セグメントの平均解約リスク: 0.20"
      delta: "+0.55 (2.75x higher)"

    historical_pattern:
      similar_cases: 15
      churn_rate: 0.80 (12 / 15 が実際に解約)

    reasoning:
      "過去の類似パターンでは 80% が解約しており、
       主な前兆（ログイン減少 + サポート増加）が顕著に現れています。"

  drill_down:
    user: "ログイン頻度の減少の原因は？"

    system: |
      因果分析の結果:

      根本原因: v2.3 の UX 変更
      - リリース日: 2024-01-15
      - ログイン減少開始: 2024-01-29 (14 days lag)
      - 影響を受けた顧客: 25 社中 5 社

      顧客 X は v2.3 リリース後、
      新 UI への適応に苦労している可能性が高い。
```

#### 予測の根拠の提示

```yaml
prediction_transparency:
  user_question: "Q2 売上予測 $550K の根拠は？"

  system_explanation:
    prediction: "$550K"
    confidence_interval:
      90%: ["$490K", "$610K"]
      50%: ["$520K", "$580K"]

    components:
      - source: "既存パイプライン"
        value: "$420K"
        confidence: 0.85
        detail: "現在の商談が historical win rate で成約すると仮定"

      - source: "新規リード"
        value: "$80K"
        confidence: 0.60
        detail: "過去 3 ヶ月のリード→成約率から推定"

      - source: "アップセル"
        value: "$50K"
        confidence: 0.70
        detail: "健全性 > 80 の顧客 30 社のアップセル可能性"

    assumptions:
      - "市場環境が現状維持"
      - "セールス人員の稼働率 85%"
      - "競合の大きな動きなし"

    uncertainty_factors:
      - factor: "大型商談 2 件の成否"
        impact: "±$80K"
      - factor: "マーケティング施策の効果"
        impact: "±$30K"

    sensitivity_analysis:
      "win_rate が -10% → 予測 $520K (-$30K)"
      "新規リード生成が +20% → 予測 $570K (+$20K)"
```

### Mode 5: Command Center（統制センター）

**組織の現状・活動・判断を統合的に可視化する界面**

#### ダッシュボード

```yaml
command_center_ui:
  sections:
    organization_health:
      title: "組織の健全性"
      metrics:
        - metric: "顧客維持率"
          current: 0.93
          target: 0.95
          trend: "improving"
          change: "+5% from last quarter"

        - metric: "売上成長率"
          current: 0.28
          target: 0.35
          trend: "stable"

        - metric: "チームエンゲージメント"
          current: 8.2
          target: 8.5
          trend: "declining"
          alert: "要注意"

    active_initiatives:
      title: "進行中の施策"
      items:
        - initiative: "顧客維持率向上施策"
          status: "in_progress"
          progress: 0.60
          expected_completion: "2024-03-15"
          expected_impact: "+7% retention"

        - initiative: "UX 改善 v2.4"
          status: "deployed"
          impact: "login frequency +25%"

    recent_decisions:
      title: "最近の判断"
      items:
        - decision: "価格変更の承認"
          timestamp: "2024-02-10"
          approver: "CEO, CFO"
          status: "executing"

        - decision: "リスク顧客 20 社へのアウトリーチ"
          timestamp: "2024-02-08"
          approver: "auto-approved"
          status: "completed"
          outcome: "15 社が維持"

    pending_governance:
      title: "承認待ち"
      count: 3
      items:
        - request: "新市場進出の検討"
          priority: "high"
          approver: "CEO"

        - request: "マーケティング予算 +20%"
          priority: "medium"
          approver: "CFO"

    insights:
      title: "インサイト"
      items:
        - insight: "競合 X が価格を 15% 引き下げ"
          impact: "our_deals"
          recommendation: "competitive_analysis"

        - insight: "エンタープライズセグメントの成約率が上昇中"
          impact: "sales_strategy"
          recommendation: "投資を増やす"

    system_health:
      title: "システムの状態"
      metrics:
        - metric: "信頼スコア"
          value: 0.87
          level: "Level 3 (Highly Trusted)"

        - metric: "自律実行率"
          value: 0.78
          detail: "78% の判断を自律実行"

        - metric: "学習速度"
          value: "+23 patterns this month"
```

## 参与形態別の体験

### Governor（統治者）

**関与頻度**: 月次・四半期 + 重要判断時

**主要な Interface**:
- Intent Interface（Purpose の定義・更新）
- Governance Interface（戦略的判断の承認）
- Command Center（組織全体の監督）

**典型的なセッション**:

```yaml
governor_session:
  frequency: "monthly"
  duration: "30-60 minutes"

  flow:
    - review_organization_health:
        "過去 1 ヶ月の主要指標を確認"

    - review_key_decisions:
        "重要な判断の結果を評価"

    - approve_pending_requests:
        "承認待ちの戦略的判断を処理（通常 3-5 件）"

    - adjust_purpose:
        "必要に応じて Purpose を微調整"

    - set_priorities:
        "次の 1 ヶ月の優先事項を設定"
```

### Sensemaker（意味付与者）

**関与頻度**: 週次 + 必要時

**主要な Interface**:
- Sensemaker Interface（定性的情報の提供）
- Transparency Interface（システムの理解を検証）

**典型的なセッション**:

```yaml
sensemaker_session:
  frequency: "weekly + as needed"
  duration: "15-30 minutes"

  flow:
    - report_qualitative_insights:
        "顧客との会話、市場の空気感を伝える"

    - validate_system_understanding:
        "システムの世界モデルが現実と合っているか確認"

    - challenge_assumptions:
        "データが見えていない現実を指摘"
```

### Custodian（守護者）

**関与頻度**: 週次 + アラート時

**主要な Interface**:
- Transparency Interface（判断の監査）
- Governance Interface（倫理的判断の承認）

**典型的なセッション**:

```yaml
custodian_session:
  frequency: "weekly"
  duration: "20-40 minutes"

  flow:
    - review_recent_actions:
        "過去 1 週間の全行動をサンプリングレビュー"

    - check_boundary_compliance:
        "Purpose の Boundary に抵触していないか確認"

    - investigate_anomalies:
        "通常と異なるパターンの判断を深掘り"

    - update_guardrails:
        "必要に応じて Governance のルールを調整"
```

## Agency Preservation（主体性の保全）

### 設計上の保証

```yaml
agency_preservation_mechanisms:
  override_capability:
    description: "人間はいつでもシステムの判断を覆せる"
    implementation: "すべての自律実行に 'override' ボタン"

  manual_mode:
    description: "人間がシステムなしで操作できる"
    implementation: "システムが停止しても、手動で業務を継続可能"

  explanation_on_demand:
    description: "すべての判断の理由を確認できる"
    implementation: "Transparency Interface"

  learning_visibility:
    description: "システムが何を学習しているか確認できる"
    implementation: "Memory の可視化"

  gradual_delegation:
    description: "自律範囲を段階的に拡大"
    implementation: "信頼レベルに基づく動的調整"

  human_judgment_prioritization:
    description: "重要な判断は常に人間が行う"
    implementation: "Governance Gate"
```

## Mutual Evolution（相互進化）

### 人間を高めるシステム

```yaml
system_augments_human:
  proactive_education:
    description: "システムが人間に学習機会を提供"
    example: |
      System: "過去の類似商談では、この段階で ROI 資料を提供すると
               成約率が 20% 向上しています。試してみますか？"

  context_provision:
    description: "判断に必要な文脈を先回りして提供"
    example: |
      System: "この顧客への価格提案を検討中ですね。
               参考までに、類似セグメントでの価格感応度データです。"

  pattern_surfacing:
    description: "人間が気づいていないパターンを提示"
    example: |
      System: "過去 3 ヶ月、火曜午前のメール開封率が最も高いです。
               重要なコミュニケーションはこのタイミングが最適です。"

  decision_quality_feedback:
    description: "過去の判断の結果を振り返る"
    example: |
      System: "6 ヶ月前に承認した価格変更の結果:
               新規契約 +55% (予測 +60%)
               売上影響 -$45K/月 (予測 -$50K/月)
               ほぼ予測通りでした。"
```

## まとめ

Interface は Neural Organization と人間の「共生の界面」である。

**設計の核心**:
1. **Intent Interface**: 指示ではなく意志を伝える
2. **Governance Interface**: 制御ではなく統治を行う
3. **Transparency Interface**: すべての判断の理由を確認できる
4. **Sensemaker Interface**: 主観的現実をシステムに翻訳する
5. **Command Center**: 組織全体を統合的に監督する
6. **Agency Preservation**: 人間の主体性を保つ仕組み
7. **Mutual Evolution**: 人間とシステムが相互に高め合う

この Interface により、人間は組織知能と協働し、より高度な判断に集中し、組織は人間とシステムの共生体として機能する。
