import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NoteCard from "@/components/note-card";
import NoteFilters from "@/components/note-filters";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ status?: string; projectId?: string; notClosed?: string; date?: string }>;
}

export default async function NotesPage({ searchParams }: Props) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};

  if (params.notClosed === "true") {
    where.status = { not: "CLOSED" };
  } else if (params.status) {
    where.status = params.status;
  }

  if (params.projectId) where.projectId = parseInt(params.projectId);

  if (params.date) {
    const start = new Date(params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(params.date);
    end.setHours(23, 59, 59, 999);
    where.dueDate = { gte: start, lte: end };
  }

  const [notes, projects, counts] = await Promise.all([
    prisma.note.findMany({
      where,
      include: { project: true, person: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
    prisma.note.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) {
    countMap[c.status] = c._count;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="mt-1 text-sm text-gray-500">
            {countMap.OPEN ?? 0} open &middot;{" "}
            {countMap.IN_PROGRESS ?? 0} in progress &middot;{" "}
            {countMap.CLOSED ?? 0} closed
          </p>
        </div>
        <Link
          href="/notes/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          New Note
        </Link>
      </div>

      <div className="mt-4">
        <NoteFilters projects={projects} />
      </div>

      <div className="mt-4 space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No notes found</p>
            <p className="mt-1 text-sm">
              {Object.keys(params).length > 0
                ? "Try adjusting your filters."
                : "Create your first note to get started."}
            </p>
          </div>
        ) : (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </div>
    </div>
  );
}
