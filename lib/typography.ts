import React from "react";

/**
 * Maps legacy CMS fixed font sizes (rems) to the new universal fluid CSS variables.
 * We map high sizes to Hero/H1, medium sizes to H2/H3, and small sizes to Body.
 */
export function getResponsiveTypographyVar(fontSize: number): string {
  // We return the actual CSS variable name as the var reference
  if (fontSize >= 4.5) return 'var(--fluid-hero)';
  if (fontSize >= 3.5) return 'var(--fluid-h1)';
  if (fontSize >= 2.5) return 'var(--fluid-h2)';
  if (fontSize >= 1.5) return 'var(--fluid-h3)';
  if (fontSize >= 1) return 'var(--fluid-body)';
  return 'var(--fluid-caption)';
}

/**
 * Converts the typographyOverrides JSON block from the CMS into a 
 * React style object populated with --local-* CSS variables.
 */
export function injectTypographyOverrides(overrides: any): React.CSSProperties {
  if (!overrides || !overrides.enabled) return {};

  const style: any = {};

  const mapBreakpoint = (bpKey: string, bpData: any) => {
    if (!bpData) return;
    if (bpData.heroTitleSize) style[`--local-${bpKey}-hero`] = `${bpData.heroTitleSize}rem`;
    if (bpData.h1Size) style[`--local-${bpKey}-h1`] = `${bpData.h1Size}rem`;
    if (bpData.h2Size) style[`--local-${bpKey}-h2`] = `${bpData.h2Size}rem`;
    if (bpData.h3Size) style[`--local-${bpKey}-h3`] = `${bpData.h3Size}rem`;
    if (bpData.bodySize) style[`--local-${bpKey}-body`] = `${bpData.bodySize}rem`;
    if (bpData.captionSize) style[`--local-${bpKey}-caption`] = `${bpData.captionSize}rem`;
    if (bpData.buttonSize) style[`--local-${bpKey}-button`] = `${bpData.buttonSize}rem`;
  };

  mapBreakpoint("desktop", overrides.desktop);
  mapBreakpoint("tablet", overrides.tablet);
  mapBreakpoint("mobile", overrides.mobile);

  return style;
}

/**
 * Helper to get the semantic class for an element, based on legacy size.
 */
export function getResponsiveTypographyClass(fontSize: number): string {
  if (fontSize >= 4.5) return 'fluid-hero';
  if (fontSize >= 3.5) return 'fluid-h1';
  if (fontSize >= 2.5) return 'fluid-h2';
  if (fontSize >= 1.5) return 'fluid-h3';
  if (fontSize >= 1) return 'fluid-body';
  return 'fluid-caption';
}

/**
 * Computes inline styles for a CMS button given its structure and the selected style.
 * This ensures "Outline", "Ghost", and "Luxury" styles are respected regardless of the 
 * global backgroundColor set in the CMS style tab.
 */
export function getButtonStyles(buttonContent: any, buttonStyle: any): React.CSSProperties {
  if (!buttonContent || !buttonStyle) return {};

  const base: React.CSSProperties = {
    fontWeight: buttonStyle.fontWeight,
    fontSize: `${buttonStyle.fontSize}rem`,
    padding: buttonStyle.padding,
    borderRadius: `${buttonStyle.borderRadius}px`,
    display: "inline-block",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as any,
    transition: "all 0.3s ease"
  };

  switch (buttonContent.style) {
    case 'outline':
      return {
        ...base,
        color: buttonStyle.textColor,
        backgroundColor: "transparent",
        border: `1px solid ${buttonStyle.textColor || buttonStyle.backgroundColor || '#000'}`
      };
    case 'ghost':
      return {
        ...base,
        color: buttonStyle.textColor,
        backgroundColor: "transparent"
      };
    case 'luxury':
      return {
        ...base,
        color: buttonStyle.textColor,
        backgroundColor: "transparent",
        borderBottom: `1px solid ${buttonStyle.textColor || '#000'}`,
        paddingBottom: "2px",
        borderRadius: "0px"
      };
    case 'filled':
    default:
      return {
        ...base,
        color: buttonStyle.textColor,
        backgroundColor: buttonStyle.backgroundColor || '#000'
      };
  }
}
