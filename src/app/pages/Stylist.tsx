import { motion } from "motion/react";
import { RefreshCw, Heart, Check, Palette, Droplet, Shirt, Sparkles, Camera, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";

import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

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

const tabs: { id: TabId; label: string; icon?: ReactNode }[] = [
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
    <PageShell>
      <PageHeader title="Stylist" />

      <div className="app-page-content space-y-3">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="app-surface overflow-hidden p-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="app-chip mb-1.5 inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Daily edit
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between rounded-[16px] bg-muted/60 px-3 py-2">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Current mix</div>
              <div className="mt-1 truncate text-sm font-medium text-foreground">
                {Array.from(selectedPreferences).slice(0, 2).join(" + ") || "Curated basics"}
              </div>
            </div>
            <Button onClick={generateOutfits} disabled={generating} className="h-10 rounded-full px-3.5">
              Refresh
            </Button>
          </div>
        </motion.section>

        <div className="hide-scrollbar overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
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

        {activeTab === "colour" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
            <PageSection className="px-3.5 py-2.5">
              <p className="text-sm font-medium">Your best colour direction</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Keep the palette narrow.</p>
            </PageSection>

            <div className="space-y-2.5">
              {colorPalettes.map((palette) => (
                <PageSection key={palette.name} className="p-3">
                  <div className="mb-2.5 flex items-start justify-between gap-4">
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
                </PageSection>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "discover" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <PageSection className="overflow-hidden p-3.5">
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Camera className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold">Find your best tones from a photo</h2>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">Use daylight and a clean background.</p>
              <Button className="mt-2.5 h-10 w-full rounded-2xl">
                <Droplet className="h-4 w-4" />
                Upload photo
              </Button>
            </PageSection>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                ["Undertone", "Warm-neutral"],
                ["Contrast", "Medium-high"],
                ["Metals", "Gold"],
                ["Focus", "Soft tailoring"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[16px] border border-border bg-card p-2.5 shadow-sm">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                  <div className="mt-1.5 text-sm font-medium leading-5">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "recommendations" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <PageSection className="p-3">
              <div className="mb-2.5 flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-medium">Style preferences</div>
                </div>
                <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {selectedPreferences.size} selected
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
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
                className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                {generating ? "Generating..." : "Refresh outfits"}
              </motion.button>
            </PageSection>

            <div className="space-y-2.5">
              {recommendations.map((rec) => (
                <motion.article
                  key={rec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="app-surface overflow-hidden p-3"
                >
                  <div className="mb-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-1.5 inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
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

                  <div className="space-y-2 rounded-[16px] bg-muted/50 p-2">
                    {[
                      { label: "Top", item: rec.outfit.top, emoji: "👕" },
                      { label: "Bottom", item: rec.outfit.bottom, emoji: "👖" },
                      { label: "Shoes", item: rec.outfit.shoes, emoji: "👞" },
                    ].map(({ label, item, emoji }) => (
                      <div key={label} className="flex items-center gap-2 rounded-[14px] bg-background px-2.5 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm">
                          {emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                          <div className="truncate text-sm">{item}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-end text-sm">
                    <button className="font-medium text-foreground">Details</button>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "wardrobe" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <PageSection className="border-dashed p-4 text-center">
              <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Shirt className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-base font-semibold">Build your wardrobe</h2>
              <Button className="mt-2.5 h-10 rounded-2xl px-5">
                <Plus className="h-4 w-4" />
                Add items
              </Button>
            </PageSection>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                ["Outerwear", "0 pieces"],
                ["Tops", "0 pieces"],
                ["Bottoms", "0 pieces"],
                ["Shoes", "0 pieces"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[16px] border border-border bg-card p-2.5 shadow-sm">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
