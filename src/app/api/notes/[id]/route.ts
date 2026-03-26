import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const noteId = parseInt(id);

  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { project: true, person: true, comments: { orderBy: { createdAt: "desc" } } },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const noteId = parseInt(id);

  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) data.title = body.title.trim();
  if (body.description !== undefined) data.description = body.description?.trim() || null;
  if (body.dueDate !== undefined) data.dueDate = new Date(body.dueDate);
  if (body.halfOfDay !== undefined) data.halfOfDay = body.halfOfDay;
  if (body.status !== undefined) data.status = body.status;
  if (body.projectId !== undefined) data.projectId = parseInt(body.projectId);
  if (body.personId !== undefined) data.personId = body.personId ? parseInt(body.personId) : null;

  try {
    // If a comment is provided, add it as a new comment entry
    const commentText = body.comment?.trim();
    if (commentText) {
      await prisma.comment.create({ data: { text: commentText, noteId } });
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data,
      include: { project: true, person: true, comments: { orderBy: { createdAt: "desc" } } },
    });
    return NextResponse.json(note);
  } catch {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const noteId = parseInt(id);

  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.note.delete({ where: { id: noteId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }
}
