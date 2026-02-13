# Purpose の詳細設計

## 論点

人間が組織の意志（Purpose）をどのように Neural Organization に注入し、Purpose が各レイヤー（特に Reasoning）にどう作用し、組織の行動を方向づけるべきか。

## Purpose の本質

### なぜ Purpose が必要か

AGI は高度な知能を持つが、**意志を持たない**。知能は「手段」であり、意志は「目的」である。

従来の AI システムは「何をすべきか」を人間が逐一指示する。Neural Organization は「なぜ存在するか」という根源的な目的を注入されることで、自律的に「何をすべきか」を導出する。

**Purpose と Instruction の違い**:

| | Purpose | Instruction |
|---|---|---|
| 抽象度 | 高い（WHY） | 低い（WHAT） |
| 時間軸 | 永続的〜長期 | 一時的 |
| 適用範囲 | 全レイヤー | 特定のタスク |
| 例 | 「顧客の成功を最大化する」 | 「顧客 X にメールを送る」 |

Purpose は**意志**であり、Instruction は**指示**である。Neural Organization は意志に基づいて行動を導出し、指示に従うだけのツールではない。

### Purpose の設計原理

**原理 1: Purpose は階層的である**

組織全体の Purpose → 部門の Purpose → チームの Purpose → 個別目標、という階層構造を持つ。下位の Purpose は上位の Purpose と整合しなければならない。

**原理 2: Purpose は宣言的である**

「〜をせよ」という命令ではなく、「〜である状態を目指す」という宣言である。システムは Purpose を達成する手段を自律的に推論する。

**原理 3: Purpose は制約を含む**

「何を実現するか」だけでなく、「何を許容しないか」も定義する。予算上限、法的制約、倫理的境界が Purpose の一部である。

**原理 4: Purpose は人間の専有物である**

AGI は Purpose を生成できない。Purpose は人間（特に Governor）が注入する唯一のものである。これが人間の不可欠性の源泉である。

**原理 5: Purpose は進化する**

Purpose は固定ではなく、組織の成長・市場の変化・学習に応じて進化する。しかし、頻繁に変わるものではない（年単位）。

## Purpose の構成要素

Purpose は 4 つの要素で構成される：

### 1. Why（存在目的）

**この組織はなぜ存在するのか**

最も根源的な問いへの答え。これがすべての判断の最終的な基準となる。

**表現形式**:

```yaml
why:
  statement: "顧客のビジネスを成功させることで、世界の生産性を向上させる"
  elaboration: |
    我々は、顧客が自社のプロダクトを使うことで、
    より少ない時間でより多くの価値を生み出せるようにする。
    顧客の成功が我々の成功であり、
    顧客の成長が我々の成長である。
  core_values:
    - value: "顧客中心主義"
      description: "顧客の成功を自社の利益よりも優先する"
    - value: "長期思考"
      description: "短期的な利益よりも、長期的な信頼と関係を重視する"
    - value: "誠実さ"
      description: "都合の悪い事実も隠さず、正直に伝える"
```

**Reasoning への作用**:

すべての行動は、この Why に照らして評価される。「この行動は顧客の成功に貢献するか？」が最終的な判断基準となる。

### 2. Where（方向）

**どこへ向かうのか**

中長期的な目標・ビジョン。現在の状態から目指す状態への方向性。

**表現形式**:

```yaml
where:
  vision: "2027 年までに、10,000 社の顧客が我々のプラットフォームで業務を自動化し、年間 100 万時間の時間を創出する"
  strategic_objectives:
    - objective: "顧客維持率 95% 以上を維持"
      timeframe: "継続的"
      rationale: "顧客の成功 = 継続利用。高い維持率は顧客の成功を証明する"
    - objective: "エンタープライズセグメントでの市場シェア 30%"
      timeframe: "2026 Q4"
      rationale: "規模の大きい顧客ほど、我々のプラットフォームの価値が高い"
    - objective: "NPS 50 以上"
      timeframe: "2025 Q4"
      rationale: "顧客が他者に推薦するほどの価値提供"
  anti_goals:
    - "売上のために顧客に不要な機能を売りつけない"
    - "成長スピードのために品質を犠牲にしない"
```

