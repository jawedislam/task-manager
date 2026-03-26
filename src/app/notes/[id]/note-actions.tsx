"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/confirm-dialog";

interface NoteActionsProps {
  noteId: number;
  currentStatus: string;
}

export default function NoteActions({
  noteId,
  currentStatus,
}: NoteActionsProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);

  async function updateStatus(status: string) {
    await fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleDelete() {
    await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
    router.push("/notes");
    router.refresh();
  }

  return (
    <>
      {currentStatus === "OPEN" && (
        <button
          onClick={() => updateStatus("IN_PROGRESS")}
          className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
        >
          Start
        </button>
      )}
      {currentStatus !== "CLOSED" && (
        <button
          onClick={() => updateStatus("CLOSED")}
          className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
        >
          Close
        </button>
      )}
      {currentStatus === "CLOSED" && (
        <button
          onClick={() => updateStatus("OPEN")}
          className="px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100"
        >
          Reopen
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
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
