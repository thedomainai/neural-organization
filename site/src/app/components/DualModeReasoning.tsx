'use client';

import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { fadeInUp, slideInLeft, slideInRight } from '../lib/animations';

/**
 * Dual-Mode Reasoning セクション
 *
 * 定型的推論 vs 創発的推論の2モード設計を訴求する。
 * ADR 007 の設計を反映。
 */
export default function DualModeReasoning() {
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="dual-mode" className="section">
      <div className="section-container">
        <div className="section-label">Dual-Mode Reasoning</div>
        <h2 className="section-title">
          信頼に応じて推論モードを切り替える
          <br />
          <span className="gradient-text-glow">状況適応的な知能</span>
        </h2>
        <p className="section-desc" style={{ marginBottom: 'var(--space-9)' }}>
          Neural Organization の Layer 2 は、Trust Score に基づいて「定型的推論」と「創発的推論」を動的に切り替えます。
          初期段階では高速で信頼性の高い定型的推論が中心となり、信頼が蓄積されるにつれて柔軟で創造的な創発的推論へと移行します。
        </p>

        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-7)', marginBottom: 'var(--space-9)' }}>
          {/* Routine Reasoning */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={slideInLeft}
            className="glass-tinted"
            style={{
              padding: 'var(--space-7)',
              borderRadius: 'var(--radius-lg)',
              borderLeft: '4px solid var(--primary-400)',
            }}
          >
            <h3 className="text-heading-md" style={{ marginBottom: 'var(--space-4)' }}>
              定型的推論
              <br />
              <span className="text-label-md" style={{ color: 'var(--text-muted)' }}>
                Routine Reasoning
              </span>
            </h3>
            <p className="text-body-md" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
              過去の成功パターンに合致する状況では、高速で確実なステートマシン的推論を実行します。
            </p>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div className="text-label-sm" style={{ marginBottom: 'var(--space-3)' }}>
                適用条件
              </div>
              <ul className="text-body-sm" style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 'var(--space-2)' }}>Trust Score {'<'} 0.60</li>
                <li style={{ marginBottom: 'var(--space-2)' }}>過去パターンへの合致率 80%+</li>
                <li>定型業務・繰り返しタスク</li>
              </ul>
            </div>

            <div>
              <div className="text-label-sm" style={{ marginBottom: 'var(--space-3)' }}>
                特徴
              </div>
              <ul className="text-body-sm" style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 'var(--space-2)' }}>高速処理（{'<'}100ms）</li>
                <li style={{ marginBottom: 'var(--space-2)' }}>予測可能な動作</li>
                <li>低コスト</li>
              </ul>
            </div>
          </motion.div>

          {/* Emergent Reasoning */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={slideInRight}
            className="glass-violet"
            style={{
              padding: 'var(--space-7)',
              borderRadius: 'var(--radius-lg)',
              borderLeft: '4px solid var(--glow-400)',
            }}
          >
            <h3 className="text-heading-md" style={{ marginBottom: 'var(--space-4)' }}>
              創発的推論
              <br />
              <span className="text-label-md" style={{ color: 'var(--glow-300)' }}>
                Emergent Reasoning
              </span>
            </h3>
            <p className="text-body-md" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
              未知の状況や複雑な判断では、LLM ベースの柔軟で創造的な推論を実行します。
            </p>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div className="text-label-sm" style={{ marginBottom: 'var(--space-3)' }}>
                適用条件
              </div>
              <ul className="text-body-sm" style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 'var(--space-2)' }}>Trust Score ≥ 0.60</li>
                <li style={{ marginBottom: 'var(--space-2)' }}>過去パターンへの合致率 {'<'} 80%</li>
                <li>戦略的判断・創造的タスク</li>
              </ul>
            </div>

            <div>
              <div className="text-label-sm" style={{ marginBottom: 'var(--space-3)' }}>
                特徴
              </div>
              <ul className="text-body-sm" style={{ color: 'var(--text-secondary)', listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 'var(--space-2)' }}>柔軟な判断</li>
                <li style={{ marginBottom: 'var(--space-2)' }}>新しい解の創造</li>
                <li>マルチドメイン対応</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Trust Score Transition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            padding: 'var(--space-7)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}
        >
          <div className="text-label-md" style={{ color: 'var(--glow-400)', marginBottom: 'var(--space-4)' }}>
            Trust Score による動的な閾値調整
          </div>
          <p className="text-body-lg" style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            Trust Score が上昇するにつれて、創発的推論の閾値は{' '}
            <code style={{ color: 'var(--glow-300)', background: 'var(--neutral-200)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
              0.60 + (trust_score × 0.33)
            </code>{' '}
            の式で動的に調整されます。Phase 4（Trust Score 0.80+）では、80%以上の判断が創発的推論で行われます。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
