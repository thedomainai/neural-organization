# Neural Organization の不変原理

> 本ドキュメントは Neural Organization の設計を制約する不変の原理（公理）を定義する。5層 + 4横断的要素のアーキテクチャ（[concept.md](concept.md)）と各要素の詳細設計（[philosophy/](philosophy/)）は、これらの原理から導出される。原理は技術スタックやツール選定が変わっても不変である。

## 1. 5つの不変原理

### 原理1: 能力による間接参照（Capability Indirection）

> 実行主体の選択は、能力要件によって表現されなければならない。具体的なツール名・モデル名・人名で固定してはならない。

Neural Organization の Layer 3（Execution）は行動計画をアウトプットに変換する。このとき「誰が実行するか」は不変の事実ではなく、能力要件に対する現時点での最適解である。

- Layer 3 のケイパビリティレジストリは、能力要件→実行リソースの間接参照層として機能する
- 実行リソースの追加・削除・入れ替えが、上位層（Reasoning, Purpose）に影響しない
- Orchestration のリソース配分は、能力要件に基づいて最適なリソースを動的に選択する

**形式的表現**:

```
delegate(action) = resolve(classify(action))
  where classify: Action → CapabilityRequirement
        resolve:  CapabilityRequirement → ExecutionResource (mutable mapping)
```

**Neural Organization での適用先**:

| 設計要素 | この原理の適用 |
|---|---|
| Layer 3 ケイパビリティレジストリ | 能力→実行リソースの間接参照 |
| Orchestration のリソース配分 | 能力要件に基づく動的選択 |
| agentic-ai-framework のエージェント設計 | エージェント名ではなく能力で結合 |

詳細: [philosophy/layer3-execution-design.md](philosophy/layer3-execution-design.md)

### 原理2: 計測なきシステムは収束しない（Observability Primacy）

> フィードバックループは第一級市民である。結果を計測できないシステムは改善できず、改善できないシステムは劣化する。

Neural Organization の Layer 4（Reflection）はこの原理の直接的な体現である。しかし、Reflection が機能するためには、計測可能なデータが供給されなければならない。

- すべての実行イベントは、入力・出力・コスト・結果を構造化して記録される（Execution Trace）
- Reflection は Trace を入力として学習シグナルを抽出する
- 「人間の修正行為」も計測対象であり、最も価値の高いフィードバックデータである

**形式的表現**:

```
For every execution event e:
  record(e.input, e.output, e.cost, e.outcome, e.human_feedback)
```

**Neural Organization での適用先**:

| 設計要素 | この原理の適用 |
|---|---|
| Layer 4 Reflection | 学習シグナル抽出の前提条件 |
| Governance Trust Score | 計測データから信頼を定量化 |
| Memory 評価記憶 | 行動と結果の対応関係を蓄積 |
| Evolution Engine（Orchestration の自己改善） | Trace データから設定改善を導出 |

詳細: [philosophy/layer4-reflection-design.md](philosophy/layer4-reflection-design.md)

### 原理3: 優雅な劣化（Graceful Degradation）

> 任意の単一コンポーネントの除去は、システムを停止させてはならない。品質の低下のみが許容される。

Neural Organization は複数の外部システム（ツール、API、データソース）に依存する。いずれかが利用不可になっても、システム全体は機能し続けなければならない。

- すべてのケイパビリティは、少なくとも2つの実行経路（フォールバックチェイン）を持つ
- フォールバックチェインの末尾は常にシステム自身の基本能力である
- Agency Preservation（人間の主体性の保全）もこの原理の一形態である — システムなしでも組織が（非効率ながら）機能し続けられること

**形式的表現**:

```
For every capability c:
  |resolve_chain(c)| >= 2
  resolve_chain(c)[-1] = system_core_capability
```

**Neural Organization での適用先**:

| 設計要素 | この原理の適用 |
|---|---|
| Layer 3 フォールバックチェイン | 実行リソースの耐障害性 |
| Orchestration エラー回復 | リトライ・フォールバック・エスカレーション |
| Agency Preservation | システム障害時の人間の自律性 |
| Layer 0 Perception | データソース断絶時の代替知覚 |

