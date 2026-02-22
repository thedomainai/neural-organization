/**
 * src/features/editor/components/EditorView.tsx
 *
 * [Feature Component]
 * エディタビュー - Markdownエディタ + サイドパネル（Composition）
 *
 * サイドパネルは children として受け取り、AuditPanel などを
 * 外部から注入できる Composition パターンを採用。
 */

'use client';

import { type FC, type ReactNode } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

export interface EditorViewProps {
  /** ファイル名 */
  fileName: string;
  /** オーナー名 */
  owner: string;
  /** エディタコンテンツ（Markdown文字列） */
  content: string;
  /** 曖昧性パーセンテージ（0-100） */
  ambiguityPercent: number;
  /** 警告がある行番号の配列 */
  warningLines?: number[];
  /** 現在選択中の行番号 */
  selectedLine?: number | null;
  /** 行クリック時のコールバック */
  onLineClick?: (lineNumber: number) => void;
  /** Linter実行時のコールバック */
  onRunLinter?: () => void;
  /** サイドパネル（AuditPanel等）*/
  sidePanel?: ReactNode;
}

export const EditorView: FC<EditorViewProps> = ({
  fileName,
  owner,
  content,
  ambiguityPercent,
  warningLines = [],
  selectedLine = null,
  onLineClick,
  onRunLinter,
  sidePanel,
}) => {
  const warningLineSet = new Set(warningLines);

  const renderContent = () => {
    return content.split('\n').map((line, index) => {
      const lineNum = index + 1;
      const hasWarning = warningLineSet.has(lineNum);
      const isSelected = selectedLine === lineNum;

      return (
        <div
          key={index}
          className={`
            group flex font-mono text-sm leading-6 cursor-pointer
            ${hasWarning ? 'bg-severity-critical-bg' : ''}
            ${isSelected ? 'bg-severity-critical-bg ring-1 ring-severity-critical-border' : ''}
            ${!hasWarning && !isSelected ? 'hover:bg-background-layer3' : ''}
          `}
          onClick={() => onLineClick?.(lineNum)}
        >
          <span className="w-8 text-right mr-4 select-none text-foreground-muted">
            {lineNum}
          </span>
          <span
            className={`
              flex-1
              ${hasWarning ? 'underline decoration-severity-critical-text/50 decoration-wavy underline-offset-4 text-foreground-primary' : 'text-foreground-secondary'}
              ${line.startsWith('#') ? 'font-bold text-accent-text' : ''}
            `}
          >
            {line || '\u00A0'}
          </span>
          {hasWarning && (
            <span className="ml-auto mr-2 opacity-0 group-hover:opacity-100 text-severity-critical-text">
              <AlertTriangle size={14} />
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border-default flex items-center justify-between px-6 bg-background-layer2">
        <div className="flex items-center">
          <FileText className="text-foreground-muted mr-2" size={18} />
          <span className="text-foreground-primary font-mono text-sm">
            {fileName}
          </span>
          <span className="mx-2 text-foreground-muted">/</span>
          <span className="text-foreground-muted text-xs">{owner}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-24 bg-background-layer3 rounded-full overflow-hidden">
              <div
                className="h-full bg-severity-critical-text"
                style={{ width: `${ambiguityPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-severity-critical-text">
              AMBIGUITY: {ambiguityPercent}%
            </span>
          </div>
          <button
            onClick={onRunLinter}
            className="px-4 py-1.5 text-xs font-mono border rounded transition-colors bg-accent-subtle text-accent-text border-accent-primary/50 hover:bg-accent-primary/20"
          >
            RUN_LINTER
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 bg-background-layer1 overflow-y-auto p-6">
          {renderContent()}
        </div>

        {/* Side Panel (Composition Slot) */}
        {sidePanel && (
          <div className="w-96 border-l border-border-default flex flex-col">
            {sidePanel}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorView;
