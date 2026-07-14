import { Grid, Bookmark, Heart, Settings, Shirt, Building2, BarChart3, Store, MapPin, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../components/ui/chart";
import { useAccounts } from "../components/AccountProvider";
import {
  useFadeUpVariants,
  useScaleInVariants,
  usePanelMotion,
  staggerVariants,
  usePressFeedback,
} from "../components/motion";
import { formatCount } from "../lib/format";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const wardrobeItems = [
  {
    id: 1,
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68",
  },
  {
    id: 2,
    category: "Bottoms",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
  },
  {
    id: 3,
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: 4,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a",
  },
  {
    id: 5,
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
  },
  {
    id: 6,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
  },
];

const userPosts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1651742532474-ea4401a34a10",
    likes: 2847,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1651742532544-346cc809adb3",
    likes: 1923,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1651744258886-7987b4d3e949",
    likes: 3204,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1651744258699-d322dff9632c",
    likes: 4156,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1651744258329-9868b90f456c",
    likes: 2617,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1651828854976-4fa163b636ff",
    likes: 3891,
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1617922001439-4a2e6562f328",
    likes: 1456,
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    likes: 5213,
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    likes: 3782,
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    likes: 2934,
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2",
    likes: 1678,
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    likes: 4456,
  },
];

const tabs = [
  { id: "posts", label: "Posts", icon: Grid },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "wardrobe", label: "Wardrobe", icon: Shirt },
  { id: "liked", label: "Liked", icon: Heart },
] as const;

type TabId = (typeof tabs)[number]["id"];

const profileStats = [
  { label: "Posts", value: "42" },
  { label: "Followers", value: "12.5k" },
  { label: "Following", value: "847" },
];

const businessStats = [
  { label: "Profile views", value: "48.2k", delta: "+12%" },
  { label: "Reach", value: "312k", delta: "+8%" },
  { label: "Engagement", value: "6.4%", delta: "+0.4%" },
];

const reachData = [
  { month: "Jan", reach: 18200, views: 2100 },
  { month: "Feb", reach: 22100, views: 2600 },
  { month: "Mar", reach: 27400, views: 3100 },
  { month: "Apr", reach: 31900, views: 3700 },
  { month: "May", reach: 38600, views: 4400 },
  { month: "Jun", reach: 45100, views: 5100 },
  { month: "Jul", reach: 52800, views: 5900 },
];

const reachChartConfig: ChartConfig = {
  reach: { label: "Reach", color: "var(--primary)" },
  views: { label: "Profile views", color: "var(--muted-foreground)" },
};

type StoreStatus = "Open" | "Coming soon" | "Paused";

const stores: { id: string; name: string; city: string; status: StoreStatus; cover: string }[] = [
  {
    id: "paris",
    name: "Maison Margiela — Flagship",
    city: "Paris, FR",
    status: "Open",
    cover: "https://images.unsplash.com/photo-1567401893414-76b7b1e33a76",
  },
  {
    id: "milan",
    name: "Maison Margiela — Boutique",
    city: "Milan, IT",
    status: "Open",
    cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  },
  {
    id: "tokyo",
    name: "Maison Margiela — Pop-in",
    city: "Tokyo, JP",
    status: "Coming soon",
    cover: "https://images.unsplash.com/photo-1483985988355-763728e1930b",
  },
];

