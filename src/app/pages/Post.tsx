import { motion, AnimatePresence } from "motion/react";
import { ImagePlus, X, MapPin, Users, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { PageSection, PageShell } from "../components/Page";
import { cn } from "../components/ui/utils";
import { usePanelMotionWithScale } from "../components/motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type Step = "media" | "edit" | "details";

const steps: Step[] = ["media", "edit", "details"];

const mockImages = [
  "https://images.unsplash.com/photo-1651742532474-ea4401a34a10",
  "https://images.unsplash.com/photo-1651742532544-346cc809adb3",
  "https://images.unsplash.com/photo-1651744258699-d322dff9632c",
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
  const frameMotionProps = usePanelMotionWithScale();
  const [currentStep, setCurrentStep] = useState<Step>("media");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const currentStepIndex = steps.indexOf(currentStep);
  const selectedImage = selectedIndex === null ? null : mockImages[selectedIndex];

  const handleNext = () => {
    if (currentStep === "media" && selectedIndex === null) {
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
      return;
    }

    navigate(-1);
  };

  const handlePost = () => {
    navigate("/");
  };

  const toggleTag = (tag: string) => {
    setTags((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((item) => item !== tag);
      }

      if (currentTags.length >= 10) {
        return currentTags;
      }

      return [...currentTags, tag];
    });
  };

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    setCurrentStep("edit");
  };

  const stepDescription =
    currentStep === "media"
      ? "Choose a photo to start your post."
      : currentStep === "edit"
        ? "Shape the caption before you continue."
        : "Finish the details and publish.";

  const canShare = currentStep === "details" && selectedIndex !== null;

  return (
    <PageShell>
      <div className="app-page-content space-y-4">
        <PageSection className="p-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 active:scale-95"
              aria-label="Back"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex items-center gap-1.5">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    currentStep === step
                      ? "w-8 bg-foreground"
                      : index < currentStepIndex
                        ? "w-3 bg-foreground/40"
                        : "w-3 bg-foreground/20",
                  )}
                />
              ))}
            </div>
            <div className="min-w-[36px] text-right">
              <span className="app-chip">Step {currentStepIndex + 1}</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-medium text-foreground">{stepLabels[currentStep]}</p>
            <p className="text-xs text-muted-foreground">{stepDescription}</p>
          </div>
        </PageSection>

        <AnimatePresence mode="wait">
          {currentStep === "media" && (
            <motion.div key="media" {...frameMotionProps} className="space-y-4">
              <PageSection className="overflow-hidden p-0">
                <div className="relative aspect-[4/5] w-full bg-muted">
                  {selectedImage ? (
                    <ImageWithFallback src={selectedImage} alt="Selected post preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                        <ImagePlus className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Start with a strong first image</p>
                        <p className="text-xs text-muted-foreground">
                          Pick a photo from your recent library below.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedImage ? (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-10">
                      <span className="inline-flex rounded-md bg-white/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-white">
                        Ready To Edit
                      </span>
                    </div>
                  ) : null}
                </div>
              </PageSection>

              <PageSection className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recent</span>
                  <span className="text-xs text-muted-foreground">Tap to choose</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {mockImages.map((image, index) => {
                    const isSelected = selectedIndex === index;

                    return (
                      <button
                        key={image}
                        onClick={() => handleSelectImage(index)}
                        className={cn(
                          "relative overflow-hidden rounded-2xl bg-muted text-left transition-transform active:scale-[0.98]",
                          isSelected
                            ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                            : "hover:opacity-90",
                        )}
                        aria-label={`Select image ${index + 1}`}
                      >
                        <ImageWithFallback src={image} alt="Post option" className="aspect-square w-full object-cover" />
                        {isSelected ? <div className="absolute inset-0 bg-black/10" /> : null}
                      </button>
                    );
                  })}
                </div>
              </PageSection>
            </motion.div>
          )}

          {currentStep === "edit" && (
            <motion.div key="edit" {...frameMotionProps} className="space-y-4">
              <PageSection className="overflow-hidden p-0">
                <div className="relative aspect-[4/5] w-full bg-muted">
                  {selectedImage ? (
                    <ImageWithFallback src={selectedImage} alt="Selected" className="h-full w-full object-cover" />
                  ) : null}
                  <button
                    onClick={() => {
                      setSelectedIndex(null);
                      setCurrentStep("media");
                    }}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 active:scale-95"
                    aria-label="Remove selected photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {caption ? (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
                      <p className="text-sm text-white line-clamp-3">{caption}</p>
                    </div>
                  ) : null}
                </div>
              </PageSection>

              <PageSection className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Caption</span>
                  <span className="text-xs text-muted-foreground">{caption.length}/2,200</span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption that gives your outfit some context..."
                  maxLength={2200}
                  className="h-28 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:ring-2 focus:ring-ring"
                />
              </PageSection>

              <button
                type="button"
                onClick={handleNext}
                className="flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:scale-[0.98]"
              >
                Continue
              </button>
            </motion.div>
          )}

          {currentStep === "details" && (
            <motion.div key="details" {...frameMotionProps} className="space-y-4">
              <PageSection className="overflow-hidden p-0">
                <div className="relative aspect-[4/5] w-full bg-muted">
                  {selectedImage ? (
                    <ImageWithFallback src={selectedImage} alt="Selected" className="h-full w-full object-cover" />
                  ) : null}
                  {caption ? (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
                      <p className="text-sm text-white">{caption}</p>
                    </div>
                  ) : null}
                </div>
              </PageSection>

              <PageSection className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</span>
                  <span className="text-xs text-muted-foreground">{tags.length}/10</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tagSuggestions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-all active:scale-95",
                        tags.includes(tag)
                          ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
                          : "border border-border bg-card text-muted-foreground hover:bg-muted/60",
                      )}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </PageSection>

              <PageSection className="p-4">
                <div className="mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">More</span>
                </div>
                <div className="space-y-1">
                  <button className="flex w-full items-center gap-3 rounded-2xl px-1 py-1.5 text-left transition-colors hover:bg-muted/60 active:scale-[0.98]">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">Add Location</div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-2xl px-1 py-1.5 text-left transition-colors hover:bg-muted/60 active:scale-[0.98]">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">Tag People</div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                </div>
              </PageSection>

              <button
                type="button"
                onClick={handlePost}
                disabled={!canShare}
                className="sticky bottom-4 flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                Share
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
