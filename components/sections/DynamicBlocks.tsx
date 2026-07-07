"use client";

import dynamic from "next/dynamic";

const Loader = () => <div className="h-48 w-full bg-[#f0ece6] animate-pulse flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400">Loading...</div>;

// --- Media Blocks ---
export const EditorialImageGallery = dynamic(() => import("./EditorialMediaBlocks").then(m => m.EditorialImageGallery), { loading: Loader });
export const EditorialMasonryGallery = dynamic(() => import("./EditorialMediaBlocks").then(m => m.EditorialMasonryGallery), { loading: Loader });
export const EditorialVideo = dynamic(() => import("./EditorialMediaBlocks").then(m => m.EditorialVideo), { loading: Loader });
export const EditorialYouTube = dynamic(() => import("./EditorialMediaBlocks").then(m => m.EditorialYouTube), { loading: Loader });
export const EditorialImageHotspots = dynamic(() => import("./EditorialMediaBlocks").then(m => m.EditorialImageHotspots), { loading: Loader });

// --- Commerce Blocks ---
export const EditorialShopTheStory = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialShopTheStory), { loading: Loader });
export const EditorialProductCarousel = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialProductCarousel), { loading: Loader });
export const EditorialRelatedProducts = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialRelatedProducts), { loading: Loader });
export const EditorialCompleteTheLook = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialCompleteTheLook), { loading: Loader });
export const EditorialFeaturedCollection = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialFeaturedCollection), { loading: Loader });
export const EditorialNewsletter = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialNewsletter), { loading: Loader });
export const EditorialRelatedStories = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialRelatedStories), { loading: Loader });
export const EditorialCTA = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialCTA), { loading: Loader });
export const EditorialRecentlyViewed = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialRecentlyViewed), { loading: Loader });
export const EditorialYouMayAlsoLike = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialYouMayAlsoLike), { loading: Loader });
export const EditorialStickyPurchaseBar = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialStickyPurchaseBar), { ssr: false });
export const EditorialFloatingWishlist = dynamic(() => import("./EditorialCommerceBlocks").then(m => m.EditorialFloatingWishlist), { ssr: false });

// --- Content Blocks ---
export const AdvRichTextBlock = dynamic(() => import("./EditorialContentBlocks").then(m => m.AdvRichTextBlock), { loading: Loader });
export const AdvRawHTMLBlock = dynamic(() => import("./EditorialContentBlocks").then(m => m.AdvRawHTMLBlock), { loading: Loader });
export const AdvCodeBlock = dynamic(() => import("./EditorialContentBlocks").then(m => m.AdvCodeBlock), { loading: Loader });
export const AdvFounderQuote = dynamic(() => import("./EditorialContentBlocks").then(m => m.AdvFounderQuote), { loading: Loader });
export const AdvDownloadBlock = dynamic(() => import("./EditorialContentBlocks").then(m => m.AdvDownloadBlock), { loading: Loader });
export const AdvContactBlock = dynamic(() => import("./EditorialContentBlocks").then(m => m.AdvContactBlock), { loading: Loader });

// --- Data Blocks ---
export const AdvTimeline = dynamic(() => import("./EditorialDataBlocks").then(m => m.AdvTimeline), { loading: Loader });
export const AdvStatistics = dynamic(() => import("./EditorialDataBlocks").then(m => m.AdvStatistics), { loading: Loader });
export const AdvFAQ = dynamic(() => import("./EditorialDataBlocks").then(m => m.AdvFAQ), { loading: Loader });
export const AdvTabs = dynamic(() => import("./EditorialDataBlocks").then(m => m.AdvTabs), { loading: Loader });
export const AdvTable = dynamic(() => import("./EditorialDataBlocks").then(m => m.AdvTable), { loading: Loader });

// --- Layout Blocks ---
export const AdvAwards = dynamic(() => import("./EditorialLayoutBlocks").then(m => m.AdvAwards), { loading: Loader });
export const AdvPressLogos = dynamic(() => import("./EditorialLayoutBlocks").then(m => m.AdvPressLogos), { loading: Loader });
export const AdvSustainability = dynamic(() => import("./EditorialLayoutBlocks").then(m => m.AdvSustainability), { loading: Loader });
export const AdvBrandValues = dynamic(() => import("./EditorialLayoutBlocks").then(m => m.AdvBrandValues), { loading: Loader });

// --- Interactive Blocks ---
export const AdvBeforeAfter = dynamic(() => import("./EditorialInteractiveBlocks").then(m => m.AdvBeforeAfter), { loading: Loader, ssr: false });
export const AdvAudioBlock = dynamic(() => import("./EditorialInteractiveBlocks").then(m => m.AdvAudioBlock), { loading: Loader, ssr: false });
export const AdvStoreLocator = dynamic(() => import("./EditorialInteractiveBlocks").then(m => m.AdvStoreLocator), { loading: Loader });
export const AdvEventCountdown = dynamic(() => import("./EditorialInteractiveBlocks").then(m => m.AdvEventCountdown), { loading: Loader });
export const AdvBentoGrid = dynamic(() => import("./EditorialInteractiveBlocks").then(m => m.AdvBentoGrid), { loading: Loader });

// Hero (often LCP, optionally keep static, but we'll make it dynamic with high priority in use cases)
export const EditorialHero = dynamic(() => import("./EditorialBlocks").then(m => m.EditorialHero), { loading: () => <div className="h-screen w-full bg-[#f0ece6] animate-pulse" /> });
