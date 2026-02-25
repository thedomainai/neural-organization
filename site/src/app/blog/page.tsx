import { getAllPosts } from "../lib/blog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Neural Organization",
  description:
    "Neural Organization の思想・設計・実装に関するブログ記事。AGI 時代の組織アーキテクチャを解説します。",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Header navItems={navItems} ctaLabel="Contact" ctaHref="/#contact" />
      <main style={{ paddingTop: 120, minHeight: "100vh" }}>
        <div className="section-container">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h1
              className="text-display-md"
              style={{ marginBottom: "var(--space-4)" }}
            >
              Blog
            </h1>
            <p
              className="text-body-lg"
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--space-9)",
              }}
            >
              Neural Organization の思想・設計・コンセプトを解説する5部構成のブログシリーズです。
            </p>

            <div>
              {posts.map((post, i) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    padding: "var(--space-6) 0",
                    borderBottom:
                      i < posts.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    Part {post.order}
                  </span>
                  <h2
                    style={{
                      color: "var(--text-primary)",
                      fontSize: 18,
                      fontWeight: 700,
                      marginTop: "var(--space-2)",
                      marginBottom: "var(--space-2)",
                      lineHeight: 1.4,
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-body-md"
                    style={{ color: "var(--neutral-800)", margin: 0 }}
                  >
                    {post.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer variant="customer" />
    </>
  );
}
