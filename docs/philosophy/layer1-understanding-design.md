# Layer 1: Understanding の詳細設計

## 論点

Perception（Layer 0）から取得したシグナルを、どのように世界モデル（Memory のグラフ構造）に統合し、組織の現実についての深い理解を構築するべきか。

## Understanding の本質

### 変換: シグナル → 世界モデル

Layer 0 (Perception) は、組織内外のツール群から「生のシグナル」を取得する。しかし、シグナルはただのデータである。

- Slack のメッセージ: 「顧客 X が解約を検討していると聞いた」
- Salesforce の更新: 「商談 Y のステージが "Negotiation" に進んだ」
- GitHub の PR マージ: 「機能 Z が本番環境にデプロイされた」

これらは個別の事実だが、**相互に関連していない**。Layer 1 (Understanding) の役割は、これらの孤立したシグナルを統合し、「組織の現実についての生きたモデル」を構築することである。

**世界モデルとは何か**:

世界モデルは、以下の 4 つの要素で構成される：

1. **エンティティモデル**: 顧客・競合・プロダクト・市場・従業員などの「存在」とその属性
2. **関係性モデル**: エンティティ間の関係（「顧客 X は担当者 Y が管理している」）
3. **因果モデル**: 「X すれば Y が起こる、なぜなら Z だから」という因果構造
4. **予測モデル**: 現在の状態から将来を確率的に予測する能力

これらが統合されることで、組織は「現実は実際にどうなっているか。そして、なぜそうなっているか」を理解する。

### Understanding の設計原理

**原理 1: 世界モデルは静的なデータベースではなく、動的な認知構造である**

従来のデータベースは「記録」である。世界モデルは「理解」である。顧客テーブルに「健全性スコア: 65」が記録されているだけでなく、「なぜ 65 なのか」「どう変化しているか」「これは何を意味するか」が推論可能である。

**原理 2: すべてのシグナルは文脈の中で解釈される**

「商談が Negotiation に進んだ」というシグナルは、以下の文脈で解釈される：
- この顧客の過去の商談は平均何日で成約したか
- この担当者の成約率はどうか
- 現在の市場環境はどうか
- 競合の動向はどうか

文脈なき事実は、意味を持たない。

**原理 3: 理解は仮説的であり、継続的に更新される**

世界モデルは「確定した真実」ではなく、「現時点での最良の仮説」である。新たなシグナルが入るたびに、モデルは更新され、精緻化される。

**原理 4: 因果関係を明示的にモデル化する**

相関ではなく、因果を捉える。「売上が低下した」と「広告費が減少した」が同時に観測されたとき、どちらが原因でどちらが結果か、あるいは両方とも別の原因の結果なのかを推論する。

## エンティティモデルの構築

### 共通エンティティの定義

`tool-integration-design.md` で定義した共通エンティティを、世界モデルにどう実装するか。

#### Customer（顧客）エンティティ

**シグナルの統合例**:

Salesforce, Zendesk, Stripe, Google Analytics から得た情報を統合し、単一の Customer エンティティを構成する。

