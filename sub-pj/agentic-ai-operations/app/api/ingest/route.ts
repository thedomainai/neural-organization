import { NextRequest, NextResponse } from "next/server";
import { fetchAllSources, fetchSource } from "@/lib/services/fetcher";

function isAdmin(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === process.env.ADMIN_API_KEY;
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { sourceId } = body;

  try {
    if (sourceId) {
      // Fetch specific source
      const result = await fetchSource(sourceId);
      return NextResponse.json({ data: result });
    }
    // Fetch all enabled sources
    const results = await fetchAllSources();
    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ingest failed" },
      { status: 500 }
    );
  }
}
