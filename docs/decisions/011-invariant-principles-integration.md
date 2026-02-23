# 不変原理の階層統合

## 問い

Openclaw の洞察を Neural Organization の5つの不変原理とどう統合するべきか？各原理への統合方法、原理間の階層構造、Layer 0-4 および横断的要素とのマッピングはどうあるべきか？

## 論点

1. **各不変原理への Openclaw 洞察の統合方法は何か？**
2. **原理間に階層構造または依存関係は存在するか？**
3. **原理は Layer 0-4 および横断的要素のどこに主に適用されるか？**
4. **Phase 1-4 における原理の重要度はどう変化するか？**
5. **6つ目の原理「State Addressability」を追加すべきか？**

## 論点分解

### 論点1: Openclaw 洞察の統合方法
- 原理1（Capability Indirection）に「状態の外部化」「Unix 権限」をどう統合するか
- 原理2（Observability Primacy）に「共有名前空間」をどう統合するか
- 原理3（Graceful Degradation）に Openclaw の洞察をどう活かすか
- 原理4（Context as Currency）に「ファイルシステムとしての状態」をどう統合するか
- 原理5（Configuration as Data）を拡張すべきか

### 論点2: 原理の階層構造
- 5つの原理は並列か、階層構造か
- Openclaw 洞察を統合した結果、原理間に依存関係が生まれるか
- 基盤原理・機能原理・横断制約の分類が可能か

### 論点3: 原理の適用先マッピング
- 各原理が Layer 0-4 のどこに主に適用されるか
- 横断的要素（Purpose, Governance, Memory, Orchestration）との関係は何か
- ADR-008 のパス階層と各レイヤーのアクセスパターンの対応は何か

### 論点4: Phase 別の原理の重要度
- Phase 1（Awakening）でフォーカスすべき原理は何か
- Phase 2（Symbiosis）でフォーカスすべき原理は何か
- Phase 3（Metamorphosis）でフォーカスすべき原理は何か
- Phase 4（Emergence）でフォーカスすべき原理は何か

### 論点5: 6つ目の原理の要否
- 「State Addressability」は独立した原理として追加すべきか
- 既存原理への統合で十分か
- 設計不変量の追加で対応可能か

## 仮説構築

### 原理1: 能力による間接参照（Capability Indirection）への統合

**統合方針**: 実行リソースだけでなく、**状態へのアクセスも間接参照層を経由させる**。

現在の原理1は `classify(Action) → CapabilityRequirement → ExecutionResource` という経路でアクション実行を間接参照しています。ここに Openclaw の「状態の外部化」と「Unix 権限モデル」を統合すると、状態へのアクセスにも同じ間接参照パターンを適用する設計になります。

```
# 現在の原理1（実行の間接参照）
delegate(action) = resolve(classify(action))
  where classify: Action → CapabilityRequirement
        resolve:  CapabilityRequirement → ExecutionResource

# 拡張: 状態アクセスの間接参照
access(state_path, operation) = authorize(resolve_path(state_path), operation, trust_context)
  where resolve_path:  PathRequest → StorageBackend
        authorize:     (StorageBackend, Operation, TrustContext) → Result
        operation ∈ {read, write, execute}
```

**Unix 権限モデルの統合**: Trust Score に基づく rwx 権限として実装

```yaml
# /config/access-control/layer3-execution
permissions:
  - path: /entities/*
    trust_level: cold_start
    operations: [read]  # Cold Start では読み取りのみ

  - path: /entities/*
    trust_level: learning
    operations: [read, write]  # Learning で書き込み許可

  - path: /config/orchestration/*
    trust_level: trusted
    operations: [read]  # 設定の読み取りは Trusted から

  - path: /config/orchestration/*
    trust_level: highly_trusted
    operations: [read, write]  # 設定の書き込みは Highly Trusted のみ

  - path: /config/governance/*
    trust_level: human_only
    operations: [read, write, execute]  # Governance 設定は人間のみ
```

**実装例（Python）**:

