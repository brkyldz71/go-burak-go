import { NextResponse } from "next/server";
import { db } from "@/db";
import { trendTopics, scenarios, publishSchedule, tourCountries, socialAccounts, appSettings } from "@/db/schema";
import { sql } from "drizzle-orm";
export const dynamic = "force-dynamic";
export async function POST() {
  try {
    // Create tables if not exist
    await db.execute(sql`CREATE TABLE IF NOT EXISTS trend_topics (id SERIAL PRIMARY KEY, title TEXT NOT NULL, source TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL, trend_score INTEGER NOT NULL DEFAULT 0, hashtags TEXT, is_active BOOLEAN NOT NULL DEFAULT true, scanned_at TIMESTAMP NOT NULL DEFAULT NOW(), created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS scenarios (id SERIAL PRIMARY KEY, trend_topic_id INTEGER REFERENCES trend_topics(id), title TEXT NOT NULL, hook TEXT NOT NULL, story TEXT NOT NULL, cta TEXT NOT NULL, full_script TEXT NOT NULL, duration_seconds INTEGER NOT NULL DEFAULT 45, language TEXT NOT NULL DEFAULT 'tr', target_platform TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', content_type TEXT NOT NULL DEFAULT 'original', stock_media_urls JSONB, needs_footage BOOLEAN NOT NULL DEFAULT true, footage_notes TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS publish_schedule (id SERIAL PRIMARY KEY, scenario_id INTEGER REFERENCES scenarios(id), platform TEXT NOT NULL, scheduled_at TIMESTAMP NOT NULL, published_at TIMESTAMP, status TEXT NOT NULL DEFAULT 'scheduled', caption TEXT, hashtags TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS tour_countries (id SERIAL PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL, region TEXT NOT NULL, order_index INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'upcoming', arrival_date TEXT, departure_date TEXT, daily_budget TEXT, highlights TEXT, image_url TEXT, created_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS social_accounts (id SERIAL PRIMARY KEY, platform TEXT NOT NULL UNIQUE, account_name TEXT, account_url TEXT, api_key TEXT, api_secret TEXT, access_token TEXT, refresh_token TEXT, is_connected BOOLEAN NOT NULL DEFAULT false, last_sync_at TIMESTAMP, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS app_settings (id SERIAL PRIMARY KEY, key TEXT NOT NULL UNIQUE, value TEXT, updated_at TIMESTAMP NOT NULL DEFAULT NOW())`);

    // Clear existing data
    await db.execute(sql`TRUNCATE TABLE publish_schedule, scenarios, trend_topics, tour_countries, social_accounts, app_settings RESTART IDENTITY CASCADE`);

    // App settings
    await db.insert(appSettings).values([
      { key: "trip_start_date", value: "2026-09-15" },
      { key: "current_location", value: "Ankara, Türkiye" },
      { key: "current_phase", value: "preparation" },
      { key: "creator_name", value: "Burak Yıldız" },
    ]);

    // Social accounts
    await db.insert(socialAccounts).values([
      { platform: "tiktok", accountName: "", accountUrl: "", isConnected: false },
      { platform: "instagram", accountName: "", accountUrl: "", isConnected: false },
      { platform: "youtube", accountName: "", accountUrl: "", isConnected: false },
    ]);

    // Tour countries (13 countries)
    const countries = [
      { name: "İran", code: "IR", region: "Orta Doğu", orderIndex: 1, status: "upcoming", arrivalDate: "2026-09-15", departureDate: "2026-10-05", dailyBudget: "$15", highlights: "Tahran, Isfahan, Şiraz, Yezd", imageUrl: null },
      { name: "Azerbaycan", code: "AZ", region: "Kafkasya", orderIndex: 2, status: "upcoming", arrivalDate: "2026-10-08", departureDate: "2026-10-18", dailyBudget: "$25", highlights: "Bakü, Qobustan, Şeki", imageUrl: null },
      { name: "Kazakistan", code: "KZ", region: "Orta Asya", orderIndex: 3, status: "upcoming", arrivalDate: "2026-10-20", departureDate: "2026-11-01", dailyBudget: "$20", highlights: "Almatı, Astana, Çarın Kanyonu", imageUrl: null },
      { name: "Kırgızistan", code: "KG", region: "Orta Asya", orderIndex: 4, status: "upcoming", arrivalDate: "2026-11-03", departureDate: "2026-11-15", dailyBudget: "$15", highlights: "Bişkek, Issık Göl, Song Kul", imageUrl: null },
      { name: "Özbekistan", code: "UZ", region: "Orta Asya", orderIndex: 5, status: "upcoming", arrivalDate: "2026-11-17", departureDate: "2026-12-01", dailyBudget: "$15", highlights: "Semerkant, Buhara, Hiva, Taşkent", imageUrl: null },
      { name: "Vietnam", code: "VN", region: "Güneydoğu Asya", orderIndex: 6, status: "upcoming", arrivalDate: "2026-12-05", departureDate: "2026-12-25", dailyBudget: "$18", highlights: "Hanoi, Ha Long Bay, Hoi An, Ho Chi Minh", imageUrl: null },
      { name: "Kamboçya", code: "KH", region: "Güneydoğu Asya", orderIndex: 7, status: "upcoming", arrivalDate: "2026-12-27", departureDate: "2027-01-08", dailyBudget: "$15", highlights: "Siem Reap, Angkor Wat, Phnom Penh", imageUrl: null },
      { name: "Laos", code: "LA", region: "Güneydoğu Asya", orderIndex: 8, status: "upcoming", arrivalDate: "2027-01-10", departureDate: "2027-01-22", dailyBudget: "$15", highlights: "Luang Prabang, Vang Vieng, Vientiane", imageUrl: null },
      { name: "Tayland", code: "TH", region: "Güneydoğu Asya", orderIndex: 9, status: "upcoming", arrivalDate: "2027-01-24", departureDate: "2027-02-10", dailyBudget: "$22", highlights: "Bangkok, Chiang Mai, Adalar", imageUrl: null },
      { name: "Malezya", code: "MY", region: "Güneydoğu Asya", orderIndex: 10, status: "upcoming", arrivalDate: "2027-02-12", departureDate: "2027-02-24", dailyBudget: "$25", highlights: "Kuala Lumpur, Penang, Langkawi", imageUrl: null },
      { name: "Singapur", code: "SG", region: "Güneydoğu Asya", orderIndex: 11, status: "upcoming", arrivalDate: "2027-02-26", departureDate: "2027-03-02", dailyBudget: "$50", highlights: "Marina Bay, Gardens by the Bay, Sentosa", imageUrl: null },
      { name: "Endonezya", code: "ID", region: "Güneydoğu Asya", orderIndex: 12, status: "upcoming", arrivalDate: "2027-03-04", departureDate: "2027-03-25", dailyBudget: "$20", highlights: "Bali, Yogyakarta, Komodo, Lombok", imageUrl: null },
      { name: "Filipinler", code: "PH", region: "Güneydoğu Asya", orderIndex: 13, status: "upcoming", arrivalDate: "2027-03-27", departureDate: "2027-04-15", dailyBudget: "$20", highlights: "Palawan, El Nido, Cebu, Boracay", imageUrl: null },
    ];
    await db.insert(tourCountries).values(countries);

    // Trend topics
    const trends = [
      {
        title: "İpek Yolu Rotası: Orta Asya'dan Güneydoğu Asya'ya",
        source: "youtube",
        category: "world_tour",
        description: "2026'da Orta Asya rotaları YouTube'da patlıyor. İran-Azerbaycan-Kazakistan-Kırgızistan-Özbekistan hattı 'yeni İpek Yolu' olarak viral oluyor.",
        trendScore: 96,
        hashtags: "#SilkRoad,#OrtaAsya,#GoBurakGo,#İpekYolu,#OffTheBeatenPath",
      },
      {
        title: "Dünya Turuna Hazırlık: Minimalist Packing",
        source: "tiktok",
        category: "backpacking",
        description: "2026'da minimalist seyahat trendi zirve yaptı. '7kg çanta challenge' videoları viral oluyor.",
        trendScore: 94,
        hashtags: "#BackpackChallenge,#7kgBagpack,#GoBurakGo,#MinimalistTravel",
      },
      {
        title: "Bütçe Dostu Asya Seyahati",
        source: "reddit",
        category: "budget_travel",
        description: "Günde $20 altı bütçeyle Asya'da yaşamak Reddit'te en çok tartışılan konu.",
        trendScore: 91,
        hashtags: "#BudgetTravel,#AsyaSeyahati,#GoBurakGo,#UcuzSeyahat",
      },
    ];
    const insertedTrends = await db.insert(trendTopics).values(trends).returning();

    // ============================================
    // LANSMAN ÖNCESİ İÇERİKLER (Stok Video ile)
    // ============================================
    const preLaunchScenarios = [
      {
        trendTopicId: insertedTrends[2].id,
        title: "Günde $15 ile Asya'da Yaşamak Mümkün mü?",
        hook: "Günde 15 dolarla yaşamak mı? Türkiye'de bir öğün bile değil ama Asya'da KRALLAR GİBİ yaşarsın!",
        story: "Vietnam'da bir kase Pho 1.5 dolar. Kamboçya'da hostel gecesi 4 dolar. Laos'ta bir gün tuk-tuk turu 5 dolar. Tayland'da sokak yemeği 2 dolar. Toplasan günde 15 dolar ve karın tok, başın sıcak, macera dolu! Asya bütçe gezginlerinin cenneti. Pahalı tatil değil, UZUN macera istiyorsan Asya seni bekliyor.",
        cta: "Ülke bazlı günlük maliyet tablosu yakında sitemde! Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-7sn]\nGünde 15 dolarla yaşamak mı? Türkiye'de bir öğün bile değil ama Asya'da KRALLAR GİBİ yaşarsın!\n\n[STORY - 7-45sn]\nVietnam'da bir kase Pho 1.5 dolar. Kamboçya'da hostel gecesi 4 dolar. Laos'ta bir gün tuk-tuk turu 5 dolar. Tayland'da sokak yemeği 2 dolar. Toplasan günde 15 dolar ve karın tok, başın sıcak, macera dolu! Asya bütçe gezginlerinin cenneti. Pahalı tatil değil, UZUN macera istiyorsan Asya seni bekliyor.\n\n[CTA - 45-55sn]\nÜlke bazlı günlük maliyet tablosu yakında sitemde! Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 55,
        targetPlatform: "tiktok",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/35783803/15171163_2160_3840_60fps.mp4",
          "https://videos.pexels.com/video-files/32228864/13745178_1080_1920_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[0].id,
        title: "İpek Yolu Nedir? 2 Dakikada Öğren",
        hook: "2000 yıl önce tüccarlar bu yolda ipek taşıdı. Şimdi ben sırt çantamla aynı yolu yürüyeceğim!",
        story: "İpek Yolu: Çin'den Roma'ya uzanan tarihin en epik ticaret rotası. Semerkant, Buhara, Isfahan... Bu şehirler bir zamanlar dünyanın en zengin yerleriydi. Kervanlar ipek, baharat, altın taşırdı. Şimdi o yollar hâlâ orada — İran, Özbekistan, Kazakistan. Ve ben 2026'da bu rotayı sırt çantamla keşfedeceğim. Modern İpek Yolu gezgini olmaya hazır mısın?",
        cta: "İpek Yolu rotam ve planım sitemde olacak. Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-8sn]\n2000 yıl önce tüccarlar bu yolda ipek taşıdı. Şimdi ben sırt çantamla aynı yolu yürüyeceğim!\n\n[STORY - 8-48sn]\nİpek Yolu: Çin'den Roma'ya uzanan tarihin en epik ticaret rotası. Semerkant, Buhara, Isfahan... Bu şehirler bir zamanlar dünyanın en zengin yerleriydi. Kervanlar ipek, baharat, altın taşırdı. Şimdi o yollar hâlâ orada — İran, Özbekistan, Kazakistan. Ve ben 2026'da bu rotayı sırt çantamla keşfedeceğim. Modern İpek Yolu gezgini olmaya hazır mısın?\n\n[CTA - 48-58sn]\nİpek Yolu rotam ve planım sitemde olacak. Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 58,
        targetPlatform: "instagram_reels",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/32501037/13858708_1080_1920_30fps.mp4",
          "https://videos.pexels.com/video-files/35202025/14913666_1080_1920_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[1].id,
        title: "Solo Seyahat Neden Herkesin Denemesi Gereken Şey?",
        hook: "Tek başına seyahat etmek yalnızlık değil, ÖZGÜRLÜK! İşte 5 nedeni.",
        story: "Bir: İstediğin zaman, istediğin yere gidersin. İki: Kendini tanırsın — konfor alanının dışında gerçek sen ortaya çıkar. Üç: Yeni insanlarla tanışırsın — solo gezginler daha sosyal olur. Dört: Problem çözme becerilerin gelişir. Beş: Özgüvenin tavan yapar. Solo seyahat korkutucu görünür ama bir kez deneyince bırakamazsın. 2026'da ben de 7 aylık solo dünya turuma çıkıyorum!",
        cta: "Solo seyahat rehberim yakında sitemde! Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-6sn]\nTek başına seyahat etmek yalnızlık değil, ÖZGÜRLÜK! İşte 5 nedeni.\n\n[STORY - 6-48sn]\nBir: İstediğin zaman, istediğin yere gidersin. İki: Kendini tanırsın — konfor alanının dışında gerçek sen ortaya çıkar. Üç: Yeni insanlarla tanışırsın — solo gezginler daha sosyal olur. Dört: Problem çözme becerilerin gelişir. Beş: Özgüvenin tavan yapar. Solo seyahat korkutucu görünür ama bir kez deneyince bırakamazsın. 2026'da ben de 7 aylık solo dünya turuma çıkıyorum!\n\n[CTA - 48-57sn]\nSolo seyahat rehberim yakında sitemde! Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 57,
        targetPlatform: "youtube_shorts",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/7824464/7824464-uhd_2160_3840_30fps.mp4",
          "https://videos.pexels.com/video-files/7817127/7817127-uhd_2160_3840_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[2].id,
        title: "Hostel mı Otel mi? Hangisi Daha İyi?",
        hook: "Otel konforu mu, hostel macerası mı? Bütçe gezgini olarak cevabım net!",
        story: "Otel: Özel oda, sessizlik, konfor. Ama pahalı ve yalnız kalırsın. Hostel: Paylaşımlı oda, gürültü, bazen kaos. AMA! Gecesi 5-10 dolar, her gün yeni arkadaşlar, ortak mutfak, yerel tavsiyeler. Ben 7 ay boyunca hostelde kalacağım. Neden? Çünkü seyahat sadece yer görmek değil, insanlarla tanışmak. Ve en iyi hikayeler hostel mutfaklarında başlar!",
        cta: "En iyi hostel bulma taktiklerim sitemde olacak. Go Burak Go!",
        fullScript: "[HOOK - 0-6sn]\nOtel konforu mu, hostel macerası mı? Bütçe gezgini olarak cevabım net!\n\n[STORY - 6-47sn]\nOtel: Özel oda, sessizlik, konfor. Ama pahalı ve yalnız kalırsın. Hostel: Paylaşımlı oda, gürültü, bazen kaos. AMA! Gecesi 5-10 dolar, her gün yeni arkadaşlar, ortak mutfak, yerel tavsiyeler. Ben 7 ay boyunca hostelde kalacağım. Neden? Çünkü seyahat sadece yer görmek değil, insanlarla tanışmak. Ve en iyi hikayeler hostel mutfaklarında başlar!\n\n[CTA - 47-56sn]\nEn iyi hostel bulma taktiklerim sitemde olacak. Go Burak Go!",
        durationSeconds: 56,
        targetPlatform: "tiktok",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/7823706/7823706-uhd_2160_3840_30fps.mp4",
          "https://videos.pexels.com/video-files/7825222/7825222-uhd_2160_3840_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[2].id,
        title: "Ucuz Uçak Bileti Bulmanın 5 Sırrı",
        hook: "Uçak bileti pahalı diyorsan bu 5 sırrı bilmiyorsun! Yüzlerce dolar tasarruf et.",
        story: "Bir: Salı ve Çarşamba günleri ara — en ucuz günler bunlar. İki: Gizli mod kullan — tarayıcı geçmişine göre fiyat artıyor. Üç: Skyscanner 'tüm ay' özelliği — en ucuz günü gösterir. Dört: Aktarmalı uçuşlara bak — direkt uçuş her zaman pahalı. Beş: Hata ücreti sitelerini takip et — bazen %80 indirimli biletler çıkıyor. Bu taktiklerle ben 13 ülke için uçuşları 1500 dolara hallettim!",
        cta: "Detaylı uçak bileti rehberim sitemde! Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-6sn]\nUçak bileti pahalı diyorsan bu 5 sırrı bilmiyorsun! Yüzlerce dolar tasarruf et.\n\n[STORY - 6-48sn]\nBir: Salı ve Çarşamba günleri ara — en ucuz günler bunlar. İki: Gizli mod kullan — tarayıcı geçmişine göre fiyat artıyor. Üç: Skyscanner 'tüm ay' özelliği — en ucuz günü gösterir. Dört: Aktarmalı uçuşlara bak — direkt uçuş her zaman pahalı. Beş: Hata ücreti sitelerini takip et — bazen %80 indirimli biletler çıkıyor. Bu taktiklerle ben 13 ülke için uçuşları 1500 dolara hallettim!\n\n[CTA - 48-57sn]\nDetaylı uçak bileti rehberim sitemde! Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 57,
        targetPlatform: "instagram_reels",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/32658988/13924308_1080_1920_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[0].id,
        title: "Orta Asya Hakkında 5 Şaşırtıcı Gerçek",
        hook: "Orta Asya'yı bildiğini mi sanıyorsun? Bu 5 gerçek seni şoke edecek!",
        story: "Bir: Kazakistan dünyanın 9. büyük ülkesi — Batı Avrupa'nın tamamından büyük! İki: Kırgızistan'da 3000'den fazla göl var. Üç: Özbekistan'ın Semerkant şehri Cengiz Han'dan bile eski. Dört: Türk dilleri konuşuluyor — Türkiye'den gelen biri %30 anlayabiliyor! Beş: Dünyanın en misafirperver insanları burada — çay ikramını reddedemezsin. İşte bu yüzden dünya turuma Orta Asya'dan başlıyorum!",
        cta: "Orta Asya rehberim hazırlanıyor. Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-6sn]\nOrta Asya'yı bildiğini mi sanıyorsun? Bu 5 gerçek seni şoke edecek!\n\n[STORY - 6-50sn]\nBir: Kazakistan dünyanın 9. büyük ülkesi — Batı Avrupa'nın tamamından büyük! İki: Kırgızistan'da 3000'den fazla göl var. Üç: Özbekistan'ın Semerkant şehri Cengiz Han'dan bile eski. Dört: Türk dilleri konuşuluyor — Türkiye'den gelen biri %30 anlayabiliyor! Beş: Dünyanın en misafirperver insanları burada — çay ikramını reddedemezsin. İşte bu yüzden dünya turuma Orta Asya'dan başlıyorum!\n\n[CTA - 50-58sn]\nOrta Asya rehberim hazırlanıyor. Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 58,
        targetPlatform: "youtube_shorts",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/38302284/16263754_1080_1920_30fps.mp4",
          "https://videos.pexels.com/video-files/32501295/13858685_1080_1920_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[2].id,
        title: "Seyahat Sigortası Şart mı?",
        hook: "Seyahat sigortası gereksiz masraf mı? Bir kaza hikayesi dinle, fikrini değiştir!",
        story: "Tayland'da bir gezgin motorsiklet kazası geçirdi. Hastane faturası: 15.000 dolar. Sigortası yoktu. Ailesinden para istediler, sonunda crowdfunding yaptılar. Başka bir gezgin aynı kaza, ama sigortası vardı. Tek kuruş ödemedi. Yıllık sigorta maliyeti: 200-300 dolar. Günlük 1 dolara bile denk gelmiyor. Sigorta kumar değil, güvence. Ben 7 aylık turum için kapsamlı sigorta aldım. Sağlık, hırsızlık, uçuş iptali — hepsi dahil.",
        cta: "Seyahat sigortası karşılaştırmam sitemde olacak. Go Burak Go!",
        fullScript: "[HOOK - 0-7sn]\nSeyahat sigortası gereksiz masraf mı? Bir kaza hikayesi dinle, fikrini değiştir!\n\n[STORY - 7-50sn]\nTayland'da bir gezgin motorsiklet kazası geçirdi. Hastane faturası: 15.000 dolar. Sigortası yoktu. Ailesinden para istediler, sonunda crowdfunding yaptılar. Başka bir gezgin aynı kaza, ama sigortası vardı. Tek kuruş ödemedi. Yıllık sigorta maliyeti: 200-300 dolar. Günlük 1 dolara bile denk gelmiyor. Sigorta kumar değil, güvence. Ben 7 aylık turum için kapsamlı sigorta aldım. Sağlık, hırsızlık, uçuş iptali — hepsi dahil.\n\n[CTA - 50-58sn]\nSeyahat sigortası karşılaştırmam sitemde olacak. Go Burak Go!",
        durationSeconds: 58,
        targetPlatform: "tiktok",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/15384586/15384586-hd_1080_1920_24fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[1].id,
        title: "Sırt Çantası Nasıl Paketlenir? 5 Altın Kural",
        hook: "Çantan 15 kilo mu? YANLIŞ yapıyorsun! 8 kilo ile dünya turu mümkün.",
        story: "Kural 1: Her eşyayı iki kez düşün — 'gerçekten lazım mı?' Kural 2: Kıyafetleri sar, katla değil — daha az yer kaplar. Kural 3: Ağır şeyleri sırta yakın koy — denge için şart. Kural 4: Sıkıştırma poşetleri kullan — hacmi %50 azaltır. Kural 5: 'Ya gerekirse' diye bir şey ekleme — orada da mağaza var! Ben 8 kilo çantayla 7 ay, 13 ülke gezeceğim. Minimalizm özgürlüktür!",
        cta: "Paketleme video rehberim sitemde! Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-6sn]\nÇantan 15 kilo mu? YANLIŞ yapıyorsun! 8 kilo ile dünya turu mümkün.\n\n[STORY - 6-48sn]\nKural 1: Her eşyayı iki kez düşün — 'gerçekten lazım mı?' Kural 2: Kıyafetleri sar, katla değil — daha az yer kaplar. Kural 3: Ağır şeyleri sırta yakın koy — denge için şart. Kural 4: Sıkıştırma poşetleri kullan — hacmi %50 azaltır. Kural 5: 'Ya gerekirse' diye bir şey ekleme — orada da mağaza var! Ben 8 kilo çantayla 7 ay, 13 ülke gezeceğim. Minimalizm özgürlüktür!\n\n[CTA - 48-57sn]\nPaketleme video rehberim sitemde! Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 57,
        targetPlatform: "instagram_reels",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/7817127/7817127-uhd_2160_3840_30fps.mp4",
          "https://videos.pexels.com/video-files/7823353/7823353-uhd_2160_3840_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[0].id,
        title: "Vietnam Sokak Yemeği: $2'a Şölen!",
        hook: "2 dolara karnını doyuramazsın mı dedin? Vietnam'a gel de gör!",
        story: "Sabah: Banh Mi sandviç — 1 dolar. Öğlen: Pho çorbası — 1.5 dolar. Akşam: Com tam (kırık pirinç) — 1.5 dolar. Tatlı: Che (tatlı çorba) — 0.5 dolar. TOPLAM: 4.5 dolar ve 4 ÖĞÜN! Ve bunlar rezil değil, EFSANE lezzetler. Sokak yemeği Vietnam'ın ruhu. Restoran değil, sokak — orada asıl yemek var. 2026'da Vietnam rotamda hepsini deneyeceğim!",
        cta: "Vietnam yemek rehberim hazırlanıyor. Go Burak Go!",
        fullScript: "[HOOK - 0-5sn]\n2 dolara karnını doyuramazsın mı dedin? Vietnam'a gel de gör!\n\n[STORY - 5-47sn]\nSabah: Banh Mi sandviç — 1 dolar. Öğlen: Pho çorbası — 1.5 dolar. Akşam: Com tam (kırık pirinç) — 1.5 dolar. Tatlı: Che (tatlı çorba) — 0.5 dolar. TOPLAM: 4.5 dolar ve 4 ÖĞÜN! Ve bunlar rezil değil, EFSANE lezzetler. Sokak yemeği Vietnam'ın ruhu. Restoran değil, sokak — orada asıl yemek var. 2026'da Vietnam rotamda hepsini deneyeceğim!\n\n[CTA - 47-55sn]\nVietnam yemek rehberim hazırlanıyor. Go Burak Go!",
        durationSeconds: 55,
        targetPlatform: "youtube_shorts",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/32228864/13745178_1080_1920_30fps.mp4",
          "https://videos.pexels.com/video-files/36549265/15497728_1440_2560_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[2].id,
        title: "Türk Pasaportuyla Vizesiz 100+ Ülke",
        hook: "Türk pasaportu zayıf mı? Yanlış! Vizesiz girebildiğin ülke sayısı seni şaşırtacak.",
        story: "Türk pasaportuyla vizesiz veya kapıda vize ile 110+ ülkeye girebilirsin. Güneydoğu Asya: Tayland, Malezya, Singapur, Endonezya, Filipinler — HEPSİ VİZESİZ! Orta Asya: Azerbaycan, Kazakistan, Kırgızistan, Özbekistan — VİZESİZ! Güney Amerika: Arjantin, Brezilya, Şili — VİZESİZ! Pasaportunu küçümseme, o seni 110 ülkeye taşır. Ben 13 ülke gezeceğim ve sadece 1-2 vize alacağım!",
        cta: "Vizesiz ülkeler listesi sitemde olacak. Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-6sn]\nTürk pasaportu zayıf mı? Yanlış! Vizesiz girebildiğin ülke sayısı seni şaşırtacak.\n\n[STORY - 6-50sn]\nTürk pasaportuyla vizesiz veya kapıda vize ile 110+ ülkeye girebilirsin. Güneydoğu Asya: Tayland, Malezya, Singapur, Endonezya, Filipinler — HEPSİ VİZESİZ! Orta Asya: Azerbaycan, Kazakistan, Kırgızistan, Özbekistan — VİZESİZ! Güney Amerika: Arjantin, Brezilya, Şili — VİZESİZ! Pasaportunu küçümseme, o seni 110 ülkeye taşır. Ben 13 ülke gezeceğim ve sadece 1-2 vize alacağım!\n\n[CTA - 50-58sn]\nVizesiz ülkeler listesi sitemde olacak. Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 58,
        targetPlatform: "tiktok",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/7817114/7817114-uhd_2160_3840_30fps.mp4",
          "https://videos.pexels.com/video-files/7823708/7823708-uhd_2160_3840_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[1].id,
        title: "İlk Solo Seyahatin İçin 5 Kolay Ülke",
        hook: "Solo seyahate başlamak istiyor ama korkuyor musun? Bu 5 ülke ile başla!",
        story: "Bir: Tayland — altyapı süper, İngilizce yaygın, çok güvenli. İki: Vietnam — ucuz, lezzetli, solo gezgin cenneti. Üç: Portekiz — Avrupa'da ucuz, sıcakkanlı, kolay ulaşım. Dört: Japonya — dünyanın en güvenli ülkesi, her şey düzenli. Beş: Gürcistan — Türkiye'ye yakın, vizesiz, misafirperver. İlk solo seyahatim için benim tavsiyem: Tayland. Herkes İngilizce biliyor, hosteller harika, yemekler ucuz!",
        cta: "Ülke bazlı zorluk seviyesi rehberim sitemde! Go Burak Go!",
        fullScript: "[HOOK - 0-6sn]\nSolo seyahate başlamak istiyor ama korkuyor musun? Bu 5 ülke ile başla!\n\n[STORY - 6-50sn]\nBir: Tayland — altyapı süper, İngilizce yaygın, çok güvenli. İki: Vietnam — ucuz, lezzetli, solo gezgin cenneti. Üç: Portekiz — Avrupa'da ucuz, sıcakkanlı, kolay ulaşım. Dört: Japonya — dünyanın en güvenli ülkesi, her şey düzenli. Beş: Gürcistan — Türkiye'ye yakın, vizesiz, misafirperver. İlk solo seyahatim için benim tavsiyem: Tayland. Herkes İngilizce biliyor, hosteller harika, yemekler ucuz!\n\n[CTA - 50-58sn]\nÜlke bazlı zorluk seviyesi rehberim sitemde! Go Burak Go!",
        durationSeconds: 58,
        targetPlatform: "instagram_reels",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/7825222/7825222-uhd_2160_3840_30fps.mp4",
          "https://videos.pexels.com/video-files/28995349/12541184_2160_3840_30fps.mp4",
        ],
      },
      {
        trendTopicId: insertedTrends[0].id,
        title: "Angkor Wat: Dünyanın En Büyük Tapınağı",
        hook: "800 yıllık bir tapınak, 400 dönüm arazi, günde 10.000 turist. ANGKOR WAT!",
        story: "Kamboçya'nın Siem Reap şehrinde, dünyanın en büyük dini yapısı duruyor: Angkor Wat. 12. yüzyılda Hindu tapınağı olarak inşa edildi, sonra Budist tapınağa dönüştü. Gün doğumunda silueti efsane. Bilet 37 dolar — 3 günlük geçerli. Ama bilmediğin şey: Kamboçya'nın milli günü 9 Kasım'da BEDAVA! Ben Aralık'ta orada olacağım, 3 gün boyunca her köşeyi keşfedeceğim.",
        cta: "Kamboçya rehberim hazırlanıyor. Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK - 0-6sn]\n800 yıllık bir tapınak, 400 dönüm arazi, günde 10.000 turist. ANGKOR WAT!\n\n[STORY - 6-48sn]\nKamboçya'nın Siem Reap şehrinde, dünyanın en büyük dini yapısı duruyor: Angkor Wat. 12. yüzyılda Hindu tapınağı olarak inşa edildi, sonra Budist tapınağa dönüştü. Gün doğumunda silueti efsane. Bilet 37 dolar — 3 günlük geçerli. Ama bilmediğin şey: Kamboçya'nın milli günü 9 Kasım'da BEDAVA! Ben Aralık'ta orada olacağım, 3 gün boyunca her köşeyi keşfedeceğim.\n\n[CTA - 48-57sn]\nKamboçya rehberim hazırlanıyor. Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 57,
        targetPlatform: "youtube_shorts",
        status: "approved",
        contentType: "pre_launch",
        needsFootage: false,
        footageNotes: null,
        stockMediaUrls: [
          "https://videos.pexels.com/video-files/7817114/7817114-uhd_2160_3840_30fps.mp4",
        ],
      },
    ];

    // ============================================
    // HAZIRLIK DÖNEMİ KENDİ ÇEKİM İÇERİKLERİ
    // ============================================
    const originalScenarios = [
      {
        trendTopicId: insertedTrends[0].id,
        title: "Neden Orta Asya'dan Başlıyorum?",
        hook: "Herkes Tayland'dan başlıyor ama ben İRAN'dan! Deli miyim? Hayır, strateji bu!",
        story: "Bakın rotam: İran, Azerbaycan, Kazakistan, Kırgızistan, Özbekistan... Sonra Güneydoğu Asya. Neden? Birincisi: Orta Asya sonbaharda mükemmel. İkincisi: En ucuz ülkelerden başla. Üçüncüsü: Bu rota İpek Yolu — tarihin en epik yolu!",
        cta: "13 ülke rotamın tam haritası sitemde. Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK] Herkes Tayland'dan başlıyor ama ben İRAN'dan!\n\n[STORY] Rotam: İran, Azerbaycan, Kazakistan, Kırgızistan, Özbekistan... Sonra Güneydoğu Asya. Neden? Mevsim, bütçe ve İpek Yolu!\n\n[CTA] Go Burak Go dünyasına hoş geldin!",
        durationSeconds: 55,
        targetPlatform: "tiktok",
        status: "draft",
        contentType: "original",
        needsFootage: true,
        footageNotes: "Harita üzerinde rotayı çiz. Heyecanlı ton! Ankara'da evde çekilebilir.",
        stockMediaUrls: [],
      },
      {
        trendTopicId: insertedTrends[1].id,
        title: "7 Ay İçin Çantama Ne Koydum?",
        hook: "7 ay, 13 ülke, TEK ÇANTA! Sadece 8 kilo. İşte içindeki her şey!",
        story: "3 tişört, 1 polar, 2 pantolon, telefon, powerbank, ilaçlar. VE HEPSİ BU! Minimalizm özgürlüktür.",
        cta: "Tam eşya listesi sitemde. Go Burak Go dünyasına hoş geldin!",
        fullScript: "[HOOK] 7 ay, 13 ülke, TEK ÇANTA!\n\n[STORY] Kıyafetler, teknoloji, ilaçlar... Minimalizm özgürlüktür!\n\n[CTA] Go Burak Go!",
        durationSeconds: 55,
        targetPlatform: "instagram_reels",
        status: "draft",
        contentType: "original",
        needsFootage: true,
        footageNotes: "Ankara'da evde çekilecek. Çantayı aç, her şeyi tek tek göster.",
        stockMediaUrls: [],
      },
      {
        trendTopicId: insertedTrends[2].id,
        title: "15 Eylül: Geri Sayım Başladı!",
        hook: "30 gün sonra hayatımın macerasına başlıyorum. Evet, KORKUYORUM!",
        story: "Korkmak normal. Ama gitmemekten daha çok korkuyorum. 50 yaşında 'keşke' demek istemiyorum.",
        cta: "Hazırlık günlüğüm sitemde. Go Burak Go!",
        fullScript: "[HOOK] 30 gün sonra yola çıkıyorum!\n\n[STORY] Korkmak normal, ama gitmemek daha korkutucu.\n\n[CTA] Go Burak Go!",
        durationSeconds: 55,
        targetPlatform: "youtube_shorts",
        status: "draft",
        contentType: "original",
        needsFootage: true,
        footageNotes: "Samimi, duygusal ton. VLOG tarzı, evde çekilebilir.",
        stockMediaUrls: [],
      },
    ];

    const allScenarios = [...preLaunchScenarios, ...originalScenarios];
    const insertedScenarios = await db.insert(scenarios).values(allScenarios).returning();

    // ============================================
    // YAYIN TAKVİMİ - Hemen başla, 15 Eylül'e kadar
    // ============================================
    const today = new Date();
    const tripStart = new Date("2026-09-15");
    
    // Pre-launch içerikler için schedule (bugünden 15 Eylül'e kadar)
    const preLaunchCount = preLaunchScenarios.length;
    const scheduleItems: {
      scenarioId: number;
      platform: string;
      scheduledAt: Date;
      status: "scheduled" | "published";
      caption: string;
      hashtags: string;
    }[] = [];

    // Her 2-3 günde bir içerik, her platformda
    let currentDate = new Date(today);
    currentDate.setHours(10, 0, 0, 0);
    
    for (let i = 0; i < preLaunchCount; i++) {
      const scenario = insertedScenarios[i];
      const platforms = ["tiktok", "instagram", "youtube"];
      
      platforms.forEach((platform, j) => {
        const publishDate = new Date(currentDate);
        publishDate.setHours(10 + j * 4, 0, 0, 0); // 10:00, 14:00, 18:00
        
        scheduleItems.push({
          scenarioId: scenario.id,
          platform,
          scheduledAt: publishDate,
          status: publishDate < today ? "published" : "scheduled",
          caption: `${scenario.title} 🌍✈️ #GoBurakGo`,
          hashtags: "#GoBurakGo #DünyaTuru #SoloTravel #BütçeliSeyahat #OrtaAsya #GüneydoğuAsya #Seyahat2026 #TravelTips",
        });
      });
      
      // Sonraki içerik için 2-3 gün ekle
      currentDate.setDate(currentDate.getDate() + (i % 2 === 0 ? 2 : 3));
    }

    // Kendi çekim içerikleri için schedule (15 Eylül öncesi son hafta)
    const originalStart = new Date(tripStart);
    originalStart.setDate(originalStart.getDate() - 7);
    
    for (let i = preLaunchCount; i < insertedScenarios.length; i++) {
      const scenario = insertedScenarios[i];
      const platforms = ["tiktok", "instagram", "youtube"];
      const dayOffset = (i - preLaunchCount) * 2;
      
      platforms.forEach((platform, j) => {
        const publishDate = new Date(originalStart);
        publishDate.setDate(publishDate.getDate() + dayOffset);
        publishDate.setHours(10 + j * 4, 0, 0, 0);
        
        scheduleItems.push({
          scenarioId: scenario.id,
          platform,
          scheduledAt: publishDate,
          status: "scheduled",
          caption: `${scenario.title} 🌍✈️ #GoBurakGo #15EylüldeYolaÇıkıyorum`,
          hashtags: "#GoBurakGo #DünyaTuru #Hazırlık #SoloTravel #İpekYolu",
        });
      });
    }

    await db.insert(publishSchedule).values(scheduleItems);

    return NextResponse.json({ 
      success: true, 
      message: "Seed data created successfully",
      stats: {
        preLaunchContent: preLaunchCount,
        originalContent: originalScenarios.length,
        totalScheduled: scheduleItems.length
      }
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
