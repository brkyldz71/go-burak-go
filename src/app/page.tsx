"use client";

import { useState, useEffect, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import TrendPanel from "@/components/TrendPanel";
import ScenarioPanel from "@/components/ScenarioPanel";
import SchedulePanel from "@/components/SchedulePanel";
import WorldMap from "@/components/WorldMap";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import StatsBar from "@/components/StatsBar";
import SettingsPanel from "@/components/SettingsPanel";

export interface TrendTopic {
  id: number;
  title: string;
  source: string;
  category: string;
  description: string;
  trendScore: number;
  hashtags: string | null;
  isActive: boolean;
  scannedAt: string;
  createdAt: string;
}

export interface Scenario {
  id: number;
  trendTopicId: number | null;
  title: string;
  hook: string;
  story: string;
  cta: string;
  fullScript: string;
  durationSeconds: number;
  language: string;
  targetPlatform: string;
  status: string;
  contentType: string;
  stockMediaUrls: string[] | null;
  needsFootage: boolean;
  footageNotes: string | null;
  createdAt: string;
  updatedAt: string;
  trendTitle: string | null;
  trendCategory: string | null;
}

export interface ScheduleItem {
  id: number;
  scenarioId: number | null;
  platform: string;
  scheduledAt: string;
  publishedAt: string | null;
  status: string;
  caption: string | null;
  hashtags: string | null;
  scenarioTitle: string | null;
  scenarioStatus: string | null;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  region: string;
  orderIndex: number;
  status: string;
  arrivalDate: string | null;
  departureDate: string | null;
  dailyBudget: string | null;
  highlights: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface SocialAccount {
  id: number;
  platform: string;
  accountName: string | null;
  accountUrl: string | null;
  isConnected: boolean;
  lastSyncAt: string | null;
  hasApiKey: boolean;
  hasAccessToken: boolean;
}

export interface AppSettings {
  trip_start_date?: string;
  current_location?: string;
  current_phase?: string;
  creator_name?: string;
}

type ActiveTab = "dashboard" | "trends" | "scenarios" | "schedule" | "map" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [trends, setTrends] = useState<TrendTopic[]>([]);
  const [allScenarios, setScenarios] = useState<Scenario[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [settings, setSettings] = useState<AppSettings>({});
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [trendsRes, scenariosRes, scheduleRes, countriesRes, accountsRes, settingsRes] =
        await Promise.all([
          fetch("/api/trends"),
          fetch("/api/scenarios"),
          fetch("/api/schedule"),
          fetch("/api/countries"),
          fetch("/api/accounts"),
          fetch("/api/settings"),
        ]);
      const [trendsData, scenariosData, scheduleData, countriesData, accountsData, settingsData] =
        await Promise.all([
          trendsRes.json(),
          scenariosRes.json(),
          scheduleRes.json(),
          countriesRes.json(),
          accountsRes.json(),
          settingsRes.json(),
        ]);
      setTrends(trendsData);
      setScenarios(scenariosData);
      setSchedule(scheduleData);
      setCountries(countriesData);
      setAccounts(accountsData);
      setSettings(settingsData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/scenarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (err) {
      console.error("Status change error:", err);
    }
  };

  const handleAccountUpdate = async (data: {
    platform: string;
    accountName: string;
    accountUrl: string;
    apiKey?: string;
    accessToken?: string;
  }) => {
    try {
      await fetch("/api/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await fetchData();
    } catch (err) {
      console.error("Account update error:", err);
    }
  };

  const isEmpty =
    trends.length === 0 &&
    allScenarios.length === 0 &&
    schedule.length === 0 &&
    countries.length === 0;

  return (
    <div className="flex min-h-screen bg-brand-dark">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <main className="flex-1 lg:ml-64 pb-24 lg:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-card px-4 md:px-6 py-3 flex items-center justify-between safe-area-top">
          <div className="flex items-center gap-3">
            {/* Mobile Logo */}
            <div className="lg:hidden w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center text-base font-black text-white">
              G
            </div>
            <h1 className="text-lg md:text-xl font-bold gradient-text">
              Go Burak Go
            </h1>
            <span className="text-xs text-white/40 hidden md:block">
              {settings.current_phase === "preparation" 
                ? `📍 ${settings.current_location || "Ankara"} — Hazırlık`
                : "Dijital İçerik Asistanı"}
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {isEmpty && !loading && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-3 md:px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs md:text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {seeding ? "..." : "🚀 Yükle"}
              </button>
            )}
            {settings.trip_start_date && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
                <span className="text-brand-orange text-sm">🚀</span>
                <span className="text-xs text-white/60">
                  <strong className="text-brand-orange">{new Date(settings.trip_start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</strong>
                </span>
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center text-sm font-bold text-white">
              BY
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <div className="w-14 h-14 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-sm">Yükleniyor...</p>
            </div>
          </div>
        ) : (
          <div className="p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6">
            {activeTab === "dashboard" && (
              <>
                <HeroSection countries={countries} settings={settings} />
                <StatsBar
                  trends={trends}
                  scenarios={allScenarios}
                  schedule={schedule}
                  countries={countries}
                />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                  <TrendPanel trends={trends} compact />
                  <ScenarioPanel
                    scenarios={allScenarios.slice(0, 4)}
                    onStatusChange={handleStatusChange}
                    compact
                  />
                </div>
                <SchedulePanel schedule={schedule.slice(0, 6)} compact />
              </>
            )}
            {activeTab === "trends" && <TrendPanel trends={trends} />}
            {activeTab === "scenarios" && (
              <ScenarioPanel
                scenarios={allScenarios}
                onStatusChange={handleStatusChange}
              />
            )}
            {activeTab === "schedule" && <SchedulePanel schedule={schedule} />}
            {activeTab === "map" && <WorldMap countries={countries} settings={settings} />}
            {activeTab === "settings" && (
              <SettingsPanel 
                accounts={accounts} 
                settings={settings}
                onAccountUpdate={handleAccountUpdate}
              />
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
