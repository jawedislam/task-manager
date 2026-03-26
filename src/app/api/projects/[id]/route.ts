import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const projectId = parseInt(id);

  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const noteCount = await prisma.note.count({ where: { projectId } });
  if (noteCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete project with existing notes. Remove the notes first." },
      { status: 400 }
    );
  }

  try {
    await prisma.project.delete({ where: { id: projectId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
}
