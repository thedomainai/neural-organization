'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../lib/animations';

const phases = [
  {
    id: 'phase1',
    phase: 'Phase 1',
    themeJa: '覚醒',
    themeEn: 'Awakening',
    period: '0〜3ヶ月',
    trustScore: '0.2 → 0.5',
    approvalRate: '95% → 70%',
    milestone: '世界モデル初期構築・最初の自律実行',
    color: '#e06c75',
    approvalStart: 95,
    approvalEnd: 70,
  },
  {
    id: 'phase2',
    phase: 'Phase 2',
    themeJa: '共生',
    themeEn: 'Symbiosis',
    period: '3〜6ヶ月',
    trustScore: '0.5 → 0.75',
    approvalRate: '70% → 40%',
    milestone: 'パターン学習・定型推論が主力に',
    color: '#e5c07b',
    approvalStart: 70,
    approvalEnd: 40,
  },
  {
    id: 'phase3',
    phase: 'Phase 3',
    themeJa: '変態',
    themeEn: 'Metamorphosis',
    period: '6〜12ヶ月',
    trustScore: '0.75 → 0.9',
    approvalRate: '40% → 15%',
    milestone: '領域横断判断・創発的推論の拡大',
    color: '#6bb8a0',
    approvalStart: 40,
    approvalEnd: 15,
  },
  {
    id: 'phase4',
    phase: 'Phase 4',
    themeJa: '自律',
    themeEn: 'Autonomy',
    period: '12ヶ月〜',
    trustScore: '0.9+',
    approvalRate: '< 5%',
    milestone: '承認が例外・完全な組織知能',
    color: 'var(--primary-400)',
    approvalStart: 15,
    approvalEnd: 5,
  },
];

export default function PhaseTimeline() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} style={{ margin: 'var(--space-8) 0' }}>
      <style>{`
        .phase-timeline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          position: relative;
        }
        @media (max-width: 768px) {
          .phase-timeline-grid {
            grid-template-columns: 1fr;
          }
          .phase-timeline-progress-bar-horizontal {
            display: none !important;
          }
          .phase-timeline-progress-bar-vertical {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .phase-timeline-progress-bar-vertical {
            display: none !important;
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
          EVOLUTION TIMELINE
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 560, margin: '0 auto' }}>
          Trust Score の蓄積とともに、人間の承認率は95%から5%未満へ段階的に低下します。これは「放任」ではなく、信頼に裏打ちされた委譲です。
        </p>
      </div>

      {/* Horizontal progress bar (desktop) */}
      <div
        className="phase-timeline-progress-bar-horizontal"
        style={{
          maxWidth: 720,
          margin: '0 auto var(--space-5)',
          height: 4,
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(to right, #e06c75, #e5c07b, #6bb8a0, #5c81b8)',
            width: isInView ? '100%' : '0%',
            transition: 'width 1.2s cubic-bezier(0, 0, 0.2, 1) 0.4s',
          }}
        />
      </div>

      {/* Phase cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="phase-timeline-grid"
        style={{
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        {phases.map((phase, i) => (
          <motion.div
            key={phase.id}
            custom={i}
            variants={fadeIn}
            style={{
              position: 'relative',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: `3px solid ${phase.color}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {/* Phase title + theme */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: phase.color, letterSpacing: '0.03em' }}>
                  {phase.phase}
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                {phase.themeJa}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                {phase.themeEn}
              </div>
            </div>

            {/* Period */}
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: phase.color,
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                background: `color-mix(in srgb, ${phase.color} 10%, transparent)`,
                alignSelf: 'flex-start',
              }}
            >
              {phase.period}
            </div>

            {/* Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>
                  TRUST
                </span>{' '}
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{phase.trustScore}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>
                  承認率
                </span>{' '}
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{phase.approvalRate}</span>
              </div>
            </div>

            {/* Milestone */}
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 'var(--space-3)' }}>
              {phase.milestone}
            </p>

            {/* Vertical progress connector (mobile) */}
            {i < phases.length - 1 && (
              <div
                className="phase-timeline-progress-bar-vertical"
                style={{
                  position: 'absolute',
                  bottom: -17,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 14,
                  background: `linear-gradient(to bottom, ${phase.color}, ${phases[i + 1].color})`,
                  borderRadius: 'var(--radius-full)',
                  zIndex: 1,
                }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Approval rate decrease visualization */}
      <div
        style={{
          maxWidth: 720,
          margin: 'var(--space-6) auto 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            承認率の推移
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>95%</span>
            <span>→</span>
            <span>&lt; 5%</span>
          </div>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.04)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Gradient fill showing decrease */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(to right, #e06c75 0%, #e5c07b 33%, #6bb8a0 66%, #5c81b8 100%)',
              width: isInView ? '100%' : '0%',
              transition: 'width 1.4s cubic-bezier(0, 0, 0.2, 1) 0.6s',
            }}
          />
          {/* Overlay to simulate tapering (approval decreasing) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.9) 100%)',
              borderRadius: 'var(--radius-full)',
            }}
          />
        </div>
        {/* Phase markers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
          {phases.map((phase) => (
            <span
              key={phase.id}
              style={{
                fontSize: 10,
                color: phase.color,
                fontWeight: 600,
                letterSpacing: '0.03em',
                flex: 1,
                textAlign: 'center',
              }}
            >
              {phase.phase.replace('Phase ', 'P')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
