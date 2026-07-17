// Defines consistent, luxurious easing curves
export const CEREMONY_EASING = [0.25, 0.1, 0.25, 1.0] as const;

export const ceremonyFadeUp = {
  hidden: { opacity: 0, y: 10, filter: "blur(2px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: CEREMONY_EASING }
  }
};

export const ceremonyFade = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.6, ease: CEREMONY_EASING }
  }
};
