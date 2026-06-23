import { BadgeCent, ChevronRight, Heart, Store } from "lucide-react";

import { Link } from "react-router";

import { PageSection, PageShell } from "../components/Page";

const activityRows = [
  {
    id: 1,
    icon: Heart,
    title: "Interactions",
    detail: "ModernMuse and 71 others liked your post",
    time: "4m",
    photo: "https://images.unsplash.com/photo-1690009996338-aebbf50a0b1e",
  },
  {
    id: 2,
    icon: BadgeCent,
    title: "Upcoming sales",
    detail: "Maison Margiela and 3 other brands you follow have upcoming sales",
    time: "2h",
    photo: "https://images.unsplash.com/photo-1654653068461-7ccc719064fa",
  },
  {
    id: 3,
    icon: Store,
    title: "Near you",
    detail: "You have 3 fashion stores within walking distance",
    time: "1d",
    photo: "https://images.unsplash.com/photo-1567401893414-76b7b1e33a76",
  },
] as const;

const messages = [
  {
    id: 3,
    user: "UrbanChic",
    time: "7m",
    message: "Love your style! Would you be interested in a collab?",
    unread: true,
    photo: "https://images.unsplash.com/photo-1654653068461-7ccc719064fa",
  },
  {
    id: 5,
    user: "StyleIcon",
    time: "15m",
    message: "Thanks for the follow! Check out my latest post.",
    unread: true,
    photo: "https://images.unsplash.com/photo-1650262697292-c01496d8aeb7",
  },
  {
    id: 8,
    user: "ModernMuse",
    time: "3h",
    message: "The jacket is from Zara, here is the link...",
    unread: false,
    photo: "https://images.unsplash.com/photo-1726276986699-eed94c47eedc",
  },
  {
    id: 10,
    user: "SunsetStyle",
    time: "5h",
    message: "Great post! The colors really pop.",
    unread: false,
    photo: "https://images.unsplash.com/photo-1708607728910-b00e0c1be0af",
  },
  {
    id: 11,
    user: "ColorTheory",
    time: "1d",
    message: "Those boots are amazing! What brand are they?",
    unread: false,
    photo: "https://images.unsplash.com/photo-1525614686090-7a3108e3758e",
  },
  {
    id: 12,
    user: "AvantGarde",
    time: "2d",
    message: "Hey! Love your recent posts.",
    unread: false,
    photo: "https://images.unsplash.com/photo-1621784562877-e971f1f79f47",
  },
  {
    id: 13,
    user: "FashionWeek",
    time: "3d",
    message: "You should check out our new collection.",
    unread: false,
    photo: "https://images.unsplash.com/photo-1612651611644-de1c1d8640ba",
  },
];

export function NotificationsPage() {
  return (
    <PageShell>
      <div className="app-page-content space-y-4">
        <PageSection className="p-4">
          <div className="mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Activity</span>
          </div>
          <div className="space-y-1">
            {activityRows.map((row) => {
              const Icon = row.icon;
              return (
                <Link
                  key={row.id}
                  to={`/activity/${row.id}`}
                  className="flex items-center gap-3 rounded-2xl px-1 py-1.5 transition-colors hover:bg-muted/60"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <img src={row.photo} alt={row.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{row.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1">{row.detail}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span className="text-xs text-muted-foreground">{row.time}</span>
                    <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
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
                className={`flex items-center gap-3 rounded-2xl px-1 py-1.5 ${item.unread ? "bg-accent/30" : ""}`}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <img src={item.photo} alt={item.user} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-sm ${item.unread ? "font-medium" : ""}`}>{item.user}</span>
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