/**
 * src/domain/audit/types.ts
 * * [Domain Layer]
 * 曖昧性検出ドメイン - 型定義
 * * UIから完全に隔離された純粋なドメインロジック用の型定義。
 * 将来的にPython (Orchestrator) に移植される際、これらの定義は
 * PydanticモデルやPythonの型ヒントに変換されます。
 */

/**
 * 曖昧性パターンの種類
 *
 * | パターン | 説明 | 検出例 | Principles |
 * |----------|------|--------|------------|
 * | shallow_analysis | 浅い分析 | 「売上未達」を分解せず報告 | Zero Ambiguity |
 * | missing_coverage | カバレッジ不足 | 3つの施策のうち2つしか報告なし | Zero Ambiguity |
 * | lack_of_quantification | 定量化不足 | 「改善中」「順調」など数値なし | Zero Ambiguity |
 * | unclear_action | アクション不明確 | 「対応予定」でWho/What/When不明 | Zero Ambiguity |
 * | fact_interpretation_mixing | 事実と解釈の混同 | 「A社の反応は良かった（主観）」のみ報告 | Fact/Interpretation Separation |
 */
export type AuditPatternType =
  | 'shallow_analysis'
  | 'missing_coverage'
  | 'lack_of_quantification'
  | 'unclear_action'
  | 'fact_interpretation_mixing'; // Added based on Principles #2

/**
 * 重要度レベル
 */
export type SeverityLevel = 'critical' | 'warning' | 'info';

/**
 * 監査項目のステータス
 */
export type AuditItemStatus = 'open' | 'dismissed' | 'resolved';

/**
 * テキスト範囲
 */
export interface TextRange {
  /** 開始位置（文字インデックス） */
  start: number;
  /** 終了位置（文字インデックス） */
  end: number;
  /** 該当テキスト */
  text: string;
}

/**
 * 検出された曖昧性の位置情報
 * Google Docs/Slides対応を見据えた抽象化
 */
export interface AuditLocation {
  /** ドキュメント内のパス（例: pageId, objectId） */
  path?: string[];
  /** テキスト範囲 */
  range: TextRange;
}

/**
 * 個別の監査項目（検出された曖昧性）
 */
export interface AuditItem {
  /** 一意識別子 (UUID) */
  id: string;
  /** 曖昧性パターンの種類 */
  pattern: AuditPatternType;
  /** 重要度 */
  severity: SeverityLevel;
  /** 問題の要約メッセージ */
  message: string;
  /** 検知の論理的根拠（Why） */
  rationale: string;
  /** 改善のための質問/提案（How） */
  suggestion: string;
  /** 検出位置 */
  location: AuditLocation;
  /** ステータス */
  status: AuditItemStatus;
  /** 検出日時 */
  detectedAt: Date;
  /** 解決日時（解決済みの場合） */
  resolvedAt?: Date;
  /** 却下理由（却下の場合） */
  dismissReason?: string;
}

/**
 * 監査結果レポート
 */
export interface AuditResult {
  /** レポートID */
  reportId: string;
  /** 検出された監査項目のリスト */
  items: AuditItem[];
  /** 全体の品質スコア (0-100) */
  score: number;
  /** パターン別の検出数 */
  patternCounts: Record<AuditPatternType, number>;
  /** 監査実行日時 */
  auditedAt: Date;
  /** 分析ステータス */
  status: 'analyzing' | 'completed' | 'failed';
}

/**
 * 品質スコアの閾値
 */
export interface ScoreThresholds {
  /** この値以上で「良好 (Healthy)」 */
  good: number;
  /** この値以上で「要改善 (Warning)」、未満で「問題あり (Critical)」 */
  acceptable: number;
}

/**
 * デフォルトの品質スコア閾値
 */
export const DEFAULT_SCORE_THRESHOLDS: ScoreThresholds = {
  good: 80,
  acceptable: 60,
};

/**
 * パターンごとのデフォルト重要度マッピング
 */
export const PATTERN_SEVERITY_MAP: Record<AuditPatternType, SeverityLevel> = {
  shallow_analysis: 'critical',
  missing_coverage: 'critical',
  lack_of_quantification: 'warning',
  unclear_action: 'warning',
  fact_interpretation_mixing: 'critical', // Interpretationの混入は重大なノイズ
};

/**
 * パターンの表示名（日本語）
 */
export const PATTERN_LABELS: Record<AuditPatternType, string> = {
  shallow_analysis: '浅い分析',
  missing_coverage: 'カバレッジ不足',
  lack_of_quantification: '定量化不足',
  unclear_action: 'アクション不明確',
  fact_interpretation_mixing: '事実と解釈の混同',
};