import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const personId = parseInt(id);

  if (isNaN(personId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.person.delete({ where: { id: personId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Person not found" }, { status: 404 });
  }
}
