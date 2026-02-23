# 状態のアドレッサビリティ：パス階層の設計原則

## 問い

Memory 横断的要素における「状態の物理的外部化」をどう実現すべきか。具体的には、組織の全状態（顧客、商談、パターン、設定等）を一意のパスでアドレッシング可能にするパス階層の設計原則を定義する。

### 背景

- **Openclaw の洞察**: 組織の状態をファイルシステム上のファイルとして表現することで、エージェントと人間の双方にとって透明かつアドレッサブルになる。共有名前空間によりデータサイロが解消される。
- **Neural Organization の現状**: Memory の3構造（長期記憶・作業記憶・評価記憶）が技術スタック（Graph DB、Redis、TimescaleDB 等）にマッピングされているが、状態へのアクセスインターフェースが未定義。
- **統合の必要性**: Radical Transparency 原則の技術的実装として、すべての状態が一意のパスで参照可能な設計が必要。

## 論点

### 論点1: パス階層の命名規則と構造をどう設計すべきか

- パス階層の深さ: 何階層まで許容するか（AI-data-representation.md では2階層までを推奨）
- 命名規則: ケバブケース / スネークケース / キャメルケース
- 単数形 vs 複数形: `/customer/acme-corp` vs `/customers/acme-corp`
- 動的要素の表現: ID vs スラッグ vs 両方
- 階層の意味的構造: リソース階層型 / ドメイン駆動型 / フラットエンティティ型

### 論点2: 内部表現（Graph DB等）とパス階層インターフェースの変換層をどう設計すべきか

- 変換層の責任範囲: 単純なアドレス解決 / セマンティック検索 / クエリ最適化
- パフォーマンス: パス解決のレイテンシ目標
- キャッシング戦略: どの階層をキャッシュするか
- 整合性保証: Graph DB 更新時のパスインデックス更新タイミング

### 論点3: Memory の3構造（長期・作業・評価）とパス階層をどうマッピングすべきか

- 3構造を明示的にパスに含めるか: `/memory/long-term/...` vs `/customers/...`（暗黙的）
- 作業記憶の揮発性をどう表現するか
- 評価記憶（時系列データ）の表現
- 横断検索: 複数の Memory 構造をまたいだ検索のサポート

### 論点4: パス階層の進化可能性をどう担保すべきか

- パス構造の変更（リネーム、階層の再編）の管理
- バージョニング: パスにバージョンを含めるか
- エイリアス: 旧パスから新パスへのリダイレクト
- 後方互換性の期限

## 論点分解

### 論点1の分解

1. **階層構造の選択**: リソース階層型（REST風）/ ドメイン駆動型（コンテキスト分割）/ フラットエンティティ型
2. **深さの制限**: AI-data-representation.md の「2階層まで」原則との整合
3. **エンティティ間関係の表現**: パスのネスト / グラフクエリ / 両方
4. **Layer 1 Understanding のエンティティモデルとの対応**: Customer, Deal, Product 等とパスの関係

### 論点2の分解

1. **変換アーキテクチャの選択**: パスルーター型 / セマンティック検索統合型 / キャッシュ階層型
2. **レイテンシ目標の設定**: < 10ms / < 100ms / < 1s
3. **フォールバック設計**: 不変原理3「優雅な劣化」との整合
4. **実装複雑性とパフォーマンスのバランス**

### 論点3の分解

1. **Memory 構造の表現方式**: 明示的（`/memory/long-term/...`）/ 暗黙的（`/customers/...`）/ ハイブリッド
2. **時系列データのパス表現**: 日付をパスに含める / クエリパラメータ / ハイブリッド
3. **Layer 0-4 のアクセスパターン**: 各層がどのパスを読み書きするか

### 論点4の分解

1. **進化戦略の選択**: バージョニング / エイリアス / 破壊的変更
2. **不変原理5「設定のデータ化」との整合**: パス構造自体もデータとして管理
3. **Phase 1-4 での進化パス**: 各 Phase でのパス構造の変化

## 仮説構築

### 論点1: パス階層構造の設計案

#### 案A: リソース階層型（REST 風）

```
/customers/{slug}/
/customers/{slug}/deals/{deal-id}
/customers/{slug}/health
/deals/{deal-id}/
/products/{slug}/
```

