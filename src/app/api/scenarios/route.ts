import { NextResponse } from "next/server";
import { db } from "@/db";
import { scenarios, trendTopics } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await db
      .select({
        id: scenarios.id,
        trendTopicId: scenarios.trendTopicId,
        title: scenarios.title,
        hook: scenarios.hook,
        story: scenarios.story,
        cta: scenarios.cta,
        fullScript: scenarios.fullScript,
        durationSeconds: scenarios.durationSeconds,
        language: scenarios.language,
        targetPlatform: scenarios.targetPlatform,
        status: scenarios.status,
        contentType: scenarios.contentType,
        stockMediaUrls: scenarios.stockMediaUrls,
        needsFootage: scenarios.needsFootage,
        footageNotes: scenarios.footageNotes,
        createdAt: scenarios.createdAt,
        updatedAt: scenarios.updatedAt,
        trendTitle: trendTopics.title,
        trendCategory: trendTopics.category,
      })
      .from(scenarios)
      .leftJoin(trendTopics, eq(scenarios.trendTopicId, trendTopics.id))
      .orderBy(desc(scenarios.createdAt));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
