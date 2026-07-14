import { useState, type FormEvent } from "react";
import {
  BadgePercent,
  CalendarDays,
  CirclePause,
  Clock3,
  ExternalLink,
  FilePenLine,
  LockKeyhole,
  Play,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAccounts,
  type Promotion,
  type PromotionStatus,
} from "../components/AccountProvider";
import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../components/ui/utils";

type PromotionForm = Pick<Promotion, "name" | "offer" | "destination" | "startsAt" | "endsAt">;

const emptyForm: PromotionForm = {
  name: "",
  offer: "",
  destination: "",
  startsAt: "",
  endsAt: "",
};

const statusTone: Record<PromotionStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Scheduled: "bg-accent text-accent-foreground",
  Live: "bg-foreground text-background",
  Ended: "border border-border bg-background text-muted-foreground",
};

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function AccessState({ isBusiness }: { isBusiness: boolean }) {
  return (
    <PageShell>
      <PageHeader title="Promotions" />
      <div className="app-page-content max-w-6xl">
        <PageSection className="p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {isBusiness ? (
              <LockKeyhole className="h-5 w-5 text-muted-foreground" />
            ) : (
              <BadgePercent className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <h2 className="mt-4 app-section-title">
            {isBusiness ? "Promotion access required" : "Switch to a business profile"}
          </h2>
          <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
            {isBusiness
              ? "Your current role does not include permission to prepare promotions."
              : "Promotion status and planning are available for active brand and store profiles."}
          </p>
        </PageSection>
      </div>
    </PageShell>
  );
}

