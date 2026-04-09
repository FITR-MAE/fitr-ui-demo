import { motion } from "motion/react";
import { RefreshCw, Heart, Check, Palette, Droplet, Shirt, Camera, Plus } from "lucide-react";
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

      <div className="app-page-content space-y-2">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="app-surface p-2"
        >
          <div className="flex items-center justify-between gap-2 rounded-[12px] bg-muted/60 px-2.5 py-1.5">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Current mix</div>
              <div className="truncate text-sm font-medium text-foreground">
                {Array.from(selectedPreferences).slice(0, 2).join(" + ") || "Curated basics"}
              </div>
            </div>
            <Button
              onClick={generateOutfits}
              disabled={generating}
              variant="outline"
              className="h-8 rounded-full border-border bg-card px-2.5 text-foreground shadow-none"
            >
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
                className={`flex min-h-[32px] items-center gap-1 rounded-full px-2.5 py-1 text-sm whitespace-nowrap transition-colors ${
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
            <PageSection className="px-2.5 py-2">
              <p className="text-sm font-medium">Colour direction</p>
            </PageSection>

            <div className="space-y-1.5">
              {colorPalettes.map((palette) => (
                <PageSection key={palette.name} className="p-2">
                  <div className="mb-1.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{palette.name}</div>
                      <div className="mt-0.5 text-xs leading-4 text-muted-foreground">{palette.mood}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {palette.colors.map((color) => (
                      <div
                        key={color}
                        className="h-10 flex-1 rounded-xl border border-border"
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <PageSection className="overflow-hidden p-2.5">
              <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Camera className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-medium">Find tones from a photo</h2>
              <Button variant="outline" className="mt-1.5 h-8 w-full rounded-xl border-border bg-card text-foreground shadow-none">
                <Droplet className="h-4 w-4" />
                Upload photo
              </Button>
            </PageSection>

            <div className="grid grid-cols-2 gap-2">
              {[
                ["Undertone", "Warm-neutral"],
                ["Contrast", "Medium-high"],
                ["Metals", "Gold"],
                ["Focus", "Soft tailoring"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[14px] border border-border bg-card p-2 shadow-sm">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                  <div className="mt-1 text-sm font-medium leading-5">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "recommendations" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <PageSection className="p-2">
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">Style filters</div>
                </div>
                <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {selectedPreferences.size} selected
                </div>
              </div>

              <div className="mb-2 flex flex-wrap gap-1">
                {preferences.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`flex min-h-[30px] items-center gap-1 rounded-full border px-2 py-1 text-sm transition-colors ${
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

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={generateOutfits}
                  disabled={generating}
                  variant="outline"
                  className="h-8 w-full rounded-xl border-border bg-card text-foreground shadow-none"
                >
                  <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                  {generating ? "Generating..." : "Refresh"}
                </Button>
              </motion.div>
            </PageSection>

            <div className="space-y-1.5">
              {recommendations.map((rec) => (
                <motion.article
                  key={rec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="app-surface overflow-hidden p-2"
                >
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="mb-1 inline-flex rounded-full bg-muted px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {rec.occasion}
                      </div>
                      <div className="text-sm font-medium">{rec.style}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-muted px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {rec.confidence}% match
                      </span>
                      <button
                        onClick={() => toggleLike(rec.id)}
                        className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full border border-border bg-card text-foreground transition active:scale-95"
                        aria-label={likedOutfits.has(rec.id) ? "Unlike outfit" : "Like outfit"}
                      >
                        <Heart className={`h-4 w-4 ${likedOutfits.has(rec.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 rounded-[12px] bg-muted/50 p-1.5">
                    {[
                      { label: "Top", item: rec.outfit.top, emoji: "👕" },
                      { label: "Bottom", item: rec.outfit.bottom, emoji: "👖" },
                      { label: "Shoes", item: rec.outfit.shoes, emoji: "👞" },
                    ].map(({ label, item, emoji }) => (
                      <div key={label} className="flex items-center gap-2 rounded-[10px] bg-background px-2 py-1.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs">
                          {emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
                          <div className="truncate text-sm">{item}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-1 flex items-center justify-end text-sm">
                    <Button variant="ghost" className="h-7 rounded-full px-2.5 text-foreground">
                      Details
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "wardrobe" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <PageSection className="border-dashed p-2.5 text-center">
              <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Shirt className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-sm font-medium">Build your wardrobe</h2>
              <Button variant="outline" className="mt-1.5 h-8 rounded-xl border-border bg-card px-3 text-foreground shadow-none">
                <Plus className="h-4 w-4" />
                Add items
              </Button>
            </PageSection>

            <div className="grid grid-cols-2 gap-2">
              {[
                ["Outerwear", "0 pieces"],
                ["Tops", "0 pieces"],
                ["Bottoms", "0 pieces"],
                ["Shoes", "0 pieces"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[14px] border border-border bg-card p-2 shadow-sm">
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
