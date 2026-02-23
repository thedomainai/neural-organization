'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Layer } from '../data/types';
import styles from './LayerDetail.module.css';

interface LayerDetailProps {
  layer: Layer;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * レイヤー詳細モーダル
 *
 * Radix UI Dialog で各レイヤーの詳細情報を表示する。
 * LayerPipeline の各レイヤーをクリックすると表示される。
 */
export default function LayerDetail({ layer, isOpen, onClose }: LayerDetailProps) {
  // Layer-specific detailed content
  const layerDetails: Record<number, { responsibilities: string[]; examples: string[] }> = {
    0: {
      responsibilities: [
        'ユーザーからのリクエストを受け取る',
        '外部 API との通信を管理する',
        'データソース（Slack, Gmail, GitHub 等）との接続を維持する',
        '認証・認可を処理する',
      ],
      examples: [
        'Slack メッセージの受信',
        'Gmail からのメール取得',
        'GitHub からの PR イベント受信',
        'ユーザーからの問い合わせ受付',
      ],
    },
    1: {
      responsibilities: [
        '生データをエンティティ（人、プロジェクト、タスク等）に変換する',
        'エンティティ間の関係性を認識する',
        '組織の世界モデルを構築・更新する',
        '文脈を理解し、セマンティックな認識を生成する',
      ],
      examples: [
        'メールの送信者・受信者・内容を抽出',
        'GitHub PR とタスクの関連性を認識',
        '顧客とプロジェクトの関係を把握',
        '会議の議事録から意思決定を抽出',
      ],
    },
    2: {
      responsibilities: [
        'Trust Score に基づいて推論モードを選択する',
        '定型的推論: パターンマッチングで高速処理（Trust < 0.60）',
        '創発的推論: LLM で柔軟に判断（Trust ≥ 0.60）',
        '何をすべきかの判断を下す',
      ],
      examples: [
        '定型: 過去の成功事例に基づく顧客対応',
        '定型: ルールベースのタスク優先順位付け',
        '創発: 複雑な顧客要求への新しい提案',
        '創発: 3+ ドメインにまたがる戦略的判断',
      ],
    },
    3: {
      responsibilities: [
        'Reasoning の判断を具体的なアクションに変換する',
        '外部システムへの API 呼び出しを実行する',
        'ユーザーへの通知・メッセージを送信する',
        '実行結果を記録する',
      ],
      examples: [
        'Slack へのメッセージ送信',
        'GitHub への自動コメント投稿',
        'Notion へのドキュメント作成',
        '顧客へのメール送信',
      ],
    },
    4: {
      responsibilities: [
        '実行結果を評価する（成功 / 失敗 / 部分成功）',
        '成功・失敗のパターンを抽出する',
        'Trust Score を更新する',
        'パターンを Memory に蓄積し、次回の推論に活用する',
      ],
      examples: [
        '顧客対応の成功率を Trust Score に反映',
        '失敗した判断パターンを記録',
        '新しい成功パターンの発見',
        '推論モード閾値の動的調整',
      ],
    },
  };

  const details = layerDetails[layer.level];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <div>
              <div className="text-label-md" style={{ color: layer.color || 'var(--primary-400)' }}>
                Layer {layer.level}
              </div>
              <Dialog.Title className={styles.title}>
                {layer.name}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className={styles.description}>
            {layer.description}
          </Dialog.Description>

          {details && (
            <>
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>主な責任</h4>
                <ul className={styles.list}>
                  {details.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>具体例</h4>
                <ul className={styles.list}>
                  {details.examples.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
