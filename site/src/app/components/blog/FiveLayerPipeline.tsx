'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer, pipelineLayer } from '../../lib/animations';

const layers = [
  {
    id: 'l0',
    number: 'L0',
    nameJa: '知覚',
    nameEn: 'Perception',
    color: '#e06c75',
    input: '外部データストリーム',
    output: '正規化された知覚データ',
  },
  {
    id: 'l1',
    number: 'L1',
    nameJa: '理解',
    nameEn: 'Understanding',
    color: '#e5c07b',
    input: '知覚データ',
    output: '世界モデル（エンティティ・因果・予測・反実仮想）',
  },
  {
    id: 'l2',
    number: 'L2',
    nameJa: '推論',
    nameEn: 'Reasoning',
    color: 'var(--primary-400)',
    input: '世界モデル + Intent',
    output: '提案・判断・計画',
  },
  {
    id: 'l3',
    number: 'L3',
    nameJa: '実行',
    nameEn: 'Execution',
    color: 'var(--glow-400)',
    input: '承認された計画',
    output: '実行結果 + 品質検証',
  },
  {
    id: 'l4',
    number: 'L4',
    nameJa: '内省',
    nameEn: 'Reflection',
    color: '#6bb8a0',
    input: '実行トレース + 人間フィードバック',
    output: 'パターン・改善提案',
  },
];

const crossCuttingElements = [
  {
    id: 'purpose',
    nameJa: '目的',
    nameEn: 'Purpose',
    color: 'var(--primary-400)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 2L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 19L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 12L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 12L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 8L14 12L12 16L10 12L12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'governance',
    nameJa: '統治',
    nameEn: 'Governance',
    color: '#e5c07b',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L20 8V14C20 18.4183 16.4183 22 12 22C7.58172 22 4 18.4183 4 14V8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'memory',
    nameJa: '記憶',
    nameEn: 'Memory',
    color: '#6bb8a0',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 6V12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12V6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 12V18C4 19.6569 7.58172 21 12 21C16.4183 21 20 19.6569 20 18V12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'orchestration',
    nameJa: '統合',
    nameEn: 'Orchestration',
    color: 'var(--glow-400)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 15V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.63604 5.63604L9.87868 9.87868" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.1213 14.1213L18.364 18.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.63604 18.364L9.87868 14.1213" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14.1213 9.87868L18.364 5.63604" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function FiveLayerPipeline() {
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
          5-LAYER COGNITIVE PIPELINE
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 560, margin: '0 auto' }}>
          5つのレイヤーが「知覚→理解→推論→実行→内省」の認知サイクルを形成し、4つの横断的要素が全体を貫いています。
        </p>
      </div>

      {/* Pipeline layers - vertical stack */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          position: 'relative',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        {layers.map((layer, i) => (
          <div key={layer.id}>
            {/* Layer card */}
            <motion.div
              custom={i}
              variants={pipelineLayer}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              {/* Left color bar */}
              <div
                style={{
                  width: 4,
                  flexShrink: 0,
                  background: layer.color,
                }}
              />

              {/* Content */}
              <div style={{ flex: 1, padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                {/* Layer number badge */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `color-mix(in srgb, ${layer.color} 15%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${layer.color} 30%, transparent)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: layer.color,
                    flexShrink: 0,
                    letterSpacing: '0.02em',
                  }}
                >
                  {layer.number}
                </div>

                {/* Layer info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {layer.nameJa}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8, letterSpacing: '0.03em' }}>
                      {layer.nameEn}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>IN</span>{' '}
                    <span>{layer.input}</span>
                    <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>→</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>OUT</span>{' '}
                    <span>{layer.output}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Connector arrow between layers (not after L4) */}
            {i < layers.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '4px 0',
                }}
              >
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path
                    d="M8 0V14"
                    stroke="var(--text-muted)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 12L8 18L12 12"
                    stroke="var(--text-muted)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Feedback return arrow (right side, L4 → L0) */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: 20,
            bottom: 20,
            width: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="32"
            height="100%"
            viewBox="0 0 32 200"
            preserveAspectRatio="none"
            fill="none"
            style={{ height: '100%' }}
          >
            <path
              d="M4 190C4 190 20 190 20 170V30C20 10 4 10 4 10"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Upward arrow head */}
            <path
              d="M0 16L4 6L8 16"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}
          >
            フィードバック
          </div>
        </div>
      </motion.div>

      {/* Cross-cutting elements label */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 'var(--space-7)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}
        >
          <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.12)' }} />
          横断的要素 — 全レイヤーに作用
          <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
      </div>

      {/* Cross-cutting elements - horizontal row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-3)',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        {crossCuttingElements.map((el, i) => (
          <motion.div
            key={el.id}
            custom={i + 5}
            variants={fadeIn}
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: `2px solid ${el.color}`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ color: el.color }}>{el.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {el.nameJa}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
              {el.nameEn}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
