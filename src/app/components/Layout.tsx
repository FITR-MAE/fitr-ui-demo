import { Outlet, NavLink } from "react-router";
import { Sparkles, Home, Shirt, PlusSquare, User } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-around h-16 px-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </NavLink>
            <NavLink
              to="/wardrobe"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Shirt className="w-6 h-6" />
              <span className="text-xs">Wardrobe</span>
            </NavLink>
            <NavLink
              to="/post"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <PlusSquare className="w-6 h-6" />
              <span className="text-xs">Post</span>
            </NavLink>
            <NavLink
              to="/stylist"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs">Stylist</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
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
