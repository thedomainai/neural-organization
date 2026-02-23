# 段階的導入経路の設計

## 問い

Neural Organization の機能をどのような段階で導入するべきか？Phase 1-4 の各フェーズで提供する機能・判断ロジック・エージェント介入度合いをどのように設計するべきか？

## 論点

1. **Phase 1（覚醒）で最低限必要な機能は何か？**
2. **Phase 2（共生）での「人間の修正から学習」の実装方針はどうあるべきか？**
3. **Phase 3（変態）での「領域横断的な自律判断」の発動条件は何であるべきか？**
4. **Phase 4（創発）の達成基準をどう定義すべきか？**

## 論点分解

### 論点1: Phase 1 MVP機能
- 接続機能（P0）
- データ取得・同期機能（P0）
- 世界モデルの初期構築（P1）
- 人間の修正記録の仕組み（P1）
- パターン抽出の準備（P2）

### 論点2: Phase 2 学習メカニズム
- 修正イベントのスキーマ設計
- パターン抽出アルゴリズムの精度
- パターンの検証・蓄積プロセス
- フィードバックループの設計

### 論点3: Phase 3 遷移条件
- Trust Score の閾値
- 領域横断判断が可能な状態の定義
- 自律実行率の目標値
- Phase 2 から Phase 3 への段階的移行

### 論点4: Phase 4 達成指標
- Trust Score の最終水準
- 創発的推論の比率
- 承認率の逆転（承認が例外になる）
- 組織知能の質的変化

## 仮説構築

### Phase 1 MVP機能の優先度設定

**Phase 1a（0-1ヶ月目）: 接続と信頼構築**
- P0: 基盤システムとの双方向接続（Salesforce, Slack, GitHub, Email）
- P0: Layer 1 Entity Model の基本実装（Customer, Deal, Product, Task, Person）
- P1: Layer 0 Perception のイベント取得（各システムの変更イベントをリアルタイム取得）
- P2: Layer 4 Reflection の初期実装（人間の修正を記録する仕組み）

Phase 1a の成功基準：
- 4つの基盤システムから過去30日間のデータを取得できる
- Layer 1 Entity Model で顧客・案件・タスクが可視化できる
- システム間のデータ同期遅延が5分以内

**Phase 1b（1-2ヶ月目）: 世界モデルの構築**
- P0: Layer 1 の World Model 構築（Entity 間の関係グラフ）
- P0: `/entities/{type}/{slug}` パスでのアクセス機能
- P1: Layer 2 の定型的推論の初期実装（Trust Score < 0.50 で固定）
- P1: `/patterns/routine/` に初期パターンを手動登録（3-5パターン）
- P2: Layer 3 Execution の通知機能（Slack への提案メッセージ送信）

Phase 1b の成功基準：
- Entity 間の関係グラフが構築され、顧客の案件・タスク・担当者を横断参照できる
- 登録済みパターンに合致する状況で定型的推論が発動する
- 提案内容の承認率が60%以上

**Phase 1c（2-3ヶ月目）: 記録と改善の準備**
- P0: Layer 4 Reflection の modification_event 記録機能
- P0: 人間の修正内容を `/traces/{trace-id}` に記録
- P1: 修正イベントの可視化 UI（何が修正されたか、どれくらいの頻度か）
- P2: 初期パターン抽出の手動実行（エンジニアが抽出ロジックを実行して検証）

Phase 1c の成功基準：
- 人間の修正イベントが100件以上記録される
- 修正内容から1-2件の新規パターンを手動抽出できる
- Phase 2 への移行準備が整う

### Phase 2 学習メカニズムの実装

**modification_event のスキーマ設計**

```yaml
modification_event:
  id: "mod_20250815_001"
  timestamp: "2025-08-15T14:23:00Z"
  human_actor: "sales_manager_alice"

  context:
    entity_type: "deal"
    entity_id: "deal_acme_renewal_2025"
    world_state_snapshot:
      deal:
        stage: "Negotiation"
        value: 5000000
        close_probability: 0.65
      customer:
        segment: "Enterprise"
        health_score: 0.72
      interactions:
        last_contact_days: 14

  ai_proposed_action:
    action_id: "action_20250815_001"
    domain: "sales"
    action_type: "follow_up_email"
    reasoning_mode: "routine"
    pattern_id: "rp_20250801_standard_followup"
    confidence: 0.78

  human_modification:
    action_taken: "custom_discount_proposal"
    modification_type: "complete_override"
    reasoning_note: "顧客の予算状況を考慮し、柔軟な価格提案が必要と判断"

  outcome:
    deal_progressed: true
    stage_after: "Verbal Commit"
    close_probability_after: 0.88
    time_to_close_days: 7
```

