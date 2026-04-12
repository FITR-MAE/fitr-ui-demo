import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, MapPin, Search, Shirt, ShoppingBag, SlidersHorizontal, Store } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader, PageSection, PageShell } from "../components/Page";

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

const userResults = [
  { id: 1, name: "Sarah Connor", handle: "@sarahfits", detail: "Minimal tailoring and clean neutrals" },
  { id: 2, name: "Lena Hart", handle: "@lenalooks", detail: "Vintage streetwear with soft layers" },
  { id: 3, name: "Marcus Vale", handle: "@marcusmode", detail: "Sharp menswear and elevated basics" },
];

const postResults = [
  {
    id: 1,
    title: "Monochrome layering",
    meta: "2.8k likes",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    id: 2,
    title: "Weekend denim edit",
    meta: "1.9k likes",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    id: 3,
    title: "Structured coat styling",
    meta: "3.2k likes",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMXxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=600",
  },
];

const clothesResults = [
  { id: 1, name: "Boxy wool blazer", meta: "Outerwear" },
  { id: 2, name: "Wide-leg pleated trousers", meta: "Bottoms" },
  { id: 3, name: "Leather ankle boots", meta: "Shoes" },
];

const brandResults = [
  { id: 1, name: "The Row", meta: "Luxury essentials" },
  { id: 2, name: "COS", meta: "Modern wardrobe staples" },
  { id: 3, name: "Aime Leon Dore", meta: "Refined streetwear" },
];

const storeResults = [
  { id: 1, name: "Atelier North", meta: "0.8 mi away", lat: 40.7411, lng: -73.9897 },
  { id: 2, name: "Canvas Studio", meta: "1.4 mi away", lat: 40.7297, lng: -73.9987 },
  { id: 3, name: "Thread House", meta: "2.1 mi away", lat: 40.7223, lng: -73.9874 },
];

const compactResultCardClass =
  "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3";

export function SearchPage() {
  const [activeTab, setActiveTab] = useState<(typeof searchTabs)[number]["id"]>("posts");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterState, setFilterState] = useState(defaultFilterState);
  const [openFilterMenu, setOpenFilterMenu] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState(storeResults[0].id);
  const shouldAnimate = !useReducedMotion();
  const activeTabFilters = tabFilters[activeTab];
  const hasFilters = activeTabFilters.length > 0;
  const selectedStore = storeResults.find((store) => store.id === selectedStoreId) ?? storeResults[0];
  const mapBounds = {
    left: selectedStore.lng - 0.018,
    right: selectedStore.lng + 0.018,
    top: selectedStore.lat + 0.012,
    bottom: selectedStore.lat - 0.012,
  };
  const storeMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.left}%2C${mapBounds.bottom}%2C${mapBounds.right}%2C${mapBounds.top}&layer=mapnik&marker=${selectedStore.lat}%2C${selectedStore.lng}`;
  const tabPanelMotionProps = shouldAnimate
    ? {
        initial: { opacity: 0, transform: "translateY(10px) scale(0.985)" },
        animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
        exit: { opacity: 0, transform: "translateY(-8px) scale(0.985)" },
      }
    : {};
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
      <PageHeader title="Search" />

      <motion.div
        layout={shouldAnimate}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="app-page-content space-y-4"
      >
        <motion.div
          layout={shouldAnimate}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="inline-flex flex-wrap justify-center rounded-full border border-border bg-card p-1">
            {searchTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
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
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                filtersOpen
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
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
                            className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors ${
                              openFilterMenu === filter.id
                                ? "border-zinc-800 bg-zinc-800 text-white"
                                : "border-border bg-card text-foreground hover:bg-muted/60"
                            }`}
                          >
                            <span className={openFilterMenu === filter.id ? "text-white/75" : "text-muted-foreground"}>
                              {filter.label}:
                            </span>
                            <span>
                              {String(
                                filterState[activeTab][filter.id as keyof (typeof filterState)[typeof activeTab]],
                              )}
                            </span>
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform ${openFilterMenu === filter.id ? "rotate-180" : "rotate-0"}`}
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
                                      className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                                        selected ? "bg-zinc-800 text-white" : "text-foreground hover:bg-muted/60"
                                      }`}
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
                          className={`h-9 rounded-full px-3 text-xs font-medium transition-colors ${
                            filterState[activeTab][filter.id as keyof (typeof filterState)[typeof activeTab]]
                              ? "border-zinc-800 bg-zinc-800 text-white"
                              : "border border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
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
                <div className="mt-3 space-y-2">
                  {userResults.map((user) => (
                    <div key={user.id} className={compactResultCardClass}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-semibold text-white">
                        {user.name.charAt(0)}
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
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {postResults.map((post) => (
                    <div key={post.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="text-sm font-medium">{post.title}</p>
                        <p className="mt-1 text-xs text-white/80">{post.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PageSection>
            )}
            {activeTab === "clothes" && (
              <PageSection className="p-4">
                <div className="mt-3 space-y-2">
                  {clothesResults.map((item) => (
                    <div key={item.id} className={compactResultCardClass}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Shirt className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </PageSection>
            )}
            {activeTab === "brands" && (
              <PageSection className="p-4">
                <div className="mt-3 space-y-2">
                  {brandResults.map((brand) => (
                    <div key={brand.id} className={compactResultCardClass}>
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
                  <div className="mb-3 flex items-center gap-2 text-left">
                    <MapPin className="h-5 w-5" />
                    <h2 className="app-section-title">Stores Near You</h2>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                    <iframe
                      title={`Map for ${selectedStore.name}`}
                      src={storeMapUrl}
                      className="h-56 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Centered on {selectedStore.name}, {selectedStore.meta}
                  </p>
                </PageSection>

                <PageSection className="p-4">
                  <h2 className="app-section-title">Store Results</h2>
                  <div className="mt-3 space-y-2">
                    {storeResults.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => setSelectedStoreId(store.id)}
                        className={`${compactResultCardClass} w-full text-left transition-colors ${
                          selectedStoreId === store.id
                            ? "border-zinc-800 bg-zinc-800 text-white"
                            : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Store className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-medium ${selectedStoreId === store.id ? "text-white" : "text-foreground"}`}>
                            {store.name}
                          </p>
                          <p className={`truncate text-xs ${selectedStoreId === store.id ? "text-white/75" : "text-muted-foreground"}`}>
                            {store.meta}
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
