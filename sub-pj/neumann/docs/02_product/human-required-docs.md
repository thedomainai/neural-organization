# Human Required Documents

人間（Human）が定義・承認すべきドキュメントの整理表。

> **目的**: プロダクト品質向上のため、AIが自律的に進める前に人間が意思決定すべき項目を明確化。

> **詳細チェックリスト**: `02_product/architecture-checklist.md` を参照（コメント付き）

---

## ドキュメント整理表

### カテゴリA: 既存あり・Human定義済み

これらは既に充実しており、必要に応じてレビュー・更新。

| Doc | Path | ステータス | 内容品質 | アクション |
|-----|------|----------|---------|----------|
| プロジェクト概要 | `README.md` | ✅ | 良好 | 維持 |
| 設計原則 | `00_vision/principles.md` | ✅ | 充実 | 維持（5原則＋トレードオフ定義済み） |
| 課題定義 | `01_concept/problem.md` | ✅ | 充実 | 検証結果で更新 |
| ペルソナ | `01_concept/personas.md` | ✅ | 充実 | 検証結果で更新 |
| ソリューション仮説 | `01_concept/solution.md` | 🟡 | ドラフト | Human承認待ち |
| 価値提案 | `01_concept/value-proposition.md` | 🟡 | ドラフト | Human承認待ち |
| 意思決定記録 | `05_decisions/decision-log.md` | ✅ | 運用中 | DEC-001〜004承認済 |

---

### カテゴリB: 既存あり・Human更新が必要

内容が不完全または古くなっており、Human定義/更新が必要。

| Doc | Path | 現状 | Human Task |
|-----|------|------|-----------|
| **Vision/Mission** | `00_vision/mission.md` | 🔴 ステータス「未着手」 | **Vision/Mission文の最終承認** |
| **North Star Metric** | `00_vision/north-star.md` | 🔴 TBD | **北極星指標の定義**（例: 月間曖昧性解消数） |
| **Roadmap** | `02_product/roadmap.md` | 🟡 Phase 1準備中 | **Phase 1の詳細タスク・期限の定義** |
| **Architecture v2** | `02_product/architecture.md` | ✅ 承認済 (DEC-005) | 完了 |

---

### カテゴリC: 不足・Human作成が必要

プロダクト品質に影響する重要ドキュメントで、現在存在しない/TBDのもの。

#### 優先度: High（MVP前に必須）

| Doc | 推奨Path | 内容 | Why Human | AIサポート |
|-----|----------|------|----------|-----------|
| **MVP機能仕様** | `02_product/features/mvp-spec.md` | MVP（Phase 2）で実装する機能の詳細仕様 | 優先度・スコープ判断 | 仕様テンプレート提供、技術調査 |
| **ユーザーストーリー** | `02_product/features/user-stories.md` | 「〜として、〜したい」形式の要求定義 | ユーザー価値の定義 | ストーリー案の提示 |
| **曖昧性検出パターン仕様** | `02_product/features/audit-patterns.md` | 5つのパターンの検出ロジック詳細 | ビジネス要件の定義 | **✅ 承認済** (DEC-007) |
| **プロンプト設計** | `02_product/features/prompt-design.md` | LLMに送るプロンプトの設計方針 | トーン・スタイルの決定 | プロンプト案の作成 |
| **UI/UXワイヤーフレーム** | `02_product/wireframes/` | 主要画面のワイヤーフレーム | ユーザー体験の決定 | デザイン案の提示 |
| **仮説検証計画** | `03_validation/experiments/validation-plan.md` | 課題・ソリューション仮説の検証方法 | 検証優先度の決定 | 実験設計の提案 |

#### 優先度: Medium（MVP後〜PMF前）

| Doc | 推奨Path | 内容 | Why Human | AIサポート |
|-----|----------|------|----------|-----------|
| **ビジネスモデル** | `04_business/business-model.md` | 収益モデル、価格設定 | 事業判断 | 市場調査、数値モデル |
| **GTM戦略** | `04_business/go-to-market.md` | 市場参入戦略、チャネル | 戦略的意思決定 | 競合分析、チャネル調査 |
| **市場分析** | `04_business/market-analysis.md` | TAM/SAM/SOM、競合分析 | 戦略的判断 | リサーチ実施 |
| **財務計画** | `04_business/financials.md` | 収支計画、投資計画 | 事業判断 | 数値シミュレーション |

#### 優先度: Low（PMF後）

| Doc | 推奨Path | 内容 |
|-----|----------|------|
| セキュリティポリシー | `02_product/security-policy.md` | SOC2準拠に向けた方針 |
| スケーリング計画 | `02_product/scaling-plan.md` | 1000ユーザー以上への対応 |
| チーム体制 | `04_business/team-structure.md` | 組織設計 |

---

## Human Actionリスト

### 完了

- [x] **`02_product/architecture.md` v2 の承認** → DEC-005
- [x] **仮説検証優先順位の承認** → DEC-006（曖昧性検出精度を優先）

### Phase 1開始前に必要

- [ ] **North Star Metric の定義** (`00_vision/north-star.md`)
  - 例: 「月間曖昧性解消タスク数」「定例資料品質スコア80以上の割合」

- [ ] **Vision/Mission の最終承認** (`00_vision/mission.md`)
  - 現在のドラフトで良いか確認

- [ ] **Phase 1 Roadmap 詳細化** (`02_product/roadmap.md`)
  - Phase 1-A〜D の具体的なタスクと期限

### MVP開発開始前に必要

- [ ] **MVP機能仕様の作成** (`02_product/features/mvp-spec.md`)
  - どの機能をMVPに含めるか
  - 各機能の受け入れ基準

- [x] **曖昧性検出パターン仕様** (`02_product/features/audit-patterns.md`) → **✅ 承認済 (DEC-007)**
  - 5パターンの検出ロジック詳細定義完了

- [ ] **UI/UXワイヤーフレームの承認**
  - Figma or 簡易スケッチでの画面設計

---

## 協働モデル（再掲）

| 領域 | Human | AI |
|------|-------|-----|
| Vision | **思想・方向性の決定** | 言語化支援 |
| Concept | **仮説の承認** | リサーチ・構造化 |
| Product | **優先度判断、仕様承認** | 設計・詳細化 |
| Validation | **実験承認・解釈** | 仮説整理・分析 |
| Business | **戦略的意思決定** | 数値モデル・調査 |
| Decisions | **最終承認** | 記録・追跡 |

---

**作成日**: 2026-01-22
**作成者**: AI
**目的**: Humanが定義すべきドキュメントの可視化