```json
{
  "entityType": "Customer",
  "id": "cust_acme_corp",
  "attributes": {
    "name": "Acme Corp",
    "segment": "Enterprise",
    "industry": "Manufacturing",
    "employees": 500,
    "foundedYear": 2010
  },
  "financialState": {
    "mrr": 12000,
    "ltv": 180000,
    "paymentHistory": "consistent",
    "lastPaymentDate": "2024-02-01"
  },
  "healthMetrics": {
    "overallScore": 65,
    "trend": "declining",
    "components": {
      "usage": 60,
      "engagement": 55,
      "support": 70,
      "payment": 95
    }
  },
  "behavioralState": {
    "loginFrequency": {
      "current": 15,
      "historical": 25,
      "change": -40,
      "unit": "per_month"
    },
    "featureUsage": [
      {"feature": "reporting", "usage": "high"},
      {"feature": "analytics", "usage": "low"},
      {"feature": "api", "usage": "none"}
    ]
  },
  "supportState": {
    "ticketsLast30Days": 8,
    "avgResponseTime": "4 hours",
    "satisfaction": 3.8,
    "escalations": 2
  },
  "relationships": {
    "assignedCSM": "emp_sarah_chen",
    "mainContact": "contact_john_doe",
    "decision makers": ["contact_jane_smith", "contact_bob_wilson"],
    "activeDeals": ["deal_expansion_2024q1"],
    "usesProducts": ["product_platform", "product_analytics"],
    "competitors": ["competitor_x", "competitor_y"]
  },
  "temporalContext": {
    "customerSince": "2022-03-15",
    "lastRenewal": "2024-01-15",
    "nextRenewal": "2025-01-15",
    "contractTerm": 12,
    "lifecycle": "mature"
  },
  "signals": {
    "churnRisk": {
      "score": 0.35,
      "confidence": 0.82,
      "drivers": [
        {"factor": "usageDecline", "contribution": 0.45},
        {"factor": "supportTicketIncrease", "contribution": 0.30},
        {"factor": "competitorMention", "contribution": 0.15},
        {"factor": "contractNearEnd", "contribution": 0.10}
      ]
    },
    "expansionOpportunity": {
      "score": 0.25,
      "confidence": 0.60,
      "potential": "$5K MRR",
      "reasoning": "API 機能の未使用。技術チームの拡大傾向"
    }
  },
  "causalModel": {
    "churnDrivers": [
      {
        "cause": "usageDecline",
        "effect": "churnProbability",
        "mechanism": "ログイン頻度の低下は価値認識の低下を示す",
        "strength": 0.7,
        "lagDays": 14
      },
      {
        "cause": "supportQuality",
        "effect": "satisfaction",
        "mechanism": "サポート品質は満足度に直接影響",
        "strength": 0.6,
        "lagDays": 7
      }
    ]
  },
  "metadata": {
    "lastUpdated": "2024-02-12T14:30:00Z",
    "confidence": 0.88,
    "dataCompleteness": 0.92,
    "sources": ["salesforce", "zendesk", "stripe", "google_analytics"]
  }
}
```

**構築プロセス**:

1. **シグナルの収集**: 各ツールから顧客に関するシグナルを収集
   - Salesforce: アカウント情報、商談、活動履歴
   - Zendesk: サポートチケット、満足度
   - Stripe: 支払い履歴、MRR
   - Google Analytics: プロダクト利用状況

2. **エンティティ解決（Entity Resolution）**: 異なるツールの同一顧客を統合
   - Salesforce の "Acme Corp" と Stripe の "acme-corp-customer-id" が同一であることを認識
   - メールアドレス、ドメイン、ID などのキーで統合

3. **属性の抽出と正規化**: 各ツールから属性を抽出し、共通フォーマットに変換
   - Salesforce の "Annual Revenue" → `mrr` への変換
   - Zendesk の "CSAT" → `support.satisfaction` への統合

4. **計算属性の生成**: 生データから高次の属性を計算
   - `healthScore` = f(usage, engagement, support, payment)
   - `churnRisk` = f(healthScore, trend, contract_end_proximity)

5. **関係性の確立**: 他のエンティティとの関係を構築
   - 担当 CSM、利用プロダクト、進行中の商談などをリンク

#### Deal（商談）エンティティ

**シグナルの統合例**:

```json
{
  "entityType": "Deal",
  "id": "deal_expansion_2024q1",
  "attributes": {
    "name": "Acme Corp - Platform Expansion",
    "amount": 50000,
    "type": "expansion",
    "stage": "negotiation",
    "probability": 0.65,
    "expectedCloseDate": "2024-03-31"
  },
  "relationships": {
    "account": "cust_acme_corp",
    "owner": "emp_sales_mike",
    "contacts": ["contact_jane_smith", "contact_bob_wilson"],
    "competingWith": ["competitor_x"]
  },
  "timeline": {
    "created": "2024-01-10",
    "stages": [
      {"stage": "qualification", "enteredAt": "2024-01-10", "duration": 5},
      {"stage": "discovery", "enteredAt": "2024-01-15", "duration": 10},
      {"stage": "proposal", "enteredAt": "2024-01-25", "duration": 15},
      {"stage": "negotiation", "enteredAt": "2024-02-09", "duration": "ongoing"}
    ],
    "averageStageVelocity": {
      "thisSegment": 12,
      "thisSalesperson": 10,
      "overall": 15
    }
  },
  "signals": {
    "winProbability": {
      "score": 0.65,
      "factors": [
        {"factor": "customerHealth", "impact": +0.15, "note": "既存顧客で関係良好"},
        {"factor": "budget", "impact": +0.20, "note": "予算確保済み"},
        {"factor": "competition", "impact": -0.10, "note": "競合 X が提案中"},
        {"factor": "timeline", "impact": -0.05, "note": "期末までやや時間が短い"}
      ]
    },
    "riskFactors": [
      {"risk": "competitorDiscount", "probability": 0.40, "impact": "high"},
      {"risk": "budgetFreeze", "probability": 0.15, "impact": "critical"}
    ],
    "nextBestAction": {
      "action": "competitorDifferentiation",
      "description": "競合との差別化を明確にするドキュメントを提供",
      "urgency": "high",
      "expectedImpact": "+10% win rate"
    }
  },
  "causalModel": {
    "stageDuration": {
      "expected": 45,
      "actual": 33,
      "variance": -12,
      "causes": [
        {"factor": "existingRelationship", "contribution": 0.60},
        {"factor": "clearNeed", "contribution": 0.30}
      ]
    }
  }
}
```

