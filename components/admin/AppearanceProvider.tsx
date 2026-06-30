"use client";

import React, { useEffect, useState } from "react";

export interface MobileAppearanceConfig {
  heroHeight: number;
  logoSize: number;
  iconSize: number;
  sectionSpacing: number;
  productGap: number;
  headingScale: number;
  buttonHeight: number;
  collectionGap: number;
}

export interface BreakpointConfig {
  heroTitleSize: number;
  h1Size: number;
  h2Size: number;
  h3Size: number;
  bodySize: number;
  captionSize: number;
  buttonSize: number;
}

export interface TypographyConfig {
  desktop: BreakpointConfig;
  tablet: BreakpointConfig;
  mobile: BreakpointConfig;
  letterSpacing: number;
  headingLineHeight: number;
  fontWeight: number;
  contentWidth: number;
  headingMaxWidth: number;
}

export interface AppearanceConfig {
  mobile: MobileAppearanceConfig;
  typography?: TypographyConfig;
}

export function AppearanceProvider({ children, initialConfig }: { children: React.ReactNode, initialConfig?: AppearanceConfig }) {
  const [config, setConfig] = useState<AppearanceConfig | null>(initialConfig || null);

  useEffect(() => {
    // If not provided initially, fetch it
    if (!initialConfig) {
      fetch("/api/appearance")
        .then(r => r.json())
        .then(res => {
          if (res.success && res.data) {
            setConfig(res.data);
          }
        })
        .catch(console.error);
    }
  }, [initialConfig]);

  useEffect(() => {
    // Listen for live preview updates from the Admin Panel iframe wrapper
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_APPEARANCE") {
        setConfig(event.data.config);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!config || !config.mobile) return;
    const m = config.mobile;
    const root = document.documentElement;

    // We set CSS variables on the root that we can consume in Tailwind or CSS
    root.style.setProperty("--mobile-hero-height", `${m.heroHeight}vh`);
    root.style.setProperty("--mobile-logo-size", `${m.logoSize}rem`);
    root.style.setProperty("--mobile-icon-size", `${m.iconSize}px`);
    root.style.setProperty("--mobile-section-spacing", `${m.sectionSpacing}rem`);
    root.style.setProperty("--mobile-product-gap", `${m.productGap}rem`);
    if (m.headingScale) {
      root.style.setProperty("--mobile-heading-scale", `${m.headingScale / 100}`);
    }
    if (m.buttonHeight) root.style.setProperty("--mobile-button-height", `${m.buttonHeight}px`);
    if (m.collectionGap) root.style.setProperty("--mobile-collection-gap", `${m.collectionGap}rem`);

    if (config.typography) {
      const t = config.typography;
      if (t.desktop) {
        root.style.setProperty("--global-desktop-hero", `${t.desktop.heroTitleSize}rem`);
        root.style.setProperty("--global-desktop-h1", `${t.desktop.h1Size}rem`);
        root.style.setProperty("--global-desktop-h2", `${t.desktop.h2Size}rem`);
        root.style.setProperty("--global-desktop-h3", `${t.desktop.h3Size}rem`);
        root.style.setProperty("--global-desktop-body", `${t.desktop.bodySize}rem`);
        root.style.setProperty("--global-desktop-caption", `${t.desktop.captionSize}rem`);
        root.style.setProperty("--global-desktop-button", `${t.desktop.buttonSize}rem`);
      }
      if (t.tablet) {
        root.style.setProperty("--global-tablet-hero", `${t.tablet.heroTitleSize}rem`);
        root.style.setProperty("--global-tablet-h1", `${t.tablet.h1Size}rem`);
        root.style.setProperty("--global-tablet-h2", `${t.tablet.h2Size}rem`);
        root.style.setProperty("--global-tablet-h3", `${t.tablet.h3Size}rem`);
        root.style.setProperty("--global-tablet-body", `${t.tablet.bodySize}rem`);
        root.style.setProperty("--global-tablet-caption", `${t.tablet.captionSize}rem`);
        root.style.setProperty("--global-tablet-button", `${t.tablet.buttonSize}rem`);
      }
      if (t.mobile) {
        root.style.setProperty("--global-mobile-hero", `${t.mobile.heroTitleSize}rem`);
        root.style.setProperty("--global-mobile-h1", `${t.mobile.h1Size}rem`);
        root.style.setProperty("--global-mobile-h2", `${t.mobile.h2Size}rem`);
        root.style.setProperty("--global-mobile-h3", `${t.mobile.h3Size}rem`);
        root.style.setProperty("--global-mobile-body", `${t.mobile.bodySize}rem`);
        root.style.setProperty("--global-mobile-caption", `${t.mobile.captionSize}rem`);
        root.style.setProperty("--global-mobile-button", `${t.mobile.buttonSize}rem`);
      }
      
      root.style.setProperty("--type-heading-max-width", t.headingMaxWidth ? `${t.headingMaxWidth}%` : "100%");
      root.style.setProperty("--type-content-width", t.contentWidth ? `${t.contentWidth}%` : "100%");
      root.style.setProperty("--type-letter-spacing", `${t.letterSpacing ?? 0.05}em`);
      root.style.setProperty("--type-line-height", `${t.headingLineHeight ?? 1.1}`);
      root.style.setProperty("--type-font-weight", `${t.fontWeight ?? 400}`);
    }
  }, [config]);

  return <>{children}</>;
}