```python
from typing import Optional, Set, Dict

class Permission:
    READ = "read"
    WRITE = "write"
    EXECUTE = "execute"

# Trust Score → 許可される操作の解決
TRUST_PERMISSIONS: Dict[str, Dict[str, Set[str]]] = {
    "cold_start": {
        "/entities/*": {Permission.READ},
        "/sessions/*": {Permission.READ, Permission.WRITE},
        "/traces/*": {Permission.WRITE},
        "/config/*": set(),
        "/metrics/*": {Permission.READ},
    },
    "learning": {
        "/entities/*": {Permission.READ, Permission.WRITE},
        "/sessions/*": {Permission.READ, Permission.WRITE},
        "/traces/*": {Permission.READ, Permission.WRITE},
        "/config/*": {Permission.READ},
        "/metrics/*": {Permission.READ, Permission.WRITE},
    },
    "trusted": {
        "/entities/*": {Permission.READ, Permission.WRITE},
        "/sessions/*": {Permission.READ, Permission.WRITE, Permission.EXECUTE},
        "/traces/*": {Permission.READ, Permission.WRITE},
        "/config/*": {Permission.READ},
        "/metrics/*": {Permission.READ, Permission.WRITE},
    },
    "highly_trusted": {
        "/entities/*": {Permission.READ, Permission.WRITE, Permission.EXECUTE},
        "/sessions/*": {Permission.READ, Permission.WRITE, Permission.EXECUTE},
        "/traces/*": {Permission.READ, Permission.WRITE},
        "/config/*": {Permission.READ, Permission.WRITE},
        "/metrics/*": {Permission.READ, Permission.WRITE},
    },
}

def authorize(
    path: str,
    operation: str,
    trust_level: str,
    domain: Optional[str] = None,
) -> bool:
    """
    パスとオペレーションと信頼レベルから認可判定する。
    domain が指定された場合、その領域の Trust Score を使用する。
    """
    permissions = TRUST_PERMISSIONS.get(trust_level, {})
    for pattern, allowed_ops in permissions.items():
        if _matches_pattern(path, pattern):
            return operation in allowed_ops
    return False
```

### 原理2: 計測なきシステムは収束しない（Observability Primacy）への統合

**統合方針**: 共有名前空間を**計測の前提条件**として位置づける。

原理2が機能するためには、「何を計測するか」が一意に特定可能でなければなりません。ADR-008 で定義したパス階層（`/entities/`, `/metrics/`, `/traces/` 等）は、計測対象のアドレッシングを可能にする基盤です。

```
# 現在の原理2
For every execution event e:
  record(e.input, e.output, e.cost, e.outcome, e.human_feedback)

# 拡張: 計測対象のアドレッサビリティ
For every execution event e:
  trace_path = /traces/{trace-id}
  record(trace_path, e.input, e.output, e.cost, e.outcome, e.human_feedback)

  # 計測結果も一意のパスで参照可能
  For every metric m derived from e:
    metric_path = /metrics/{metric-name}
    update(metric_path, m.value, m.timestamp)
```

**共有名前空間がもたらす効果**:

| 効果 | 共有名前空間なし | 共有名前空間あり |
|------|----------------|-----------------|
| 計測対象の特定 | 各層が独自のストレージに分散 | `/traces/{id}` で一意に特定 |
| 計測結果の横断参照 | 別システムへの問い合わせが必要 | `/metrics/` 配下で統一的にアクセス |
| Reflection の入力 | データ変換・統合コストが高い | パス階層を辿るだけで取得可能 |
| 人間の監査 | ツール・ダッシュボードが分散 | Transparency Interface で一元的に参照 |

### 原理3: 優雅な劣化（Graceful Degradation）への統合

**統合方針**: ADR-008 のキャッシュ階層型変換層が、原理3の直接的な実装。

```
L1 キャッシュ（インメモリ）< 1ms
  → L2 キャッシュ（Redis）< 5ms
    → バックエンド（Graph DB 等）< 100ms
      → ローカルスナップショット（読み取り専用）
```

Openclaw の「ファイルシステムとしての状態表現」を Neural Organization に統合する際、このフォールバックチェインの最終段（ローカルスナップショット）が重要です。全バックエンド障害時でも、**ローカルのファイルシステムスナップショットから読み取り専用で状態にアクセスできる**設計は、原理3の「システム自身の基本能力で終端する」という要件を満たします。

```yaml
# フォールバックチェインの具体的な設計
fallback_chain:
  - level: L1
    backend: in_memory_cache
    latency: "< 1ms"
    capability: read_write
    failure_mode: cache_miss

  - level: L2
    backend: redis
    latency: "< 5ms"
    capability: read_write
    failure_mode: connection_timeout

  - level: L3
    backend: graph_db_or_timescale
    latency: "< 100ms"
    capability: read_write
    failure_mode: service_unavailable

  - level: L4_terminal  # 原理3: resolve_chain[-1] = system_core_capability
    backend: local_filesystem_snapshot
    latency: "< 10ms"
    capability: read_only
    failure_mode: none  # ローカルファイルは常に利用可能
    staleness: "snapshot 時点の状態（最大 24h 遅延）"
```

