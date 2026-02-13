# [ARCHIVED — design.md に統合済み] 7-Layer から 5-Layer + 4 Crosscutting への統合

## 問い

7-Layer Architecture（issue-003 で採択）に対して、(1) 層間を統率する Orchestration の必要性、(2) レイヤーの冗長性 — の 2 点を検討し、最もクリーンなアーキテクチャを導出する。

## 論点

1. Orchestration の必要性 — 層間フローを統率する機構は必要か。必要な場合、Layer として定義すべきか、Crosscutting として定義すべきか
2. Integration (L0) と Perception (L1) の分離の妥当性 — 能動的接続とシグナル検出は独立した認知変換か
3. Reasoning (L3) と Composition (L4) の分離の妥当性 — 戦略導出と行動計画構成は独立した認知変換か
4. 統合後のアーキテクチャの有意性 — 統合によって失われる概念はないか

## 論点分解

### 論点 1: Orchestration

- 現行設計では層間フローの制御が暗黙的であり、誰が実行順序・リソース配分・エラー回復を制御するかが未定義
- Orchestration を Layer として定義すると「入力 → 出力」の変換が不明確。データを変換するのではなく、変換を統率する機構
- 脳の実行機能（前頭前皮質）は特定の認知処理ではなく、認知処理全体を統率する — 層ではなく横断的要素に近い

### 論点 2: Integration と Perception の分離

- Integration の核心は「何に接続すべきか」の能動的判断
- しかしこの判断は本来 Reasoning / Reflection が「盲点がある」と判断し、Perception に「新しいソースに接触せよ」と指示するフロー
- 脳の知覚系も、感覚器官（能動的に向きを変える目・耳）と感覚処理（信号抽出）を一体の系として運用
- 「ソースカタログ」は Memory の一部として自然に位置づけられる

### 論点 3: Reasoning と Composition の分離

- Composition の核心は「領域横断的な行動計画の構成」
- しかしこれは質の高い推論の出力そのもの。「何をすべきか」と「どう組み合わせるか」は反復的・相互的に行われるプロセス
- 分離は「戦略は立てたが計画は別」という人工的な境界を生む
- Reasoning の出力を「戦略」ではなく「統合行動計画」と定義すれば、Composition の価値は保存される

### 論点 4: 統合後の有意性

旧概念が統合後にどこに保存されるかを検証する必要がある。

## 仮説構築

### 選択肢 A: 7+4（現行 7 層 + Orchestration 追加）

7 Layer + Purpose, Governance, Memory, Orchestration の 4 Crosscutting。

### 選択肢 B: 5+4（統合）

Integration → Perception に統合、Composition → Reasoning に統合。5 Layer + 4 Crosscutting。

### 選択肢 C: 6+4（部分統合）

Integration のみ Perception に統合し、Composition は維持。6 Layer + 4 Crosscutting。

## 仮説の評価

| 評価軸 | A: 7+4 | B: 5+4 | C: 6+4 |
|---|---|---|---|
| 認知変換の不可分性 | Integration と Perception、Reasoning と Composition に重複がある | 各層が不可分な認知変換に対応 | Reasoning と Composition の重複が残る |
| 説明の明快さ | 7 層は記憶しにくい | 「知覚→理解→推論→実行→内省」は直感的で記憶しやすい | 6 層は中途半端 |
| 概念の保存 | すべて保存 | Integration の能動的接続 → Perception の機能として保存。Composition の領域横断構成 → Reasoning の出力定義として保存 | Composition のみ独立で保存 |
| 人間の認知との対応 | やや冗長 | 「知覚し、理解し、推論し、実行し、内省する」は人間の認知と直接対応 | 部分的に対応 |
| 層の責務の重複 | あり | なし | 一部あり |

## 結論

**選択肢 B（5+4）** を採択する。

### 5-Layer Intelligence Architecture

| Layer | Name | 和名 | Transform |
|---|---|---|---|
| 0 | Perception | 知覚 | 現実世界 → シグナル |
| 1 | Understanding | 理解 | シグナル → 世界モデル |
| 2 | Reasoning | 推論 | 世界モデル × 目的 → 行動計画 |
| 3 | Execution | 実行 | 行動計画 → アウトプット |
| 4 | Reflection | 内省 | アウトプット → 学習 → 全層更新 |

### 4 Crosscutting Concerns

| Element | 和名 | 問い | 役割 |
|---|---|---|---|
| Purpose | 目的 | WHY | 人間の意志を注入。主に L2 に作用 |
| Governance | 統治 | WHO | L2 と L3 に Gate。重要判断と不可逆行動を統治 |
| Memory | 記憶 | WHAT | 全層の永続状態。組織理解の蓄積 |
| Orchestration | 統率 | HOW | 層間フロー制御・リソース配分・優先度管理 |

### 旧概念の保存先

| 旧概念 | 統合先 | 保存される価値 |
|---|---|---|
| Integration の能動的接続 | Perception の一機能 | Reflection が盲点を検出し Perception が新ソースを探索 |
| Integration のソースカタログ | Memory | データソースの特性管理は Memory の一部 |
| Composition の領域横断構成 | Reasoning の出力定義 | Reasoning の出力を「統合行動計画」と定義 |
| Composition のリソース配分 | Orchestration | 層横断的リソース配分は Orchestration に移動 |

### 採択理由

1. **各層が不可分な認知変換に対応** — 5 つの層はこれ以上統合できない最小単位
2. **直感的に理解可能** — 「知覚し、理解し、推論し、実行し、内省する」は人間の認知と直接対応
3. **責務の重複がない** — 層と横断的要素の境界が明確
4. **伝達力** — "5-Layer Intelligence Architecture" は記憶しやすく説明しやすい
5. **旧概念の損失がない** — Integration と Composition の核心的価値はすべて保存されている

## ネクストアクション

- [x] concept.md を 5+4 アーキテクチャに更新
- [x] Architecture.tsx を 5+4 表示に更新
- [ ] 各層の詳細設計（入力・出力・内部プロセス・状態管理の定義）
- [ ] Orchestration の詳細設計（フロー制御ルール・リソース配分戦略）
- [ ] Governance Gate の具体的なトリガー条件とエスカレーションルールの設計

## 残論点

- **Orchestration の実装**: フロー制御のルールベースはどう設計するか。静的ルール vs 動的推論
- **Reflection のトリガー**: すべてのアウトプットに全層内省を行うか、重要度に応じて深度を変えるか
- **Memory の一貫性**: 全層が独立して永続状態を持つ場合、層間の状態整合性をどう保証するか
