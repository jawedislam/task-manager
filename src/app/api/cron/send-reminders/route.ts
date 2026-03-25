import { NextRequest, NextResponse } from "next/server";
import { checkAndSendReminders } from "@/lib/cron";

export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization header automatically
  const authHeader = request.headers.get("authorization");
  const token = request.nextUrl.searchParams.get("token");

  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManualTrigger = token === process.env.CRON_SECRET;

  if (!isVercelCron && !isManualTrigger) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await checkAndSendReminders();
  return NextResponse.json(result);
}
