import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAdmin(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === process.env.ADMIN_API_KEY;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const { name, type, url, categoryHint, enabled, fetchInterval } = body;

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (type !== undefined) updateData.type = type;
  if (url !== undefined) updateData.url = url;
  if (categoryHint !== undefined) updateData.categoryHint = categoryHint;
  if (enabled !== undefined) updateData.enabled = enabled;
  if (fetchInterval !== undefined) updateData.fetchInterval = fetchInterval;

  const source = await prisma.source.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ data: source });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.source.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
