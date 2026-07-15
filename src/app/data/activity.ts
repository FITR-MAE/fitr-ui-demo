import { BadgeCent, Heart, Store, type LucideIcon } from "lucide-react";

export type ActivityKind = "interactions" | "sales" | "stores";

export type ActivityRow = {
  id: string;
  kind: ActivityKind;
  icon: LucideIcon;
  title: string;
  detail: string;
  time: string;
  photo: string;
};

export const activityRows: ActivityRow[] = [
  {
    id: "interactions",
    kind: "interactions",
    icon: Heart,
    title: "New interactions",
    detail: "ModernMuse and 71 others liked your post",
    time: "4m",
    photo: "https://images.unsplash.com/photo-1726276986699-eed94c47eedc",
  },
  {
    id: "sales",
    kind: "sales",
    icon: BadgeCent,
    title: "Upcoming sales",
    detail: "Maison Margiela and 3 brands you follow have sales soon",
    time: "2h",
    photo: "https://images.unsplash.com/photo-1654653068461-7ccc719064fa",
  },
  {
    id: "stores",
    kind: "stores",
    icon: Store,
    title: "Stores near you",
    detail: "3 fashion stores within walking distance",
    time: "1d",
    photo: "https://images.unsplash.com/photo-1567401893414-76b7b1e33a76",
  },
];
