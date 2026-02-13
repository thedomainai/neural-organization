import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const year = searchParams.get("year");
  const limit = Math.min(50, Number.parseInt(searchParams.get("limit") || "10"));
  const offset = Number.parseInt(searchParams.get("offset") || "0");

  const where: Record<string, unknown> = {
    status: "published",
  };

  if (year) {
    where.year = Number.parseInt(year);
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: [{ year: "desc" }, { week: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.report.count({ where }),
  ]);

  return NextResponse.json({
    data: reports.map((r: typeof reports[number]) => ({
      id: r.id,
      title: r.title,
      week: r.week,
      year: r.year,
      status: r.status,
      articleCount: r.articleCount,
      publishedAt: r.publishedAt?.toISOString() || null,
    })),
    pagination: {
      total,
      limit,
      offset,
    },
  });
}
