/**
 * 5層パイプラインデータ（Layer 0-4）
 *
 * Architecture.tsx から抽出したレイヤー定義。
 * ADR 007, 008 の設計を反映。
 */

import { Layer, CrosscuttingElement } from './types';

export const layers: Layer[] = [
  {
    id: 'layer-0',
    level: 0,
    name: 'Interface',
    description:
      '外部世界（ユーザー、API、データソース）とのやりとりを管理する',
    color: 'var(--primary-400)',
  },
  {
    id: 'layer-1',
    level: 1,
    name: 'Perception',
    description:
      '生データをセマンティックな認識に変換し、組織状態のエンティティモデルを構築する',
    color: 'var(--primary-500)',
  },
  {
    id: 'layer-2',
    level: 2,
    name: 'Reasoning',
    description:
      '状況に応じて定型的推論（Trust Score < 0.60）と創発的推論（Trust Score ≥ 0.60）を使い分け、何をすべきか判断する。過去の成功パターンに合致する場合は定型的推論で高速処理し、未知の状況では創発的推論で柔軟に対応する',
    color: 'var(--primary-600)',
  },
  {
    id: 'layer-3',
    level: 3,
    name: 'Execution',
    description:
      'Reasoning の判断を具体的なアクションに変換し、外部システムやユーザーに対して実行する',
    color: 'var(--primary-700)',
  },
  {
    id: 'layer-4',
    level: 4,
    name: 'Reflection',
    description:
      '実行結果を評価し、成功・失敗のパターンを抽出してメモリに蓄積する。Trust Score を更新し、次回の推論モード選択に影響を与える',
    color: 'var(--primary-800)',
  },
];

export const crosscuttingElements: CrosscuttingElement[] = [
  {
    id: 'purpose',
    name: 'Purpose',
    description:
      'システム全体の存在理由。人間が明示的に与え、全レイヤーの判断基準となる',
  },
  {
    id: 'governance',
    name: 'Governance',
    description:
      '権限と責任の境界。システムの行動可能範囲と人間への確認が必要な境界を定義する',
  },
  {
    id: 'memory',
    name: 'Memory',
    description:
      '組織の状態とパターンをアドレッサブルなパス階層で管理する。/entities/, /relations/, /sessions/, /metrics/, /patterns/, /config/, /traces/ の7つの名前空間で構成され、最大2階層の深さで AI が効率的にアクセスできる',
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    description:
      'レイヤー間のフロー制御。データの流れと処理の順序を制御し、システム全体を調和させる',
  },
];
