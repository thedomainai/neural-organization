'use client';

import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { fadeIn, staggerContainer } from '../../lib/animations';

const domains = [
  { label: 'CS (顧客対応)', value: 3.0, color: 'var(--primary-400)' },
  { label: 'Product (製品改善)', value: 5.0, color: '#e5c07b' },
  { label: 'Marketing (マーケティング)', value: 2.0, color: 'var(--glow-400)' },
  { label: 'Sales (営業)', value: 0.5, color: '#6bb8a0' },
  { label: '相乗効果', value: 2.0, color: '#c4a05c' },
];

const totalValue = 12.5;
const maxBarValue = totalValue;

export default function CrossDomainEffect() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} style={{ margin: 'var(--space-8) 0' }}>
      <style>{`
        .cross-domain-grid {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: var(--space-5);
          align-items: start;
        }
        @media (max-width: 768px) {
          .cross-domain-grid {
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
          CROSS-DOMAIN COMPOSITION
        </div>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          部門横断でインサイトを統合することで、単独部門の改善率を大きく超える複合効果が生まれます。
        </p>
      </div>

      {/* Before / After panels */}
      <motion.div
        className="cross-domain-grid"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Left: Before (従来の組織) */}
        <motion.div
          custom={0}
          variants={fadeIn}
          style={{
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase' as const,
            }}
          >
            従来の組織
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            単一部門の最適化
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            CS部門が単独で改善活動を実施。他部門の情報は活用されない。
          </p>

          {/* Single bar */}
          <div style={{ marginTop: 'var(--space-2)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}
              >
                CS部門単独
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                +3.0%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 28,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.04)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(3.0 / maxBarValue) * 100}%` } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0, 0, 0.2, 1] }}
                style={{
                  height: '100%',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.12)',
                }}
              />
            </div>
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
              }}
            >
              合計改善率
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-muted)',
              }}
            >
              +3.0%
            </span>
          </div>
        </motion.div>

        {/* Right: After (Neural Organization) */}
        <motion.div
          custom={1}
          variants={fadeIn}
          style={{
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderTop: '3px solid var(--primary-400)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: 'var(--primary-400)',
              textTransform: 'uppercase' as const,
            }}
          >
            Neural Organization
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            部門横断の複合効果
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            全部門のインサイトを統合。因果関係の発見により相乗効果が生まれる。
          </p>

          {/* Stacked bars */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-2)',
            }}
          >
            {domains.map((domain, i) => (
              <div key={domain.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: domain.label === '相乗効果' ? '#c4a05c' : 'var(--text-muted)',
                      fontStyle: domain.label === '相乗効果' ? 'italic' : 'normal',
                    }}
                  >
                    {domain.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: domain.color,
                    }}
                  >
                    +{domain.value.toFixed(1)}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 24,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={
                      isInView
                        ? { width: `${(domain.value / maxBarValue) * 100}%` }
                        : { width: 0 }
                    }
                    transition={{
                      duration: 0.7,
                      delay: 0.4 + i * 0.12,
                      ease: [0, 0, 0.2, 1],
                    }}
                    style={{
                      height: '100%',
                      borderRadius: 'var(--radius-sm)',
                      background: domain.color,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              合計改善率
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--primary-400)',
              }}
            >
              +{totalValue}%
            </span>
          </div>
        </motion.div>
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
        Thompson (1967)
        の相互依存性理論が示すように、部門間の情報が統合されることで、単独では見えなかった因果関係が浮かび上がります。Neural
        Organization
        はこの「情報の断絶」を解消し、組織全体での改善率を4倍以上に引き上げます。
      </div>
    </div>
  );
}
