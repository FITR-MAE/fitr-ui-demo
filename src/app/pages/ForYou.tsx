import { motion } from "motion/react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

const outfits = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "StyleIcon",
    caption: "Effortless neutrals for spring",
    likes: 2847,
    comments: 124,
    tags: ["casual", "neutral", "spring"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1651742532544-346cc809adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "UrbanChic",
    caption: "Layered textures",
    likes: 1923,
    comments: 87,
    tags: ["layers", "urban", "minimal"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1651744258886-7987b4d3e949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "ModernMuse",
    caption: "Classic coat moment",
    likes: 3204,
    comments: 156,
    tags: ["outerwear", "classic", "elegant"],
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1651744258699-d322dff9632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "SunsetStyle",
    caption: "Summer whites",
    likes: 4156,
    comments: 203,
    tags: ["summer", "white", "chic"],
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1651744258329-9868b90f456c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    user: "AvantGarde",
    caption: "Bold silhouettes",
    likes: 2617,
    comments: 91,
    tags: ["avant-garde", "statement", "bold"],
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1651828854976-4fa163b636ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
      const itemHeight = window.innerHeight;
      const index = Math.round(scrollTop / itemHeight);
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="feed-container"
      className="h-screen overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
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
      {outfits.map((outfit, index) => (
        <div
          key={outfit.id}
          className="h-screen w-full snap-start relative flex items-center justify-center bg-black"
        >
          <img
            src={outfit.image}
            alt={outfit.caption}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          <div className="absolute top-4 left-4 right-20 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <span className="text-white text-sm">{outfit.user[0]}</span>
              </div>
              <span className="text-white drop-shadow-lg">{outfit.user}</span>
              <button className="ml-auto px-4 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm">
                Follow
              </button>
            </div>
          </div>

          <div className="absolute right-4 bottom-24 z-10 flex flex-col gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleLike(outfit.id)}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <Heart
                  className={`w-6 h-6 ${
                    liked.has(outfit.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </div>
              <span className="text-white text-xs drop-shadow-lg">
                {(outfit.likes + (liked.has(outfit.id) ? 1 : 0)) > 999
                  ? `${Math.floor((outfit.likes + (liked.has(outfit.id) ? 1 : 0)) / 1000)}k`
                  : outfit.likes + (liked.has(outfit.id) ? 1 : 0)}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs drop-shadow-lg">
                {outfit.comments}
              </span>
            </motion.button>

            <motion.button whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs drop-shadow-lg">Share</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleSave(outfit.id)}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <Bookmark
                  className={`w-6 h-6 ${
                    saved.has(outfit.id)
                      ? "fill-white text-white"
                      : "text-white"
                  }`}
                />
              </div>
              <span className="text-white text-xs drop-shadow-lg">Save</span>
            </motion.button>
          </div>

          <div className="absolute left-4 right-4 bottom-24 z-10 text-white">
            <p className="mb-2 drop-shadow-lg">
              <span className="opacity-90">{outfit.user}</span> {outfit.caption}
            </p>
            <div className="flex gap-2 flex-wrap">
              {outfit.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-sm rounded-full drop-shadow-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