#### Product（プロダクト）エンティティ

**シグナルの統合例**:

GitHub, Jira, Datadog, Google Analytics から情報を統合。

```json
{
  "entityType": "Product",
  "id": "product_analytics",
  "attributes": {
    "name": "Analytics Module",
    "version": "v2.3.1",
    "status": "production",
    "launchedAt": "2023-06-01"
  },
  "healthMetrics": {
    "stability": 0.92,
    "performance": 0.88,
    "errorRate": 0.002,
    "uptime": 0.997
  },
  "adoptionMetrics": {
    "activeUsers": 1250,
    "adoptionRate": 0.68,
    "growth": "+15% MoM",
    "churnRate": 0.03
  },
  "developmentState": {
    "openIssues": 23,
    "openBugs": 5,
    "technicalDebt": "medium",
    "testCoverage": 0.85,
    "lastDeploy": "2024-02-10"
  },
  "userSentiment": {
    "nps": 42,
    "satisfaction": 4.2,
    "topCompliments": ["速い", "使いやすい"],
    "topComplaints": ["エクスポート機能が弱い", "モバイル対応が不十分"]
  },
  "roadmap": {
    "inProgress": ["feature_export_enhancement", "feature_mobile_app"],
    "planned": ["feature_real_time_alerts"],
    "considerng": ["feature_ai_insights"]
  },
  "causalModel": {
    "adoptionDrivers": [
      {"driver": "performance", "impact": 0.40},
      {"driver": "easeOfUse", "impact": 0.35},
      {"driver": "featureCompleteness", "impact": 0.25}
    ]
  }
}
```

### エンティティ間の関係性

エンティティは孤立していない。関係性のグラフとして保持される。

**グラフ構造の例**:

```
Customer (Acme Corp)
  ├─ assignedCSM → Employee (Sarah Chen)
  ├─ mainContact → Contact (John Doe)
  ├─ activeDeals → Deal (Expansion 2024Q1)
  │    └─ owner → Employee (Mike Sales)
  ├─ usesProducts → Product (Platform)
  │    └─ healthMetrics → { stability: 0.95 }
  └─ competingWith → Competitor (X)
       └─ marketShare → 0.32
```

この関係性により、「顧客 Acme の健全性が低下しているのは、プロダクト Platform の最近の障害が原因か？」という推論が可能になる。

## 因果モデルの構築

### 因果関係とは何か

相関は「X と Y が同時に変化した」という観測である。因果は「X が Y を引き起こした」という推論である。

**例**:
- **相関**: 「顧客のログイン頻度が減少し、同時にサポートチケットが増加した」
- **因果**: 「プロダクトの UX 問題がログイン頻度の減少を引き起こし、その結果としてサポートチケットが増加した」

因果を理解しなければ、正しい行動を導出できない。

### 因果モデルの構築プロセス

#### 1. 仮説生成

シグナルから因果仮説を生成する。

**例**:
- 観測: 「顧客 X のログイン頻度が 30% 減少」
- 仮説候補:
  - H1: プロダクトの価値が低下した → ログイン頻度減少
  - H2: 顧客の業務が変化した → ログイン頻度減少
  - H3: 競合プロダクトに移行中 → ログイン頻度減少

#### 2. データによる検証

各仮説を既存データで検証する。

**H1 の検証**:
- 他の顧客で同様のログイン減少が観測されているか？ → Yes（5 社で類似パターン）
- 同時期にプロダクトの変更があったか？ → Yes（v2.3 リリース後）
- ログイン減少とプロダクト変更の時間的関係は？ → リリース 2 週間後に減少開始
- → H1 の信頼度が高い

**H2 の検証**:
- 顧客の業務変化の兆候はあるか？（採用、組織変更など） → No
- → H2 の信頼度は低い

**H3 の検証**:
- 競合ツールの言及はあるか？（Slack, メール） → No
- → H3 の信頼度は低い

#### 3. 因果構造の構築

検証された仮説を因果グラフとして構造化する。

