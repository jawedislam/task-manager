import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const managerId = searchParams.get("managerId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (managerId) where.managerId = parseInt(managerId);

  const tasks = await prisma.task.findMany({
    where,
    include: { manager: true },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.dueDate) {
    return NextResponse.json(
      { error: "Due date is required" },
      { status: 400 }
    );
  }

  const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const priority = body.priority?.toUpperCase() || "MEDIUM";
  if (!validPriorities.includes(priority)) {
    return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      dueDate: new Date(body.dueDate),
      priority,
      managerId: body.managerId ? parseInt(body.managerId) : null,
    },
    include: { manager: true },
  });

  return NextResponse.json(task, { status: 201 });
}