export function Profile() {
  const { activeAccount } = useAccounts();
  const isBusiness = activeAccount.type === "business";
  const [activeTab, setActiveTab] = useState<TabId>("posts");

  const fadeUpVariants = useFadeUpVariants();
  const scaleInVariants = useScaleInVariants();
  const panelMotion = usePanelMotion();
  const settingsTap = usePressFeedback(0.9);
  const tabTap = usePressFeedback(0.96);
  const postTap = usePressFeedback(0.97);
  const wardrobeTap = usePressFeedback(0.95);

  return (
    <PageShell>
      <PageHeader
        title={activeAccount.name}
        trailing={
          <motion.div {...settingsTap}>
            <Button variant="ghost" aria-label="Settings" className="h-[18px] w-[18px] rounded-full p-0">
              <Settings className="h-[18px] w-[18px]" />
            </Button>
          </motion.div>
        }
      />

      <div className="app-page-content space-y-4">
        <PageSection className="p-5">
          <motion.div className="space-y-4" variants={staggerVariants} initial="hidden" animate="visible">
            <motion.div className="flex items-start gap-4" variants={fadeUpVariants}>
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                <ImageWithFallback src={activeAccount.avatar} alt={activeAccount.name} className="h-full w-full object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="app-chip inline-flex items-center gap-1">
                    {isBusiness ? <Building2 className="h-3 w-3" /> : <Shirt className="h-3 w-3" />}
                    {isBusiness ? "Business profile" : "Personal"}
                  </span>
                </div>
                <p className="text-base font-semibold">{activeAccount.name}</p>
                <p className="text-sm text-muted-foreground">{activeAccount.handle}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activeAccount.bio ?? "Clean looks, sharp tailoring, and a calm feed."}
                </p>
              </div>
            </motion.div>

            <motion.div className="grid grid-cols-3 gap-2" variants={fadeUpVariants}>
              {(isBusiness ? businessStats : profileStats).map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-3 text-center">
                  <div className="text-lg font-semibold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  {"delta" in stat && (
                    <div className="mt-0.5 text-[10px] font-medium text-foreground/70">{stat.delta}</div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </PageSection>

        {isBusiness ? (
          <BusinessView />
        ) : (
          <>
            <PageSection className="p-3">
              <div className="grid grid-cols-4 gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      {...tabTap}
                      className={cn(
                        "flex min-h-[56px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition-colors",
                        isActive ? "bg-accent/40 text-foreground" : "text-muted-foreground hover:bg-muted/60",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="mt-1 text-[11px] font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </PageSection>

            <AnimatePresence mode="wait">
              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  className="grid grid-cols-3 gap-1"
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {userPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={scaleInVariants}
                      {...postTap}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-muted"
                    >
                      <ImageWithFallback src={post.image} alt={`Post ${post.id}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full border border-white/10 bg-black/35 px-1.5 py-0.75 text-white/85 backdrop-blur-sm">
                        <Heart className="h-3 w-3 text-white/70" />
                        <span className="text-[10px] font-medium text-white/75">{formatCount(post.likes)}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "saved" && (
                <motion.div key="saved" className="py-12 text-center" {...panelMotion}>
                  <EmptyState
                    icon={Bookmark}
                    title="No saved posts yet"
                    body="Save looks from the feed to build a private collection."
                  />
                </motion.div>
              )}

              {activeTab === "wardrobe" && (
                <motion.div key="wardrobe" className="px-4" {...panelMotion}>
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
                        {...wardrobeTap}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
                      >
                        <ImageWithFallback src={item.image} alt={item.category} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                          <span className="text-xs text-white">{item.category}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "liked" && (
                <motion.div key="liked" className="py-12 text-center" {...panelMotion}>
                  <EmptyState
                    icon={Heart}
                    title="No liked posts yet"
                    body="Tap the heart on posts you want to come back to later."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </PageShell>
  );
}

function BusinessView() {
  const fadeUpVariants = useFadeUpVariants();
  const storeAddTap = usePressFeedback(0.98);
  const statusTone: Record<StoreStatus, string> = {
    Open: "bg-foreground/10 text-foreground",
    "Coming soon": "bg-purple-400/15 text-purple-500",
    Paused: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      className="space-y-4"
      variants={staggerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageSection className="p-5">
        <motion.div variants={fadeUpVariants} className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h2 className="app-section-title">Analytics</h2>
          </div>
          <span className="text-xs text-muted-foreground">Last 7 months</span>
        </motion.div>

        <motion.div variants={fadeUpVariants} className="h-40 w-full">
          <ChartContainer config={reachChartConfig} className="h-40 w-full">
            <AreaChart data={reachData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="reachFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-reach)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-reach)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px]"
              />
              <Area
                type="monotone"
                dataKey="reach"
                stroke="var(--color-reach)"
                strokeWidth={2}
                fill="url(#reachFill)"
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--color-views)"
                strokeWidth={1.5}
                fill="url(#viewsFill)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </AreaChart>
          </ChartContainer>
        </motion.div>

        <motion.div variants={fadeUpVariants} className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-[var(--color-reach)]" /> Reach
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px] bg-[var(--color-views)]" /> Profile views
          </span>
        </motion.div>
      </PageSection>

      <PageSection className="p-5">
        <motion.div variants={fadeUpVariants} className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <h2 className="app-section-title">Manage stores</h2>
          </div>
          <span className="text-xs text-muted-foreground">{stores.length} locations</span>
        </motion.div>

        <motion.div variants={fadeUpVariants} className="space-y-2">
          {stores.map((store) => (
            <div
              key={store.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                <ImageWithFallback src={store.cover} alt={store.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{store.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {store.city}
                </p>
              </div>
              <span
                className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium", statusTone[store.status])}
              >
                {store.status}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.button
          type="button"
          {...storeAddTap}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card p-3 text-sm font-medium text-muted-foreground hover:bg-muted/60"
        >
          <Store className="h-4 w-4" />
          Add a store
        </motion.button>
      </PageSection>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center rounded-2xl border border-border bg-card px-4 py-6">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
