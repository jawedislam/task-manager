import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const managerId = parseInt(id);

  if (isNaN(managerId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.manager.delete({ where: { id: managerId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Manager not found" }, { status: 404 });
  }
}
