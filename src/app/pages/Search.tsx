import { MapPin, Search } from "lucide-react";

export function SearchPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search outfits, users, styles..."
            className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Fashion Stores Near You
        </h2>
        <div className="bg-muted/50 rounded-2xl p-4 md:p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Map view coming soon</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>
        <div className="text-muted-foreground text-center py-8">No recent searches</div>
      </div>
    </div>
  );
}