**Reasoning への作用**:

すべての行動は、この Where に向かう方向性を持つ。「この行動は目標に近づくか？」が評価される。

### 3. How（価値観・判断基準）

**何を重視し、何を許容しないか。トレードオフをどう判断するか**

これが最も重要かつ難しい部分である。すべての意思決定はトレードオフを伴う。Purpose の How は、そのトレードオフをどう判断するかの基準を提供する。

**表現形式**:

```yaml
how:
  decision_principles:
    - principle: "顧客体験 vs 短期収益"
      guideline: "顧客体験を優先する。短期的な収益機会を逃しても、顧客の信頼を損なう選択はしない"
      examples:
        - situation: "顧客が解約を申し出た"
          wrong: "引き止めるために割引を提示する"
          right: "解約理由を深く理解し、根本的な問題を解決する。解約が顧客にとって最善なら支援する"

    - principle: "速度 vs 品質"
      guideline: "顧客に影響する部分は品質優先。内部プロセスは速度優先"
      examples:
        - situation: "新機能のリリース判断"
          condition: "顧客データを扱う機能"
          decision: "品質基準を満たすまでリリースしない"
        - situation: "内部ツールの改善"
          condition: "社内のみ利用"
          decision: "80% の完成度でリリースし、フィードバックで改善"

    - principle: "自動化 vs 人間の介入"
      guideline: "定型的な判断は自動化。創造的・倫理的判断は人間が行う"
      boundary: "顧客への重要な影響（契約変更、価格変更、サービス停止）は必ず人間が承認"

  trade_off_weights:
    # トレードオフの定量的な重み付け
    - axes: ["customer_satisfaction", "profit_margin"]
      weights: [0.70, 0.30]
      note: "顧客満足を利益よりも優先するが、持続可能性は必要"

    - axes: ["speed_to_market", "feature_completeness"]
      weights: [0.60, 0.40]
      note: "MVP で早期リリースを優先するが、最低限の完成度は必須"

    - axes: ["innovation", "stability"]
      weights: [0.40, 0.60]
      note: "安定性を優先するが、イノベーションも必要"

  cultural_norms:
    - norm: "データに基づいて判断する"
      description: "直感や権威ではなく、データと論理で判断する"
    - norm: "失敗を学習機会として扱う"
      description: "失敗を責めるのではなく、何を学んだかを重視する"
    - norm: "透明性を保つ"
      description: "都合の悪い情報も隠さず共有する"
```

**Reasoning への作用**:

トレードオフの判断が必要なとき、この How が判断基準となる。「顧客満足 vs 利益」のトレードオフでは、70:30 の重み付けで判断される。

### 4. Boundary（制約・境界）

**何をしてはならないか。どこまでが許容範囲か**

これは Purpose の「制約」部分である。倫理的境界、法的制約、予算上限などを定義する。

**表現形式**:

```yaml
boundary:
  ethical_constraints:
    - constraint: "顧客データのプライバシー"
      rule: "顧客データを明示的な同意なく第三者に提供しない"
      exception: "法的義務がある場合のみ"

    - constraint: "誠実なマーケティング"
      rule: "誇大広告や誤解を招く表現を使わない"
      verification: "すべてのマーケティング主張は実データで裏付けられる"

  legal_constraints:
    - "GDPR, CCPA などのデータ保護規制を遵守"
    - "契約条件を一方的に不利益変更しない"

  resource_constraints:
    - constraint: "月次運用コスト"
      limit: "$50K"
      action_if_exceeded: "人間の承認を要求"

    - constraint: "単一顧客への投資"
      limit: "年間 $10K"
      rationale: "特定顧客への過度な依存を避ける"

  operational_boundaries:
    - "人員削減の判断は必ず CEO が行う"
    - "価格変更は CFO + CEO の承認が必要"
    - "新市場への進出は取締役会の承認が必要"
```

**Reasoning への作用**:

行動計画が Boundary に違反する場合、自動的に却下されるか、人間の承認を要求される。これが Governance の基盤となる。

## Purpose の階層構造

### 組織全体の Purpose

最上位の Purpose。組織全体の存在理由と方向性を定義する。

