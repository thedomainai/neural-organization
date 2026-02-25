'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../lib/animations';

const forms = [
  {
    id: 'governor',
    title: 'Governor',
    titleJa: '統治者',
    question: 'WHY — なぜ存在するか',
    desc: '組織の存在理由・方向・価値観を定義する。AIは知能を持つが意志を持たない。',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M8 28V24C8 20.6863 10.6863 18 14 18H18C21.3137 18 24 20.6863 24 24V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 4L18 7H14L16 4Z" fill="currentColor" />
      </svg>
    ),
    color: 'var(--primary-400)',
  },
  {
    id: 'sensemaker',
    title: 'Sensemaker',
    titleJa: '意味付与者',
    question: 'WHAT IS — 何が起きているか',
    desc: 'データが捉えられない質的現実を感じ取り、システムに翻訳する。',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M16 2V6M16 26V30M2 16H6M26 16H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    color: 'var(--secondary-400)',
  },
  {
    id: 'creator',
    title: 'Creator',
    titleJa: '創造者',
    question: 'WHAT IF — 何が可能か',
    desc: 'まだ存在しない未来を構想する。AIはパターンを見出すが、前例のないビジョンは人間から生まれる。',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L20 12L28 14L22 20L24 28L16 24L8 28L10 20L4 14L12 12L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    color: 'var(--glow-400)',
  },
  {
    id: 'connector',
    title: 'Connector',
    titleJa: '接続者',
    question: 'WHO — 誰とつながるか',
    desc: '人間同士の信頼・共感・関係性を構築する。人と人の間に流れるものはAIでは代替できない。',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="10" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="22" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 28V24C4 21.79 5.79 20 8 20H12C14.21 20 16 21.79 16 24V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 28V24C16 21.79 17.79 20 20 20H24C26.21 20 28 21.79 28 24V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 14L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>
    ),
    color: '#6bb8a0',
  },
  {
    id: 'custodian',
    title: 'Custodian',
    titleJa: '守護者',
    question: 'MUST NOT — 何を守るか',
    desc: '組織の倫理・価値観の番人。AIが効率を追求するとき、大切なものを毀損していないかを監視する。',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L26 10V18C26 23.5228 21.5228 28 16 28C10.4772 28 6 23.5228 6 18V10L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 16L15 19L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: '#c4a05c',
  },
];

export default function ParticipationForms() {
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
          5 HUMAN PARTICIPATION FORMS
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 560, margin: '0 auto' }}>
          AIにはできない5つの能力軸で、組織における人間の関与形態を網羅しています。
          各形態は「人間固有の問い」に対応しています。
        </p>
      </div>

      {/* Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {forms.map((form, i) => (
          <motion.div
            key={form.id}
            custom={i}
            variants={fadeIn}
            style={{
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: `3px solid ${form.color}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ color: form.color }}>{form.icon}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                {form.titleJa}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
                {form.title}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: form.color,
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: `color-mix(in srgb, ${form.color} 10%, transparent)`,
                alignSelf: 'flex-start',
              }}
            >
              {form.question}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              {form.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Coverage explanation */}
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
        <strong style={{ color: 'var(--text-primary)' }}>なぜこの5つで網羅できるのか</strong>
        <br />
        組織活動は「目的の定義 → 現実の認識 → 未来の構想 → 関係の構築 → 倫理の保全」という
        連鎖で成り立ちます。この5つの問い（WHY / WHAT IS / WHAT IF / WHO / MUST NOT）は
        人間の認知・創造・社会的能力の全域をカバーしており、いずれもAIが原理的に代替できない領域です。
      </div>
    </div>
  );
}
