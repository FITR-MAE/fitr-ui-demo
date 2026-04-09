import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ForYou } from "./pages/ForYou";
import { Post } from "./pages/Post";
import { Stylist } from "./pages/Stylist";
import { Profile } from "./pages/Profile";
import { SearchPage } from "./pages/Search";
import { NotificationsPage } from "./pages/Notifications";

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
    ],
  },
]);
