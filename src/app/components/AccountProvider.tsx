import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AccountType = "personal" | "business";
export type BusinessKind = "brand" | "store";
export type AccountRole = "owner" | "editor";
export type InvitationStatus = "pending" | "revoked";
export type PromotionStatus = "Draft" | "Scheduled" | "Live" | "Ended";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type Account = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  type: AccountType;
  bio?: string;
  businessKind?: BusinessKind;
  website?: string;
  category?: string;
  address?: string;
};

export type Membership = {
  id: string;
  userId: string;
  accountId: string;
  role: AccountRole;
};

export type Invitation = {
  id: string;
  accountId: string;
  email: string;
  role: "editor";
  status: InvitationStatus;
  invitedAt: string;
};

export type Promotion = {
  id: string;
  accountId: string;
  name: string;
  offer: string;
  destination: string;
  startsAt: string;
  endsAt: string;
  status: PromotionStatus;
};

export type AccountPost = {
  id: string;
  accountId: string;
  image: string;
  caption: string;
  tags: string[];
  likes: number;
  createdAt: string;
};

export type AccountPermissions = {
  viewOverview: boolean;
  viewAnalytics: boolean;
  createContent: boolean;
  manageStorefront: boolean;
  draftPromotions: boolean;
  publishPromotions: boolean;
  manageProfile: boolean;
  manageMembers: boolean;
  manageOwnership: boolean;
};

export type AccountMember = Membership & { user: User };

type BusinessAccountInput = {
  businessKind: BusinessKind;
  name: string;
  handle: string;
  bio: string;
  website: string;
  category: string;
  address?: string;
};

type PromotionInput = Omit<Promotion, "id" | "accountId">;

type AccountState = {
  accounts: Account[];
  users: User[];
  memberships: Membership[];
  invitations: Invitation[];
  promotions: Promotion[];
  posts: AccountPost[];
  activeAccountId: string;
};

type AccountContextValue = {
  currentUser: User;
  accounts: Account[];
  activeAccountId: string;
  activeAccount: Account;
  activeMembership: Membership;
  activeRole: AccountRole;
  permissions: AccountPermissions;
  setActive: (id: string) => void;
  createBusinessAccount: (input: BusinessAccountInput) => string;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  getMembers: (accountId?: string) => AccountMember[];
  getInvitations: (accountId?: string) => Invitation[];
  inviteMember: (email: string, accountId?: string) => string;
  resendInvitation: (id: string) => void;
  revokeInvitation: (id: string) => void;
  removeMember: (membershipId: string) => void;
  getPromotions: (accountId?: string) => Promotion[];
  createPromotion: (input: PromotionInput, accountId?: string) => string;
  updatePromotionStatus: (id: string, status: PromotionStatus) => void;
  getPosts: (accountId?: string) => AccountPost[];
  createPost: (input: Pick<AccountPost, "image" | "caption" | "tags">, accountId?: string) => string;
  logout: () => void;
};

const STORAGE_KEY = "fitr-demo-account-state-v3";
const CURRENT_USER_ID = "user-sarah";

const placeholderAvatars = [
  "https://images.unsplash.com/photo-1528120369764-0423708119ae",
  "https://images.unsplash.com/photo-1659899505079-dbc449c4f9d1",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
];

