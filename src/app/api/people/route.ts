import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const people = await prisma.person.findMany({
    include: { _count: { select: { notes: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(people);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const person = await prisma.person.create({
    data: {
      name: body.name.trim(),
      email: body.email?.trim() || null,
    },
  });

  return NextResponse.json(person, { status: 201 });
}
