import { motion } from "motion/react";
import {
  Link2,
  Send,
  Twitter,
  Facebook,
  Instagram,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { usePressFeedback } from "./motion";
import { cn } from "./ui/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postUser: string;
  postImage: string;
  caption: string;
};

type Target = {
  id: string;
  label: string;
  description: string;
  Icon: typeof Link2;
};

const targets: Target[] = [
  { id: "copy", label: "Copy link", description: "Paste this post anywhere.", Icon: Link2 },
  { id: "dm", label: "Direct message", description: "Send privately to a friend.", Icon: Send },
  { id: "x", label: "X", description: "Post to X / Twitter.", Icon: Twitter },
  { id: "facebook", label: "Facebook", description: "Share to your timeline.", Icon: Facebook },
  { id: "instagram", label: "Instagram", description: "Republish to your feed.", Icon: Instagram },
  { id: "more", label: "More", description: "System share sheet.", Icon: Share2 },
];

export function SharePanel({ open, onOpenChange, postUser, postImage, caption }: Props) {
  const shareTap = usePressFeedback(0.98);
  const shareText = `${postUser}: ${caption}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const close = () => onOpenChange(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      toast("Link copied", { description: "Paste it anywhere." });
    } catch {
      toast("Couldn't copy link", { description: "Your browser blocked clipboard access." });
    }
    close();
  };

  const handleDm = () => {
    toast("DMs coming soon", { description: `Reply to @${postUser}'s look.` });
    close();
  };

  const handleX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    close();
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    close();
  };

  const handleInstagram = () => {
    toast("Instagram sharing coming soon", { description: "Republish to your feed." });
    close();
  };

  const handleMore = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText, url: shareUrl });
        close();
        return;
      }
      await navigator.clipboard?.writeText(shareUrl);
      toast("Link copied", { description: "System share unavailable — link copied instead." });
      close();
    } catch {
      // Ignore share failures on restricted browsers.
    }
  };

  const handleSelect = (id: string) => {
    switch (id) {
      case "copy":
        return handleCopy();
      case "dm":
        return handleDm();
      case "x":
        return handleX();
      case "facebook":
        return handleFacebook();
      case "instagram":
        return handleInstagram();
      case "more":
        return handleMore();
      default:
        return undefined;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="mx-auto max-w-2xl rounded-t-2xl">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-base font-semibold">Share</DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            Send @{postUser}'s look to your circle or your feeds.
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
            <ImageWithFallback src={postImage} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">@{postUser}</p>
            <p className="truncate text-[11px] text-muted-foreground">{caption}</p>
          </div>
        </div>

        <div
          className="flex flex-col gap-2 px-4 pb-4"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {targets.map(({ id, label, description, Icon }) => (
            <motion.button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              {...shareTap}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}