const initialState: AccountState = {
  users: [
    {
      id: CURRENT_USER_ID,
      name: "Sarah Connor",
      email: "sarah@fitr.demo",
      avatar: "https://images.unsplash.com/photo-1690009996338-aebbf50a0b1e",
    },
    {
      id: "user-amelia",
      name: "Amelia Stone",
      email: "amelia@maison.demo",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
      id: "user-theo",
      name: "Theo Martin",
      email: "theo@maison.demo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      id: "user-noor",
      name: "Noor Haddad",
      email: "noor@maison.demo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    },
  ],
  accounts: [
    {
      id: "sarah",
      name: "Sarah Connor",
      handle: "@sarahconnor",
      avatar: "https://images.unsplash.com/photo-1690009996338-aebbf50a0b1e",
      type: "personal",
      bio: "Fashion enthusiast | Personal stylist | Minimal aesthetic",
    },
    {
      id: "maison",
      name: "Maison Margiela",
      handle: "@maisonmargiela",
      avatar: "https://images.unsplash.com/photo-1654653068461-7ccc719064fa",
      type: "business",
      businessKind: "brand",
      bio: "Avant-garde house - Paris",
      website: "maisonmargiela.com",
      category: "Luxury fashion",
    },
    {
      id: "lncc",
      name: "LN-CC",
      handle: "@lncc",
      avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      type: "business",
      businessKind: "store",
      bio: "A progressive retail space for fashion, music, and culture.",
      website: "ln-cc.com",
      category: "Concept store",
      address: "18 Shacklewell Lane, London E8 2EZ",
    },
  ],
  memberships: [
    { id: "member-sarah-personal", userId: CURRENT_USER_ID, accountId: "sarah", role: "owner" },
    { id: "member-sarah-maison", userId: CURRENT_USER_ID, accountId: "maison", role: "owner" },
    { id: "member-amelia-maison", userId: "user-amelia", accountId: "maison", role: "editor" },
    { id: "member-theo-maison", userId: "user-theo", accountId: "maison", role: "editor" },
    { id: "member-noor-maison", userId: "user-noor", accountId: "maison", role: "editor" },
    { id: "member-amelia-lncc", userId: "user-amelia", accountId: "lncc", role: "owner" },
    { id: "member-sarah-lncc", userId: CURRENT_USER_ID, accountId: "lncc", role: "editor" },
  ],
  invitations: [
    {
      id: "invite-jules",
      accountId: "maison",
      email: "jules@studio.demo",
      role: "editor",
      status: "pending",
      invitedAt: "2026-07-12T09:30:00.000Z",
    },
  ],
  promotions: [
    {
      id: "promo-archive",
      accountId: "maison",
      name: "Archive edit",
      offer: "Selected pieces up to 20% off",
      destination: "maisonmargiela.com/archive",
      startsAt: "2026-07-01",
      endsAt: "2026-07-31",
      status: "Live",
    },
    {
      id: "promo-tabi",
      accountId: "maison",
      name: "Tabi focus",
      offer: "Early access for fitr members",
      destination: "maisonmargiela.com/tabi",
      startsAt: "2026-08-05",
      endsAt: "2026-08-18",
      status: "Scheduled",
    },
    {
      id: "promo-newsletter",
      accountId: "maison",
      name: "Atelier notes",
      offer: "Discover the new collection",
      destination: "maisonmargiela.com/atelier",
      startsAt: "2026-09-01",
      endsAt: "2026-09-20",
      status: "Draft",
    },
  ],
  posts: [],
  activeAccountId: "sarah",
};

const emptyPermissions: AccountPermissions = {
  viewOverview: false,
  viewAnalytics: false,
  createContent: false,
  manageStorefront: false,
  draftPromotions: false,
  publishPromotions: false,
  manageProfile: false,
  manageMembers: false,
  manageOwnership: false,
};

const rolePermissions: Record<AccountRole, AccountPermissions> = {
  owner: {
    viewOverview: true,
    viewAnalytics: true,
    createContent: true,
    manageStorefront: true,
    draftPromotions: true,
    publishPromotions: true,
    manageProfile: true,
    manageMembers: true,
    manageOwnership: true,
  },
  editor: {
    viewOverview: true,
    viewAnalytics: true,
    createContent: true,
    manageStorefront: true,
    draftPromotions: true,
    publishPromotions: false,
    manageProfile: false,
    manageMembers: false,
    manageOwnership: false,
  },
};

function canAccessAccount(state: AccountState, accountId: string) {
  return state.memberships.some(
    (membership) => membership.userId === CURRENT_USER_ID && membership.accountId === accountId,
  );
}

function canUsePermission(state: AccountState, accountId: string, permission: keyof AccountPermissions) {
  const account = state.accounts.find((item) => item.id === accountId);
  const membership = state.memberships.find(
    (item) => item.userId === CURRENT_USER_ID && item.accountId === accountId,
  );
  if (!account || !membership || account.type !== "business") return false;
  return rolePermissions[membership.role][permission];
}

function loadState(): AccountState {
  if (typeof window === "undefined") return initialState;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    const parsed = JSON.parse(saved) as AccountState;
    const memberships = parsed.memberships.map((membership) => ({
      ...membership,
      role: membership.role === "owner" ? "owner" : "editor",
    }));
    const invitations = parsed.invitations.map((invitation) => ({
      ...invitation,
      role: "editor" as const,
      status: invitation.status === "pending" ? "pending" : "revoked",
    }));
    const hasActiveMembership = parsed.memberships.some(
      (membership) =>
        membership.userId === CURRENT_USER_ID && membership.accountId === parsed.activeAccountId,
    );
    const normalized = { ...parsed, memberships, invitations };
    return hasActiveMembership ? normalized : { ...normalized, activeAccountId: "sarah" };
  } catch {
    return initialState;
  }
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeHandle(handle: string) {
  const value = handle.trim().replace(/^@/, "").replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
  return `@${value}`;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccountState>(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentUser = state.users.find((user) => user.id === CURRENT_USER_ID) ?? state.users[0];
  const linkedAccountIds = useMemo(
    () => new Set(state.memberships.filter((item) => item.userId === currentUser.id).map((item) => item.accountId)),
    [currentUser.id, state.memberships],
  );
  const accounts = useMemo(
    () => state.accounts.filter((account) => linkedAccountIds.has(account.id)),
    [linkedAccountIds, state.accounts],
  );
  const activeAccount =
    accounts.find((account) => account.id === state.activeAccountId) ?? accounts[0] ?? initialState.accounts[0];
  const activeMembership =
    state.memberships.find(
      (membership) => membership.userId === currentUser.id && membership.accountId === activeAccount.id,
    ) ?? initialState.memberships[0];
  const activeRole = activeMembership.role;
  const permissions = activeAccount.type === "business" ? rolePermissions[activeRole] : emptyPermissions;

  const setActive = useCallback(
    (id: string) => {
      setState((current) => {
        return canAccessAccount(current, id) ? { ...current, activeAccountId: id } : current;
      });
    },
    [],
  );

  const createBusinessAccount = useCallback((input: BusinessAccountInput) => {
    const id = makeId(input.businessKind);
    setState((current) => {
      const avatar = placeholderAvatars[current.accounts.length % placeholderAvatars.length];
      const account: Account = {
        id,
        name: input.name.trim(),
        handle: normalizeHandle(input.handle),
        avatar,
        type: "business",
        businessKind: input.businessKind,
        bio: input.bio.trim(),
        website: input.website.trim(),
        category: input.category.trim(),
        address: input.businessKind === "store" ? input.address?.trim() : undefined,
      };
      const membership: Membership = {
        id: makeId("member"),
        userId: CURRENT_USER_ID,
        accountId: id,
        role: "owner",
      };
      return {
        ...current,
        accounts: [...current.accounts, account],
        memberships: [...current.memberships, membership],
        activeAccountId: id,
      };
    });
    return id;
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    setState((current) => {
      if (!canUsePermission(current, id, "manageProfile")) return current;
      return {
        ...current,
        accounts: current.accounts.map((account) => (account.id === id ? { ...account, ...updates } : account)),
      };
    });
  }, []);

  const getMembers = useCallback(
    (accountId = activeAccount.id) =>
      state.memberships
        .filter((membership) => membership.accountId === accountId)
        .map((membership) => ({
          ...membership,
          user: state.users.find((user) => user.id === membership.userId) ?? currentUser,
        })),
    [activeAccount.id, currentUser, state.memberships, state.users],
  );

  const getInvitations = useCallback(
    (accountId = activeAccount.id) => state.invitations.filter((invite) => invite.accountId === accountId),
    [activeAccount.id, state.invitations],
  );

  const inviteMember = useCallback(
    (email: string, accountId = activeAccount.id) => {
      const id = makeId("invite");
      setState((current) => {
        if (!canUsePermission(current, accountId, "manageMembers")) return current;
        return {
          ...current,
          invitations: [
            ...current.invitations,
            {
              id,
              accountId,
              email: email.trim().toLowerCase(),
              role: "editor",
              status: "pending",
              invitedAt: new Date().toISOString(),
            },
          ],
        };
      });
      return id;
    },
    [activeAccount.id],
  );

  const updateInvitation = useCallback((id: string, status: InvitationStatus) => {
    setState((current) => {
      const invitation = current.invitations.find((item) => item.id === id);
      if (!invitation || !canUsePermission(current, invitation.accountId, "manageMembers")) return current;
      return {
        ...current,
        invitations: current.invitations.map((invite) => (invite.id === id ? { ...invite, status } : invite)),
      };
    });
  }, []);

  const revokeInvitation = useCallback((id: string) => updateInvitation(id, "revoked"), [updateInvitation]);

  const resendInvitation = useCallback((id: string) => {
    setState((current) => {
      const invitation = current.invitations.find((item) => item.id === id);
      if (!invitation || !canUsePermission(current, invitation.accountId, "manageMembers")) return current;
      return {
        ...current,
        invitations: current.invitations.map((invite) =>
          invite.id === id ? { ...invite, status: "pending", invitedAt: new Date().toISOString() } : invite,
        ),
      };
    });
  }, []);

  const removeMember = useCallback((membershipId: string) => {
    setState((current) => {
      const target = current.memberships.find((membership) => membership.id === membershipId);
      if (!target || !canUsePermission(current, target.accountId, "manageMembers")) return current;
      return {
        ...current,
        memberships: current.memberships.filter(
          (membership) => membership.id !== membershipId || membership.role === "owner",
        ),
      };
    });
  }, []);

  const getPromotions = useCallback(
    (accountId = activeAccount.id) => state.promotions.filter((promotion) => promotion.accountId === accountId),
    [activeAccount.id, state.promotions],
  );

  const createPromotion = useCallback(
    (input: PromotionInput, accountId = activeAccount.id) => {
      const id = makeId("promo");
      setState((current) =>
        canUsePermission(current, accountId, "draftPromotions")
          ? { ...current, promotions: [...current.promotions, { ...input, id, accountId }] }
          : current,
      );
      return id;
    },
    [activeAccount.id],
  );

  const updatePromotionStatus = useCallback((id: string, status: PromotionStatus) => {
    setState((current) => {
      const promotion = current.promotions.find((item) => item.id === id);
      if (!promotion || !canUsePermission(current, promotion.accountId, "publishPromotions")) return current;
      return {
        ...current,
        promotions: current.promotions.map((item) => (item.id === id ? { ...item, status } : item)),
      };
    });
  }, []);

  const getPosts = useCallback(
    (accountId = activeAccount.id) =>
      state.posts
        .filter((post) => post.accountId === accountId)
        .sort((first, second) => second.createdAt.localeCompare(first.createdAt)),
    [activeAccount.id, state.posts],
  );

  const createPost = useCallback(
    (input: Pick<AccountPost, "image" | "caption" | "tags">, accountId = activeAccount.id) => {
      const id = makeId("post");
      setState((current) => {
        const account = current.accounts.find((item) => item.id === accountId);
        const canCreate =
          account?.type === "personal"
            ? canAccessAccount(current, accountId)
            : canUsePermission(current, accountId, "createContent");
        if (!canCreate) return current;
        return {
          ...current,
          posts: [
            ...current.posts,
            {
              ...input,
              id,
              accountId,
              likes: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      });
      return id;
    },
    [activeAccount.id],
  );

  const logout = useCallback(() => {
    setState((current) => ({ ...current, activeAccountId: "sarah" }));
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({
      currentUser,
      accounts,
      activeAccountId: activeAccount.id,
      activeAccount,
      activeMembership,
      activeRole,
      permissions,
      setActive,
      createBusinessAccount,
      updateAccount,
      getMembers,
      getInvitations,
      inviteMember,
      resendInvitation,
      revokeInvitation,
      removeMember,
      getPromotions,
      createPromotion,
      updatePromotionStatus,
      getPosts,
      createPost,
      logout,
    }),
    [
      accounts,
      activeAccount,
      activeMembership,
      activeRole,
      createBusinessAccount,
      createPromotion,
      createPost,
      currentUser,
      getInvitations,
      getMembers,
      getPromotions,
      getPosts,
      inviteMember,
      permissions,
      removeMember,
      resendInvitation,
      revokeInvitation,
      setActive,
      updateAccount,
      updatePromotionStatus,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccounts() {
  const context = useContext(AccountContext);
  if (!context) throw new Error("useAccounts must be used within <AccountProvider>");
  return context;
}
