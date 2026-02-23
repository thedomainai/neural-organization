/**
 * Framer Motion 共通アニメーションバリアント
 *
 * Phase 1-2 で使用する再利用可能なアニメーション定義。
 * 一貫性のあるモーション言語を確立する。
 */

import { Variants } from 'framer-motion';

/**
 * フェードイン（下から上へ）
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1], // ease-out
    },
  },
};

/**
 * フェードイン（遅延対応）
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: custom * 0.1,
      ease: [0, 0, 0.2, 1],
    },
  }),
};

/**
 * スケールフェードイン
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1],
    },
  },
};

/**
 * 左からスライドイン
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1],
    },
  },
};

/**
 * 右からスライドイン
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1],
    },
  },
};

/**
 * 段階的に子要素を表示（stagger children）
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * パイプライン要素用（下から上へ、やや遅延）
 */
export const pipelineLayer: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.15,
      ease: [0.34, 1.56, 0.64, 1], // ease-spring
    },
  }),
};

/**
 * グロー効果（ホバー時）
 */
export const glowHover = {
  rest: {
    scale: 1,
    filter: 'brightness(1) drop-shadow(0 0 0 rgba(80, 104, 164, 0))',
  },
  hover: {
    scale: 1.02,
    filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(80, 104, 164, 0.3))',
    transition: {
      duration: 0.25,
      ease: [0, 0, 0.2, 1],
    },
  },
};

/**
 * カード要素用（マウスオーバーで軽く浮く）
 */
export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
  hover: {
    y: -4,
    boxShadow: '0 8px 32px rgba(80, 104, 164, 0.3)',
    transition: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
    },
  },
};

/**
 * Scroll-linked progress（0-1 の値に応じて変化）
 */
export const scrollProgress = (progress: number) => ({
  opacity: Math.min(progress * 2, 1),
  y: (1 - progress) * 40,
});
