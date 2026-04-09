import { motion } from "motion/react";
import { Image, Tag, MapPin, Users, X } from "lucide-react";
import { useState } from "react";

import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

export function Post() {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageSelect = () => {
    const mockImage =
      "https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3RyZWV0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080";
    setSelectedImage(mockImage);
  };

  return (
    <PageShell contentClassName="pb-24">
      <PageHeader title="New Post" trailing={<Button className="rounded-full px-5">Share</Button>} />

      <div className="app-page-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            {selectedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="app-surface relative aspect-[3/4] overflow-hidden"
              >
                <img
                  src={selectedImage}
                  alt="Selected outfit"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleImageSelect}
                className="app-surface flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/30 bg-muted/40 hover:border-foreground/50 transition-colors"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
                  <Image className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <div className="mb-1 font-medium">Add Photo or Video</div>
                  <div className="text-sm text-muted-foreground">
                    Tap to select from your device
                  </div>
                </div>
              </motion.button>
            )}

            <PageSection className="p-5">
              <label className="block mb-2 text-sm">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share details about your outfit..."
                className="h-32 w-full resize-none rounded-2xl border border-border bg-muted/50 px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </PageSection>

            <PageSection className="p-5">
              <label className="block mb-2 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="h-11 flex-1 rounded-2xl border border-border bg-muted/50 px-4 outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={addTag} variant="outline" className="h-11 rounded-2xl px-5">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-sm text-background"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </PageSection>

            <PageSection className="space-y-3 p-4">
              <button className="flex min-h-[48px] w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 transition-colors hover:bg-accent">
                <MapPin className="w-5 h-5" />
                <span>Add Location</span>
              </button>

              <button className="flex min-h-[48px] w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 transition-colors hover:bg-accent">
                <Users className="w-5 h-5" />
                <span>Tag People</span>
              </button>

              <button className="flex min-h-[48px] w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 transition-colors hover:bg-accent">
                <Tag className="w-5 h-5" />
                <span>Tag Items from Wardrobe</span>
              </button>
            </PageSection>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-12 w-full rounded-2xl bg-foreground text-sm font-medium text-background"
              >
                Share to Feed
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
