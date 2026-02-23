/**
 * 用語辞書データ
 *
 * ツールチップで表示する専門用語の定義。
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: 'architecture' | 'reasoning' | 'transformation' | 'business';
}

export const glossary: Record<string, GlossaryTerm> = {
  'trust-score': {
    term: 'Trust Score',
    definition:
      'システムの判断精度と人間からの信頼を数値化したスコア（0.00-1.00）。Phase 1-4 の進行と推論モード選択に使用される。',
    category: 'transformation',
  },
  'routine-reasoning': {
    term: '定型的推論',
    definition:
      '過去の成功パターンに基づく高速で確実な推論。Trust Score < 0.60 または合致率80%+ の場合に適用される。',
    category: 'reasoning',
  },
  'emergent-reasoning': {
    term: '創発的推論',
    definition:
      'LLM ベースの柔軟で創造的な推論。Trust Score ≥ 0.60 または未知の状況で適用され、新しい解を生成する。',
    category: 'reasoning',
  },
  layer: {
    term: 'Layer',
    definition:
      '5層アーキテクチャの各階層。L0 Perception（知覚）、L1 Understanding（理解）、L2 Reasoning（推論）、L3 Execution（実行）、L4 Reflection（内省）で構成される。',
    category: 'architecture',
  },
  crosscutting: {
    term: 'Crosscutting Elements',
    definition:
      'すべてのレイヤーを横断する4要素。Purpose（目的）、Governance（統治）、Memory（記憶）、Orchestration（調和）。',
    category: 'architecture',
  },
  purpose: {
    term: 'Purpose',
    definition:
      '組織の存在理由。人間が定義し、全レイヤーの判断基準となる。AGI が生成できない唯一の要素。',
    category: 'architecture',
  },
  memory: {
    term: 'Memory',
    definition:
      '組織の状態とパターンを管理する記憶システム。7つの名前空間（entities, relations, sessions, metrics, patterns, config, traces）で構成され、最大2階層の深さでアドレッサブル。',
    category: 'architecture',
  },
  roi: {
    term: 'ROI (Return on Investment)',
    definition:
      '投資対効果。Neural Organization では年間¥8,195M のリターンに対し¥3,000M のコストで、ROI 173%（¥5,195M の利益）を実現。',
    category: 'business',
  },
  moat: {
    term: 'Moat（堀）',
    definition:
      '競合優位性の源泉。Neural Organization は4つの堀（Network Intelligence 5.0x、Trust Architecture、Emergent Reasoning 2.7x、Memory Complex 4.1x）を持つ。',
    category: 'business',
  },
  'phase-1': {
    term: 'Phase 1: Awakening',
    definition:
      '組織とシステムが接続され、データ循環が始まる段階（0-3ヶ月）。Trust Score 0.00-0.40。',
    category: 'transformation',
  },
  'phase-2': {
    term: 'Phase 2: Symbiosis',
    definition:
      '人間とシステムの共生関係が形成される段階（3-6ヶ月）。Trust Score 0.40-0.60。',
    category: 'transformation',
  },
  'phase-3': {
    term: 'Phase 3: Metamorphosis',
    definition:
      'システムが3+ ドメインで自律判断できる段階（6-12ヶ月）。Trust Score 0.60-0.80。',
    category: 'transformation',
  },
  'phase-4': {
    term: 'Phase 4: Emergence',
    definition:
      'システムが新しい戦略を創造する段階（12ヶ月以降）。Trust Score 0.80-1.00。',
    category: 'transformation',
  },
  governor: {
    term: 'Governor（統治者）',
    definition:
      '組織の存在理由を定義する人間の役割。Purpose と Values の源泉。',
    category: 'architecture',
  },
  sensemaker: {
    term: 'Sensemaker（意味付与者）',
    definition:
      'データが捉えられない主観的体験をシステムに翻訳する人間の役割。',
    category: 'architecture',
  },
  creator: {
    term: 'Creator（創造者）',
    definition:
      'まだ存在しないものを構想する人間の役割。「何を存在させるべきか」という問いの設定自体が創造行為。',
    category: 'architecture',
  },
};