詳細: [philosophy/orchestration-design.md](philosophy/orchestration-design.md)

### 原理4: コンテキストは有限資源（Context as Currency）

> 人間の注意も、トークンも、時間も有限である。コンテキストに載せるすべての情報は、その存在を正当化しなければならない。

Neural Organization の Governance における「二重フィルタリング原則」は、人間の注意というコンテキスト予算を最適配分する設計である。

- 人間の注意は「予算」として定量化される
- Governance Gate に到達する情報は、品質フィルタを通過したもののみ
- 「あると便利かもしれない」情報は「今必要な」情報を押し出すコストを持つ
- Orchestration のリソース配分も、計算コンテキストの有限性を前提とする

**形式的表現**:

```
human_attention_budget = available_attention - governance_overhead
governance_overhead <= 0.20 * available_attention  (上限)
```

**Neural Organization での適用先**:

| 設計要素 | この原理の適用 |
|---|---|
| Governance 二重フィルタリング | 人間の注意の最適配分 |
| Orchestration リソース配分 | 計算リソースの有限性 |
| Memory 選択的忘却 | 記憶容量の有限性 |
| Interface 文脈的関与 | 通知・報告の最適量 |

詳細: [philosophy/governance-design.md](philosophy/governance-design.md)

#### 実装パターン: Progressive Disclosure（段階的開示）

> Personal Brain OS（Muratcan Koylan 氏）のファイルシステム設計から導出された、原理4の実装パターン。参照元: `inbox/file-system.md`

コンテキスト予算を最適配分するための3段階ファネル：

| レベル | 役割 | ロードタイミング | 例 |
|---|---|---|---|
| **Level 1** | 軽量なルーティング情報 | 常時 | 「これは顧客リスクのタスク → CS モジュールが関連」 |
| **Level 2** | モジュール固有の指示・文脈 | モジュール必要時 | 品質基準、ワークフロー定義（40-100行） |
| **Level 3** | 実データ | タスク実行時 | エンティティの詳細、時系列データ、トレースログ |

**設計制約**: 任意の情報まで**最大2ホップ**でアクセス可能であること。これはパス階層（ADR-008）の「最大2階層」制約と整合する。

**Neural Organization での適用**:
- Orchestration がタスクを起動する際、Level 1（どの層・どのエージェントが関連するか）のみを初期ロードする
- 関連層のエージェントが起動されると、Level 2（その層の永続状態のサマリ・設定）がロードされる
- 実際の推論・実行で必要になった段階で Level 3（生データ、トレース）が参照される
- この段階的ロードにより、不要な情報がコンテキストウィンドウを圧迫することを防ぐ

### 原理5: 構成と状態のデータ化（Configuration and State as Data）

> システムの構成（ルーティングルール、優先度重み、フォールバックチェイン）および組織の状態（エンティティ、パターン、メトリクス）は、システム自身が一意のパスで読み書き可能なデータでなければならない。

Neural Organization の Orchestration は、フロー制御・リソース配分・優先度管理のパラメータを持つ。これらが静的な設定ファイルに固定されていると、自己改善が不可能になる。さらに、組織の状態（エンティティ、パターン、メトリクス）自体もシステムが読み書き可能なデータとして外部化されることで、世界モデル・パターン・記憶構造の進化が可能になる。

- Orchestration の設定は構造化データとして外部化される
- 組織の状態（エンティティ、パターン、メトリクス）も一意のパスで参照可能なデータとして外部化される（ADR-008）
- Layer 4 Reflection の学習結果が、設定と状態の両方を更新する
- この更新サイクルが Evolution Engine である
- 初期は人間が承認し、信頼の蓄積に応じて自律化する（Governance の Trust Score と同構造）

**形式的表現**:

```
For all system_data d:
  d ∈ AddressableState  (hardcoded ではなく、パスで参照可能な mutable state)
  ∃ path ∈ PathHierarchy : resolve(path) = d

evolve: (AddressableState, execution_traces) → AddressableState'

where AddressableState = {config, org_state, path_schema, ...}
```

**Neural Organization での適用先**:

