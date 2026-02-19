# Enterprise Functions — E2Eフロー定義

> 各企業機能がNeural Organization上でどのように実現されるか、
> 感覚層から出力層まで全層を通るEnd-to-Endフローとして定義する。

---

## フロー記法

```
[Layer] Agent名: アクション
  → 入力/出力の流れ
```

---

## 1. マーケティング: PV低下時の自律対応

### シナリオ
WebサイトのPVが前月比90%に低下。組織が自律的に対応する。

### E2Eフロー

```
[L1 Sensory] Metrics Collector:
  Google Analytics から PV前月比90% のデータを収集
  → MetricsSnapshot Event を発行

[L1 Sensory] Event Detector:
  PV が warning_threshold (95%) を下回ったことを検知
  → Alert Event (severity: warning, kpi: website_pv) を Event Bus に発行

[L2 Memory] Recall Agent:
  Alert を受けて関連記憶を検索
  → Episodic: 「前回PV低下時、SNS施策で+15%回復した」
  → Episodic: 「SEOリライトで3ヶ月後にPV+25%だった」
  → Semantic: 「ターゲット層はX(Twitter)の利用率が高い」
  → 記憶パッケージを Cortex Layer に送付

[L3 Cortex] Marketing Strategist:
  記憶パッケージ + KPIデータを受信
  思考:
    - 短期施策: SNS投稿による即時流入増
    - 中期施策: 既存記事のSEOリライト
  → Strategic Directive 2件を発行:
    Directive A: 「X投稿を3本作成（今週中）」 [P1]
    Directive B: 「PV上位記事のSEOリライト5本」 [P2]

[L3 Cortex] Risk Assessor:
  Directive A: risk_tier = LOW (SNS投稿、可逆性高い)
  Directive B: risk_tier = MEDIUM (既存記事の変更)

[L4 Motor] Marketing Lead:
  Directive A を受信 → SNS Manager × 1 を起動
  Directive B を受信 → Content Writer × 2 + SEO × 1 を起動

[L4 Motor] SNS Manager:
  記憶参照: 過去の高エンゲージメント投稿パターン
  ツール: mcp-x (X API)
  → 3本の投稿ドラフトを作成

[L4 Motor] Content Writer + SEO:
  記憶参照: SEOベストプラクティス、ターゲットキーワード
  ツール: mcp-cms, mcp-seo
  → 5本のリライト案を作成

[L5 Limbic] AI Critic (Marketing):
  投稿ドラフト3本: ブランドガイドライン準拠チェック
    → 2本 Accept, 1本 Revise（ハッシュタグ不足）
  リライト案5本: SEO要件 + 品質チェック
    → 4本 Accept, 1本 Revise（タイトル改善必要）

[L5 Limbic] HITL Gateway:
  投稿3本: risk_tier = LOW → 自動承認（事後通知）
  リライト5本: risk_tier = MEDIUM → 自動承認（24h以内レビュー通知）

[L6 Output] SNS Publisher:
  → X に3本投稿をスケジュール公開

[L6 Output] CMS Publisher:
  → CMS に5本のリライト記事を公開

[L7 Interface] Market Responder:
  投稿への反応をモニタリング
  → エンゲージメントデータを Sensory Layer にフィードバック

[L2 Memory] Learning Synthesizer:
  投稿結果: 「カジュアルなトーンの投稿がCTR +30%」
  → Semantic Memory に学習結果を保存
  → Procedural Memory の投稿テンプレートを更新
```

---

## 2. 営業: 新規リード獲得から成約まで

### シナリオ
ターゲット企業リストから新規リードを獲得し、商談を経て成約する。

### E2Eフロー

