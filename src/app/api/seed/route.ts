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
    // 1. ÖNCE VERİTABANI TABLOLARINI KUR
    await db.execute(sql`CREATE TABLE IF NOT EXISTS trend_topics (id SERIAL PRIMARY KEY, title TEXT NOT NULL, source TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL, trend_score INTEGER NOT NULL DEFAULT 0, hashtags TEXT, is_active BOOLEAN NOT NULL DEFAULT true, scanned_at TIMESTAMP NOT NULL DEFAULT NOW(), created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS scenarios (id SERIAL PRIMARY KEY, trend_topic_id INTEGER, title TEXT NOT NULL, hook TEXT NOT NULL, story TEXT NOT NULL, cta TEXT NOT NULL, full_script TEXT NOT NULL, duration_seconds INTEGER NOT NULL DEFAULT 45, language TEXT NOT NULL DEFAULT 'tr', target_platform TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', content_type TEXT NOT NULL DEFAULT 'original', stock_media_urls JSONB, needs_footage BOOLEAN NOT NULL DEFAULT true, footage_notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS publish_schedule (id SERIAL PRIMARY KEY, scenario_id INTEGER, platform TEXT NOT NULL, scheduled_at TIMESTAMP NOT NULL, published_at TIMESTAMP, status TEXT NOT NULL DEFAULT 'scheduled', caption TEXT, hashtags TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS tour_countries (id SERIAL PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL, region TEXT NOT NULL, order_index INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'upcoming', arrival_date TEXT, departure_date TEXT, daily_budget TEXT, highlights TEXT, image_url TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS social_accounts (id SERIAL PRIMARY KEY, platform TEXT NOT NULL UNIQUE, account_name TEXT, account_url TEXT, api_key TEXT, api_secret TEXT, access_token TEXT, refresh_token TEXT, is_connected BOOLEAN NOT NULL DEFAULT false, last_sync_at TIMESTAMP, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS app_settings (id SERIAL PRIMARY KEY, key TEXT NOT NULL UNIQUE, value TEXT, updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);

    // 2. ESKİ VERİLERİ TEMİZLE
    await db.execute(sql`TRUNCATE TABLE publish_schedule, scenarios, trend_topics, tour_countries, social_accounts, app_settings RESTART IDENTITY CASCADE`);

    // 3. AYARLARI EKLE
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

    // 4. 13 ÜLKE ROTASINI EKLE
    await db.insert(tourCountries).values([
      { name: "İran", code: "IR", region: "Orta Doğu", orderIndex: 1, status: "upcoming", arrivalDate: "2026-09-15", departureDate: "2026-10-05", dailyBudget: "$15", highlights: "Tahran, Isfahan, Şiraz, Yezd" },
      { name: "Azerbaycan", code: "AZ", region: "Kafkasya", orderIndex: 2, status: "upcoming", arrivalDate: "2026-10-08", departureDate: "2026-10-18", dailyBudget: "$25", highlights: "Bakü, Qobustan, Şeki" },
      { name: "Kazakistan", code: "KZ", region: "Orta Asya", orderIndex: 3, status: "upcoming", arrivalDate: "2026-10-20", departureDate: "2026-11-01", dailyBudget: "$20", highlights: "Almatı, Astana, Çarın Kanyonu" },
      { name: "Kırgızistan", code: "KG", region: "Orta Asya", orderIndex: 4, status: "upcoming", arrivalDate: "2026-11-03", departureDate: "2026-11-15", dailyBudget: "$15", highlights: "Bişkek, Issık Göl, Song Kul" },
      { name: "Özbekistan", code: "UZ", region: "Orta Asya", orderIndex: 5, status: "upcoming", arrivalDate: "2026-11-17", departureDate: "2026-12-01", dailyBudget: "$15", highlights: "Semerkant, Buhara, Hiva, Taşkent" },
      { name: "Vietnam", code: "VN", region: "Güneydoğu Asya", orderIndex: 6, status: "upcoming", arrivalDate: "2026-12-05", departureDate: "2026-12-25", dailyBudget: "$18", highlights: "Hanoi, Ha Long Bay, Hoi An, Ho Chi Minh" },
      { name: "Kamboçya", code: "KH", region: "Güneydoğu Asya", orderIndex: 7, status: "upcoming", arrivalDate: "2026-12-27", departureDate: "2027-01-08", dailyBudget: "$15", highlights: "Siem Reap, Angkor Wat, Phnom Penh" },
      { name: "Laos", code: "LA", region: "Güneydoğu Asya", orderIndex: 8, status: "upcoming", arrivalDate: "2027-01-10", departureDate: "2027-01-22", dailyBudget: "$15", highlights: "Luang Prabang, Vang Vieng, Vientiane" },
      { name: "Tayland", code: "TH", region: "Güneydoğu Asya", orderIndex: 9, status: "upcoming", arrivalDate: "2027-01-24", departureDate: "2027-02-10", dailyBudget: "$22", highlights: "Bangkok, Chiang Mai, Adalar" },
      { name: "Malezya", code: "MY", region: "Güneydoğu Asya", orderIndex: 10, status: "upcoming", arrivalDate: "2027-02-12", departureDate: "2027-02-24", dailyBudget: "$25", highlights: "Kuala Lumpur, Penang, Langkawi" },
      { name: "Singapur", code: "SG", region: "Güneydoğu Asya", orderIndex: 11, status: "upcoming", arrivalDate: "2027-02-26", departureDate: "2027-03-02", dailyBudget: "$50", highlights: "Marina Bay, Gardens by the Bay, Sentosa" },
      { name: "Endonezya", code: "ID", region: "Güneydoğu Asya", orderIndex: 12, status: "upcoming", arrivalDate: "2027-03-04", departureDate: "2027-03-25", dailyBudget: "$20", highlights: "Bali, Yogyakarta, Komodo, Lombok" },
      { name: "Filipinler", code: "PH", region: "Güneydoğu Asya", orderIndex: 13, status: "upcoming", arrivalDate: "2027-03-27", departureDate: "2027-04-15", dailyBudget: "$20", highlights: "Palawan, El Nido, Cebu, Boracay" },
    ]);

    // 5. TRENDLERİ EKLE
    const insertedTrends = await db.insert(trendTopics).values([
      { title: "İpek Yolu Rotası: Orta Asya'dan Güneydoğu Asya'ya", source: "youtube", category: "world_tour", description: "2026'da Orta Asya rotaları YouTube'da patlıyor.", trendScore: 96, hashtags: "#SilkRoad,#OrtaAsya,#GoBurakGo" },
      { title: "Dünya Turuna Hazırlık: Minimalist Packing", source: "tiktok", category: "backpacking", description: "7kg çanta challenge videoları viral oluyor.", trendScore: 94, hashtags: "#BackpackChallenge,#GoBurakGo" },
      { title: "Bütçe Dostu Asya Seyahati", source: "reddit", category: "budget_travel", description: "Günde $20 altı bütçeyle Asya'da yaşamak.", trendScore: 91, hashtags: "#BudgetTravel,#GoBurakGo" },
    ]).returning();

    // 6. SENARYOLARI EKLE
    await db.insert(scenarios).values([
      {
        trendTopicId: insertedTrends[2]?.id || 1,
        title: "Günde $15 ile Asya'da Yaşamak Mümkün mü?",
        hook: "Günde 15 dolarla yaşamak mı? Türkiye'de bir öğün bile değil ama Asya'da KRALLAR GİBİ yaşarsın!",
        story: "Vietnam'da bir kase Pho 1.5 dolar. Kamboçya'da hostel gecesi 4 dolar. Laos'ta bir gün tuk-tuk turu 5 dolar. Tayland'da sokak yemeği 2 dolar. Toplasan günde 15 dolar!",
        cta: "Ülke bazlı günlük maliyet tablosu yakında sitemde! Go Burak Go!",
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
        hook: "2000 yıl önce tüccarlar bu yolda ipek taşıdı. Şimdi ben sırt çantamla yürüyeceğim!",
        story: "İpek Yolu: Çin'den Roma'ya uzanan epik ticaret rotası. Semerkant, Buhara, Isfahan... Ve ben 2026'da bu rotayı sırt çantamla keşfedeceğim.",
        cta: "İpek Yolu rotam sitemde olacak. Go Burak Go!",
        fullScript: "[HOOK] 2000 yıl önce tüccarlar ipek taşıdı, şimdi ben yürüyeceğim!\n\n[STORY] Semerkant, Buhara, Isfahan... Sırt çantamla İpek Yolundayım!\n\n[CTA] Go Burak Go!",
        durationSeconds: 58,
        targetPlatform: "instagram_reels",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        stockMediaUrls: ["https://videos.pexels.com/video-files/32501037/13858708_1080_1920_30fps.mp4"],
      },
      {
        trendTopicId: insertedTrends[1]?.id || 1,
        title: "7 Ay İçin Çantama Ne Koydum?",
        hook: "7 ay, 13 ülke, TEK ÇANTA! Sadece 8 kilo. İşte içindeki her şey!",
        story: "3 tişört, 1 polar, 2 pantolon, telefon, powerbank, ilaçlar. VE HEPSİ BU! Minimalizm özgürlüktür.",
        cta: "Tam eşya listesi sitemde. Go Burak Go!",
        fullScript: "[HOOK] 7 ay, 13 ülke, TEK ÇANTA!\n\n[STORY] Kıyafetler, teknoloji, ilaçlar... Minimalizm özgürlüktür!\n\n[CTA] Go Burak Go!",
        durationSeconds: 55,
        targetPlatform: "instagram_reels",
        status: "draft",
        contentType: "original",
        needsFootage: true,
        footageNotes: "Ankara'da evde çekilecek. Çantayı aç, her şeyi tek tek göster.",
      }
    ]);

    return NextResponse.json({ success: true, message: "Tablolar kuruldu ve veriler yüklendi!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
