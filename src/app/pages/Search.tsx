import { MapPin, Search } from "lucide-react";

import { PageHeader, PageSection, PageShell } from "../components/Page";

export function SearchPage() {
  return (
    <PageShell>
      <PageHeader title="Search" />

      <div className="app-page-content space-y-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search outfits, users, styles..."
            className="h-12 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <PageSection className="p-5 text-center">
          <div className="mb-4 flex items-center gap-2 text-left">
            <MapPin className="w-5 h-5" />
            <h2 className="app-section-title">Fashion Stores Near You</h2>
          </div>
          <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="app-section-copy">Map view coming soon</p>
        </PageSection>

        <PageSection className="p-5">
          <h2 className="app-section-title">Recent Searches</h2>
          <div className="py-8 text-center text-sm text-muted-foreground">No recent searches</div>
        </PageSection>
      </div>
    </PageShell>
  );
}
