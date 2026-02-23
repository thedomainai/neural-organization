import LayerPipeline from './LayerPipeline';

/**
 * How It Works セクション
 *
 * 5層アーキテクチャを非テクニカルに解説する。
 * LayerPipeline コンポーネントで視覚的に表現。
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="section-container">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">
          5つのレイヤーで
          <br />
          知覚から行動まで自律化する
        </h2>
        <p className="section-desc" style={{ marginBottom: 'var(--space-9)' }}>
          Neural Organization は5つのレイヤー（Layer 0-4）で構成される認知パイプラインです。
          データを取り込み、意味を理解し、判断を下し、実行し、結果から学習する—
          この循環が組織の知能を形成します。
        </p>

        <LayerPipeline />

        <p
          className="text-body-lg"
          style={{
            color: 'var(--text-secondary)',
            maxWidth: 640,
            margin: 'var(--space-9) auto 0',
            textAlign: 'center',
          }}
        >
          このパイプラインを横断するのが Purpose（目的）、Governance（統治）、Memory（記憶）、
          Orchestration（調和）の4つの要素です。これらがシステム全体の判断基準を定め、
          組織の「知能」としての一貫性を保証します。
        </p>
      </div>
    </section>
  );
}
