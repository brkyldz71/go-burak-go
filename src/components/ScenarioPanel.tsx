"use client";

import { useState } from "react";
import type { Scenario } from "@/app/page";

interface ScenarioPanelProps {
  scenarios: Scenario[];
  onStatusChange: (id: number, status: string) => void;
  compact?: boolean;
}

const platformIcons: Record<string, string> = {
  tiktok: "🎵",
  instagram_reels: "📸",
  youtube_shorts: "▶️",
};

const platformLabels: Record<string, string> = {
  tiktok: "TikTok",
  instagram_reels: "Instagram Reels",
  youtube_shorts: "YouTube Shorts",
};

const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
  draft: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "Taslak", icon: "📝" },
  approved: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Onaylandı", icon: "✅" },
  produced: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Üretildi", icon: "🎥" },
  published: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Yayında", icon: "🚀" },
};

const contentTypeConfig: Record<string, { color: string; label: string; icon: string }> = {
  pre_launch: { color: "bg-brand-orange/20 text-brand-orange border-brand-orange/30", label: "Lansman Öncesi", icon: "🚀" },
  original: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", label: "Kendi Çekim", icon: "🎬" },
  stock_based: { color: "bg-violet-500/20 text-violet-400 border-violet-500/30", label: "Stok Video", icon: "📦" },
};

