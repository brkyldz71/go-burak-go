"use client";

import type { TrendTopic, Scenario, ScheduleItem, Country } from "@/app/page";

interface StatsBarProps {
  trends: TrendTopic[];
  scenarios: Scenario[];
  schedule: ScheduleItem[];
  countries: Country[];
}

export default function StatsBar({
  trends,
  scenarios,
  schedule,
  countries,
}: StatsBarProps) {
  const publishedCount = schedule.filter((s) => s.status === "published").length;
  const scheduledCount = schedule.filter((s) => s.status === "scheduled").length;
  const preLaunchCount = scenarios.filter((s) => s.contentType === "pre_launch").length;
  const approvedCount = scenarios.filter((s) => s.status === "approved").length;
  const completedCountries = countries.filter((c) => c.status === "completed").length;

  const stats = [
    {
      label: "Aktif Trend",
      value: trends.length,
      icon: "📈",
      color: "from-orange-500 to-amber-500",
      sub: "Reddit, TikTok, YouTube",
    },
    {
      label: "Lansman Öncesi",
      value: preLaunchCount,
      icon: "🚀",
      color: "from-brand-orange to-brand-gold",
      sub: `${approvedCount} onaylı, stok video ile`,
    },
    {
      label: "Yayın Planı",
      value: schedule.length,
      icon: "📅",
      color: "from-emerald-500 to-teal-500",
      sub: `${publishedCount} yayında, ${scheduledCount} bekliyor`,
    },
    {
      label: "Ülke Rotası",
      value: `${completedCountries}/${countries.length}`,
      icon: "🌍",
      color: "from-purple-500 to-pink-500",
      sub: "15 Eylül'de başlıyor",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="glass-card rounded-xl p-4 hover:bg-white/[0.08] transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">{stat.icon}</span>
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`}
            />
          </div>
          <p className="text-2xl md:text-3xl font-black text-white mb-1">
            {stat.value}
          </p>
          <p className="text-sm font-medium text-white/70">{stat.label}</p>
          <p className="text-xs text-white/30 mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
