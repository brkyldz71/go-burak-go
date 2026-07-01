"use client";

import { useState } from "react";
import type { SocialAccount, AppSettings } from "@/app/page";

interface SettingsPanelProps {
  accounts: SocialAccount[];
  settings: AppSettings;
  onAccountUpdate: (data: {
    platform: string;
    accountName: string;
    accountUrl: string;
    apiKey?: string;
    accessToken?: string;
  }) => Promise<void>;
}

const platformConfig: Record<string, { 
  icon: string; 
  label: string; 
  color: string;
  description: string;
  apiDocs: string;
}> = {
  tiktok: { 
    icon: "🎵", 
    label: "TikTok", 
    color: "from-pink-500 to-rose-500",
    description: "TikTok Creator API ile otomatik video yüklemesi",
    apiDocs: "https://developers.tiktok.com"
  },
  instagram: { 
    icon: "📸", 
    label: "Instagram", 
    color: "from-purple-500 to-pink-500",
    description: "Instagram Graph API ile Reels paylaşımı",
    apiDocs: "https://developers.facebook.com/docs/instagram-api"
  },
  youtube: { 
    icon: "▶️", 
    label: "YouTube", 
    color: "from-red-500 to-orange-500",
    description: "YouTube Data API ile Shorts yüklemesi",
    apiDocs: "https://developers.google.com/youtube"
  },
};

