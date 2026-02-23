/**
 * Neural Organization データ型定義
 *
 * 全てのコンポーネントで使用する共通データ型。
 */

/**
 * 5層アーキテクチャのレイヤー定義
 */
export interface Layer {
  id: string;
  level: number;
  name: string;
  description: string;
  color?: string;
}

/**
 * 横断的要素（Crosscutting）定義
 */
export interface CrosscuttingElement {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

/**
 * 変容プロセスのフェーズ定義
 */
export interface TransformationPhase {
  id: string;
  number: number;
  name: string;
  description: string;
  duration: string;
  trustScoreRange: string;
  successCriteria: string[];
  keyFeatures: string[];
}

/**
 * 人間の参与形態
 */
export interface HumanRole {
  id: string;
  traditional: string;
  neuralOrg: string;
  description: string;
}

/**
 * 技術的堀（Moat）定義
 */
export interface TechnicalMoat {
  id: string;
  name: string;
  description: string;
  multiplier: string;
  details: string[];
}

/**
 * ROI データ
 */
export interface ROIData {
  annualReturn: number;
  cost: number;
  profit: number;
  roi: number;
  breakdown: {
    category: string;
    value: number;
    description: string;
  }[];
}

/**
 * パラダイムシフトの対比項目
 */
export interface ParadigmShiftItem {
  id: string;
  category: string;
  before: string;
  after: string;
  description: string;
}
