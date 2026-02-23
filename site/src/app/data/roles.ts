/**
 * 人間の参与形態データ
 *
 * ParadigmShift.tsx から抽出。
 * AGI 時代の5つの人間の役割を定義する。
 */

export interface HumanRole {
  name: string;
  nameJa: string;
  description: string;
}

export const roles: HumanRole[] = [
  {
    name: 'Governor',
    nameJa: '統治者',
    description:
      '組織の存在理由を定義する。Purpose と Values の源泉。意味という、AGI が生成できない唯一のものを供給する。',
  },
  {
    name: 'Sensemaker',
    nameJa: '意味付与者',
    description:
      'データが捉えられない主観的人間体験をシステムに翻訳する。定量化できない質的現実を、世界モデルに統合する。',
  },
  {
    name: 'Creator',
    nameJa: '創造者',
    description:
      'まだ存在しないものを構想する。「何を存在させるべきか」という問いの設定自体が創造行為であり、Purpose から導かれる。',
  },
  {
    name: 'Connector',
    nameJa: '接続者',
    description:
      '人間同士の信頼・共感・関係性を構築する。AGI 時代においても、人間は人間を信頼する。この媒介は不可分に人間的である。',
  },
  {
    name: 'Custodian',
    nameJa: '守護者',
    description:
      'システムの行動が価値観・倫理・規範と整合しているかを監視する。AGI の能力が大きいほど、守護者の重要性は増す。',
  },
];

export interface ParadigmShift {
  old: string;
  reason: string;
  neural: string;
}

export const shifts: ParadigmShift[] = [
  {
    old: '部門（営業部、開発部…）',
    reason: '人間は専門化しなければ深い知能を発揮できない',
    neural: '全領域を横断する流体的インテリジェンス',
  },
  {
    old: '階層（マネージャー、VP…）',
    reason: '人間がマネジメントできる直属は 5-10 人',
    neural: '意志グラフ（Purpose → Outcomes）',
  },
  {
    old: '肩書・職種',
    reason: '専門性と権限を示すシグナル',
    neural: '参与形態: Governor, Sensemaker, Creator, Connector, Custodian',
  },
  {
    old: '会議',
    reason: '分散した認知を同期させる手段',
    neural: '連続的なアンビエント・インテリジェンス',
  },
  {
    old: 'プロセス・SOP',
    reason: '属人性を排除し一貫した品質を担保',
    neural: '創発的な最適行動',
  },
  {
    old: 'メール・チャット',
    reason: '人間同士の非同期情報伝達',
    neural: '意志界面（Intent Interface）',
  },
];
