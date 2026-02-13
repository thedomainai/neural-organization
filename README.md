# Neural Organization

> 組織は、知能が希少だった時代の発明である。Neural Organization は「組織に AI を導入する」話ではない。AGI 時代において、人間が目的・価値観・創造性を注入し、システムが知覚・推論・行動を無限にスケールさせる — 組織そのものの次の形態を定義するプロジェクトである。

## ドキュメント構造

本リポジトリのドキュメントは 4 つの知的階層で構成されている。

```
思想 (WHY)      concept.md → design.md
                 │
詳細設計 (WHAT)   ├── docs/philosophy/    各要素の深掘り
                 ├── docs/hitl/          人間界面の設計
                 │
適用 (HOW)       ├── docs/agentic-ai-framework.md   構築フレームワーク
                 └── docs/ax-company-design.md       統合設計・監査
                      │
実装 (WHERE)          sub-pj/             各プロダクトの実装
```

| 階層 | ファイル | 内容 |
|---|---|---|
| 思想 | [docs/concept.md](docs/concept.md) | 概念・思想・戦略の定義 |
| 思想 | [docs/design.md](docs/design.md) | 5 層 + 4 横断要素の詳細設計 |
| 詳細設計 | [docs/philosophy/](docs/philosophy/) | 各レイヤー・横断要素の設計思想（10 ファイル） |
| 詳細設計 | [docs/hitl/](docs/hitl/) | HITL 情報抽出要件・抽出パターン設計 |
| 適用 | [docs/agentic-ai-framework.md](docs/agentic-ai-framework.md) | Neural Organization 準拠 Agentic AI の構築フレームワーク |
| 適用 | [docs/ax-company-design.md](docs/ax-company-design.md) | 全サブプロジェクトの思想監査・統合ロードマップ |
| 設計判断 | [docs/decisions/](docs/decisions/) | アーキテクチャ判断の記録（5 件） |

## 読む順序

1. **[docs/concept.md](docs/concept.md)** — Neural Organization とは何か。Thesis、5 層認知パイプライン、6 つの設計原則
2. **[docs/design.md](docs/design.md)** — どう設計されているか。各レイヤーの具体例・定量モデル・Trust Score
3. **[docs/philosophy/](docs/philosophy/)** — 興味のある要素を深掘り（各 400-800 行の詳細設計）
4. **[docs/ax-company-design.md](docs/ax-company-design.md)** — 思想がどう実プロダクトに適用されているか

## アーキテクチャ概要

Neural Organization は 5 層認知パイプラインと 4 つの横断的要素で構成される。

```
        ┌─────────────────────────────────────────┐
        │              Purpose（目的）               │
        ├─────────────────────────────────────────┤
        │  L0 Perception → L1 Understanding →     │
        │  L2 Reasoning → L3 Execution →          │
        │  L4 Reflection                          │
        ├─────────────────────────────────────────┤
        │  Governance │ Memory │ Orchestration     │
        └─────────────────────────────────────────┘
```

**6 つの設計原則**: Intent over Instruction / Governance not Control / Ambient Presence / Radical Transparency / Agency Preservation / Mutual Evolution

## プロダクト群

Neural Organization は思想であり、同時にプロダクト群の総体である。この思想を現実の組織に届けるために、以下のプロダクトが存在する。

```
Neural Organization（思想・ビジョン）
│
├── Neumann          — AI ネイティブ経営管理（Perception → Reflection の全層）
├── sales-ai         — AI ネイティブ営業（データと推論に基づく営業活動）
├── analytics-ai     — AI ネイティブ分析（目的駆動の自律的データ分析）
└── ax               — 技術基盤（エージェント実行・ツール接続・推論パイプライン）
```

### サブプロジェクト一覧