```yaml
organizational_purpose:
  level: "organization"
  why: "顧客のビジネスを成功させることで、世界の生産性を向上させる"
  where: "2027 年までに 10,000 社の顧客に価値を提供"
  how:
    customer_satisfaction_priority: 0.70
    innovation_priority: 0.40
  boundary:
    ethical: ["顧客データ保護", "誠実なマーケティング"]
```

### 部門の Purpose

組織全体の Purpose を、部門の文脈に具体化する。

```yaml
department_purpose:
  level: "department"
  department: "Customer Success"
  inherits_from: "organizational_purpose"
  why: "顧客が我々のプロダクトから最大の価値を引き出せるようにする"
  where: "顧客維持率 95% 以上、NPS 60 以上"
  how:
    proactive_support_priority: 0.80
    reactive_support_priority: 0.20
  boundary:
    response_time: "critical issues < 2 hours"
    customer_investment_limit: "$10K per customer per year"
```

### チームの Purpose

部門の Purpose を、チームの具体的な目標に落とし込む。

```yaml
team_purpose:
  level: "team"
  team: "Enterprise Customer Success"
  inherits_from: "department/customer_success"
  where: "担当 50 社の維持率 98% 以上"
  how:
    weekly_check_in: "必須"
    qbr_preparation: "2 weeks in advance"
  boundary:
    max_accounts_per_csm: 15
```

### 整合性の保証

下位の Purpose は上位の Purpose と矛盾してはならない。

**検証ルール**:
- 下位の Why は上位の Why に貢献する
- 下位の Where は上位の Where の部分集合
- 下位の Boundary は上位の Boundary を緩和できない（厳格化のみ可）

## Purpose の入力・更新界面

### 初期設定

組織が Neural Organization を導入する際、Governor が Purpose を定義する。

**インタラクションの例**:

```
System: Neural Organization へようこそ。
        まず、組織の Purpose を定義しましょう。
        この組織はなぜ存在していますか？

Governor: 顧客のビジネスを成功させるためです。
          我々のプロダクトを使うことで、顧客がより効率的に働けるようにしたい。

System: 素晴らしい。もう少し具体的に教えてください。
        「顧客の成功」とは、具体的にどのような状態ですか？

Governor: 顧客が我々のプロダクトを使って、
          - 業務時間を削減できる
          - より良い意思決定ができる
          - ビジネスを成長させられる

System: 理解しました。次に、トレードオフについて教えてください。
        「顧客満足」と「短期的な収益」、どちらを優先しますか？

Governor: 顧客満足です。短期的な収益を犠牲にしても、
          顧客の信頼を損なうことはしたくない。

System: 定量的には、どの程度の重み付けですか？
        例: 70% 顧客満足、30% 収益

Governor: はい、それで良いです。

System: では、許容できない行動はありますか？

Governor: 顧客データを第三者に売るような行為は絶対にしない。
          誇大広告もしない。

System: Purpose を以下のように定義しました。確認してください。
        [Purpose の YAML を表示]

        これで問題ありませんか？

Governor: はい、これで進めてください。
```

### 継続的な更新

Purpose は固定ではなく、組織の成長に応じて進化する。

**更新のトリガー**:

| トリガー | 例 |
|---|---|
| 戦略的転換 | 新市場への進出、事業モデルの変更 |
| 価値観の進化 | 組織文化の成熟、学習による洞察 |
| 外部環境の変化 | 法規制の変更、市場構造の変化 |
| 人間からの明示的な指示 | Governor が「Purpose を更新したい」と宣言 |

**更新のプロセス**:

```
1. 更新提案
   - Reflection が「Purpose と実際の判断が乖離している」を検出
   - または Governor が明示的に更新を開始

2. 差分の明示
   System: 現在の Purpose と提案された変更:

           変更前: "顧客満足 70% vs 収益 30%"
           変更後: "顧客満足 80% vs 収益 20%"

           この変更により、以下の影響が予想されます:
           - 収益性の低い顧客への投資が増加
           - 短期的な売上成長は鈍化
           - 長期的な顧客維持率が向上

3. 人間の承認
   Governor: 承認します。長期的な信頼を重視する方向に進めたい。

4. 移行
   - 新しい Purpose が適用される
   - 既存の判断・計画が新しい Purpose で再評価される
```

