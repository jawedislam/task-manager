import { prisma } from "@/lib/prisma";
import TaskForm from "@/components/task-form";

export const dynamic = "force-dynamic";

export default async function NewTaskPage() {
  const managers = await prisma.manager.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create Task</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add a new task to track with your team.
      </p>
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <TaskForm managers={managers} />
      </div>
    </div>
  );
}
