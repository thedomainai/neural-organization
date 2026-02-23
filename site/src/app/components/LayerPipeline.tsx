'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { layers, crosscuttingElements } from '../data/layers';
import { pipelineLayer, staggerContainer } from '../lib/animations';
import LayerDetail from './LayerDetail';
import type { Layer } from '../data/types';

/**
 * 5層パイプライン図
 *
 * 縦方向のビジュアルパイプラインとして Layer 0-4 を表示する。
 * スクロール連動でアニメーションし、各レイヤーの役割を明確に伝える。
 */
export default function LayerPipeline() {
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-5)',
      }}
    >
      {/* Pipeline Container */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
      >
        {/* 中央の接続線 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '5%',
            bottom: '5%',
            width: '2px',
            background:
              'linear-gradient(180deg, transparent, var(--primary-500), transparent)',
            transform: 'translateX(-50%)',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />

        {/* Layer Cards */}
        {layers.map((layer, index) => (
          <motion.div
            key={layer.id}
            custom={index}
            variants={pipelineLayer}
            style={{
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              className="glass-tinted"
              onClick={() => setSelectedLayer(layer)}
              style={{
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                borderLeft: `4px solid ${layer.color || 'var(--primary-500)'}`,
                transition: 'all var(--duration-fast) var(--ease-default)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-300)';
                e.currentTarget.style.boxShadow = 'var(--glow-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = layer.color || 'var(--primary-500)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'var(--space-4)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <div
                  className="text-label-md"
                  style={{
                    color: layer.color || 'var(--primary-400)',
                  }}
                >
                  L{layer.level}
                </div>
                <h3 className="text-heading-md">{layer.name}</h3>
              </div>
              <p
                className="text-body-md"
                style={{ color: 'var(--text-secondary)' }}
              >
                {layer.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Crosscutting Elements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        style={{
          marginTop: 'var(--space-8)',
          padding: 'var(--space-6)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div
          className="text-label-md"
          style={{
            color: 'var(--glow-400)',
            marginBottom: 'var(--space-5)',
          }}
        >
          Crosscutting Elements
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {crosscuttingElements.map((element) => (
            <div key={element.id}>
              <div
                className="text-label-lg"
                style={{
                  marginBottom: 'var(--space-2)',
                }}
              >
                {element.name}
              </div>
              <p
                className="text-body-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {element.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Layer Detail Modal */}
      {selectedLayer && (
        <LayerDetail
          layer={selectedLayer}
          isOpen={!!selectedLayer}
          onClose={() => setSelectedLayer(null)}
        />
      )}
    </div>
  );
}
