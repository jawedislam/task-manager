"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/confirm-dialog";

interface TaskActionsProps {
  taskId: number;
  currentStatus: string;
}

export default function TaskActions({
  taskId,
  currentStatus,
}: TaskActionsProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  async function updateStatus(status: string) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleDelete() {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    router.push("/tasks");
    router.refresh();
  }

  return (
    <>
      {currentStatus !== "IN_PROGRESS" && currentStatus !== "COMPLETED" && (
        <button
          onClick={() => updateStatus("IN_PROGRESS")}
          className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
        >
          Start
        </button>
      )}
      {currentStatus !== "COMPLETED" && (
        <button
          onClick={() => updateStatus("COMPLETED")}
          className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
        >
          Complete
        </button>
      )}
      <button
        onClick={() => setShowDelete(true)}
        className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
      >
        Delete
      </button>

      <ConfirmDialog
        open={showDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
