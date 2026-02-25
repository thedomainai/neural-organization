'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../lib/animations';

const modes = [
  {
    id: 'routine',
    title: '定型的推論',
    subtitle: 'Routine',
    system: 'System 1 (Kahneman)',
    description:
      'パターンマッチングによる高速な判断。蓄積されたルールとテンプレートを適用する。',
    trigger: 'Trust Score が閾値以上 + 類似パターンが存在',
    speed: 'ミリ秒〜秒',
    examples: ['月次レポートの生成', '定型メール応答', '在庫アラート'],
    color: 'var(--primary-400)',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'emergent',
    title: '創発的推論',
    subtitle: 'Emergent',
    system: 'System 2 (Kahneman)',
    description:
      '複数領域の知識を統合した深い推論。前例のない状況に対応する。',
    trigger: '既知パターンに該当しない + 複数領域にまたがる',
    speed: '分〜時間',
    examples: [
      '新市場参入の提案',
      '組織再編の影響分析',
      '競合戦略の仮説構築',
    ],
    color: '#c4a05c',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M7 13c-2.5 1.5-4 4-4 7h18c0-3-1.5-5.5-4-7" />
        <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="8" r="1" fill="currentColor" stroke="none" />
        <line x1="8" y1="7" x2="12" y2="6" />
        <line x1="12" y1="6" x2="15" y2="8" />
        <line x1="8" y1="7" x2="15" y2="8" />
      </svg>
    ),
  },
];

export default function DualReasoningModes() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} style={{ margin: 'var(--space-8) 0' }}>
      <style>{`
        .dual-reasoning-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-5);
        }
        @media (max-width: 768px) {
          .dual-reasoning-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(80, 104, 164, 0.15)',
            border: '1px solid rgba(80, 104, 164, 0.3)',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: 'var(--primary-400)',
            marginBottom: 'var(--space-4)',
          }}
        >
          DUAL REASONING MODES
        </div>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          状況に応じて2つの推論モードを自動的に切り替えます。人間の認知システムと同じ二重過程を組織レベルで実現します。
        </p>
      </div>

      {/* Two-column cards */}
      <motion.div
        className="dual-reasoning-grid"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {modes.map((mode, i) => (
          <motion.div
            key={mode.id}
            custom={i}
            variants={fadeIn}
            style={{
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: `3px solid ${mode.color}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            {/* Title row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              <div
                style={{
                  color: mode.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: `color-mix(in srgb, ${mode.color} 10%, transparent)`,
                  flexShrink: 0,
                }}
              >
                {mode.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {mode.title}{' '}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      color: 'var(--text-muted)',
                    }}
                  >
                    / {mode.subtitle}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: mode.color,
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                  }}
                >
                  {mode.system}
                </div>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              {mode.description}
            </p>

            {/* Metadata */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  発動条件:
                </span>{' '}
                {mode.trigger}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  処理速度:
                </span>{' '}
                {mode.speed}
              </div>
            </div>

            {/* Examples */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                例:
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {mode.examples.map((ex) => (
                  <li
                    key={ex}
                    style={{
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Connecting insight box */}
      <div
        style={{
          marginTop: 'var(--space-5)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(80, 104, 164, 0.08)',
          border: '1px solid rgba(80, 104, 164, 0.15)',
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
        }}
      >
        Kahneman (2011) の二重過程理論と Evans {'&'} Stanovich (2013)
        のデフォルト介入主義モデルに基づく設計です。Trust Score
        が高まるにつれて、定型的推論の範囲が拡大し、人間は創発的推論に注力できるようになります。
      </div>
    </div>
  );
}
