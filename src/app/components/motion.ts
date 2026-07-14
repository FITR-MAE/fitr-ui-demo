import { useReducedMotion } from "motion/react";
import type { Variants, Transition, TargetAndTransition } from "motion/react";

export function useShouldAnimate(): boolean {
  return !useReducedMotion();
}

type PressScale = 0.9 | 0.95 | 0.96 | 0.97 | 0.98;

const PRESS_TRANSITION: Transition = { duration: 0.15, ease: "easeOut" };

export function usePressFeedback(scale: PressScale = 0.98): {
  whileTap: TargetAndTransition["whileTap"];
  transition: Transition;
} {
  const shouldAnimate = useShouldAnimate();
  return {
    whileTap: shouldAnimate ? { scale } : undefined,
    transition: PRESS_TRANSITION,
  };
}

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function useFadeUpVariants(): Variants {
  const shouldAnimate = useShouldAnimate();
  return {
    hidden: shouldAnimate ? { opacity: 0, y: 8 } : {},
    visible: shouldAnimate
      ? { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
      : {},
  };
}

export function useScaleInVariants(): Variants {
  const shouldAnimate = useShouldAnimate();
  return {
    hidden: shouldAnimate ? { opacity: 0, scale: 0.95 } : {},
    visible: shouldAnimate
      ? { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } }
      : {},
  };
}

export function usePanelMotion(): {
  initial?: { opacity: number; y: number };
  animate?: { opacity: number; y: number; transition: Transition };
  exit?: { opacity: number; y: number };
} {
  const shouldAnimate = useShouldAnimate();
  if (!shouldAnimate) return {};
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -8 },
  };
}

export function usePanelMotionWithScale(): {
  initial?: { opacity: number; y: number; scale: number };
  animate?: { opacity: number; y: number; scale: number; transition: Transition };
  exit?: { opacity: number; y: number; scale: number };
} {
  const shouldAnimate = useShouldAnimate();
  if (!shouldAnimate) return {};
  return {
    initial: { opacity: 0, y: 8, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -8, scale: 0.98 },
  };
}

export function useTabPanelMotion(): {
  initial?: { opacity: number; y: number };
  animate?: { opacity: number; y: number };
  exit?: { opacity: number; y: number };
} {
  const shouldAnimate = useShouldAnimate();
  if (!shouldAnimate) return {};
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };
}