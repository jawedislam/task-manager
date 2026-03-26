"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Project {
  id: number;
  name: string;
}

export default function NoteFilters({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    // Handle special "notClosed" toggle
    if (key === "status" && value === "NOT_CLOSED") {
      params.delete("status");
      params.set("notClosed", "true");
    } else if (key === "status") {
      params.delete("notClosed");
      if (value) {
        params.set("status", value);
      } else {
        params.delete("status");
      }
    } else {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    router.push(`/notes?${params.toString()}`);
  }

  const currentStatus = searchParams.get("notClosed") === "true"
    ? "NOT_CLOSED"
    : searchParams.get("status") ?? "";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={currentStatus}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Statuses</option>
        <option value="NOT_CLOSED">Not Closed</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="CLOSED">Closed</option>
      </select>

      <select
        value={searchParams.get("projectId") ?? ""}
        onChange={(e) => updateFilter("projectId", e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={searchParams.get("date") ?? ""}
        onChange={(e) => updateFilter("date", e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
