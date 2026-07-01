"use client";

import type { ScheduleItem } from "@/app/page";

interface SchedulePanelProps {
  schedule: ScheduleItem[];
  compact?: boolean;
}

const platformConfig: Record<string, { icon: string; label: string; gradient: string }> = {
  tiktok: { icon: "🎵", label: "TikTok", gradient: "from-pink-500 to-rose-500" },
  instagram: { icon: "📸", label: "Instagram", gradient: "from-purple-500 to-pink-500" },
  youtube: { icon: "▶️", label: "YouTube", gradient: "from-red-500 to-orange-500" },
};

const statusBadge: Record<string, { color: string; label: string }> = {
  scheduled: { color: "bg-yellow-500/20 text-yellow-400", label: "⏳ Bekliyor" },
  publishing: { color: "bg-blue-500/20 text-blue-400", label: "🔄 Yayınlanıyor" },
  published: { color: "bg-green-500/20 text-green-400", label: "✅ Yayında" },
  failed: { color: "bg-red-500/20 text-red-400", label: "❌ Hata" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SchedulePanel({ schedule, compact }: SchedulePanelProps) {
  if (schedule.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <span className="text-4xl mb-3 block">📅</span>
        <p className="text-white/40">Henüz yayın planı yok</p>
        <p className="text-white/20 text-sm mt-1">
          Demo verileri yükleyerek başlayın
        </p>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">📅 Yayın Takvimi</h2>
          <p className="text-sm text-white/40 mt-1">
            TikTok, Instagram Reels ve YouTube Shorts otomatik paylaşım planı
          </p>
        </div>
      )}

      {compact && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-sm">📅 Yaklaşan Yayınlar</h3>
          <span className="text-[10px] text-white/30">
            {schedule.length} gönderi planlanmış
          </span>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs text-white/30 font-medium">
                  Platform
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/30 font-medium">
                  İçerik
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/30 font-medium">
                  Tarih/Saat
                </th>
                <th className="text-left px-4 py-3 text-xs text-white/30 font-medium">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, i) => {
                const platform = platformConfig[item.platform] || {
                  icon: "📱",
                  label: item.platform,
                  gradient: "from-gray-500 to-gray-600",
                };
                const badge = statusBadge[item.status] || statusBadge.scheduled;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors animate-slide-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-sm`}
                        >
                          {platform.icon}
                        </div>
                        <span className="text-white/70 text-xs font-medium">
                          {platform.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white/80 text-xs font-medium truncate max-w-[200px]">
                        {item.scenarioTitle || "—"}
                      </p>
                      {item.caption && (
                        <p className="text-white/30 text-[10px] truncate max-w-[200px] mt-0.5">
                          {item.caption}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/60 text-xs">
                        {formatDate(item.scheduledAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
