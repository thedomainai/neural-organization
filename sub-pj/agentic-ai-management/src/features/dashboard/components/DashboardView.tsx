/**
 * src/features/dashboard/components/DashboardView.tsx
 *
 * [Feature Component]
 * ダッシュボードビュー - KPI Logic Tree と Anomalies を表示
 */

'use client';

import { type FC } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import { TreeNode } from './TreeNode';
import type { KPITreeNode } from '@/domain/kpi/types';
import type { ViewType } from '@/shared/components';

export interface DashboardViewProps {
  kpiData: KPITreeNode;
  onNavigate: (view: ViewType) => void;
}

export const DashboardView: FC<DashboardViewProps> = ({
  kpiData,
  onNavigate,
}) => {
  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-light text-foreground-primary mb-1 flex items-center">
          <Activity className="mr-3 text-accent-text" />
          System Observability
        </h2>
        <p className="text-foreground-muted text-sm font-mono">
          STATUS: <span className="text-severity-warning-text">DEGRADED</span> | AMBIGUITY
          LEVEL: HIGH
        </p>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* KPI Logic Tree */}
        <div className="col-span-8 bg-background-layer2 border border-border-default rounded-lg p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-subtle">
            <h3 className="text-sm font-mono text-foreground-secondary">
              LOGIC TREE VIEW
            </h3>
            <div className="flex space-x-2 items-center">
              <span className="w-2 h-2 rounded-full bg-severity-critical-text" />
              <span className="text-[10px] text-foreground-muted">CRITICAL</span>
            </div>
          </div>
          <TreeNode
            data={kpiData}
            onSelect={(node) => {
              if (node.isTarget) onNavigate('editor');
            }}
          />
        </div>

        {/* Alerts & Insights */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-background-layer2 border border-border-default rounded-lg p-4 flex-1">
            <h3 className="text-sm font-mono text-foreground-secondary mb-4">
              CRITICAL ANOMALIES
            </h3>
            <div className="space-y-3">
              {/* Critical Alert */}
              <div
                className="p-3 rounded-lg cursor-pointer transition-colors group bg-severity-critical-bg border border-severity-critical-border hover:shadow-sm"
                onClick={() => onNavigate('editor')}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono text-severity-critical-text">
                    VP of Sales / Ent Sales
                  </span>
                  <ArrowRight className="w-3 h-3 text-severity-critical-text opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-foreground-primary mb-2">
                  売上見込みの根拠において、事実と解釈の混同率が45%を超えています。
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-severity-critical-border text-severity-critical-text px-1.5 py-0.5 rounded font-medium">
                    FACT_MIXING
                  </span>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="p-3 rounded-lg bg-severity-warning-bg border border-severity-warning-border">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono text-severity-warning-text">
                    PdM Group / Product Quality
                  </span>
                </div>
                <p className="text-sm text-foreground-primary mb-2">
                  品質報告に数値データが欠落しています。
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-severity-warning-border text-severity-warning-text px-1.5 py-0.5 rounded font-medium">
                    DATA_MISSING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
