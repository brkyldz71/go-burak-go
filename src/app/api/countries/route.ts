import { NextResponse } from "next/server";
import { db } from "@/db";
import { tourCountries } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await db
      .select()
      .from(tourCountries)
      .orderBy(asc(tourCountries.orderIndex));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
