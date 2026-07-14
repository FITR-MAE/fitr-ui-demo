import {
  ArrowUpRight,
  Bookmark,
  Building2,
  ExternalLink,
  Grid,
  Heart,
  Images,
  MapPin,
  RefreshCw,
  Settings,
  Shirt,
  ShoppingBag,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";
import { useAccounts } from "../components/AccountProvider";
import { AccountSwitcher } from "../components/AccountSwitcher";
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

type BusinessTabId = "posts" | "storefront" | "relationships" | "outfits";
type StorefrontSort = "trending" | "newest" | "liked";

type BusinessPost = {
  id: string;
  image: string;
  caption: string;
  likes: number;
};

type StorefrontItem = {
  id: string;
  name: string;
  image: string;
  price: string;
  groupType: "Season" | "Drop" | "Collaboration";
  groupName: string;
  releasedAt: string;
  releaseLabel: string;
  likes: number;
  trending: number;
};

type Relationship = {
  id: string;
  name: string;
  detail: string;
  image: string;
};

type OutfitSubmission = {
  id: string;
  image: string;
  user: string;
  handle: string;
  avatar: string;
  caption: string;
  likes: number;
};

const brandPosts: BusinessPost[] = [
  {
    id: "brand-post-1",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    caption: "New season tailoring in motion",
    likes: 8432,
  },
  {
    id: "brand-post-2",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    caption: "Backstage details from the atelier",
    likes: 6217,
  },
  {
    id: "brand-post-3",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1930b",
    caption: "The current collection in store",
    likes: 5198,
  },
  {
    id: "brand-post-4",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    caption: "An evening study in proportion",
    likes: 7941,
  },
  {
    id: "brand-post-5",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    caption: "From the latest presentation",
    likes: 4586,
  },
  {
    id: "brand-post-6",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
    caption: "A closer look at this season's layers",
    likes: 9104,
  },
];

const storePosts: BusinessPost[] = [
  {
    id: "store-post-1",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    caption: "This week's front room edit",
    likes: 1256,
  },
  {
    id: "store-post-2",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e33a76",
    caption: "New arrivals on the rail",
    likes: 983,
  },
  {
    id: "store-post-3",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
    caption: "Weekend styling notes from the floor",
    likes: 1473,
  },
  {
    id: "store-post-4",
    image: "https://images.unsplash.com/photo-1537832816519-689ad163238b",
    caption: "A closer look at our summer selection",
    likes: 1108,
  },
  {
    id: "store-post-5",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a",
    caption: "In store now",
    likes: 864,
  },
  {
    id: "store-post-6",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc",
    caption: "Staff picks for warm evenings",
    likes: 1321,
  },
];

const brandStorefrontItems: StorefrontItem[] = [
  {
    id: "brand-season",
    name: "Deconstructed wool coat",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    price: "$2,490",
    groupType: "Season",
    groupName: "Autumn / Winter 2026",
    releasedAt: "2026-06-18",
    releaseLabel: "Released Jun 18",
    likes: 4280,
    trending: 98,
  },
  {
    id: "brand-drop",
    name: "Tabi leather loafer",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    price: "$1,120",
    groupType: "Drop",
    groupName: "Tabi Icons",
    releasedAt: "2026-07-10",
    releaseLabel: "Released Jul 10",
    likes: 3150,
    trending: 88,
  },
  {
    id: "brand-collaboration",
    name: "Technical paneled sneaker",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    price: "$620",
    groupType: "Collaboration",
    groupName: "MM6 x Salomon",
    releasedAt: "2026-05-24",
    releaseLabel: "Released May 24",
    likes: 7824,
    trending: 94,
  },
];

const storeStorefrontItems: StorefrontItem[] = [
  {
    id: "store-season",
    name: "Linen utility overshirt",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    price: "$285",
    groupType: "Season",
    groupName: "High Summer 2026",
    releasedAt: "2026-06-20",
    releaseLabel: "Arrived Jun 20",
    likes: 842,
    trending: 96,
  },
  {
    id: "store-drop",
    name: "Hand-finished leather tote",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    price: "$410",
    groupType: "Drop",
    groupName: "In-store Edition 02",
    releasedAt: "2026-07-11",
    releaseLabel: "Arrived Jul 11",
    likes: 615,
    trending: 87,
  },
  {
    id: "store-collaboration",
    name: "Paneled trail runner",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
    price: "$340",
    groupType: "Collaboration",
    groupName: "Northline x Roa",
    releasedAt: "2026-05-30",
    releaseLabel: "Arrived May 30",
    likes: 1342,
    trending: 92,
  },
];

const brandStockists: Relationship[] = [
  {
    id: "dover-street-market",
    name: "Dover Street Market",
    detail: "18-22 Haymarket, London",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  },
  {
    id: "leclaireur",
    name: "L'Eclaireur",
    detail: "40 Rue de Sevigne, Paris",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e33a76",
  },
  {
    id: "antonioli",
    name: "Antonioli",
    detail: "Via P. Paoli 1, Milan",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
  },
];

const storeBrands: Relationship[] = [
  {
    id: "acne-studios",
    name: "Acne Studios",
    detail: "Stockholm, Sweden - Ready-to-wear",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc",
  },
  {
    id: "our-legacy",
    name: "Our Legacy",
    detail: "Stockholm, Sweden - Menswear",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
  },
  {
    id: "studio-nicholson",
    name: "Studio Nicholson",
    detail: "London, UK - Modern essentials",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
  },
];

const brandOutfits: OutfitSubmission[] = [
  {
    id: "brand-fit-1",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    user: "Mina Park",
    handle: "@minapark",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    caption: "Archive tailoring with a softer base layer.",
    likes: 386,
  },
  {
    id: "brand-fit-2",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    user: "Jules Moreau",
    handle: "@juleswears",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    caption: "Tabi boots, wide trousers, and a quiet evening palette.",
    likes: 241,
  },
];

const storeOutfits: OutfitSubmission[] = [
  {
    id: "store-fit-1",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    user: "Noor Haddad",
    handle: "@noorstyles",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    caption: "A full look built from this week's store edit.",
    likes: 118,
  },
];

export function Profile() {
  const { activeAccount, getPosts } = useAccounts();
  const isBusiness = activeAccount.type === "business";
  const [activeTab, setActiveTab] = useState<TabId>("posts");
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const fadeUpVariants = useFadeUpVariants();
  const scaleInVariants = useScaleInVariants();
  const panelMotion = usePanelMotion();
  const settingsTap = usePressFeedback(0.9);
  const tabTap = usePressFeedback(0.96);
  const postTap = usePressFeedback(0.97);
  const wardrobeTap = usePressFeedback(0.95);
  const personalPosts = [...getPosts(activeAccount.id), ...userPosts];

  if (isBusiness) return <BusinessProfile />;

  return (
    <>
      <PageShell>
      <PageHeader
        title={activeAccount.name}
        trailing={
          <>
            <motion.div {...settingsTap}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSwitcherOpen(true)}
                aria-label="Switch account"
                className="h-9 rounded-full px-3 text-xs"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Switch account</span>
              </Button>
            </motion.div>
            <motion.div {...settingsTap}>
              <Button variant="ghost" aria-label="Settings" className="h-9 w-9 rounded-full p-0">
                <Settings className="h-[18px] w-[18px]" />
              </Button>
            </motion.div>
          </>
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
                    <Shirt className="h-3 w-3" />
                    Personal
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
              {profileStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-3 text-center">
                  <div className="text-lg font-semibold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </PageSection>

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
                  {personalPosts.map((post) => (
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
      </div>
      </PageShell>
      <AccountSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} />
    </>
  );
}

function BusinessProfile() {
  const { activeAccount, activeRole, getPosts } = useAccounts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<BusinessTabId>("posts");
  const [storefrontSort, setStorefrontSort] = useState<StorefrontSort>("trending");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const fadeUpVariants = useFadeUpVariants();
  const scaleInVariants = useScaleInVariants();
  const panelMotion = usePanelMotion();
  const controlTap = usePressFeedback(0.98);
  const tabTap = usePressFeedback(0.96);
  const cardTap = usePressFeedback(0.97);

  const isStore = activeAccount.businessKind === "store";
  const isSeeded = activeAccount.id === "maison" || activeAccount.id === "lncc";
  const typeLabel = isStore ? "Store" : "Brand";
  const TypeIcon = isStore ? Store : Building2;
  const relationshipLabel = isStore ? "Brands Stocked" : "Stores Stocked In";
  const publishedPosts = getPosts(activeAccount.id);
  const posts = isSeeded
    ? [...publishedPosts, ...(isStore ? storePosts : brandPosts)]
    : publishedPosts;
  const storefrontItems = isSeeded ? (isStore ? storeStorefrontItems : brandStorefrontItems) : [];
  const relationships = isSeeded ? (isStore ? storeBrands : brandStockists) : [];
  const outfits = isSeeded ? (isStore ? storeOutfits : brandOutfits) : [];
  const roleLabel = `${activeRole.charAt(0).toUpperCase()}${activeRole.slice(1)}`;
  const websiteHref = activeAccount.website
    ? activeAccount.website.startsWith("http")
      ? activeAccount.website
      : `https://${activeAccount.website}`
    : undefined;
  const businessTabs: { id: BusinessTabId; label: string; icon: LucideIcon }[] = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "storefront", label: "Storefront", icon: ShoppingBag },
    { id: "relationships", label: relationshipLabel, icon: isStore ? Building2 : Store },
    { id: "outfits", label: "Outfits / Inspiration", icon: Images },
  ];
  const publicStats = [
    { label: "Posts", value: `${posts.length}` },
    { label: "Followers", value: isStore ? "8.6k" : "128k" },
    { label: "Following", value: isStore ? "214" : "312" },
  ];
  const featuredItems = [...storefrontItems]
    .sort((first, second) => {
      if (storefrontSort === "newest") return second.releasedAt.localeCompare(first.releasedAt);
      if (storefrontSort === "liked") return second.likes - first.likes;
      return second.trending - first.trending;
    })
    .slice(0, 3);

  return (
    <>
      <PageShell>
        <PageHeader
          title={activeAccount.name}
          trailing={
            <motion.div {...controlTap}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSwitcherOpen(true)}
                className="h-9 rounded-full px-3 text-xs"
              >
                <RefreshCw className="h-4 w-4" />
                Switch account
              </Button>
            </motion.div>
          }
        />

        <div className="app-page-content space-y-4">
          <PageSection className="p-5">
            <motion.div className="space-y-4" variants={staggerVariants} initial="hidden" animate="visible">
              <motion.div className="flex items-start gap-4" variants={fadeUpVariants}>
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                  <ImageWithFallback
                    src={activeAccount.avatar}
                    alt={activeAccount.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="app-chip inline-flex items-center gap-1">
                    <TypeIcon className="h-3 w-3" />
                    {typeLabel}
                  </span>
                  <p className="mt-2 text-base font-semibold">{activeAccount.name}</p>
                  <p className="text-sm text-muted-foreground">{activeAccount.handle}</p>
                  {activeAccount.category ? (
                    <p className="mt-1 text-xs text-muted-foreground">{activeAccount.category}</p>
                  ) : null}
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="space-y-2">
                <p className="text-sm text-foreground">
                  {activeAccount.bio ?? "Independent fashion, considered objects, and the people who wear them."}
                </p>
                {isStore ? (
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>
                      <span className="sr-only">Physical address: </span>
                      {activeAccount.address || "Physical address not provided"}
                    </span>
                  </p>
                ) : null}
                {activeAccount.website && websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                  >
                    {activeAccount.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </motion.div>

              <motion.div className="grid grid-cols-3 gap-2" variants={fadeUpVariants}>
                {publicStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-card p-3 text-center">
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <span className="app-chip inline-flex">{roleLabel} access</span>
                  <p className="mt-1 text-xs text-muted-foreground">You are a member of this {typeLabel.toLowerCase()}.</p>
                </div>
                <motion.div {...controlTap}>
                  <Button
                    type="button"
                    onClick={() => navigate("/brand-studio")}
                    className="h-10 w-full rounded-full bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/90 sm:w-auto"
                  >
                    Open Brand Studio
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </PageSection>

          <PageSection className="p-2">
            <div className="grid grid-cols-4 gap-1" role="tablist" aria-label={`${typeLabel} profile sections`}>
              {businessTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    {...tabTap}
                    className={cn(
                      "flex min-h-[64px] min-w-0 flex-col items-center justify-center rounded-2xl px-1.5 py-2 text-center transition-colors",
                      isActive ? "bg-accent/40 text-foreground" : "text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="mt-1 text-[10px] font-medium leading-tight">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </PageSection>

          <AnimatePresence mode="wait">
            {activeTab === "posts" ? (
              posts.length === 0 ? (
                <motion.div key="business-posts-empty" className="py-12 text-center" {...panelMotion}>
                  <EmptyState
                    icon={Grid}
                    title="No posts yet"
                    body="Share your first post to start building your profile."
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="business-posts"
                  className="grid grid-cols-3 gap-1"
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={scaleInVariants}
                      {...cardTap}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-muted"
                    >
                      <ImageWithFallback src={post.image} alt={post.caption} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full border border-white/10 bg-black/35 px-1.5 py-0.5 text-white/85 backdrop-blur-sm">
                        <Heart className="h-3 w-3 text-white/70" />
                        <span className="text-[10px] font-medium text-white/75">{formatCount(post.likes)}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : null}

            {activeTab === "storefront" ? (
              <motion.div key="storefront" {...panelMotion}>
                <PageSection className="p-4">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <h2 className="app-section-title">Featured Storefront</h2>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Up to 3 featured pieces from current releases.</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{featuredItems.length} featured</span>
                  </div>

                  {featuredItems.length === 0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="No storefront items yet"
                      body="Feature up to three pieces from your collections in Brand Studio."
                    />
                  ) : (
                    <>
                  <div className="mb-4 inline-flex rounded-full border border-border bg-card p-1" aria-label="Sort Storefront">
                    {([
                      ["trending", "Trending"],
                      ["newest", "Newest"],
                      ["liked", "Most Liked"],
                    ] as const).map(([id, label]) => {
                      const isActive = storefrontSort === id;
                      return (
                        <motion.button
                          key={id}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setStorefrontSort(id)}
                          {...controlTap}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                            isActive
                              ? "bg-foreground text-background"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                          )}
                        >
                          {label}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.div className="space-y-4" variants={staggerVariants} initial="hidden" animate="visible">
                    {featuredItems.map((item) => (
                      <motion.div key={item.id} variants={fadeUpVariants}>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="app-chip">{item.groupType}</span>
                          <span className="text-xs font-medium text-foreground">{item.groupName}</span>
                        </div>
                        <motion.div
                          {...cardTap}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                        >
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                            <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="mt-0.5 text-sm text-foreground">{item.price}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>{item.releaseLabel}</span>
                              <span className="inline-flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {formatCount(item.likes)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                    </>
                  )}
                </PageSection>
              </motion.div>
            ) : null}

            {activeTab === "relationships" ? (
              <motion.div key="relationships" {...panelMotion}>
                <PageSection className="p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {isStore ? (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Store className="h-4 w-4 text-muted-foreground" />
                        )}
                        <h2 className="app-section-title">{relationshipLabel}</h2>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {isStore
                          ? `Labels currently available at ${activeAccount.name}.`
                          : `Selected places carrying ${activeAccount.name}.`}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{relationships.length}</span>
                  </div>

                  {relationships.length === 0 ? (
                    <EmptyState
                      icon={isStore ? Building2 : Store}
                      title={`No ${relationshipLabel.toLowerCase()} yet`}
                      body={isStore
                        ? "Add brands you carry to help shoppers discover your selection."
                        : "Connect stores that carry your label to expand discovery."}
                    />
                  ) : (
                  <motion.div className="space-y-2" variants={staggerVariants} initial="hidden" animate="visible">
                    {relationships.map((relationship) => (
                      <motion.div
                        key={relationship.id}
                        variants={fadeUpVariants}
                        {...cardTap}
                        className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border bg-card p-3"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <ImageWithFallback
                            src={relationship.image}
                            alt={relationship.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{relationship.name}</p>
                          <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                            {isStore ? (
                              <Building2 className="mt-0.5 h-3 w-3 shrink-0" />
                            ) : (
                              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                            )}
                            <span>{relationship.detail}</span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  )}
                </PageSection>
              </motion.div>
            ) : null}

            {activeTab === "outfits" ? (
              <motion.div key="outfits" {...panelMotion}>
                <PageSection className="p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <h2 className="app-section-title">Outfits / Inspiration</h2>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {outfits.length} {outfits.length === 1 ? "fit" : "fits"}
                    </span>
                  </div>

                  <div className="mb-4 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
                    <p className="text-sm font-medium">Community gallery is growing</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {outfits.length === 1 ? "One fit has" : `${outfits.length} fits have`} been submitted so far. New
                      looks will appear as people tag {activeAccount.handle}.
                    </p>
                  </div>

                  <motion.div className="grid grid-cols-2 gap-2" variants={staggerVariants} initial="hidden" animate="visible">
                    {outfits.map((outfit) => (
                      <motion.article
                        key={outfit.id}
                        variants={scaleInVariants}
                        {...cardTap}
                        className="overflow-hidden rounded-2xl border border-border bg-card"
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={outfit.image}
                            alt={`${outfit.user}'s fit featuring ${activeAccount.name}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                              <ImageWithFallback
                                src={outfit.avatar}
                                alt={outfit.user}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium">{outfit.user}</p>
                              <p className="truncate text-[11px] text-muted-foreground">{outfit.handle}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">{outfit.caption}</p>
                          <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            {formatCount(outfit.likes)}
                          </p>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                </PageSection>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </PageShell>

      <AccountSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} />
    </>
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
