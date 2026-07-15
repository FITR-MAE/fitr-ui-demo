import { ChevronRight, MessageCircle } from "lucide-react";

import { Link } from "react-router";

import { PageSection, PageShell } from "../components/Page";
import { AvatarBadge } from "../components/AvatarBadge";
import { cn } from "../components/ui/utils";
import { activityRows } from "../data/activity";

type Message = {
  id: number;
  user: string;
  time: string;
  message: string;
  unread: boolean;
  photo: string;
};

const messages: Message[] = [
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

const rowClass =
  "flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-muted/60";

export function NotificationsPage() {
  return (
    <PageShell>
      <div className="app-page-content space-y-4">
        <PageSection className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Activity</span>
          </div>
          <div className="space-y-1">
            {activityRows.map((row) => {
              const Icon = row.icon;
              return (
                <Link key={row.id} to={`/activity/${row.id}`} className={rowClass}>
                  <AvatarBadge
                    src={row.photo}
                    alt={row.title}
                    badgeIcon={row.icon}
                    badgeColor="foreground"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{row.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{row.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span className="text-xs text-muted-foreground">{row.time}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        </PageSection>

        <PageSection className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Messages</span>
            <span className="text-xs text-muted-foreground">
              {messages.filter((m) => m.unread).length} unread
            </span>
          </div>
          <div className="space-y-1">
            {messages.map((item) => (
              <Link key={item.id} to={`/activity/${item.id}`} className={cn(rowClass, item.unread && "bg-accent/30")}>
                <AvatarBadge
                  src={item.photo}
                  alt={item.user}
                  badgeIcon={MessageCircle}
                  badgeColor="blue"
                  showBadge={item.unread}
                />
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", item.unread && "font-medium")}>{item.user}</p>
                  <p
                    className={cn(
                      "truncate text-xs",
                      item.unread ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.message}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </Link>
            ))}
          </div>
        </PageSection>
      </div>
    </PageShell>
  );
}
