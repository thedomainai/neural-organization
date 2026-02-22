/**
 * src/features/editor/hooks/useAuditLog.ts
 * * [Feature Hook]
 * useAuditLog - 監査項目の状態管理Hook
 *
 * Domain層のロジックとUIを繋ぐコントローラー。
 * ユーザーアクションに対する「楽観的UI更新」と「将来のAPI連携」を管理する。
 */

import { useCallback, useMemo, useState } from 'react';
import type {
  AuditItem,
  AuditItemStatus,
  AuditPatternType,
  AuditResult,
} from '@/domain/audit/types';

export interface AuditLogFilter {
  status?: AuditItemStatus | 'all';
  pattern?: AuditPatternType | 'all';
  severity?: 'critical' | 'warning' | 'info' | 'all';
}

export interface UseAuditLogReturn {
  // Data
  items: AuditItem[];
  allItems: AuditItem[];
  openCount: number;
  score: number;
  
  // State
  filter: AuditLogFilter;
  isProcessing: boolean; // ★追加: API通信中フラグ
  
  // Actions
  setFilter: (filter: AuditLogFilter) => void;
  dismiss: (itemId: string, reason: string) => Promise<void>; // ★変更: reason必須 & Async
  resolve: (itemId: string) => Promise<void>; // ★変更: Async
  reopen: (itemId: string) => void;
  updateResult: (result: AuditResult) => void;
}

/**
 * スコア計算ヘルパー (Domain層に移譲しても良い)
 * 簡易的に「未解決の重要項目」に応じて減点するロジック
 */
const calculateOptimisticScore = (items: AuditItem[]): number => {
  const totalItems = items.length;
  if (totalItems === 0) return 100;

  // 減点方式: Criticalは大きく、Warningは小さく減点
  const deduction = items.reduce((acc, item) => {
    if (item.status !== 'open') return acc;
    return acc + (item.severity === 'critical' ? 20 : 10); // 調整係数
  }, 0);

  return Math.max(0, 100 - deduction);
};

export function useAuditLog(initialResult?: AuditResult): UseAuditLogReturn {
  const [items, setItems] = useState<AuditItem[]>(initialResult?.items ?? []);
  // スコアはitemsの状態から動的に計算する (Single Source of Truth)
  // これにより、resolve/dismissした瞬間にスコアが自動的に再計算される
  const score = useMemo(() => calculateOptimisticScore(items), [items]);
  
  const [filter, setFilter] = useState<AuditLogFilter>({
    status: 'open',
    pattern: 'all',
    severity: 'all',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * フィルター適用済みの項目リスト
   */
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
      if (filter.pattern && filter.pattern !== 'all' && item.pattern !== filter.pattern) return false;
      if (filter.severity && filter.severity !== 'all' && item.severity !== filter.severity) return false;
      return true;
    });
  }, [items, filter]);

  const openCount = useMemo(() => 
    items.filter((item) => item.status === 'open').length
  , [items]);

  /**
   * 項目を却下 (Async)
   * reasonは必須 (Principles: Logic > Context)
   */
  const dismiss = useCallback(async (itemId: string, reason: string) => {
    setIsProcessing(true);
    try {
      // TODO: Phase 2 - ここでAPIをコール (await api.audit.dismiss(itemId, reason))
      // await new Promise(resolve => setTimeout(resolve, 300)); // Mock latency

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, status: 'dismissed' as const, dismissReason: reason }
            : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * 項目を解決済みにする (Async)
   */
  const resolve = useCallback(async (itemId: string) => {
    setIsProcessing(true);
    try {
      // TODO: Phase 2 - ここでAPIをコール (await api.audit.resolve(itemId))
      
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, status: 'resolved' as const, resolvedAt: new Date() }
            : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reopen = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'open' as const, resolvedAt: undefined, dismissReason: undefined }
          : item
      )
    );
  }, []);

  const updateResult = useCallback((result: AuditResult) => {
    setItems(result.items);
    // Note: scoreはitemsから自動計算されるため、明示的なsetScoreは不要
    // もしAPI側が高度なスコア計算をしている場合は、calculateOptimisticScoreを調整するか
    // APIのスコアを優先するロジックに切り替える
  }, []);

  return {
    items: filteredItems,
    allItems: items,
    openCount,
    score,
    filter,
    isProcessing,
    setFilter,
    dismiss,
    resolve,
    reopen,
    updateResult,
  };
}