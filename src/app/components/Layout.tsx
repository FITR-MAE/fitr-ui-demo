import { Outlet, NavLink } from "react-router";
import { Sparkles, Home, Bell, PlusSquare, User } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
      <main className="pb-16">
        <Outlet />
      </main>
    </div>
  );
}
