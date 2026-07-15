import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, MapPin, Search, Shirt, ShoppingBag, SlidersHorizontal, Store } from "lucide-react";
import { useEffect, useState } from "react";

import { PageSection, PageShell } from "../components/Page";
import { PillTabs } from "../components/PillTabs";
import { cn } from "../components/ui/utils";
import { useShouldAnimate, useTabPanelMotion } from "../components/motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const searchTabs = [
  { id: "posts", label: "Posts" },
  { id: "users", label: "Users" },
  { id: "clothes", label: "Clothes" },
  { id: "brands", label: "Brands" },
  { id: "stores", label: "Stores" },
] as const;

const tabFilters = {
  posts: [
    { id: "sort", label: "Sort by", type: "select", options: ["Trending", "Newest", "Most liked"] },
    { id: "date", label: "Date posted", type: "select", options: ["Any time", "Today", "This week"] },
  ],
  users: [],
  clothes: [
    { id: "type", label: "Type", type: "select", options: ["All", "Outerwear", "Bottoms", "Shoes"] },
    { id: "colours", label: "Colours", type: "select", options: ["Any", "Black", "White", "Earth tones"] },
    { id: "onsale", label: "On sale", type: "toggle" },
  ],
  brands: [
    { id: "popularity", label: "Popularity", type: "select", options: ["Trending", "Niche"] },
    { id: "type", label: "Type", type: "select", options: ["All", "Luxury", "Streetwear", "Basics"] },
  ],
  stores: [
    { id: "distance", label: "Distance", type: "select", options: ["5 mi", "10 mi", "25 mi"] },
    { id: "openNow", label: "Open now", type: "toggle" },
    { id: "category", label: "Category", type: "select", options: ["All", "Boutiques", "Sneakers", "Vintage"] },
  ],
} as const;

const defaultFilterState = {
  posts: { sort: "Trending", date: "Any time" },
  users: {},
  clothes: { type: "All", colours: "Any", onsale: false },
  brands: { popularity: "Trending", type: "All" },
  stores: { distance: "5 mi", openNow: false, category: "All" },
} as const;

const userPhotos = [
  "https://plus.unsplash.com/premium_photo-1758726036543-a5294a86066e",
  "https://images.unsplash.com/photo-1774128089578-62b9454c0697",
  "https://images.unsplash.com/photo-1674504176007-d2f55cd47ad4",
  "https://images.unsplash.com/photo-1773932547658-cb3eb244aad3",
  "https://plus.unsplash.com/premium_photo-1728657016169-a425d4b5f813",
  "https://images.unsplash.com/photo-1773240307047-8412fcf1d866",
  "https://images.unsplash.com/photo-1773146916297-c9f61093c308",
  "https://images.unsplash.com/photo-1772442088907-463f166cf1f2",
  "https://images.unsplash.com/photo-1773698403328-e6891737b7dd",
];

const userResults = [
  {
    id: 1,
    name: "Emma Laurent",
    handle: "@emmalooks",
    detail: "Minimal tailoring and elevated basics",
    photo: userPhotos[0],
  },
  {
    id: 2,
    name: "James Wilson",
    handle: "@jamesfits",
    detail: "Classic menswear with modern touches",
    photo: userPhotos[1],
  },
  {
    id: 3,
    name: "Sofia Chen",
    handle: "@sofiastyle",
    detail: "Effortless neutrals and relaxed silhouettes",
    photo: userPhotos[2],
  },
  {
    id: 4,
    name: "Marcus Cole",
    handle: "@marcusstyle",
    detail: "Refined streetwear and layered looks",
    photo: userPhotos[3],
  },
  {
    id: 5,
    name: "Maya Rivera",
    handle: "@mayalooks",
    detail: "Bold colors and vintage-inspired pieces",
    photo: userPhotos[4],
  },
  {
    id: 6,
    name: "Daniel Kim",
    handle: "@danielk",
    detail: "Tailored essentials and clean aesthetics",
    photo: userPhotos[5],
  },
  {
    id: 7,
    name: "Ava Thompson",
    handle: "@avawears",
    detail: "Clean lines and timeless essentials",
    photo: userPhotos[6],
  },
  {
    id: 8,
    name: "Ryan Brooks",
    handle: "@ryanstyle",
    detail: "Urban fashion with minimalist accents",
    photo: userPhotos[7],
  },
  {
    id: 9,
    name: "Luna Park",
    handle: "@lunastyle",
    detail: "Modern streetwear with an artistic edge",
    photo: userPhotos[8],
  },
];

