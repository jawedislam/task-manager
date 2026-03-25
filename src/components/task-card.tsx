import Link from "next/link";
import StatusBadge from "./status-badge";
import PriorityBadge from "./priority-badge";

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    dueDate: string | Date;
    priority: string;
    status: string;
    manager: { name: string } | null;
  };
}

const priorityBorder: Record<string, string> = {
  LOW: "border-l-green-400",
  MEDIUM: "border-l-yellow-400",
  HIGH: "border-l-orange-400",
  URGENT: "border-l-red-400",
};

export default function TaskCard({ task }: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = dueDate < today && task.status !== "COMPLETED";
  const isToday =
    dueDate.toDateString() === new Date().toDateString() &&
    task.status !== "COMPLETED";

  return (
    <Link
      href={`/tasks/${task.id}`}
      className={`block bg-white rounded-lg border border-gray-200 border-l-4 ${
        priorityBorder[task.priority] ?? "border-l-gray-300"
      } p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-medium text-sm ${
            task.status === "COMPLETED"
              ? "text-gray-400 line-through"
              : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
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
        </span>
        {task.manager && (
          <>
            <span>&middot;</span>
            <span>{task.manager.name}</span>
          </>
        )}
      </div>
    </Link>
  );
}
