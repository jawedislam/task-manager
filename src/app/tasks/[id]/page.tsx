import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/status-badge";
import PriorityBadge from "@/components/priority-badge";

export const dynamic = "force-dynamic";
import TaskActions from "./task-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;
  const taskId = parseInt(id);

  if (isNaN(taskId)) notFound();

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { manager: true },
  });

  if (!task) notFound();

  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = dueDate < today && task.status !== "COMPLETED";

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/tasks" className="hover:text-gray-700">
          Tasks
        </Link>
        <span>/</span>
        <span className="text-gray-900">{task.title}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Edit
            </Link>
            <TaskActions taskId={task.id} currentStatus={task.status} />
          </div>
        </div>

        {task.description && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-gray-500">Description</h2>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Due Date</h2>
            <p
              className={`mt-1 text-sm font-medium ${
                isOverdue ? "text-red-600" : "text-gray-900"
              }`}
            >
              {dueDate.toLocaleDateString()}
              {isOverdue && " (Overdue)"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Manager</h2>
            <p className="mt-1 text-sm text-gray-900">
              {task.manager?.name ?? "Unassigned"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Created</h2>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Reminder</h2>
            <p className="mt-1 text-sm text-gray-900">
              {task.reminderSent ? "Sent" : "Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
