import { motion } from "motion/react";
import { Heart, MessageCircle, Share2, Bookmark, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const outfits = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "StyleIcon",
    caption: "Effortless neutrals for spring",
    likes: 2847,
    comments: 124,
    tags: ["casual", "neutral", "spring"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1651742532544-346cc809adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "UrbanChic",
    caption: "Layered textures",
    likes: 1923,
    comments: 87,
    tags: ["layers", "urban", "minimal"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1651744258886-7987b4d3e949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "ModernMuse",
    caption: "Classic coat moment",
    likes: 3204,
    comments: 156,
    tags: ["outerwear", "classic", "elegant"],
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1651744258699-d322dff9632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "SunsetStyle",
    caption: "Summer whites",
    likes: 4156,
    comments: 203,
    tags: ["summer", "white", "chic"],
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1651744258329-9868b90f456c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "AvantGarde",
    caption: "Bold silhouettes",
    likes: 2617,
    comments: 91,
    tags: ["avant-garde", "statement", "bold"],
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1651828854976-4fa163b636ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "ColorTheory",
    caption: "Vibrant energy",
    likes: 3891,
    comments: 178,
    tags: ["color", "vibrant", "bold"],
  },
];

export function ForYou() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const feedPaddingBottom = "calc(6rem + env(safe-area-inset-bottom))";

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    const container = document.getElementById("feed-container");
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight || window.innerHeight;
      const index = Math.min(outfits.length - 1, Math.max(0, Math.round(scrollTop / itemHeight)));
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[100dvh] bg-black">
      <div
        className="pointer-events-none absolute left-4 right-4 z-20"
        style={{ top: "calc(0.75rem + env(safe-area-inset-top))" }}
      >
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-black/10 p-2 backdrop-blur-md"
            aria-label="Open search"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div
        id="feed-container"
        className="hide-scrollbar h-[100dvh] overflow-y-auto overscroll-y-contain snap-y snap-mandatory touch-pan-y bg-black"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="relative flex h-[100dvh] w-full snap-start items-center justify-center bg-black"
          >
            <img src={outfit.image} alt={outfit.caption} className="absolute inset-0 w-full h-full object-cover" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />

            <div className="absolute right-4 z-10 flex flex-col gap-3" style={{ bottom: feedPaddingBottom }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLike(outfit.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <Heart className={`w-5 h-5 ${liked.has(outfit.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                </div>
                <span className="text-white text-xs drop-shadow-lg">
                  {outfit.likes + (liked.has(outfit.id) ? 1 : 0) > 999
                    ? `${Math.floor((outfit.likes + (liked.has(outfit.id) ? 1 : 0)) / 1000)}k`
                    : outfit.likes + (liked.has(outfit.id) ? 1 : 0)}
                </span>
              </motion.button>

              <motion.button whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs drop-shadow-lg">{outfit.comments}</span>
              </motion.button>

              <motion.button whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSave(outfit.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <Bookmark className={`w-5 h-5 ${saved.has(outfit.id) ? "fill-white text-white" : "text-white"}`} />
                </div>
              </motion.button>
            </div>

            <div className="absolute left-4 right-24 z-10 text-white" style={{ bottom: feedPaddingBottom }}>
              <div className="space-y-3 rounded-3xl border border-white/10 bg-black/25 px-4 py-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-medium text-white">
                    {outfit.user.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{outfit.user}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-white/90">{outfit.caption}</p>
                <div className="flex flex-wrap gap-2">
                  {outfit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] tracking-wide text-white drop-shadow-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
