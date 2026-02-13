const layers = [
  {
    layer: 0,
    name: "Perception",
    nameJa: "知覚",
    transform: "現実世界 → シグナル",
    color: "var(--primary-400)",
    description:
      "現実世界との接続を確立し、流入するデータからシグナルを検出する。「何に接続すべきか」という能動的判断と「何が意味あるシグナルか」というフィルタリングの両方を担う。",
    elements: [
      "能動的接続 — システム自身がデータソースを判断し接続を要求",
      "受動的接続 — Webhook・イベントストリームの受信",
      "正規化 — 多様なフォーマットを共通表現に変換",
      "シグナル検出 — ノイズから意味ある変化・異常・トレンドを検出",
      "注意配分 — 最も重要なシグナルに注意を集中",
    ],
    coreQuestion:
      "現実世界の何に接続し、何をシグナルとして拾うべきか。",
  },
  {
    layer: 1,
    name: "Understanding",
    nameJa: "理解",
    transform: "シグナル → 世界モデル",
    color: "var(--primary-500)",
    description:
      "検出されたシグナルを統合し、現実の因果モデルを構築・維持する。データベースではなく「生きた世界モデル」。",
    elements: [
      "エンティティモデル — 顧客・競合・市場等の実体と関係性",
      "因果モデル — 「XすればYが起こる、なぜならZ」という因果構造",
      "予測モデル — 将来の確率的予測",
      "反実仮想モデル — 反事実的推論",
    ],
    coreQuestion:
      "現実は実際にどうなっているか。そして、なぜそうなっているか。",
  },
  {
    layer: 2,
    name: "Reasoning",
    nameJa: "推論",
    transform: "世界モデル × 目的 → 行動計画",
    color: "var(--glow-400)",
    description:
      "世界モデルと人間が注入した目的（Purpose）を接続し、何をすべきかを導出する。戦略的判断と領域横断的な行動計画の構成を一体として行う創発的推論。",
    elements: [
      "ギャップ分析 — 現在の世界モデルと目的の乖離を特定",
      "機会の特定 — 取りうる行動の選択肢を生成",
      "トレードオフ評価 — 選択肢間の多軸評価",
      "判断 — 最適行動の選択 or Governance へのエスカレーション",
      "領域横断構成 — 複数領域を横断する統合的な行動計画の構成",
    ],
    coreQuestion:
      "何をすべきか。どう組み合わせれば最大の効果を最小のコストで実現できるか。",
    governanceGate: true,
  },
  {
    layer: 3,
    name: "Execution",
    nameJa: "実行",
    transform: "行動計画 → アウトプット",
    color: "var(--primary-600)",
    description:
      "行動計画を実際に実行し、現実世界にアウトプットを生成する。",
    elements: [
      "アーティファクト生成 — コンテンツ・コード・レポート等の生成",
      "外部システム操作 — メール送信・API呼び出し等の実行",
      "品質保証 — ブランド・品質・法的要件の検証",
      "デリバリー — 適切な受信者に適切な形で届ける",
    ],
    coreQuestion: "高品質なアウトプットをどう確実に生成し、届けるか。",
    governanceGate: true,
  },
  {
    layer: 4,
    name: "Reflection",
    nameJa: "内省",
    transform: "アウトプット → 学習 → 全層更新",
    color: "var(--primary-700)",
    description:
      "アウトプットが現実世界に与えた影響を観測し、全層を対象とした自己参照的な内省を行う。",
    elements: [
      "→ Perception — 接続すべきソースやシグナルを見落としていなかったか",
      "→ Understanding — 世界モデルの因果構造は正しかったか",
      "→ Reasoning — 判断の前提は正しかったか。行動の構成は最適だったか",
      "→ Execution — 出力の品質は十分だったか",
    ],
    coreQuestion:
      "意図した結果が得られたか。得られなかった場合、どの層の何が原因か。",
  },
];

const crosscutting = [
  {
    name: "Purpose",
    nameJa: "目的",
    label: "WHY",
    color: "var(--primary-300)",
    description:
      "人間が意志を注入する界面。指示ではなく意志を受け取る。主に Layer 2（Reasoning）に作用し、行動計画導出を方向づける。",
    icon: "⟶",
  },
  {
    name: "Governance",
    nameJa: "統治",
    label: "WHO",
    color: "var(--glow-300)",
    description:
      "人間がシステムの行動を統治する。Layer 2 と Layer 3 に Gate を持ち、重要な判断・不可逆なアクションには人間の承認を要求する。",
    icon: "⊘",
  },
  {
    name: "Memory",
    nameJa: "記憶",
    label: "WHAT",
    color: "var(--neutral-500)",
    description:
      "全層にまたがるインフラストラクチャ。各レイヤーの永続状態の総体が「組織の記憶」を構成し、蓄積された組織理解（Moat）の実体となる。",
    icon: "∞",
  },
  {
    name: "Orchestration",
    nameJa: "統率",
    label: "HOW",
    color: "var(--neutral-400)",
    description:
      "層間の実行フローを統率する機構。実行順序・並列実行・リソース配分・優先度管理・エラー回復を制御する。",
    icon: "⟳",
  },
];

