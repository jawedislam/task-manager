import Link from "next/link";
import StatusBadge from "./status-badge";

interface NoteCardProps {
  note: {
    id: number;
    title: string;
    dueDate: string | Date;
    halfOfDay: string;
    status: string;
    project: { name: string };
    person: { name: string } | null;
  };
}

const statusBorder: Record<string, string> = {
  OPEN: "border-l-blue-400",
  IN_PROGRESS: "border-l-yellow-400",
  CLOSED: "border-l-green-400",
};

export default function NoteCard({ note }: NoteCardProps) {
  const dueDate = new Date(note.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = dueDate < today && note.status !== "CLOSED";
  const isToday =
    dueDate.toDateString() === new Date().toDateString() &&
    note.status !== "CLOSED";

  const halfLabel = note.halfOfDay === "FIRST_HALF" ? "1st Half" : "2nd Half";

  return (
    <Link
      href={`/notes/${note.id}`}
      className={`block bg-white rounded-lg border border-gray-200 border-l-4 ${
        statusBorder[note.status] ?? "border-l-gray-300"
      } p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-medium text-sm ${
            note.status === "CLOSED"
              ? "text-gray-400 line-through"
              : "text-gray-900"
          }`}
        >
          {note.title}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
            {note.project.name}
          </span>
          <StatusBadge status={note.status} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
        <span
          className={
            isOverdue
              ? "text-red-600 font-semibold"
              : isToday
              ? "text-orange-600 font-semibold"
              : ""
          }
        >
          {isOverdue
            ? `Overdue: ${dueDate.toLocaleDateString()}`
            : isToday
            ? "Due today"
            : `Due: ${dueDate.toLocaleDateString()}`}
          {" - "}
          {halfLabel}
        </span>
        {note.person && (
          <>
            <span>&middot;</span>
            <span>{note.person.name}</span>
          </>
        )}
      </div>
    </Link>
  );
}