export function Promotions() {
  const {
    activeAccount,
    activeRole,
    permissions,
    getPromotions,
    createPromotion,
    updatePromotionStatus,
  } = useAccounts();
  const [form, setForm] = useState<PromotionForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const isBusiness = activeAccount.type === "business";

  if (!isBusiness || !permissions.draftPromotions) {
    return <AccessState isBusiness={isBusiness} />;
  }

  const promotions = getPromotions(activeAccount.id);
  const liveCount = promotions.filter((promotion) => promotion.status === "Live").length;
  const scheduledCount = promotions.filter((promotion) => promotion.status === "Scheduled").length;
  const draftCount = promotions.filter((promotion) => promotion.status === "Draft").length;
  const endedCount = promotions.filter((promotion) => promotion.status === "Ended").length;

  const updateField = (field: keyof PromotionForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (formError) setFormError("");
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.values(form).map((value) => value.trim());

    if (values.some((value) => !value)) {
      setFormError("Complete every field before saving the draft.");
      return;
    }

    if (form.startsAt > form.endsAt) {
      setFormError("The end date must be on or after the start date.");
      return;
    }

    createPromotion(
      {
        name: form.name.trim(),
        offer: form.offer.trim(),
        destination: form.destination.trim(),
        startsAt: form.startsAt,
        endsAt: form.endsAt,
        status: "Draft",
      },
      activeAccount.id,
    );
    setForm(emptyForm);
    setFormError("");
    toast("Draft created", { description: `${form.name.trim()} is ready for review.` });
  };

  const handleStatusChange = (promotion: Promotion, action: "publish" | "pause" | "end" | "resume" | "schedule") => {
    if (!permissions.publishPromotions) return;
    const transitions: Record<typeof action, PromotionStatus> = {
      publish: "Live",
      pause: "Draft",
      end: "Ended",
      resume: "Draft",
      schedule: "Scheduled",
    };
    const nextStatus = transitions[action];
    updatePromotionStatus(promotion.id, nextStatus);
    const messages: Record<typeof action, [string, string]> = {
      publish: ["Promotion published", `${promotion.name} is now live.`],
      pause: ["Promotion paused", `${promotion.name} was moved back to Draft.`],
      end: ["Promotion ended", `${promotion.name} is no longer active.`],
      resume: ["Promotion reopened", `${promotion.name} was moved back to Draft.`],
      schedule: ["Promotion scheduled", `${promotion.name} is scheduled.`],
    };
    toast(messages[action][0], { description: messages[action][1] });
  };

  type ActionDef = { label: string; action: "publish" | "pause" | "end" | "resume" | "schedule"; variant: "default" | "outline"; icon: typeof Play };

  const actionsFor = (status: PromotionStatus): ActionDef[] => {
    if (status === "Draft") return [{ label: "Publish", action: "publish", variant: "default", icon: Play }];
    if (status === "Live") return [{ label: "Pause", action: "pause", variant: "outline", icon: CirclePause }, { label: "End", action: "end", variant: "outline", icon: CirclePause }];
    if (status === "Scheduled") return [{ label: "Publish now", action: "publish", variant: "default", icon: Play }];
    return [{ label: "Reopen", action: "resume", variant: "outline", icon: FilePenLine }];
  };

  return (
    <PageShell>
      <PageHeader title="Promotions" subtitle={`${activeAccount.name} | ${activeRole}`} />
      <div className="app-page-content max-w-6xl space-y-4">
        <PageSection className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">At a glance</p>
              <h2 className="mt-1 app-section-title">Promotion status</h2>
            </div>
            <span className="app-chip">{promotions.length} total</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <Play className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-xl font-semibold text-foreground">{liveCount}</p>
              <p className="text-xs text-muted-foreground">Live</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-xl font-semibold text-foreground">{scheduledCount}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <FilePenLine className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-xl font-semibold text-foreground">{draftCount}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <CirclePause className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-xl font-semibold text-foreground">{endedCount}</p>
              <p className="text-xs text-muted-foreground">Ended</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground md:hidden">
            Open Brand Studio on a larger screen to create and manage detailed promotion drafts.
          </p>
        </PageSection>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_22rem] md:items-start">
          <PageSection className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <h2 className="app-section-title">Current activity</h2>
              </div>
              <span className="text-xs text-muted-foreground">Newest first</span>
            </div>

            {promotions.length ? (
              <div className="space-y-3">
                {[...promotions].reverse().map((promotion) => (
                  <div key={promotion.id} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{promotion.name}</h3>
                          <span
                            className={cn(
                              "inline-flex rounded-md px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]",
                              statusTone[promotion.status],
                            )}
                          >
                            {promotion.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-foreground">{promotion.offer}</p>
                      </div>
                      {permissions.publishPromotions ? (
                        <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
                          {actionsFor(promotion.status).map((actionDef) => {
                            const ActionIcon = actionDef.icon;
                            return (
                              <Button
                                key={actionDef.label}
                                type="button"
                                variant={actionDef.variant}
                                size="sm"
                                className="rounded-full"
                                onClick={() => handleStatusChange(promotion, actionDef.action)}
                              >
                                <ActionIcon className="h-4 w-4" />
                                {actionDef.label}
                              </Button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-2 border-t border-border pt-3 text-xs text-muted-foreground sm:grid-cols-2">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(promotion.startsAt)} - {formatDate(promotion.endsAt)}
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-1.5 sm:justify-end">
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        <span className="truncate">{promotion.destination}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 text-center">
                <p className="text-sm font-medium text-foreground">No promotions yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Create a draft to begin planning.</p>
              </div>
            )}
          </PageSection>

          <PageSection className="hidden p-5 md:block">
            <div className="flex items-center gap-2">
              <FilePenLine className="h-4 w-4 text-muted-foreground" />
              <h2 className="app-section-title">Create draft</h2>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {permissions.publishPromotions
                ? "Save the details now, then publish when the promotion is ready."
                : "Editors can prepare drafts for an owner or admin to publish."}
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleCreate}>
              <div className="space-y-1.5">
                <label htmlFor="promotion-name" className="text-xs font-medium text-foreground">
                  Name
                </label>
                <Input
                  id="promotion-name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Summer archive"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="promotion-offer" className="text-xs font-medium text-foreground">
                  Offer
                </label>
                <Input
                  id="promotion-offer"
                  value={form.offer}
                  onChange={(event) => updateField("offer", event.target.value)}
                  placeholder="Selected pieces up to 20% off"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="promotion-destination" className="text-xs font-medium text-foreground">
                  Destination
                </label>
                <Input
                  id="promotion-destination"
                  value={form.destination}
                  onChange={(event) => updateField("destination", event.target.value)}
                  placeholder="example.com/archive"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label htmlFor="promotion-start" className="text-xs font-medium text-foreground">
                    Starts
                  </label>
                  <Input
                    id="promotion-start"
                    type="date"
                    value={form.startsAt}
                    onChange={(event) => updateField("startsAt", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="promotion-end" className="text-xs font-medium text-foreground">
                    Ends
                  </label>
                  <Input
                    id="promotion-end"
                    type="date"
                    value={form.endsAt}
                    onChange={(event) => updateField("endsAt", event.target.value)}
                  />
                </div>
              </div>
              {formError ? <p className="text-xs text-destructive">{formError}</p> : null}
              <Button type="submit" className="h-11 w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                Save draft
              </Button>
            </form>
          </PageSection>
        </div>
      </div>
    </PageShell>
  );
}
