import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TaskCard from "@/components/task-card";
import TaskFilters from "@/components/task-filters";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ status?: string; priority?: string; managerId?: string }>;
}

export default async function TasksPage({ searchParams }: Props) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.priority) where.priority = params.priority;
  if (params.managerId) where.managerId = parseInt(params.managerId);

  const [tasks, managers, counts] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { manager: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.manager.findMany({ orderBy: { name: "asc" } }),
    prisma.task.groupBy({
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
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            {countMap.PENDING ?? 0} pending &middot;{" "}
            {countMap.IN_PROGRESS ?? 0} in progress &middot;{" "}
            {countMap.COMPLETED ?? 0} completed
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          New Task
        </Link>
      </div>

      <div className="mt-4">
        <TaskFilters managers={managers} />
      </div>

      <div className="mt-4 space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No tasks found</p>
            <p className="mt-1 text-sm">
              {Object.keys(params).length > 0
                ? "Try adjusting your filters."
                : "Create your first task to get started."}
            </p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
