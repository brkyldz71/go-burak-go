import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Create all tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trend_topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        source TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        trend_score INTEGER NOT NULL DEFAULT 0,
        hashtags TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        scanned_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS scenarios (
        id SERIAL PRIMARY KEY,
        trend_topic_id INTEGER REFERENCES trend_topics(id),
        title TEXT NOT NULL,
        hook TEXT NOT NULL,
        story TEXT NOT NULL,
        cta TEXT NOT NULL,
        full_script TEXT NOT NULL,
        duration_seconds INTEGER NOT NULL DEFAULT 45,
        language TEXT NOT NULL DEFAULT 'tr',
        target_platform TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        content_type TEXT NOT NULL DEFAULT 'original',
        stock_media_urls JSONB,
        needs_footage BOOLEAN NOT NULL DEFAULT true,
        footage_notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS publish_schedule (
        id SERIAL PRIMARY KEY,
        scenario_id INTEGER REFERENCES scenarios(id),
        platform TEXT NOT NULL,
        scheduled_at TIMESTAMP NOT NULL,
        published_at TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'scheduled',
        caption TEXT,
        hashtags TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tour_countries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        region TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'upcoming',
        arrival_date TEXT,
        departure_date TEXT,
        daily_budget TEXT,
        highlights TEXT,
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS social_accounts (
        id SERIAL PRIMARY KEY,
        platform TEXT NOT NULL UNIQUE,
        account_name TEXT,
        account_url TEXT,
        api_key TEXT,
        api_secret TEXT,
        access_token TEXT,
        refresh_token TEXT,
        is_connected BOOLEAN NOT NULL DEFAULT false,
        last_sync_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    return NextResponse.json({ success: true, message: "All tables created!" });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
