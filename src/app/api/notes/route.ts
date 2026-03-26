import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const projectId = searchParams.get("projectId");
  const notClosed = searchParams.get("notClosed");
  const date = searchParams.get("date");

  const where: Record<string, unknown> = {};

  if (notClosed === "true") {
    where.status = { not: "CLOSED" };
  } else if (status) {
    where.status = status;
  }

  if (projectId) where.projectId = parseInt(projectId);

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    where.dueDate = { gte: start, lte: end };
  }

  const notes = await prisma.note.findMany({
    where,
    include: { project: true, person: true },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.dueDate) {
    return NextResponse.json({ error: "Due date is required" }, { status: 400 });
  }
  if (!body.projectId) {
    return NextResponse.json({ error: "Project is required" }, { status: 400 });
  }

  const validHalves = ["FIRST_HALF", "SECOND_HALF"];
  const halfOfDay = body.halfOfDay || "FIRST_HALF";
  if (!validHalves.includes(halfOfDay)) {
    return NextResponse.json({ error: "Invalid half of day" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      dueDate: new Date(body.dueDate),
      halfOfDay,
      comment: body.comment?.trim() || null,
      projectId: parseInt(body.projectId),
      personId: body.personId ? parseInt(body.personId) : null,
    },
    include: { project: true, person: true },
  });

  return NextResponse.json(note, { status: 201 });
}
