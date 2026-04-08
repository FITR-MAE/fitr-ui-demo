import { motion } from "motion/react";
import { Image, Tag, MapPin, Users, X } from "lucide-react";
import { useState } from "react";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1>New Post</h1>
            <button className="px-6 py-2 bg-foreground text-background rounded-lg">
              Share
            </button>
          </div>

          <div className="space-y-6">
            {selectedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden"
              >
                <img
                  src={selectedImage}
                  alt="Selected outfit"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleImageSelect}
                className="w-full aspect-[3/4] bg-muted rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/30 hover:border-foreground/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                  <Image className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <div className="mb-1">Add Photo or Video</div>
                  <div className="text-sm text-muted-foreground">
                    Tap to select from your device
                  </div>
                </div>
              </motion.button>
            )}

            <div>
              <label className="block mb-2 text-sm">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share details about your outfit..."
                className="w-full h-32 px-4 py-3 bg-muted border-0 rounded-lg outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
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
                  className="flex-1 px-4 py-3 bg-muted border-0 rounded-lg outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={addTag}
                  className="px-6 py-3 bg-muted rounded-lg hover:bg-accent transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1.5 bg-foreground text-background rounded-full text-sm flex items-center gap-2"
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
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-4 bg-card border border-border rounded-xl flex items-center gap-3 hover:bg-accent transition-colors">
                <MapPin className="w-5 h-5" />
                <span>Add Location</span>
              </button>

              <button className="w-full px-4 py-4 bg-card border border-border rounded-xl flex items-center gap-3 hover:bg-accent transition-colors">
                <Users className="w-5 h-5" />
                <span>Tag People</span>
              </button>

              <button className="w-full px-4 py-4 bg-card border border-border rounded-xl flex items-center gap-3 hover:bg-accent transition-colors">
                <Tag className="w-5 h-5" />
                <span>Tag Items from Wardrobe</span>
              </button>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-foreground text-background rounded-xl"
              >
                Share to Feed
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
