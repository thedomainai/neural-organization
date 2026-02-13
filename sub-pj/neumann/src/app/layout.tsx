import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'neumann - AI-Driven Report Assistant',
  description: '曖昧性を排除し、経営会議の生産性を最大化する',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-background-base text-foreground-primary">
        {children}
      </body>
    </html>
  );
}
