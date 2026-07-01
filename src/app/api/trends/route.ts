import { NextResponse } from "next/server";
import { db } from "@/db";
import { trendTopics } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trends = await db
      .select()
      .from(trendTopics)
      .orderBy(desc(trendTopics.trendScore));
    return NextResponse.json(trends);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
