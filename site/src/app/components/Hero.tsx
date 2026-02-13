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
      { value: "7", label: "Cognitive Systems" },
      { value: "5", label: "Human Roles" },
      { value: "4", label: "Transformation Phases" },
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
      { value: "4", label: "Structural Moats" },
      { value: "∞", label: "Scalable Intelligence" },
    ],
  },
};

export default function Hero({ variant }: HeroProps) {
  const c = content[variant];

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-11) var(--space-6) var(--space-10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--gradient-hero)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--gradient-mesh)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(80,104,164,0.12) 0%, rgba(142,124,180,0.06) 40%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 800 }}>
        <div
          className="badge badge-primary"
          style={{ marginBottom: "var(--space-6)" }}
        >
          {c.badge}
        </div>

        <h1
          className="text-display-xl"
          style={{ marginBottom: "var(--space-6)" }}
        >
          {c.heading}
        </h1>

        <p
          className="text-body-lg"
          style={{
            color: "var(--text-secondary)",
            maxWidth: 600,
            margin: "0 auto var(--space-8)",
          }}
        >
          {c.description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href={c.primaryCta.href} className="btn btn-primary btn-lg">
            {c.primaryCta.label}
          </a>
          <a href={c.secondaryCta.href} className="btn btn-secondary btn-lg">
            {c.secondaryCta.label}
          </a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--space-7)",
            maxWidth: 600,
            margin: "var(--space-10) auto 0",
          }}
        >
          {c.stats.map((stat) => (
            <div key={stat.label}>
              <div
                className="gradient-text-glow"
                style={{ fontSize: 36, fontWeight: 300, lineHeight: 1.1 }}
              >
                {stat.value}
              </div>
              <div
                className="text-body-sm"
                style={{
                  color: "var(--text-muted)",
                  marginTop: "var(--space-2)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
