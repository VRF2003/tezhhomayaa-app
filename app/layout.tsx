import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Jost } from "next/font/google";
import "./globals.css";
import StoreProviders from "@/components/ecommerce/StoreProviders";
import { getAllProducts } from "@/lib/collections";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import { AppearanceProvider } from "@/components/admin/AppearanceProvider";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { PlatformInitializer } from "@/lib/infrastructure/bootstrap/PlatformInitializer";

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

import { cookies, headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await PlatformInitializer.initialize();

  const allProducts = await getAllProducts();
  let appearanceConfig = null;
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("appearance");
    if (data) {
      appearanceConfig = data;
    }
  } catch(e) {}

  const cookieStore = await cookies();
  const geeMarketId = cookieStore.get("tz_gee_market_id")?.value;

  let activePromotions: any[] = [];
  try {
    const { PromotionService } = await import("@/lib/promotions/services/PromotionService");
    const promotionService = new PromotionService();
    const allPromos = await promotionService.getAllPromotions();
    activePromotions = allPromos.filter(p => p.status === 'ACTIVE');
  } catch (e) {
    console.error("Failed to load active promotions", e);
  }

  const isAdmin = (await headers()).get("x-is-admin") === "true";

  if (isAdmin) {
    return (
      <html lang="en" className={`${cormorant.variable} ${dmMono.variable} ${jost.variable}`}>
        <body className="bg-white text-obsidian">
          {children}
        </body>
      </html>
    );
  }

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
        <AppearanceProvider initialConfig={(appearanceConfig as any) || undefined}>
          <StoreProviders allProducts={allProducts} initialGeeMarketId={geeMarketId} activePromotions={activePromotions}>
            {children}
            <PreviewBanner />
          </StoreProviders>
        </AppearanceProvider>
      </body>
    </html>
  );
}

