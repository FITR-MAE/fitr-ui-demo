import { motion } from "motion/react";
import { Heart, MessageCircle, Share2, Bookmark, Search, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { CommentsPanel, mockComments } from "../components/CommentsPanel";
import { SharePanel } from "../components/SharePanel";
import { PillTabs } from "../components/PillTabs";
import { useShouldAnimate, usePressFeedback } from "../components/motion";
import { formatCount } from "../lib/format";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cn } from "../components/ui/utils";

const outfits = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1528120369764-0423708119ae",
    user: "NinaCastellano",
    caption: "Found this coat at the back of my closet and now I look like a whole movie character",
    likes: 2847,
    comments: 124,
    shares: 62,
    saves: 418,
    tags: ["oversized", "blazer", "boss"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1774413768903-057eb084133b",
    user: "DevonBrooks",
    caption: "This jacket said 'let's go to the store for snacks' and I said bet",
    likes: 1923,
    comments: 87,
    shares: 41,
    saves: 275,
    tags: ["streetwear", "bomber", "casual"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1659899505079-dbc449c4f9d1",
    user: "KeishaMorgan",
    caption: "The sea breeze did my hair and honestly I'm not complaining",
    likes: 3204,
    comments: 156,
    shares: 88,
    saves: 534,
    tags: ["coastal", "chic", "effortless"],
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1708024587407-73445142b5a8",
    user: "ArjunMehta",
    caption: "The turtleneck was on sale and so was my productivity for the week",
    likes: 4156,
    comments: 203,
    shares: 104,
    saves: 612,
    tags: ["turtleneck", "smart", "minimal"],
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1658431410012-69515380f5d4",
    user: "ChloeLaurent",
    caption: "Got dressed and felt so powerful the streetlights literally bounced off me",
    likes: 2617,
    comments: 91,
    shares: 57,
    saves: 369,
    tags: ["iridescent", "showstopper", "bold"],
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1771828539833-d5325e819197",
    user: "PriyaSharma",
    caption: "Every time I wear this my dad says I look like a queen and honestly he's right",
    likes: 3891,
    comments: 178,
    shares: 96,
    saves: 581,
    tags: ["ethnic", "silk", "heritage"],
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1771919336237-4b11b12e0793",
    user: "MarcusCole",
    caption: "Main character energy loaded and the graphics on this fit are unmatched",
    likes: 2100,
    comments: 95,
    shares: 48,
    saves: 310,
    tags: ["streetwear", "graphic", "fits"],
  },
];

const friendsOnlyOutfits = outfits.slice(0, 4);
const followingOutfits = outfits.slice(3, 8);

const feedModes = [
  { id: "for-you", label: "Your Lineup" },
  { id: "friends", label: "Your Circle" },
  { id: "following", label: "Following" },
] as const;

export function ForYou() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likeAnim, setLikeAnim] = useState<Set<number>>(new Set());
  const [feedMode, setFeedMode] = useState<(typeof feedModes)[number]["id"]>("for-you");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeOutfit, setActiveOutfit] = useState<(typeof outfits)[number] | null>(null);
  const likeTimerRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const shouldAnimate = useShouldAnimate();
  const feedActionTap = usePressFeedback(0.98);
  const visibleOutfits =
    feedMode === "friends" ? friendsOnlyOutfits : feedMode === "following" ? followingOutfits : outfits;

  const feedPaddingBottom = "max(1.25rem, env(safe-area-inset-bottom))";

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

  const shareOutfit = (outfit: (typeof outfits)[number]) => {
    setActiveOutfit(outfit);
    setShareOpen(true);
  };

  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight || window.innerHeight;
      const index = Math.min(visibleOutfits.length - 1, Math.max(0, Math.round(scrollTop / itemHeight)));
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [visibleOutfits.length]);

  useEffect(() => {
    setCurrentIndex(0);
    feedContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [feedMode]);

  return (
    <div className="relative h-full bg-black">
        <div className="pointer-events-none absolute left-0 right-0 z-20 px-4" style={{ top: "0.75rem" }}>
          <div className="pointer-events-auto flex flex-col items-center gap-2">
            <PillTabs
              tabs={feedModes}
              activeTab={feedMode}
              onTabChange={setFeedMode}
              variant="overlay"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/search")}
          className="pointer-events-auto absolute right-4 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/10 p-2.5 backdrop-blur-md transition-colors hover:bg-white/20 active:bg-white/5"
          style={{ top: "0.75rem" }}
          aria-label="Open search"
        >
          <Search className="h-[18px] w-[18px] text-white" />
        </button>

      <div
        id="feed-container"
        ref={feedContainerRef}
        className="hide-scrollbar h-full overflow-y-auto overscroll-y-contain snap-y snap-mandatory touch-pan-y bg-black"
      >
        {visibleOutfits.map((outfit) => (
          <div
            key={outfit.id}
            className="relative flex h-full min-h-full w-full snap-start items-center justify-center bg-black"
          >
            <ImageWithFallback
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
                {...feedActionTap}
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
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      liked.has(outfit.id) ? "fill-red-500 text-red-500" : "text-white",
                    )}
                  />
                </motion.div>
                <span className="text-xs text-white drop-shadow-lg">
                  {formatCount(outfit.likes + (liked.has(outfit.id) ? 1 : 0))}
                </span>
              </motion.button>

              <motion.button
                type="button"
                {...feedActionTap}
                onClick={() => {
                  setActiveOutfit(outfit);
                  setCommentsOpen(true);
                }}
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
                {...feedActionTap}
                onClick={() => void shareOutfit(outfit)}
                className="flex flex-col items-center gap-1"
                aria-label="Share"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-white drop-shadow-lg">{formatCount(outfit.shares)}</span>
              </motion.button>

              <motion.button
                type="button"
                {...feedActionTap}
                onClick={() => toggleSave(outfit.id)}
                className="flex flex-col items-center gap-1"
                aria-pressed={saved.has(outfit.id)}
                aria-label={saved.has(outfit.id) ? "Unsave" : "Save"}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                  <Bookmark
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      saved.has(outfit.id) ? "fill-white text-white" : "text-white",
                    )}
                  />
                </div>
                <span className="text-xs text-white drop-shadow-lg">
                  {formatCount(outfit.saves + (saved.has(outfit.id) ? 1 : 0))}
                </span>
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
                <p className="text-sm font-normal leading-[1.5] text-white/90">
                  {outfit.caption}
                </p>
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

      {activeOutfit && (
        <>
          <CommentsPanel
            open={commentsOpen}
            onOpenChange={setCommentsOpen}
            postUser={activeOutfit.user}
            postImage={activeOutfit.image}
            initialComments={mockComments()}
          />
          <SharePanel
            open={shareOpen}
            onOpenChange={setShareOpen}
            postUser={activeOutfit.user}
            postImage={activeOutfit.image}
            caption={activeOutfit.caption}
          />
        </>
      )}
    </div>
  );
}
