import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/status-badge";
import NoteActions from "./note-actions";
import AddComment from "./add-comment";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailPage({ params }: Props) {
  const { id } = await params;
  const noteId = parseInt(id);

  if (isNaN(noteId)) notFound();

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      project: true,
      person: true,
      comments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!note) notFound();

  const dueDate = new Date(note.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = dueDate < today && note.status !== "CLOSED";
  const halfLabel = note.halfOfDay === "FIRST_HALF" ? "1st Half" : "2nd Half";

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/notes" className="hover:text-gray-700">
          Notes
        </Link>
        <span>/</span>
        <span className="text-gray-900">{note.title}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{note.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={note.status} />
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                {note.project.name}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/notes/${note.id}/edit`}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Edit
            </Link>
            <NoteActions noteId={note.id} currentStatus={note.status} />
          </div>
        </div>

        {note.description && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-gray-500">Description</h2>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">
              {note.description}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Due Date</h2>
            <p
              className={`mt-1 text-sm font-medium ${
                isOverdue ? "text-red-600" : "text-gray-900"
              }`}
            >
              {dueDate.toLocaleDateString()} - {halfLabel}
              {isOverdue && " (Overdue)"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Project</h2>
            <p className="mt-1 text-sm text-gray-900">{note.project.name}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Person</h2>
            <p className="mt-1 text-sm text-gray-900">
              {note.person?.name ?? "None"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Created</h2>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Updated</h2>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(note.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Comments ({note.comments.length})
        </h2>

        <AddComment noteId={note.id} />

        {note.comments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {note.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{comment.text}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