**パターン抽出アルゴリズム**

1. **修正イベントのクラスタリング**（最低30件の修正イベントが必要）
   - 同じ entity_type + 類似の world_state_snapshot をグルーピング
   - modification_type が同じ修正をサブクラスタ化

2. **パターン候補の生成**（クラスタごとに1つのパターンを生成）
   ```yaml
   pattern_candidate:
     id: "pc_20250820_custom_pricing"
     trigger:
       entity_type: "deal"
       conditions:
         - field: "deal.stage"
           operator: "=="
           value: "Negotiation"
         - field: "customer.segment"
           operator: "=="
           value: "Enterprise"
         - field: "interactions.last_contact_days"
           operator: ">="
           value: 10
     action_template:
       action_type: "custom_discount_proposal"
       reasoning: "Enterprise顧客との長期交渉では柔軟な価格提案が有効"
     evidence:
       sample_size: 12
       success_rate: 0.83
       avg_deal_progression: 0.21
       confidence: 0.68
   ```

3. **パターンの検証**（信頼性のチェック）
   - sample_size >= 10: パターンとして最低限の母数
   - success_rate >= 0.70: 70%以上の成功率
   - confidence >= 0.60: 統計的に意味のある水準
   - 検証に合格したパターンを `/patterns/routine/` に登録

4. **定期的な再評価**（週次実行）
   - 既存パターンの成功率を再計算
   - 成功率が0.60を下回ったパターンは降格または削除
   - 新規の修正イベントから新しいパターン候補を生成

### Phase 3 遷移条件の設計

**Phase 2 → Phase 3 の遷移条件**

1. **Trust Score の閾値**: 0.70 以上（Trusted レベル到達）
2. **領域横断判断の準備**: 以下の3条件をすべて満たす
   - 3つ以上の業務ドメイン（Sales, CS, Product等）で Trust Score >= 0.70
   - `/relations/` グラフで3領域以上のエンティティが相互参照可能
   - 過去30日間で領域横断的な状況が10回以上発生（例: Sales の案件進捗が CS の健康スコアに影響）
3. **自律実行率**: 50%以上（提案の半数以上が承認なしで実行される状態）

**Phase 3a（Trust Score 0.70-0.80）: 限定的な領域横断判断**
- 創発的推論の初期導入（全推論の10-20%）
- 2領域にまたがる判断のみ許可（Sales ↔ CS、CS ↔ Product等）
- 承認フロー: 領域横断判断は引き続き人間承認が必要

**Phase 3b（Trust Score 0.80-0.85）: 段階的な自律化**
- 創発的推論の比率を30-40%に引き上げ
- 3領域にまたがる判断を許可
- 承認フロー: 低リスク判断は自律実行、高リスク判断のみ承認

**Phase 3c（Trust Score 0.85-0.90）: Phase 4 への準備**
- 創発的推論の比率を50-60%に引き上げ
- 4領域以上にまたがる複雑な判断を許可
- 承認フロー: 承認が例外になる（承認率15%以下）

### Phase 4 達成基準の定義

**Phase 4 への遷移条件**
1. **Trust Score**: 0.90 以上（Highly Trusted レベル）
2. **創発的推論の比率**: 60%以上（大半の判断が創発的推論）
3. **承認率**: 15%以下（承認が例外的な状況に限定される）
4. **領域横断判断の頻度**: 週次10回以上（自然に発生する）

**Phase 4 の特性**
- Neural Organization が組織の「知能」として機能する状態
- 人間は戦略・方向性の設定に集中し、日々の判断は AI が自律実行
- 組織知識が `/patterns/emergent/` に蓄積され、新しい状況でも適切な判断が可能
- 定型的推論と創発的推論の比率が動的に調整される（40:60 を基準に、状況により変動）