```
[L3 Cortex] Sales Strategist:
  Q1の売上目標と現在のパイプラインを比較
  → 新規リード20件獲得の Directive を発行 [P1]

[L4 Motor] Sales Lead:
  → Prospector × 2 を起動

[L4 Motor] Prospector:
  記憶参照: 理想的な顧客像（ICP）、過去の成約パターン
  ツール: mcp-crm, mcp-linkedin, mcp-email
  実行:
    1. ICPに基づくターゲット企業リスト作成（50社）
    2. 各社の意思決定者を特定
    3. パーソナライズされたアプローチメールを作成
    4. メール送信（1日10通ずつ、5日間）
  → リードスコアリング付きレスポンスリスト

[L1 Sensory] Customer Listener:
  メールの開封・返信を追跡
  → 返信のあった10件を CustomerFeedback Event として発行

[L4 Motor] Sales Lead:
  返信ありリードに対して → Negotiator を起動

[L4 Motor] Negotiator:
  記憶参照: 顧客のエピソード記憶、過去の商談パターン
  ツール: mcp-crm, mcp-email, mcp-calendar
  実行:
    1. 初回商談のスケジュール設定
    2. 提案書の作成（記憶から顧客課題を推定）
    3. 商談メモの記録
    4. フォローアップメール送信
  → 提案書 + 見積書のドラフト

[L5 Limbic] AI Critic (Sales):
  提案書: 正確性、ブランド整合性チェック → Accept
  見積書: 価格妥当性チェック → Accept

[L5 Limbic] HITL Gateway:
  見積書: risk_tier = HIGH → Human事前承認を要求
  → Slack で営業責任者に承認依頼
  → 承認完了

[L6 Output] Email Sender:
  → 提案書 + 見積書を顧客にメール送信

[L7 Interface] Customer Agent:
  顧客からの質問に対応（チャット/メール）
  → 回答内容を Working Memory に保存

[L4 Motor] Negotiator:
  顧客から発注書受領
  → Contract Drafter (Legal) にリレー

[L4 Motor] Contract Drafter:
  契約書ドラフトを作成
  → Tier 3: Human事前承認

[L6 Output] Document Publisher + Email Sender:
  → 契約書を電子署名プラットフォームにアップロード
  → 顧客に署名依頼メール送信

[L2 Memory] Learning Synthesizer:
  成約エピソードを保存:
    「ターゲット50社 → レスポンス10社 → 商談5社 → 成約2社」
    「提案書でROI試算を含めた場合の成約率: 60%（通常: 30%）」
```

---

## 3. HR: 採用プロセス

### E2Eフロー

```
[L3 Cortex] HR Strategist:
  Engineering Strategistから「エンジニア2名追加が必要」の要求受信
  → 採用 Directive を発行 [P1]

[L4 Motor] Recruiter:
  記憶参照: 過去の採用成功パターン、JD実績
  ツール: mcp-ats, mcp-linkedin, mcp-email
  実行:
    1. JD（ジョブディスクリプション）作成
    2. 求人サイトに掲載
    3. LinkedIn での候補者サーチ
    4. 応募者のスクリーニング（書類選考）
    5. 面接スケジュール調整
  → 候補者リスト（スコア付き）

[L5 Limbic] HITL Gateway:
  最終候補者の選定: Tier 3 → Human事前承認必須
  → 面接官（人間）が最終面接を実施

[L4 Motor] Onboarder:
  採用決定後:
    1. オファーレター作成
    2. 各種アカウント作成依頼
    3. オンボーディング資料準備
    4. 初日スケジュール作成
```

---

## 4. Finance: 月次決算

### E2Eフロー

```
[L1 Sensory] Metrics Collector:
  月末にERP/会計ソフトからデータを自動収集
  → 全勘定科目の残高、取引明細

[L3 Cortex] Finance Strategist:
  月次決算 Directive を発行（定期スケジュール） [P1]

[L4 Motor] Accountant:
  実行:
    1. 未処理仕訳の確認・入力
    2. 売掛金・買掛金の消込
    3. 減価償却費の計上
    4. 月次試算表の作成
    5. 財務諸表（P/L, B/S, C/F）ドラフト作成

[L5 Limbic] AI Critic (Finance):
  数値整合性チェック（貸借一致、前月比異常値検出）
  → 2件の異常値を検出、再確認を要求

[L5 Limbic] Compliance Guardian:
  会計基準準拠チェック

[L5 Limbic] HITL Gateway:
  財務諸表: Tier 4 → 経理責任者 + 経営者の承認が必須

[L4 Motor] Forecaster:
  実績データに基づき次月以降の予測を更新
  → 予実管理レポートを作成

[L6 Output] Document Publisher:
  承認済み財務諸表を Google Drive に保存
  経営陣に Slack 通知
```

---

## 5. カスタマーサポート: 問い合わせ対応

### E2Eフロー

```
[L7 Interface] Customer Agent:
  顧客からチャットで問い合わせ受信
  「ログインできない」

[L2 Memory] Recall Agent:
  顧客のエピソード記憶: 「先月パスワードリセット済み」
  Semantic Memory: 「ログイン障害のトラブルシューティング手順」
  Working Memory: 「現在、認証サービスに障害は発生していない」

[L4 Motor] Responder:
  手順に沿ってトラブルシューティング:
    1. ブラウザキャッシュクリアを案内
    2. パスワードリセットリンクを送信
    3. 解決確認

  → 解決した場合: チケットクローズ、CSAT調査送信
  → 解決しない場合: ↓

[L4 Motor] Escalator:
  3回の自動対応で解決せず → エスカレーション判定
  → Engineering Cluster に技術調査を依頼
  → 顧客に「技術チームが調査中」と回答

[L2 Memory] Learning Synthesizer:
  問い合わせパターンを分析:
  「今月ログイン問題が15件。共通原因: 2FA設定後のキャッシュ問題」
  → KB Author にFAQ記事作成を提案
  → Engineering Strategist に根本原因修正を提案
```

