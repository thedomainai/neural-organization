/**
 * src/features/settings/components/DataEntryView.tsx
 *
 * [Feature Component]
 * データ入力画面 - KPI実績値の入力
 */

'use client';

import { type FC, useState } from 'react';
import { Database, Calendar, Save, ChevronDown, Check, AlertCircle } from 'lucide-react';
import type { KPIDefinition, KPIDataEntry } from '@/domain/settings/types';

/**
 * モックデータ: KPI定義
 */
const MOCK_KPI_DEFINITIONS: KPIDefinition[] = [
  {
    id: 'kpi-1',
    name: 'FY2025 全社売上目標',
    unit: '%',
    targetType: 'higher_is_better',
    target: 100,
    warningThreshold: 80,
    criticalThreshold: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'kpi-2',
    name: '新規受注額 (ARR)',
    unit: '%',
    targetType: 'higher_is_better',
    target: 100,
    warningThreshold: 85,
    criticalThreshold: 75,
    parentId: 'kpi-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'kpi-3',
    name: 'Enterprise Sales',
    unit: '%',
    targetType: 'higher_is_better',
    target: 100,
    warningThreshold: 80,
    criticalThreshold: 70,
    parentId: 'kpi-2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'kpi-4',
    name: 'SMB Sales',
    unit: '%',
    targetType: 'higher_is_better',
    target: 100,
    warningThreshold: 85,
    criticalThreshold: 75,
    parentId: 'kpi-2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'kpi-5',
    name: '解約率 (Churn)',
    unit: '%',
    targetType: 'lower_is_better',
    target: 1.0,
    warningThreshold: 1.5,
    criticalThreshold: 2.0,
    parentId: 'kpi-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * モックデータ: 既存の実績データ
 */
const MOCK_DATA_ENTRIES: KPIDataEntry[] = [
  { id: '1', kpiDefinitionId: 'kpi-1', period: '2025-W02', actualValue: 82, enteredAt: new Date() },
  { id: '2', kpiDefinitionId: 'kpi-2', period: '2025-W02', actualValue: 76, enteredAt: new Date() },
  { id: '3', kpiDefinitionId: 'kpi-3', period: '2025-W02', actualValue: 65, enteredAt: new Date() },
  { id: '4', kpiDefinitionId: 'kpi-4', period: '2025-W02', actualValue: 92, enteredAt: new Date() },
  { id: '5', kpiDefinitionId: 'kpi-5', period: '2025-W02', actualValue: 1.2, enteredAt: new Date() },
];

export interface DataEntryViewProps {
  className?: string;
}

export const DataEntryView: FC<DataEntryViewProps> = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-W03');
  const [dataEntries, setDataEntries] = useState<Record<string, string>>({});
  const [savedEntries, setSavedEntries] = useState<Set<string>>(new Set());

  const handleValueChange = (kpiId: string, value: string) => {
    setDataEntries((prev) => ({ ...prev, [kpiId]: value }));
    setSavedEntries((prev) => {
      const next = new Set(prev);
      next.delete(kpiId);
      return next;
    });
  };

  const handleSave = (kpiId: string) => {
    // 実際はAPIを呼び出す
    setSavedEntries((prev) => new Set(prev).add(kpiId));
  };

  const handleSaveAll = () => {
    // 実際はAPIを呼び出す
    const allIds = MOCK_KPI_DEFINITIONS.map((d) => d.id);
    setSavedEntries(new Set(allIds));
  };

  const getStatus = (kpi: KPIDefinition, value: number): 'healthy' | 'warning' | 'critical' => {
    if (kpi.targetType === 'lower_is_better') {
      if (value <= (kpi.target || 0)) return 'healthy';
      if (value <= (kpi.warningThreshold || 0)) return 'warning';
      return 'critical';
    } else {
      if (value >= (kpi.target || 0)) return 'healthy';
      if (value >= (kpi.warningThreshold || 0)) return 'warning';
      return 'critical';
    }
  };

  const getPreviousValue = (kpiId: string): number | undefined => {
    const entry = MOCK_DATA_ENTRIES.find((e) => e.kpiDefinitionId === kpiId);
    return entry?.actualValue;
  };

  return (
    <div className={`h-full flex flex-col bg-background-base ${className}`}>
      {/* Header */}
      <header className="p-6 border-b border-border-default bg-background-layer1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-accent-text" />
              <h1 className="text-2xl font-light text-foreground-primary">データ入力</h1>
            </div>
            <p className="text-foreground-muted text-sm">
              KPI実績値を入力します。入力後、自動的に曖昧性チェックが実行されます。
            </p>
          </div>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg bg-accent-primary text-foreground-inverse hover:bg-accent-hover transition-colors"
          >
            <Save size={18} />
            すべて保存
          </button>
        </div>
      </header>

      {/* Period Selector */}
      <div className="p-4 border-b border-border-default bg-background-layer2">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground-secondary">対象期間:</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2 text-sm rounded-lg bg-background-layer1 border border-border-default text-foreground-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 cursor-pointer"
            >
              <option value="2025-W03">2025年 第3週 (1/13 - 1/19)</option>
              <option value="2025-W02">2025年 第2週 (1/6 - 1/12)</option>
              <option value="2025-W01">2025年 第1週 (12/30 - 1/5)</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Data Entry Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {MOCK_KPI_DEFINITIONS.map((kpi) => {
            const currentValue = dataEntries[kpi.id];
            const previousValue = getPreviousValue(kpi.id);
            const numericValue = currentValue ? parseFloat(currentValue) : undefined;
            const status = numericValue !== undefined ? getStatus(kpi, numericValue) : undefined;
            const isSaved = savedEntries.has(kpi.id);
            const indent = kpi.parentId ? (kpi.parentId.includes('kpi-2') ? 2 : 1) : 0;

            return (
              <div
                key={kpi.id}
                className="p-4 bg-background-layer1 rounded-xl border border-border-default hover:border-border-active transition-colors"
                style={{ marginLeft: `${indent * 24}px` }}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* KPI Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground-primary truncate">{kpi.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-foreground-muted">
                      <span>目標: {kpi.target}{kpi.unit}</span>
                      {previousValue !== undefined && (
                        <span>前週: {previousValue}{kpi.unit}</span>
                      )}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={currentValue || ''}
                        onChange={(e) => handleValueChange(kpi.id, e.target.value)}
                        placeholder={previousValue?.toString() || '0'}
                        className={`w-32 px-4 py-2.5 text-right text-lg font-medium rounded-lg border-2 bg-background-base text-foreground-primary focus:outline-none focus:ring-2 transition-all ${
                          status === 'critical'
                            ? 'border-severity-critical-border focus:border-severity-critical-text focus:ring-severity-critical-border/20'
                            : status === 'warning'
                              ? 'border-severity-warning-border focus:border-severity-warning-text focus:ring-severity-warning-border/20'
                              : status === 'healthy'
                                ? 'border-severity-success-border focus:border-severity-success-text focus:ring-severity-success-border/20'
                                : 'border-border-default focus:border-accent-primary focus:ring-accent-primary/20'
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
                        {kpi.unit}
                      </span>
                    </div>

                    {/* Status Indicator */}
                    {status && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          status === 'critical'
                            ? 'bg-severity-critical-bg text-severity-critical-text'
                            : status === 'warning'
                              ? 'bg-severity-warning-bg text-severity-warning-text'
                              : 'bg-severity-success-bg text-severity-success-text'
                        }`}
                      >
                        {status === 'healthy' ? <Check size={16} /> : <AlertCircle size={16} />}
                      </div>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={() => handleSave(kpi.id)}
                      disabled={!currentValue || isSaved}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        isSaved
                          ? 'bg-severity-success-bg text-severity-success-text border-severity-success-border'
                          : currentValue
                            ? 'bg-accent-subtle text-accent-text border-accent-primary hover:bg-accent-primary hover:text-foreground-inverse'
                            : 'bg-background-layer3 text-foreground-muted border-border-default cursor-not-allowed'
                      }`}
                    >
                      {isSaved ? (
                        <span className="flex items-center gap-1">
                          <Check size={14} />
                          保存済
                        </span>
                      ) : (
                        '保存'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataEntryView;
