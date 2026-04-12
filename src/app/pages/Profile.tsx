import { Grid, Bookmark, Heart, Settings, Shirt } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

const wardrobeItems = [
  {
    id: 1,
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMXxmYXNoaW9uJTIwdG9wJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 2,
    category: "Bottoms",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwYm90dG9tc3xlbnwxfHx8fDE3NzU2NjI3ODZ8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 3,
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwc2hvZXN8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 4,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 5,
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwb3V0ZXJ3ZWFyfGVufDF8fHx8MTc3NTY2Mjc4Nnww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 6,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxmYXNoaW9uJTIwZHJlc3N8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
];

const userPosts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 2847,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1651742532544-346cc809adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 1923,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1651744258886-7987b4d3e949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 3204,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1651744258699-d322dff9632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 4156,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1651744258329-9868b90f456c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 2617,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1651828854976-4fa163b636ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 3891,
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 1456,
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 5213,
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 3782,
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 2934,
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMXxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 1678,
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxM3xmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 4456,
  },
];

const tabs = [
  { id: "posts", label: "Posts", icon: Grid },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "wardrobe", label: "Wardrobe", icon: Shirt },
  { id: "liked", label: "Liked", icon: Heart },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef(activeTab);
  const shouldAnimate = !useReducedMotion();

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const tabWidth = el.clientWidth;
      if (tabWidth === 0) return;

      const scrollLeft = el.scrollLeft;
      const newIndex = Math.round(scrollLeft / tabWidth);

      if (newIndex >= 0 && newIndex < tabs.length && tabs[newIndex].id !== activeTabRef.current) {
        setActiveTab(tabs[newIndex].id);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const index = tabs.findIndex((t) => t.id === tabId);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const headerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: shouldAnimate ? { opacity: 0, y: 8 } : false,
    visible: shouldAnimate ? { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } } : false,
  };

  const postVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const postItemVariants = {
    hidden: shouldAnimate ? { opacity: 0, scale: 0.95 } : false,
    visible: shouldAnimate ? { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } } : false,
  };

  return (
    <PageShell>
      <PageHeader
        title="Sarah Connor"
        trailing={
          <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.15, ease: "easeOut" }}>
            <Button variant="ghost" aria-label="Settings" className="h-[18px] w-[18px] rounded-full p-0">
              <Settings className="h-[18px] w-[18px]" />
            </Button>
          </motion.div>
        }
      />

      <div className="app-page-content space-y-4">
        <PageSection className="p-4 sm:p-6">
          <motion.div className="space-y-4" variants={headerVariants} initial="hidden" animate="visible">
            <motion.div className="flex items-start gap-4" variants={itemVariants}>
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-sm ring-1 ring-white/15">
                <span className="text-3xl text-white">S</span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2">
                  <span className="app-chip">Style profile</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fashion enthusiast | Personal stylist | Minimal aesthetic
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Clean looks, sharp tailoring, and a calm feed.</p>
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-3 gap-2" variants={itemVariants}>
              <div className="rounded-2xl border border-border bg-card p-3 text-center">
                <div className="text-lg font-semibold">42</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3 text-center">
                <div className="text-lg font-semibold">12.5k</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3 text-center">
                <div className="text-lg font-semibold">847</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </motion.div>
          </motion.div>
        </PageSection>

        <PageSection className="p-2">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`flex min-h-[56px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition-colors ${
                    activeTab === tab.id
                      ? "bg-accent/40 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="mt-1 text-[11px] font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </PageSection>

        <div
          ref={scrollRef}
          className="overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex">
            <AnimatePresence mode="wait">
              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  className="grid w-full shrink-0 snap-start grid-cols-3 gap-1"
                  variants={postVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {userPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={postItemVariants}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-muted"
                    >
                      <img src={post.image} alt={`Post ${post.id}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-1 text-white backdrop-blur-sm">
                        <Heart className="h-3.5 w-3.5 fill-white" />
                        <span className="text-[11px] font-medium">
                          {post.likes > 999 ? `${Math.floor(post.likes / 1000)}k` : post.likes}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === "saved" && (
                <motion.div
                  key="saved"
                  className="w-full shrink-0 snap-start py-12 text-center"
                  initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } } : false}
                  exit={shouldAnimate ? { opacity: 0, y: -8 } : false}
                >
                  <div className="mx-auto flex w-full max-w-xs flex-col items-center rounded-2xl border border-border bg-card px-4 py-6">
                    <Bookmark className="mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-medium">No saved posts yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">Save looks from the feed to build a private collection.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === "wardrobe" && (
                <motion.div
                  key="wardrobe"
                  className="w-full shrink-0 snap-start px-4"
                  initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } } : false}
                  exit={shouldAnimate ? { opacity: 0, y: -8 } : false}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Your Wardrobe
                    </span>
                    <span className="text-xs text-muted-foreground">24 items</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {wardrobeItems.map((item) => (
                      <motion.div
                        key={item.id}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
                      >
                        <img src={item.image} alt={item.category} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                          <span className="text-xs text-white">{item.category}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="mt-4"
                  >
                    <Link
                      to="/wardrobe"
                      className="block w-full rounded-full border border-border py-2.5 text-center text-sm font-medium transition-colors hover:bg-muted"
                    >
                      View all
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === "liked" && (
                <motion.div
                  key="liked"
                  className="w-full shrink-0 snap-start py-12 text-center"
                  initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } } : false}
                  exit={shouldAnimate ? { opacity: 0, y: -8 } : false}
                >
                  <div className="mx-auto flex w-full max-w-xs flex-col items-center rounded-2xl border border-border bg-card px-4 py-6">
                    <Heart className="mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-medium">No liked posts yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tap the heart on posts you want to come back to later.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
