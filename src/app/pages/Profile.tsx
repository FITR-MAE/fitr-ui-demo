import { Grid, Bookmark, Heart, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const userPosts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 2847,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1651742532544-346cc809adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 1923,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1651744258886-7987b4d3e949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 3204,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1651744258699-d322dff9632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 4156,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1651744258329-9868b90f456c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 2617,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1651828854976-4fa163b636ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    likes: 3891,
  },
];

const tabs = [
  { id: "posts", icon: Grid },
  { id: "saved", icon: Bookmark },
  { id: "liked", icon: Heart },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const tabWidth = el.clientWidth;
      if (tabWidth === 0) return;

      const scrollLeft = el.scrollLeft;
      const newIndex = Math.round(scrollLeft / tabWidth);

      if (newIndex >= 0 && newIndex < tabs.length && tabs[newIndex].id !== activeTab) {
        setActiveTab(tabs[newIndex].id);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const index = tabs.findIndex((t) => t.id === tabId);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-10" />
          <h2 className="text-lg font-semibold">Sarah Connor</h2>
          <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-3">
            <span className="text-white text-3xl">S</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">@styleicon · she/her · 🇨🇦</p>
          <div className="flex gap-8 mb-4">
            <div className="text-center">
              <div className="text-xl font-semibold">42</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">12.5k</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">847</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Fashion enthusiast | Personal stylist | Minimal aesthetic
          </p>
        </div>

        <div className="border-t border-b border-border">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 flex items-center justify-center py-3 transition-colors ${
                    activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="pt-6 overflow-x-auto snap-x snap-mandatory touch-pan-x hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex">
            <div className="grid w-full shrink-0 snap-start grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <div key={post.id} className="aspect-square bg-muted overflow-hidden relative group cursor-pointer">
                  <img src={post.image} alt={`Post ${post.id}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-4 h-4 fill-white" />
                      <span className="text-sm">
                        {post.likes > 999 ? `${Math.floor(post.likes / 1000)}k` : post.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full shrink-0 snap-start py-12 text-center">
              <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No saved posts yet</p>
            </div>

            <div className="w-full shrink-0 snap-start py-12 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No liked posts yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