**特徴**: エンティティ種別（複数形）→ 個別インスタンス（スラッグ or ID）の2階層。エンティティ間の親子関係はネストで表現。

**トレードオフ**:
- 利点: Web API の慣習に従い、エージェント（LLM）の既存知識を活用できる
- 欠点: Customer → Deal → Product のようなチェーンが3階層以上に深くなる。AI-data-representation.md の原則に抵触。Deal が Customer の「子」であると同時に独立エンティティでもあるという多重帰属を表現しにくい

#### 案B: ドメイン駆動型（ドメインコンテキスト分割）

```
/revenue/leads/{slug}
/revenue/deals/{slug}
/people/employees/{slug}
/people/candidates/{slug}
/product/features/{slug}
```

**特徴**: sub-pj（agentic-ai-sales, agentic-ai-hr 等）と対応するドメインコンテキストを第1階層、エンティティ種別を第2階層とする。

**トレードオフ**:
- 利点: ドメイン境界が明確。sub-pj の構造と整合
- 欠点: Customer のように複数ドメインにまたがるエンティティの帰属先が曖昧。ドメイン境界の変更がパス構造に破壊的変更をもたらす

#### 案C: フラットエンティティ + リレーショングラフ型（推奨案）

```
# エンティティアクセス（フラット、2階層）
/entities/customers/{slug}
/entities/deals/{slug}
/entities/products/{slug}

# エンティティ間の関係はグラフクエリで辿る
/relations/customers/{slug}/deals
/relations/deals/{slug}/products
```

**特徴**: エンティティは全てフラットな名前空間に配置（最大2階層）。エンティティ間の関係性は `/relations/` 配下のグラフクエリで辿る。

**トレードオフ**:
- 利点: AI-data-representation.md の「階層は2段まで」に完全適合。グラフ DB と自然に対応。エンティティの多重帰属問題が発生しない。ドメインコンテキストの変更が影響しない
- 欠点: 関係性が暗黙的（パスのネストだけでは親子関係が不明）

### 論点2: 変換層アーキテクチャの設計案

#### 案A: パスルーター型（単純アドレス解決）

```
パスリクエスト
  → パス解析
  → ストレージルーティング
    /entities/* → Graph DB
    /sessions/* → Redis
    /metrics/*  → TimescaleDB
```

**レイテンシ**: < 10ms（パス解析） + バックエンド応答時間
**実装複雑性**: 低
**フォールバック**: バックエンド障害時はエラー応答

#### 案B: セマンティック検索統合型

```
パスリクエスト
  ├── パスベースアクセス（明確なパス）→ パスルーター
  └── セマンティックアクセス（自然言語）→ セマンティックリゾルバー → パスルーター
```

**レイテンシ**: パスベース < 10ms、セマンティック < 500ms
**実装複雑性**: 高
**フォールバック**: セマンティックリゾルバー障害時はパスベースのみ

#### 案C: キャッシュ階層型（推奨案）

```
パスリクエスト
  → L1 キャッシュ（インメモリ）< 1ms
    → L2 キャッシュ（Redis）< 5ms
      → バックエンド（Graph DB 等）< 100ms
        → ローカルスナップショット（全障害時）
```

**レイテンシ**: L1ヒット < 1ms、L2ヒット < 5ms、バックエンド < 100ms
**実装複雑性**: 中
**フォールバック**: L1→L2→backend→local-snapshot の段階的劣化（不変原理3に適合）

### 論点3: Memory 3構造とのマッピング設計案

#### 明示的方式

```
/memory/long-term/patterns/success/early-onboarding
/memory/working/sessions/{session-id}/context
/memory/evaluative/metrics/retention-rate
```

**利点**: 記憶構造がパスから自明。デバッグが容易
**欠点**: パスが長くなる。エージェントが記憶構造を意識する必要がある

#### 暗黙的方式

```
/customers/acme-corp
（内部的に長期記憶にルーティング）
```

**利点**: エージェントが記憶構造を意識しない。パスが短い
**欠点**: どの記憶構造に格納されるかが不透明

#### ハイブリッド方式（推奨案）

```
/entities/customers/{slug}       # 長期記憶（暗黙的）
/sessions/{session-id}/{key}     # 作業記憶（明示的）
/metrics/{metric-name}           # 評価記憶（明示的）
/patterns/success/{slug}         # 長期記憶（明示的）
```