export default function SettingsPanel({ accounts, settings, onAccountUpdate }: SettingsPanelProps) {
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    accountName: string;
    accountUrl: string;
    apiKey: string;
    accessToken: string;
  }>({
    accountName: "",
    accountUrl: "",
    apiKey: "",
    accessToken: "",
  });
  const [saving, setSaving] = useState(false);

  const handleEdit = (account: SocialAccount) => {
    setEditingPlatform(account.platform);
    setFormData({
      accountName: account.accountName || "",
      accountUrl: account.accountUrl || "",
      apiKey: "",
      accessToken: "",
    });
  };

  const handleSave = async () => {
    if (!editingPlatform) return;
    setSaving(true);
    try {
      await onAccountUpdate({
        platform: editingPlatform,
        ...formData,
      });
      setEditingPlatform(null);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingPlatform(null);
    setFormData({ accountName: "", accountUrl: "", apiKey: "", accessToken: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">⚙️ Ayarlar</h2>
        <p className="text-sm text-white/40 mt-1">
          Sosyal medya hesaplarını bağla ve otomatik paylaşımı etkinleştir
        </p>
      </div>

      {/* Trip Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>📋</span> Tur Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/40 mb-1">İçerik Üreticisi</p>
            <p className="font-semibold text-white">{settings.creator_name || "—"}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/40 mb-1">Şu Anki Konum</p>
            <p className="font-semibold text-white">{settings.current_location || "—"}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/40 mb-1">Aşama</p>
            <p className="font-semibold text-yellow-400">
              {settings.current_phase === "preparation" ? "⏳ Hazırlık" : 
               settings.current_phase === "traveling" ? "✈️ Yolculuk" : 
               "✅ Tamamlandı"}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/40 mb-1">Yola Çıkış Tarihi</p>
            <p className="font-semibold text-brand-orange">
              {settings.trip_start_date 
                ? new Date(settings.trip_start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
                : "—"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Social Accounts */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>🔗</span> Sosyal Medya Hesapları
        </h3>
        <p className="text-sm text-white/40 mb-6">
          Otomatik paylaşım için sosyal medya hesaplarını bağla. API anahtarlarını ilgili platformların developer portalından alabilirsin.
        </p>

        <div className="space-y-4">
          {["tiktok", "instagram", "youtube"].map((platform) => {
            const config = platformConfig[platform];
            const account = accounts.find((a) => a.platform === platform);
            const isEditing = editingPlatform === platform;

            return (
              <div
                key={platform}
                className={`rounded-xl border transition-all ${
                  isEditing 
                    ? "bg-white/[0.08] border-brand-orange/30" 
                    : "bg-white/[0.03] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{config.label}</h4>
                        <p className="text-xs text-white/40">{config.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {account?.isConnected ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                          ✅ Bağlı
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-white/5 text-white/40 text-xs font-semibold rounded-full border border-white/10">
                          Bağlı Değil
                        </span>
                      )}
                      {!isEditing && (
                        <button
                          onClick={() => handleEdit(account || { 
                            id: 0, 
                            platform, 
                            accountName: null, 
                            accountUrl: null, 
                            isConnected: false, 
                            lastSyncAt: null,
                            hasApiKey: false,
                            hasAccessToken: false
                          })}
                          className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-all"
                        >
                          {account?.isConnected ? "Düzenle" : "Bağla"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Connected Account Info */}
                  {account?.isConnected && !isEditing && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-4">
                      <div>
                        <p className="text-xs text-white/30">Hesap</p>
                        <p className="text-sm text-white/70">@{account.accountName}</p>
                      </div>
                      {account.hasApiKey && (
                        <div>
                          <p className="text-xs text-white/30">API Key</p>
                          <p className="text-sm text-green-400">••••••••</p>
                        </div>
                      )}
                      {account.hasAccessToken && (
                        <div>
                          <p className="text-xs text-white/30">Access Token</p>
                          <p className="text-sm text-green-400">••••••••</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Edit Form */}
                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-white/40 mb-1.5">
                            Hesap Adı (kullanıcı adı)
                          </label>
                          <input
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            placeholder="@goburakgo"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-white/40 mb-1.5">
                            Profil URL
                          </label>
                          <input
                            type="text"
                            value={formData.accountUrl}
                            onChange={(e) => setFormData({ ...formData, accountUrl: e.target.value })}
                            placeholder={`https://${platform}.com/@goburakgo`}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50"
                          />
                        </div>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <p className="text-xs text-yellow-400 font-semibold mb-2">🔐 API Bilgileri (Opsiyonel)</p>
                        <p className="text-[10px] text-white/40 mb-3">
                          Otomatik paylaşım için API anahtarları gerekli. 
                          <a href={config.apiDocs} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline ml-1">
                            Developer dokümantasyonu →
                          </a>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-white/40 mb-1">API Key / Client ID</label>
                            <input
                              type="password"
                              value={formData.apiKey}
                              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                              placeholder="••••••••••••"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/40 mb-1">Access Token</label>
                            <input
                              type="password"
                              value={formData.accessToken}
                              onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                              placeholder="••••••••••••"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-orange/50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving || !formData.accountName}
                          className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
                        >
                          {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ElevenLabs Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>🎙️</span> Seslendirme (ElevenLabs)
        </h3>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-white/70 mb-2">
            Senaryolar için otomatik seslendirme ElevenLabs API ile yapılacak. 
            Burak&apos;ın enerjik ve maceracı ses tonu klonlanarak kullanılacak.
          </p>
          <p className="text-xs text-white/40">
            API Key için: <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">elevenlabs.io</a>
          </p>
          <div className="mt-3">
            <span className="px-3 py-1 bg-white/5 text-white/40 text-xs font-semibold rounded-full border border-white/10">
              🔜 Yakında aktif edilecek
            </span>
          </div>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>🔄</span> Çalışma Akışı
        </h3>
        <div className="space-y-3">
          {[
            { step: 1, icon: "📈", title: "Trend Analizi", desc: "Reddit, TikTok, YouTube trendleri otomatik taranır", status: "active" },
            { step: 2, icon: "🎬", title: "Senaryo Yazımı", desc: "Hook → Story → CTA formatında senaryolar üretilir", status: "active" },
            { step: 3, icon: "📝", title: "Çekim Notları", desc: "Her senaryo için çekim yönergeleri hazırlanır", status: "active" },
            { step: 4, icon: "🎥", title: "Video Çekimi", desc: "SEN çekim yapar, platform bekler", status: "waiting" },
            { step: 5, icon: "🎙️", title: "Seslendirme", desc: "ElevenLabs ile Türkçe seslendirme", status: "pending" },
            { step: 6, icon: "📅", title: "Otomatik Paylaşım", desc: "Belirlenen saatlerde 3 platforma yükleme", status: "pending" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4 bg-white/[0.03] rounded-lg p-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                item.status === "active" ? "bg-green-500/20" :
                item.status === "waiting" ? "bg-yellow-500/20" :
                "bg-white/5"
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                item.status === "active" ? "bg-green-500/20 text-green-400" :
                item.status === "waiting" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-white/5 text-white/30"
              }`}>
                {item.status === "active" ? "✅ Aktif" :
                 item.status === "waiting" ? "⏳ Seni bekliyor" :
                 "🔜 Beklemede"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
