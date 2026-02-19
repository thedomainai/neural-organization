# Learning Mechanism — 学習メカニズム

> 組織が継続的に進化するための3階層学習システムの定義

---

## 設計思想

Neural Organization は「学習する組織」のデジタル実装である。

ピーター・センゲの「学習する組織」の5つの規律を、AIアーキテクチャとして実現する：

| センゲの規律 | Neural Organization での実装 |
|-------------|---------------------------|
| システム思考 | 全層の統合的なKPI管理・因果関係分析 |
| 自己マスタリー | Agent個体の性能向上（Level 1学習） |
| メンタルモデル | Semantic Memoryに保存された組織の「前提」の更新 |
| 共有ビジョン | CEO Agentが管理するOKR・戦略方針 |
| チーム学習 | Cluster間の知識共有・ベストプラクティス伝播 |

---

## 3階層学習モデル

```
        ┌─────────────────────────────────┐
        │  Level 3: Meta-Learning         │  月次
        │  「学習の仕方を学習する」          │
        │                                 │
        │  ・組織構造の最適化              │
        │  ・Agent構成の見直し            │
        │  ・学習プロセス自体の改善        │
        ├─────────────────────────────────┤
        │  Level 2: Strategy Learning     │  週次
        │  「何をすべきかを学習する」        │
        │                                 │
        │  ・KPIと施策の因果関係           │
        │  ・成功パターンの一般化           │
        │  ・戦略モデルの更新              │
        ├─────────────────────────────────┤
        │  Level 1: Operational Learning  │  日次/リアルタイム
        │  「どうやるかを学習する」          │
        │                                 │
        │  ・人間フィードバック反映         │
        │  ・エラーパターン学習            │
        │  ・手順の微調整                 │
        └─────────────────────────────────┘
```

---

## Level 1: Operational Learning（業務学習）

### 頻度: リアルタイム〜日次

### 学習ソース

| ソース | 学習内容 | 保存先 |
|--------|---------|--------|
| 人間フィードバック | スタイル選好、品質基準 | Episodic → Semantic Memory |
| AI Critic評価 | 品質パターン、頻出エラー | Procedural Memory |
| タスク実行結果 | 効率的な手順 | Procedural Memory |
| ツール利用ログ | 最適なツール選択 | Procedural Memory |

### 学習フロー

```
1. Execution Agent がタスクを完了
2. Limbic Layer で評価
3. 評価結果 + 人間フィードバックを Learning Synthesizer が受信
4. パターン抽出:
   - 「この顧客にはフォーマルなトーンが好まれる」
   - 「SEO記事のタイトルは数字入りが CTR +20%」
   - 「メール送信は火曜10時が開封率最高」
5. 該当する記憶に書き込み
6. 次回以降、Recall Agent が関連記憶として返却
```

### 具体的学習例

```yaml
学習1: スタイル選好
  トリガー: 人間が「もっと砕けた表現にして」とフィードバック
  抽出パターン: {
    context: "SNS投稿",
    reviewer: "human_001",
    preference: "casual_tone",
    confidence: 0.7  # 初回は控えめ
  }
  保存先: Semantic Memory (Person:human_001 -[PREFERS]-> Style:casual)
  活用: 次回同じ人間の承認が予想される成果物で、カジュアルなトーンを採用

学習2: エラー回避
  トリガー: AI Criticが「文字数超過」で3回連続差し戻し
  抽出パターン: {
    task_type: "sns_post_x",
    error_pattern: "character_count_exceeded",
    frequency: 3,
    fix: "事前に文字数制限をプロンプトに明示"
  }
  保存先: Procedural Memory (Workflow "SNS投稿作成" に制約追加)
  活用: 次回から事前に文字数制限チェックステップを追加
```

---

## Level 2: Strategy Learning（戦略学習）

### 頻度: 週次

### 学習プロセス

```
毎週月曜 AM 6:00 に自動実行:

Step 1: KPIレビュー
  - 先週の全KPIの変動を分析
  - 目標値とのギャップを計算
  - 前週比での改善/悪化を検出

Step 2: 施策効果分析
  - 先週実行された全施策をリスト
  - 各施策とKPI変動の相関を推定
  - 成功施策と失敗施策を分類

Step 3: パターン一般化
  - 成功施策に共通するパターンを抽出
    例: 「SNS投稿は午前中に実行した場合、エンゲージメントが30%高い」
  - 失敗施策の共通要因を抽出
    例: 「長文コンテンツは水曜以降の投稿で閲読率が低下」

Step 4: 戦略モデル更新
  - Semantic Memoryの「戦略ルール」を更新
  - 新たなベストプラクティスをProcedural Memoryに追加
  - Domain Strategistに更新を通知

Step 5: 改善提案レポート
  - CEO Agent宛に週次学習レポートを生成
  - 推奨アクション（次週の重点施策）を提案
```

