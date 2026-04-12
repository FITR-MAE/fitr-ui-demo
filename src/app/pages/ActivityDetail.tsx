import { ArrowLeft, Clock3, Heart, MessageCircle, Share2 } from "lucide-react";
import { Link, useParams } from "react-router";

import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

export function ActivityDetailPage() {
  const { id } = useParams();

  return (
    <PageShell>
      <PageHeader
        title="Activity"
        trailing={
          <Button asChild variant="outline" size="sm" className="rounded-full px-3">
            <Link to="/notifications">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="app-page-content space-y-4">
        <PageSection className="p-5">
          <div className="app-chip inline-flex">Activity #{id ?? "-"}</div>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-base font-semibold text-white">
              M
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="app-section-title">ModernMuse commented on your post</h2>
                <span className="app-chip">New</span>
              </div>
              <p className="mt-2 app-section-copy">
                "Love this outfit. The structure and colours work really well together."
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />4 minutes ago
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="app-section-title">Related post</h2>
              <p className="mt-1 app-section-copy">Keep secondary actions aligned with the rest of the app.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] bg-muted">
            <img
              src="https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Featured outfit"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <Button className="flex-1 rounded-2xl">
              <Heart className="h-4 w-4" />
              Like
            </Button>
            <Button variant="outline" className="flex-1 rounded-2xl">
              <MessageCircle className="h-4 w-4" />
              Reply
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </PageSection>
      </div>
    </PageShell>
  );
}
