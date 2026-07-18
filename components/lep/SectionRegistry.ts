import HeroFilm from "@/components/sections/HeroFilm";
import { ComponentType } from "react";

/**
 * Maps logical LEP content types to physical React components.
 * This registry acts as the glue layer, ensuring LEP never imports UI components directly.
 */
export const SectionRegistry: Record<string, ComponentType<any>> = {
  HERO: HeroFilm,
  // FUTURE EXAMPLES:
  // EDITORIAL: EditorialSection,
  // COLLECTION: CollectionShowcase,
};
