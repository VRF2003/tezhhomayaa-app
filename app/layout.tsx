import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Jost } from "next/font/google";
import "./globals.css";
import StoreProviders from "@/components/ecommerce/StoreProviders";
import { getAllProducts } from "@/lib/collections";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { AppearanceProvider } from "@/components/admin/AppearanceProvider";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEZHHOMAYAA — Form Beyond Motion",
  description:
    "A sculptural luxury house. Where art becomes movement. Editorial fashion for those who inhabit the space between silence and form.",
  keywords: ["luxury fashion", "editorial", "sculptural", "avant-garde", "Tezhhomayaa"],
  openGraph: {
    title: "TEZHHOMAYAA — Form Beyond Motion",
    description: "Where art becomes movement.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allProducts = getAllProducts();
  let appearanceConfig = null;
  try {
    const p = join(process.cwd(), "lib", "appearance.json");
    if (existsSync(p)) {
      appearanceConfig = JSON.parse(readFileSync(p, "utf-8"));
    }
  } catch(e) {}

  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable} ${jost.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-white text-obsidian">
        {/* Devasia font is loaded via @font-face in globals.css */}
        <div className="grain-overlay" aria-hidden="true" />
        <AppearanceProvider initialConfig={appearanceConfig}>
          <StoreProviders allProducts={allProducts}>
            {children}
            <PreviewBanner />
          </StoreProviders>
        </AppearanceProvider>
      </body>
    </html>
  );
}

