import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomepageClientWrapper from "@/components/sections/HomepageClientWrapper";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { MARKET_COOKIE_NAME, MarketService } from "@/lib/market/MarketService";
import LocalizedSection from "@/components/lep/LocalizedSection";
import { SectionSkeleton } from "@/components/lep/SectionSkeleton";
import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { SeoService } from "@/lib/seo/services/SeoService";
import { InMemorySeoRepository } from "@/lib/seo/repositories/InMemorySeoRepository";
import { RuntimeContextBuilder } from "@/lib/preview/services/RuntimeContextBuilder";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cookieStore = await cookies();
  const marketCode = cookieStore.get(MARKET_COOKIE_NAME)?.value;
  let currentMarket = MarketService.resolveMarket(null, marketCode, null);

  const runtime = await RuntimeContextBuilder.build();
  const previewPayload = await RuntimeContextBuilder.getPreviewPayload();
  if (previewPayload?.marketId) {
    currentMarket = MarketService.resolveMarket(null, previewPayload.marketId, null);
  }

  const seoService = new SeoService(new InMemorySeoRepository());
  const resolvedSeo = await seoService.resolveMetadata("homepage", currentMarket, runtime);

  if (!resolvedSeo) return {}; // Fallback to Next.js defaults if nothing resolves

  return {
    title: resolvedSeo.title,
    description: resolvedSeo.description,
    keywords: resolvedSeo.keywords,
    alternates: resolvedSeo.canonicalUrl ? { canonical: resolvedSeo.canonicalUrl } : undefined,
    robots: resolvedSeo.robots,
    openGraph: resolvedSeo.ogTitle ? {
      title: resolvedSeo.ogTitle,
      description: resolvedSeo.ogDescription || resolvedSeo.description,
      images: resolvedSeo.ogImage ? [{ url: resolvedSeo.ogImage }] : undefined,
    } : undefined,
    twitter: resolvedSeo.twitterTitle ? {
      title: resolvedSeo.twitterTitle,
      description: resolvedSeo.twitterDescription || resolvedSeo.description,
      images: resolvedSeo.twitterImage ? [resolvedSeo.twitterImage] : undefined,
    } : undefined,
  };
}

export default async function HomePage() {
  let homepageData = null;
  try {
    const filePath = path.join(process.cwd(), "lib", "homepage.json");
    if (fs.existsSync(filePath)) {
      homepageData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (err) {
    console.error("Could not load homepage data", err);
  }

  const sections = homepageData?.sections || [];

  const cookieStore = await cookies();
  const marketCode = cookieStore.get(MARKET_COOKIE_NAME)?.value;
  let currentMarket = MarketService.resolveMarket(null, marketCode, null);

  const runtime = await RuntimeContextBuilder.build();
  const previewPayload = await RuntimeContextBuilder.getPreviewPayload();
  if (previewPayload?.marketId) {
    currentMarket = MarketService.resolveMarket(null, previewPayload.marketId, null);
  }

  // Structured Data component from LSE
  const seoService = new SeoService(new InMemorySeoRepository());
  const resolvedSeo = await seoService.resolveMetadata("homepage", currentMarket, runtime);

  // We map LEP generic sections. For Phase 2.8.2, we target the Hero component explicitly.
  // IMPORTANT: The slug 'home-hero-banner' must match the slot name used in Campaign sections.
  console.log("APP PAGE SECTIONS LENGTH:", sections.length); const defaultHeroSection = sections.find((s: any) => s.type === "hero-slider");
  
  const lepSlots = {
    "hero-slider": (
      <Suspense fallback={<SectionSkeleton type="HERO" />}>
        <LocalizedSection slug="home-hero-banner" market={currentMarket} type="HERO" fallbackData={defaultHeroSection?.data} />
      </Suspense>
    )
  };

  return (
    <main id="main-content" aria-label="Tezhhomayaa homepage">
      <AnalyticsTracker type="PAGE_VIEW" market={currentMarket} pageId="homepage" />
      <Navbar />
      <HomepageClientWrapper initialSections={sections} lepSlots={lepSlots} />
      {resolvedSeo?.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(resolvedSeo.structuredData) }}
        />
      )}
      <Footer />
    </main>
  );
}
