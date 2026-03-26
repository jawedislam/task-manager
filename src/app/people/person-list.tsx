"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/confirm-dialog";

interface Person {
  id: number;
  name: string;
  email: string | null;
  _count: { notes: number };
}

export default function PersonList({ people }: { people: Person[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);

  async function handleDelete(id: number) {
    await fetch(`/api/people/${id}`, { method: "DELETE" });
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {people.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="font-medium text-gray-900">{person.name}</p>
              <p className="text-sm text-gray-500">
                {person.email ?? "No email"} &middot;{" "}
                {person._count.notes} note{person._count.notes !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setDeleteTarget(person)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove Person"
        message={`Are you sure you want to remove ${deleteTarget?.name}? Their assigned notes will become unassigned.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
