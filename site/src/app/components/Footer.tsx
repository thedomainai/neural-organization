interface FooterProps {
  variant: "customer" | "investor";
}

const content = {
  customer: {
    heading: (
      <>
        組織を、
        <span className="gradient-text-glow">進化させる。</span>
      </>
    ),
    description:
      "Neural Organization で、あなたの組織を次の形態へ。",
    primaryCta: "お問い合わせ",
    secondaryCta: "資料をダウンロード",
  },
  investor: {
    heading: (
      <>
        <span className="gradient-text-glow">共に</span>、カテゴリを創る。
      </>
    ),
    description:
      "自律的組織知能という新しいカテゴリの創造について、お話しさせてください。",
    primaryCta: "ミーティングを予約",
    secondaryCta: "Pitch Deck をダウンロード",
  },
};

export default function Footer({ variant }: FooterProps) {
  const c = content[variant];

  return (
    <footer
      id="contact"
      style={{
        borderTop: "var(--separator)",
        padding: "var(--space-9) var(--space-6)",
      }}
    >
      <div className="section-container" style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "var(--space-9)" }}>
          <h2
            className="text-display-md"
            style={{ marginBottom: "var(--space-5)" }}
          >
            {c.heading}
          </h2>
          <p
            className="text-body-lg"
            style={{
              color: "var(--text-secondary)",
              maxWidth: 480,
              margin: "0 auto var(--space-7)",
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
            <button className="btn btn-primary btn-lg">{c.primaryCta}</button>
            <button className="btn btn-secondary btn-lg">
              {c.secondaryCta}
            </button>
          </div>
        </div>

        <div
          style={{
            borderTop: "var(--separator)",
            paddingTop: "var(--space-7)",
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
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "var(--radius-sm)",
                background:
                  "linear-gradient(135deg, var(--primary-500), var(--glow-400))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              N
            </span>
            <span
              className="text-body-md"
              style={{ color: "var(--text-secondary)" }}
            >
              Neural Organization
            </span>
          </div>

          <span
            className="text-body-sm"
            style={{ color: "var(--text-muted)" }}
          >
            &copy; {new Date().getFullYear()} The Domain AI Company
          </span>
        </div>
      </div>
    </footer>
  );
}
