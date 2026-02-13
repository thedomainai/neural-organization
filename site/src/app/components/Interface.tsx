const principles = [
  {
    title: "Intent over Instruction",
    titleJa: "指示ではなく意志を",
    description:
      "「メールを100通送って」ではなく「顧客との関係を深めたい」。人間の知能を最もレバレッジの高い活動 — 目的の定義 — に集中させる。",
  },
  {
    title: "Governance, not Control",
    titleJa: "制御ではなく統治を",
    description:
      "取締役会が経営を統治するように、人間は組織知能の方向性・境界・価値観を設定し、結果を監査する。逐一の指示ではなく、原則の設定と例外の処理。",
  },
  {
    title: "Ambient Presence",
    titleJa: "環境的存在",
    description:
      "「開いて使う」ものではない。常にそこにいて、常に組織の現実を理解していて、必要なときに適切な形で関与する。電気が環境化したように、組織知能も環境化する。",
  },
  {
    title: "Radical Transparency",
    titleJa: "徹底的な透明性",
    description:
      "あらゆる推論・判断・行動は、理由と根拠を確認できる。なぜその判断をしたのか、確信度はどの程度か、どこに不確実性があるか。透明性は信頼の前提条件であり、信頼は自律性の前提条件である。",
  },
  {
    title: "Agency Preservation",
    titleJa: "人間の主体性の保全",
    description:
      "人間がいつでも判断を覆せること、システムを停止できること、システムなしでも組織が機能し続けられること。安全装置であると同時に、人間の尊厳の問題。",
  },
];

const discontinuities = [
  { old: "ダッシュボード（情報の表示）", neural: "能動的インサイト表出（必要な人に、必要なとき、必要な形で）" },
  { old: "ワークフロービルダー（プロセスの定義）", neural: "意志の伝達（目的を伝えれば、プロセスは創発する）" },
  { old: "エージェントカタログ（機能の選択）", neural: "存在しない。組織知能は単一であり「機能」という区分がない" },
  { old: "承認フロー（逐一の制御）", neural: "立憲的統治（原則による統治と、例外の処理）" },
  { old: "通知（情報のプッシュ）", neural: "文脈的関与（人間の注意を最小限に消費しながら）" },
];

export default function Interface() {
  return (
    <section id="interface" className="section" style={{ background: "var(--bg-surface)" }}>
      <div className="section-container">
        <div className="section-label">Human-Intelligence Interface</div>
        <h2 className="section-title">
          UX ではなく、
          <br />
          共存の設計
        </h2>
        <p className="section-desc" style={{ marginBottom: "var(--space-5)" }}>
          これは「ツールの使い勝手」の話ではありません。
        </p>
        <p
          className="text-body-lg"
          style={{
            color: "var(--text-secondary)",
            maxWidth: 640,
            marginBottom: "var(--space-9)",
          }}
        >
          人間と組織知能がどのように共存するかという、新しい種類の関係性の設計です。
        </p>

        {/* Principles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--space-5)",
            marginBottom: "var(--space-10)",
          }}
        >
          {principles.map((p, i) => (
            <div
              key={p.title}
              className="glass-tinted"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                opacity: 0,
                animation: `fadeInUp var(--duration-slower) var(--ease-out) ${i * 60}ms forwards`,
              }}
            >
              <div className="text-heading-sm" style={{ marginBottom: "var(--space-1)" }}>
                {p.title}
              </div>
              <div
                className="text-body-sm"
                style={{ color: "var(--text-muted)", marginBottom: "var(--space-4)" }}
              >
                {p.titleJa}
              </div>
              <p className="text-body-md" style={{ color: "var(--text-secondary)", margin: 0 }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Discontinuity table */}
        <div className="section-label">Paradigm Break</div>
        <h3
          className="text-heading-lg"
          style={{ marginBottom: "var(--space-6)" }}
        >
          現行 UX パラダイムとの断絶
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                {["現行の UX パラダイム", "Neural Organization の界面"].map((h) => (
                  <th
                    key={h}
                    className="text-label-md"
                    style={{
                      color: "var(--text-muted)",
                      textAlign: "left",
                      padding: "var(--space-4) var(--space-5)",
                      borderBottom: "1px solid var(--border-default)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {discontinuities.map((d, i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--neutral-200)" }}>
                  <td
                    className="text-body-md"
                    style={{
                      padding: "var(--space-4) var(--space-5)",
                      color: "var(--text-muted)",
                      textDecoration: "line-through",
                      textDecorationColor: "var(--neutral-500)",
                    }}
                  >
                    {d.old}
                  </td>
                  <td
                    className="text-body-md"
                    style={{
                      padding: "var(--space-4) var(--space-5)",
                      color: "var(--primary-300)",
                    }}
                  >
                    {d.neural}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
