import {
  RefreshCw,
  Heart,
  Check,
  Palette,
  Droplet,
  Shirt,
  Plus,
  Sparkles,
  Sun,
  Cloud,
  Send,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { PageHeader, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

interface OutfitRecommendation {
  id: number;
  outfit: { top: string; bottom: string; shoes: string };
  occasion: string;
  style: string;
  confidence: number;
  weather: "sunny" | "cloudy" | "rainy";
}

const mockRecommendations: OutfitRecommendation[] = [
  {
    id: 1,
    outfit: { top: "White Linen Shirt", bottom: "Beige Wide-Leg Trousers", shoes: "Leather Loafers" },
    occasion: "Casual Office",
    style: "Minimalist Chic",
    confidence: 94,
    weather: "sunny",
  },
  {
    id: 2,
    outfit: { top: "Camel Blazer", bottom: "Black Tailored Pants", shoes: "Chelsea Boots" },
    occasion: "Business Meeting",
    style: "Professional",
    confidence: 91,
    weather: "cloudy",
  },
  {
    id: 3,
    outfit: { top: "Striped Casual Tee", bottom: "Denim Jeans", shoes: "White Sneakers" },
    occasion: "Weekend Brunch",
    style: "Relaxed",
    confidence: 88,
    weather: "sunny",
  },
  {
    id: 4,
    outfit: { top: "Navy Polo", bottom: "Khaki Chinos", shoes: "White Sneakers" },
    occasion: "Outdoor Lunch",
    style: "Smart Casual",
    confidence: 86,
    weather: "rainy",
  },
];

const preferences = [
  { id: "casual", label: "Casual", icon: "👕" },
  { id: "formal", label: "Formal", icon: "👔" },
  { id: "minimal", label: "Minimal", icon: "⚪" },
  { id: "bold", label: "Bold", icon: "🔥" },
  { id: "classic", label: "Classic", icon: "✨" },
  { id: "trendy", label: "Trendy", icon: "🌟" },
];

const colorPalettes = [
  { name: "Spring Warm", colors: ["#FF6B6B", "#FFA06B", "#FFE66D", "#A8E6CF"] },
  { name: "Summer Cool", colors: ["#7FDBFF", "#B8C5D6", "#F5E6D3", "#C9B8A8"] },
  { name: "Autumn Earth", colors: ["#8B4513", "#A0522D", "#CD853F", "#DEB887"] },
  { name: "Winter Deep", colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"] },
];

const skinTones = [
  { id: "fair", label: "Fair", recommended: "Soft pastels, lavender, rose, sky blue" },
  { id: "light", label: "Light", recommended: "Dusty rose, mint, peach, soft blue" },
  { id: "medium", label: "Medium", recommended: "Warm terracotta, olive, camel, emerald" },
  { id: "tan", label: "Tan", recommended: "Rust, mustard, deep teal, burgundy" },
  { id: "dark", label: "Dark", recommended: "Ivory, cobalt, forest green, vibrant prints" },
];

const wardrobeItems = [
  { id: 1, name: "White Linen Shirt", category: "Tops", color: "#FFFFFF" },
  { id: 2, name: "Beige Wide-Leg Trousers", category: "Bottoms", color: "#E8D9C5" },
  { id: 3, name: "Navy Polo", category: "Tops", color: "#1A1A2E" },
  { id: 4, name: "Khaki Chinos", category: "Bottoms", color: "#C3B091" },
  { id: 5, name: "Camel Blazer", category: "Outerwear", color: "#A0522D" },
  { id: 6, name: "Black Tailored Pants", category: "Bottoms", color: "#1A1A1A" },
];

const tabs = [
  { id: "ai", icon: Sparkles },
  { id: "outfits", icon: Shirt },
  { id: "colour", icon: Palette },
];

const weather = {
  sunny: { icon: Sun, label: "24°", hint: "Light layers" },
  cloudy: { icon: Cloud, label: "18°", hint: "Light jacket" },
  rainy: { icon: Droplet, label: "14°", hint: "Water-resistant" },
};

type TabId = "ai" | "outfits" | "colour";

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  text: string;
}

export function Stylist() {
  const [activeTab, setActiveTab] = useState<TabId>("ai");
  const [recommendations] = useState<OutfitRecommendation[]>(mockRecommendations);
  const [selectedPreferences, setSelectedPreferences] = useState<Set<string>>(new Set(["casual", "minimal"]));
  const [generating, setGenerating] = useState(false);
  const [likedOutfits, setLikedOutfits] = useState<Set<number>>(new Set());
  const [selectedSkinTone, setSelectedSkinTone] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "ai",
      text: "Hi! I'm your AI stylist. Ask me anything about outfits, colours that suit you, or how to style pieces from your wardrobe.",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentWeather = weather.sunny;
  const WeatherIcon = currentWeather.icon;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const handleScroll = () => {
      const panelWidth = el.clientWidth;
      if (panelWidth === 0) return;
      const index = Math.round(el.scrollLeft / panelWidth);
      const newTab = tabs[index]?.id as TabId;
      if (newTab && newTab !== activeTab) {
        setActiveTab(newTab);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    const index = tabs.findIndex((t) => t.id === tabId);
    if (panelRef.current) {
      panelRef.current.scrollTo({ left: index * panelRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const togglePreference = (id: string) => {
    setSelectedPreferences((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generateOutfits = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1500);
  };

  const toggleLike = (id: number) => {
    setLikedOutfits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Based on your style profile and today's weather, I'd suggest light layers — breathable linen with tailored trousers works well.",
        },
      ]);
    }, 1000);
  };

  return (
    <PageShell contentClassName="!p-0">
      <PageHeader title="Stylist" />

      <div className="flex flex-col overflow-hidden">
        <div className="px-4 pt-4">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
              <WeatherIcon className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium">{currentWeather.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{currentWeather.hint}</p>
          </div>
        </div>

        <div className="px-4 pt-3">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex flex-1 items-center justify-center py-3 transition-colors ${
                      activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          ref={panelRef}
          className="flex-1 min-h-0 snap-x snap-mandatory overflow-x-auto hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex">
            <div className="flex w-full shrink-0 snap-start flex-col px-4 pb-4">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-foreground text-background"
                            : "border border-border bg-card text-foreground"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex items-center gap-2 pt-2 shrink-0 border-t border-border">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask your AI stylist..."
                    className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex w-full shrink-0 snap-start flex-col px-4 pb-4">
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {preferences.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => togglePreference(pref.id)}
                      className={`flex min-h-[30px] items-center gap-1 rounded-full border px-2.5 py-1 text-sm transition-colors ${
                        selectedPreferences.has(pref.id)
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <span>{pref.icon}</span>
                      {pref.label}
                      {selectedPreferences.has(pref.id) && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={generateOutfits}
                  disabled={generating}
                  variant="outline"
                  className="w-full rounded-2xl border-border bg-card text-foreground shadow-none"
                >
                  <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                  {generating ? "Generating..." : "Refresh outfits"}
                </Button>
                <div className="space-y-1">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2">
                      <button
                        onClick={() => toggleLike(rec.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedOutfits.has(rec.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{rec.style}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {rec.outfit.top} · {rec.outfit.bottom} · {rec.outfit.shoes}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{rec.confidence}%</div>
                        <div className="flex items-center justify-end gap-0.5">
                          {rec.weather === "sunny" && <Sun className="h-3 w-3 text-muted-foreground" />}
                          {rec.weather === "cloudy" && <Cloud className="h-3 w-3 text-muted-foreground" />}
                          {rec.weather === "rainy" && <Droplet className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full shrink-0 snap-start flex-col px-4 pb-4">
              <div className="flex-1 overflow-y-auto space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Colour analysis</p>
                  <div className="space-y-1.5">
                    {skinTones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedSkinTone(selectedSkinTone === tone.id ? null : tone.id)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors ${
                          selectedSkinTone === tone.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        <span>{tone.label}</span>
                        {selectedSkinTone === tone.id && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                  {selectedSkinTone && (
                    <div className="mt-2 rounded-xl border border-border bg-card p-3">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1">Recommended</div>
                      <div className="text-sm">{skinTones.find((t) => t.id === selectedSkinTone)?.recommended}</div>
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Find by colour</p>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {colorPalettes.map((palette) => (
                      <button
                        key={palette.name}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-sm"
                      >
                        <div className="flex gap-0.5">
                          {palette.colors.slice(0, 2).map((c) => (
                            <div key={c} className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        {palette.name}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {wardrobeItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
                        <div className="h-6 w-6 rounded-md border border-border" style={{ backgroundColor: item.color }} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Your wardrobe</p>
                  <Button
                    variant="outline"
                    className="mb-2 w-full rounded-2xl border-border bg-card text-foreground shadow-none"
                  >
                    <Plus className="h-4 w-4" />
                    Add items
                  </Button>
                  <div className="space-y-1">
                    {wardrobeItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
                        <div className="h-8 w-8 rounded-lg border border-border" style={{ backgroundColor: item.color }} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