**利点**: 主要アクセスパス（entities）で記憶構造を意識しないが、作業記憶・評価記憶は時間的性質が異なるため明示的に分離
**欠点**: 名前空間の設計が複雑

**時系列データの表現**（評価記憶）:

| 方式 | パス例 | 利点 | 欠点 |
|------|--------|------|------|
| 日付をパスに含める | `/metrics/retention-rate/2024/q1` | 人間可読 | 日付粒度が固定。集計困難 |
| クエリパラメータ | `/metrics/retention-rate?from=2024-01&to=2024-03` | 日付粒度が自由 | パスだけでは不明 |
| ハイブリッド（推奨） | `/metrics/retention-rate/latest` + クエリパラメータ | 最新値への簡便アクセス + 柔軟クエリ | 実装が複雑 |

### 論点4: パス階層の進化戦略

#### 案A: パスバージョニング

```
/v1/entities/customers/{slug}
/v2/entities/customers/{slug}
```

**実装複雑性**: 中（複数バージョンの並行運用）
**後方互換性**: 高
**運用コスト**: 高（複数バージョンの保守）

#### 案B: エイリアスレジストリ（推奨案）

```yaml
# /config/path-aliases
aliases:
  - old: /entities/clients/*
    new: /entities/customers/*
    expires: "2025-06-01"
```

**実装複雑性**: 低
**後方互換性**: 高（旧パスは新パスにリダイレクト）
**運用コスト**: 低（レジストリの管理のみ）

#### 案C: 破壊的変更 + マイグレーション

**実装複雑性**: 低
**後方互換性**: 無（旧パスは即座に無効）
**運用コスト**: 中（マイグレーション実行）

## 仮説の評価

### 論点1: パス階層構造の比較

| 設計案 | エージェント認知負荷 | 拡張性 | 人間可読性 | Layer 1 との整合性 | AI-data-rep 適合 | 推奨度 |
|--------|---------------------|--------|-----------|-------------------|------------------|--------|
| A: リソース階層型 | 中（深いネストで迷う） | 低（親子関係が固定） | 高（REST 慣習） | 低（グラフ→ツリー強制） | 非適合（3階層以上） | C |
| B: ドメイン駆動型 | 高（ドメイン判断必要） | 低（ドメイン境界依存） | 中（ドメイン知識前提） | 中 | 適合（2階層） | B |
| C: フラットエンティティ型 | 低（全て同じ構造） | 高（エンティティ追加容易） | 中（関係性が暗黙的） | 高（グラフと1:1対応） | 適合（2階層） | A |

### 論点2: 変換層アーキテクチャの比較

| アーキテクチャ案 | レイテンシ目標 | 実装複雑性 | フォールバック設計 | 原理3適合 | 推奨度 |
|----------------|---------------|-----------|-------------------|-----------|--------|
| A: パスルーター型 | < 10ms + backend | 低 | エラー応答のみ | 弱 | B |
| B: セマンティック統合型 | < 500ms | 高 | セマンティック→パスベースに劣化 | 中 | C |
| C: キャッシュ階層型 | < 1ms (ヒット) / < 100ms (ミス) | 中 | L1→L2→backend→snapshot | 強 | A |

### 論点3: Memory 3構造マッピングの比較

| 方式 | パス例 | 利点 | 欠点 | 推奨度 |
|------|--------|------|------|--------|
| 明示的 | `/memory/long-term/...` | 記憶構造が自明 | パスが長い | C |
| 暗黙的 | `/customers/...` | パスが短い | 構造が不透明 | B |
| ハイブリッド | `/entities/` + `/sessions/` + `/metrics/` | 主要パスは短く、時間特性が異なるものは明示 | 設計が複雑 | A |

### 論点4: 進化戦略の比較

| 戦略 | 実装複雑性 | 後方互換性 | 運用コスト | Phase 1-4 適用 | 推奨度 |
|------|-----------|-----------|-----------|----------------|--------|
| A: パスバージョニング | 中 | 高 | 高 | Phase 1-2: v1, Phase 3-4: v2 | C |
| B: エイリアスレジストリ | 低 | 高 | 低 | 全 Phase で同一方式 | A |
| C: 破壊的変更 | 低 | 無 | 中 | Phase 間移行時 | B |

