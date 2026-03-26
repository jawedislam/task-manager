import { prisma } from "@/lib/prisma";
import NoteForm from "@/components/note-form";

export const dynamic = "force-dynamic";

export default async function NewNotePage() {
  const [projects, people] = await Promise.all([
    prisma.project.findMany({ orderBy: { name: "asc" } }),
    prisma.person.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create Note</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new note to track.
      </p>
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <NoteForm projects={projects} people={people} />
      </div>
    </div>
  );
}
