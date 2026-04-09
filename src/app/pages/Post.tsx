import { motion } from "motion/react";
import { Image, Tag, MapPin, Users, X } from "lucide-react";
import { useState } from "react";

import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

const glassInputClassName =
  "rounded-xl border border-border bg-background px-3 text-foreground outline-none transition focus:ring-2 focus:ring-ring";

const utilityRowClassName =
  "flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-2 py-1 text-left transition-colors hover:bg-muted/60";

const profileButtonClassName =
  "rounded-xl border border-border bg-card text-foreground shadow-none hover:bg-muted/60";

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
      <PageHeader
        title="New Post"
        trailing={
          <Button
            variant="outline"
            className="h-9 rounded-full border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-muted/60"
          >
            Share
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-lg px-4 pt-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2.5">
            <PageSection className="p-3">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium">Photo</h2>
                <span className="text-xs text-muted-foreground">Required</span>
              </div>
              {selectedImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-[10/12] overflow-hidden rounded-xl"
                >
                  <img
                    src={selectedImage}
                    alt="Selected outfit"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/60"
                    aria-label="Remove selected image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleImageSelect}
                  className="flex aspect-[10/12] w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-5 text-center transition-colors hover:border-foreground/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
                    <Image className="h-6 w-6" />
                  </div>
                  <div className="mt-2.5 space-y-0.5">
                    <div className="font-medium">Add Photo or Video</div>
                    <div className="text-sm text-muted-foreground">Tap to upload</div>
                  </div>
                </motion.button>
              )}
            </PageSection>

            <PageSection className="p-3">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium">Caption</h2>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share details about your outfit..."
                className={`h-24 w-full resize-none py-2.5 ${glassInputClassName}`}
              />
            </PageSection>

            <PageSection className="p-3">
              <label className="mb-2.5 flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <div className="mb-2.5 flex gap-2">
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
                  className={`h-10 flex-1 ${glassInputClassName}`}
                />
                <Button
                  onClick={addTag}
                  variant="outline"
                  className={`h-10 px-3.5 text-sm ${profileButtonClassName}`}
                >
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
                      className="flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1 text-xs text-background"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="transition hover:opacity-70"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </PageSection>

            <PageSection className="p-3">
              <div className="mb-2.5">
                <h2 className="text-sm font-medium">Details</h2>
              </div>
              <div className="space-y-1">
                <button className={utilityRowClassName}>
                  <MapPin className="h-5 w-5" />
                  <span className="flex-1">Add Location</span>
                  <span className="text-xs text-muted-foreground">Soon</span>
                </button>

                <button className={utilityRowClassName}>
                  <Users className="h-5 w-5" />
                  <span className="flex-1">Tag People</span>
                  <span className="text-xs text-muted-foreground">Soon</span>
                </button>

                <button className={utilityRowClassName}>
                  <Tag className="h-5 w-5" />
                  <span className="flex-1">Tag Items</span>
                  <span className="text-xs text-muted-foreground">Soon</span>
                </button>
              </div>
            </PageSection>

            <div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={`h-11 w-full text-sm font-semibold ${profileButtonClassName}`}
                >
                  Share to Feed
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
