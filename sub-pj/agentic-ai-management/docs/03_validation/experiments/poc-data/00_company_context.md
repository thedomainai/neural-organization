# PoC Sample Data - Company Context

## 架空企業設定

### 会社概要

**社名**: Flowline株式会社
**事業**: B2B SaaS（営業プロセス自動化ツール）
**ステージ**: シリーズB（調達額: 15億円）
**従業員数**: 78名
**ARR**: 4.2億円（目標: 6億円）
**主要KPI達成率**: 70%（Q3時点）

### 組織構成

```
CEO: 田中 健一
├── VP of Sales: 山田 太郎
│   ├── Enterprise Sales: 5名
│   ├── Mid-Market Sales: 8名
│   └── SDR: 4名
├── VP of CS: 佐藤 美咲
│   ├── Onboarding: 3名
│   ├── Success: 6名
│   └── Support: 4名
├── VP of Product: 鈴木 翔太
│   ├── PdM: 3名
│   └── Design: 2名
├── VP of Engineering: 高橋 誠
│   ├── Backend: 8名
│   ├── Frontend: 5名
│   └── SRE: 3名
└── VP of HR: 伊藤 恵子
    └── HR/採用: 4名
```

### 現在の状況（Week 42, 2026年10月）

- Q3終了、Q4開始直後
- Q3のARR目標5億円に対して4.2億円で着地（84%達成）
- 大型案件（A社、年間3,000万円）がQ4にスリップ
- チャーンレートが上昇傾向（前月比+0.3%）
- エンジニア採用が難航（目標5名に対して2名採用）
- 新機能「AI分析ダッシュボード」のリリースが2週間遅延

### KPIツリー（簡略版）

```
ARR 6億円（FY目標）
├── 新規MRR
│   ├── 商談数 × 受注率 × 平均単価
│   │   ├── リード数 × 商談化率
│   │   ├── 受注率（Enterprise / Mid-Market）
│   │   └── 平均単価（アップセル含む）
├── 既存MRR
│   ├── NRR（Net Revenue Retention）
│   │   ├── Expansion（アップセル/クロスセル）
│   │   └── Churn（解約）
│   │       ├── Logo Churn（社数）
│   │       └── Revenue Churn（金額）
└── Churn MRR
    └── 解約理由別分析
```

---

## サンプルデータの使用方法

このディレクトリには以下のサンプルが含まれます：

1. `01_reports_raw.md` - 各部門の週次報告（曖昧性あり・生データ）
2. `02_reports_annotated.md` - 曖昧性パターンのアノテーション付き
3. `03_reports_improved.md` - 曖昧性を排除した改善版

**検証目的**:
- LLMが曖昧性パターンを正しく検出できるか
- 検出精度（Precision/Recall）の測定
- 改善提案の品質評価
