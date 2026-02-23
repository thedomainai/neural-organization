'use client';

import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { phases } from '../data/phases';
import { fadeIn, staggerContainer } from '../lib/animations';
import styles from './TransformationTimeline.module.css';

/**
 * 変容プロセスタイムライン
 *
 * Phase 1-4 の変容プロセスを横/縦方向のタイムラインで表示する。
 * レスポンシブ対応（デスクトップ: 横、モバイル: 縦）。
 */
export default function TransformationTimeline() {
  const [ref, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <div ref={ref} className={styles.container}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={styles.timeline}
      >
        {phases.map((phase, index) => (
          <motion.div key={phase.id} custom={index} variants={fadeIn} className={styles.phaseCard}>
            {/* Phase Header */}
            <div className={styles.phaseHeader}>
              <div className={styles.phaseNumber}>
                {phase.number}
              </div>
              <div>
                <h3 className={`text-heading-md ${styles.phaseName}`}>
                  {phase.name}
                </h3>
                <div className={`text-body-sm ${styles.phaseDuration}`}>
                  {phase.duration}
                </div>
              </div>
            </div>

            {/* Phase Description */}
            <p className={`text-body-md ${styles.phaseDescription}`}>
              {phase.description}
            </p>

            {/* Trust Score Range */}
            <div className={styles.trustScore}>
              <div className="text-label-sm" style={{ color: 'var(--glow-400)' }}>
                Trust Score
              </div>
              <div className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                {phase.trustScoreRange}
              </div>
            </div>

            {/* Key Features */}
            <div className={styles.features}>
              <div className="text-label-sm" style={{ marginBottom: 'var(--space-3)' }}>
                Key Features
              </div>
              <ul className={styles.featureList}>
                {phase.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="text-body-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Success Criteria */}
            <div className={styles.criteria}>
              <div className="text-label-sm" style={{ marginBottom: 'var(--space-3)' }}>
                Success Criteria
              </div>
              <ul className={styles.criteriaList}>
                {phase.successCriteria.map((criterion, idx) => (
                  <li key={idx} className="text-body-sm">
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connector Line (not visible on last phase) */}
            {index < phases.length - 1 && (
              <div className={styles.connector} />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
