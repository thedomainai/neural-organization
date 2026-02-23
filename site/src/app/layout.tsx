import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neural Organization — 組織の次の形態",
  description:
    "人間が意志を注入し、システムが知覚・推論・行動を無限にスケールさせる。Neural Organization は AI を使う組織のためのツールではなく、組織そのものの次の形態です。",
  icons: {
    icon: '/favicon.svg',
  },
  keywords: [
    "AI Transformation",
    "Autonomous Organization",
    "Organizational Intelligence",
    "Neural Organization",
    "AGI Era",
    "自律的組織知能",
  ],
  authors: [{ name: "The Domain AI" }],
  creator: "The Domain AI",
  publisher: "The Domain AI",
  metadataBase: new URL("https://neural-organization.thedomainai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "Neural Organization — 組織の次の形態",
    description:
      "人間が意志を注入し、システムが知覚・推論・行動を無限にスケールさせる。組織そのものの次の形態。",
    siteName: "Neural Organization",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Organization — 組織の次の形態",
    description:
      "人間が意志を注入し、システムが知覚・推論・行動を無限にスケールさせる。組織そのものの次の形態。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