```
ProduceChange(v2.3) → UXIssue
                         ↓
                    UserFrustration
                         ↓
                    LoginDecline
                         ↓
                    SupportTicketIncrease
```

#### 4. 因果モデルの保存

```json
{
  "causalChain": {
    "id": "causal_login_decline_2024q1",
    "trigger": {
      "event": "product_release_v2_3",
      "date": "2024-01-15"
    },
    "chain": [
      {
        "cause": "UX issue in v2.3",
        "effect": "user frustration",
        "mechanism": "新 UI が慣れ親しんだワークフローを変更",
        "evidence": ["support tickets mentioning confusion", "user feedback"],
        "lag": "3 days"
      },
      {
        "cause": "user frustration",
        "effect": "login decline",
        "mechanism": "価値 < 学習コスト → 利用回避",
        "evidence": ["correlation: -0.75", "5 customers affected"],
        "lag": "14 days"
      }
    ],
    "confidence": 0.80,
    "impact": {
      "affectedCustomers": 5,
      "averageDecline": "30%",
      "churnRiskIncrease": "+15%"
    },
    "intervention": {
      "proposed": "UX rollback + guided tutorial",
      "expectedImpact": "login recovery within 2 weeks"
    }
  }
}
```

### 反事実的推論（Counterfactual Reasoning）

「もし X をしていたら、Y はどうなっていたか？」

**例**:
- 事実: 「価格を 20% 下げた → 新規契約が 20% 増加」
- 反事実: 「もし価格を下げていなかったら、新規契約はどうなっていたか？」
  - 推論: 「市場トレンド・競合動向から、-5% の減少が予想された」
  - 結論: 「価格変更の真の効果は +25%（実測 +20% - 予想 -5%）」

反事実的推論により、施策の真の効果を評価できる。

## 予測モデルの構築

### 予測の種類

| 予測タイプ | 内容 | 例 |
|---|---|---|
| トレンド予測 | 現在の傾向が続いた場合の将来 | 「現在のペースが続けば、Q3 売上は $450K」 |
| リスク予測 | 望ましくない事象の確率 | 「顧客 X の解約確率: 35%」 |
| 機会予測 | ポジティブな機会の可能性 | 「顧客 Y のアップセル可能性: 60%」 |
| シナリオ予測 | 特定の行動を取った場合の結果 | 「価格を 10% 下げた場合、契約率は 15% 向上すると予測」 |

### 予測モデルの実装

#### 統計的予測

時系列データから統計的にトレンドを予測する。

**例: MRR の予測**

```python
# 過去 12 ヶ月の MRR データ
mrr_history = [100K, 105K, 110K, 108K, 115K, 120K, 125K, 130K, 128K, 135K, 140K, 145K]

# トレンド分析
growth_rate = calculate_cagr(mrr_history)  # +40% YoY
seasonality = detect_seasonality(mrr_history)  # Q4 が強い

# 3 ヶ月先の予測
predicted_mrr = {
  "2024-03": { "value": 150K, "confidence_interval": [145K, 155K] },
  "2024-04": { "value": 152K, "confidence_interval": [146K, 158K] },
  "2024-05": { "value": 155K, "confidence_interval": [148K, 162K] }
}
```

#### 機械学習ベースの予測

複数の要因を考慮した予測モデル。

**例: 顧客解約予測**

```python
# 特徴量
features = {
  "loginFrequencyChange": -40%,
  "supportTicketIncrease": +50%,
  "paymentDelay": 0 days,
  "contractEndProximity": 180 days,
  "healthScoreTrend": "declining",
  "npsScore": 6,
  "competitorMentions": 1
}

# モデル適用
churn_probability = churn_model.predict(features)  # 0.35

# 説明可能性（SHAP values）
feature_importance = {
  "loginFrequencyChange": +0.15,  # 解約確率を 15% 増加
  "supportTicketIncrease": +0.10,
  "contractEndProximity": +0.05,
  "paymentDelay": 0.00,
  ...
}
```

#### 因果ベースの予測

因果モデルに基づいて、介入の効果を予測する。

**例: 価格変更の影響予測**

```python
# 因果グラフ
# Price → PerceivedValue → ConversionRate
#       → CompetitivePosition → WinRate

# 介入: 価格を 15% 下げる
intervention = {"price_change": -0.15}

# 因果推論
predicted_impact = causal_model.predict_intervention(intervention)

# 結果
{
  "perceived_value": +0.10,  # 価値認識が 10% 向上
  "conversion_rate": +0.12,  # コンバージョン率が 12% 向上
  "competitive_position": +0.15,  # 競合優位性が向上
  "win_rate": +0.18,  # 成約率が 18% 向上
  "side_effects": {
    "margin": -0.15,  # 利益率が 15% 低下
    "brand_perception": -0.05  # ブランド価値が若干低下
  }
}
```