## 結論

### 採用する設計

#### 論点1（パス階層構造）: **案C（フラットエンティティ + リレーショングラフ型）**

理由:
- AI-data-representation.md の「階層は2段まで」原則に完全適合
- Graph DB（Neural Organization の Memory 実装）と自然に対応
- エンティティの多重帰属問題が構造的に解決される
- ドメインコンテキストの変更に影響されない安定性

**完全な命名規則**:

1. **パスの深さ**: 最大2階層（`/{namespace}/{entity-type}/{identifier}`）
2. **命名規則**: ケバブケース（kebab-case）
3. **単数形 vs 複数形**: エンティティ種別は複数形、個別インスタンスはスラッグまたはID
4. **動的要素**: スラッグ優先、ID をフォールバック（スラッグ: `acme-corp`、ID: `cust_acme_corp`）

**名前空間の定義**:

| 名前空間 | 用途 | パス例 |
|-----------|------|--------|
| `/entities/` | エンティティの状態（長期記憶） | `/entities/customers/acme-corp` |
| `/relations/` | エンティティ間の関係 | `/relations/customers/acme-corp/deals` |
| `/sessions/` | 作業記憶（揮発的） | `/sessions/{session-id}/context` |
| `/metrics/` | 評価記憶（時系列KPI） | `/metrics/retention-rate` |
| `/patterns/` | 長期記憶（成功・失敗パターン） | `/patterns/success/early-onboarding` |
| `/config/` | システム設定 | `/config/orchestration/priority-weights` |
| `/traces/` | 実行トレース | `/traces/{trace-id}` |

**Layer 1 エンティティとのマッピング**:

| Layer 1 エンティティ | パス例 | 属性の例 |
|---------------------|--------|----------|
| Customer | `/entities/customers/acme-corp` | name, segment, mrr, health-score |
| Deal | `/entities/deals/acme-expansion-2024` | stage, amount, probability, close-date |
| Product | `/entities/products/platform-pro` | name, pricing-tier, feature-set |
| Employee | `/entities/employees/sarah-tanaka` | role, skills, assigned-customers |
| Campaign | `/entities/campaigns/q1-enterprise-push` | channel, budget, target-segment |
| Market | `/entities/markets/japan-enterprise-saas` | size, growth-rate, competitors |

#### 論点2（変換層）: **案C（キャッシュ階層型）**

理由:
- アクセス頻度に応じたレイテンシ最適化
- 不変原理3「優雅な劣化」に強く適合（L1→L2→backend→local-snapshot のフォールバックチェイン）
- 実装複雑性とパフォーマンスのバランスが最適

**変換アーキテクチャ**:

```
エージェントからのリクエスト
  ↓
L1 キャッシュ（インメモリ）
  - スラッグ→ID マッピング
  - エンティティメタデータ
  - TTL: 5分
  - レイテンシ: < 1ms
  ↓ ミス
L2 キャッシュ（Redis）
  - エンティティ状態スナップショット
  - 関係性キャッシュ
  - TTL: 1時間
  - レイテンシ: < 5ms
  ↓ ミス
バックエンドルーター
  - Graph DB（Neo4j）: /entities/*, /relations/*
  - TimescaleDB: /metrics/*
  - Redis: /sessions/*
  - Document Store: /config/*, /patterns/*
  - レイテンシ: < 100ms
  ↓ 全障害時
ローカルスナップショット（読み取り専用）
```

**整合性保証**:
- 書き込み: Write-Through パターン（backend 成功後に L2→L1 を無効化）
- 読み取り: Read-Through パターン（キャッシュミス時に backend から取得）
- 長期記憶: 結果整合性、作業記憶: 強整合性

#### 論点3（Memory 3構造マッピング）: **ハイブリッド方式**

理由:
- 主要アクセスパス（entities）で記憶構造を意識しない設計により、エージェントの認知負荷を最小化
- 作業記憶（sessions）と評価記憶（metrics）は時間特性が異なるため、明示的に分離することで適切な TTL・保持ポリシーを適用可能

**名前空間 → 記憶構造のマッピング**:

| 名前空間 | 記憶構造 | バックエンド | 時間特性 | 忘却ポリシー |
|-----------|----------|-------------|----------|-------------|
| `/entities/` | 長期記憶（世界モデル） | Graph DB + Vector DB | 年〜永続 | 原則として忘却しない |
| `/relations/` | 長期記憶（関係性グラフ） | Graph DB | 年〜永続 | エンティティ削除時にカスケード |
| `/patterns/` | 長期記憶（成功/失敗パターン） | Vector DB + Document Store | 年〜永続 | 信頼度閾値以下で忘却 |
| `/sessions/` | 作業記憶 | Redis | 秒〜日 | タスク完了後またはTTL経過で忘却 |
| `/metrics/` | 評価記憶 | TimescaleDB | 週〜月 | 1年後にサマリに圧縮 |
| `/traces/` | 評価記憶（実行トレース） | JSONL + TimescaleDB | 日〜年 | 保持期間ポリシーに従う |
| `/config/` | 長期記憶（設定） | Document Store | 永続 | バージョニングで管理 |

**時系列データの表現**（評価記憶）: クエリパラメータ方式 + `/latest` ショートカット

```
# 最新値へのアクセス
/metrics/retention-rate/latest
  → { value: 91.2, timestamp: "2024-02-12T00:00:00Z", trend: "improving" }

# 時系列クエリ
/metrics/retention-rate?from=2024-01-01&to=2024-03-31&granularity=weekly
  → [ { week: "2024-W01", value: 88.0 }, ... ]
```

#### 論点4（進化戦略）: **エイリアスレジストリ方式**

理由:
- 不変原理5「設定のデータ化」と直接整合（パス構造の変更自体がデータとして管理される）
- 実装が単純で運用コストが低い
- Phase 1-4 を通じて一貫した方式を採用可能

**エイリアスレジストリの設計**:

```yaml
# /config/path-aliases
aliases:
  - old: /entities/clients/*
    new: /entities/customers/*
    created: "2024-06-01"
    expires: "2025-06-01"    # 12ヶ月の猶予期間
    reason: "naming convention standardization"
```

**パス解決フロー**:

```
リクエストパス
  ↓
エイリアスレジストリに存在する？
  ├── Yes → 新パスにリダイレクト + deprecation 警告
  └── No → 通常のパス解決
```

**猶予期間**: 12ヶ月（デフォルト）。Layer 4 Reflection が旧パスの利用が多いことを検出した場合、自動延長。

**パス構造自体のデータ化**:

パス構造の定義を `/config/path-schema` にデータとして格納し、Reflection による自己改善を可能にする。

```yaml
# /config/path-schema
namespaces:
  entities:
    description: "世界モデルのエンティティ（長期記憶）"
    types: [customers, deals, products, employees, campaigns, markets, leads, tickets]
    identifier: slug
    fallback-identifier: id
  # ... 他の名前空間
```

### 不変原理との整合性の確認

| 不変原理 | 整合性 | 備考 |
|---------|--------|------|
| 原理1: 能力による間接参照 | ✓ 適合 | パス階層はエンティティの「何」をアドレッシングし、「誰が」読み書きするかは問わない |
| 原理2: 計測なきシステムは収束しない | ✓ 適合 | `/traces/` 名前空間が全実行イベントの記録を保証 |
| 原理3: 優雅な劣化 | ✓ 適合 | L1→L2→backend→local-snapshot のフォールバックチェイン |
| 原理4: コンテキストは有限資源 | ✓ 適合 | フラットな2階層構造により、エージェントの認知負荷が最小化 |
| 原理5: 設定のデータ化 | ✓ 適合 | パス構造自体が `/config/path-schema` としてデータ化 |

## ネクストアクション

### 1. ドキュメント更新

以下のドキュメントに本決定を反映する:

- `docs/philosophy/memory-design.md`: Memory の3構造とパス階層のマッピングを追加
- `docs/design.md`: Layer 1 Understanding のエンティティモデルにパス例を追加
- `docs/concept.md` §2.6 Memory: 「状態のアドレッサビリティ」原則を追加

### 2. パス階層仕様の完全版作成

`docs/specifications/path-hierarchy-v1.yaml` として、完全なパス階層仕様を YAML で記述する:
- 全名前空間の定義
- 変換層のルーティングルール
- キャッシング戦略
- エイリアスレジストリのスキーマ

