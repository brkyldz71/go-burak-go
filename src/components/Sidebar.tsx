"use client";

type ActiveTab = "dashboard" | "trends" | "scenarios" | "schedule" | "map" | "settings";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const navItems: { id: ActiveTab; icon: string; label: string }[] = [
  { id: "dashboard", icon: "🏠", label: "Panel" },
  { id: "trends", icon: "📈", label: "Trendler" },
  { id: "scenarios", icon: "🎬", label: "Senaryolar" },
  { id: "schedule", icon: "📅", label: "Takvim" },
  { id: "map", icon: "🗺️", label: "Dünya Turu" },
  { id: "settings", icon: "⚙️", label: "Ayarlar" },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 glass-card z-40 flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center text-lg font-black text-white shrink-0">
          G
        </div>
        <div className="hidden lg:block">
          <h2 className="font-extrabold text-lg gradient-text leading-tight">Go Burak Go</h2>
          <p className="text-[10px] text-white/40 mt-0.5">İçerik Asistanı v1.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
              activeTab === item.id
                ? "bg-brand-orange/20 text-brand-orange border border-brand-orange/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            <span className="hidden lg:block text-sm font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Protocol Info */}
      <div className="p-3 lg:p-4 border-t border-white/5">
        <div className="hidden lg:block glass-card rounded-xl p-3">
          <p className="text-[10px] text-brand-orange font-semibold mb-1">
            🤖 Çalışma Protokolü
          </p>
          <div className="space-y-1">
            {[
              "Trend Analizi",
              "Senaryo Yazımı",
              "Çekim Notları",
              "Seslendirme (ElevenLabs)",
              "Otomatik Paylaşım",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/60" />
                <span className="text-[9px] text-white/40">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:hidden flex justify-center">
          <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
