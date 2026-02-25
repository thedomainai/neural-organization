'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../lib/animations';

const levels = [
  {
    id: 'alert',
    level: 'ALERT',
    name: '警報',
    example: '「主要顧客Xの解約リスクが80%を超えました」',
    cost: '即座に対応（~30分）',
    notification: 'プッシュ通知',
    color: '#e06c75',
    barWidth: '100%',
    borderWidth: 4,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'governance',
    level: 'GOVERNANCE',
    name: '統治判断',
    example: '「新規事業Yへの参入を推薦します。承認しますか？」',
    cost: '判断に10〜15分',
    notification: 'Slackダイレクト',
    color: '#e5c07b',
    barWidth: '85%',
    borderWidth: 3,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'insight',
    level: 'INSIGHT',
    name: '洞察',
    example: '「過去3ヶ月でCS対応パターンに変化が見られます」',
    cost: '確認に5分',
    notification: 'チャネル投稿',
    color: 'var(--primary-400)',
    barWidth: '65%',
    borderWidth: 2,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'decision',
    level: 'DECISION',
    name: '意思決定記録',
    example: '「施策Zを実行しました（Trust Score 0.85で自律判断）」',
    cost: '確認に1〜2分',
    notification: 'ログ記録',
    color: '#6bb8a0',
    barWidth: '45%',
    borderWidth: 2,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
        <path d="M14 2v6h6M9 15l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'thought',
    level: 'THOUGHT',
    name: '思考メモ',
    example: '「競合分析から仮説Aが浮上しています」',
    cost: '任意で閲覧',
    notification: 'バッチ集約',
    color: 'var(--text-muted)',
    barWidth: '30%',
    borderWidth: 1,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AttentionBudgetLevels() {
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
          ATTENTION BUDGET
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 560, margin: '0 auto' }}>
          AIの発話を5段階に分類し、それぞれに注意コストを付与します。優先度の高いものだけが即座に届きます。
        </p>
      </div>

      {/* Level bars */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {levels.map((level, i) => (
          <motion.div
            key={level.id}
            custom={i}
            variants={fadeIn}
            style={{
              width: level.barWidth,
              padding: 'var(--space-4) var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `${level.borderWidth}px solid ${level.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              minHeight: 64,
            }}
          >
            {/* Left: icon + level name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
                minWidth: 120,
              }}
            >
              <div style={{ color: level.color, flexShrink: 0 }}>
                {level.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: level.color,
                    letterSpacing: '0.05em',
                  }}
                >
                  {level.level}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {level.name}
                </div>
              </div>
            </div>

            {/* Center: content example */}
            <div
              style={{
                flex: 1,
                fontSize: 12,
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                minWidth: 0,
              }}
            >
              {level.example}
            </div>

            {/* Right: cost + notification */}
            <div
              data-attention-right=""
              style={{
                flexShrink: 0,
                textAlign: 'right',
                minWidth: 120,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                {level.cost}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 4,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {level.notification}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Responsive: stack vertically on mobile */}
      <style>{`
        @media (max-width: 768px) {
          [data-attention-right] {
            min-width: 80px !important;
          }
        }
      `}</style>

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
        <strong style={{ color: 'var(--text-primary)' }}>注意の経済学</strong>
        <br />
        Simon (1971) が提唱した「情報の豊富さは注意の貧困を生む」という原理に基づき、Neural
        Organization はすべてのAI発話にコストを付与します。週あたりの注意予算を超えないよう、低優先度の発話は自動的にバッチ処理されます。
      </div>
    </div>
  );
}
