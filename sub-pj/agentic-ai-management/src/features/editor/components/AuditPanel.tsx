/**
 * src/features/editor/components/AuditPanel.tsx
 *
 * [Feature Component]
 * AuditPanel - 曖昧性指摘パネル
 *
 * Hooksを利用して描画のみに専念するUIコンポーネント。
 * ビジネスロジックは useAuditLog に委譲。
 */

'use client';

import { type FC, useState } from 'react';
import { getSeverityStyles, getScoreColor } from '@/lib/theme';
import { PATTERN_LABELS, type AuditItem } from '@/domain/audit/types';
import { type UseAuditLogReturn } from '../hooks/useAuditLog';

/**
 * AuditPanel Props
 */
export interface AuditPanelProps {
  /** useAuditLog から取得した状態と操作 */
  auditLog: UseAuditLogReturn;
  /** パネルのタイトル */
  title?: string;
  /** クラス名 */
  className?: string;
}

/**
 * 曖昧性指摘パネル
 *
 * @example
 * ```tsx
 * const auditLog = useAuditLog(result);
 * return <AuditPanel auditLog={auditLog} />;
 * ```
 */
export const AuditPanel: FC<AuditPanelProps> = ({
  auditLog,
  title = '曖昧性チェック',
  className = '',
}) => {
  const { items, openCount, score, filter, setFilter, dismiss, resolve, isProcessing } =
    auditLog;

  return (
    <div
      className={`flex flex-col h-full bg-background-layer2 rounded-lg border border-border-default ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-foreground-primary">{title}</h2>
          {openCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-severity-critical-bg text-severity-critical-text border border-severity-critical-border">
              {openCount}
            </span>
          )}
        </div>
        <ScoreBadge score={score} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 p-3 border-b border-border-default">
        <FilterButton
          active={filter.status === 'open'}
          onClick={() => setFilter({ ...filter, status: 'open' })}
        >
          未解決
        </FilterButton>
        <FilterButton
          active={filter.status === 'all'}
          onClick={() => setFilter({ ...filter, status: 'all' })}
        >
          すべて
        </FilterButton>
        <FilterButton
          active={filter.status === 'resolved'}
          onClick={() => setFilter({ ...filter, status: 'resolved' })}
        >
          解決済み
        </FilterButton>
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="px-3 py-2 bg-accent-subtle border-b border-border-default">
          <div className="flex items-center gap-2 text-xs text-accent-text">
            <LoadingSpinner />
            <span>処理中...</span>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <EmptyState status={filter.status} />
        ) : (
          items.map((item) => (
            <AuditItemCard
              key={item.id}
              item={item}
              onDismiss={(reason) => dismiss(item.id, reason)}
              onResolve={() => resolve(item.id)}
              disabled={isProcessing}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * スコアバッジ
 */
const ScoreBadge: FC<{ score: number }> = ({ score }) => {
  const color = getScoreColor(score);

  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full"
      style={{ backgroundColor: `${color}20` }}
    >
      <span className="text-sm font-medium" style={{ color }}>
        {score}
      </span>
      <span className="text-xs text-foreground-secondary">/ 100</span>
    </div>
  );
};

/**
 * フィルターボタン
 */
const FilterButton: FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${
        active
          ? 'bg-accent-primary text-foreground-inverse'
          : 'bg-background-layer3 text-foreground-secondary hover:text-foreground-primary'
      }`}
    >
      {children}
    </button>
  );
};

/**
 * ローディングスピナー
 */