## 仮説の評価

### Phase 1-4 の機能マトリクス

| フェーズ | Trust Score | 定型:創発 比率 | 承認率 | 領域数 | 主要機能 |
|---------|------------|--------------|--------|--------|---------|
| Phase 1a | 0.00-0.30 | 100:0 | 100% | 1-2 | 接続・データ同期 |
| Phase 1b | 0.30-0.50 | 100:0 | 80% | 2-3 | 世界モデル・定型推論 |
| Phase 1c | 0.50-0.60 | 100:0 | 60% | 3-4 | 修正記録・パターン準備 |
| Phase 2 | 0.60-0.70 | 100:0 | 40% | 3-4 | パターン学習・自動化 |
| Phase 3a | 0.70-0.80 | 80:20 | 30% | 3-4 | 限定的領域横断 |
| Phase 3b | 0.80-0.85 | 60:40 | 20% | 4-5 | 段階的自律化 |
| Phase 3c | 0.85-0.90 | 50:50 | 15% | 5+ | Phase 4 準備 |
| Phase 4 | 0.90+ | 40:60 | <15% | 5+ | 完全な組織知能 |

### Phase 1 のリスク評価

**リスク**: Phase 1a-c で3ヶ月かかり、顧客が価値を実感できず離脱する
**対策**:
- Phase 1a で「データが見える」状態を1ヶ月以内に提供
- Phase 1b で「提案が来る」状態を2ヶ月以内に提供
- 各フェーズで定量的な成功基準を設定し、価値を可視化

**リスク**: 初期パターンの登録が手動で、スケールしない
**対策**:
- Phase 1 は限定的な顧客（3-5社）でのβ運用と割り切る
- Phase 2 の自動パターン抽出を早期に実装し、スケーラビリティを確保

### Phase 2 のリスク評価

**リスク**: 修正イベントが少なく、パターン抽出に必要な母数が貯まらない
**対策**:
- 提案頻度を高める（週次10件以上の提案）
- 修正イベントの記録を簡単にする（ワンクリックで記録）
- 複数顧客のデータをプールして学習（プライバシー保護前提）

**リスク**: 抽出されたパターンの精度が低く、信頼が下がる
**対策**:
- パターンの検証基準を厳格にする（success_rate >= 0.70, sample_size >= 10）
- 新規パターンは人間レビューを経てから `/patterns/routine/` に登録
- パターンの週次再評価で低品質パターンを除外

### Phase 3 のリスク評価

**リスク**: 領域横断判断の失敗で Trust Score が急落する
**対策**:
- Phase 3a では2領域のみ、Phase 3b で3領域、Phase 3c で4領域以上と段階的に拡大
- 領域横断判断の初期は承認フローを維持
- 失敗時の Reflection 機能で原因分析と改善を自動実行

**リスク**: 創発的推論の比率を上げすぎて、予測不可能な行動が増える
**対策**:
- Trust Score の閾値を段階的に上げる（0.70 → 0.80 → 0.85 → 0.90）
- 創発的推論の結果を `/traces/` に記録し、監査可能にする
- Phase 3c での承認率15%をバッファとして残す

### Phase 4 のリスク評価

**リスク**: Trust Score 0.90+ の達成が困難で、Phase 4 に到達できない
**対策**:
- Phase 3c を長期間運用し、Trust Score の自然な上昇を待つ
- Phase 4 は「到達目標」であり、Phase 3c でも十分な価値を提供できる設計にする
- Trust Score の計算式を調整し、Phase 4 への到達を現実的にする

**リスク**: Phase 4 到達後も承認率15%を下回らず、完全自律化しない
**対策**:
- 承認率15%は「例外的な状況のみ承認」の意味であり、ゼロを目指さない
- 人間の戦略的判断が必要な局面（新規事業、大型契約等）は常に承認フローを維持

## 結論

### Phase 1-4 の実装ロードマップ

**Phase 1（0-3ヶ月）: MVP構築**
- Phase 1a（0-1ヶ月）: 接続と信頼構築
  - 優先機能: P0のみ実装（接続、Entity Model、イベント取得）
  - 成功基準: 4システム接続、30日間データ取得、同期遅延5分以内
