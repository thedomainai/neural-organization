/**
 * Audit Domain - Public Exports
 */

// Types
export type {
  AuditPatternType,
  SeverityLevel,
  AuditItemStatus,
  TextRange,
  AuditLocation,
  AuditItem,
  AuditResult,
  ScoreThresholds,
} from './types';

export {
  DEFAULT_SCORE_THRESHOLDS,
  PATTERN_SEVERITY_MAP,
  PATTERN_LABELS,
} from './types';

// Detector (to be implemented)
// export { detectAmbiguity } from './detector';

// Patterns (to be implemented)
// export { detectShallowAnalysis } from './patterns/shallow-analysis';
// export { detectMissingCoverage } from './patterns/missing-coverage';
// export { detectLackOfQuantification } from './patterns/lack-of-quantification';
// export { detectUnclearAction } from './patterns/unclear-action';

// Scorer (to be implemented)
// export { calculateScore } from './scorer';
