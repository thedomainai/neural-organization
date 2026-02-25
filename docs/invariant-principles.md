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

両プロジェクトが異なる出発点（コードレベルのエージェント協調 vs 組織レベルの知能設計）から、共通の問題構造（分散する情報処理エージェントの協調）がスケール横断的に同じ設計パターンを要求することを示している。von Bertalanffy (1968) の一般システム理論が示す通り、異なる分野でアイソモルフィックな法則が現れることは単なるアナロジーを超えた構造的必然性である。

詳細な分析と統合プロセスについては、[decisions/006-agent-orchestration-insights-integration.md](decisions/006-agent-orchestration-insights-integration.md)（予定）を参照。

### 4.1 学術的検証

以下に、各不変原理の学術的根拠を詳述する。学術的検証の全体像は [references/academic-validation.md](../references/academic-validation.md) を参照。

#### 原理1: 能力による間接参照（Capability Indirection）

能力要件による間接参照は、分散システムの協調問題に対する普遍的な解法として繰り返し再発見されてきた。

- **Smith (1980) Contract Net Protocol**: マルチエージェント環境における最初の体系的な能力ベース委譲プロトコル。タスクを「誰がやるか」ではなく「何ができるか」で仲介する設計を確立した。
- **SOA サービスディスカバリ**: サービス指向アーキテクチャにおいて、サービスの実装ではなくインタフェース（能力契約）に依存する設計パターンとして同じ原理が実装されている。
- **MasRouter (2025)**: 最新のマルチエージェントシステム研究でも、エージェントの能力プロファイルに基づく動的ルーティングが有効であることが示されている。
- **Ashby (1956) 必要多様性の法則**: 制御系の多様性は被制御系の多様性に対応しなければならない。能力要件の多様性に対して実行リソースの多様性を動的にマッチングする間接参照は、この法則の直接的な実装である。

#### 原理2: 計測なきシステムは収束しない（Observability Primacy）

フィードバックループの不可欠性は、サイバネティクスから認知科学まで、独立した複数のドメインで確認されている。

- **Wiener (1948) サイバネティクス**: フィードバック制御の数学的基盤。目標状態と現在状態の差分を計測し、その差分に基づいて行動を修正するループが、あらゆる適応システムの前提条件であることを定式化した。
- **Deming PDCA サイクル**: 品質管理における計画・実行・検証・改善のサイクル。計測（Check）なしに改善（Act）は起きないという産業界での実証。
- **Hollnagel et al. (2006) レジリエンスエンジニアリングの4つの礎石**: 監視（monitoring）・応答（responding）・学習（learning）・予見（anticipating）。これらすべてが計測データを前提とする。
- **Flavell (1979) メタ認知**: 自己の認知プロセスを認識し調整する能力。「自分が何を知り、何を知らないか」の計測がなければ、認知戦略の改善は起きない。Neural Organization の Layer 4 Reflection はシステムレベルのメタ認知として機能する。
- **Argyris (1977) ダブルループ学習**: 行動の結果だけでなく、行動の前提を問い直す学習。計測データが前提の検証を可能にする。

#### 原理3: 優雅な劣化（Graceful Degradation）

システムの部分的障害に対する耐性は、レジリエンスエンジニアリングと複雑系理論で広範に研究されている。

- **Woods (2015, 2018) graceful extensibility**: Woods は resilience を「驚き（surprise）に対処し続ける能力」と再定義し、graceful extensibility（優雅な拡張性）の概念を提唱した。これは単なる劣化の抑制ではなく、予期しない状況に対して能力を拡張し続ける適応能力を指す。Neural Organization の原理3はこの概念と直接的に対応する。
- **Carlson & Doyle (2002) HOT（Highly Optimized Tolerance）理論**: 複雑系における robustness は常にトレードオフを伴う。ある方向のロバスト性を最適化すると、別方向の脆弱性が必然的に生じる（robust-yet-fragile）。この理論は、優雅な劣化が「万能の耐障害性」ではなく「設計者が選択した障害モードへの最適化」であることを示している。
- **レジリエンスエンジニアリング（Hollnagel et al., 2006）**: 安全は「事故がない状態」ではなく「変動する条件に適応し続ける能力」として再定義された。この視座は Neural Organization の原理3が静的な冗長性ではなく動的な適応能力を要求する根拠を提供する。

#### 原理4: コンテキストは有限資源（Context as Currency）

人間の認知資源の有限性は、心理学で最も堅固に実証された知見の一つである。

- **Simon (1955) 限定合理性**: 人間は完全に合理的な判断を下せない。認知資源の有限性が意思決定を制約するという前提は、組織設計の根幹を規定する。Neural Organization の Governance 設計（人間の注意を最も価値の高い判断に集中させる二重フィルタリング）は、限定合理性への直接的な対処である。
- **Miller (1956) 7±2 則**: 短期記憶の容量制約。人間が同時に処理できる情報チャンクの上限を実証した古典的研究。
- **Cowan (2001) 4チャンク**: Miller の 7±2 を再検証し、注意の焦点に保持できるチャンク数はおよそ4であることを示した。より厳しい制約の下でのコンテキスト設計が必要であることを示唆する。
- **Sweller (1988) 認知負荷理論**: 学習・問題解決における作業記憶への負荷を3種（内在的・外在的・本質的）に分類し、外在的認知負荷の削減が課題遂行を改善することを実証した。Neural Organization の Progressive Disclosure パターンは、外在的認知負荷を段階的に制御する設計として理解できる。

