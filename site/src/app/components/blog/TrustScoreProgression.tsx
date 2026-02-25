'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../lib/animations';

const stages = [
  {
    id: 'cold-start',
    name: 'Cold Start',
    nameJa: '冷間起動',
    scoreRange: '0.0 - 0.2',
    scoreWidth: 20, // percentage of bar
    approval: '100%',
    autonomy: 'すべて承認必要',
    period: '導入直後',
    color: '#e06c75',
  },
  {
    id: 'learning',
    name: 'Learning',
    nameJa: '学習期',
    scoreRange: '0.2 - 0.5',
    scoreWidth: 30,
    approval: '95→70%',
    autonomy: '定型タスクのみ自律',
    period: '1〜3ヶ月',
    color: '#e5c07b',
  },
  {
    id: 'trusted',
    name: 'Trusted',
    nameJa: '信頼期',
    scoreRange: '0.5 - 0.8',
    scoreWidth: 30,
    approval: '70→30%',
    autonomy: '定型タスク+一部創発',
    period: '3〜9ヶ月',
    color: '#6bb8a0',
  },
  {
    id: 'highly-trusted',
    name: 'Highly Trusted',
    nameJa: '高信頼期',
    scoreRange: '0.8 - 1.0',
    scoreWidth: 20,
    approval: '<15%',
    autonomy: 'ほぼ全領域',
    period: '9ヶ月〜',
    color: 'var(--primary-400)',
  },
];

export default function TrustScoreProgression() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} style={{ margin: 'var(--space-8) 0' }}>
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
          TRUST SCORE PROGRESSION
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 560, margin: '0 auto' }}>
          Trust Score は0.0から1.0まで段階的に上昇し、各段階でAIに委譲される自律範囲が拡大します。
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Progress bar */}
        <motion.div
          variants={fadeIn}
          custom={0}
          style={{
            display: 'flex',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            height: 8,
            marginBottom: 'var(--space-6)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          {stages.map((stage) => (
            <div
              key={stage.id}
              style={{
                width: `${stage.scoreWidth}%`,
                background: stage.color,
                opacity: 0.85,
              }}
            />
          ))}
        </motion.div>

        {/* Stage cards */}
        <div
          data-trust-grid=""
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-4)',
          }}
        >
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              custom={i + 1}
              variants={fadeIn}
              style={{
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: `3px solid ${stage.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              {/* Stage name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: stage.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {stage.nameJa}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
                    {stage.name}
                  </div>
                </div>
              </div>

              {/* Score range */}
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: stage.color,
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '-0.02em',
                }}
              >
                {stage.scoreRange}
              </div>

              {/* Approval rate */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>承認率</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {stage.approval}
                  </div>
                </div>
              </div>

              {/* Autonomy */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                </svg>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>自律範囲</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {stage.autonomy}
                  </div>
                </div>
              </div>

              {/* Period */}
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 'auto' }}>
                {stage.period}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Responsive: 2x2 grid on mobile via inline style workaround */}
        <style>{`
          @media (max-width: 768px) {
            [data-trust-grid] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 480px) {
            [data-trust-grid] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </motion.div>

      {/* Insight box */}
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
        <strong style={{ color: 'var(--text-primary)' }}>段階的信頼の蓄積</strong>
        <br />
        信頼は段階的に蓄積されます。一足飛びの委譲はなく、Mayer et al. (1995)
        の統合的信頼モデルに基づく Ability &rarr; Benevolence &rarr; Integrity
        の3軸で信頼度が計測されます。
      </div>
    </div>
  );
}