const postPhotos = [
  "https://images.unsplash.com/photo-1773853430943-5826d01813ae",
  "https://images.unsplash.com/photo-1775831726875-e3ca6f3ed2f8",
  "https://images.unsplash.com/photo-1683740912929-8920082c4659",
  "https://images.unsplash.com/photo-1775592230963-fe488fd06dd7",
  "https://images.unsplash.com/photo-1775036760841-6c1854634646",
  "https://images.unsplash.com/photo-1774748564101-739b1487e47f",
];

const postResults = [
  { id: 1, title: "Monochrome layering", meta: "2.8k likes", image: postPhotos[0] },
  { id: 2, title: "Weekend denim edit", meta: "1.9k likes", image: postPhotos[1] },
  { id: 3, title: "Structured coat styling", meta: "3.2k likes", image: postPhotos[2] },
  { id: 4, title: "Summer basics", meta: "2.1k likes", image: postPhotos[3] },
  { id: 5, title: "Streetwear edit", meta: "1.5k likes", image: postPhotos[4] },
  { id: 6, title: "Evening looks", meta: "4.2k likes", image: postPhotos[5] },
];

const clothesResults = [
  { id: 1, name: "Boxy wool blazer", meta: "Outerwear", detail: "Structured wool layer with a relaxed shoulder and room for knitwear." },
  { id: 2, name: "Wide-leg pleated trousers", meta: "Bottoms", detail: "High-rise tailoring with a full leg and a clean front pleat." },
  { id: 3, name: "Leather ankle boots", meta: "Shoes", detail: "Polished leather boot with a low stacked heel for everyday wear." },
];

const brandResults = [
  { id: 1, name: "The Row", meta: "Luxury essentials" },
  { id: 2, name: "COS", meta: "Modern wardrobe staples" },
  { id: 3, name: "Aime Leon Dore", meta: "Refined streetwear" },
];

const storeResults = [
  { id: 1, name: "Maison Margiela", distance: "0.8 mi away", address: "1 Great Marlborough Street, London W1F 7JQ", hours: "Open today until 7 PM", category: "Luxury fashion" },
  { id: 2, name: "Canvas Studio", distance: "1.4 mi away", address: "32 Redchurch Street, London E2 7DP", hours: "Open today until 6 PM", category: "Independent boutique" },
  { id: 3, name: "Thread House", distance: "2.1 mi away", address: "55 Chiltern Street, London W1U 6JQ", hours: "Opens tomorrow at 10 AM", category: "Vintage and resale" },
];

