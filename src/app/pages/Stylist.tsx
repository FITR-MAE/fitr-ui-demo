import {
  Check,
  ChevronDown,
  ChevronRight,
  Cloud,
  Droplet,
  Heart,
  Plus,
  RefreshCw,
  Send,
  Sun,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PageHeader, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

type WeatherKind = "sunny" | "cloudy" | "rainy";
type TabId = "ai" | "outfits" | "colour";

type OutfitRecommendation = {
  id: number;
  outfit: { top: string; bottom: string; shoes: string };
  occasion: string;
  style: string;
  confidence: number;
  weather: WeatherKind;
  note: string;
};

type ChatMessage = {
  id: number;
  role: "user" | "ai";
  text: string;
};

type PaletteCard = {
  name: string;
  note: string;
  colors: string[];
};

const tabs = [
  { id: "ai", label: "Chat" },
  { id: "outfits", label: "Looks" },
  { id: "colour", label: "Colour" },
] as const;

const weather = {
  sunny: { icon: Sun, label: "24°", hint: "Light layers and cleaner silhouettes feel best today." },
  cloudy: { icon: Cloud, label: "18°", hint: "Add one soft outer layer for balance and warmth." },
  rainy: { icon: Droplet, label: "14°", hint: "Lean into practical textures and water-safe shoes." },
} as const;

const quickPrompts = [
  "Build me a coffee run look",
  "What works with white trousers?",
  "Make this feel sharper",
];

const preferences = ["Casual", "Tailored", "Minimal", "Soft colour", "Smart layers", "Clean sneakers"];

const skinTones = [
  { id: "fair", label: "Fair", recommended: "Powder blue, rose, soft taupe, washed lilac." },
  { id: "light", label: "Light", recommended: "Muted peach, sage, sky blue, dusty pink." },
  { id: "medium", label: "Medium", recommended: "Terracotta, olive, camel, emerald." },
  { id: "tan", label: "Tan", recommended: "Rust, ochre, deep teal, burgundy." },
  { id: "dark", label: "Dark", recommended: "Ivory, cobalt, forest green, rich berry." },
] as const;

const colorPalettes: PaletteCard[] = [
  {
    name: "Spring Warm",
    note: "Fresh contrast with lighter warmth and easy daytime energy.",
    colors: ["#FF6B6B", "#FFA06B", "#FFE66D", "#A8E6CF"],
  },
  {
    name: "Summer Cool",
    note: "Soft cool neutrals that keep the look polished without feeling heavy.",
    colors: ["#7FDBFF", "#B8C5D6", "#F5E6D3", "#C9B8A8"],
  },
  {
    name: "Autumn Earth",
    note: "Grounded tones that make layered outfits feel richer and more intentional.",
    colors: ["#8B4513", "#A0522D", "#CD853F", "#DEB887"],
  },
  {
    name: "Winter Deep",
    note: "High contrast colour stories with sharper edges and cleaner impact.",
    colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
  },
];

const wardrobeItems = [
  { id: 1, name: "White Linen Shirt", category: "Tops", color: "#FFFFFF" },
  { id: 2, name: "Beige Wide-Leg Trousers", category: "Bottoms", color: "#E8D9C5" },
  { id: 3, name: "Navy Polo", category: "Tops", color: "#1A1A2E" },
  { id: 4, name: "Khaki Chinos", category: "Bottoms", color: "#C3B091" },
  { id: 5, name: "Camel Blazer", category: "Outerwear", color: "#A0522D" },
  { id: 6, name: "Black Tailored Pants", category: "Bottoms", color: "#1A1A1A" },
];

const interactivePillClass =
  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:scale-95";

const compactListRowClass =
  "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 transition-colors hover:bg-muted/60 active:scale-[0.98]";

const sectionSurfaceClass = "rounded-2xl border border-border bg-card p-4";

const recommendations: OutfitRecommendation[] = [
  {
    id: 1,
    outfit: { top: "White Linen Shirt", bottom: "Beige Wide-Leg Trousers", shoes: "Leather Loafers" },
    occasion: "Casual office",
    style: "Minimalist Chic",
    confidence: 94,
    weather: "sunny",
    note: "Keeps the palette light while still feeling sharp enough for meetings.",
  },
  {
    id: 2,
    outfit: { top: "Camel Blazer", bottom: "Black Tailored Pants", shoes: "Chelsea Boots" },
    occasion: "Business meeting",
    style: "Professional",
    confidence: 91,
    weather: "cloudy",
    note: "The blazer adds structure without making the look feel too formal or heavy.",
  },
  {
    id: 3,
    outfit: { top: "Navy Polo", bottom: "Khaki Chinos", shoes: "White Sneakers" },
    occasion: "Outdoor lunch",
    style: "Smart Casual",
    confidence: 86,
    weather: "rainy",
    note: "Balanced proportions and practical shoes make this easy to wear all day.",
  },
];

function weatherIcon(kind: WeatherKind) {
  if (kind === "sunny") return <Sun className="h-3 w-3 text-muted-foreground" />;
  if (kind === "cloudy") return <Cloud className="h-3 w-3 text-muted-foreground" />;
  return <Droplet className="h-3 w-3 text-muted-foreground" />;
}

export function Stylist() {
  const [activeTab, setActiveTab] = useState<TabId>("ai");
  const [selectedPreferences, setSelectedPreferences] = useState<Set<string>>(
    new Set(["Casual", "Minimal", "Clean sneakers"]),
  );
  const [likedOutfits, setLikedOutfits] = useState<Set<number>>(new Set());
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>("medium");
  const [selectedPalette, setSelectedPalette] = useState<string>("Autumn Earth");
  const [generating, setGenerating] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "ai",
      text: "I rebuilt your stylist to feel faster and more focused on mobile. Ask for a look, a color edit, or help styling something you already own.",
    },
  ]);
  const [isChatScrolledUp, setIsChatScrolledUp] = useState(false);
  const shouldAnimate = !useReducedMotion();

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const generateTimeoutRef = useRef<number | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

  const currentWeather = weather.sunny;
  const WeatherIcon = currentWeather.icon;
  const activePalette = colorPalettes.find((palette) => palette.name === selectedPalette) ?? colorPalettes[0];
  const tabPanelMotionProps = shouldAnimate
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      }
    : {};

  useEffect(() => {
    return () => {
      if (generateTimeoutRef.current !== null) window.clearTimeout(generateTimeoutRef.current);
      if (replyTimeoutRef.current !== null) window.clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isChatScrolledUp) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatScrolledUp]);

  const handleChatScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setIsChatScrolledUp(!nearBottom);
  };

  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsChatScrolledUp(false);
  };

  const togglePreference = (label: string) => {
    setSelectedPreferences((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const toggleLike = (id: number) => {
    setLikedOutfits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generateOutfits = () => {
    if (generateTimeoutRef.current !== null) window.clearTimeout(generateTimeoutRef.current);
    setGenerating(true);
    generateTimeoutRef.current = window.setTimeout(() => setGenerating(false), 1200);
  };

  const handleSendMessage = (prompt?: string) => {
    const nextMessage = (prompt ?? chatInput).trim();
    if (!nextMessage) return;

    setChatMessages((prev) => [...prev, { id: Date.now(), role: "user", text: nextMessage }]);
    setChatInput("");

    if (replyTimeoutRef.current !== null) window.clearTimeout(replyTimeoutRef.current);
    replyTimeoutRef.current = window.setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text:
            "For today, keep the base clean and the palette warm. Start with your linen shirt or navy polo, anchor it with tailored bottoms, and finish with one sharper layer if you need more structure.",
        },
      ]);
    }, 900);
  };

  return (
    <PageShell>
      <PageHeader title="Stylist" />

      <motion.div
        layout={shouldAnimate}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="app-page-content space-y-4"
      >
        <div className={sectionSurfaceClass}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground">Today&apos;s brief</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentWeather.hint} Built for quick, direct outfit decisions.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-muted px-3 py-2">
              <WeatherIcon className="h-4 w-4 text-foreground" />
              <span className="text-xl font-semibold">{currentWeather.label}</span>
            </div>
          </div>
        </div>

        <motion.div layout={shouldAnimate} transition={{ duration: 0.24, ease: "easeOut" }} className="flex justify-center">
          <div className="inline-flex flex-wrap justify-center rounded-full border border-border bg-card p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "ai" && (
            <motion.div
              key="ai"
              layout={shouldAnimate}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
              {...tabPanelMotionProps}
            >
              <div className={sectionSurfaceClass}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Stylist chat</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Ask for a look, a sharper version, or help styling something you own.</p>
                  </div>
                  {isChatScrolledUp && (
                    <button
                      type="button"
                      onClick={scrollChatToBottom}
                      className={`${interactivePillClass} border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <ChevronDown className="h-3 w-3" />
                        New reply
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className={`${interactivePillClass} shrink-0 border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <div
                  ref={chatScrollRef}
                  onScroll={handleChatScroll}
                  className="mt-4 max-h-[24rem] space-y-2 overflow-y-auto overscroll-contain pr-1"
                >
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-foreground text-background"
                            : "border border-border bg-card text-foreground"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
                    placeholder="Ask your stylist..."
                    className="h-12 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    aria-label="Send message"
                    onClick={() => handleSendMessage()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "outfits" && (
            <motion.div
              key="outfits"
              layout={shouldAnimate}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
              {...tabPanelMotionProps}
            >
              <div className={sectionSurfaceClass}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Style preferences</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Keep the brief focused so the look suggestions stay cleaner.
                    </p>
                  </div>
                  <Button
                    onClick={generateOutfits}
                    disabled={generating}
                    size="sm"
                    variant="outline"
                    className="rounded-full border-border bg-card text-foreground"
                  >
                    <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                    {generating ? "Refreshing" : "Refresh"}
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {preferences.map((label) => {
                    const selected = selectedPreferences.has(label);

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => togglePreference(label)}
                        className={`${interactivePillClass} ${
                          selected
                            ? "border-zinc-800 bg-zinc-800 text-white"
                            : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {label}
                          {selected && <Check className="h-3 w-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>

              <div className={sectionSurfaceClass}>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Recommended looks</h2>
                  <p className="mt-1 text-sm text-muted-foreground">A direct edit based on the current brief and selected preferences.</p>
                </div>

                <div className="mt-4 space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="rounded-2xl border border-border bg-card px-3.5 py-3 transition-colors hover:bg-muted/60 active:scale-[0.98]">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          aria-label={likedOutfits.has(rec.id) ? `Unlike ${rec.style}` : `Like ${rec.style}`}
                          onClick={() => toggleLike(rec.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card transition-transform active:scale-95"
                        >
                          <Heart
                            className={`h-4 w-4 ${likedOutfits.has(rec.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                          />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">{rec.style}</p>
                              <p className="text-xs text-muted-foreground">{rec.occasion}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{rec.confidence}%</div>
                              <div className="mt-1 flex items-center justify-end gap-1">{weatherIcon(rec.weather)}</div>
                            </div>
                          </div>

                          <p className="mt-2 text-sm text-foreground">
                            {rec.outfit.top} with {rec.outfit.bottom} and {rec.outfit.shoes}
                          </p>
                          <p className="mt-1.5 text-xs text-muted-foreground">{rec.note}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "colour" && (
            <motion.div
              key="colour"
              layout={shouldAnimate}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
              {...tabPanelMotionProps}
            >
              <div className={sectionSurfaceClass}>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Colour direction</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Pick a tone and palette, then use the wardrobe matches below.</p>
                </div>

                <div className="mt-4 space-y-2">
                  {skinTones.map((tone) => {
                    const selected = selectedSkinTone === tone.id;

                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setSelectedSkinTone(tone.id)}
                        className={`flex min-h-[52px] w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-sm transition-colors active:scale-[0.98] ${
                          selected
                            ? "border-zinc-800 bg-zinc-800 text-white"
                            : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        <span className="font-medium">{tone.label}</span>
                        {selected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 rounded-2xl border border-border bg-muted px-3.5 py-3">
                  <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Recommended</div>
                  <div className="text-sm text-foreground">
                    {skinTones.find((tone) => tone.id === selectedSkinTone)?.recommended}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {colorPalettes.map((palette) => {
                    const selected = selectedPalette === palette.name;

                    return (
                      <button
                        key={palette.name}
                        type="button"
                        onClick={() => setSelectedPalette(palette.name)}
                        className={`${interactivePillClass} ${
                          selected
                            ? "border-zinc-800 bg-zinc-800 text-white"
                            : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span className="flex gap-0.5">
                            {palette.colors.slice(0, 2).map((color) => (
                              <span
                                key={color}
                                className="h-3 w-3 rounded-full border border-white/30"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </span>
                          {palette.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex gap-2">
                  {activePalette.colors.map((color) => (
                    <div key={color} className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: color }} />
                  ))}
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{activePalette.note}</p>
              </div>

              <div className={sectionSurfaceClass}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Wardrobe matches</h2>
                    <p className="mt-1 text-sm text-muted-foreground">The current colour direction first, then the full wardrobe below.</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full border-border bg-card text-foreground">
                    <Plus className="h-4 w-4" />
                    Add items
                  </Button>
                </div>

                <div className="mt-4 space-y-2.5">
                  {wardrobeItems.map((item) => (
                    <div key={item.id} className={compactListRowClass}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted">
                        <div className="h-5 w-5 rounded-md border border-border" style={{ backgroundColor: item.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <div className="mb-3 text-xs font-medium text-muted-foreground">All wardrobe items</div>
                  <div className="space-y-2.5">
                    {wardrobeItems.map((item) => (
                      <div key={item.id} className={compactListRowClass}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted">
                          <div className="h-6 w-6 rounded-lg border border-border" style={{ backgroundColor: item.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageShell>
  );
}
