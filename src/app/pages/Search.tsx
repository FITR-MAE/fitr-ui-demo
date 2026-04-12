import { MapPin, Search, Shirt, ShoppingBag, Store } from "lucide-react";
import { useState } from "react";

import { PageHeader, PageSection, PageShell } from "../components/Page";

const searchTabs = [
  { id: "posts", label: "Posts" },
  { id: "users", label: "Users" },
  { id: "clothes", label: "Clothes" },
  { id: "brands", label: "Brands" },
  { id: "stores", label: "Stores" },
] as const;

const userResults = [
  { id: 1, name: "Sarah Connor", handle: "@sarahfits", detail: "Minimal tailoring and clean neutrals" },
  { id: 2, name: "Lena Hart", handle: "@lenalooks", detail: "Vintage streetwear with soft layers" },
  { id: 3, name: "Marcus Vale", handle: "@marcusmode", detail: "Sharp menswear and elevated basics" },
];

const postResults = [
  { id: 1, title: "Monochrome layering", meta: "2.8k likes" },
  { id: 2, title: "Weekend denim edit", meta: "1.9k likes" },
  { id: 3, title: "Structured coat styling", meta: "3.2k likes" },
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
  { id: 1, name: "Atelier North", meta: "0.8 mi away" },
  { id: 2, name: "Canvas Studio", meta: "1.4 mi away" },
  { id: 3, name: "Thread House", meta: "2.1 mi away" },
];

export function SearchPage() {
  const [activeTab, setActiveTab] = useState<(typeof searchTabs)[number]["id"]>("posts");

  return (
    <PageShell>
      <PageHeader title="Search" />

      <div className="app-page-content space-y-4">
        <div className="flex justify-center">
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
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search outfits, users, styles..."
            className="h-12 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {activeTab === "users" && (
          <PageSection className="p-5">
            <div className="mt-4 space-y-3">
              {userResults.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-semibold text-white">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.handle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{user.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </PageSection>
        )}

        {activeTab === "posts" && (
          <PageSection className="p-5">
            <div className="mt-4 grid grid-cols-3 gap-2">
              {postResults.map((post) => (
                <div key={post.id} className="aspect-square rounded-2xl border border-border bg-muted p-3">
                  <div className="flex h-full flex-col justify-end rounded-xl bg-card/70 p-3">
                    <p className="text-sm font-medium text-foreground">{post.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{post.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </PageSection>
        )}

        {activeTab === "clothes" && (
          <PageSection className="p-5">
            <div className="mt-4 space-y-3">
              {clothesResults.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Shirt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </PageSection>
        )}

        {activeTab === "brands" && (
          <PageSection className="p-5">
            <div className="mt-4 space-y-3">
              {brandResults.map((brand) => (
                <div key={brand.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{brand.name}</p>
                    <p className="text-xs text-muted-foreground">{brand.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </PageSection>
        )}

        {activeTab === "stores" && (
          <>
            <PageSection className="p-5 text-center">
              <div className="mb-4 flex items-center gap-2 text-left">
                <MapPin className="h-5 w-5" />
                <h2 className="app-section-title">Stores Near You</h2>
              </div>
              <MapPin className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="app-section-copy">Map view coming soon</p>
            </PageSection>

            <PageSection className="p-5">
              <h2 className="app-section-title">Store Results</h2>
              <div className="mt-4 space-y-3">
                {storeResults.map((store) => (
                  <div key={store.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Store className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{store.name}</p>
                      <p className="text-xs text-muted-foreground">{store.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PageSection>
          </>
        )}
      </div>
    </PageShell>
  );
}