| 設計要素 | この原理の適用 |
|---|---|
| Orchestration Evolution Engine | 設定の自己改善 |
| Memory パス階層（ADR-008） | 全状態の一意パスでのアドレッシング |
| Governance Trust Score | 自律範囲の動的調整 |
| Purpose の進化 | Purpose 自体もデータとして読み書き可能 |
| Layer 1 世界モデル | エンティティ・関係性がデータとして進化 |
| Layer 2 パターン | 成功パターンがデータとして蓄積・進化 |

詳細: [philosophy/orchestration-design.md](philosophy/orchestration-design.md), [philosophy/memory-design.md](philosophy/memory-design.md), [decisions/008-state-addressability-path-hierarchy.md](decisions/008-state-addressability-path-hierarchy.md)

## 2. 原理から導出される設計不変量

以下の8つの不変量は、上記の5原理から導出される実装上の制約である。

| 不変量 | 導出元 | ステートメント |
|--------|--------|--------------|
| **I1: 間接参照層** | 原理1 | ケイパビリティレジストリが、ルーティング論理と実行リソース選択の間を仲介する |
| **I2: 実行トレースログ** | 原理2 | すべての実行イベントは、入力・出力・コスト・結果とともに記録される |
| **I3: フォールバックチェイン** | 原理3 | すべてのケイパビリティは、システム自身で終端する順序付きリストにマップされる |
| **I4: コンテキスト予算** | 原理4 | インフラストラクチャのオーバーヘッドには明示的な上限がある |
| **I5: アドレッサブル状態** | 原理5 | 設定と状態は一意のパスで参照可能な構造化データであり、散在するコードではない |
| **I6: 分類と解決の分離** | 原理1 | Intent → Capability は Capability → Resource と独立している |
| **I7: 対称的永続化** | 原理2 | すべての高価値出力は永続化される。一部だけではない |
| **I8: 状態のアドレッサビリティ** | 原理5 + 原理2 | すべてのシステム状態は一意のパスで参照可能であり、一貫した名前空間を通じてアクセスされる |

これらの不変量は、各レイヤーと横断的要素の詳細設計（[philosophy/](philosophy/)）において、設計判断の妥当性を検証するチェックリストとして機能する。

## 3. 不変原理と既存設計原理の関係

### 3.1 スコープの違い

Neural Organization には複数のレベルの「原理」が存在する。それぞれスコープが異なる。

