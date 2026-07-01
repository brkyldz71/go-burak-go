"use client";

import type { Country, AppSettings } from "@/app/page";

interface HeroSectionProps {
  countries: Country[];
  settings: AppSettings;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function HeroSection({ countries, settings }: HeroSectionProps) {
  const completedCount = countries.filter((c) => c.status === "completed").length;
  const totalCount = countries.length;
  const isPreparing = settings.current_phase === "preparation";
  const daysUntilTrip = settings.trip_start_date ? getDaysUntil(settings.trip_start_date) : null;

  return (
    <section className="relative overflow-hidden rounded-2xl">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-brand-dark/40" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {isPreparing ? (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">
                ⏳ HAZIRLIK AŞAMASI
              </span>
            ) : (
              <span className="px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-semibold rounded-full border border-brand-orange/30">
                🔴 CANLI — Dünya Turu 2026
              </span>
            )}
            <span className="px-3 py-1 bg-white/5 text-white/60 text-xs rounded-full">
              {completedCount}/{totalCount} Ülke
            </span>
            {daysUntilTrip !== null && daysUntilTrip > 0 && (
              <span className="px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-semibold rounded-full border border-brand-orange/30 animate-pulse">
                🚀 {daysUntilTrip} gün kaldı!
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">
            <span className="gradient-text">Go Burak Go</span>
            <br />
            <span className="text-white/90 text-2xl md:text-3xl font-bold">
              Dijital İçerik Asistanı
            </span>
          </h1>

          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
            {isPreparing ? (
              <>
                13 ülkeli dünya turuna hazırlanan <strong className="text-brand-orange">{settings.creator_name || "Burak Yıldız"}</strong>&apos;ın 
                viral içerik üretim platformu. Şu an <strong className="text-white">{settings.current_location || "Ankara"}</strong>&apos;da 
                hazırlıklar devam ediyor!
              </>
            ) : (
              <>
                13 ülkeli dünya turuna çıkan Burak Yıldız&apos;ın viral içerik üretim
                platformu. Trendleri tara, senaryolar yaz, otomatik paylaş!
              </>
            )}
          </p>

          {isPreparing && settings.trip_start_date && (
            <div className="glass-card rounded-xl p-4 inline-flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/20 flex items-center justify-center text-2xl">
                📍
              </div>
              <div>
                <p className="text-xs text-white/40 mb-0.5">Şu anki konum</p>
                <p className="text-lg font-bold text-white">
                  {settings.current_location || "Ankara, Türkiye"}
                </p>
                <p className="text-xs text-brand-orange">
                  Yola çıkış: {new Date(settings.trip_start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating stats */}
        <div className="absolute top-6 right-6 hidden xl:flex flex-col gap-3">
          {[
            { emoji: "🎬", value: "9", label: "Senaryo" },
            { emoji: "📈", value: "3", label: "Trend" },
            { emoji: "🌍", value: isPreparing ? "0" : `${completedCount}`, label: isPreparing ? "Hazırlık" : "Ülke Gezildi" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-3 text-center min-w-[90px] animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <span className="text-xl">{stat.emoji}</span>
              <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
              <p className="text-[10px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
