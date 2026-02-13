# neumann

AI-Driven Weekly Meeting Report Assistant - 曖昧性を排除し、経営会議の生産性を最大化する

## Overview

neumannは、週次ミーティングレポートの曖昧性を自動検出し、マネージャーに明確化を促すことで、経営陣への報告品質を向上させるAIアシスタントです。

## Documentation

詳細なドキュメントは [docs/](./docs/) を参照してください：

- [Vision](./docs/00_vision/) - プロジェクトビジョン
- [Concept](./docs/01_concept/) - コンセプト・設計思想
- [Product](./docs/02_product/) - プロダクト仕様・アーキテクチャ
- [Validation](./docs/03_validation/) - 仮説検証・PoC
- [Business](./docs/04_business/) - ビジネスモデル・市場分析
- [Decisions](./docs/05_decisions/) - 意思決定記録

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: React + Tailwind CSS
- **State Management**: Zustand
- **LLM**: Claude API (Anthropic)
- **Auth**: NextAuth.js

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

詳細は [src/README.md](./src/README.md) を参照。

```
src/
├── app/          # Next.js App Router
├── components/   # 共通UIコンポーネント
├── features/     # 機能ドメイン
├── domain/       # ビジネスロジック（★コア）
├── services/     # 外部サービス統合
├── lib/          # ユーティリティ
├── store/        # 状態管理
├── types/        # 型定義
└── styles/       # スタイル
```

## License

Private
