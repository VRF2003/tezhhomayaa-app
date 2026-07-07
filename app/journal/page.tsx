import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getJournalArticles } from "@/lib/journal";

export const dynamic = "force-dynamic";

export default function JournalIndexPage() {
  const allArticles = getJournalArticles().filter(a => a.status === "Published");
  
  // Sort by manual order first
  allArticles.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  if (allArticles.length === 0) {
    return (
      <main className="min-h-screen bg-white" id="main-content">
        <Navbar />
        <div className="pt-40 pb-24 px-4 text-center">
          <h1 className="text-3xl font-light text-[#1a1a18]">Journal</h1>
          <p className="mt-4 text-gray-500">Stories coming soon.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const [heroArticle, ...gridArticles] = allArticles;

  return (
    <main className="min-h-screen bg-white" id="main-content">
      <Navbar />
      
      {/* Hero Article (Editor's Choice #1) */}
      <section className="w-full pt-40 md:pt-64">
        <Link href={`/journal/${heroArticle.slug}`} className="block relative w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden group">
          {heroArticle.heroImage?.url ? (
            <img 
              src={heroArticle.heroImage.url} 
              alt={heroArticle.heroImage.alt || heroArticle.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24 z-10 text-white">
            <span className="text-xs tracking-[0.2em] uppercase opacity-80 mb-4">{heroArticle.category}</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight max-w-4xl mb-6">
              {heroArticle.title}
            </h2>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mb-8">
              {heroArticle.subtitle}
            </p>
            <span className="text-xs uppercase tracking-[0.15em] border-b border-white/50 self-start pb-1 hover:border-white transition-colors">
              Read Story
            </span>
          </div>
        </Link>
      </section>

      {/* Grid Articles */}
      {gridArticles.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-16 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-24">
            {gridArticles.map(article => (
              <Link href={`/journal/${article.slug}`} key={article.id} className="group flex flex-col gap-6">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  {article.heroImage?.url ? (
                    <img 
                      src={article.heroImage.url} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-widest text-gray-500">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.readingTime}</span>
                  </div>
                  <h3 className="text-2xl font-light text-[#1a1a18] group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-light line-clamp-2">
                    {article.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
