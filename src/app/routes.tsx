import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ForYou } from "./pages/ForYou";
import { Post } from "./pages/Post";
import { Stylist } from "./pages/Stylist";
import { Profile } from "./pages/Profile";
import { SearchPage } from "./pages/Search";
import { NotificationsPage } from "./pages/Notifications";
import { ActivityDetailPage } from "./pages/ActivityDetail";
import { BrandAnalytics } from "./pages/BrandAnalytics";
import { BrandStudio } from "./pages/BrandStudio";
import { CreateBusinessAccount } from "./pages/CreateBusinessAccount";
import { Promotions } from "./pages/Promotions";
import { TeamAccess } from "./pages/TeamAccess";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ForYou },
      { path: "search", Component: SearchPage },
      { path: "post", Component: Post },
      { path: "stylist", Component: Stylist },
      { path: "profile", Component: Profile },
      { path: "notifications", Component: NotificationsPage },
      { path: "activity/:id", Component: ActivityDetailPage },
      { path: "accounts/new", Component: CreateBusinessAccount },
      { path: "brand-studio", Component: BrandStudio },
      { path: "brand-studio/analytics", Component: BrandAnalytics },
      { path: "brand-studio/promotions", Component: Promotions },
      { path: "brand-studio/team", Component: TeamAccess },
    ],
  },
]);