export default function ScenarioPanel({
  scenarios,
  onStatusChange,
  compact,
}: ScenarioPanelProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [contentFilter, setContentFilter] = useState<string>("all");

  let filtered = scenarios;
  
  // Status filter
  if (activeFilter !== "all") {
    filtered = filtered.filter((s) => s.status === activeFilter);
  }
  
  // Content type filter
  if (contentFilter !== "all") {
    filtered = filtered.filter((s) => s.contentType === contentFilter);
  }

  const preLaunchCount = scenarios.filter(s => s.contentType === "pre_launch").length;
  const originalCount = scenarios.filter(s => s.contentType === "original").length;

  if (scenarios.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <span className="text-4xl mb-3 block">🎬</span>
        <p className="text-white/40">Henüz senaryo yok</p>
        <p className="text-white/20 text-sm mt-1">
          Demo verileri yükleyerek başlayın
        </p>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">🎬 Senaryolar</h2>
              <p className="text-sm text-white/40 mt-1">
                Hook → Story → CTA formatında 45-60 saniyelik içerikler
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="text-brand-orange text-lg">🚀</span>
                <div>
                  <p className="text-xs text-white/40">Lansman Öncesi</p>
                  <p className="text-lg font-bold text-white">{preLaunchCount}</p>
                </div>
              </div>
              <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="text-cyan-400 text-lg">🎬</span>
                <div>
                  <p className="text-xs text-white/40">Kendi Çekim</p>
                  <p className="text-lg font-bold text-white">{originalCount}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Type Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-white/30 mr-1">Tür:</span>
            {[
              { id: "all", label: "Tümü", count: scenarios.length },
              { id: "pre_launch", label: "🚀 Lansman Öncesi", count: preLaunchCount },
              { id: "original", label: "🎬 Kendi Çekim", count: originalCount },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setContentFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  contentFilter === f.id
                    ? "bg-brand-orange text-white"
                    : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-white/30 mr-1">Durum:</span>
            {["all", "draft", "approved", "produced", "published"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeFilter === f
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                {f === "all"
                  ? "Tümü"
                  : `${statusConfig[f]?.icon} ${statusConfig[f]?.label}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((scenario, i) => {
          const isExpanded = expandedId === scenario.id;
          const status = statusConfig[scenario.status] || statusConfig.draft;
          const contentType = contentTypeConfig[scenario.contentType] || contentTypeConfig.original;
          const isPreLaunch = scenario.contentType === "pre_launch";

          return (
            <div
              key={scenario.id}
              className={`glass-card rounded-xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300 animate-slide-up ${
                isPreLaunch ? "border-l-4 border-l-brand-orange" : ""
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-xl shrink-0 mt-0.5">
                      {platformIcons[scenario.targetPlatform] || "📱"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-sm md:text-base truncate">
                        {scenario.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${contentType.color}`}
                        >
                          {contentType.icon} {contentType.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${status.color}`}
                        >
                          {status.icon} {status.label}
                        </span>
                        <span className="text-[10px] text-white/30">
                          {platformLabels[scenario.targetPlatform] || scenario.targetPlatform}
                        </span>
                        <span className="text-[10px] text-white/30">
                          ⏱️ {scenario.durationSeconds}sn
                        </span>
                        {!isPreLaunch && scenario.needsFootage && (
                          <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                            📹 Çekim Gerekli
                          </span>
                        )}
                        {isPreLaunch && (
                          <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                            ✅ Hazır
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-white/30 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                  {/* Pre-launch badge */}
                  {isPreLaunch && (
                    <div className="bg-brand-orange/10 rounded-lg p-3 border border-brand-orange/20">
                      <p className="text-[10px] font-bold text-brand-orange mb-1">
                        🚀 LANSMAN ÖNCESİ İÇERİK
                      </p>
                      <p className="text-sm text-white/60">
                        Bu içerik stok video kullanılarak hazırlanacak. Çekim gerektirmez!
                        15 Eylül&apos;e kadar takipçi kitlesi oluşturmak için şimdiden paylaşılabilir.
                      </p>
                    </div>
                  )}

                  {/* Footage Notes - if needs footage */}
                  {!isPreLaunch && scenario.needsFootage && scenario.footageNotes && (
                    <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                      <p className="text-[10px] font-bold text-yellow-400 mb-1">
                        📹 ÇEKİM NOTLARI (SENİN İÇİN)
                      </p>
                      <p className="text-sm text-white/80">{scenario.footageNotes}</p>
                    </div>
                  )}

                  {/* Script Sections */}
                  <div className="space-y-3">
                    <div className="bg-red-500/10 rounded-lg p-3 border-l-4 border-red-500">
                      <p className="text-[10px] font-bold text-red-400 mb-1">
                        🪝 HOOK (Merak Uyandırıcı Giriş) — 0-8sn
                      </p>
                      <p className="text-sm text-white/80">{scenario.hook}</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 border-l-4 border-blue-500">
                      <p className="text-[10px] font-bold text-blue-400 mb-1">
                        📖 STORY (Bilgi Verici İçerik) — 8-45sn
                      </p>
                      <p className="text-sm text-white/80">{scenario.story}</p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="text-[10px] font-bold text-green-400 mb-1">
                        🎯 CTA (Kapanış) — 45-{scenario.durationSeconds}sn
                      </p>
                      <p className="text-sm text-white/80">{scenario.cta}</p>
                    </div>
                  </div>

                  {/* Stock Media Preview for Pre-launch */}
                  {isPreLaunch && scenario.stockMediaUrls && scenario.stockMediaUrls.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40 mb-2">🎥 Kullanılacak Stok Videolar</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {scenario.stockMediaUrls.map((url, idx) => (
                          <div key={idx} className="shrink-0">
                            <video
                              src={url}
                              className="h-32 w-20 object-cover rounded-lg border border-white/10"
                              muted
                              loop
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                              }}
                            />
                            <p className="text-[9px] text-white/30 mt-1 text-center">
                              Video {idx + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full Script Copyable */}
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-white/40">📋 Tam Senaryo (Kopyala)</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(scenario.fullScript)}
                        className="px-2 py-1 text-[10px] bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded transition-all"
                      >
                        Kopyala
                      </button>
                    </div>
                    <pre className="text-xs text-white/60 whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-y-auto">
                      {scenario.fullScript}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
                    <span className="text-xs text-white/30 mr-2">
                      Durum değiştir:
                    </span>
                    {["draft", "approved", "produced", "published"].map((s) => {
                      const cfg = statusConfig[s];
                      return (
                        <button
                          key={s}
                          onClick={() => onStatusChange(scenario.id, s)}
                          disabled={scenario.status === s}
                          className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                            scenario.status === s
                              ? cfg.color + " opacity-50 cursor-not-allowed"
                              : "bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {cfg.icon} {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
