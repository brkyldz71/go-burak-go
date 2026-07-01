"use client";

import type { TrendTopic } from "@/app/page";

interface TrendPanelProps {
  trends: TrendTopic[];
  compact?: boolean;
}

const sourceIcons: Record<string, string> = {
  tiktok: "🎵",
  youtube: "▶️",
  reddit: "💬",
};

const sourceColors: Record<string, string> = {
  tiktok: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  youtube: "bg-red-500/20 text-red-400 border-red-500/30",
  reddit: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const categoryLabels: Record<string, string> = {
  budget_travel: "💰 Bütçe Dostu",
  hitchhiking: "🤙 Otostop",
  asia_routes: "🏯 Asya Rotaları",
  backpacking: "🎒 Sırt Çantalı",
  world_tour: "🌍 Dünya Turu",
};

export default function TrendPanel({ trends, compact }: TrendPanelProps) {
  if (trends.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <span className="text-4xl mb-3 block">📈</span>
        <p className="text-white/40">Henüz trend verisi yok</p>
        <p className="text-white/20 text-sm mt-1">
          Demo verileri yükleyerek başlayın
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "space-y-4"}>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">🔥 Trend Analizi</h2>
            <p className="text-sm text-white/40 mt-1">
              Reddit, TikTok ve YouTube&apos;dan taranan güncel konular
            </p>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
            ✅ Son tarama: bugün
          </span>
        </div>
      )}

      <div className={compact ? "space-y-3" : "grid gap-4"}>
        {(compact ? trends.slice(0, 3) : trends).map((trend, i) => (
          <div
            key={trend.id}
            className="glass-card rounded-xl p-4 md:p-5 hover:bg-white/[0.08] transition-all duration-300 group animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{sourceIcons[trend.source] || "📊"}</span>
                <div>
                  <h3 className="font-bold text-white group-hover:text-brand-orange transition-colors">
                    {trend.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                        sourceColors[trend.source] || "bg-white/10 text-white/60"
                      }`}
                    >
                      {trend.source.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-white/30">
                      {categoryLabels[trend.category] || trend.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trend Score */}
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white/40">Skor</span>
                  <span
                    className={`text-lg font-black ${
                      trend.trendScore >= 90
                        ? "text-green-400"
                        : trend.trendScore >= 80
                        ? "text-yellow-400"
                        : "text-white/60"
                    }`}
                  >
                    {trend.trendScore}
                  </span>
                </div>
                {/* Score bar */}
                <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      trend.trendScore >= 90
                        ? "bg-green-400"
                        : trend.trendScore >= 80
                        ? "bg-yellow-400"
                        : "bg-white/40"
                    }`}
                    style={{ width: `${trend.trendScore}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-white/50 leading-relaxed">
              {trend.description}
            </p>

            {trend.hashtags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {trend.hashtags.split(",").map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-brand-orange/10 text-brand-orange text-[10px] rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {compact && trends.length > 3 && (
        <p className="text-center text-white/30 text-xs mt-3">
          +{trends.length - 3} trend daha...
        </p>
      )}
    </div>
  );
}
