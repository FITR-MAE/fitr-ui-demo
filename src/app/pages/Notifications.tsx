import { BadgeCent, ChevronRight, Heart, Store } from "lucide-react";

import { Link } from "react-router";

import { PageHeader, PageSection, PageShell } from "../components/Page";

const activityItem = {
  subtype: "comment" as const,
  user: "ModernMuse",
  avatar: "M",
  time: "4m",
  preview: "Love this outfit!",
};

const avatarPhotos = [
  "https://images.unsplash.com/photo-1654653068461-7ccc719064fa",
  "https://images.unsplash.com/photo-1650262697292-c01496d8aeb7",
  "https://images.unsplash.com/photo-1726276986699-eed94c47eedc",
  "https://images.unsplash.com/photo-1690009996338-aebbf50a0b1e",
  "https://images.unsplash.com/photo-1708607728910-b00e0c1be0af",
  "https://images.unsplash.com/photo-1525614686090-7a3108e3758e",
  "https://images.unsplash.com/photo-1621784562877-e971f1f79f47",
  "https://images.unsplash.com/photo-1621525260134-2da456e33a8d",
  "https://images.unsplash.com/photo-1612651611644-de1c1d8640ba",
  "https://images.unsplash.com/photo-1613477757159-7fbb73011611",
  "https://images.unsplash.com/photo-1633988584497-12ae2f1a0c24",
];

const messages = [
  {
    id: 3,
    user: "UrbanChic",
    avatar: "U",
    time: "7m",
    message: "Love your style! Would you be interested in a collab?",
    unread: true,
    photo: avatarPhotos[0],
  },
  {
    id: 5,
    user: "StyleIcon",
    avatar: "S",
    time: "15m",
    message: "Thanks for the follow! Check out my latest post.",
    unread: true,
    photo: avatarPhotos[1],
  },
  {
    id: 8,
    user: "ModernMuse",
    avatar: "M",
    time: "3h",
    message: "The jacket is from Zara, here is the link...",
    unread: false,
    photo: avatarPhotos[2],
  },
  {
    id: 10,
    user: "SunsetStyle",
    avatar: "S",
    time: "5h",
    message: "Great post! The colors really pop.",
    unread: false,
    photo: avatarPhotos[3],
  },
  {
    id: 11,
    user: "ColorTheory",
    avatar: "C",
    time: "1d",
    message: "Those boots are amazing! What brand are they?",
    unread: false,
    photo: avatarPhotos[4],
  },
  { id: 12, user: "AvantGarde", avatar: "A", time: "2d", message: "Hey! Love your recent posts.", unread: false, photo: avatarPhotos[5] },
  {
    id: 13,
    user: "FashionWeek",
    avatar: "F",
    time: "3d",
    message: "You should check out our new collection.",
    unread: false,
    photo: avatarPhotos[6],
  },
];

export function NotificationsPage() {
  return (
    <PageShell>
      <PageHeader title="Notifications" />

      <div className="app-page-content space-y-4">
        <PageSection className="p-4">
          <div className="mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Activity</span>
          </div>
          <div className="space-y-1">
            <Link
              to="/notifications/activity"
              className="flex items-center gap-3 rounded-2xl px-1 py-1.5 transition-colors hover:bg-muted/60"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Interactions</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs">{activityItem.user} and 71 others liked your post</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-xs text-muted-foreground">4m</span>
                <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
            <Link
              to="/notifications/sales"
              className="flex items-center gap-3 rounded-2xl px-1 py-1.5 transition-colors hover:bg-muted/60"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <BadgeCent className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Upcoming sales</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs">Maison Margiela and 3 other brands you follow have upcoming sales</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-xs text-muted-foreground">2h</span>
                <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
            <Link
              to="/notifications/near-you"
              className="flex items-center gap-3 rounded-2xl px-1 py-1.5 transition-colors hover:bg-muted/60"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Near you</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs">You have 3 fashion stores within walking distance</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-xs text-muted-foreground">1d</span>
                <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </PageSection>

        <PageSection className="p-4">
          <div className="mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Messages</span>
          </div>
          <div className="space-y-1">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-2xl px-2 py-2 ${item.unread ? "bg-accent/30" : ""}`}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <img src={item.photo} alt={item.user} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <span className={`text-sm ${item.unread ? "font-medium" : ""}`}>{item.user}</span>
                  </div>
                  <p
                    className={`truncate text-xs ${item.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {item.message}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {item.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </PageShell>
  );
}
