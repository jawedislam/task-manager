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

interface NoteData {
  id?: number;
  title: string;
  description: string | null;
  dueDate: string;
  halfOfDay: string;
  status: string;
  projectId: number;
  personId: number | null;
}

interface NoteFormProps {
  projects: Project[];
  people: Person[];
  note?: NoteData;
}

export default function NoteForm({ projects, people, note }: NoteFormProps) {
  const router = useRouter();
  const isEdit = !!note?.id;

  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState(note?.description ?? "");
  const [dueDate, setDueDate] = useState(note?.dueDate ?? "");
  const [halfOfDay, setHalfOfDay] = useState(note?.halfOfDay ?? "FIRST_HALF");
  const [status, setStatus] = useState(note?.status ?? "OPEN");
  const [projectId, setProjectId] = useState<string>(
    note?.projectId?.toString() ?? ""
  );
  const [personId, setPersonId] = useState<string>(
    note?.personId?.toString() ?? ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/notes/${note!.id}` : "/api/notes";
      const method = isEdit ? "PUT" : "POST";

      const body: Record<string, unknown> = {
        title,
        description: description || null,
        dueDate,
        halfOfDay,
        projectId: projectId ? parseInt(projectId) : null,
        personId: personId ? parseInt(personId) : null,
      };
      if (isEdit) body.status = status;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(isEdit ? `/notes/${data.id}` : "/notes");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Follow up with Ahmed on deployment"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Add details about this note..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <select
            value={halfOfDay}
            onChange={(e) => setHalfOfDay(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="FIRST_HALF">1st Half</option>
            <option value="SECOND_HALF">2nd Half</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project <span className="text-red-500">*</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Person / Contact
          </label>
          <select
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">No person</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || !title.trim() || !dueDate || !projectId}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : isEdit ? "Update Note" : "Create Note"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
