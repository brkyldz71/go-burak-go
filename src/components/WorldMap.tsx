"use client";

import { useState } from "react";
import type { Country, AppSettings } from "@/app/page";

interface WorldMapProps {
  countries: Country[];
  settings: AppSettings;
}

const statusConfig: Record<
  string,
  { color: string; bgColor: string; label: string; icon: string }
> = {
  completed: {
    color: "text-green-400",
    bgColor: "bg-green-500/20 border-green-500/30",
    label: "Tamamlandı",
    icon: "✅",
  },
  current: {
    color: "text-brand-orange",
    bgColor: "bg-brand-orange/20 border-brand-orange/30",
    label: "Şu An Burada",
    icon: "📍",
  },
  upcoming: {
    color: "text-white/40",
    bgColor: "bg-white/5 border-white/10",
    label: "Yaklaşıyor",
    icon: "🔜",
  },
};

export default function WorldMap({ countries, settings }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  if (countries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <span className="text-4xl mb-3 block">🗺️</span>
        <p className="text-white/40">Henüz ülke verisi yok</p>
      </div>
    );
  }

  const completedCount = countries.filter((c) => c.status === "completed").length;
  const isPreparing = settings.current_phase === "preparation";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">🗺️ Dünya Turu Rotası</h2>
        <p className="text-sm text-white/40 mt-1">
          13 ülke • {completedCount} tamamlandı •{" "}
          {isPreparing 
            ? `Başlangıç: ${settings.trip_start_date ? new Date(settings.trip_start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) : "Yakında"}`
            : "Yolculuk devam ediyor"
          }
        </p>
      </div>

      {/* Current Location Banner for Preparation Phase */}
      {isPreparing && (
        <div className="glass-card rounded-xl p-4 bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">
              📍
            </div>
            <div className="flex-1">
              <p className="text-xs text-yellow-400 font-semibold">HAZIRLIK AŞAMASI</p>
              <p className="text-lg font-bold text-white">{settings.current_location || "Ankara, Türkiye"}</p>
              <p className="text-xs text-white/40">Hazırlıklar devam ediyor. Çekim yapılacak senaryolar hazırlanıyor.</p>
            </div>
            {settings.trip_start_date && (
              <div className="text-right">
                <p className="text-xs text-white/40">Yola çıkış</p>
                <p className="text-lg font-bold text-brand-orange">
                  {new Date(settings.trip_start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40">Tur İlerlemesi</span>
          <span className="text-xs text-brand-orange font-semibold">
            {Math.round((completedCount / countries.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              completedCount === 0 
                ? "bg-white/20" 
                : "bg-gradient-to-r from-brand-orange to-brand-gold"
            }`}
            style={{
              width: completedCount === 0 ? "2%" : `${(completedCount / countries.length) * 100}%`,
            }}
          />
        </div>
        {completedCount === 0 && (
          <p className="text-xs text-white/30 mt-2 text-center">
            Henüz yola çıkılmadı — İlk durak: {countries[0]?.name}
          </p>
        )}
      </div>

      {/* Route Timeline */}
      <div className="relative">
        {/* Connection line */}
        <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${
          completedCount === 0 
            ? "bg-gradient-to-b from-white/20 via-white/10 to-white/5"
            : "bg-gradient-to-b from-green-500 via-brand-orange to-white/10"
        }`} />

        <div className="space-y-4">
          {countries.map((country, i) => {
            const status = statusConfig[country.status] || statusConfig.upcoming;
            const isSelected = selectedCountry?.id === country.id;
            const isFirst = i === 0;

            return (
              <div
                key={country.id}
                className="relative animate-slide-in-left"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-4 w-5 h-5 rounded-full border-2 z-10 ${
                    country.status === "completed"
                      ? "bg-green-500 border-green-400"
                      : country.status === "current"
                      ? "bg-brand-orange border-brand-orange-light animate-pulse-glow"
                      : isFirst && isPreparing
                      ? "bg-yellow-500/30 border-yellow-400/50"
                      : "bg-white/10 border-white/20"
                  }`}
                />

                {/* Card */}
                <div
                  className={`ml-14 glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/[0.08] border ${
                    isSelected
                      ? "border-brand-orange/50 bg-brand-orange/5"
                      : isFirst && isPreparing
                      ? "border-yellow-500/30 bg-yellow-500/5"
                      : "border-transparent"
                  }`}
                  onClick={() =>
                    setSelectedCountry(isSelected ? null : country)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 bg-white/5 rounded-lg shrink-0 flex items-center justify-center text-2xl">
                        {country.status === "completed" ? "✅" : 
                         country.status === "current" ? "📍" : 
                         isFirst && isPreparing ? "🎯" : "🏳️"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">
                            {country.orderIndex}. {country.name}
                          </h3>
                          {isFirst && isPreparing && (
                            <span className="text-xs text-yellow-400">(İlk Durak)</span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">
                          {country.region}
                          {country.arrivalDate &&
                            ` • ${new Date(country.arrivalDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${status.bgColor}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-[10px] text-white/30">Günlük Bütçe</p>
                        <p className="text-sm font-bold text-brand-orange">
                          {country.dailyBudget || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30">Planlanan Varış</p>
                        <p className="text-sm font-medium text-white/70">
                          {country.arrivalDate
                            ? new Date(country.arrivalDate).toLocaleDateString("tr-TR")
                            : "Planlanıyor"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30">Ayrılış</p>
                        <p className="text-sm font-medium text-white/70">
                          {country.departureDate
                            ? new Date(country.departureDate).toLocaleDateString("tr-TR")
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30">Planlanan Yerler</p>
                        <p className="text-sm font-medium text-white/70">
                          {country.highlights || "—"}
                        </p>
                      </div>
                      {country.status === "upcoming" && (
                        <div className="col-span-2 md:col-span-4">
                          <p className="text-[10px] text-yellow-400/70 italic">
                            📸 Bu ülkeye ait görseller yolculuk sırasında çekilecek
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
