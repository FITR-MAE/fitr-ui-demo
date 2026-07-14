import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Send, X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { useShouldAnimate, usePressFeedback } from "./motion";
import { cn } from "./ui/utils";
import { formatCount } from "../lib/format";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type Comment = {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  createdAt: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postUser: string;
  postImage: string;
  initialComments: Comment[];
};

type Reply = Comment & {
  replies?: Comment[];
};

const seedReplies: Record<string, Comment[]> = {
  root1: [
    {
      id: "r1",
      user: "ModernMuse",
      avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      text: "Agreed, the silhouette is perfect.",
      likes: 4,
      createdAt: "1h",
    },
  ],
};

const seedComments = (): Comment[] => [
  {
    id: "c1",
    user: "ModernMuse",
    avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    text: "This is such a vibe. Where is the coat from?",
    likes: 18,
    createdAt: "2h",
  },
  {
    id: "c2",
    user: "KeishaMorgan",
    avatar: "https://images.unsplash.com/photo-1659899505079-dbc449c4f9d1",
    text: "Okay but the hair?? Goals.",
    likes: 11,
    createdAt: "3h",
  },
  {
    id: "c3",
    user: "DevonBrooks",
    avatar: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    text: "Need a fit check video for this one.",
    likes: 7,
    createdAt: "5h",
  },
  {
    id: "c4",
    user: "MarcusCole",
    avatar: "https://images.unsplash.com/photo-1528120369764-0423708119ae",
    text: "Main character energy only. Respect.",
    likes: 3,
    createdAt: "8h",
  },
];

function mergeReplies(comments: Comment[]): Reply[] {
  return comments.map((c, idx) => {
    const key = `root${idx + 1}`;
    return { ...c, replies: seedReplies[key] };
  });
}

