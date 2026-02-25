import { compileMDX } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug, getAllPosts } from "../../lib/blog";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ParticipationForms from "../../components/blog/ParticipationForms";
import DesignPrinciples from "../../components/blog/DesignPrinciples";
import FiveLayerPipeline from "../../components/blog/FiveLayerPipeline";
import TrustScoreProgression from "../../components/blog/TrustScoreProgression";
import AttentionBudgetLevels from "../../components/blog/AttentionBudgetLevels";
import DualReasoningModes from "../../components/blog/DualReasoningModes";
import CrossDomainEffect from "../../components/blog/CrossDomainEffect";
import PhaseTimeline from "../../components/blog/PhaseTimeline";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  return {
    title: `${meta.title} — Neural Organization Blog`,
    description: meta.description,
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
      authors: ["The Domain AI"],
      siteName: "Neural Organization",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

const mdxComponents = {
  ParticipationForms,
  DesignPrinciples,
  FiveLayerPipeline,
  TrustScoreProgression,
  AttentionBudgetLevels,
  DualReasoningModes,
  CrossDomainEffect,
  PhaseTimeline,
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  const posts = getAllPosts();
  const currentIdx = posts.findIndex((p) => p.slug === slug);
  const prev = currentIdx > 0 ? posts[currentIdx - 1] : null;
  const next = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;

  const { content: mdxContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  const formattedDate = new Date(meta.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    author: { "@type": "Organization", name: "The Domain AI" },
    publisher: { "@type": "Organization", name: "The Domain AI" },
    datePublished: meta.date,
    articleSection: `Part ${meta.order} of 5`,
  };

  return (
    <>
      <Header navItems={navItems} ctaLabel="Contact" ctaHref="/#contact" />
      <main style={{ paddingTop: 120, minHeight: "100vh" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="section-container" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: "var(--space-8)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-3)",
              }}
            >
              <span
                className="text-body-sm"
                style={{ color: "var(--primary-400)", fontWeight: 500 }}
              >
                Part {meta.order} of 5
              </span>
              <span style={{ color: "var(--border-subtle)" }}>|</span>
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                {formattedDate}
              </span>
            </div>
            <h1 className="text-display-md" style={{ marginBottom: "var(--space-4)" }}>
              {meta.title}
            </h1>
            <p className="text-body-lg" style={{ color: "var(--text-secondary)" }}>
              {meta.description}
            </p>
          </div>

          <div className="blog-content">{mdxContent}</div>

          {/* Prev / Next navigation */}
          <nav
            style={{
              marginTop: "var(--space-9)",
              paddingTop: "var(--space-7)",
              borderTop: "var(--separator)",
              display: "flex",
              justifyContent: "space-between",
              gap: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            {prev ? (
              <a
                href={`/blog/${prev.slug}`}
                style={{
                  textDecoration: "none",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                }}
              >
                <span style={{ display: "block", color: "var(--text-muted)", marginBottom: 4 }}>
                  Previous
                </span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  {prev.title}
                </span>
              </a>
            ) : (
              <div />
            )}
            {next ? (
              <a
                href={`/blog/${next.slug}`}
                style={{
                  textDecoration: "none",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  textAlign: "right",
                }}
              >
                <span style={{ display: "block", color: "var(--text-muted)", marginBottom: 4 }}>
                  Next
                </span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  {next.title}
                </span>
              </a>
            ) : (
              <div />
            )}
          </nav>
        </article>
      </main>
      <Footer variant="customer" />
    </>
  );
}
