import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Camera, ImagePlus, X, MapPin, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { PageSection, PageShell } from "../components/Page";

type Step = "media" | "edit" | "details";

const steps: Step[] = ["media", "edit", "details"];

const mockImages = [
  "https://images.unsplash.com/photo-1651742532474-ea4401a34a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.0.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1651742532544-346cc809adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.0.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1651744258699-d322dff9632c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwb3V0Zml0JTIwc3R5bGV8ZW58MXx8fHwxNzc1NjYyNzg2fDA&ixlib=rb-4.0.0&q=80&w=1080",
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

const sourceOptions = [
  {
    key: "camera",
    title: "Take Photo",
    subtitle: "Use your camera",
    icon: Camera,
    previewIndex: 0,
  },
  {
    key: "gallery",
    title: "Choose from Gallery",
    subtitle: "Pick from your phone",
    icon: ImagePlus,
    previewIndex: 1,
  },
] as const;

const stepLabels: Record<Step, string> = {
  media: "New Post",
  edit: "Edit",
  details: "Details",
};

export function Post() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState<Step>("media");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const postTimeoutRef = useRef<number | null>(null);

  const currentStepIndex = steps.indexOf(currentStep);
  const selectedImage = selectedIndex === null ? null : mockImages[selectedIndex];

  useEffect(() => {
    return () => {
      if (postTimeoutRef.current !== null) {
        window.clearTimeout(postTimeoutRef.current);
      }
    };
  }, []);

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
    setIsPosting(true);
    postTimeoutRef.current = window.setTimeout(() => {
      setIsPosting(false);
      navigate("/");
    }, 1500);
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

  const frameMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.98 },
        transition: { duration: 0.2, ease: "easeOut" as const },
      };

  const headerActionLabel = currentStep === "details" ? "Share" : "Next";
  const isHeaderActionDisabled = isPosting || (currentStep === "media" && selectedIndex === null);
  const stepDescription =
    currentStep === "media"
      ? "Choose a photo to start your post."
      : currentStep === "edit"
        ? "Shape the caption before you continue."
        : "Finish the details and publish.";

  return (
    <PageShell>
      <div className="app-page-content space-y-4 pb-24">
        <PageSection className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <span className="app-chip">Step {currentStepIndex + 1}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{stepLabels[currentStep]}</p>
                <p className="text-xs text-muted-foreground">{stepDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    currentStep === step
                      ? "w-8 bg-foreground"
                      : index < currentStepIndex
                        ? "w-3 bg-foreground/40"
                        : "w-3 bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </PageSection>

        <AnimatePresence mode="wait">
          {currentStep === "media" && (
            <motion.div key="media" {...frameMotionProps} className="space-y-4">
              <PageSection className="overflow-hidden p-0">
                <div className="relative aspect-[4/5] w-full bg-muted">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Selected post preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                        <ImagePlus className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Start with a strong first image</p>
                        <p className="text-xs text-muted-foreground">
                          Choose a recent photo or jump straight in from camera.
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
                <div className="mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Source</span>
                </div>
                <div className="space-y-1">
                  {sourceOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.key}
                        onClick={() => handleSelectImage(option.previewIndex)}
                        className="flex w-full items-center gap-3 rounded-2xl px-1 py-1.5 text-left transition-colors hover:bg-muted/60 active:scale-[0.98]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground">{option.title}</div>
                          <div className="text-xs text-muted-foreground">{option.subtitle}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    );
                  })}
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
                        className={`relative overflow-hidden rounded-2xl bg-muted text-left transition-transform active:scale-[0.98] ${
                          isSelected
                            ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                            : "hover:opacity-90"
                        }`}
                        aria-label={`Select image ${index + 1}`}
                      >
                        <img src={image} alt="Post option" className="aspect-square w-full object-cover" />
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
                    <img src={selectedImage} alt="Selected" className="h-full w-full object-cover" />
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
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Keep it short, readable, and feed-friendly.</p>
                  <button
                    onClick={handleNext}
                    className="flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              </PageSection>

              <PageSection className="p-4">
                <div className="mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</span>
                </div>
                <div className="rounded-2xl bg-muted/60 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">How this will feel in the feed</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {caption ? caption : "Your caption will appear here once you start writing."}
                  </p>
                </div>
              </PageSection>
            </motion.div>
          )}

          {currentStep === "details" && (
            <motion.div key="details" {...frameMotionProps} className="space-y-4">
              <PageSection className="overflow-hidden p-0">
                <div className="relative aspect-[4/5] w-full bg-muted">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="h-full w-full object-cover" />
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
                      <div className="text-xs text-muted-foreground">Share where the look came together</div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-2xl px-1 py-1.5 text-left transition-colors hover:bg-muted/60 active:scale-[0.98]">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">Tag People</div>
                      <div className="text-xs text-muted-foreground">Credit the people in your post</div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                </div>
              </PageSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
