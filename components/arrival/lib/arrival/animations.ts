import { Variants } from "framer-motion";

export const mapFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 1.2, ease: "easeInOut" } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.8, ease: "easeInOut" } 
  }
};

export const mapStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

export const mapFadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1] } 
  }
};