#### 原理5: 構成と状態のデータ化（Configuration and State as Data）

システムの構成と状態を明示的なデータとして外部化する設計パターンは、ソフトウェア工学と生物学の両方で観察される。

- **Event Sourcing**: システムの状態をイベントの列として永続化する設計パターン。状態の変更履歴が完全に再現可能であり、任意の時点への巻き戻しと分析を可能にする。
- **GitOps**: インフラストラクチャの構成をデータ（宣言的定義ファイル）として管理し、バージョン管理システムを single source of truth とする運用パターン。構成のデータ化がもたらす監査可能性・再現性・自動化のメリットを実証している。
- **Maturana & Varela (1980) オートポイエーシス**: 生物システムは自己の構成要素を自ら産出する。Neural Organization の Evolution Engine は、システムがその構成（ルーティングルール、優先度重み等）を自ら読み書き・更新するという意味で、オートポイエーシス的な性質を持つ。

### 4.2 注意すべき限界

学術的根拠は設計への着想と理論的正当化を提供するが、以下の限界を認識する必要がある。

**「不変原理」（invariant）という表現の強さ**: 「invariant」は数学・物理学で使われる非常に強い主張である。本ドキュメントの5つの原理は、認知科学・組織論・複雑系理論から繰り返し再発見されるロバストな設計原理（recurrently rediscovered design principles）であり、その意味で高い普遍性を持つ。ただし、すべての可能なシステム設計に必然的に適用されるかどうかは、経験的に開かれた問いである。

**HOT理論が示すトレードオフ**: Carlson & Doyle (2002) の HOT 理論が示す通り、ロバスト性の最適化は常にトレードオフを伴う。5つの原理をすべて同時に最大化できる保証はなく、実装においては原理間の優先度判断が必要になる場面がある。例えば、原理2（計測の網羅性）と原理4（コンテキストの有限性）は、計測データの量と人間の注意予算の間で緊張関係を生じうる。

**原理5の位置づけ**: 構成と状態のデータ化は有用な設計パターンであるが、他の4つの原理と比べると「不変原理」としての強度はやや弱い。すべてのシステムに必須とは限らず（小規模なシステムではハードコードで十分な場合もある）、むしろ「自己改善するシステム」の前提条件として理解すべきである。

**「独立に同じ原理に到達した」という主張の精度**: agent-orchestration プロジェクトと Neural Organization プロジェクトは異なるスケールを対象としているが、どちらも「分散する情報処理エージェントの協調」という共通の問題構造を扱っている。「独立な収斂」よりも「共通の問題構造がスケール横断的に同じ設計パターンを要求する」がより正確な記述である。Csete & Doyle (2002) が示した生物学と工学の収斂も、同様の問題構造（複雑性の管理）が背後にあると解釈できる。

**メタファーと実装の距離**: 認知科学の概念はメタファーとして活用されているが、「脳がこうだから組織もこうあるべき」は論理的に必然ではない。設計への「着想」（inspired by）と科学的「証明」（proven by）の区別が重要である。

### 4.3 主要参考文献

**サイバネティクス・システム理論**:
- Wiener, N. (1948). *Cybernetics.* MIT Press.
- Ashby, W.R. (1956). *An Introduction to Cybernetics.* Chapman and Hall.
- von Bertalanffy, L. (1968). *General System Theory.* George Braziller.
- Maturana, H. & Varela, F. (1980). *Autopoiesis and Cognition.* D. Reidel.

**認知科学・心理学**:
- Simon, H.A. (1955). "A Behavioral Model of Rational Choice." *QJE*, 69(1), 99-118.
- Miller, G.A. (1956). "The Magical Number Seven, Plus or Minus Two." *Psychological Review*, 63, 81-97.
- Flavell, J.H. (1979). "Metacognition and Cognitive Monitoring." *American Psychologist*, 34(10), 906-911.
- Sweller, J. (1988). "Cognitive Load during Problem Solving." *Cognitive Science*, 12, 257-285.
- Cowan, N. (2001). "The magical number 4 in short-term memory." *BBS*, 24(1), 87-114.

**組織論・ガバナンス**:
- Argyris, C. (1977). "Double Loop Learning in Organizations." *HBR*, 55(5), 115-125.
- Ostrom, E. (1990). *Governing the Commons.* Cambridge University Press.
- Davis, J.H., Schoorman, F.D. & Donaldson, L. (1997). "Toward a Stewardship Theory of Management." *AMR*, 22(1), 20-47.

**マルチエージェントシステム**:
- Smith, R.G. (1980). "The Contract Net Protocol." *IEEE Trans. Computers*, C-29(12), 1104-1113.

**レジリエンスエンジニアリング・複雑系**:
- Carlson, J.M. & Doyle, J.C. (2002). "Complexity and Robustness." *PNAS*, 99(S1), 2538-2545.
- Csete, M.E. & Doyle, J.C. (2002). "Reverse Engineering of Biological Complexity." *Science*, 295(5560), 1664-1669.
- Hollnagel, E., Woods, D.D. & Leveson, N. (Eds.) (2006). *Resilience Engineering.* Ashgate.
- Woods, D.D. (2015). "Four Concepts for Resilience." *RESS*, 141, 5-9.
- Woods, D.D. (2018). "The Theory of Graceful Extensibility." *ESD*, 38(4), 433-457.

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
