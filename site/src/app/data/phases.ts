/**
 * 変容プロセス Phase 1-4 データ
 *
 * Transformation.tsx から抽出し、ADR 009 の設計を反映。
 * 各 Phase の期間・Trust Score 範囲・成功基準を含む。
 */

import { TransformationPhase } from './types';

export const phases: TransformationPhase[] = [
  {
    id: 'phase-1',
    number: 1,
    name: 'Awakening',
    description:
      '組織とシステムが接続され、データの循環が始まる。システムは組織の世界モデルを構築し、記録と観察を通じて学習を開始する。',
    duration: '0-3ヶ月',
    trustScoreRange: '0.00 - 0.40（Cold Start → Learning）',
    successCriteria: [
      'Phase 1a: 全データソースとの接続完了',
      'Phase 1b: 世界モデル構築完了（主要エンティティ認識率 80%+）',
      'Phase 1c: 記録・観察フィードバックループ確立',
    ],
    keyFeatures: [
      'データソース接続（Slack, Gmail, GitHub, Notion etc.）',
      'エンティティ認識と世界モデル構築',
      '人間フィードバックによるパターン学習',
      '定型的推論による高速処理',
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    name: 'Symbiosis',
    description:
      '人間とシステムの共生関係が形成される。システムは提案を行い、人間はそれを評価・修正することで Trust Score が上昇し、推論の質が向上する。',
    duration: '3-6ヶ月',
    trustScoreRange: '0.40 - 0.60（Learning → Trusted）',
    successCriteria: [
      'Trust Score 0.60 到達',
      '提案承認率 60%+',
      '人間の意思決定時間 30% 削減',
    ],
    keyFeatures: [
      'システムから人間への提案開始',
      'Trust Score に基づく段階的な権限委譲',
      '定型的推論 70% / 創発的推論 30% の比率',
      '成功パターンの蓄積と再利用',
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    name: 'Metamorphosis',
    description:
      'システムが3つ以上のドメインにまたがる複雑な判断を自律的に行えるようになる。組織の形態が変容し、人間は戦略的判断に集中できるようになる。',
    duration: '6-12ヶ月',
    trustScoreRange: '0.60 - 0.80（Trusted → Highly Trusted）',
    successCriteria: [
      'Trust Score 0.70+',
      '3+ ドメインでの自律実行',
      '50%+ の意思決定が自律化',
    ],
    keyFeatures: [
      'マルチドメインにわたる創発的推論',
      '自律実行率 50%+ 到達',
      '人間は例外処理と戦略的判断に注力',
      '組織構造の柔軟な再編成',
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    name: 'Emergence',
    description:
      'システムが組織の目的を深く理解し、新しい戦略や方法を自ら創造する。人間とシステムの境界が曖昧になり、組織は知能を持つ生命体のように振る舞う。',
    duration: '12ヶ月以降',
    trustScoreRange: '0.80 - 1.00（Highly Trusted）',
    successCriteria: [
      'Trust Score 0.80+',
      '80%+ の意思決定が自律化',
      '新しい戦略・方法の創発',
    ],
    keyFeatures: [
      '創発的推論が主体（80%+）',
      '組織目的の深い理解と戦略創造',
      '人間は目的定義とガバナンス設定に特化',
      'システムが自律的に組織を進化させる',
    ],
  },
];
