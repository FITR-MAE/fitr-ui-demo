import { ArrowLeft, CalendarDays, ChevronDown, Clock3, Heart, MapPin, Store } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

import { activityRows } from "../data/activity";
import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cn } from "../components/ui/utils";

const interactionItems = [
  { name: "ModernMuse", detail: "Liked your post and saved it to Minimal Tailoring", time: "4m" },
  { name: "JulesMoreau", detail: "Commented: The coat is such a strong shape.", time: "18m" },
  { name: "71 people", detail: "Liked your post this week", time: "This week" },
];

const sales = [
  { name: "Maison Margiela", offer: "Selected archive pieces up to 20% off", dates: "Jul 18 - Jul 31", code: "No code required" },
  { name: "Studio Nicholson", offer: "Private sale: 15% off selected tailoring", dates: "Starts Jul 20", code: "Code: FITR15" },
  { name: "LN-CC", offer: "Summer edit up to 30% off", dates: "Jul 22 - Aug 4", code: "No code required" },
];

const nearbyStores = [
  { name: "LN-CC", distance: "0.8 mi", address: "18 Shacklewell Lane, London E8 2EZ", hours: "Open today until 7 PM" },
  { name: "Dover Street Market", distance: "1.4 mi", address: "18-22 Haymarket, London SW1Y 4DG", hours: "Open today until 6:30 PM" },
  { name: "The Archive Room", distance: "2.1 mi", address: "44 Redchurch Street, London E2 7DP", hours: "Opens tomorrow at 11 AM" },
];

export function ActivityDetailPage() {
  const { id } = useParams();
  const activity = activityRows.find((row) => row.id === id) ?? activityRows[0];
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const Icon = activity.icon;

  const toggleItem = (item: string) => {
    setExpandedItem((current) => (current === item ? null : item));
  };

  return (
    <PageShell>
      <PageHeader
        title="Activity"
        leading={
          <Button asChild variant="outline" size="sm" className="rounded-full px-3">
            <Link to="/notifications">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="app-page-content space-y-4">
        <PageSection className="p-5">
          <div className="app-chip inline-flex">{activity.time} ago</div>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="app-section-title">{activity.title}</h2>
                {activity.kind === "interactions" ? <span className="app-chip">New</span> : null}
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{activity.detail}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />Updated {activity.time} ago
              </div>
            </div>
          </div>
        </PageSection>

        {activity.kind === "interactions" ? (
          <>
            <PageSection className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="app-section-title">Recent activity</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Tap an update for more context.</p>
                </div>
              </div>
              <div className="space-y-2">
                {interactionItems.map((item) => {
                  const isExpanded = expandedItem === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleItem(item.name)}
                      aria-expanded={isExpanded}
                      className="w-full rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Heart className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                      </div>
                      {isExpanded ? <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">This interaction came from your latest post. Keep sharing looks that prompt saves and comments.</p> : null}
                    </button>
                  );
                })}
              </div>
            </PageSection>

            <PageSection className="p-5">
              <h2 className="app-section-title">Related post</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-muted">
                <ImageWithFallback src="https://images.unsplash.com/photo-1651742532474-ea4401a34a10" alt="Featured outfit" className="aspect-[4/5] w-full object-cover" />
              </div>
              <Button asChild className="mt-4 w-full rounded-full">
                <Link to="/">View in feed</Link>
              </Button>
            </PageSection>
          </>
        ) : null}

        {activity.kind === "sales" ? (
          <PageSection className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <h2 className="app-section-title">Sales to watch</h2>
                <p className="mt-1 text-xs text-muted-foreground">Tap a sale to see the details.</p>
              </div>
            </div>
            <div className="space-y-2">
              {sales.map((sale) => {
                const isExpanded = expandedItem === sale.name;
                return (
                  <button key={sale.name} type="button" onClick={() => toggleItem(sale.name)} aria-expanded={isExpanded} className="w-full rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"><CalendarDays className="h-4 w-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{sale.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{sale.offer}</p>
                      </div>
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                    </div>
                    {isExpanded ? <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground"><span>{sale.dates}</span><span>{sale.code}</span></div> : null}
                  </button>
                );
              })}
            </div>
          </PageSection>
        ) : null}

        {activity.kind === "stores" ? (
          <PageSection className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              <div>
                <h2 className="app-section-title">Nearby stores</h2>
                <p className="mt-1 text-xs text-muted-foreground">Tap a store for location and hours.</p>
              </div>
            </div>
            <div className="space-y-2">
              {nearbyStores.map((store) => {
                const isExpanded = expandedItem === store.name;
                return (
                  <button key={store.name} type="button" onClick={() => toggleItem(store.name)} aria-expanded={isExpanded} className="w-full rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"><Store className="h-4 w-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{store.name}</p>
                        <p className="text-xs text-muted-foreground">{store.distance} away</p>
                      </div>
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                    </div>
                    {isExpanded ? <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground"><p className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{store.address}</p><p>{store.hours}</p></div> : null}
                  </button>
                );
              })}
            </div>
          </PageSection>
        ) : null}
      </div>
    </PageShell>
  );
}
