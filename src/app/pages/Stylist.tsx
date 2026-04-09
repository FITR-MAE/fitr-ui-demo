import { motion } from "motion/react";
import { RefreshCw, Heart, Check, Palette, Droplet, Shirt, Sparkles, ArrowUpRight, Camera, Plus } from "lucide-react";
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
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Stylist</h1>
        </div>
      </div>

      <div className="px-4 pb-4">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/80 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                Daily edit
              </div>
              <h2 className="max-w-[14rem] text-[1.75rem] font-semibold leading-tight">
                Looks that work with your mood today.
              </h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-right backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">Matches</div>
              <div className="text-2xl font-semibold">{recommendations.length}</div>
            </div>
          </div>

          <p className="max-w-[18rem] text-sm leading-6 text-white/72">
            Minimal, wearable, and tuned to the preferences you selected. Built for quick decisions on mobile.
          </p>

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/50">Current vibe</div>
              <div className="mt-1 text-sm font-medium text-white/90">
                {Array.from(selectedPreferences).slice(0, 2).join(" + ") || "Curated basics"}
              </div>
            </div>
            <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-stone-900 transition-transform active:scale-95">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </motion.section>
      </div>

      <div className="hide-scrollbar overflow-x-auto px-4 pb-2">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border bg-card text-muted-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {activeTab === "colour" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div>
              <p className="text-sm font-medium">Your best colour direction</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick shades that keep your outfits sharp without overthinking the mix.
              </p>
            </div>

            <div className="space-y-3">
              {colorPalettes.map((palette) => (
                <div key={palette.name} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{palette.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{palette.mood}</div>
                    </div>
                    <div className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Palette</div>
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
            <div className="overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Camera className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold">Find your best tones from a photo</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use daylight and a clean background. We&apos;ll pull undertones, contrast, and palette suggestions built
                for mobile shopping sessions.
              </p>
              <button className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition-transform active:scale-[0.99]">
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
                <div key={label} className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
                  <div className="mt-2 text-sm font-medium">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "recommendations" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <section className="rounded-[28px] border border-border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-medium">Style Preferences</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Refine the recommendations before generating a new set.
                  </div>
                </div>
                <div className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {selectedPreferences.size} selected
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {preferences.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${
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
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                {generating ? "Generating..." : "Generate Outfits"}
              </motion.button>
            </section>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <motion.article
                  key={rec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-[28px] border border-border bg-card p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {rec.occasion}
                      </div>
                      <div className="font-medium text-base">{rec.style}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {rec.confidence}% match
                      </span>
                      <button
                        onClick={() => toggleLike(rec.id)}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-muted transition-transform active:scale-95"
                        aria-label={likedOutfits.has(rec.id) ? "Unlike outfit" : "Like outfit"}
                      >
                        <Heart className={`h-5 w-5 ${likedOutfits.has(rec.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-2xl bg-muted/50 p-3">
                    {[
                      { label: "Top", item: rec.outfit.top, emoji: "👕" },
                      { label: "Bottom", item: rec.outfit.bottom, emoji: "👖" },
                      { label: "Shoes", item: rec.outfit.shoes, emoji: "👞" },
                    ].map(({ label, item, emoji }) => (
                      <div key={label} className="flex items-center gap-3 rounded-2xl bg-background px-3 py-2.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-lg">
                          {emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                          <div className="truncate text-sm">{item}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Save this look for later styling.</span>
                    <button className="font-medium">Details</button>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "wardrobe" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-[28px] border border-dashed border-border bg-card p-5 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Shirt className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold">Build your wardrobe archive</h2>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-muted-foreground">
                Add staple pieces once, then let Stylist work from clothes you already own.
              </p>
              <button className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-medium text-background transition-transform active:scale-[0.99]">
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
                <div key={label} className="rounded-2xl border border-border bg-card p-4">
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
