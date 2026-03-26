"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
}

interface Person {
  id: number;
  name: string;
}

interface QuickNoteFormProps {
  projects: Project[];
  people: Person[];
}

export default function QuickNoteForm({ projects, people }: QuickNoteFormProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [halfOfDay, setHalfOfDay] = useState("FIRST_HALF");
  const [projectId, setProjectId] = useState("");
  const [personId, setPersonId] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate(new Date().toISOString().split("T")[0]);
    setHalfOfDay("FIRST_HALF");
    setProjectId("");
    setPersonId("");
    setComment("");
    setExpanded(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !projectId || !dueDate) return;

    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          dueDate,
          halfOfDay,
          comment: comment || null,
          projectId: parseInt(projectId),
          personId: personId ? parseInt(personId) : null,
        }),
      });

      if (res.ok) {
        resetForm();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <form onSubmit={handleSubmit}>
        {/* Row 1: Title input - always visible */}
        <div className="flex gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!expanded && e.target.value) setExpanded(true);
            }}
            onFocus={() => setExpanded(true)}
            placeholder="Capture a note... (e.g. Follow up with Ahmed on deployment)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {!expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 whitespace-nowrap"
            >
              + New Note
            </button>
          )}
        </div>

        {/* Expanded fields */}
        {expanded && (
          <div className="mt-3 space-y-3">
            {/* Row 2: Project, Due Date, Half */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Project *</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <select
                value={halfOfDay}
                onChange={(e) => setHalfOfDay(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="FIRST_HALF">1st Half</option>
                <option value="SECOND_HALF">2nd Half</option>
              </select>

              <select
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Person (optional)</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3: Description and Comment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment (optional)"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Row 4: Actions */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !title.trim() || !projectId || !dueDate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Note"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
