import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { _count: { select: { notes: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: { name: body.name.trim() },
  });

  return NextResponse.json(project, { status: 201 });
}
