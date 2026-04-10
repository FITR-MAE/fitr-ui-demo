import { motion, AnimatePresence } from "motion/react";
import { Camera, ImagePlus, X, Tag, MapPin, Users, Loader2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { PageSection, PageShell } from "../components/Page";

type Step = "media" | "edit" | "details";

const steps: Step[] = ["media", "edit", "details"];

const mockImages = [
  "https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1651742532544-346cc809adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1651744258699-d322dff9632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
];

const tagSuggestions = [
  "streetwear",
  "ootd",
  "fashion",
  "style",
  "outfitoftheday",
  "fashionblogger",
  "instafashion",
  "styleinspo",
];

const stepLabels: Record<Step, string> = {
  media: "New Post",
  edit: "Edit",
  details: "Details",
};

export function Post() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("media");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      navigate(-1);
    }
  };

  const handlePost = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      navigate("/");
    }, 1500);
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 10) {
      setTags([...tags, tag]);
    }
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={handleBack}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card border border-border transition-colors hover:bg-muted/60 active:scale-95"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-base font-semibold text-foreground">{stepLabels[currentStep]}</span>
        <button
          onClick={currentStep === "details" ? handlePost : handleNext}
          disabled={isPosting}
          className="flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 active:scale-95 disabled:opacity-40"
        >
          {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : currentStep === "details" ? "Share" : "Next"}
        </button>
      </div>

      <div className="app-page-content">
        <AnimatePresence mode="wait">
          {currentStep === "media" && (
            <motion.div
              key="media"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 px-4 pb-4"
            >
              <div className="mb-3">
                <span className="app-chip">Media</span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedIndex(0);
                    setCurrentStep("edit");
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/60 active:scale-[0.98]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-sm font-medium text-foreground">Take Photo</div>
                    <div className="text-xs text-muted-foreground">Use your camera</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedIndex(1);
                    setCurrentStep("edit");
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/60 active:scale-[0.98]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                    <ImagePlus className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-sm font-medium text-foreground">Choose from Gallery</div>
                    <div className="text-xs text-muted-foreground">Pick from your phone</div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === "edit" && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 px-4 pb-4"
            >
              {selectedIndex !== null && (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                  <img src={mockImages[selectedIndex]} alt="Selected" className="h-full w-full object-cover" />
                  <button
                    onClick={() => {
                      setSelectedIndex(null);
                      setCurrentStep("media");
                    }}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <PageSection className="p-4">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  maxLength={2200}
                  className="h-20 w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:ring-2 focus:ring-foreground/20"
                />
                <div className="mt-2 flex justify-end">
                  <span className="text-xs text-muted-foreground">{caption.length}/2,200</span>
                </div>
              </PageSection>
            </motion.div>
          )}

          {currentStep === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 px-4 pb-4"
            >
              <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl shadow-md">
                <img src={mockImages[selectedIndex ?? 0]} alt="Selected" className="h-full w-full object-cover" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Tags</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{tags.length}/10</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tagSuggestions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all active:scale-95 ${
                        tags.includes(tag)
                          ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
                          : "border border-border bg-card text-muted-foreground hover:bg-muted/60"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="px-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">More</span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm text-foreground">Add Location</span>
                    <span className="text-xs text-muted-foreground">Soon</span>
                  </button>
                  <div className="h-px bg-border" />
                  <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm text-foreground">Tag People</span>
                    <span className="text-xs text-muted-foreground">Soon</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 py-3 px-4 border-t border-border bg-card/80 backdrop-blur-sm">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              currentStep === step ? "w-8 bg-foreground" : index < currentStepIndex ? "w-3 bg-foreground/40" : "w-3 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </PageShell>
  );
}
