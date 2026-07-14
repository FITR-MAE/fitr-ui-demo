import { useState, type FormEvent } from "react";
import {
  Check,
  Clock3,
  LockKeyhole,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAccounts,
  type AccountRole,
  type Invitation,
  type InvitationStatus,
  type InviteRole,
} from "../components/AccountProvider";
import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { cn } from "../components/ui/utils";

const roleLabels: Record<AccountRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  analyst: "Analyst",
};

const inviteRoles: InviteRole[] = ["admin", "editor", "analyst"];

const statusTone: Record<InvitationStatus, string> = {
  pending: "bg-accent text-accent-foreground",
  accepted: "bg-foreground text-background",
  declined: "bg-muted text-muted-foreground",
  revoked: "bg-muted text-muted-foreground",
  expired: "border border-border bg-background text-muted-foreground",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function AccessState({ isBusiness }: { isBusiness: boolean }) {
  return (
    <PageShell>
      <PageHeader title="Team Access" />
      <div className="app-page-content max-w-6xl">
        <PageSection className="p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {isBusiness ? (
              <LockKeyhole className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Users className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <h2 className="mt-4 app-section-title">
            {isBusiness ? "Team management access required" : "Switch to a business profile"}
          </h2>
          <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
            {isBusiness
              ? "Only owners and admins can invite collaborators or change member access."
              : "Team access is available for active brand and store profiles."}
          </p>
        </PageSection>
      </div>
    </PageShell>
  );
}

export function TeamAccess() {
  const {
    currentUser,
    activeAccount,
    activeRole,
    permissions,
    getMembers,
    getInvitations,
    inviteMember,
    acceptInvitation,
    declineInvitation,
    resendInvitation,
    revokeInvitation,
    updateMemberRole,
    removeMember,
  } = useAccounts();
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRole>("editor");
  const [inviteError, setInviteError] = useState("");
  const isBusiness = activeAccount.type === "business";

  if (!isBusiness || !permissions.manageMembers) {
    return <AccessState isBusiness={isBusiness} />;
  }

  const members = getMembers(activeAccount.id);
  const invitations = [...getInvitations(activeAccount.id)].reverse();
  const pendingCount = invitations.filter((invitation) => invitation.status === "pending").length;
  const ownerCount = members.filter((member) => member.role === "owner").length;

  const handleInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setInviteError("Enter a valid email address.");
      return;
    }

    const alreadyMember = members.some((member) => member.user.email.toLowerCase() === normalizedEmail);
    const alreadyPending = invitations.some(
      (invitation) => invitation.email === normalizedEmail && invitation.status === "pending",
    );

    if (alreadyMember || alreadyPending) {
      setInviteError(alreadyMember ? "This person is already a member." : "An invitation is already pending.");
      return;
    }

    inviteMember(normalizedEmail, inviteRole, activeAccount.id);
    setEmail("");
    setInviteRole("editor");
    setInviteError("");
    toast("Invitation sent", { description: `${normalizedEmail} was invited as ${roleLabels[inviteRole]}.` });
  };

  const handleMemberRole = (membershipId: string, role: InviteRole, name: string) => {
    updateMemberRole(membershipId, role);
    toast("Role updated", { description: `${name} is now an ${role === "admin" ? "admin" : role}.` });
  };

  const handleRemoveMember = (membershipId: string, name: string) => {
    removeMember(membershipId);
    toast("Member removed", { description: `${name} no longer has access to ${activeAccount.name}.` });
  };

  const handleInvitationAction = (
    invitation: Invitation,
    action: "accept" | "decline" | "resend" | "revoke",
  ) => {
    if (action === "accept") acceptInvitation(invitation.id);
    if (action === "decline") declineInvitation(invitation.id);
    if (action === "resend") resendInvitation(invitation.id);
    if (action === "revoke") revokeInvitation(invitation.id);

    const messages = {
      accept: ["Invitation accepted", `${invitation.email} is now a team member.`],
      decline: ["Invitation declined", `${invitation.email} declined the invitation.`],
      resend: ["Invitation resent", `A new invitation was sent to ${invitation.email}.`],
      revoke: ["Invitation revoked", `${invitation.email} can no longer use this invitation.`],
    } as const;
    toast(messages[action][0], { description: messages[action][1] });
  };

  return (
    <PageShell>
      <PageHeader title="Team Access" subtitle={`${activeAccount.name} | ${roleLabels[activeRole]}`} />
      <div className="app-page-content max-w-6xl space-y-4">
        <PageSection className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Access summary</p>
              <h2 className="mt-1 app-section-title">Your team</h2>
            </div>
            <span className="app-chip">{roleLabels[activeRole]}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-xl font-semibold text-foreground">{members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-xl font-semibold text-foreground">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <p className="mt-3 text-xl font-semibold text-foreground">{ownerCount}</p>
              <p className="text-xs text-muted-foreground">Owners</p>
            </div>
          </div>
        </PageSection>

        <PageSection className="p-5 md:hidden">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <h2 className="app-section-title">Manage team on desktop</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Mobile shows team status only. Open Brand Studio on a larger screen to invite people or change access.
              </p>
            </div>
          </div>
        </PageSection>

        <div className="hidden gap-4 md:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="space-y-4">
            <PageSection className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h2 className="app-section-title">Members</h2>
                </div>
                <span className="text-xs text-muted-foreground">{members.length} active</span>
              </div>

              <div className="space-y-2">
                {members.map((member) => {
                  const isOwner = member.role === "owner";
                  const isCurrentUser = member.userId === currentUser.id;

                  return (
                    <div
                      key={member.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                          <img src={member.user.avatar} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">{member.user.name}</p>
                            {isCurrentUser ? <span className="app-chip">You</span> : null}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>

                      {isOwner ? (
                        <div className="flex items-center gap-2 self-end text-xs text-muted-foreground sm:self-auto">
                          <ShieldCheck className="h-4 w-4" />
                          Owner protected
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Select
                            value={member.role}
                            onValueChange={(value) =>
                              handleMemberRole(member.id, value as InviteRole, member.user.name)
                            }
                          >
                            <SelectTrigger className="w-28" aria-label={`Role for ${member.user.name}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {inviteRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {roleLabels[role]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-destructive hover:text-destructive"
                            onClick={() => handleRemoveMember(member.id, member.user.name)}
                            aria-label={`Remove ${member.user.name}`}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </PageSection>

            <PageSection className="p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <h2 className="app-section-title">Invitations</h2>
                    <p className="text-xs text-muted-foreground">Use response actions to exercise the demo lifecycle.</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{invitations.length} total</span>
              </div>

              {invitations.length ? (
                <div className="space-y-2">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="rounded-2xl border border-border bg-background p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{invitation.email}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {roleLabels[invitation.role]} | Sent {formatDate(invitation.invitedAt)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]",
                            statusTone[invitation.status],
                          )}
                        >
                          {invitation.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-border pt-3">
                        {invitation.status === "pending" ? (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="rounded-full"
                              onClick={() => handleInvitationAction(invitation, "resend")}
                            >
                              <RefreshCw className="h-4 w-4" />
                              Resend
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              onClick={() => handleInvitationAction(invitation, "accept")}
                            >
                              <Check className="h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="rounded-full"
                              onClick={() => handleInvitationAction(invitation, "decline")}
                            >
                              <X className="h-4 w-4" />
                              Decline
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-destructive hover:text-destructive"
                              onClick={() => handleInvitationAction(invitation, "revoke")}
                            >
                              <Trash2 className="h-4 w-4" />
                              Revoke
                            </Button>
                          </>
                        ) : invitation.status !== "accepted" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleInvitationAction(invitation, "resend")}
                          >
                            <RefreshCw className="h-4 w-4" />
                            Resend
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-5 text-center">
                  <p className="text-sm font-medium text-foreground">No invitation history</p>
                  <p className="mt-1 text-xs text-muted-foreground">New invitations will appear here.</p>
                </div>
              )}
            </PageSection>
          </div>

          <PageSection className="p-5 lg:sticky lg:top-20">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-muted-foreground" />
              <h2 className="app-section-title">Invite collaborator</h2>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Choose the smallest role that gives the collaborator the access they need.
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleInvite}>
              <div className="space-y-1.5">
                <label htmlFor="invite-email" className="text-xs font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (inviteError) setInviteError("");
                  }}
                  placeholder="name@studio.com"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="invite-role" className="text-xs font-medium text-foreground">
                  Role
                </label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as InviteRole)}>
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {inviteRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl bg-muted p-3 text-xs leading-5 text-muted-foreground">
                {inviteRole === "admin"
                  ? "Admins can manage the profile, storefront, promotions, and team."
                  : inviteRole === "editor"
                    ? "Editors can publish content, manage the storefront, and prepare drafts."
                    : "Analysts can view the overview and analytics without editing access."}
              </div>
              {inviteError ? <p className="text-xs text-destructive">{inviteError}</p> : null}
              <Button type="submit" className="h-11 w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                <Send className="h-4 w-4" />
                Send invitation
              </Button>
            </form>
          </PageSection>
        </div>
      </div>
    </PageShell>
  );
}