### 因果関係推定モデル

```
施策 → KPI変動 の因果関係を推定するために、以下の手法を組み合わせる:

1. 時間的前後関係
   施策実行 → N日後のKPI変動
   ラグを考慮した相関分析

2. 対照実験（可能な場合）
   A/Bテストの結果を活用
   施策ありグループ vs なしグループの比較

3. 過去エピソードとの類似度
   類似の施策が過去にどのような結果をもたらしたか
   Episodic Memoryからの参照

4. 多変量分析
   複数の施策が同時実行された場合の寄与度分解
   混交要因の排除
```

---

## Level 3: Meta-Learning（メタ学習）

### 頻度: 月次

### 学習対象: 「組織のアーキテクチャ自体」

```
毎月1日 AM 6:00 に自動実行:

Step 1: Agent性能ベンチマーク
  - 全Agentのタスク完了率、品質スコア、コスト効率を比較
  - 性能低下しているAgentの特定
  - 過負荷 / 過少利用のAgentの特定

Step 2: 組織構造分析
  - Cluster間の通信パターンを分析
  - ボトルネックの特定（最も待ち時間が長いパイプライン）
  - 不要な通信の特定（直接通信でなく記憶経由で十分な箇所）

Step 3: 学習プロセス監査
  - Level 1学習の効果: 同じエラーの再発率は低下しているか？
  - Level 2学習の効果: KPIトレンドは改善傾向か？
  - 学習が逆効果になっているケース（過学習）はないか？

Step 4: 最適化提案
  - Agent構成の変更提案
    例: 「Marketing ClusterにSEO専門Workerを追加すべき」
  - ワークフローの変更提案
    例: 「AI Criticのステップを2段階から3段階に増やすべき」
  - リソース配分の変更提案
    例: 「Engineering Clusterのトークン予算を20%増やすべき」

Step 5: Human Review
  - 全ての構造変更提案はHuman承認が必須
  - 月次レビューMTGの議題として提示
```

### メタ学習の出力例

```yaml
月次レポート: 2026年1月

Agent Performance Summary:
  best_performer: t4.marketing.content_writer (quality: 92%, efficiency: 88%)
  needs_improvement: t4.sales.prospector (quality: 65%, efficiency: 71%)
  recommendation: "Sales Prospector のプロンプトを改善。成功事例のパターンをより多く参照させる"

Organizational Bottleneck:
  identified: "Evaluation Layer のスループット不足"
  cause: "AI Critic が1つのAgentで全ドメインを処理"
  recommendation: "ドメイン別AI Criticの導入（3Agent → 8Agent）"

Learning Effectiveness:
  level1_error_reduction: -35% (良好)
  level2_kpi_improvement: +8% average (良好)
  overfit_warning: "Marketing Cluster がSNS投稿に偏りすぎ。ブログ記事のスキルが低下"

Proposed Changes (Human Approval Required):
  1. Add: t5.evaluation.critic.sales (新規Agent)
  2. Modify: t4.sales.prospector prompt template
  3. Rebalance: Marketing Cluster のタスク配分 (SNS 60% → 40%, Blog 20% → 40%)
```

---

## 過学習（Overfitting）防止

### リスク

AIが特定のパターンに過度に最適化され、変化に対応できなくなるリスク。

### 防止策

| 対策 | 説明 |
|------|------|
| **多様性維持** | 学習データに成功事例だけでなく失敗事例も含める |
| **探索率** | タスクの10%は「過去のパターンに依らない新しい方法」を試行 |
| **定期的なリセット** | 6ヶ月以上更新されていないルールは再検証 |
| **外部ベンチマーク** | 業界平均との比較で「井の中の蛙」状態を検出 |
| **人間の直感** | メタ学習レビューで人間が「違和感」を指摘する機会を確保 |

---

## 学習のトリガーと記憶への反映

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Trigger     │    │  Process     │    │  Store       │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ Human FB     │───→│ Pattern      │───→│ Semantic     │
│ AI Critic    │    │ Extraction   │    │ Memory       │
│ KPI Change   │    │              │    │              │
│ Task Result  │    │ Causal       │    │ Episodic     │
│ Error Log    │───→│ Inference    │───→│ Memory       │
│              │    │              │    │              │
│ Agent Metric │    │ Structure    │    │ Procedural   │
│ System Perf  │───→│ Optimization │───→│ Memory       │
│              │    │              │    │              │
│ Market Data  │    │ Meta-        │    │ Evaluative   │
│ Competitor   │───→│ Analysis     │───→│ Memory       │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

*次のドキュメント:* `07-resilience.md` — 障害耐性設計
