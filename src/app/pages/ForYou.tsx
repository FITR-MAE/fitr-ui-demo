import { motion, useReducedMotion } from "motion/react";
import { Heart, MessageCircle, Share2, Bookmark, Search, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
      "https://images.unsplash.com/photo-1651744258699-d322dff9632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
  const [likeAnim, setLikeAnim] = useState<Set<number>>(new Set());
  const likeTimerRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const navigate = useNavigate();
  const shouldAnimate = !useReducedMotion();

  const feedPaddingBottom = "calc(6rem + env(safe-area-inset-bottom))";

  const triggerLikeAnim = (id: number) => {
    if (!liked.has(id)) {
      setLikeAnim((prev) => new Set(prev).add(id));
      const existingTimer = likeTimerRef.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      const timer = setTimeout(() => {
        likeTimerRef.current.delete(id);
        setLikeAnim((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 300);
      likeTimerRef.current.set(id, timer);
    }
  };

  useEffect(() => {
    return () => {
      likeTimerRef.current.forEach((timer) => clearTimeout(timer));
      likeTimerRef.current.clear();
    };
  }, []);

  const toggleLike = (id: number) => {
    triggerLikeAnim(id);
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

  const shareOutfit = async (outfit: (typeof outfits)[number]) => {
    const shareText = `${outfit.user}: ${outfit.caption}`;

    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      // Ignore share failures on restricted browsers.
    }
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
        className="pointer-events-none absolute left-0 right-0 z-20 px-4"
        style={{ top: `calc(0.75rem + env(safe-area-inset-top))` }}
      >
        <div className="pointer-events-auto flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-1 backdrop-blur-md">
            {outfits.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === currentIndex ? "h-1.5 w-4 bg-white" : "h-1.5 w-1.5 bg-white/40"
                }`}
              />
            ))}
            <span className="ml-1 text-[11px] leading-none text-white/70">
              {currentIndex + 1}/{outfits.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/search")}
          className="pointer-events-auto absolute right-4 top-0 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/10 p-2.5 backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/5"
          aria-label="Open search"
        >
          <Search className="h-[18px] w-[18px] text-white" />
        </button>
      </div>

      <div
        id="feed-container"
        className="hide-scrollbar h-[100dvh] overflow-y-auto overscroll-y-contain snap-y snap-mandatory touch-pan-y bg-black"
      >
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="relative flex h-[100dvh] w-full snap-start items-center justify-center bg-black"
          >
            <img
              src={outfit.image}
              alt={outfit.caption}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />

            <div
              className="absolute right-4 z-10 flex flex-col items-center gap-3"
              style={{ bottom: feedPaddingBottom }}
            >
              <motion.button
                type="button"
                whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                onClick={() => toggleLike(outfit.id)}
                className="flex flex-col items-center gap-1"
                aria-pressed={liked.has(outfit.id)}
                aria-label={liked.has(outfit.id) ? "Unlike" : "Like"}
              >
                <motion.div
                  animate={
                    shouldAnimate && likeAnim.has(outfit.id)
                      ? { scale: [1, 1.35, 1] }
                      : { scale: liked.has(outfit.id) ? 1 : 1 }
                  }
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      liked.has(outfit.id) ? "fill-red-500 text-red-500" : "text-white"
                    }`}
                  />
                </motion.div>
                <span className="text-xs text-white drop-shadow-lg">
                  {outfit.likes + (liked.has(outfit.id) ? 1 : 0) > 999
                    ? `${Math.floor((outfit.likes + (liked.has(outfit.id) ? 1 : 0)) / 1000)}k`
                    : outfit.likes + (liked.has(outfit.id) ? 1 : 0)}
                </span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                onClick={() => navigate("/post")}
                className="flex flex-col items-center gap-1"
                aria-label="Open post comments"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-white drop-shadow-lg">{outfit.comments}</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                onClick={() => void shareOutfit(outfit)}
                className="flex flex-col items-center gap-1"
                aria-label="Share"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                onClick={() => toggleSave(outfit.id)}
                className="flex flex-col items-center gap-1"
                aria-pressed={saved.has(outfit.id)}
                aria-label={saved.has(outfit.id) ? "Unsave" : "Save"}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <Bookmark
                    className={`h-5 w-5 transition-colors duration-200 ${
                      saved.has(outfit.id) ? "fill-white text-white" : "text-white"
                    }`}
                  />
                </div>
              </motion.button>
            </div>

            <div className="absolute left-4 right-20 z-10 text-white" style={{ bottom: feedPaddingBottom }}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-semibold text-white ring-1 ring-white/20">
                    {outfit.user.charAt(0)}
                  </div>
                  <p className="truncate text-sm font-medium text-white">{outfit.user}</p>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/60" />
                </div>
                <p className="text-sm font-normal leading-[1.5] text-white/90">{outfit.caption}</p>
                <div className="flex flex-wrap gap-1.5">
                  {outfit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-xs tracking-wide text-white/90 backdrop-blur-sm"
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
