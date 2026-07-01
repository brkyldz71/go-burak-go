import { NextResponse } from "next/server";
import { db } from "@/db";
import { publishSchedule, scenarios } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await db
      .select({
        id: publishSchedule.id,
        scenarioId: publishSchedule.scenarioId,
        platform: publishSchedule.platform,
        scheduledAt: publishSchedule.scheduledAt,
        publishedAt: publishSchedule.publishedAt,
        status: publishSchedule.status,
        caption: publishSchedule.caption,
        hashtags: publishSchedule.hashtags,
        scenarioTitle: scenarios.title,
        scenarioStatus: scenarios.status,
      })
      .from(publishSchedule)
      .leftJoin(scenarios, eq(publishSchedule.scenarioId, scenarios.id))
      .orderBy(asc(publishSchedule.scheduledAt));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
