"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/confirm-dialog";

interface Manager {
  id: number;
  name: string;
  email: string | null;
  _count: { tasks: number };
}

export default function ManagerList({ managers }: { managers: Manager[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Manager | null>(null);

  async function handleDelete(id: number) {
    await fetch(`/api/managers/${id}`, { method: "DELETE" });
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {managers.map((manager) => (
          <div
            key={manager.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="font-medium text-gray-900">{manager.name}</p>
              <p className="text-sm text-gray-500">
                {manager.email ?? "No email"} &middot;{" "}
                {manager._count.tasks} task{manager._count.tasks !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setDeleteTarget(manager)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove Manager"
        message={`Are you sure you want to remove ${deleteTarget?.name}? Their assigned tasks will become unassigned.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
