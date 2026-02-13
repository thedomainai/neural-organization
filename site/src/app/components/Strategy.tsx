const positioning = [
  {
    category: "AI SaaS",
    examples: "Jasper, Copy.ai …",
    position: "単一タスクの AI 化。部分最適。",
  },
  {
    category: "AI Agent Platform",
    examples: "CrewAI, AutoGen …",
    position: "エージェントの構築・管理基盤。開発者向けインフラ。",
  },
  {
    category: "Enterprise AI",
    examples: "Salesforce Einstein, Microsoft Copilot …",
    position: "既存プロダクトへの AI 機能追加。既存の組織構造を前提。",
  },
];

const moats = [
  {
    name: "Accumulated Understanding",
    nameJa: "蓄積された組織理解",
    description:
      "各導入先で蓄積される固有の世界モデル。因果構造の理解、暗黙の価値観の学習、意思決定パターンの内面化。時間の関数であり、後発が即座に複製することはできない。",
  },
  {
    name: "Network Intelligence",
    nameJa: "ネットワーク知性",
    description:
      "複数の組織に導入されることで、匿名化された形で「組織運営のパターン」が蓄積される。導入組織が増えるほど、すべての組織への価値が増す。真のネットワーク効果。",
  },
  {
    name: "Trust Architecture",
    nameJa: "信頼の構造",
    description:
      "自律的に行動するシステムに対する信頼は、透明性・実績・一貫性の積み重ねでしか構築できない。新規参入者が同等の技術を持っていても、信頼の蓄積は一日にしてならず。",
  },
  {
    name: "Human-Intelligence Protocol",
    nameJa: "人間-知能プロトコル",
    description:
      "人間と組織知能がどのように意思疎通し共存するかという「プロトコル」の発明。組織論・認知科学・倫理学の交差点にある。この発明で先行することが構造的優位を生む。",
  },
];

const timeline = [
  {
    phase: "探索",
    period: "0 – 12M",
    focus: "5-10 社との深い共創。変態プロセスの実証。プロダクトと思想の同時進化。",
  },
  {
    phase: "確立",
    period: "12 – 36M",
    focus: "変態プロセスの再現可能なモデル化。カテゴリの言語化と市場教育。",
  },
  {
    phase: "拡張",
    period: "36M +",
    focus: "エンタープライズ展開。エコシステム形成。カテゴリの標準化。",
  },
];

export default function Strategy() {
  return (
    <section id="strategy" className="section">
      <div className="section-container">
        <div className="section-label">Strategic Position</div>
        <h2 className="section-title">
          競争ではなく、
          <br />
          カテゴリ創造
        </h2>
        <p className="section-desc" style={{ marginBottom: "var(--space-9)" }}>
          Neural Organization は既存カテゴリの中で競争するプロダクトではありません。
          「自律的組織知能」という新しいカテゴリを創造します。
        </p>

        {/* Positioning */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <div
            style={{
              display: "grid",
              gap: "var(--space-3)",
              marginBottom: "var(--space-5)",
            }}
          >
            {positioning.map((p) => (
              <div
                key={p.category}
                className="glass"
                style={{
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-4) var(--space-5)",
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: "var(--space-5)",
                  alignItems: "center",
                  opacity: 0.5,
                }}
              >
                <div>
                  <div className="text-label-lg">{p.category}</div>
                  <div className="text-body-sm" style={{ color: "var(--text-muted)" }}>
                    {p.examples}
                  </div>
                </div>
                <div className="text-body-md" style={{ color: "var(--text-muted)" }}>
                  {p.position}
                </div>
              </div>
            ))}
          </div>

          {/* Neural Organization - highlighted */}
          <div
            className="liquid-glass"
            style={{
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)",
              boxShadow: "var(--glow-medium)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "var(--space-5)",
                alignItems: "center",
              }}
              className="strategy-grid"
            >
              <div>
                <div className="text-heading-sm gradient-text-glow">
                  Neural Organization
                </div>
              </div>
              <div className="text-body-lg" style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                組織そのものの次の形態。既存の組織構造を前提としない。
              </div>
            </div>
          </div>
        </div>

        {/* Moats */}
        <div className="section-label">Structural Moats</div>
        <h3
          className="text-heading-lg"
          style={{ marginBottom: "var(--space-6)" }}
        >
          持続的競争優位の構造
        </h3>
        <p
          className="text-body-lg"
          style={{
            color: "var(--text-secondary)",
            maxWidth: 640,
            marginBottom: "var(--space-7)",
          }}
        >
          AGI 時代において AI モデルの性能は競争優位にならない。
          すべてのプレイヤーが同等の知能にアクセスできるからである。
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-5)",
            marginBottom: "var(--space-10)",
          }}
        >
          {moats.map((moat, i) => (
            <div
              key={moat.name}
              className="glass-violet"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                opacity: 0,
                animation: `fadeInUp var(--duration-slower) var(--ease-out) ${i * 80}ms forwards`,
              }}
            >
              <div
                className="text-heading-sm gradient-text-glow"
                style={{ marginBottom: "var(--space-1)" }}
              >
                {moat.name}
              </div>
              <div
                className="text-body-sm"
                style={{ color: "var(--text-muted)", marginBottom: "var(--space-4)" }}
              >
                {moat.nameJa}
              </div>
              <p className="text-body-md" style={{ color: "var(--text-secondary)", margin: 0 }}>
                {moat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="section-label">Go-to-Market</div>
        <h3
          className="text-heading-lg"
          style={{ marginBottom: "var(--space-6)" }}
        >
          展開の時間軸
        </h3>
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          {timeline.map((t, i) => (
            <div
              key={t.phase}
              className="glass"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5) var(--space-6)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-5)",
                flexWrap: "wrap",
              }}
            >
              <span
                className="gradient-text-glow text-heading-lg"
                style={{ minWidth: 60 }}
              >
                {t.phase}
              </span>
              <span className="badge badge-glow">{t.period}</span>
              <span
                className="text-body-md"
                style={{ color: "var(--text-secondary)", flex: 1, minWidth: 200 }}
              >
                {t.focus}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .strategy-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
