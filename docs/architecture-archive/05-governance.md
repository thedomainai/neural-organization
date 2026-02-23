# Governance Framework — ガバナンスフレームワーク

> AIが全活動を担う組織における品質保証、コンプライアンス、人間の監督体制の定義

---

## 設計原則

**全自動組織において、ガバナンスは「制約」ではなく「免疫系」である。**

人間の免疫系が体を守りつつも日常活動を妨げないように、
ガバナンスは組織の自律性を維持しつつ、リスクのある行動のみを検知・制御する。

---

## リスクティア・フレームワーク

### 4段階のリスクティア

```
┌──────────────────────────────────────────────────────────┐
│ Tier 4: CRITICAL                                         │
│ 法的拘束力のある文書、大規模資金移動、戦略転換             │
│ → 複数人の事前承認必須                                    │
├──────────────────────────────────────────────────────────┤
│ Tier 3: HIGH                                             │
│ 契約書、財務報告、採用/解雇決定、外部公開文書             │
│ → 人間の事前承認必須                                      │
├──────────────────────────────────────────────────────────┤
│ Tier 2: MEDIUM                                           │
│ マーケティング投稿、メール送信、内部レポート               │
│ → AI自動承認 + 事後レビュー                               │
├──────────────────────────────────────────────────────────┤
│ Tier 1: LOW                                              │
│ 社内チャット応答、定型レポート、内部ドラフト               │
│ → 完全自律（ログのみ）                                    │
└──────────────────────────────────────────────────────────┘
```

### リスクティア判定基準

| 評価軸 | Weight | Low (0-0.2) | Medium (0.2-0.5) | High (0.5-0.8) | Critical (0.8-1.0) |
|--------|--------|------------|------------------|----------------|-------------------|
| **財務影響** | 0.25 | ¥0 | < ¥100万 | < ¥1000万 | ≥ ¥1000万 |
| **法的影響** | 0.25 | なし | 社内ルール関連 | 契約関連 | 訴訟リスク |
| **評判影響** | 0.20 | 社内のみ | 限定的外部 | 公開コンテンツ | メディア露出 |
| **可逆性** | 0.15 | 即座に撤回可 | 24h以内に撤回可 | 撤回困難 | 不可逆 |
| **影響範囲** | 0.15 | 個人 | チーム | 部門 | 全社/外部 |

```
composite_risk = Σ(weight × score)
Tier 1: composite_risk < 0.2
Tier 2: 0.2 ≤ composite_risk < 0.5
Tier 3: 0.5 ≤ composite_risk < 0.8
Tier 4: composite_risk ≥ 0.8
```

---

## 評価パイプラインの詳細

### Stage 1: AI Critic Network

```
┌─────────────────────────────────────────┐
│           AI Critic Network              │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Domain  │  │ Quality │  │ Style   │ │
│  │ Expert  │  │ Checker │  │ Guide   │ │
│  │ Critic  │  │         │  │ Critic  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │       │
│       └────────────┼────────────┘       │
│                    │                    │
│              ┌─────┴─────┐              │
│              │ Consensus │              │
│              │ Engine    │              │
│              └───────────┘              │
└─────────────────────────────────────────┘
```

**Domain Expert Critic:** ドメイン固有の正確性チェック
- マーケティング: ブランドガイドライン、ターゲット整合性
- 法務: 法的正確性、規制準拠
- 財務: 数値の正確性、会計基準準拠
- 技術: コード品質、セキュリティ

**Quality Checker:** 汎用品質チェック
- 誤字脱字、文法
- 論理的一貫性
- フォーマット準拠
- 完全性（要件充足度）

**Style Guide Critic:** スタイル・トーン・マナーチェック
- 企業のトーン＆マナー準拠
- ターゲット読者への適切性
- ブランドボイスの一貫性

**Consensus Engine:** 複数Criticの判定を統合
- 全Criticが Accept → Accept
- いずれかが Reject → Reject（理由付き）
- Revise が混在 → 最も厳しい修正指示を採用

### Stage 2: Compliance Guardian

