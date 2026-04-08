import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ForYou } from "./pages/ForYou";
import { Wardrobe } from "./pages/Wardrobe";
import { Post } from "./pages/Post";
import { AIStylist } from "./pages/AIStylist";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ForYou },
      { path: "wardrobe", Component: Wardrobe },
      { path: "post", Component: Post },
      { path: "stylist", Component: AIStylist },
      { path: "profile", Component: Profile },
    ],
  },
]);