- Phase 1b（1-2ヶ月）: 世界モデルと定型推論
  - 優先機能: P0-P1実装（World Model、パス階層、定型推論、初期パターン登録）
  - 成功基準: 関係グラフ構築、定型推論発動、承認率60%以上
- Phase 1c（2-3ヶ月）: 記録と改善の準備
  - 優先機能: P0-P1実装（modification_event記録、可視化UI）
  - 成功基準: 修正イベント100件記録、新規パターン1-2件抽出、Phase 2準備完了

**Phase 2（3-6ヶ月）: パターン学習と自動化**
- パターン抽出アルゴリズムの自動実行（週次）
- Trust Score 0.60-0.70 への到達（修正頻度の低下）
- 承認率40%への低下（定型推論の信頼性向上）
- 目標: 3-4領域で安定運用、10-15個の検証済みパターン蓄積

**Phase 3（6-12ヶ月）: 領域横断判断と自律化**
- Phase 3a（Trust Score 0.70-0.80）: 2領域横断判断、創発的推論10-20%
- Phase 3b（Trust Score 0.80-0.85）: 3領域横断判断、創発的推論30-40%
- Phase 3c（Trust Score 0.85-0.90）: 4領域以上横断、創発的推論50-60%
- 目標: 承認率15%以下、領域横断判断が自然に発生

**Phase 4（12ヶ月以降）: 組織知能の完成**
- Trust Score 0.90 以上の維持
- 創発的推論60%以上、定型的推論40%以下
- 承認が例外的な状況に限定（15%以下）
- 人間は戦略設定に集中、Neural Organization が日々の判断を自律実行

### 移行戦略

1. **顧客セグメント別の段階的展開**
   - β顧客（3-5社）: Phase 1-2 を6ヶ月で完走
   - Early adopter（10-20社）: Phase 1-3a を9ヶ月で完走
   - General availability: Phase 1-3b を12ヶ月で完走

2. **機能フラグによる段階的機能解放**
   - 各顧客の Trust Score に応じて自動的に機能を解放
   - 手動での機能解放も可能（顧客要望に応じて）

3. **継続的な改善サイクル**
   - 週次: パターン再評価、Trust Score 更新
   - 月次: Phase 移行条件の確認、機能解放判定
   - 四半期: 全体設計の見直し、新機能の追加

## ネクストアクション

1. **Phase 1a の詳細設計**（2週間）
   - 接続する4システム（Salesforce, Slack, GitHub, Email）のAPI仕様確認
   - Layer 1 Entity Model の初期スキーマ設計
   - Layer 0 Perception のイベント取得ロジック設計

2. **Phase 1a の実装**（1ヶ月）
   - 各システムとの接続実装
   - Entity Model の CRUD 実装
   - イベント取得・同期機能の実装

3. **β顧客の選定**（1ヶ月）
   - Phase 1-2 を6ヶ月で完走できる顧客を3-5社選定
   - 各顧客の業務フロー・データ構造をヒアリング
   - 初期パターン（3-5個）の手動登録

4. **Phase 1b-c の設計・実装**（2ヶ月）
   - World Model の関係グラフ構築ロジック
   - パス階層アクセス機能の実装
   - modification_event 記録機能の実装

## 残論点

1. **Phase 1a-c の3ヶ月は長すぎないか？**
   - 顧客が価値を実感する前に離脱するリスク
   - Phase 1a-b を2ヶ月に短縮できる可能性を検討

2. **パターン抽出アルゴリズムの精度は十分か？**
   - 単純なクラスタリングで適切なパターンが抽出できるか
   - 機械学習モデル（教師あり学習）の導入を検討

3. **Trust Score の計算式は妥当か？**
   - 修正頻度だけで信頼性を測れるか
   - 他の指標（提案の採用率、実行後の成果等）を組み合わせる可能性

4. **Phase 3 の領域横断判断の失敗リスクをどう最小化するか？**
   - シミュレーション環境での事前検証
   - 人間の介入ポイントをどこに設けるか

5. **Phase 4 への到達は現実的か？**
   - Trust Score 0.90 以上の達成条件
   - Phase 3c での長期運用も価値ある状態として設計すべきか