### 予測の不確実性の明示

すべての予測は不確実性を伴う。これを明示することが重要である。

```json
{
  "prediction": {
    "metric": "Q2 新規契約数",
    "pointEstimate": 25,
    "confidenceInterval": {
      "90%": [20, 30],
      "50%": [23, 27]
    },
    "assumptions": [
      "現在の市場環境が継続",
      "マーケティング予算が計画通り執行される",
      "競合の大きな動きがない"
    ],
    "uncertaintyFactors": [
      {"factor": "市場需要の変動", "impact": "high"},
      {"factor": "セールス人員の稼働率", "impact": "medium"}
    ]
  }
}
```

## 実務ツールからの統合例

### 例 1: 顧客健全性スコアの算出

**シグナル源**:
- Salesforce: 最終接触日、契約更新日
- Google Analytics: ログイン頻度、機能利用状況
- Zendesk: サポートチケット数、満足度
- Stripe: 支払い遅延の有無

**統合プロセス**:

```
1. シグナル収集
   Salesforce API → "last_contact_date": "2024-01-20"
   GA API → "login_count_30d": 15 (前月: 25)
   Zendesk API → "tickets_30d": 8 (前月: 3)
   Stripe API → "payment_status": "current"

2. 正規化
   last_contact_days_ago = today - last_contact_date = 23 days
   login_change = (15 - 25) / 25 = -40%
   ticket_change = (8 - 3) / 3 = +167%

3. スコア計算
   usage_score = f(login_count, login_change) = 60
   engagement_score = f(feature_usage, diversity) = 55
   support_score = f(tickets, satisfaction) = 70
   payment_score = f(payment_status, history) = 95

   overall_health = weighted_avg([
     (usage, 0.35),
     (engagement, 0.25),
     (support, 0.20),
     (payment, 0.20)
   ]) = 65

4. トレンド分析
   health_history = [85, 80, 75, 70, 65]
   trend = "declining"
   velocity = -5 points/month

5. リスク評価
   churn_risk = churn_model.predict({
     health_score: 65,
     trend: "declining",
     velocity: -5,
     contract_end_days: 180
   }) = 0.35

6. 世界モデル更新
   Customer("acme_corp").update({
     healthScore: 65,
     trend: "declining",
     churnRisk: 0.35,
     lastUpdated: now()
   })

7. 因果推論
   analyze_causality("health_decline", customer="acme_corp")
   → 原因: "プロダクト v2.3 の UX 問題"
```

### 例 2: 商談成約確率の算出

**シグナル源**:
- Salesforce: 商談ステージ、金額、作成日
- Slack: 顧客との会話頻度、トーン
- Calendly: 面談の予約状況

**統合プロセス**:

```
1. シグナル収集
   Salesforce → stage: "Negotiation", amount: $50K, created: 33 days ago
   Slack → customer_mentions: 12, tone: "positive"
   Calendly → meetings_scheduled: 3, attendance_rate: 100%

2. ベンチマーク比較
   avg_days_in_negotiation (このセグメント) = 20 days
   this_deal = 10 days (速い = ポジティブシグナル)

3. 勝率モデル適用
   win_probability = deal_model.predict({
     stage: "negotiation",
     amount: 50K,
     customer_health: 85,
     engagement_level: "high",
     days_in_stage: 10,
     competition: "moderate"
   }) = 0.65

4. リスク要因の特定
   risk_factors = [
     {"risk": "競合の値引き", "probability": 0.40},
     {"risk": "予算凍結", "probability": 0.15}
   ]

5. 次のベストアクション
   next_action = reasoning_engine.recommend({
     goal: "maximize_win_rate",
     context: deal_context
   })
   → "競合との差別化ドキュメントを提供"
```

## まとめ

Layer 1 (Understanding) は、組織の「現実を理解する能力」の実体である。

**設計の核心**:
1. **シグナルの統合**: 分散したツール群からのシグナルを共通エンティティに統合
2. **関係性のグラフ**: エンティティは孤立せず、関係性として保持される
3. **因果モデル**: 相関ではなく因果を捉える
4. **予測能力**: 現在から将来を推論する
5. **文脈的解釈**: すべてのシグナルは文脈の中で解釈される
6. **継続的更新**: 世界モデルは仮説であり、常に更新される

この Understanding の上に、Layer 2 (Reasoning) における「何をすべきか」の導出が可能になる。