export function CommentsPanel({ open, onOpenChange, postUser, postImage, initialComments }: Props) {
  const shouldAnimate = useShouldAnimate();
  const commentLikeTap = usePressFeedback(0.9);
  const replyLikeTap = usePressFeedback(0.9);
  const submitTap = usePressFeedback(0.9);
  const [comments, setComments] = useState<Reply[]>(() => mergeReplies(initialComments));
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState("");
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setComments(mergeReplies(initialComments));
    setLiked(new Set());
    setDraft("");
    setActiveReply(null);
  }, [initialComments]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: "auto" }), 0);
    return () => clearTimeout(t);
  }, [open]);

  const totalComments = useMemo(() => {
    return comments.reduce((sum, c) => sum + 1 + (c.replies?.length ?? 0), 0);
  }, [comments]);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      user: "You",
      avatar: "https://images.unsplash.com/photo-1690009996338-aebbf50a0b1e",
      text,
      likes: 0,
      createdAt: "now",
    };

    if (activeReply) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === activeReply ? { ...c, replies: [...(c.replies ?? []), newComment] } : c,
        ),
      );
      toast("Reply posted");
    } else {
      setComments((prev) => [{ ...newComment, replies: [] }, ...prev]);
      toast("Comment posted", { description: `Replied to @${postUser}'s look.` });
    }

    setDraft("");
    setActiveReply(null);
    requestAnimationFrame(() =>
      listRef.current?.scrollTo({ top: 0, behavior: shouldAnimate ? "smooth" : "auto" }),
    );
  };

  const handleReply = (user: string, parentId: string) => {
    setActiveReply(parentId);
    setDraft(`@${user} `);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const cancelReply = () => {
    setActiveReply(null);
    setDraft("");
  };

  const replyTargetUser = useMemo(() => {
    if (!activeReply) return null;
    for (const c of comments) {
      if (c.id === activeReply) return c.user;
      const r = c.replies?.find((x) => x.id === activeReply);
      if (r) return r.user;
    }
    return null;
  }, [activeReply, comments]);

  const likeLabel = (id: string, count: number) =>
    formatCount(count + (liked.has(id) ? 1 : 0));

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="mx-auto max-w-2xl rounded-t-2xl">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-base font-semibold">
            Comments <span className="text-muted-foreground">· {totalComments}</span>
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            Share your thoughts on @{postUser}'s look.
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-4 mb-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
            <ImageWithFallback src={postImage} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">@{postUser}</p>
            <p className="truncate text-[11px] text-muted-foreground">Original post</p>
          </div>
        </div>

        <div
          ref={listRef}
          className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-3"
          style={{ maxHeight: "44dvh" }}
        >
          <ul className="space-y-3">
            {comments.map((comment) => {
              const isLiked = liked.has(comment.id);
              return (
                <li key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                      <ImageWithFallback src={comment.avatar} alt={comment.user} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="rounded-2xl rounded-tl-md bg-muted/60 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-semibold text-foreground">{comment.user}</p>
                          <span className="text-[10px] text-muted-foreground">{comment.createdAt}</span>
                        </div>
                        <p className="mt-0.5 text-sm leading-snug text-foreground">{comment.text}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-4 pl-1">
                        <motion.button
                          type="button"
                          {...commentLikeTap}
                          onClick={() => toggleLike(comment.id)}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                          aria-pressed={isLiked}
                          aria-label={isLiked ? "Unlike comment" : "Like comment"}
                        >
                          <Heart
                            className={cn(
                              "h-3.5 w-3.5 transition-colors",
                              isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground",
                            )}
                          />
                          {likeLabel(comment.id, comment.likes)}
                        </motion.button>
                        <button
                          type="button"
                          onClick={() => handleReply(comment.user, comment.id)}
                          className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {comment.replies && comment.replies.length > 0 ? (
                    <ul className="ml-12 space-y-2 border-l border-border/60 pl-3">
                      {comment.replies.map((reply) => {
                        const replyLiked = liked.has(reply.id);
                        return (
                          <li key={reply.id} className="flex items-start gap-2">
                            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                              <ImageWithFallback src={reply.avatar} alt={reply.user} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="rounded-2xl rounded-tl-md bg-muted/40 px-3 py-1.5">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-[11px] font-semibold text-foreground">{reply.user}</p>
                                  <span className="text-[10px] text-muted-foreground">{reply.createdAt}</span>
                                </div>
                                <p className="mt-0.5 text-[13px] leading-snug text-foreground">{reply.text}</p>
                              </div>
                              <div className="mt-1 flex items-center gap-4 pl-1">
                                <motion.button
                                  type="button"
                                  {...replyLikeTap}
                                  onClick={() => toggleLike(reply.id)}
                                  className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                                  aria-pressed={replyLiked}
                                  aria-label={replyLiked ? "Unlike reply" : "Like reply"}
                                >
                                  <Heart
                                    className={cn(
                                      "h-3 w-3 transition-colors",
                                      replyLiked ? "fill-red-500 text-red-500" : "text-muted-foreground",
                                    )}
                                  />
                                  {likeLabel(reply.id, reply.likes)}
                                </motion.button>
                                <button
                                  type="button"
                                  onClick={() => handleReply(reply.user, reply.id)}
                                  className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-border bg-background p-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          {activeReply && replyTargetUser && (
            <div className="mb-2 flex items-center justify-between rounded-full bg-muted/60 px-3 py-1.5">
              <p className="truncate text-[11px] text-muted-foreground">
                Replying to <span className="font-medium text-foreground">@{replyTargetUser}</span>
              </p>
              <button
                type="button"
                onClick={cancelReply}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Cancel reply"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400 ring-1 ring-border">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1690009996338-aebbf50a0b1e"
                alt="You"
                className="h-full w-full object-cover"
              />
            </div>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={activeReply ? "Add a reply…" : "Add a comment…"}
              className="h-10 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:ring-2 focus:ring-ring"
              aria-label="Comment input"
            />
            <motion.button
              type="submit"
              {...submitTap}
              disabled={!draft.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 disabled:pointer-events-none disabled:opacity-40"
              aria-label="Post comment"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export { seedComments as mockComments };