import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Globe2,
  Link2,
  LockKeyhole,
  MousePointerClick,
  Shirt,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { useAccounts } from "../components/AccountProvider";
import { PageHeader, PageSection, PageShell } from "../components/Page";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/ui/chart";

const metricCards = [
  { label: "Reach", value: "248.6K", change: "+18.4%", icon: Users },
  { label: "Profile views", value: "31.2K", change: "+12.1%", icon: UserRound },
  { label: "Link clicks", value: "8,942", change: "+9.7%", icon: Link2 },
  { label: "CTR", value: "3.6%", change: "+0.4 pts", icon: MousePointerClick },
  { label: "Engagement", value: "7.8%", change: "+1.2 pts", icon: Sparkles },
  { label: "Wardrobe presence", value: "12.4K", change: "+21.6%", icon: Shirt },
];

const trendData = [
  { week: "May 25", reach: 38.2, profileViews: 4.1, linkClicks: 1.08 },
  { week: "Jun 1", reach: 41.8, profileViews: 4.7, linkClicks: 1.22 },
  { week: "Jun 8", reach: 39.6, profileViews: 4.4, linkClicks: 1.14 },
  { week: "Jun 15", reach: 47.5, profileViews: 5.3, linkClicks: 1.41 },
  { week: "Jun 22", reach: 51.2, profileViews: 6.2, linkClicks: 1.66 },
  { week: "Jun 29", reach: 58.9, profileViews: 7.1, linkClicks: 1.92 },
  { week: "Jul 6", reach: 63.4, profileViews: 7.8, linkClicks: 2.24 },
  { week: "Jul 13", reach: 68.7, profileViews: 8.6, linkClicks: 2.52 },
];

const trendConfig = {
  reach: { label: "Reach (K)", color: "var(--chart-1)" },
  profileViews: { label: "Profile views (K)", color: "var(--chart-2)" },
  linkClicks: { label: "Link clicks (K)", color: "var(--chart-3)" },
} satisfies ChartConfig;

const regions = [
  { label: "France | Ile-de-France", value: 28 },
  { label: "United Kingdom | London", value: 21 },
  { label: "United States | New York", value: 18 },
  { label: "Germany | Berlin", value: 11 },
  { label: "Other", value: 22 },
];

const nationalities = [
  { label: "French", value: 24 },
  { label: "British", value: 17 },
  { label: "American", value: 15 },
  { label: "Italian", value: 10 },
  { label: "Other / not shared", value: 34 },
];

const engagedUsers = [
  {
    name: "Amelia Stone",
    handle: "@ameliastone",
    interactions: "186 interactions",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    name: "Noor Haddad",
    handle: "@noorhaddad",
    interactions: "163 interactions",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  },
  {
    name: "Theo Martin",
    handle: "@theomartin",
    interactions: "141 interactions",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
];

const wardrobeItems = [
  {
    name: "Tabi ankle boots",
    category: "Footwear",
    wardrobes: "4,821 wardrobes",
    change: "+24%",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    name: "Replica sneakers",
    category: "Footwear",
    wardrobes: "3,074 wardrobes",
    change: "+17%",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  },
  {
    name: "Deconstructed jacket",
    category: "Outerwear",
    wardrobes: "2,186 wardrobes",
    change: "+31%",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
  },
  {
    name: "Glam Slam bag",
    category: "Accessories",
    wardrobes: "1,744 wardrobes",
    change: "+13%",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
  },
];

function EmptyAnalyticsState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}