### 3. 実装プロトタイプの作成（Phase 1）

Phase 1 で必要な最小限のパス階層を実装する:
- `/entities/` 名前空間の基本実装
- パスルーター（Graph DB へのルーティング）
- スラッグ→ID 解決の L1 キャッシュ
- `/config/path-schema` の初期定義

### 4. 既存ドキュメントへの参照追加

以下のドキュメントに本決定への参照を追加:
- `docs/decisions/007-layer2-dual-mode-reasoning.md`: パターン表現スキーマのパスを本決定の名前空間に合わせる
- `docs/invariant-principles.md`: 設計不変量 I1（間接参照層）の実装として変換層を追加

## 残された論点

### 残論点1: マルチテナント設計

Neural Organization は複数の組織に導入される想定（concept.md §5.3）。パス階層にテナント識別子を含めるか（`/{tenant}/entities/...`）、変換層で透過的に解決するかの設計判断が必要。

**仮説**: テナント識別子はパスに含めず、認証コンテキストから暗黙的に解決すべき。これにより3階層への拡張を回避できる。エージェントが複数テナントを横断する必要がある場合（Network Intelligence の実現時）のみ、明示的なテナント指定を許容する。

### 残論点2: パス階層のアクセス制御モデル

Governance の Trust Score に基づいて、特定のパスへのアクセスを制限する仕組みが必要。

**例**:
- Trust Score が Learning レベルのエージェントは `/config/governance/*` への書き込みを禁止
- 特定の Customer エンティティに対して、権限のないエージェントからのアクセスを制限

これは Governance 設計（governance-design.md）との統合設計が必要。

### 残論点3: セマンティック検索インターフェースの設計

論点2で検討したセマンティック検索（自然言語→パス変換）は、Phase 2 以降でエージェントの自律性が高まる際に重要になる。パスベースアクセスとセマンティックアクセスの統合設計は、Phase 2 の設計フェーズで具体化する必要がある。

**例**: "Acme の商談状況" → `/entities/deals?customer=acme-corp&status=active`

### 残論点4: パス上での横断検索の表現

現在の設計では、単一エンティティへのアクセスと、エンティティ間の関係の探索は明確だが、「health-score < 50 の全 Customer」のような条件ベースの横断検索をパスでどう表現するかが未定義。

**選択肢**:
- A: クエリパラメータ `/entities/customers?health-score.lt=50`
- B: 専用のクエリエンドポイント `/queries/at-risk-customers`
- C: セマンティック検索に委ねる

### 残論点5: 実行トレースとパス構造の循環参照の安定性

パス構造自体がデータ化され（`/config/path-schema`）、その読み書きが実行トレースに記録され（`/traces/`）、Reflection がトレースを分析してパス構造を改善する、という循環が成立する。この循環の安定性（無限ループの回避）と収束性の検証が必要。

**提案**: パス構造の変更は Governance Gate を通じて人間の承認を必須とすることで、無制限な自己改変を防止する。

### 残論点6: バイナリデータ・大容量データのパス表現

現在の設計はテキスト/構造化データを前提としているが、プレゼン資料（PPTX）、画像、動画などの大容量バイナリデータをパス階層でどう表現するかが未定義。Object Storage（S3等）との統合設計が必要。

**仮説**: バイナリデータは `/blobs/{entity-type}/{entity-id}/{file-name}` のようなパスでアドレッシングし、内部的には Object Storage の署名付き URL にリダイレクトする。

## 関連ドキュメント

- [docs/concept.md](../concept.md) §2.6 Memory — Memory 横断的要素の概念定義
- [docs/design.md](../design.md) §2.3 Memory — Memory の3構造と技術スタック
- [docs/philosophy/memory-design.md](../philosophy/memory-design.md) — Memory の詳細設計
- [docs/invariant-principles.md](../invariant-principles.md) — 5つの不変原理
- [docs/decisions/007-layer2-dual-mode-reasoning.md](007-layer2-dual-mode-reasoning.md) — パターン表現スキーマがパス階層を利用
- `~/.claude/rules/ai-data-representation.md` — AI 向けデータ表現の設計原則

## 変更履歴

- 2026-02-23: 初版作成（Openclaw 分析に基づく状態のアドレッサビリティ設計の決定）
