/**
 * src/domain/kpi/types.ts
 *
 * [Domain Layer]
 * KPI Tree ドメイン - 型定義
 *
 * 組織のKPI階層構造と曖昧性スコアを表現する型定義。
 */

/**
 * KPIノードのステータス
 */
export type KPIStatus = 'critical' | 'warning' | 'healthy';

/**
 * KPIツリーノード
 */
export interface KPITreeNode {
  /** 一意識別子 */
  id: string;
  /** KPI名称 */
  label: string;
  /** 現在の達成値（例: "82%", "1.2%"） */
  value: string;
  /** ステータス */
  status: KPIStatus;
  /** 責任者 */
  owner: string;
  /** 曖昧性スコア（0-100、低いほど良い） */
  ambiguityScore: number;
  /** エディタビューのターゲットかどうか */
  isTarget?: boolean;
  /** 子ノード */
  children?: KPITreeNode[];
}

/**
 * ステータスごとの表示ラベル
 */
export const KPI_STATUS_LABELS: Record<KPIStatus, string> = {
  critical: 'CRITICAL',
  warning: 'WARNING',
  healthy: 'HEALTHY',
};
