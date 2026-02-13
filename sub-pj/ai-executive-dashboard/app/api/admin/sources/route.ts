import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Simple admin auth check
function isAdmin(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === process.env.ADMIN_API_KEY;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sources = await prisma.source.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });

  return NextResponse.json({
    data: sources.map((s: typeof sources[number]) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      url: s.url,
      categoryHint: s.categoryHint,
      enabled: s.enabled,
      fetchInterval: s.fetchInterval,
      lastFetchedAt: s.lastFetchedAt?.toISOString() || null,
      failureCount: s.failureCount,
      articleCount: s._count.articles,
    })),
  });
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { name, type, url, categoryHint, fetchInterval } = body;

  if (!name || !type || !url) {
    return NextResponse.json(
      { error: "Missing required fields: name, type, url" },
      { status: 400 }
    );
  }

  if (!["rss", "blog"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid type. Must be 'rss' or 'blog'" },
      { status: 400 }
    );
  }

  const source = await prisma.source.create({
    data: {
      name,
      type,
      url,
      categoryHint: categoryHint || null,
      fetchInterval: fetchInterval || 240,
    },
  });

  return NextResponse.json({ data: source }, { status: 201 });
}
