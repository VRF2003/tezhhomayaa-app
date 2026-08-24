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
              primaryButton: { 
                label: payload.cta1Label || payload.primaryCta, 
                url: payload.cta1Url || payload.primaryCtaUrl, 
                enabled: !!(payload.cta1Label || payload.primaryCta),
                style: payload.buttonStyle,
                bgColor: payload.buttonBgColor,
                textColor: payload.buttonTextColor
              },
              secondaryButton: { label: payload.cta2Label || payload.secondaryCta, url: payload.cta2Url || payload.secondaryCtaUrl, enabled: !!(payload.cta2Label || payload.secondaryCta) }
            },
            layout: {
              desktop: { x: payload.desktopX ?? 50, y: payload.desktopY ?? 50 },
              mobile: { x: payload.mobileX ?? 50, y: payload.mobileY ?? 50 }
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
    case "HERO_BANNER":
      return {
        ...payload,
        content: {
          heading: payload.title || "",
          description: payload.description || "",
          primaryButton: {
            label: payload.cta1Label || payload.primaryCta || "",
            url: payload.cta1Url || payload.primaryCtaUrl || "#",
            enabled: !!(payload.cta1Label || payload.primaryCta),
            style: payload.buttonStyle || "luxury",
            bgColor: payload.buttonBgColor || "",
            textColor: payload.buttonTextColor || ""
          },
          secondaryButton: {
            label: payload.cta2Label || payload.secondaryCta || "",
            url: payload.cta2Url || payload.secondaryCtaUrl || "#",
            enabled: !!(payload.cta2Label || payload.secondaryCta),
            style: payload.buttonStyle || "luxury",
            bgColor: payload.buttonBgColor || "",
            textColor: payload.buttonTextColor || ""
          }
        },
        layout: {
          desktop: { x: payload.desktopX ?? 50, y: payload.desktopY ?? 50 },
          mobile: { x: payload.mobileX ?? 50, y: payload.mobileY ?? 50 }
        }
      };
    default:
      return payload;
  }
}
