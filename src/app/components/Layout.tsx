import { useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import { Sparkles, Home, Bell, PlusSquare, User } from "lucide-react";

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
      title: "Stylist | fitr",
      description: "Get direct outfit guidance, wardrobe matches, and colour direction from your stylist.",
      themeColor: "#ffffff",
    };
  }

  if (pathname === "/profile") {
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

export function Layout() {
  const location = useLocation();
  const isFullHeightRoute = location.pathname === "/stylist";

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);

    document.title = meta.title;
    upsertMeta("description", meta.description);
    upsertMeta("theme-color", meta.themeColor);
    upsertMeta("apple-mobile-web-app-title", "fitr");
  }, [location.pathname]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <main className={isFullHeightRoute ? "min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-y-auto overscroll-y-contain"}>
        <Outlet />
      </main>
      <nav className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-around h-16 px-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `p-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Home className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `p-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Bell className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/post"
              className={({ isActive }) =>
                `p-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <PlusSquare className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/stylist"
              className={({ isActive }) =>
                `p-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Sparkles className="w-6 h-6" />
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `p-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <User className="w-6 h-6" />
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
