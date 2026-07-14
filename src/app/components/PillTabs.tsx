import { motion } from "motion/react";
import { cn } from "./ui/utils";
import { useShouldAnimate } from "./motion";

type Tab<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  tabs: readonly Tab<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
  variant?: "default" | "overlay";
  className?: string;
};

export function PillTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  className,
}: Props<T>) {
  const shouldAnimate = useShouldAnimate();

  if (variant === "overlay") {
    return (
      <div className={cn("inline-flex rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-md", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "bg-white text-black"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      layout={shouldAnimate}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={cn("flex justify-center", className)}
    >
      <div className="inline-flex flex-wrap justify-center rounded-full border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
