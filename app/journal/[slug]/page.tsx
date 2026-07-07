import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getJournalArticleBySlug } from "@/lib/journal";
import { getJournalTheme } from "@/lib/journal-theme";
import HomepageClientWrapper from "@/components/sections/HomepageClientWrapper";

export const dynamic = "force-dynamic";

export async function generateMetadata(context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const article = getJournalArticleBySlug(slug);
  if (!article) return { title: "Not Found" };
  
  return {
    title: article.seo?.title || `${article.title} — TEZHHOMAYAA Journal`,
    description: article.seo?.description || article.subtitle,
    openGraph: {
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.subtitle,
      images: [article.seo?.openGraphImage || article.heroImage?.url].filter(Boolean),
    }
  };
}

export default async function JournalArticlePage(context: { params: Promise<{ slug: string }>, searchParams?: Promise<{ preview?: string }> }) {
  const { slug } = await context.params;
  const searchParams = context.searchParams ? await context.searchParams : {};
  const isPreview = searchParams.preview === "true";
  
  const article = getJournalArticleBySlug(slug);
  const theme = getJournalTheme();

  if (!article || (article.status !== "Published" && !isPreview)) {
    notFound();
  }

  // Transparent-to-white Navbar behavior should be passed to Navbar or handled via a specialized Layout wrapper.
  // We'll assume Navbar supports a prop or we wrap it in a client component later for the scroll effect.

  return (
    <main className="min-h-screen bg-[#fcfbf9]" id="main-content">
      <Navbar />
      
      {/* Editorial Block Rendering Engine */}
      {/* We reuse the HomepageClientWrapper which loops through sections and renders the blocks */}
      {article.sections && article.sections.length > 0 ? (
        <HomepageClientWrapper initialSections={article.sections} articleMetadata={article} />
      ) : (
        <div className="pt-40 text-center text-gray-500 py-32">
          This article has no content blocks yet.
        </div>
      )}

      {/* Story Navigation */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/journal" className="text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors">
            ← Previous Story
          </Link>
          <div className="text-center">
            <h3 className="text-sm uppercase tracking-[0.15em] mb-4">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-6">Subscribe for the latest editorials.</p>
            <div className="flex gap-2">
              <input placeholder="Email address" className="border-b border-gray-300 pb-2 text-sm outline-none" />
              <button className="text-xs uppercase tracking-widest border-b border-black pb-2">Subscribe</button>
            </div>
          </div>
          <Link href="/journal" className="text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors">
            Next Story →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
