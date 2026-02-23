# ADR 006: Agent Orchestration からの知見統合

## ステータス

Accepted（2026-02-22）

## 文脈

agent-orchestration プロジェクトは、Claude Code Orchestra テンプレートの構造分析と次世代オーケストレーション設計を4つのドキュメント（構造分析・トレードオフ分析・批判的評価・再設計案）で段階的に深掘りしている。

このプロジェクトは Neural Organization とは独立に進められたが、両者は異なる出発点（コードレベルのエージェント協調 vs 組織レベルの知能設計）から、同一の設計原則に到達している。この収束は、これらの原則が特定のドメインを超えた普遍性を持つことの証左である。

## 決定

agent-orchestration から抽出した以下の知見を Neural Organization に統合する：

### 1. 5つの不変原理（新規ドキュメント）

`docs/invariant-principles.md` を新規作成し、以下の5つの原理を定義する：

1. **能力による間接参照（Capability Indirection）**: 実行主体の選択は能力要件で表現し、具体的なツール名で固定しない
2. **計測なきシステムは収束しない（Observability Primacy）**: フィードバックループは第一級市民。結果を計測できないシステムは改善できない
3. **優雅な劣化（Graceful Degradation）**: 任意の単一コンポーネントの除去は、システムを停止させず、品質の低下のみをもたらす
4. **コンテキストは有限資源（Context as Currency）**: 人間の注意もトークンも有限。すべての情報はその存在を正当化する必要がある
5. **設定のデータ化（Configuration as Data）**: システムの構成はシステム自身が読み書き可能なデータでなければならない

これらの原理から7つの設計不変量（I1-I7）を導出し、既存の設計原理（concept.md §4.1）との関係を整理する。

### 2. Execution Trace Schema（layer4-reflection-design.md への追加）

Reflection が学習するために必要な構造化データの定義を追加する。

- 4段階構造（分類・解決・実行・結果）のトレースレコードスキーマ
- 各段階で記録すべき情報と、Reflection による後からの記入フィールド
- 原理2（計測なきシステムは収束しない）の直接的な実装

### 3. Capability Registry（layer3-execution-design.md への追加）

Layer 3 の能力→実行リソースの間接参照層を拡張する。

- `resolve_chain`（フォールバック）、`confidence`（進化可能なスコア）、`rationale`（監査可能な理由）を持つ構造
- Registry の進化メカニズム（confidence調整、resolve_chain再順序付け、新リソース追加）
- 原理1（能力による間接参照）と原理3（優雅な劣化）の実装

### 4. Evolution Engine（orchestration-design.md への追加）

Orchestration の設定を実行トレースから自動改善する仕組みを追加する。

- 進化サイクル（Collect→Analyze→Generate→Review→Apply→Observe）
- 5つの分析シグナルパターン
- Trust Gradient による段階的自律化
- 原理5（設定のデータ化）の実装

### 5. 既存設計の補強（Phase B）

以下の設計要素を既存ドキュメントに追加する：

- Graceful Degradation の形式化（orchestration-design.md）
- Context Budget（governance-design.md）
- Symmetric Persistence（memory-design.md）
- Intent-Based Routing（purpose-design.md）
- concept.md への invariant-principles.md の参照

## 理由

### 普遍的原理の確認

agent-orchestration と Neural Organization が独立に同一の原則に到達したことは、これらの原則が普遍性を持つことを示している。この収束を明示的に認識し、設計体系に統合することで、Neural Organization の設計の必然性が強化される。

### 設計の完全性向上

以下の設計上の欠落が補完される：

1. **Reflection の入力データ構造が未定義**だった → Execution Trace Schema で解決
2. **Layer 3 の実行リソース選択メカニズムが抽象的**だった → Capability Registry で具体化
3. **Orchestration の自己改善メカニズムがない**だった → Evolution Engine で実現
4. **人間の注意予算が定量化されていない**だった → Context Budget で定量化

### 設計思想の階層化

不変原理の導入により、Neural Organization の設計思想が以下の階層構造を持つことが明確になる：

