import { NextResponse } from "next/server";
import { db } from "@/db";
import { scenarios, trendTopics, publishSchedule, tourCountries, socialAccounts, appSettings } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    await db.execute(sql`CREATE TABLE IF NOT EXISTS trend_topics (id SERIAL PRIMARY KEY, title TEXT NOT NULL, source TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL, trend_score INTEGER NOT NULL DEFAULT 0, hashtags TEXT, is_active BOOLEAN NOT NULL DEFAULT true, scanned_at TIMESTAMP NOT NULL DEFAULT NOW(), created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS scenarios (id SERIAL PRIMARY KEY, trend_topic_id INTEGER, title TEXT NOT NULL, hook TEXT NOT NULL, story TEXT NOT NULL, cta TEXT NOT NULL, full_script TEXT NOT NULL, duration_seconds INTEGER NOT NULL DEFAULT 45, language TEXT NOT NULL DEFAULT 'tr', target_platform TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', content_type TEXT NOT NULL DEFAULT 'original', stock_media_urls JSONB, needs_footage BOOLEAN NOT NULL DEFAULT true, footage_notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS publish_schedule (id SERIAL PRIMARY KEY, scenario_id INTEGER, platform TEXT NOT NULL, scheduled_at TIMESTAMP NOT NULL, published_at TIMESTAMP, status TEXT NOT NULL DEFAULT 'scheduled', caption TEXT, hashtags TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS tour_countries (id SERIAL PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL, region TEXT NOT NULL, order_index INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'upcoming', arrival_date TEXT, departure_date TEXT, daily_budget TEXT, highlights TEXT, image_url TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS social_accounts (id SERIAL PRIMARY KEY, platform TEXT NOT NULL UNIQUE, account_name TEXT, account_url TEXT, api_key TEXT, api_secret TEXT, access_token TEXT, refresh_token TEXT, is_connected BOOLEAN NOT NULL DEFAULT false, last_sync_at TIMESTAMP, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS app_settings (id SERIAL PRIMARY KEY, key TEXT NOT NULL UNIQUE, value TEXT, updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);

    await db.execute(sql`TRUNCATE TABLE publish_schedule, scenarios, trend_topics, tour_countries, social_accounts, app_settings RESTART IDENTITY CASCADE`);

    await db.insert(appSettings).values([
      { key: "trip_start_date", value: "2026-09-15" },
      { key: "current_location", value: "Ankara, Türkiye" },
      { key: "current_phase", value: "preparation" },
      { key: "creator_name", value: "Burak Yıldız" },
    ]);

    await db.insert(socialAccounts).values([
      { platform: "tiktok", accountName: "", accountUrl: "", isConnected: false },
      { platform: "instagram", accountName: "", accountUrl: "", isConnected: false },
      { platform: "youtube", accountName: "", accountUrl: "", isConnected: false },
    ]);

    await db.insert(tourCountries).values([
      { name: "İran", code: "IR", region: "Orta Doğu", orderIndex: 1, status: "upcoming", arrivalDate: "2026-09-15", departureDate: "2026-10-05", dailyBudget: "$15", highlights: "Tahran, Isfahan, Şiraz" },
      { name: "Azerbaycan", code: "AZ", region: "Kafkasya", orderIndex: 2, status: "upcoming", arrivalDate: "2026-10-08", departureDate: "2026-10-18", dailyBudget: "$25", highlights: "Bakü, Qobustan" },
      { name: "Kazakistan", code: "KZ", region: "Orta Asya", orderIndex: 3, status: "upcoming", arrivalDate: "2026-10-20", departureDate: "2026-11-01", dailyBudget: "$20", highlights: "Almatı, Astana" },
      { name: "Kırgızistan", code: "KG", region: "Orta Asya", orderIndex: 4, status: "upcoming", arrivalDate: "2026-11-03", departureDate: "2026-11-15", dailyBudget: "$15", highlights: "Bişkek, Issık Göl" },
      { name: "Özbekistan", code: "UZ", region: "Orta Asya", orderIndex: 5, status: "upcoming", arrivalDate: "2026-11-17", departureDate: "2026-12-01", dailyBudget: "$15", highlights: "Semerkant, Buhara" },
      { name: "Vietnam", code: "VN", region: "Güneydoğu Asya", orderIndex: 6, status: "upcoming", arrivalDate: "2026-12-05", departureDate: "2026-12-25", dailyBudget: "$18", highlights: "Hanoi, Ha Long Bay" },
      { name: "Kamboçya", code: "KH", region: "Güneydoğu Asya", orderIndex: 7, status: "upcoming", arrivalDate: "2026-12-27", departureDate: "2027-01-08", dailyBudget: "$15", highlights: "Siem Reap, Angkor Wat" },
      { name: "Laos", code: "LA", region: "Güneydoğu Asya", orderIndex: 8, status: "upcoming", arrivalDate: "2027-01-10", departureDate: "2027-01-22", dailyBudget: "$15", highlights: "Luang Prabang" },
      { name: "Tayland", code: "TH", region: "Güneydoğu Asya", orderIndex: 9, status: "upcoming", arrivalDate: "2027-01-24", departureDate: "2027-02-10", dailyBudget: "$22", highlights: "Bangkok, Chiang Mai" },
      { name: "Malezya", code: "MY", region: "Güneydoğu Asya", orderIndex: 10, status: "upcoming", arrivalDate: "2027-02-12", departureDate: "2027-02-24", dailyBudget: "$25", highlights: "Kuala Lumpur, Penang" },
      { name: "Singapur", code: "SG", region: "Güneydoğu Asya", orderIndex: 11, status: "upcoming", arrivalDate: "2027-02-26", departureDate: "2027-03-02", dailyBudget: "$50", highlights: "Marina Bay" },
      { name: "Endonezya", code: "ID", region: "Güneydoğu Asya", orderIndex: 12, status: "upcoming", arrivalDate: "2027-03-04", departureDate: "2027-03-25", dailyBudget: "$20", highlights: "Bali, Yogyakarta" },
      { name: "Filipinler", code: "PH", region: "Güneydoğu Asya", orderIndex: 13, status: "upcoming", arrivalDate: "2027-03-27", departureDate: "2027-04-15", dailyBudget: "$20", highlights: "Palawan, El Nido" },
    ]);

    const insertedTrends = await db.insert(trendTopics).values([
      { title: "İpek Yolu Rotası: Orta Asya'dan Güneydoğu Asya'ya", source: "youtube", category: "world_tour", description: "Orta Asya rotaları patlıyor.", trendScore: 96, hashtags: "#SilkRoad,#OrtaAsya,#GoBurakGo" },
      { title: "Minimalist Packing Challenge", source: "tiktok", category: "backpacking", description: "7kg çanta videoları viral oluyor.", trendScore: 94, hashtags: "#BackpackChallenge,#GoBurakGo" },
      { title: "Bütçe Dostu Asya Seyahati", source: "reddit", category: "budget_travel", description: "Günde $20 altı bütçeyle Asya.", trendScore: 91, hashtags: "#BudgetTravel,#GoBurakGo" },
    ]).returning();

    await db.insert(scenarios).values([
      {
        trendTopicId: insertedTrends[2]?.id || 1,
        title: "Günde $15 ile Asya'da Yaşamak Mümkün mü?",
        hook: "Günde 15 dolarla yaşamak mı? Türkiye'de bir öğün bile değil ama Asya'da KRALLAR GİBİ yaşarsın!",
        story: "Vietnam'da Pho 1.5 dolar. Kamboçya'da hostel 4 dolar. Laos'ta tuk-tuk 5 dolar. Toplasan günde 15 dolar!",
        cta: "Günlük maliyet tablosu sitemde! Go Burak Go!",
        fullScript: "[HOOK] Günde 15 dolarla yaşamak mı? Asya'da krallar gibi yaşarsın!\n\n[STORY] Vietnam, Kamboçya, Laos... Günde 15 dolara her şey dahil!\n\n[CTA] Go Burak Go!",
        durationSeconds: 55,
        targetPlatform: "tiktok",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        stockMediaUrls: ["https://videos.pexels.com/video-files/35783803/15171163_2160_3840_60fps.mp4"],
      },
      {
        trendTopicId: insertedTrends[0]?.id || 1,
        title: "İpek Yolu Nedir? 2 Dakikada Öğren",
        hook: "2000 yıl önce tüccarlar ipek taşıdı. Şimdi ben sırt çantamla yürüyeceğim!",
        story: "Semerkant, Buhara, Isfahan... 2026'da bu rotayı sırt çantamla keşfedeceğim.",
        cta: "İpek Yolu rotam sitemde! Go Burak Go!",
        fullScript: "[HOOK] 2000 yıl önce tüccarlar ipek taşıdı, şimdi ben yürüyeceğim!\n\n[STORY] Semerkant, Buhara, Isfahan... Sırt çantamla İpek Yolundayım!\n\n[CTA] Go Burak Go!",
        durationSeconds: 58,
        targetPlatform: "instagram_reels",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        stockMediaUrls: ["https://videos.pexels.com/video-files/32501037/13858708_1080_1920_30fps.mp4"],
      }
    ]);

    return NextResponse.json({ success: true, message: "Tablolar kuruldu ve veriler yüklendi!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