function AccessState({ isBusiness }: { isBusiness: boolean }) {
  return (
    <PageShell>
      <PageHeader title="Analytics" />
      <div className="app-page-content max-w-6xl">
        <PageSection className="p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {isBusiness ? (
              <LockKeyhole className="h-5 w-5 text-muted-foreground" />
            ) : (
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <h2 className="mt-4 app-section-title">
            {isBusiness ? "Analytics access required" : "Business analytics are not active"}
          </h2>
          <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
            {isBusiness
              ? "Your current role does not include access to business performance and audience insights."
              : "Switch to a brand or store profile to review its performance."}
          </p>
        </PageSection>
      </div>
    </PageShell>
  );
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
          <ArrowUpRight className="h-3 w-3" />
          {change}
        </span>
      </div>
      <p className="mt-4 text-xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SegmentList({ items }: { items: { label: string; value: number }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <span className="truncate text-foreground">{item.label}</span>
            <span className="shrink-0 text-muted-foreground">{item.value}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-foreground" style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BrandAnalytics() {
  const { activeAccount, activeRole, permissions } = useAccounts();
  const isBusiness = activeAccount.type === "business";
  const hasAnalytics = activeAccount.id === "maison" || activeAccount.id === "lncc";
  const accountMetricCards = hasAnalytics
    ? metricCards
    : metricCards.map((metric) => ({ ...metric, value: "0", change: "No data" }));

  if (!isBusiness || !permissions.viewAnalytics) {
    return <AccessState isBusiness={isBusiness} />;
  }

  return (
    <PageShell>
      <PageHeader title="Analytics" subtitle={`${activeAccount.name} | ${activeRole}`} />
      <div className="app-page-content max-w-6xl space-y-4">
        <PageSection className="p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last 28 days</p>
              <h2 className="mt-1 app-section-title">Performance summary</h2>
            </div>
            <p className="text-xs text-muted-foreground">Compared with the previous 28 days</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {accountMetricCards.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </PageSection>

        <PageSection className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <h2 className="app-section-title">Eight-week trend</h2>
                <p className="text-xs text-muted-foreground">Values shown in thousands</p>
              </div>
            </div>
            <span className="app-chip">Weekly</span>
          </div>
          {hasAnalytics ? (
            <ChartContainer config={trendConfig} className="mt-4 h-72 w-full">
              <LineChart data={trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} minTickGap={24} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="reach" stroke="var(--color-reach)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profileViews" stroke="var(--color-profileViews)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="linkClicks" stroke="var(--color-linkClicks)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="mt-4">
              <EmptyAnalyticsState title="No trend data yet" body="Publish posts and connect destinations to begin collecting performance data." />
            </div>
          )}
        </PageSection>

        <PageSection className="p-5 md:hidden">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="app-section-title">Audience snapshot</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xl font-semibold text-foreground">28%</p>
              <p className="mt-1 text-xs text-muted-foreground">Top region: Paris</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-xl font-semibold text-foreground">Top 18%</p>
              <p className="mt-1 text-xs text-muted-foreground">Peer benchmark</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Open Brand Studio on a larger screen for audience, user, item, and benchmark detail.
          </p>
        </PageSection>

        <div className="hidden gap-4 md:grid lg:grid-cols-2">
          <PageSection className="p-5">
            <div className="mb-4 flex items-start gap-2">
              <Globe2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <h2 className="app-section-title">Country and region</h2>
                <p className="text-xs text-muted-foreground">Based on audience location signals</p>
              </div>
            </div>
            {hasAnalytics ? <SegmentList items={regions} /> : <EmptyAnalyticsState title="No audience data yet" body="Audience segments appear after your profile has enough activity." />}
          </PageSection>

          <PageSection className="p-5">
            <div className="mb-4 flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <h2 className="app-section-title">Nationality</h2>
                <p className="text-xs text-muted-foreground">Self-reported, optional profile data</p>
              </div>
            </div>
            {hasAnalytics ? <SegmentList items={nationalities} /> : <EmptyAnalyticsState title="No self-reported data yet" body="This optional segment appears only once privacy thresholds are met." />}
          </PageSection>
        </div>

        <div className="hidden gap-4 md:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <PageSection className="p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="app-section-title">Most engaged users</h2>
              <span className="text-xs text-muted-foreground">28 days</span>
            </div>
            {hasAnalytics ? <div className="space-y-1">
              {engagedUsers.map((user, index) => (
                <div key={user.handle} className="flex items-center gap-3 rounded-2xl px-2 py-2">
                  <span className="w-4 text-xs text-muted-foreground">{index + 1}</span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                    <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.handle}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{user.interactions}</span>
                </div>
              ))}
            </div> : <EmptyAnalyticsState title="No engagement ranking yet" body="Rankings appear after people interact with your posts and links." />}
          </PageSection>

          <PageSection className="p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Shirt className="h-4 w-4 text-muted-foreground" />
                <h2 className="app-section-title">Wardrobe items</h2>
              </div>
              <span className="text-xs text-muted-foreground">Presence</span>
            </div>
            {hasAnalytics ? <div className="grid gap-2 sm:grid-cols-2">
              {wardrobeItems.map((item) => (
                <div key={item.name} className="flex items-center gap-3 rounded-2xl border border-border p-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.wardrobes}</p>
                  </div>
                  <span className="self-start text-xs font-medium text-foreground">{item.change}</span>
                </div>
              ))}
            </div> : <EmptyAnalyticsState title="No wardrobe placements yet" body="This view will show products users add to their wardrobes." />}
          </PageSection>
        </div>

        <PageSection className="hidden p-5 md:block">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <h2 className="app-section-title">Peer benchmark</h2>
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">{hasAnalytics ? "Top 18%" : "Not enough data"}</p>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                {hasAnalytics
                  ? "Engagement is outperforming comparable luxury fashion profiles with a similar audience size."
                  : "Benchmarks appear after the account reaches the platform's minimum comparison threshold."}
              </p>
            </div>
            {hasAnalytics ? <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-background p-4">
                <span className="inline-flex items-center gap-1 text-xs text-foreground">
                  <ArrowUpRight className="h-3 w-3" /> 2.1 pts
                </span>
                <p className="mt-3 text-xl font-semibold text-foreground">7.8%</p>
                <p className="text-xs text-muted-foreground">Your engagement</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowDownRight className="h-3 w-3" /> Benchmark
                </span>
                <p className="mt-3 text-xl font-semibold text-foreground">5.7%</p>
                <p className="text-xs text-muted-foreground">Peer median</p>
              </div>
            </div> : null}
          </div>
        </PageSection>
      </div>
    </PageShell>
  );
}
