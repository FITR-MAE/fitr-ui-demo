import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AccountType = "personal" | "business";

export type Account = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  type: AccountType;
  bio?: string;
};

const initialAccounts: Account[] = [
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
    bio: "Avant-garde house — Paris",
  },
];

type AccountContextValue = {
  accounts: Account[];
  activeAccountId: string;
  activeAccount: Account;
  setActive: (id: string) => void;
  addAccount: (account?: Partial<Account>) => string;
  logout: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

const placeholderAvatars = [
  "https://images.unsplash.com/photo-1528120369764-0423708119ae",
  "https://images.unsplash.com/photo-1659899505079-dbc449c4f9d1",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
];

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [activeAccountId, setActiveAccountId] = useState<string>(initialAccounts[0].id);

  const setActive = useCallback((id: string) => {
    setActiveAccountId(id);
  }, []);

  const addAccount = useCallback((account?: Partial<Account>) => {
    const id = account?.id ?? `account-${Date.now()}`;
    const type = account?.type ?? "personal";
    const idx = Math.floor(Math.random() * placeholderAvatars.length);
    const next: Account = {
      id,
      name: account?.name ?? "New account",
      handle: account?.handle ?? `@${id}`,
      avatar: account?.avatar ?? placeholderAvatars[idx],
      type,
      bio: account?.bio,
    };
    setAccounts((prev) => [...prev, next]);
    setActiveAccountId(id);
    return id;
  }, []);

  const logout = useCallback(() => {
    setActiveAccountId(initialAccounts[0].id);
  }, []);

  const activeAccount = useMemo(
    () => accounts.find((a) => a.id === activeAccountId) ?? accounts[0],
    [accounts, activeAccountId],
  );

  const value = useMemo<AccountContextValue>(
    () => ({ accounts, activeAccountId, activeAccount, setActive, addAccount, logout }),
    [accounts, activeAccountId, activeAccount, setActive, addAccount, logout],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccounts() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccounts must be used within <AccountProvider>");
  return ctx;
}