```
不変原理（invariant-principles.md）
  ↓ 制約
人間-インテリジェンス界面の設計原理（concept.md §4.1）
  ↓ 制約
5層 + 4横断的要素のアーキテクチャ
  ↓ 制約
各要素の詳細設計（philosophy/）
```

この階層により、技術スタックやツールが変わっても上位の原理が保全される。

## 結果

### 新規作成されたドキュメント

- `docs/invariant-principles.md`（14KB）
- `docs/decisions/006-agent-orchestration-insights-integration.md`（本ドキュメント）

### 拡張されたドキュメント

- `docs/philosophy/layer4-reflection-design.md`（+2.5KB）— Execution Trace Schema
- `docs/philosophy/layer3-execution-design.md`（+4KB）— Capability Registry
- `docs/philosophy/orchestration-design.md`（+5.5KB）— Evolution Engine + Graceful Degradation
- `docs/philosophy/governance-design.md`（+3KB）— Context Budget
- `docs/philosophy/memory-design.md`（+2.5KB）— Symmetric Persistence
- `docs/philosophy/purpose-design.md`（+3KB）— Intent-Based Routing
- `docs/concept.md`（+0.2KB）— invariant-principles.md への参照

### 設計体系の強化

- 不変原理が Neural Organization の「憲法」として機能
- 既存の設計原理（Intent over Instruction等）との関係が明確化
- 設計不変量（I1-I7）が今後の設計判断のチェックリストとして機能

### 実装への影響

統合された知見は、以下の実装優先度で反映される：

- **Phase A（High Priority）**: 不変原理、Trace Schema、Capability Registry、Evolution Engine — 完了
- **Phase B（Medium Priority）**: Graceful Degradation、Context Budget、Symmetric Persistence、Intent-Based Routing、concept.md 更新、本ADR — 完了
- **Phase C（Low Priority）**: design.md の同期更新（将来）

## トレードオフ

### メリット

1. **設計の必然性の強化**: 「なぜこの設計が必然か」の理論的基盤が確立
2. **実装の具体性**: Trace Schema、Capability Registry により実装可能な精度に到達
3. **自己改善の実現**: Evolution Engine により Orchestration が継続的に最適化
4. **普遍性の保証**: 独立したプロジェクトとの収束により原理の普遍性を確認

### デメリットと緩和策

1. **ドキュメント量の増加**: 14KB の新規ドキュメント + 20KB の追加
   - 緩和策: 明確な階層構造（concept → design → philosophy → invariant-principles）により参照局所性を維持
2. **学習曲線の上昇**: 不変原理の理解が必要になる
   - 緩和策: concept.md からの簡潔な参照により、必要に応じて深掘りできる構造
3. **既存ドキュメントとの不整合の可能性**: design.md の Priority Score 等
   - 緩和策: レビューで発見された不整合は Phase C で解消

## レビュー結果

深い推論によるレビュー（2026-02-22）で、Phase A の実装は「High」評価を獲得。

**発見された問題（即座に対応すべき）**:
1. Execution Trace に Layer 0/Layer 1 のトレースを追加（不変量 I2 適合）
2. external_system_operation の resolve_chain にフォールバックを追加（原理3 適合）
3. quality_threshold と confidence の関係を定義

**次フェーズで対応すべき項目**:
1. design.md の同期更新
2. Priority Score の重み付けを統一
3. 2つの Trust Score の関係を明示
4. 原理間の相互作用を整理
5. Capability の分類体系を定義

これらの改善点は設計の完全性を高めるものであり、Phase A/B の実装自体の品質を損なうものではない。

## 参照

- agent-orchestration プロジェクト（source of insights）:
  - `agent-orchestration/01-structural-analysis.md`
  - `agent-orchestration/02-tradeoff-analysis.md`
  - `agent-orchestration/03-critical-evaluation.md`
  - `agent-orchestration/04-orchestration-redesign.md`
- Neural Organization の既存設計:
  - `docs/concept.md`（概念・思想）
  - `docs/design.md`（詳細設計）
  - `docs/philosophy/`（設計思想）
- 関連する設計決定:
  - `decisions/005-v1-design-integration.md`（3層構造の確立）
