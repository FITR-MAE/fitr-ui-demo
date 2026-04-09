import { ChevronRight, MessageCircle } from "lucide-react";

const activityItem = {
  subtype: "comment" as const,
  user: "ModernMuse",
  avatar: "M",
  time: "4m",
  preview: "Love this outfit!",
};

const messages = [
  {
    id: 3,
    user: "UrbanChic",
    avatar: "U",
    time: "7m",
    message: "Love your style! Would you be interested in a collab?",
    unread: true,
  },
  {
    id: 5,
    user: "StyleIcon",
    avatar: "S",
    time: "15m",
    message: "Thanks for the follow! Check out my latest post.",
    unread: true,
  },
  {
    id: 8,
    user: "ModernMuse",
    avatar: "M",
    time: "3h",
    message: "The jacket is from Zara, here is the link...",
    unread: false,
  },
  {
    id: 10,
    user: "SunsetStyle",
    avatar: "S",
    time: "5h",
    message: "Great post! The colors really pop.",
    unread: false,
  },
  {
    id: 11,
    user: "ColorTheory",
    avatar: "C",
    time: "1d",
    message: "Those boots are amazing! What brand are they?",
    unread: false,
  },
  { id: 12, user: "AvantGarde", avatar: "A", time: "2d", message: "Hey! Love your recent posts.", unread: false },
  {
    id: 13,
    user: "FashionWeek",
    avatar: "F",
    time: "3d",
    message: "You should check out our new collection.",
    unread: false,
  },
];

export function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-4 pt-6 pb-3">
        <h1 className="text-lg font-semibold">Notifications</h1>
      </div>

      <div className="py-3">
        <div className="px-4 py-2">
          <span className="text-sm font-semibold">Activity</span>
        </div>
        <div className="flex items-start gap-3 px-4 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shrink-0">
            <span className="text-white text-xs">{activityItem.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{activityItem.user}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{activityItem.preview}</span>
              <span className="text-xs text-muted-foreground">{activityItem.time}</span>
            </div>
          </div>
          <ChevronRight className="mt-1 w-4 h-4 shrink-0 text-muted-foreground" />
        </div>

        <div className="h-px bg-border mx-4 my-2" />

        <div className="px-4 py-2">
          <span className="text-sm font-semibold">Messages</span>
        </div>
        {messages.map((item) => (
          <div key={item.id} className={`flex items-start gap-3 px-4 py-2 ${item.unread ? "bg-accent/10" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shrink-0">
              <span className="text-white text-xs">{item.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div>
                <span className={`text-sm ${item.unread ? "font-medium" : ""}`}>{item.user}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className={`text-xs truncate ${item.unread ? "font-medium" : "text-muted-foreground"}`}>
                  {item.message}
                </p>

                <div className="flex shrink-0 flex-col items-end justify-start gap-1">
                  {item.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
