'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { glossary } from '../data/glossary';
import styles from './GlossaryTooltip.module.css';

interface GlossaryTooltipProps {
  term: keyof typeof glossary;
  children: React.ReactNode;
}

/**
 * 用語説明ツールチップ
 *
 * Radix UI Tooltip で専門用語の定義を表示する。
 * ホバーまたはフォーカスで表示され、アクセシビリティに配慮している。
 */
export default function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const entry = glossary[term];

  if (!entry) {
    // 用語が辞書にない場合は通常のテキストとして表示
    return <>{children}</>;
  }

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={styles.trigger}>{children}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.content} sideOffset={5}>
            <div className={styles.term}>{entry.term}</div>
            <div className={styles.definition}>{entry.definition}</div>
            {entry.category && (
              <div className={styles.category}>
                {entry.category}
              </div>
            )}
            <Tooltip.Arrow className={styles.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
