import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TaskForm from "@/components/task-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: Props) {
  const { id } = await params;
  const taskId = parseInt(id);

  if (isNaN(taskId)) notFound();

  const [task, managers] = await Promise.all([
    prisma.task.findUnique({ where: { id: taskId } }),
    prisma.manager.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!task) notFound();

  const taskData = {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: new Date(task.dueDate).toISOString().split("T")[0],
    priority: task.priority,
    status: task.status,
    managerId: task.managerId,
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/tasks" className="hover:text-gray-700">
          Tasks
        </Link>
        <span>/</span>
        <Link href={`/tasks/${task.id}`} className="hover:text-gray-700">
          {task.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900">Edit</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <TaskForm managers={managers} task={taskData} />
      </div>
    </div>
  );
}