### 原理4: コンテキストは有限資源（Context as Currency）への統合

**統合方針**: パス階層をコンテキスト予算の最適化手段として位置づける。

Openclaw の「ファイルシステムとしての状態」が原理4に寄与する点は、**エージェントが必要な状態にアクセスする際の認知コストの最小化**です。

```
# コンテキスト予算の消費モデル
context_cost(state_access) = path_resolution_cost + data_size_cost + relevance_filtering_cost

# フラット2階層パスの効果
path_resolution_cost(/entities/customers/acme-corp) = O(1)  # 直接的なパス
path_resolution_cost(SELECT * FROM customers WHERE ...) = O(n)  # SQLクエリの構築・解釈

# ADR-008 の設計がコンテキスト予算を節約する根拠
context_savings =
  query_construction_cost_avoided +  # パスが自明なので構文を組み立てる必要がない
  schema_memorization_avoided +      # 名前空間が共通なのでスキーマを覚える必要がない
  result_parsing_cost_avoided        # 返却値の構造が一貫しているので解釈コストが低い
```

### 原理5: 設定のデータ化（Configuration as Data）の拡張

**統合方針**: **原理5を「Configuration and State as Data」に拡張する**。

これが今回の分析で最も重要な結論です。

現在の原理5は以下のように定義されています。

> システムの構成（ルーティングルール、優先度重み、フォールバックチェイン）は、システム自身が読み書き可能なデータでなければならない。

Openclaw の洞察は、**設定だけでなく、組織の状態そのもの**もシステム自身が読み書き可能なデータであるべきことを示しています。ADR-008 のパス階層設計は、まさにこの拡張を実現しています。

```
# 現在の原理5
config ∈ State  (hardcoded ではなく、mutable state)
evolve: (config, execution_traces) → config'

# 拡張後の原理5
config ∈ AddressableState
org_state ∈ AddressableState
path_schema ∈ AddressableState  # パス構造自体もデータ

evolve: (config, org_state, execution_traces) → (config', org_state')

where AddressableState = { s | ∃ path ∈ PathHierarchy : resolve(path) = s }
```

**拡張が正当化される根拠**:

| 比較軸 | 現在の原理5 | 拡張案 |
|--------|------------|--------|
| 対象範囲 | ルーティングルール、優先度重み、フォールバックチェイン | 上記 + エンティティ状態、パターン、メトリクス、トレース |
| Evolution Engine の入力 | config + traces | config + org_state + traces |
| 自己改善の深さ | 設定パラメータの調整 | 設定 + 世界モデル + パターン + 記憶構造の進化 |
| ADR-008 との整合 | `/config/` 名前空間のみ | 全名前空間 |

**改定案**:

> **原理5: 構成と状態のデータ化（Configuration and State as Data）**
>
> システムの構成（ルーティングルール、優先度重み、フォールバックチェイン）および組織の状態（エンティティ、パターン、メトリクス）は、システム自身が一意のパスで読み書き可能なデータでなければならない。

形式的表現の改定:

```
For all system_data d:
  d ∈ AddressableState  (hardcoded ではなく、パスで参照可能な mutable state)
  ∃ path ∈ PathHierarchy : resolve(path) = d

evolve: (AddressableState, execution_traces) → AddressableState'
```

## 仮説の評価

### 原理の階層構造

5つの不変原理は並列ではなく、以下の依存関係を持ちます。

```
原理5（Configuration and State as Data）← 基盤層
  │
  ├── 原理1（Capability Indirection）
  │     「間接参照のマッピング」自体がデータとして外部化されるため、
  │     原理1は原理5に依存する
  │
  ├── 原理2（Observability Primacy）
  │     「計測結果を記録する先」がデータ化された状態空間であるため、
  │     原理2は原理5に依存する
  │
  └── 原理4（Context as Currency）
        「コンテキスト予算の設定」自体がデータとして調整可能であるため、
        原理4は原理5に依存する

原理3（Graceful Degradation）← 横断制約
  │
  └── 原理1, 2, 4, 5 のすべての実装に対して
      「フォールバックを持つこと」を要求する
```

図示すると以下のような構造です。

