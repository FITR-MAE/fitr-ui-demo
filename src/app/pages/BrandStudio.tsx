import {
  ArrowUpRight,
  BadgePercent,
  Bell,
  Building2,
  CheckCircle2,
  FileImage,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";

import { useAccounts, type AccountRole } from "../components/AccountProvider";
import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

const kpis = [
  { label: "Reach", value: "248.6K", change: "+18.4%" },
  { label: "Profile views", value: "31.2K", change: "+12.1%" },
  { label: "Link clicks", value: "8,942", change: "+9.7%" },
  { label: "Wardrobe presence", value: "12.4K", change: "+21.6%" },
];

const roleLabels: Record<AccountRole, string> = {
  owner: "Owner",
  editor: "Editor",
};

type StatusCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  actionLabel?: string;
  to?: string;
};

function StatusCard({ icon: Icon, label, value, detail, actionLabel, to }: StatusCardProps) {
  return (
    <PageSection className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="app-chip">{label}</span>
      </div>
      <p className="mt-4 text-base font-semibold text-foreground">{value}</p>
      <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      {actionLabel && to ? (
        <Button asChild variant="ghost" className="mt-3 h-9 w-fit rounded-full px-3">
          <Link to={to}>
            {actionLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </PageSection>
  );
}

function AccessState({ isBusiness }: { isBusiness: boolean }) {
  return (
    <PageShell>
      <PageHeader title="Brand Studio" />
      <div className="app-page-content max-w-6xl">
        <PageSection className="p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {isBusiness ? (
              <LockKeyhole className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <h2 className="mt-4 app-section-title">
            {isBusiness ? "Overview access required" : "Switch to a business profile"}
          </h2>
          <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
            {isBusiness
              ? "Your current role does not include access to the business overview."
              : "Brand Studio is available when an active brand or store profile is selected."}
          </p>
        </PageSection>
      </div>
    </PageShell>
  );
}

export function BrandStudio() {
  const {
    activeAccount,
    activeRole,
    permissions,
    getMembers,
    getInvitations,
    getPromotions,
    getPosts,
  } = useAccounts();
  const isBusiness = activeAccount.type === "business";

  if (!isBusiness || !permissions.viewOverview) {
    return <AccessState isBusiness={isBusiness} />;
  }

  const members = getMembers(activeAccount.id);
  const pendingInvitations = getInvitations(activeAccount.id).filter(
    (invitation) => invitation.status === "pending",
  );
  const promotions = getPromotions(activeAccount.id);
  const accountPosts = getPosts(activeAccount.id);
  const activePromotions = promotions.filter(
    (promotion) => promotion.status === "Live" || promotion.status === "Scheduled",
  );
  const hasAnalytics = activeAccount.id === "maison" || activeAccount.id === "lncc";
  const businessType = activeAccount.businessKind === "store" ? "Store" : "Brand";

  return (
    <PageShell>
      <PageHeader
        title="Brand Studio"
        subtitle={`${activeAccount.name} | ${roleLabels[activeRole]}`}
        trailing={
          <Button asChild variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
            <Link to="/notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
        }
      />

      <div className="app-page-content max-w-6xl space-y-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
          <PageSection className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                <img
                  src={activeAccount.avatar}
                  alt={`${activeAccount.name} profile`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold text-foreground">{activeAccount.name}</h2>
                  <span className="app-chip">{businessType}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{activeAccount.handle}</p>
                {activeAccount.bio ? (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground">{activeAccount.bio}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {activeAccount.category ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      {activeAccount.category}
                    </span>
                  ) : null}
                  {activeAccount.website ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Globe2 className="h-4 w-4" />
                      {activeAccount.website}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </PageSection>

          <PageSection className="p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <h2 className="app-section-title">Active role</h2>
            </div>
            <p className="mt-4 text-2xl font-semibold text-foreground">{roleLabels[activeRole]}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {permissions.publishPromotions
                ? "You control profile settings, the team, and live promotions."
                : permissions.createContent
                  ? "You can create content, update storefront content, and prepare promotion drafts."
                  : "Your access is focused on business performance."}
            </p>
          </PageSection>
        </div>

        <PageSection className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last 28 days</p>
              <h2 className="mt-1 app-section-title">Business pulse</h2>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/brand-studio/analytics">View analytics</Link>
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(hasAnalytics
              ? kpis
              : kpis.map((kpi) => ({ ...kpi, value: "0", change: "No data" }))
            ).map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
                  <p className="text-xl font-semibold text-foreground">{kpi.value}</p>
                  <span className="text-xs font-medium text-foreground">{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        <div className="grid gap-4 md:grid-cols-3">
          <StatusCard
            icon={FileImage}
            label="Content"
            value={accountPosts.length === 0 ? "No posts yet" : `${accountPosts.length} live post${accountPosts.length === 1 ? "" : "s"}`}
            detail={accountPosts.length === 0
              ? "Publish your first post from the Create tab."
              : "Track engagement and performance from analytics."}
            actionLabel={permissions.createContent ? "Create post" : undefined}
            to={permissions.createContent ? "/post" : undefined}
          />
          <StatusCard
            icon={Store}
            label="Storefront"
            value={activeAccount.website ? "Connected" : "Setup needed"}
            detail={
              activeAccount.website
                ? `${activeAccount.website} is active as the primary destination.`
                : "Add a destination so people can continue from your profile."
            }
            actionLabel={permissions.manageStorefront ? "Manage storefront" : undefined}
            to={permissions.manageStorefront ? "/profile" : undefined}
          />
          <StatusCard
            icon={BadgePercent}
            label="Promotions"
            value={`${activePromotions.length} active`}
            detail={`${promotions.length} total promotions, including drafts and completed activity.`}
            actionLabel={permissions.draftPromotions ? "Open promotions" : undefined}
            to={permissions.draftPromotions ? "/brand-studio/promotions" : undefined}
          />
        </div>

        {permissions.manageMembers ? (
          <PageSection className="p-4">
            <Link
              to="/brand-studio/team"
              className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-muted/60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Team access</p>
                <p className="truncate text-xs text-muted-foreground">
                  {members.length} members | {pendingInvitations.length} pending invitations
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Manage
              </div>
            </Link>
          </PageSection>
        ) : null}
      </div>
    </PageShell>
  );
}
