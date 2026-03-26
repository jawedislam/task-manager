import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const [
    totalNotes,
    statusCounts,
    overdueCount,
    dueTodayCount,
    dueTomorrowCount,
    projectsWithCounts,
    recentNotes,
  ] = await Promise.all([
    prisma.note.count(),
    prisma.note.groupBy({ by: ["status"], _count: true }),
    prisma.note.count({
      where: { dueDate: { lt: today }, status: { not: "CLOSED" } },
    }),
    prisma.note.count({
      where: {
        dueDate: { gte: today, lt: tomorrow },
        status: { not: "CLOSED" },
      },
    }),
    prisma.note.count({
      where: {
        dueDate: { gte: tomorrow, lt: dayAfterTomorrow },
        status: { not: "CLOSED" },
      },
    }),
    prisma.project.findMany({
      include: {
        notes: { select: { status: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.note.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { project: true, person: true },
    }),
  ]);

  const statusMap: Record<string, number> = {};
  for (const c of statusCounts) {
    statusMap[c.status] = c._count;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your notes across all projects.
      </p>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total" value={totalNotes} color="bg-gray-100 text-gray-700" />
        <StatCard label="Open" value={statusMap.OPEN ?? 0} color="bg-blue-100 text-blue-700" />
        <StatCard label="In Progress" value={statusMap.IN_PROGRESS ?? 0} color="bg-yellow-100 text-yellow-700" />
        <StatCard label="Closed" value={statusMap.CLOSED ?? 0} color="bg-green-100 text-green-700" />
        <StatCard label="Overdue" value={overdueCount} color="bg-red-100 text-red-700" />
        <StatCard label="Due Today" value={dueTodayCount} color="bg-orange-100 text-orange-700" />
      </div>

      {/* Due Tomorrow */}
      {dueTomorrowCount > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          {dueTomorrowCount} note{dueTomorrowCount !== 1 ? "s" : ""} due tomorrow.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes by Project */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Notes by Project
          </h2>
          {projectsWithCounts.length === 0 ? (
            <p className="text-sm text-gray-400">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {projectsWithCounts.map((project) => {
                const open = project.notes.filter((n) => n.status === "OPEN").length;
                const inProgress = project.notes.filter((n) => n.status === "IN_PROGRESS").length;
                const closed = project.notes.filter((n) => n.status === "CLOSED").length;
                const total = project.notes.length;

                return (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {open} open &middot; {inProgress} in progress &middot; {closed} closed
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {total}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-gray-400">No notes yet.</p>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {note.title}
                    </p>
                    <StatusBadge status={note.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {note.project.name}
                    {note.person && ` \u00b7 ${note.person.name}`}
                    {" \u00b7 "}
                    Updated {new Date(note.updatedAt).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-1">{label}</p>
    </div>
  );
}
