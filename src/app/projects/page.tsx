import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/project-form";
import ProjectList from "./project-list";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { _count: { select: { notes: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage projects to organize your notes.
      </p>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <ProjectForm />
      </div>

      <div className="mt-6">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No projects yet</p>
            <p className="mt-1 text-sm">
              Add your first project using the form above.
            </p>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </div>
  );
}
