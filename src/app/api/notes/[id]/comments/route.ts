import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const noteId = parseInt(id);

  if (isNaN(noteId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await request.json();
  const text = body.text?.trim();

  if (!text) {
    return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
  }

  // Verify note exists
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  // Touch the note's updatedAt
  await prisma.note.update({ where: { id: noteId }, data: {} });

  const comment = await prisma.comment.create({
    data: { text, noteId },
  });

  return NextResponse.json(comment, { status: 201 });
}
