"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/confirm-dialog";

interface Project {
  id: number;
  name: string;
  _count: { notes: number };
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: number) {
    setError("");
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete project");
      setDeleteTarget(null);
      return;
    }

    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="font-medium text-gray-900">{project.name}</p>
              <p className="text-sm text-gray-500">
                {project._count.notes} note{project._count.notes !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setDeleteTarget(project)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove Project"
        message={`Are you sure you want to remove ${deleteTarget?.name}? This will only work if the project has no notes.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