| ディレクトリ | プロダクト | 技術スタック | v2 設計 | 実装状態 |
|---|---|---|---|---|
| `sub-pj/neumann/` | Neumann | Next.js 14 / TypeScript | [design-v2](sub-pj/neumann/docs/design-v2-management-cycle.md) | v1 実装済み |
| `sub-pj/agentic-ai-hr/` | HR Policy Advisor | Python / FastAPI | [design-v2](sub-pj/agentic-ai-hr/docs/design-v2-neural-org-aligned.md) | v1 実装済み |
| `sub-pj/agentic-ai-sales/` | Sales Presentation | Python CLI | [design-v2](sub-pj/agentic-ai-sales/docs/design-v2-revenue-cycle.md) | v1 実装済み |
| `sub-pj/agentic-ai-analysis/` | Analysis Cycle | Python | [design-v2](sub-pj/agentic-ai-analysis/docs/design-v2-analysis-cycle.md) | 設計のみ |
| `sub-pj/ai-executive-dashboard/` | Executive Dashboard | Next.js 14 / Prisma | — | v1 実装済み |
| `sub-pj/hr-system-lings/` | HR 制度定義書 | HTML / JS | — | ナレッジベース |
| `sub-pj/neural-organization-v1-visual/` | v1 ビジュアル | HTML | — | 静的サイト |

上位 4 プロジェクト（Neumann, HR, Sales, Analysis）は v2 設計で Neural Organization の 5 層アーキテクチャに準拠し、合計 32 エージェント・27 HITL ゲートを持つ統合された組織知能を形成する。詳細は [docs/ax-company-design.md](docs/ax-company-design.md) を参照。

## ランディングサイト

`site/` に Next.js 16 ベースのランディングページを格納している。Neural Organization の思想をビジュアルで表現する顧客向けサイト。

```bash
cd site
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
```

## docs/ 詳細構成

### docs/philosophy/

| ファイル | 対象 |
|---|---|
| [purpose-design.md](docs/philosophy/purpose-design.md) | Purpose（目的）の詳細設計 |
| [governance-design.md](docs/philosophy/governance-design.md) | Governance と Trust Score |
| [memory-design.md](docs/philosophy/memory-design.md) | Memory 3 構造（長期・作業・評価） |
| [orchestration-design.md](docs/philosophy/orchestration-design.md) | フロー制御・リソース配分 |
| [interface-design.md](docs/philosophy/interface-design.md) | 5 つのインタフェースモード |
| [tool-integration-design.md](docs/philosophy/tool-integration-design.md) | Layer 0 接続ツール群 |
| [layer1-understanding-design.md](docs/philosophy/layer1-understanding-design.md) | エンティティモデル・因果モデル |
| [layer2-reasoning-design.md](docs/philosophy/layer2-reasoning-design.md) | 領域横断的推論・行動計画 |
| [layer3-execution-design.md](docs/philosophy/layer3-execution-design.md) | アーティファクト生成・品質チェック |
| [layer4-reflection-design.md](docs/philosophy/layer4-reflection-design.md) | 内省と学習メカニズム |

### docs/hitl/

| ファイル | 内容 |
|---|---|
| [information-requirements.md](docs/hitl/information-requirements.md) | 27 ゲート × 6 盲点分類の情報抽出要件 |
| [extraction-patterns.md](docs/hitl/extraction-patterns.md) | 10 抽出パターン × 27 ゲートの具体的プロトコル |

### docs/decisions/

| # | ファイル | 状態 |
|---|---|---|
| 001 | [product-concept-design.md](docs/decisions/001-product-concept-design.md) | 確定 |
| 002 | [agi-era-concept-reconstruction.md](docs/decisions/002-agi-era-concept-reconstruction.md) | 仮説 |
| 003 | [seven-layer-intelligence-architecture.md](docs/decisions/003-seven-layer-intelligence-architecture.md) | ARCHIVED — 5 層に統合 |
| 004 | [five-layer-consolidation.md](docs/decisions/004-five-layer-consolidation.md) | ARCHIVED — design.md に統合 |
| 005 | [v1-design-integration.md](docs/decisions/005-v1-design-integration.md) | ARCHIVED — v2 設計で置換 |
