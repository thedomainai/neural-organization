'use client';

import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { fadeInUp, staggerContainer } from '../lib/animations';

/**
 * ROI Proof セクション
 *
 * ROI 173% の視覚的訴求。
 * ADR 010 の ROI 計算を反映。
 */
export default function ROIProof() {
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const roiData = {
    annualReturn: 8195, // Million JPY
    cost: 3000, // Million JPY
    profit: 5195, // Million JPY
    roi: 173, // %
    breakdown: [
      { category: '営業活動の自律化', value: 2400, description: '4名 × ¥600M（人件費+機会費用）' },
      { category: '経営判断の高速化', value: 1800, description: '意思決定速度 3倍 → 市場機会損失 60% 削減' },
      { category: '業務オペレーションの最適化', value: 1995, description: '7名 × ¥285M（定型業務自動化）' },
      { category: 'ナレッジワークの増幅', value: 2000, description: '知識労働の生産性 2.7倍' },
    ],
  };

  return (
    <section id="roi" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="section-container">
        <div className="section-label">Proven ROI</div>
        <h2 className="section-title">
          年間 <span className="gradient-text-glow">¥5.2B</span> の利益創出
          <br />
          投資対効果 173%
        </h2>
        <p className="section-desc" style={{ marginBottom: 'var(--space-9)' }}>
          成長期 SaaS 企業（従業員20-100名、ARR ¥1-10B）における実績ベースの ROI 試算です。
        </p>

        <div ref={ref}>
          {/* ROI Summary Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="liquid-glass-deep"
            style={{
              padding: 'var(--space-8)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              marginBottom: 'var(--space-9)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-7)' }}>
              <div>
                <div className="text-label-md" style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                  年間リターン
                </div>
                <div className="text-display-md gradient-text-glow">
                  ¥{roiData.annualReturn.toLocaleString()}M
                </div>
              </div>
              <div>
                <div className="text-label-md" style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                  投資コスト
                </div>
                <div className="text-display-md" style={{ color: 'var(--text-secondary)' }}>
                  ¥{roiData.cost.toLocaleString()}M
                </div>
              </div>
              <div>
                <div className="text-label-md" style={{ color: 'var(--glow-400)', marginBottom: 'var(--space-3)' }}>
                  ROI
                </div>
                <div className="text-display-md gradient-text-glow">
                  {roiData.roi}%
                </div>
              </div>
            </div>
          </motion.div>

          {/* Breakdown */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {roiData.breakdown.map((item, index) => (
              <motion.div
                key={item.category}
                custom={index}
                variants={fadeInUp}
                className="glass-tinted"
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  borderTop: '3px solid var(--primary-500)',
                }}
              >
                <div className="text-heading-sm" style={{ marginBottom: 'var(--space-3)' }}>
                  {item.category}
                </div>
                <div
                  className="text-display-md gradient-text-glow"
                  style={{ marginBottom: 'var(--space-4)', fontSize: '32px' }}
                >
                  ¥{item.value.toLocaleString()}M
                </div>
                <p className="text-body-sm" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-body-sm"
            style={{
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: 'var(--space-7)',
              maxWidth: 700,
              margin: 'var(--space-7) auto 0',
            }}
          >
            ※ 試算は Phase 3-4 到達時（導入後 6-12ヶ月以降）を想定。実際の ROI は企業規模・業種・導入範囲により変動します。
          </motion.p>
        </div>
      </div>
    </section>
  );
}
