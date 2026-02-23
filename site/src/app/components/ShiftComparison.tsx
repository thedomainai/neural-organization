'use client';

import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { shifts } from '../data/roles';
import { fadeIn, staggerContainer } from '../lib/animations';
import styles from './ShiftComparison.module.css';

/**
 * パラダイムシフト対比表現
 *
 * 左右配置のビジュアルカードで、従来の組織構造と
 * Neural Organization の違いを明確に対比する。
 */
export default function ShiftComparison() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} className={styles.container}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={styles.grid}
      >
        {shifts.map((shift, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={fadeIn}
            className={styles.shiftCard}
          >
            {/* Traditional */}
            <div className={styles.traditional}>
              <div className="text-label-sm" style={{ color: 'var(--text-muted)' }}>
                従来の組織
              </div>
              <div className={`text-heading-sm ${styles.oldValue}`}>
                {shift.old}
              </div>
            </div>

            {/* Arrow */}
            <div className={styles.arrow}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Neural Organization */}
            <div className={styles.neural}>
              <div className="text-label-sm" style={{ color: 'var(--glow-400)' }}>
                Neural Organization
              </div>
              <div className={`text-heading-sm gradient-text-glow ${styles.neuralValue}`}>
                {shift.neural}
              </div>
            </div>

            {/* Reason */}
            <div className={styles.reason}>
              <div className="text-label-sm" style={{ marginBottom: 'var(--space-2)' }}>
                なぜ変わるのか
              </div>
              <p className="text-body-sm" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {shift.reason}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
