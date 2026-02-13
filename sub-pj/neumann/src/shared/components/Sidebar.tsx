/**
 * src/shared/components/Sidebar.tsx
 *
 * [Shared Component]
 * サイドバーナビゲーション
 */

'use client';

import { type FC } from 'react';
import { Layout, FileText, Database, Settings, Cpu } from 'lucide-react';

export type ViewType = 'dashboard' | 'editor' | 'data-entry' | 'settings';

export interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Sidebar: FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="w-16 flex flex-col items-center py-6 bg-sidebar-bg">
      {/* Logo */}
      <div className="mb-8">
        <Cpu className="w-8 h-8 text-sidebar-textActive" strokeWidth={1.5} />
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col space-y-2 w-full px-2">
        <NavButton
          icon={<Layout size={20} />}
          active={currentView === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
          tooltip="ダッシュボード"
        />
        <NavButton
          icon={<FileText size={20} />}
          active={currentView === 'editor'}
          onClick={() => onNavigate('editor')}
          tooltip="レポート確認"
        />
        <NavButton
          icon={<Database size={20} />}
          active={currentView === 'data-entry'}
          onClick={() => onNavigate('data-entry')}
          tooltip="データ入力"
        />
        <NavButton
          icon={<Settings size={20} />}
          active={currentView === 'settings'}
          onClick={() => onNavigate('settings')}
          tooltip="設定"
        />
      </div>

      {/* User Avatar */}
      <div className="mt-auto">
        <div className="w-8 h-8 rounded-full bg-sidebar-active flex items-center justify-center text-xs font-mono text-sidebar-textActive">
          N
        </div>
      </div>
    </nav>
  );
};

const NavButton: FC<{
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}> = ({ icon, active, onClick, disabled, tooltip }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`w-full p-3 flex justify-center rounded-lg transition-all ${
        active
          ? 'text-sidebar-textActive bg-sidebar-active'
          : 'text-sidebar-text hover:text-sidebar-textActive hover:bg-sidebar-hover'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {icon}
    </button>
  );
};

export default Sidebar;
