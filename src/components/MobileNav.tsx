"use client";

type ActiveTab = "dashboard" | "trends" | "scenarios" | "schedule" | "map" | "settings";

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const navItems: { id: ActiveTab; icon: string; label: string }[] = [
  { id: "dashboard", icon: "🏠", label: "Panel" },
  { id: "scenarios", icon: "🎬", label: "Senaryolar" },
  { id: "schedule", icon: "📅", label: "Takvim" },
  { id: "map", icon: "🗺️", label: "Rota" },
  { id: "settings", icon: "⚙️", label: "Ayarlar" },
];

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-card border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
              activeTab === item.id
                ? "bg-brand-orange/20 text-brand-orange"
                : "text-white/40 active:bg-white/5"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
