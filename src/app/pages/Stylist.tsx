import { motion } from "motion/react";
import { RefreshCw, Heart, Check, Palette, Droplet, Shirt, Sparkles, Camera, Plus } from "lucide-react";
import { useState } from "react";

interface OutfitRecommendation {
  id: number;
  outfit: {
    top: string;
    bottom: string;
    shoes: string;
  };
  occasion: string;
  style: string;
  confidence: number;
}

const mockRecommendations: OutfitRecommendation[] = [
  {
    id: 1,
    outfit: { top: "White Linen Shirt", bottom: "Beige Wide-Leg Trousers", shoes: "Leather Loafers" },
    occasion: "Casual Office",
    style: "Minimalist Chic",
    confidence: 94,
  },
  {
    id: 2,
    outfit: { top: "Camel Blazer", bottom: "Black Tailored Pants", shoes: "Chelsea Boots" },
    occasion: "Business Meeting",
    style: "Professional",
    confidence: 91,
  },
  {
    id: 3,
    outfit: { top: "Striped Casual Tee", bottom: "Denim Jeans", shoes: "White Sneakers" },
    occasion: "Weekend Brunch",
    style: "Relaxed",
    confidence: 88,
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
  {
    name: "Spring Warm",
    mood: "Soft neutrals with bright citrus accents.",
    colors: ["#FF6B6B", "#FFA06B", "#FFE66D", "#A8E6CF"],
  },
  {
    name: "Summer Cool",
    mood: "Dusty blues and breezy powder tones.",
    colors: ["#7FDBFF", "#B8C5D6", "#F5E6D3", "#C9B8A8"],
  },
  {
    name: "Autumn Earth",
    mood: "Rich clay, espresso, and toasted tan.",
    colors: ["#8B4513", "#A0522D", "#CD853F", "#DEB887"],
  },
  {
    name: "Winter Deep",
    mood: "Ink navy, true black, and one sharp pop.",
    colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
  },
];

type TabId = "recommendations" | "colour" | "discover" | "wardrobe";

const tabs: { id: TabId; label: string; icon?: React.ReactNode }[] = [
  { id: "recommendations", label: "Outfits" },
  { id: "colour", label: "Colour", icon: <Palette className="w-4 h-4" /> },
  { id: "discover", label: "Discover", icon: <Droplet className="w-4 h-4" /> },
  { id: "wardrobe", label: "Wardrobe", icon: <Shirt className="w-4 h-4" /> },
];

export function Stylist() {
  const [activeTab, setActiveTab] = useState<TabId>("recommendations");
  const [recommendations] = useState<OutfitRecommendation[]>(mockRecommendations);
  const [selectedPreferences, setSelectedPreferences] = useState<Set<string>>(new Set(["casual", "minimal"]));
  const [generating, setGenerating] = useState(false);
  const [likedOutfits, setLikedOutfits] = useState<Set<number>>(new Set());

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 border-b border-border/60 bg-background/95 px-4 pt-4 pb-2.5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Stylist</h1>
            <p className="text-xs text-muted-foreground">Quick outfit picks.</p>
          </div>
          <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {recommendations.length} ready
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-2">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[22px] border border-border bg-card p-3.5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Daily edit
              </div>
              <h2 className="max-w-[15rem] text-base font-semibold tracking-tight text-foreground">
                Simple looks, ready fast.
              </h2>
            </div>
            <div className="grid min-w-[82px] gap-1.5 rounded-[18px] bg-muted/60 p-2.5 text-right">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Mode</div>
                <div className="text-sm font-medium text-foreground">Daily</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Focus</div>
                <div className="text-sm font-medium text-foreground">Wearable</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-[18px] bg-muted/60 px-3 py-2.5">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Current mix</div>
              <div className="mt-1 truncate text-sm font-medium text-foreground">
                {Array.from(selectedPreferences).slice(0, 2).join(" + ") || "Curated basics"}
              </div>
            </div>
            <button
              onClick={generateOutfits}
              disabled={generating}
              className="flex min-h-[40px] items-center justify-center rounded-full bg-foreground px-3.5 text-sm font-medium text-background transition-transform active:scale-95 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </motion.section>
      </div>

      <div className="hide-scrollbar overflow-x-auto px-4 pb-1.5">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border bg-background text-muted-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2.5">
        {activeTab === "colour" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-[20px] border border-border bg-card px-4 py-3 shadow-sm">
              <p className="text-sm font-medium">Your best colour direction</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Keep the palette narrow.</p>
            </div>

            <div className="space-y-3">
              {colorPalettes.map((palette) => (
                <div key={palette.name} className="rounded-[20px] border border-border bg-card p-3.5 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{palette.name}</div>
                      <div className="mt-1 text-xs leading-5 text-muted-foreground">{palette.mood}</div>
                    </div>
                    <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Palette
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {palette.colors.map((color) => (
                      <div
                        key={color}
                        className="h-12 flex-1 rounded-2xl border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "discover" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="overflow-hidden rounded-[22px] border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                <Camera className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold">Find your best tones from a photo</h2>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                Use daylight and a clean background.
              </p>
              <button className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition-transform active:scale-[0.99]">
                <Droplet className="h-4 w-4" />
                Upload photo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Undertone", "Warm-neutral"],
                ["Contrast", "Medium-high"],
                ["Metals", "Gold"],
                ["Focus", "Soft tailoring"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[18px] border border-border bg-card p-3 shadow-sm">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                  <div className="mt-2 text-sm font-medium leading-5">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "recommendations" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <section className="rounded-[22px] border border-border bg-card p-3.5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-medium">Style preferences</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    Adjust filters, then refresh.
                  </div>
                </div>
                <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {selectedPreferences.size} selected
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selectedPreferences.has(pref.id)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background"
                    }`}
                  >
                    <span>{pref.icon}</span>
                    {pref.label}
                    {selectedPreferences.has(pref.id) && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={generateOutfits}
                disabled={generating}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                {generating ? "Generating..." : "Refresh outfits"}
              </motion.button>
            </section>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <motion.article
                  key={rec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-[22px] border border-border bg-card p-3.5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {rec.occasion}
                      </div>
                      <div className="text-sm font-medium">{rec.style}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {rec.confidence}% match
                      </span>
                      <button
                        onClick={() => toggleLike(rec.id)}
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-muted transition-transform active:scale-95"
                        aria-label={likedOutfits.has(rec.id) ? "Unlike outfit" : "Like outfit"}
                      >
                        <Heart className={`h-5 w-5 ${likedOutfits.has(rec.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-[18px] bg-muted/50 p-2.5">
                    {[
                      { label: "Top", item: rec.outfit.top, emoji: "👕" },
                      { label: "Bottom", item: rec.outfit.bottom, emoji: "👖" },
                      { label: "Shoes", item: rec.outfit.shoes, emoji: "👞" },
                    ].map(({ label, item, emoji }) => (
                      <div key={label} className="flex items-center gap-2.5 rounded-[16px] bg-background px-3 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-sm">
                          {emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                          <div className="truncate text-sm">{item}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-end text-sm">
                    <button className="font-medium text-foreground">Details</button>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "wardrobe" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-[22px] border border-dashed border-border bg-card p-4.5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                <Shirt className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-base font-semibold">Build your wardrobe archive</h2>
              <p className="mx-auto mt-1.5 max-w-[16rem] text-sm leading-5 text-muted-foreground">
                Add staples once and reuse them in every suggestion.
              </p>
              <button className="mt-3 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-medium text-background transition-transform active:scale-[0.99]">
                <Plus className="h-4 w-4" />
                Add items
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Outerwear", "0 pieces"],
                ["Tops", "0 pieces"],
                ["Bottoms", "0 pieces"],
                ["Shoes", "0 pieces"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[18px] border border-border bg-card p-3 shadow-sm">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
