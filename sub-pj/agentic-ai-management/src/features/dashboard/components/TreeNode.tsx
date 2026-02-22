/**
 * src/features/dashboard/components/TreeNode.tsx
 *
 * [Feature Component]
 * KPIツリーノード - 階層的なKPI構造を表示
 */

'use client';

import { type FC, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { KPITreeNode as KPITreeNodeType } from '@/domain/kpi/types';

export interface TreeNodeProps {
  data: KPITreeNodeType;
  level?: number;
  onSelect: (node: KPITreeNodeType) => void;
}

const BORDER_COLORS: Record<KPITreeNodeType['status'], string> = {
  critical: 'border-l-severity-critical-text',
  warning: 'border-l-severity-warning-text',
  healthy: 'border-l-severity-success-text',
};

const VALUE_COLORS: Record<KPITreeNodeType['status'], string> = {
  critical: 'text-severity-critical-text',
  warning: 'text-severity-warning-text',
  healthy: 'text-severity-success-text',
};

export const TreeNode: FC<TreeNodeProps> = ({ data, level = 0, onSelect }) => {
  const [expanded, setExpanded] = useState(true);

  const borderClass = BORDER_COLORS[data.status];
  const valueClass = VALUE_COLORS[data.status];

  return (
    <div className="ml-4">
      <div
        className={`
          flex items-center py-2 px-3 mb-1 rounded cursor-pointer transition-all
          ${data.isTarget ? 'bg-background-layer3 border border-border-default' : 'hover:bg-background-layer3'}
          border-l-2 ${borderClass}
        `}
        onClick={() => onSelect(data)}
      >
        {/* Expand/Collapse Toggle */}
        <div
          className="mr-2 text-foreground-muted hover:text-foreground-primary"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {data.children ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="w-[14px]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm font-medium text-foreground-primary">
              {data.label}
            </span>
            <span className={`font-mono text-xs ${valueClass}`}>
              {data.value}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-foreground-muted">{data.owner}</span>
            {data.ambiguityScore > 10 && (
              <span className="text-[10px] text-severity-warning-text font-mono bg-severity-warning-bg border border-severity-warning-border px-1.5 py-0.5 rounded">
                AMB_SCORE: {data.ambiguityScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {expanded && data.children && (
        <div className="border-l border-border-subtle ml-2 pl-2">
          {data.children.map((child) => (
            <TreeNode
              key={child.id}
              data={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
