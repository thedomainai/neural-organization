import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get("category");
  const impact = searchParams.get("impact");
  const limit = Math.min(100, Number.parseInt(searchParams.get("limit") || "20"));
  const offset = Number.parseInt(searchParams.get("offset") || "0");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};

  if (category) {
    where.category = category;
  }

  if (impact) {
    where.impactLevel = impact;
  }

  if (from || to) {
    where.publishedAt = {};
    if (from) {
      (where.publishedAt as Record<string, Date>).gte = new Date(from);
    }
    if (to) {
      (where.publishedAt as Record<string, Date>).lte = new Date(to);
    }
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { relevanceScore: "desc" }],
      take: limit,
      skip: offset,
      include: {
        source: {
          select: { name: true },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    data: articles.map((a: typeof articles[number]) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      category: a.category,
      impactLevel: a.impactLevel,
      relevanceScore: a.relevanceScore,
      sourceUrl: a.sourceUrl,
      sourceName: a.source.name,
      publishedAt: a.publishedAt.toISOString(),
    })),
    pagination: {
      total,
      limit,
      offset,
    },
  });
}
