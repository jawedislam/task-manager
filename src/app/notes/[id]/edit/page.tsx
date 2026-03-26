import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NoteForm from "@/components/note-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: Props) {
  const { id } = await params;
  const noteId = parseInt(id);

  if (isNaN(noteId)) notFound();

  const [note, projects, people] = await Promise.all([
    prisma.note.findUnique({ where: { id: noteId } }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
    prisma.person.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!note) notFound();

  const noteData = {
    id: note.id,
    title: note.title,
    description: note.description,
    dueDate: new Date(note.dueDate).toISOString().split("T")[0],
    halfOfDay: note.halfOfDay,
    status: note.status,
    comment: note.comment,
    projectId: note.projectId,
    personId: note.personId,
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/notes" className="hover:text-gray-700">
          Notes
        </Link>
        <span>/</span>
        <Link href={`/notes/${note.id}`} className="hover:text-gray-700">
          {note.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900">Edit</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <NoteForm projects={projects} people={people} note={noteData} />
      </div>
    </div>
  );
}
