import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ForYou } from "./pages/ForYou";
import { Wardrobe } from "./pages/Wardrobe";
import { AIStylist } from "./pages/AIStylist";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ForYou },
      { path: "wardrobe", Component: Wardrobe },
      { path: "stylist", Component: AIStylist },
    ],
  },
]);
