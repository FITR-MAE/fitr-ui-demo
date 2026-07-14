import type { LucideIcon } from "lucide-react";
import { cn } from "./ui/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type BadgeColor = "foreground" | "blue";

type Props = {
  src: string;
  alt: string;
  badgeIcon?: LucideIcon;
  badgeColor?: BadgeColor;
  showBadge?: boolean;
  className?: string;
};

const badgeColorClass: Record<BadgeColor, string> = {
  foreground: "bg-foreground text-background",
  blue: "bg-blue-500 text-white",
};

export function AvatarBadge({
  src,
  alt,
  badgeIcon: Icon,
  badgeColor = "foreground",
  showBadge = true,
  className,
}: Props) {
  return (
    <div className={cn("relative h-10 w-10 shrink-0", className)}>
      <div className="h-10 w-10 overflow-hidden rounded-full">
        <ImageWithFallback src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
      {showBadge && Icon ? (
        <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background">
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full",
              badgeColorClass[badgeColor],
            )}
          >
            <Icon className="h-3 w-3" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
