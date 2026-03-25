import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const managers = await prisma.manager.findMany({
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(managers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const manager = await prisma.manager.create({
    data: {
      name: body.name.trim(),
      email: body.email?.trim() || null,
    },
  });

  return NextResponse.json(manager, { status: 201 });
}
