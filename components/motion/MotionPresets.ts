export type MotionPresetId = 
  | "none"
  | "luxury-fade" 
  | "museum-reveal" 
  | "cinematic-fade" 
  | "editorial-slide" 
  | "soft-scale"
  | "curtain-reveal";

export interface MotionPreset {
  id: MotionPresetId;
  defaultDuration: number; // in ms
  defaultEasing: string;
  initial: React.CSSProperties;
  active: React.CSSProperties;
}

export const MOTION_PRESETS: Record<MotionPresetId, MotionPreset> = {
  "none": {
    id: "none",
    defaultDuration: 0,
    defaultEasing: "linear",
    initial: { opacity: 1, transform: "none" },
    active: { opacity: 1, transform: "none" },
  },
  "luxury-fade": {
    id: "luxury-fade",
    defaultDuration: 900,
    defaultEasing: "cubic-bezier(0.25, 1, 0.5, 1)", // ease-out-quart
    initial: { opacity: 0 },
    active: { opacity: 1 },
  },
  "museum-reveal": {
    id: "museum-reveal",
    defaultDuration: 1200,
    defaultEasing: "cubic-bezier(0.16, 1, 0.3, 1)", // ease-out-expo
    initial: { opacity: 0, transform: "translateY(40px)" },
    active: { opacity: 1, transform: "translateY(0px)" },
  },
  "cinematic-fade": {
    id: "cinematic-fade",
    defaultDuration: 1600,
    defaultEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
    initial: { opacity: 0, transform: "scale(1.05)" },
    active: { opacity: 1, transform: "scale(1)" },
  },
  "editorial-slide": {
    id: "editorial-slide",
    defaultDuration: 1000,
    defaultEasing: "cubic-bezier(0.25, 1, 0.5, 1)",
    initial: { opacity: 0, transform: "translateX(40px)" },
    active: { opacity: 1, transform: "translateX(0px)" },
  },
  "soft-scale": {
    id: "soft-scale",
    defaultDuration: 800,
    defaultEasing: "cubic-bezier(0.25, 1, 0.5, 1)",
    initial: { opacity: 0, transform: "scale(0.96)" },
    active: { opacity: 1, transform: "scale(1)" },
  },
  "curtain-reveal": {
    id: "curtain-reveal",
    defaultDuration: 1400,
    defaultEasing: "cubic-bezier(0.85, 0, 0.15, 1)", // ease-in-out-quint
    // For curtain reveal, we typically use clip-path to slice it open
    initial: { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", transform: "translateY(20px)" },
    active: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", transform: "translateY(0)" },
  }
};

export const getPreset = (id: string | undefined): MotionPreset => {
  if (!id) return MOTION_PRESETS["none"];
  return MOTION_PRESETS[id as MotionPresetId] || MOTION_PRESETS["luxury-fade"];
};
