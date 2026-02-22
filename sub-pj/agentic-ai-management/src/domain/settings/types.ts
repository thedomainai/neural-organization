/**
 * src/domain/settings/types.ts
 *
 * [Domain Layer]
 * 設定・データ定義ドメイン - 型定義
 *
 * KPIの構造定義、閾値設定、オーナー管理などの型定義。
 */

/**
 * KPI定義（マスタデータ）
 */
export interface KPIDefinition {
  /** 一意識別子 */
  id: string;
  /** KPI名称 */
  name: string;
  /** 説明 */
  description?: string;
  /** 単位（例: "%", "件", "円"） */
  unit: string;
  /** 目標値の形式 */
  targetType: 'higher_is_better' | 'lower_is_better' | 'target_range';
  /** 目標値 */
  target?: number;
  /** 目標範囲（targetType が target_range の場合） */
  targetRange?: { min: number; max: number };
  /** 警告閾値（この値を超えると warning） */
  warningThreshold?: number;
  /** 危険閾値（この値を超えると critical） */
  criticalThreshold?: number;
  /** 親KPIのID（ツリー構造用） */
  parentId?: string;
  /** 責任者ID */
  ownerId?: string;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
}

/**
 * オーナー/責任者
 */
export interface Owner {
  /** 一意識別子 */
  id: string;
  /** 名前 */
  name: string;
  /** メールアドレス */
  email?: string;
  /** 役職 */
  role?: string;
  /** 部門 */
  department?: string;
}

/**
 * KPI実績データ（入力データ）
 */
export interface KPIDataEntry {
  /** 一意識別子 */
  id: string;
  /** KPI定義ID */
  kpiDefinitionId: string;
  /** 期間（YYYY-MM-DD または YYYY-Wxx） */
  period: string;
  /** 実績値 */
  actualValue: number;
  /** 前期比（自動計算） */
  previousPeriodChange?: number;
  /** メモ */
  notes?: string;
  /** 入力者 */
  enteredBy?: string;
  /** 入力日時 */
  enteredAt: Date;
}

/**
 * レポート定義
 */
export interface ReportDefinition {
  /** 一意識別子 */
  id: string;
  /** レポート名 */
  name: string;
  /** 説明 */
  description?: string;
  /** 関連するKPI定義ID（複数可） */
  linkedKpiIds: string[];
  /** 責任者ID */
  ownerId?: string;
  /** 提出頻度 */
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  /** テンプレート内容（Markdown） */
  template?: string;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
}

/**
 * フォーム用のKPI定義入力
 */
export interface KPIDefinitionInput {
  name: string;
  description?: string;
  unit: string;
  targetType: 'higher_is_better' | 'lower_is_better' | 'target_range';
  target?: number;
  targetRange?: { min: number; max: number };
  warningThreshold?: number;
  criticalThreshold?: number;
  parentId?: string;
  ownerId?: string;
}

/**
 * フォーム用のKPIデータ入力
 */
export interface KPIDataInput {
  kpiDefinitionId: string;
  period: string;
  actualValue: number;
  notes?: string;
}
