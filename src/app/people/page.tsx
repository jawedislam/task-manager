import { prisma } from "@/lib/prisma";
import PersonForm from "@/components/person-form";
import PersonList from "./person-list";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const people = await prisma.person.findMany({
    include: { _count: { select: { notes: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">People</h1>
      <p className="mt-1 text-sm text-gray-500">
        Add or remove people / contacts to assign notes to.
      </p>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <PersonForm />
      </div>

      <div className="mt-6">
        {people.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No people yet</p>
            <p className="mt-1 text-sm">
              Add your first person using the form above.
            </p>
          </div>
        ) : (
          <PersonList people={people} />
        )}
      </div>
    </div>
  );
}