```
           ┌──────────────────────────────┐
           │   原理3: Graceful Degradation │  ← 横断制約（全原理に適用）
           │   「すべてにフォールバック」    │
           └──────────┬───────────────────┘
                      │ 制約
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌────────┐    ┌────────┐    ┌────────────┐
│ 原理1  │    │ 原理2  │    │  原理4     │  ← 機能原理
│Capability│  │Observa-│    │Context as  │
│Indirection│ │bility  │    │Currency    │
└────┬───┘    └────┬───┘    └─────┬──────┘
     │             │              │
     └─────────────┴──────────────┘
                   │ 依存
                   ▼
           ┌────────────────┐
           │    原理5        │  ← 基盤原理
           │ Configuration   │
           │ and State       │
           │ as Data         │
           └────────────────┘
```

### 原理と Layer 0-4 のマッピング

| 原理 | 主適用 Layer | 主適用 横断要素 | 根拠 |
|------|-------------|----------------|------|
| 原理1 | **Layer 3** (Execution) | Orchestration | 実行リソースの選択が Layer 3 の核心。Orchestration のリソース配分も能力ベース |
| 原理2 | **Layer 4** (Reflection) | Memory, Governance | Reflection は計測データの消費者。Memory は計測データの保管先 |
| 原理3 | **全層** | Orchestration | フォールバックチェインは全層に存在。Orchestration のエラー回復が統率 |
| 原理4 | **Layer 2** (Reasoning) | Governance, Purpose | Reasoning の判断にコンテキスト予算が直結。Governance の二重フィルタリングも原理4の体現 |
| 原理5 | **全層** | Memory, Orchestration | 全層の永続状態がデータ化。Memory の3構造がデータ基盤 |

### 名前空間とレイヤーの対応

| 名前空間 | Layer 0 | Layer 1 | Layer 2 | Layer 3 | Layer 4 | 主な原理 |
|----------|---------|---------|---------|---------|---------|---------|
| `/entities/` | W | RW | R | R | R | 原理5 |
| `/relations/` | - | RW | R | - | R | 原理5 |
| `/patterns/` | - | - | RW | R | RW | 原理2, 5 |
| `/sessions/` | W | RW | RW | RW | R | 原理4 |
| `/metrics/` | - | - | R | - | RW | 原理2 |
| `/traces/` | - | - | - | W | RW | 原理2 |
| `/config/` | R | R | R | R | RW | 原理1, 5 |

### Phase 1-4 における原理の重要度

| 原理 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|
| 原理1: Capability Indirection | 低 | 中 | 高 | 最高 |
| 原理2: Observability Primacy | **最高** | 高 | 高 | 高 |
| 原理3: Graceful Degradation | 中 | 中 | 高 | **最高** |
| 原理4: Context as Currency | 中 | **最高** | 高 | 中 |
| 原理5: Config & State as Data | **最高** | 高 | 高 | 高 |

**Phase 別のフォーカス**:

- **Phase 1 (Awakening)**: 原理2 + 原理5 が最重要。計測基盤とデータ基盤を構築しないと、以降の Phase で学習・進化ができない
- **Phase 2 (Symbiosis)**: 原理4 が最重要。「提案→承認→実行」のループで人間の注意を最適配分することが、信頼構築の鍵
- **Phase 3 (Metamorphosis)**: 原理1 + 原理3 が最重要。自律範囲の拡大に伴い、実行リソースの動的選択と障害時の優雅な劣化が不可欠
- **Phase 4 (Emergence)**: 原理3 が最重要。完全自律に近い状態で、システムの予測不能な行動から組織を守るのは原理3

### 6つ目の原理「State Addressability」追加の要否

**結論: 追加すべきではない。原理5を拡張すべき。**

| 判断基準 | 追加する場合 | 原理5を拡張する場合 |
|----------|-------------|-------------------|
| 概念の独立性 | 「状態のアドレッサビリティ」は「設定のデータ化」とは別の概念か？ → **いいえ** | 「設定」の範囲を「状態」に広げることで自然に包含される |
| 原理の数 | 6つになると認知負荷が増加 | 5つのまま |
| 設計不変量との整合 | I1-I7 に I8 を追加 | I5 を拡張すれば十分 |
| 実装上の影響 | ADR-008 が原理6の実装になる | ADR-008 を原理5の拡張として位置づけ |

**ただし、設計不変量を1つ追加する**:

```
I8: 状態のアドレッサビリティ — すべてのシステム状態は一意のパスで参照可能であり、
    一貫した名前空間を通じてアクセスされる
    (導出元: 原理5 + 原理2)
```

この I8 は、原理5（データ化）と原理2（計測可能性）の両方から導出されます。

## 結論

### 各原理への Openclaw 洞察の統合方法

