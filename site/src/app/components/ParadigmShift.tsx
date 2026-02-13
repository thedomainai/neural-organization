const shifts = [
  { old: "部門（営業部、開発部…）", reason: "人間は専門化しなければ深い知能を発揮できない", neural: "全領域を横断する流体的インテリジェンス" },
  { old: "階層（マネージャー、VP…）", reason: "人間がマネジメントできる直属は 5-10 人", neural: "意志グラフ（Purpose → Outcomes）" },
  { old: "肩書・職種", reason: "専門性と権限を示すシグナル", neural: "参与形態: Governor, Sensemaker, Creator, Connector, Custodian" },
  { old: "会議", reason: "分散した認知を同期させる手段", neural: "連続的なアンビエント・インテリジェンス" },
  { old: "プロセス・SOP", reason: "属人性を排除し一貫した品質を担保", neural: "創発的な最適行動" },
  { old: "メール・チャット", reason: "人間同士の非同期情報伝達", neural: "意志界面（Intent Interface）" },
];

const roles = [
  {
    name: "Governor",
    nameJa: "統治者",
    description: "組織の存在理由を定義する。Purpose と Values の源泉。意味という、AGI が生成できない唯一のものを供給する。",
  },
  {
    name: "Sensemaker",
    nameJa: "意味付与者",
    description: "データが捉えられない主観的人間体験をシステムに翻訳する。定量化できない質的現実を、世界モデルに統合する。",
  },
  {
    name: "Creator",
    nameJa: "創造者",
    description: "まだ存在しないものを構想する。「何を存在させるべきか」という問いの設定自体が創造行為であり、Purpose から導かれる。",
  },
  {
    name: "Connector",
    nameJa: "接続者",
    description: "人間同士の信頼・共感・関係性を構築する。AGI 時代においても、人間は人間を信頼する。この媒介は不可分に人間的である。",
  },
  {
    name: "Custodian",
    nameJa: "守護者",
    description: "システムの行動が価値観・倫理・規範と整合しているかを監視する。AGI の能力が大きいほど、守護者の重要性は増す。",
  },
];

export default function ParadigmShift() {
  return (
    <section id="paradigm" className="section">
      <div className="section-container">
        <div className="section-label">Paradigm Shift</div>
        <h2 className="section-title">
          なぜ組織は
          <br />
          今の形をしているのか
        </h2>
        <p className="section-desc" style={{ marginBottom: "var(--space-5)" }}>
          現在の組織構造のすべては「知能が希少である」という制約への適応である。AGI
          はこの前提を溶解させる。
        </p>
        <p
          className="text-body-lg"
          style={{
            color: "var(--text-secondary)",
            maxWidth: 640,
            marginBottom: "var(--space-9)",
          }}
        >
          部門、階層、肩書、会議、プロセス。これらは人間の認知能力の限界を補うために発明されたものであり、
          知能が無限にスケールする時代には、その存在理由が消滅する。
        </p>

        {/* Shift table */}
        <div
          style={{
            marginBottom: "var(--space-10)",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 700,
            }}
          >
            <thead>
              <tr>
                {["現在の組織構造", "存在理由", "Neural Organization"].map(
                  (h) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {shifts.map((s, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "0.5px solid var(--neutral-200)",
                  }}
                >
                  <td
                    className="text-body-md"
                    style={{
                      padding: "var(--space-4) var(--space-5)",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {s.old}
                  </td>
                  <td
                    className="text-body-md"
                    style={{
                      padding: "var(--space-4) var(--space-5)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {s.reason}
                  </td>
                  <td
                    className="text-body-md"
                    style={{
                      padding: "var(--space-4) var(--space-5)",
                      color: "var(--primary-300)",
                    }}
                  >
                    {s.neural}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Human roles */}
        <div className="section-label">Human Roles</div>
        <h3
          className="text-heading-lg"
          style={{ marginBottom: "var(--space-5)" }}
        >
          人間は「仕事をする」のではなく
          <br />
          「組織知能に参与する」
        </h3>
        <p className="section-desc" style={{ marginBottom: "var(--space-7)" }}>
          AGI 時代の人間の役割は 5 つの参与形態に分類される。
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {roles.map((role, i) => (
            <div
              key={role.name}
              className="glass-tinted"
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
                {role.name}
              </div>
              <div
                className="text-body-sm"
                style={{
                  color: "var(--text-muted)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {role.nameJa}
              </div>
              <p
                className="text-body-md"
                style={{ color: "var(--text-secondary)", margin: 0 }}
              >
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
