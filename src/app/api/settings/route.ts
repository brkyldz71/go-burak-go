import { NextResponse } from "next/server";
import { db } from "@/db";
import { appSettings } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await db.select().from(appSettings);
    const settingsMap: Record<string, string | null> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json(settingsMap);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}
