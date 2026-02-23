'use client';

import { useInView } from '../hooks/useInView';
import HeroBackground from './HeroBackground';
import styles from './Hero.module.css';

interface HeroProps {
  variant: "customer" | "investor";
}

const content = {
  customer: {
    badge: "Autonomous Organizational Intelligence",
    heading: (
      <>
        組織の
        <span className="gradient-text-glow">次の形態</span>
      </>
    ),
    description:
      "Neural Organization は AI を使う組織のためのツールではありません。人間が意志を注入し、システムが知覚・推論・行動を無限にスケールさせる — 組織そのものの次の形態です。",
    primaryCta: { label: "思想を知る", href: "#paradigm" },
    secondaryCta: { label: "変容プロセスを見る", href: "#transformation" },
    stats: [
      { value: "5", label: "Layers" },
      { value: "4", label: "Moats" },
      { value: "173%", label: "ROI" },
    ],
  },
  investor: {
    badge: "Category Creation",
    heading: (
      <>
        知能が汎用財になった時代の
        <br />
        <span className="gradient-text-glow">組織のOS</span>
      </>
    ),
    description:
      "AGI が知能を希少財から汎用財に変える。組織の存在理由が変わる。Neural Organization は「自律的組織知能」という新カテゴリを創造します。",
    primaryCta: { label: "アーキテクチャ", href: "#architecture" },
    secondaryCta: { label: "戦略的ポジション", href: "#strategy" },
    stats: [
      { value: "New", label: "Category" },
      { value: "4", label: "Moats" },
      { value: "173%", label: "ROI" },
    ],
  },
};

export default function Hero({ variant }: HeroProps) {
  const c = content[variant];
  const [ref, isInView] = useInView<HTMLDivElement>({ triggerOnce: true });

  return (
    <section className={styles.hero}>
      <div className={styles.bgGradient} />
      <div className={styles.bgMesh} />
      <div className={styles.bgOrb} />
      <HeroBackground />

      <div
        ref={ref}
        className={`${styles.content} ${isInView ? styles.visible : ''}`}
      >
        <div className={`badge badge-primary ${styles.badge}`}>
          {c.badge}
        </div>

        <h1 className={`text-display-xl ${styles.heading}`}>
          {c.heading}
        </h1>

        <p className={`text-body-lg ${styles.description}`}>
          {c.description}
        </p>

        <div className={styles.ctaGroup}>
          <a href={c.primaryCta.href} className="btn btn-primary btn-lg">
            {c.primaryCta.label}
          </a>
          <a href={c.secondaryCta.href} className="btn btn-secondary btn-lg">
            {c.secondaryCta.label}
          </a>
        </div>

        <div className={styles.stats}>
          {c.stats.map((stat) => (
            <div key={stat.label}>
              <div className={`gradient-text-glow ${styles.statValue}`}>
                {stat.value}
              </div>
              <div className={`text-body-sm ${styles.statLabel}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