export function SearchPage() {
  const [activeTab, setActiveTab] = useState<(typeof searchTabs)[number]["id"]>("posts");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterState, setFilterState] = useState(defaultFilterState);
  const [openFilterMenu, setOpenFilterMenu] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState(storeResults[0].id);
  const [storeDetailsOpen, setStoreDetailsOpen] = useState(false);
  const [expandedClothingId, setExpandedClothingId] = useState<number | null>(null);
  const shouldAnimate = useShouldAnimate();
  const tabPanelMotionProps = useTabPanelMotion();
  const activeTabFilters = tabFilters[activeTab];
  const hasFilters = activeTabFilters.length > 0;
  const selectedStore = storeResults.find((store) => store.id === selectedStoreId) ?? storeResults[0];
  const filterPanelMotionProps = shouldAnimate
    ? {
        initial: { opacity: 0, y: -10, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -12, scale: 0.96 },
      }
    : {};
  const dropdownMotionProps = shouldAnimate
    ? {
        initial: { opacity: 0, y: 6, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 4, scale: 0.97 },
      }
    : {};
  const getFilterItemMotionProps = (index: number) =>
    shouldAnimate
      ? {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.18, delay: index * 0.04, ease: "easeOut" as const },
        }
      : {};
  const emptyStateMotionProps = shouldAnimate
    ? {
        initial: { opacity: 0, transform: "translateY(4px)" },
        animate: { opacity: 1, transform: "translateY(0px)" },
      }
    : {};

  useEffect(() => {
    if (!hasFilters) {
      setFiltersOpen(false);
      setOpenFilterMenu(null);
    }
  }, [hasFilters]);

  useEffect(() => {
    setOpenFilterMenu(null);
  }, [activeTab, filtersOpen]);

  return (
    <PageShell>
      <motion.div
        layout={shouldAnimate}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="app-page-content space-y-4"
      >
        <PillTabs tabs={searchTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <motion.div
          layout={shouldAnimate}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search outfits, users, styles..."
              className="h-9 w-full rounded-full border border-border bg-card pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {hasFilters && (
            <motion.button
              layout={shouldAnimate}
              type="button"
              whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
              onClick={() => setFiltersOpen((prev) => !prev)}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                filtersOpen
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
              aria-label={filtersOpen ? "Hide filters" : "Show filters"}
              aria-expanded={filtersOpen}
            >
              <motion.div
                animate={shouldAnimate ? { rotate: filtersOpen ? 90 : 0, scale: filtersOpen ? 1.05 : 1 } : undefined}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </motion.div>
            </motion.button>
          )}
        </motion.div>
        <AnimatePresence initial={false} mode="wait">
          {filtersOpen && (
            <motion.div
              key={activeTab}
              layout={shouldAnimate}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="overflow-visible rounded-2xl"
              {...filterPanelMotionProps}
            >
              {activeTabFilters.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeTabFilters.map((filter, index) => (
                    <motion.div key={filter.id} className="relative" {...getFilterItemMotionProps(index)}>
                      {filter.type === "select" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setOpenFilterMenu((prev) => (prev === filter.id ? null : filter.id))}
                            className={cn(
                              "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors",
                              openFilterMenu === filter.id
                                ? "border-foreground bg-foreground text-background"
                                : "border-border bg-card text-foreground hover:bg-muted/60",
                            )}
                          >
                            <span className={openFilterMenu === filter.id ? "text-background/70" : "text-muted-foreground"}>
                              {filter.label}:
                            </span>
                            <span>
                              {String(
                                filterState[activeTab][filter.id as keyof (typeof filterState)[typeof activeTab]],
                              )}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 transition-transform",
                                openFilterMenu === filter.id ? "rotate-180" : "rotate-0",
                              )}
                            />
                          </button>

                          <AnimatePresence>
                            {openFilterMenu === filter.id && (
                              <motion.div
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="absolute left-0 top-full z-20 mt-2 min-w-[11rem] rounded-2xl border border-border bg-card p-1"
                                {...dropdownMotionProps}
                              >
                                {filter.options.map((option) => {
                                  const selected =
                                    filterState[activeTab][
                                      filter.id as keyof (typeof filterState)[typeof activeTab]
                                    ] === option;

                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        setFilterState((prev) => ({
                                          ...prev,
                                          [activeTab]: {
                                            ...prev[activeTab],
                                            [filter.id]: option,
                                          },
                                        }));
                                        setOpenFilterMenu(null);
                                      }}
                                      className={cn(
                                        "block w-full rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors",
                                        selected ? "bg-foreground text-background" : "text-foreground hover:bg-muted/60",
                                      )}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setFilterState((prev) => ({
                              ...prev,
                              [activeTab]: {
                                ...prev[activeTab],
                                [filter.id]: !prev[activeTab][filter.id as keyof (typeof prev)[typeof activeTab]],
                              },
                            }))
                          }
                          className={cn(
                            "h-9 rounded-full px-3 text-xs font-medium transition-colors",
                            filterState[activeTab][filter.id as keyof (typeof filterState)[typeof activeTab]]
                              ? "border-foreground bg-foreground text-background"
                              : "border border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                          )}
                        >
                          {filter.label}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="text-sm text-muted-foreground"
                  {...emptyStateMotionProps}
                >
                  No filters available for users yet.
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            layout={shouldAnimate}
            transition={{ duration: 0.24, ease: "easeOut" }}
            {...tabPanelMotionProps}
          >
            {activeTab === "users" && (
              <PageSection className="p-4">
                <div className="space-y-2">
                  {userResults.map((user) => (
                    <div key={user.id} className="app-compact-row">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <ImageWithFallback src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.handle}</p>
                        <p className="truncate text-xs text-muted-foreground/90">{user.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PageSection>
            )}
            {activeTab === "posts" && (
              <PageSection className="p-5">
                <div className="grid grid-cols-2 gap-2">
                  {postResults.map((post) => (
                    <div key={post.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
                      <ImageWithFallback src={post.image} alt={post.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <p className="text-xs font-medium text-white">{post.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PageSection>
            )}
            {activeTab === "clothes" && (
              <PageSection className="p-4">
                <div className="space-y-2">
                  {clothesResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExpandedClothingId((current) => (current === item.id ? null : item.id))}
                      aria-expanded={expandedClothingId === item.id}
                      className="w-full rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Shirt className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expandedClothingId === item.id && "rotate-180")} />
                      </div>
                      {expandedClothingId === item.id ? <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">{item.detail}</p> : null}
                    </button>
                  ))}
                </div>
              </PageSection>
            )}
            {activeTab === "brands" && (
              <PageSection className="p-4">
                <div className="space-y-2">
                  {brandResults.map((brand) => (
                    <div key={brand.id} className="app-compact-row">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{brand.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{brand.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PageSection>
            )}
            {activeTab === "stores" && (
              <div className="space-y-4">
                <PageSection className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h2 className="app-section-title">Stores Near You</h2>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Store className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">{selectedStore.name}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">{selectedStore.distance}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{selectedStore.category}</p>
                      </div>
                    </div>
                    {storeDetailsOpen ? (
                      <div className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                        <p>{selectedStore.address}</p>
                        <p>{selectedStore.hours}</p>
                      </div>
                    ) : null}
                    <button type="button" onClick={() => setStoreDetailsOpen((current) => !current)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                      {storeDetailsOpen ? "Hide details" : "View details"}
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", storeDetailsOpen && "rotate-180")} />
                    </button>
                  </div>
                </PageSection>

                <PageSection className="p-4">
                  <h2 className="app-section-title">Store Results</h2>
                  <div className="mt-3 space-y-2">
                    {storeResults.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => {
                          setSelectedStoreId(store.id);
                          setStoreDetailsOpen(true);
                        }}
                        className={cn(
                          "app-compact-row-interactive",
                          "w-full text-left",
                          selectedStoreId === store.id
                            ? "border-foreground bg-foreground text-background"
                            : "hover:bg-muted/60",
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Store className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "truncate text-sm font-medium",
                              selectedStoreId === store.id ? "text-background" : "text-foreground",
                            )}
                          >
                            {store.name}
                          </p>
                          <p
                            className={cn(
                              "truncate text-xs",
                              selectedStoreId === store.id ? "text-background/75" : "text-muted-foreground",
                            )}
                          >
                            {store.distance}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </PageSection>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </PageShell>
  );
}