export default function Architecture() {
  return (
    <section
      id="architecture"
      className="section"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="section-container">
        <div className="section-label">Architecture</div>
        <h2 className="section-title">
          5-Layer
          <br />
          Intelligence Architecture
        </h2>
        <p className="section-desc" style={{ marginBottom: "var(--space-5)" }}>
          現実世界からアウトプットが生まれるまでの変換パイプライン。
        </p>
        <p
          className="text-body-lg"
          style={{
            color: "var(--text-secondary)",
            maxWidth: 640,
            marginBottom: "var(--space-9)",
          }}
        >
          各レイヤーは不可分な認知変換に対応し、明確な入力と出力を持ちます。
          横断的要素として Purpose・Governance・Memory・Orchestration
          が全層に作用します。
        </p>

        {/* Crosscutting concerns */}
        <div
          className="text-label-md"
          style={{
            color: "var(--text-muted)",
            marginBottom: "var(--space-3)",
          }}
        >
          Crosscutting Concerns
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
        >
          {crosscutting.map((c, i) => (
            <div
              key={c.name}
              className="liquid-glass"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
                borderLeft: `3px solid ${c.color}`,
                opacity: 0,
                animation: `fadeInUp var(--duration-slower) var(--ease-out) ${i * 80}ms forwards`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    color: c.color,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {c.icon}
                </span>
                <h3 className="text-heading-sm" style={{ margin: 0 }}>
                  {c.name}
                </h3>
                <span
                  className="text-label-sm"
                  style={{
                    color: c.color,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                  }}
                >
                  {c.label}
                </span>
              </div>
              <p
                className="text-body-sm"
                style={{ color: "var(--text-secondary)", margin: 0 }}
              >
                {c.description}
              </p>
            </div>
          ))}
        </div>

        {/* Layer pipeline */}
        <div
          className="text-label-md"
          style={{
            color: "var(--text-muted)",
            marginBottom: "var(--space-3)",
          }}
        >
          Transformation Pipeline
        </div>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {layers.map((layer, i) => (
            <div
              key={layer.name}
              className="glass"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5) var(--space-6)",
                borderLeft: `3px solid ${layer.color}`,
                opacity: 0,
                animation: `fadeInUp var(--duration-slower) var(--ease-out) ${(i + 4) * 60}ms forwards`,
                position: "relative",
              }}
            >
              {/* Layer header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-2)",
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="text-label-md"
                  style={{
                    color: layer.color,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  L{layer.layer}
                </span>
                <h3 className="text-heading-sm" style={{ margin: 0 }}>
                  {layer.name}
                </h3>
                <span
                  className="text-body-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {layer.nameJa}
                </span>
                {layer.governanceGate && (
                  <span
                    className="text-label-sm"
                    style={{
                      color: "var(--glow-300)",
                      background:
                        "rgba(var(--glow-400-rgb, 255, 184, 77), 0.1)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 10,
                      letterSpacing: "0.05em",
                    }}
                  >
                    GOVERNANCE GATE
                  </span>
                )}
              </div>

              {/* Transform */}
              <div
                className="text-body-sm"
                style={{
                  color: layer.color,
                  fontFamily: "var(--font-mono)",
                  marginBottom: "var(--space-3)",
                }}
              >
                {layer.transform}
              </div>

              {/* Description */}
              <p
                className="text-body-md"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {layer.description}
              </p>

              {/* Elements */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-3)",
                }}
              >
                {layer.elements.map((e) => (
                  <div
                    key={e}
                    className="text-body-sm"
                    style={{
                      color: "var(--text-muted)",
                      background: "var(--neutral-200)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-2) var(--space-3)",
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>

              {/* Core question */}
              <div
                className="text-body-sm"
                style={{
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  paddingTop: "var(--space-2)",
                  borderTop: "0.5px solid var(--neutral-300)",
                }}
              >
                {layer.coreQuestion}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
