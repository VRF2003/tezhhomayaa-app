/**
 * Transforms pure headless LEP payloads into the exact prop shape (`cmsData`)
 * expected by legacy UI components.
 */
export function adaptPayload(type: string, payload: any): any {
  switch (type) {
    case "HERO":
      // Adapts pure data into the `HeroFilm.tsx` slides array
      return {
        slides: [
          {
            id: `lep-hero-${Date.now()}`,
            media: {
              desktop: { url: payload.desktopImage },
              mobile: { url: payload.mobileImage }
            },
            content: {
              subheading: payload.subtitle,
              heading: payload.title,
              description: payload.description,
              primaryButton: { label: payload.primaryCta, url: payload.primaryCtaUrl, enabled: !!payload.primaryCta },
              secondaryButton: { label: payload.secondaryCta, url: payload.secondaryCtaUrl, enabled: !!payload.secondaryCta }
            },
            // Let normalizeSectionData in HeroFilm handle the rest, but we can pass optional overrides
            style: {
              textColor: payload.textColor || "#ffffff",
              textShadow: "soft",
              darkOverlay: 20
            }
          }
        ]
      };
    default:
      return payload;
  }
}