```yaml
チェックリスト:
  個人情報保護:
    - 個人名の不適切な露出
    - メールアドレスの外部公開
    - 顧客データの目的外使用
    check_method: pattern_matching + semantic_analysis

  著作権:
    - 画像の無断使用
    - テキストの過度な引用
    - ライセンス違反
    check_method: similarity_search + license_db

  業界規制:
    - 金融商品取引法（金融業の場合）
    - 薬機法（ヘルスケアの場合）
    - 景品表示法（全業種）
    check_method: rule_engine + domain_expert

  社内ポリシー:
    - 情報セキュリティポリシー
    - 倫理規定
    - ブランドガイドライン
    check_method: policy_db + semantic_matching
```

### Stage 3: Human-in-the-Loop

```
承認ワークフロー:

Tier 2 (Medium):
  1. AI承認 → 自動デプロイ
  2. 24時間以内にHuman事後レビュー
  3. 問題発見時: ロールバック + 学習データ登録

Tier 3 (High):
  1. AI評価完了 → HITL Gateway → Slack通知
  2. 承認者がレビュー（SLA: 4時間）
  3. 承認: デプロイ / 却下: 理由付きでフィードバック
  4. SLA超過: エスカレーション（上位承認者に通知）

Tier 4 (Critical):
  1. AI評価完了 → HITL Gateway → 複数チャネル通知
  2. 最低2名の承認者がレビュー（SLA: 1時間）
  3. 全承認: デプロイ / 1名でも却下: 再検討
  4. SLA超過: 即時電話エスカレーション
```

---

## 監査体制

### Audit Trail（監査証跡）

全てのAgent活動は不変の監査ログとして記録される。

```json
{
  "audit_id": "uuid",
  "timestamp": "ISO-8601",
  "actor": "agent_id or human_id",
  "action": "create|read|update|delete|approve|reject|deploy",
  "target": "artifact_id|memory_id|config_id",
  "context": {
    "directive_id": "関連する指示ID",
    "risk_tier": "1-4",
    "reasoning": "なぜこの行動を取ったか"
  },
  "before_state": { ... },
  "after_state": { ... },
  "approval_chain": [
    { "approver": "ai_critic", "result": "accept", "at": "..." },
    { "approver": "compliance_guardian", "result": "compliant", "at": "..." },
    { "approver": "human_001", "result": "approved", "at": "..." }
  ]
}
```

### 定期監査

| 頻度 | 内容 | 実行者 |
|------|------|--------|
| 日次 | 全Tier 3-4アクションのサマリーレポート | Quality Auditor |
| 週次 | リスクティア判定の妥当性レビュー | Risk Assessor + Human |
| 月次 | コンプライアンス全体レビュー | Compliance Guardian + Human |
| 四半期 | ガバナンスフレームワーク自体の見直し | CEO Agent + Human Management |

---

## 緊急停止メカニズム（Circuit Breaker）

### 自動停止トリガー

| 条件 | 影響範囲 | アクション |
|------|---------|---------|
| Agent error rate > 50% | 当該Agent | Agent停止 + 代替起動 |
| Cluster error rate > 30% | 当該Cluster | Cluster一時停止 + 人間通知 |
| コンプライアンス違反検出 | 関連成果物 | デプロイ停止 + ロールバック |
| リソース枯渇 | 全体 | 低優先度タスク停止 |
| セキュリティ侵害検出 | 全体 | 全外部通信停止 + 緊急通知 |

### 手動停止

人間はいつでも以下の操作が可能：

```
/emergency-stop all          # 全Agent停止
/emergency-stop cluster:hr   # HR Cluster停止
/emergency-stop agent:xxx    # 特定Agent停止
/emergency-rollback deploy:xxx  # 特定デプロイのロールバック
```

---

## 責任の所在

### RACI マトリクス

| 活動 | AI Agent | Human Supervisor | Human Management |
|------|----------|-----------------|-----------------|
| Tier 1 実行 | **R/A** | - | - |
| Tier 2 実行 | **R/A** | **I** (事後) | - |
| Tier 3 実行 | **R** | **A** (事前承認) | **I** |
| Tier 4 実行 | **R** | **A** (事前承認) | **A** (追加承認) |
| 戦略変更 | **R** (提案) | **C** | **A** (最終決定) |
| ガバナンス改定 | **C** | **R** | **A** |
| 障害対応 | **R** (自動) | **A** (判断) | **I** |

> R=Responsible（実行責任）, A=Accountable（説明責任）, C=Consulted（相談）, I=Informed（報告）

---

*次のドキュメント:* `06-learning.md` — 学習メカニズム
