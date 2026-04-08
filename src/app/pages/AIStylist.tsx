import { motion } from "motion/react";
import { Sparkles, RefreshCw, Heart, Check } from "lucide-react";
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
    outfit: {
      top: "White Linen Shirt",
      bottom: "Beige Wide-Leg Trousers",
      shoes: "Leather Loafers",
    },
    occasion: "Casual Office",
    style: "Minimalist Chic",
    confidence: 94,
  },
  {
    id: 2,
    outfit: {
      top: "Camel Blazer",
      bottom: "Black Tailored Pants",
      shoes: "Chelsea Boots",
    },
    occasion: "Business Meeting",
    style: "Professional",
    confidence: 91,
  },
  {
    id: 3,
    outfit: {
      top: "Striped Casual Tee",
      bottom: "Denim Jeans",
      shoes: "White Sneakers",
    },
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

export function AIStylist() {
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>(mockRecommendations);
  const [selectedPreferences, setSelectedPreferences] = useState<Set<string>>(
    new Set(["casual", "minimal"])
  );
  const [generating, setGenerating] = useState(false);
  const [likedOutfits, setLikedOutfits] = useState<Set<number>>(new Set());

  const togglePreference = (id: string) => {
    setSelectedPreferences((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const generateOutfits = () => {
    setGenerating(true);
    setTimeout(() => {
      setRecommendations([...mockRecommendations].sort(() => Math.random() - 0.5));
      setGenerating(false);
    }, 1500);
  };

  const toggleLike = (id: number) => {
    setLikedOutfits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8" />
          <h1>AI Stylist</h1>
        </div>
        <p className="text-muted-foreground">
          Get personalized outfit recommendations based on your wardrobe and style preferences
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 p-6 bg-card rounded-2xl border border-border"
      >
        <h2 className="mb-4">Style Preferences</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {preferences.map((pref) => (
            <motion.button
              key={pref.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePreference(pref.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedPreferences.has(pref.id)
                  ? "border-foreground bg-foreground/5"
                  : "border-border bg-background hover:border-foreground/30"
              }`}
            >
              <div className="text-2xl mb-1">{pref.icon}</div>
              <div className="text-xs">{pref.label}</div>
              {selectedPreferences.has(pref.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={generateOutfits}
          disabled={generating}
          className="w-full py-4 bg-foreground text-background rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Generating Outfits..." : "Generate New Outfits"}
        </motion.button>
      </motion.section>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.article
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-6 bg-card rounded-2xl border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">{rec.style}</h3>
                <p className="text-sm text-muted-foreground">{rec.occasion}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className="text-lg">{rec.confidence}%</div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(rec.id)}
                  className="p-2"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      likedOutfits.has(rec.id)
                        ? "fill-red-500 text-red-500"
                        : "text-foreground"
                    }`}
                  />
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                  👕
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Top</div>
                  <div>{rec.outfit.top}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                  👖
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Bottom</div>
                  <div>{rec.outfit.bottom}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                  👞
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Shoes</div>
                  <div>{rec.outfit.shoes}</div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 bg-muted rounded-lg hover:bg-accent transition-colors"
            >
              View Full Outfit
            </motion.button>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
