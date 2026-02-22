/**
 * src/features/settings/components/SettingsView.tsx
 *
 * [Feature Component]
 * 設定画面 - KPI定義・オーナー管理
 */

'use client';

import { type FC, useState } from 'react';
import { Settings, Plus, Edit2, Trash2, ChevronRight, Users, Target } from 'lucide-react';
import type { KPIDefinition, Owner } from '@/domain/settings/types';

/**
 * モックデータ: KPI定義
 */
const MOCK_KPI_DEFINITIONS: KPIDefinition[] = [
  {
    id: 'kpi-1',
    name: 'FY2025 全社売上目標',
    description: '年間売上の達成率',
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
    description: '新規顧客からの年間経常収益',
    unit: '%',
    targetType: 'higher_is_better',
    target: 100,
    warningThreshold: 85,
    criticalThreshold: 75,
    parentId: 'kpi-1',
    ownerId: 'owner-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'kpi-3',
    name: '解約率 (Churn)',
    description: '月次解約率',
    unit: '%',
    targetType: 'lower_is_better',
    target: 1.0,
    warningThreshold: 1.5,
    criticalThreshold: 2.0,
    parentId: 'kpi-1',
    ownerId: 'owner-2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * モックデータ: オーナー
 */
const MOCK_OWNERS: Owner[] = [
  { id: 'owner-1', name: 'VP of Sales', email: 'sales@example.com', role: 'Vice President', department: 'Sales' },
  { id: 'owner-2', name: 'VP of CS', email: 'cs@example.com', role: 'Vice President', department: 'Customer Success' },
  { id: 'owner-3', name: 'M. Tanaka', email: 'tanaka@example.com', role: 'Manager', department: 'Enterprise Sales' },
];

export interface SettingsViewProps {
  className?: string;
}

type SettingsTab = 'kpi' | 'owners';

export const SettingsView: FC<SettingsViewProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('kpi');
  const [kpiDefinitions] = useState<KPIDefinition[]>(MOCK_KPI_DEFINITIONS);
  const [owners] = useState<Owner[]>(MOCK_OWNERS);

  return (
    <div className={`h-full flex flex-col bg-background-base ${className}`}>
      {/* Header */}
      <header className="p-6 border-b border-border-default bg-background-layer1">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-accent-text" />
          <h1 className="text-2xl font-light text-foreground-primary">設定</h1>
        </div>
        <p className="text-foreground-muted text-sm">
          KPI定義、オーナー、閾値などのマスタデータを管理します
        </p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border-default bg-background-layer1">
        <TabButton
          active={activeTab === 'kpi'}
          onClick={() => setActiveTab('kpi')}
          icon={<Target size={18} />}
        >
          KPI定義
        </TabButton>
        <TabButton
          active={activeTab === 'owners'}
          onClick={() => setActiveTab('owners')}
          icon={<Users size={18} />}
        >
          オーナー管理
        </TabButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'kpi' ? (
          <KPIDefinitionList definitions={kpiDefinitions} owners={owners} />
        ) : (
          <OwnerList owners={owners} />
        )}
      </div>
    </div>
  );
};

/**
 * タブボタン
 */
const TabButton: FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-accent-primary text-accent-text'
        : 'border-transparent text-foreground-muted hover:text-foreground-primary'
    }`}
  >
    {icon}
    {children}
  </button>
);

/**
 * KPI定義リスト
 */
const KPIDefinitionList: FC<{
  definitions: KPIDefinition[];
  owners: Owner[];
}> = ({ definitions, owners }) => {
  const getOwnerName = (ownerId?: string) => {
    if (!ownerId) return '-';
    const owner = owners.find((o) => o.id === ownerId);
    return owner?.name || '-';
  };

  const rootKpis = definitions.filter((d) => !d.parentId);
  const getChildren = (parentId: string) => definitions.filter((d) => d.parentId === parentId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-foreground-primary">KPI定義一覧</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent-primary text-foreground-inverse hover:bg-accent-hover transition-colors">
          <Plus size={16} />
          新規KPIを追加
        </button>
      </div>

      {/* Table */}
      <div className="bg-background-layer1 rounded-xl border border-border-default overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default bg-background-layer2">
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                KPI名
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                単位
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                目標
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                警告閾値
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                責任者
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-foreground-muted uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {rootKpis.map((kpi) => (
              <KPIRow
                key={kpi.id}
                kpi={kpi}
                children={getChildren(kpi.id)}
                getOwnerName={getOwnerName}
                level={0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * KPI行コンポーネント（再帰的）
 */
const KPIRow: FC<{
  kpi: KPIDefinition;
  children: KPIDefinition[];
  getOwnerName: (id?: string) => string;
  level: number;
}> = ({ kpi, children, getOwnerName, level }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <tr className="hover:bg-background-layer2 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {children.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-0.5 hover:bg-background-layer3 rounded transition-colors"
              >
                <ChevronRight
                  size={16}
                  className={`text-foreground-muted transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              </button>
            )}
            {children.length === 0 && <span className="w-5" />}
            <div>
              <p className="text-sm font-medium text-foreground-primary">{kpi.name}</p>
              {kpi.description && (
                <p className="text-xs text-foreground-muted">{kpi.description}</p>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-foreground-secondary">{kpi.unit}</td>
        <td className="px-4 py-3 text-sm text-foreground-secondary">
          {kpi.target !== undefined ? `${kpi.target}${kpi.unit}` : '-'}
        </td>
        <td className="px-4 py-3 text-sm text-foreground-secondary">
          {kpi.warningThreshold !== undefined ? `${kpi.warningThreshold}${kpi.unit}` : '-'}
        </td>
        <td className="px-4 py-3 text-sm text-foreground-secondary">{getOwnerName(kpi.ownerId)}</td>
        <td className="px-4 py-3 text-right">
          <div className="flex justify-end gap-2">
            <button className="p-1.5 text-foreground-muted hover:text-accent-text hover:bg-background-layer3 rounded transition-colors">
              <Edit2 size={14} />
            </button>
            <button className="p-1.5 text-foreground-muted hover:text-severity-critical-text hover:bg-severity-critical-bg rounded transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
      {expanded &&
        children.map((child) => (
          <KPIRow
            key={child.id}
            kpi={child}
            children={[]}
            getOwnerName={getOwnerName}
            level={level + 1}
          />
        ))}
    </>
  );
};

/**
 * オーナーリスト
 */
const OwnerList: FC<{ owners: Owner[] }> = ({ owners }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-foreground-primary">オーナー一覧</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent-primary text-foreground-inverse hover:bg-accent-hover transition-colors">
          <Plus size={16} />
          オーナーを追加
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {owners.map((owner) => (
          <div
            key={owner.id}
            className="p-4 bg-background-layer1 rounded-xl border border-border-default hover:border-border-active transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center text-accent-text font-medium">
                {owner.name.charAt(0)}
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-foreground-muted hover:text-accent-text hover:bg-background-layer3 rounded transition-colors">
                  <Edit2 size={14} />
                </button>
                <button className="p-1.5 text-foreground-muted hover:text-severity-critical-text hover:bg-severity-critical-bg rounded transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-medium text-foreground-primary mb-1">{owner.name}</h3>
            {owner.role && (
              <p className="text-sm text-foreground-secondary">{owner.role}</p>
            )}
            {owner.department && (
              <p className="text-xs text-foreground-muted mt-1">{owner.department}</p>
            )}
            {owner.email && (
              <p className="text-xs text-accent-text mt-2">{owner.email}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsView;
