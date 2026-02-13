import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      reportArticles: {
        include: {
          article: {
            select: {
              id: true,
              title: true,
              sourceUrl: true,
              category: true,
            },
          },
        },
      },
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      id: report.id,
      title: report.title,
      week: report.week,
      year: report.year,
      content: report.content,
      status: report.status,
      version: report.version,
      articleCount: report.articleCount,
      categoryBreakdown: report.categoryBreakdown,
      generatedAt: report.generatedAt.toISOString(),
      publishedAt: report.publishedAt?.toISOString() || null,
      articles: report.reportArticles.map((ra: typeof report.reportArticles[number]) => ra.article),
    },
  });
}