const LoadingSpinner: FC = () => (
  <svg
    className="w-3 h-3 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * 空状態
 */
const EmptyState: FC<{ status?: string }> = ({ status }) => {
  const message =
    status === 'open'
      ? '未解決の指摘はありません'
      : status === 'resolved'
        ? '解決済みの指摘はありません'
        : '指摘はありません';

  return (
    <div className="flex flex-col items-center justify-center py-12 text-foreground-muted">
      <svg
        className="w-12 h-12 mb-3 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
};

/**
 * 重要度アイコン
 */
const SeverityIcon: FC<{ severity: 'critical' | 'warning' | 'info' }> = ({ severity }) => {
  if (severity === 'critical') {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  if (severity === 'warning') {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

/**
 * 監査項目カード
 */
const AuditItemCard: FC<{
  item: AuditItem;
  onDismiss: (reason: string) => void;
  onResolve: () => void;
  disabled?: boolean;
}> = ({ item, onDismiss, onResolve, disabled }) => {
  const [showDismissInput, setShowDismissInput] = useState(false);
  const [dismissReason, setDismissReason] = useState('');

  const severityStyles = getSeverityStyles(item.severity);
  const isOpen = item.status === 'open';

  const handleDismiss = () => {
    if (dismissReason.trim()) {
      onDismiss(dismissReason.trim());
      setShowDismissInput(false);
      setDismissReason('');
    }
  };

  const handleCancel = () => {
    setShowDismissInput(false);
    setDismissReason('');
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${
        isOpen
          ? 'bg-background-layer1 border-border-default hover:border-border-active hover:shadow-md'
          : 'bg-background-layer2 border-border-subtle opacity-60'
      } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      {/* Header - Pattern Label */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${severityStyles}`}>
          <SeverityIcon severity={item.severity} />
          <span>{PATTERN_LABELS[item.pattern]}</span>
        </div>
        {item.status !== 'open' && (
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            item.status === 'resolved'
              ? 'bg-severity-success-bg text-severity-success-text'
              : 'bg-background-layer3 text-foreground-muted'
          }`}>
            {item.status === 'resolved' ? '✓ 解決済み' : '✗ 却下'}
          </span>
        )}
      </div>

      {/* Message */}
      <p className="text-base text-foreground-primary mb-3 leading-relaxed">{item.message}</p>

      {/* Rationale (if exists) */}
      {item.rationale && (
        <div className="mb-3 p-3 bg-background-layer2 rounded-lg border border-border-subtle">
          <p className="text-sm text-foreground-secondary leading-relaxed">
            <span className="font-medium text-foreground-muted">理由: </span>
            {item.rationale}
          </p>
        </div>
      )}

      {/* Suggestion */}
      <div className="mb-4 p-3 bg-accent-subtle rounded-lg border border-accent-primary/30">
        <p className="text-sm text-accent-text leading-relaxed">
          <span className="font-bold">💡 提案: </span>
          {item.suggestion}
        </p>
      </div>

      {/* Actions */}
      {isOpen && !showDismissInput && (
        <div className="flex gap-3 pt-2 border-t border-border-subtle">
          <button
            onClick={onResolve}
            disabled={disabled}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-severity-success-bg text-severity-success-text border-2 border-severity-success-border hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            解決済みにする
          </button>
          <button
            onClick={() => setShowDismissInput(true)}
            disabled={disabled}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-background-elevated text-foreground-secondary border-2 border-border-default hover:border-foreground-muted hover:text-foreground-primary hover:shadow-sm active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            却下
          </button>
        </div>
      )}

      {/* Dismiss Reason Input */}
      {isOpen && showDismissInput && (
        <div className="space-y-3 pt-3 border-t border-border-subtle">
          <label className="block text-sm font-medium text-foreground-secondary">
            却下理由を入力してください
          </label>
          <input
            type="text"
            value={dismissReason}
            onChange={(e) => setDismissReason(e.target.value)}
            placeholder="例: 別途対応済み、仕様として許容 など"
            className="w-full px-4 py-2.5 text-sm rounded-lg bg-background-layer1 border-2 border-border-default text-foreground-primary placeholder:text-foreground-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleDismiss();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              disabled={!dismissReason.trim() || disabled}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-severity-warning-bg text-severity-warning-text border-2 border-severity-warning-border hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              この指摘を却下する
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-background-elevated text-foreground-secondary border-2 border-border-default hover:text-foreground-primary transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Dismissed Reason Display */}
      {item.status === 'dismissed' && item.dismissReason && (
        <div className="mt-3 p-2 bg-background-layer3 rounded-lg">
          <p className="text-sm text-foreground-muted">
            <span className="font-medium">却下理由:</span> {item.dismissReason}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditPanel;