## Purpose の各レイヤーへの作用

### Layer 0 (Perception) への作用

Purpose は「何を知覚すべきか」に影響する。

**例**:
- Purpose が「顧客満足を最優先」なら、顧客のフィードバック・満足度データの収集を優先
- Purpose が「イノベーション重視」なら、市場トレンド・競合の新技術への接続を優先

### Layer 1 (Understanding) への作用

Purpose は「何を理解すべきか」に影響する。

**例**:
- Purpose が「顧客維持率向上」なら、解約リスクの因果モデル構築を優先
- Purpose が「新市場開拓」なら、新市場の顧客ニーズの理解を優先

### Layer 2 (Reasoning) への作用

**これが最も重要**。Purpose は Reasoning の中核である。

世界モデル（Understanding）が「現実はこうである」を示し、Purpose が「目指す状態はこうである」を示す。Reasoning は両者のギャップを埋める行動を導出する。

```
現在の状態（Understanding）: 顧客維持率 88%
目指す状態（Purpose Where）: 顧客維持率 95%
ギャップ: -7%

↓ Reasoning

行動計画:
1. 解約リスクの高い顧客 20 社を特定
2. 各顧客の解約理由を分析
3. 個別の改善プランを策定
4. プロアクティブなアウトリーチを実行
```

トレードオフの判断でも Purpose が作用する：

```
選択肢 A: 新機能を開発（顧客要望が強い）
  - 顧客満足: +15
  - コスト: $100K
  - 時間: 3 months

選択肢 B: 既存機能の品質改善
  - 顧客満足: +8
  - コスト: $30K
  - 時間: 1 month

Purpose の重み付け:
  customer_satisfaction: 0.70
  cost_efficiency: 0.30

スコア計算:
  A: (15 * 0.70) + ((-100) * 0.30) = 10.5 - 30 = -19.5
  B: (8 * 0.70) + ((-30) * 0.30) = 5.6 - 9 = -3.4

結論: B を選択（スコアが高い）
```

### Layer 3 (Execution) への作用

Purpose は「どのように実行するか」に影響する。

**例**:
- Purpose が「品質最優先」なら、アウトプットの品質基準を厳格化
- Purpose が「速度重視」なら、完璧さよりも迅速なデリバリーを優先

### Layer 4 (Reflection) への作用

Purpose は「何を学習すべきか」に影響する。

**例**:
- Purpose が「顧客中心」なら、「顧客の反応」から学習を優先
- Purpose が「イノベーション」なら、「実験の結果」から学習を優先

## Purpose の進化パターン

### パターン 1: 重み付けの調整

組織の成熟に応じて、トレードオフの重み付けが変化する。

```
創業期:
  speed: 0.70, quality: 0.30  # 速度優先でMVPを出す

成長期:
  speed: 0.50, quality: 0.50  # バランスを取る

成熟期:
  speed: 0.30, quality: 0.70  # 品質とブランドを重視
```

### パターン 2: 境界の厳格化

組織の規模拡大に伴い、Boundary が厳格化される。

```
初期:
  approval_threshold: $10K  # 小さい判断も創業者が承認

成長期:
  approval_threshold: $50K  # 中規模の判断は委譲

成熟期:
  approval_threshold: $100K  # 大規模な判断のみ経営層
```

### パターン 3: Where の更新

目標達成や市場変化に応じて、Where が更新される。

```
2024:
  target: "ARR $5M"

2025（達成後）:
  target: "ARR $20M + エンタープライズセグメント進出"
```

## まとめ

Purpose は Neural Organization の「魂」である。

**設計の核心**:
1. **4 つの要素**: Why（存在目的）、Where（方向）、How（価値観）、Boundary（制約）
2. **階層構造**: 組織 → 部門 → チーム で整合性を保つ
3. **宣言的**: 手段ではなく目的を定義する
4. **進化**: 固定ではなく、組織とともに進化する
5. **全レイヤーに作用**: 特に Reasoning において中核的な役割

この Purpose と Understanding（世界モデル）が組み合わさることで、Layer 2 (Reasoning) における「何をすべきか」の導出が可能になる。