---

## 6. Engineering: バグ修正

### E2Eフロー

```
[L1 Sensory] Event Detector:
  エラーモニタリングツールから異常検知
  「本番環境でAPIエラーレートが5%を超過」

[L3 Cortex] Engineering Strategist:
  → 緊急バグ修正 Directive [P0]

[L4 Motor] Developer:
  1. エラーログを分析
  2. 原因を特定（データベースコネクションリーク）
  3. 修正コードを実装
  4. テストを作成・実行
  5. PRを作成

[L4 Motor] Code Reviewer:
  PRをレビュー
  → セキュリティチェック OK
  → パフォーマンス影響なし
  → Approve

[L4 Motor] DevOps:
  1. ステージング環境にデプロイ
  2. 自動テスト実行（全パス）
  3. 本番デプロイ実行

[L5 Limbic] HITL Gateway:
  本番デプロイ: risk_tier = HIGH → Human事前承認
  → エンジニアリングリードが承認

[L6 Output] Code Deployer:
  → 本番環境にデプロイ

[L1 Sensory] Event Detector:
  デプロイ後のエラーレート監視
  → 正常値に復帰を確認

[L2 Memory] Learning Synthesizer:
  インシデントレポートを Episodic Memory に保存:
  「コネクションリークは定期的にヘルスチェックで防止可能」
  → Engineering の Procedural Memory にヘルスチェック手順を追加
```

---

## 7. 部門横断: 新製品ローンチ

### シナリオ
新製品のローンチにおいて、複数部門が協調して動く大規模プロジェクト。

### E2Eフロー

```
[L3 Cortex] CEO Agent:
  新製品ローンチの全社 Directive を発行 [P0]
  → 各 Domain Strategist に部門別指示を展開

[L3 Cortex] Marketing Strategist:
  → ローンチキャンペーン計画策定
  → Marketing Cluster にコンテンツ制作指示

[L3 Cortex] Sales Strategist:
  → 営業資料・デモスクリプト準備指示
  → Sales Cluster に既存顧客への告知指示

[L3 Cortex] Engineering Strategist:
  → 製品リリース準備指示
  → Engineering Cluster にデプロイ計画策定指示

[L3 Cortex] Support Strategist:
  → FAQ・サポートドキュメント準備指示
  → Support Cluster にKB更新指示

[L3 Cortex] Legal Strategist:
  → 利用規約・プライバシーポリシー更新指示

[-- 以下、各Clusterが並行して実行 --]

Marketing:  LP制作、プレスリリース、SNSキャンペーン
Sales:      営業資料作成、既存顧客へのプレビュー案内
Engineering: リリースビルド、ステージングテスト
Support:    FAQ作成、チャットボット学習データ更新
Legal:      利用規約更新、コンプライアンスチェック

[L3 Cortex] CEO Agent:
  全クラスタの進捗を統合監視
  ローンチ準備完了の判定（全クラスタのタスク完了を確認）
  → ローンチ実行の最終 Directive

[L5 Limbic] HITL Gateway:
  ローンチ最終承認: Tier 4 → 経営陣の複数承認

[L6 Output] 全Publisher:
  同時に実行:
  - CMS: LP公開
  - SNS: ローンチ投稿
  - Email: 顧客向けアナウンスメール
  - GitHub: 製品リリース

[L2 Memory] Learning Synthesizer:
  ローンチ全体のエピソードを記録
  各施策の効果を追跡（ローンチ後1週間、1ヶ月、3ヶ月でレビュー）
```

---

## フローの共通パターン

全てのE2Eフローに共通する構造：

```
1. Trigger:      感覚層でイベント検知 / 人間からの指示 / 定期スケジュール
2. Context:      記憶層から関連情報を想起
3. Strategy:     思考層で「何をすべきか」を決定
4. Execution:    実行層で「どうやるか」を実行
5. Evaluation:   評価層で品質・コンプライアンスを検証
6. Approval:     リスクティアに応じた承認フロー
7. Deployment:   出力層で外部にデプロイ
8. Feedback:     界面層で結果を受信、感覚層に還元
9. Learning:     記憶層に経験として保存、次回に活用
```

---

*以上で enterprise-functions/ の定義が完成。*
