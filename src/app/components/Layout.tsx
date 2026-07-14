import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { BadgePercent, BarChart3, Bell, Home, LayoutDashboard, PlusSquare, Sparkles, User, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import { AccountSwitcher } from "./AccountSwitcher";
import { useAccounts, type AccountPermissions } from "./AccountProvider";
import { usePressFeedback } from "./motion";
import { cn } from "./ui/utils";

type RouteMeta = {
  title: string;
  description: string;
  themeColor: string;
};

const defaultRouteMeta: RouteMeta = {
  title: "fitr",
  description: "Fashion discovery, outfit inspiration, and personal styling.",
  themeColor: "#ffffff",
};

function getRouteMeta(pathname: string): RouteMeta {
  if (pathname === "/") {
    return {
      title: "For You | fitr",
      description: "Browse outfit inspiration and discover looks tailored to your feed.",
      themeColor: "#111111",
    };
  }

  if (pathname === "/search") {
    return {
      title: "Search | fitr",
      description: "Search posts, people, clothes, brands, and stores in one place.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/post") {
    return {
      title: "Create Post | fitr",
      description: "Share a new outfit, image, or styling update with your profile and feed.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/stylist") {
    return {
      title: "Studio | fitr",
      description: "Open Studio for SŌEN, daily fits, style DNA, and orbit-based recommendations.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    return {
      title: "Profile | fitr",
      description: "Review your posts, saved looks, and profile activity.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/notifications") {
    return {
      title: "Notifications | fitr",
      description: "Catch up on likes, comments, follows, and recent activity.",
      themeColor: "#ffffff",
    };
  }

  if (pathname.startsWith("/activity/")) {
    return {
      title: "Activity Detail | fitr",
      description: "Open a specific activity update and review the related post or response.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/accounts/new") {
    return {
      title: "Create Business Profile | fitr",
      description: "Create a brand or store profile and invite collaborators.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/brand-studio/analytics") {
    return {
      title: "Brand Analytics | fitr",
      description: "Review audience, content, wardrobe, and link performance.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/brand-studio/promotions") {
    return {
      title: "Promotions | fitr",
      description: "Create and schedule promotions for your business profile.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/brand-studio/team") {
    return {
      title: "Team Access | fitr",
      description: "Invite collaborators and manage business account access.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/brand-studio") {
    return {
      title: "Brand Studio | fitr",
      description: "Manage your business profile, content, Storefront, and team.",
      themeColor: "#ffffff",
    };
  }

  return defaultRouteMeta;
}

function upsertMeta(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

const LONG_PRESS_MS = 450;
const LONG_PRESS_MOVE_TOLERANCE = 10;

type NavigationItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  permission?: keyof AccountPermissions;
  end?: boolean;
};

const personalNavigation: NavigationItem[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/post", label: "Create", icon: PlusSquare },
  { to: "/stylist", label: "Studio", icon: Sparkles },
];

const businessNavigation: NavigationItem[] = [
  { to: "/brand-studio", label: "Overview", icon: LayoutDashboard, permission: "viewOverview", end: true },
  { to: "/brand-studio/analytics", label: "Analytics", icon: BarChart3, permission: "viewAnalytics" },
  { to: "/post", label: "Create", icon: PlusSquare, permission: "createContent" },
  { to: "/brand-studio/promotions", label: "Promotions", icon: BadgePercent, permission: "draftPromotions" },
];

export function Layout() {
  const location = useLocation();
  const isFullHeightRoute = location.pathname === "/stylist";
  const navigate = useNavigate();
  const { activeAccount, permissions } = useAccounts();
  const isBusiness = activeAccount.type === "business";
  const navigationItems = (isBusiness ? businessNavigation : personalNavigation).filter(
    (item) => !item.permission || permissions[item.permission],
  );
  const profileTap = usePressFeedback(0.9);

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const pressTimer = useRef<number | null>(null);
  const didLongPress = useRef(false);
  const pressOrigin = useRef<{ x: number; y: number } | null>(null);

  const clearPressTimer = () => {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    didLongPress.current = false;
    pressOrigin.current = { x: event.clientX, y: event.clientY };
    pressTimer.current = window.setTimeout(() => {
      didLongPress.current = true;
      setSwitcherOpen(true);
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = () => {
    clearPressTimer();
    pressOrigin.current = null;
  };

  const handlePointerLeave = () => {
    clearPressTimer();
    pressOrigin.current = null;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!pressOrigin.current) return;
    const movedX = Math.abs(event.clientX - pressOrigin.current.x);
    const movedY = Math.abs(event.clientY - pressOrigin.current.y);
    if (movedX > LONG_PRESS_MOVE_TOLERANCE || movedY > LONG_PRESS_MOVE_TOLERANCE) {
      clearPressTimer();
      pressOrigin.current = null;
    }
  };

  const handleTriggerClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    navigate("/profile");
  };

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);

    document.title = meta.title;
    upsertMeta("description", meta.description);
    upsertMeta("theme-color", meta.themeColor);
    upsertMeta("apple-mobile-web-app-title", "fitr");
  }, [location.pathname]);

  useEffect(() => clearPressTimer, []);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <main className={isFullHeightRoute ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto overscroll-y-contain"}>
        <Outlet />
      </main>
      <nav className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-around h-16 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  aria-label={item.label}
                  title={item.label}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-[44px] min-w-[44px] items-center justify-center p-3 transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )
                  }
                >
                  <Icon className="h-6 w-6" />
                </NavLink>
              );
            })}
            <motion.button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerUp}
              onPointerMove={handlePointerMove}
              onContextMenu={(event) => event.preventDefault()}
              onClick={handleTriggerClick}
              {...profileTap}
              aria-label="Profile - press and hold to switch accounts"
              className={cn(
                "p-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer",
                location.pathname === "/profile" || location.pathname.startsWith("/profile/")
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
              style={{ touchAction: "manipulation" }}
            >
              <User className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </nav>

      <AccountSwitcher open={switcherOpen} onOpenChange={setSwitcherOpen} />
    </div>
  );
}