| 原理の種類 | スコープ | 定義場所 |
|---|---|---|
| **不変原理（本ドキュメント）** | システムの内部設計を制約する | invariant-principles.md |
| **設計原理（concept.md §4.1）** | 人間-インテリジェンス界面を制約する | concept.md |
| **レイヤー固有の原理（philosophy/）** | 各レイヤーの詳細設計を制約する | philosophy/*.md |

### 3.2 対応関係

不変原理と、[concept.md](concept.md) §4.1 で定義された「人間-インテリジェンス界面の設計原理」の対応関係を示す。

| 不変原理 | 関連する設計原理（concept.md） | 関係性 |
|---|---|---|
| 原理1: 能力による間接参照 | （直接対応なし） | 新規追加。内部設計の柔軟性を保証 |
| 原理2: 計測なきシステムは収束しない | **Mutual Evolution** | Mutual Evolution の前提条件。計測なしに相互進化は起きない |
| 原理3: 優雅な劣化 | **Agency Preservation** | Agency Preservation の技術的実現。システム障害時も人間は機能する |
| 原理4: コンテキストは有限資源 | **Governance, not Control** | Governance not Control の根本理由。人間の注意が有限だからこそ統治が必要 |
| 原理5: 構成と状態のデータ化 | **Mutual Evolution** | Mutual Evolution の実現手段。設定と状態がデータでなければ進化できない |

### 3.3 設計原理の階層構造

```
不変原理（本ドキュメント）— システムの内部設計の必然性
  ↓ 制約
人間-インテリジェンス界面の設計原理（concept.md）— ユーザー体験の設計指針
  ↓ 制約
5層 + 4横断的要素のアーキテクチャ（concept.md, design.md）— システムの構造
  ↓ 制約
各要素の詳細設計（philosophy/）— 実装レベルの設計判断
```

この階層構造により、技術スタックやツールが変わっても、上位の原理が保全される。

### 3.4 5つの不変原理の内部構造

5つの不変原理は並列ではなく、以下の依存関係を持つ。

- **原理5（基盤）**: すべての状態と設定がアドレッサブルなデータであることが、他の原理が機能する前提条件
- **原理1, 2, 4（機能）**: 原理5が提供するデータ基盤の上で、それぞれの機能（間接参照、計測、コンテキスト管理）を実現
- **原理3（横断制約）**: 他のすべての原理の実装に対して「劣化しても停止しない」という制約を課す

詳細な依存関係と Phase 1-4 における原理の重要度の変化については、[decisions/011-invariant-principles-integration.md](decisions/011-invariant-principles-integration.md) を参照。

## 4. 原理の出自と検証

本ドキュメントで定義された5つの不変原理は、以下の2つの独立した設計プロセスから収束した普遍的パターンである。

1. **agent-orchestration プロジェクト**: マルチエージェントシステムのオーケストレーション設計の分析から導出された5つの公理（Axiom 1-5）
2. **Neural Organization プロジェクト**: AGI時代の組織設計の第一原理からの構築

両プロジェクトが異なる出発点（コードレベルのエージェント協調 vs 組織レベルの知能設計）から、独立に同一の原理に到達したことは、これらの原理が特定のドメインを超えた普遍性を持つことの証左である。

詳細な分析と統合プロセスについては、[decisions/006-agent-orchestration-insights-integration.md](decisions/006-agent-orchestration-insights-integration.md)（予定）を参照。

## 5. 原理の適用と検証

### 5.1 設計判断時のチェックリスト

新しい設計要素を追加する際、以下の質問で5原理への適合性を検証する。

| 原理 | 検証質問 |
|------|---------|
| 原理1 | この設計は、実行主体および状態へのアクセス経路を固定せず、能力要件で表現しているか？ |
| 原理2 | この設計は、結果を計測可能にしているか？計測結果は一意のパスで参照可能か？ |
| 原理3 | この設計の単一コンポーネントが失敗しても、システムは動き続けるか？状態アクセスのフォールバックチェインは存在するか？ |
| 原理4 | この設計が消費するコンテキスト（人間の注意/計算リソース）は正当化できるか？パスの深さは2階層以内に収まっているか？ |
| 原理5 | この設定・状態は、一意のパスで参照可能なデータとして外部化されているか？Evolution Engine の改善対象になるか？ |

### 5.2 既存設計の検証

既存の設計要素がこれらの原理に適合しているかの検証例。

| 設計要素 | 原理への適合状況 | 必要な改善（あれば） |
|---|---|---|
| Layer 4 Reflection | ✓ 原理2（計測）を体現 | Execution Trace Schema の構造化（実装中） |
| Governance Trust Score | ✓ 原理2（計測）、原理5（データ化） | なし |
| Layer 3 Execution | △ 原理1（間接参照）が部分的 | Capability Registry の拡張（実装中） |
| Orchestration | △ 原理5（データ化）が不完全 | Evolution Engine の追加（実装中） |
| Agency Preservation | ✓ 原理3（優雅な劣化）を体現 | なし |
| 二重フィルタリング | ✓ 原理4（コンテキスト予算） | Context Budget の定量化（検討中） |

## 6. まとめ

Neural Organization の設計は、5つの不変原理に基づいている。

1. **能力による間接参照** — 実行主体を固定せず、能力要件で表現する
2. **計測なきシステムは収束しない** — フィードバックループは第一級市民
3. **優雅な劣化** — 単一コンポーネントの障害でシステムは停止しない
4. **コンテキストは有限資源** — すべての情報はその存在を正当化する
5. **設定のデータ化** — 構成はシステム自身が読み書き可能なデータ

これらの原理は、技術スタック・ツール・モデルが変わっても不変であり、Neural Organization の持続的な進化を支える基盤である。各レイヤーと横断的要素の詳細設計は、これらの原理から導出され、これらの原理によって検証される。
