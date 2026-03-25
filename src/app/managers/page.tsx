import { prisma } from "@/lib/prisma";
import ManagerForm from "@/components/manager-form";
import ManagerList from "./manager-list";

export const dynamic = "force-dynamic";

export default async function ManagersPage() {
  const managers = await prisma.manager.findMany({
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Managers</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add or remove team managers to assign tasks to.
      </p>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <ManagerForm />
      </div>

      <div className="mt-6">
        {managers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No managers yet</p>
            <p className="mt-1 text-sm">
              Add your first manager using the form above.
            </p>
          </div>
        ) : (
          <ManagerList managers={managers} />
        )}
      </div>
    </div>
  );
}
