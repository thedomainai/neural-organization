'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../lib/animations';

const pairs = [
  {
    category: 'コミュニケーション',
    categoryEn: 'Communication',
    items: [
      {
        title: 'Intent over Instruction',
        titleJa: '指示ではなく意志を',
        old: '「顧客Xにメールを送って」',
        neural: '「顧客の成功を最優先にする」',
        desc: '人間はWHATを指示するのではなく、WHYを伝える。具体的アクションはシステムが文脈に応じて導出する。',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        title: 'Governance, not Control',
        titleJa: '制御ではなく統治を',
        old: '全タスクを逐一承認',
        neural: '判断の枠組みと境界線を設定',
        desc: '信頼が蓄積されるにつれてAIの自律範囲が段階的に拡大する。立憲的統治モデル。',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 9H21M9 9V21" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
    ],
  },
  {
    category: '体験',
    categoryEn: 'Experience',
    items: [
      {
        title: 'Ambient Presence',
        titleJa: '環境として常に存在',
        old: 'ログインしてプロンプトを入力',
        neural: '空気のように常にそこにいる',
        desc: '「ツールを使う」体験ではなく、必要なときに必要な形で現れるシステム。',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
          </svg>
        ),
      },
      {
        title: 'Radical Transparency',
        titleJa: '徹底的な透明性',
        old: 'AIの判断はブラックボックス',
        neural: 'あらゆる推論と根拠が確認可能',
        desc: 'なぜその提案をしたのか、どのデータに基づいたのか。透明性なくして信頼は築けない。',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  {
    category: '進化',
    categoryEn: 'Evolution',
    items: [
      {
        title: 'Agency Preservation',
        titleJa: '人間の主体性を保全',
        old: 'システム依存で人間がdeskilling',
        neural: 'システム停止時も組織は機能し続ける',
        desc: '人間がいつでも判断を覆せる設計。AI停止時も手動で業務継続可能。',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L17 8H14V14H10V8H7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M5 18H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 21H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        title: 'Mutual Evolution',
        titleJa: '人間とシステムの相互進化',
        old: '導入時の設定が固定される',
        neural: '双方向の進化サイクルが知能を向上',
        desc: '人間が意志を注入し、システムが洞察を返す。時間とともに両者が高め合う。',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M17 3L21 7L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 13L3 17L7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 17H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
];

const categoryColors: Record<string, string> = {
  'コミュニケーション': 'var(--primary-400)',
  '体験': 'var(--glow-400)',
  '進化': '#6bb8a0',
};

export default function DesignPrinciples() {
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
          6 DESIGN PRINCIPLES
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 560, margin: '0 auto' }}>
          6つの設計原理は3つの対（コミュニケーション・体験・進化）で構成されます。
          それぞれが「従来の組織」から「Neural Organization」への本質的な転換を表しています。
        </p>
      </div>

      {/* Paired principles */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
      >
        {pairs.map((pair, pairIdx) => {
          const color = categoryColors[pair.category] ?? 'var(--primary-400)';
          return (
            <motion.div
              key={pair.category}
              custom={pairIdx}
              variants={fadeIn}
              style={{
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              {/* Category label */}
              <div
                style={{
                  padding: '10px var(--space-5)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, color }}>
                  {pair.category}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  {pair.categoryEn}
                </span>
              </div>

              {/* Two principles side by side */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 0,
                }}
              >
                {pair.items.map((item, itemIdx) => (
                  <div
                    key={item.title}
                    style={{
                      padding: 'var(--space-5)',
                      borderRight: itemIdx === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                  >
                    {/* Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <div style={{ color }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.titleJa}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {item.title}
                        </div>
                      </div>
                    </div>

                    {/* Old vs New */}
                    <div style={{ marginBottom: 'var(--space-3)', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>従来</span>
                        <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>{item.old}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color, fontSize: 10, fontWeight: 600 }}>NO</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.neural}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