1. **原理1（Capability Indirection）**: 状態アクセスにも間接参照パターンを適用。Trust Score ベースの rwx 権限モデルを `/config/access-control/` で管理

2. **原理2（Observability Primacy）**: 共有名前空間を計測の前提条件として位置づける。設計不変量 I8（State Addressability）を追加

3. **原理3（Graceful Degradation）**: ADR-008 のキャッシュ階層型変換層がそのまま実装。ローカルスナップショットが最終フォールバック

4. **原理4（Context as Currency）**: フラット2階層パスがコンテキスト予算を最適化する設計として機能

5. **原理5（Configuration as Data）**: 「Configuration and State as Data」に拡張する。これが最も重要な変更

### 原理の階層構造

原理間の依存関係は「原理5が基盤、原理3が横断制約、原理1/2/4が機能原理」という3層構造。

- **基盤層**: 原理5（すべての状態・設定がアドレッサブルなデータ）
- **機能層**: 原理1, 2, 4（間接参照、計測、コンテキスト管理）
- **横断制約**: 原理3（全原理の実装にフォールバックを要求）

### 原理と実装の対応

- **原理1**: Layer 3（Execution）、Orchestration に主に適用
- **原理2**: Layer 4（Reflection）、Memory, Governance に主に適用
- **原理3**: 全層、Orchestration のエラー回復に主に適用
- **原理4**: Layer 2（Reasoning）、Governance, Purpose に主に適用
- **原理5**: 全層、Memory, Orchestration に主に適用

### Phase 別のフォーカス

- **Phase 1**: 原理2 + 原理5（計測基盤・データ基盤の構築）
- **Phase 2**: 原理4（人間の注意の最適配分）
- **Phase 3**: 原理1 + 原理3（動的選択・優雅な劣化）
- **Phase 4**: 原理3（完全自律でのリスク管理）

### 6つ目の原理は追加しない

原理5を「Configuration and State as Data」に拡張し、設計不変量 I8（State Addressability）を追加することで対応する。

## ネクストアクション

1. **invariant-principles.md の改定**（1週間）
   - 原理5の定義を「Configuration and State as Data」に更新
   - 設計不変量 I5 を「アドレッサブル状態」に拡張
   - 設計不変量 I8（State Addressability）を追加
   - 原理の階層構造を図示
   - 設計判断時のチェックリストを改定

2. **concept.md および design.md の参照更新**（3日）
   - 原理5への参照を確認し、必要に応じて更新
   - Memory の3構造と原理5の関係を明記

3. **Phase 1 で構築すべきデータ基盤の詳細化**（1週間）
   - `/entities/`, `/sessions/`, `/traces/`, `/config/`, `/metrics/` の最小実装
   - 各名前空間のバックエンド選定（Phase 1 はシンプルに）
   - Trust Score と Unix 権限のマッピング実装

4. **原理の適用チェックリストの運用開始**（継続的）
   - 設計判断時に5原理をチェックする習慣化
   - ADR 作成時に「どの原理を適用したか」を明記

## 残論点

1. **原理5の拡張は後方互換性を保てるか？**
   - 既存の設計文書（ADR 001-006）は「Configuration as Data」を前提としている
   - 「Configuration and State as Data」への拡張により、過去の ADR の解釈が変わる可能性
   - 既存 ADR の見直しが必要か？

2. **設計不変量 I8 は I5 から導出可能では？**
   - I8（State Addressability）は I5（Config & State as Data）+ I2（Observability）の組み合わせで導出できる
   - 独立した不変量として列挙すべきか、導出規則として記述すべきか？

3. **Phase 1 で全名前空間を構築するのは過剰では？**
   - `/entities/`, `/sessions/`, `/config/` の3つで十分では？
   - `/patterns/`, `/metrics/`, `/traces/` は Phase 2 から導入すべきか？

4. **Trust Score ベースの rwx 権限は細かすぎないか？**
   - Cold Start / Learning / Trusted / Highly Trusted の4レベルで十分か？
   - 各領域（Sales, CS, Product 等）ごとに異なる Trust Score を持つ場合、権限管理が複雑化する
   - シンプルな権限モデルで Phase 1 を開始し、Phase 2-3 で段階的に精緻化すべきか？

5. **原理の階層構造は明示的に文書化すべきか？**
   - 現在の invariant-principles.md は5原理を並列に列挙している
   - 「原理5が基盤、原理3が横断制約」という構造を明示すべきか？
   - 設計者が理解すれば十分で、形式的に記述する必要はないか？
