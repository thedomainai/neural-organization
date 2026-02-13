const phases = [
  {
    number: "01",
    name: "Awakening",
    nameJa: "覚醒",
    core: "システムが組織の現実を知覚し、理解を構築する。この段階では行動しない。",
    description:
      "システムは組織の内外のデータソースに接続し、知覚と理解を稼働させます。人間にとっての体験は「鏡」です。自分たちの組織を、これまで見えなかった角度から見せられる。「知っていたはずなのに言語化できていなかったこと」が可視化されます。",
    outcome: "システムが組織を正確に理解していると確認できた時、信頼が芽生える。",
    systems: ["Perception", "Understanding"],
  },
  {
    number: "02",
    name: "Symbiosis",
    nameJa: "共生",
    core: "システムが行動を開始するが、人間とのパートナーシップとして。",
    description:
      "「提案 → 人間の承認 → 実行」のパターンが中心。この段階の本質的な機能は価値観の学習です。人間が提案を修正するたびに、システムは「この組織の人間は何を重視し、何を許容しないか」を学習します。",
    outcome: "定型的な判断はシステムに委ね、人間は例外的・創造的・関係的な仕事に集中し始める。",
    systems: ["Reasoning", "Action", "Reflection"],
  },
  {
    number: "03",
    name: "Metamorphosis",
    nameJa: "変態",
    core: "組織の構造そのものが変容し始める。",
    description:
      "統治が成熟し、システムの自律範囲が拡大します。部門の境界が溶解し始め、人間は「肩書に基づく固定業務」から「参与形態に基づく流動的な役割」へ移行します。既存の権限構造との緊張は、変容の自然な一部です。",
    outcome: "経営層の問いは「どこまでの自律性を許容するか」になる。",
    systems: ["Governance", "Purpose"],
  },
  {
    number: "04",
    name: "Emergence",
    nameJa: "創発",
    core: "Neural Organization が創発する。組織は根本的に異なる存在へ変容を完了する。",
    description:
      "人間は Governor, Sensemaker, Creator, Connector, Custodian として参与し、システムは知覚・理解・推論・行動・内省を自律的に実行します。旧来の組織には不可能だったことが実現します。",
    outcome: "即時応答、連続最適化、規模非依存、境界超越。",
    systems: ["All Systems"],
  },
];

export default function Transformation() {
  return (
    <section id="transformation" className="section" style={{ background: "var(--bg-surface)" }}>
      <div className="section-container">
        <div className="section-label">Transformation</div>
        <h2 className="section-title">
          導入ではなく、変態
        </h2>
        <p className="section-desc" style={{ marginBottom: "var(--space-9)" }}>
          旧来の組織から Neural Organization への移行は「AI
          ツールの導入」ではなく「組織のメタモルフォーシス」です。芋虫が蝶になるように、組織は根本的に異なる存在へと変容します。
        </p>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {phases.map((phase, i) => (
            <div
              key={phase.number}
              className="liquid-glass"
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-7)",
                opacity: 0,
                animation: `fadeInUp var(--duration-slower) var(--ease-out) ${i * 100}ms forwards`,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "var(--space-7)",
                  alignItems: "start",
                }}
                className="phase-grid"
              >
                <div
                  className="gradient-text-glow"
                  style={{ fontSize: 56, fontWeight: 300, lineHeight: 1, minWidth: 72 }}
                >
                  {phase.number}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "var(--space-3)",
                      marginBottom: "var(--space-3)",
                      flexWrap: "wrap",
                    }}
                  >
                    <h3 className="text-heading-lg" style={{ margin: 0 }}>
                      {phase.name}
                    </h3>
                    <span className="text-body-md" style={{ color: "var(--text-muted)" }}>
                      {phase.nameJa}
                    </span>
                  </div>

                  <p
                    className="text-body-lg"
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 500,
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {phase.core}
                  </p>

                  <p
                    className="text-body-md"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-5)",
                    }}
                  >
                    {phase.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "var(--space-4)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        flexWrap: "wrap",
                      }}
                    >
                      {phase.systems.map((s) => (
                        <span key={s} className="badge badge-glow">
                          {s}
                        </span>
                      ))}
                    </div>
                    <span
                      className="text-body-sm"
                      style={{ color: "var(--primary-300)", fontStyle: "italic" }}
                    >
                      {phase.outcome}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .phase-grid { grid-template-columns: 1fr !important; gap: var(--space-4) !important; }
        }
      `}</style>
    </section>
  );
}
