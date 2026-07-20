"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { normalizeSectionData } from "@/lib/types/homepage";
import { JournalArticle } from "@/lib/types/journal";
import { Observability } from "@/lib/infrastructure/observability";

interface Props {
  cmsData: any;
  sectionId: string;
}

export default function JournalSection({ cmsData, sectionId }: Props) {
  const norm = normalizeSectionData(cmsData);
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const preview = window.location.search.includes("preview=true");
    setIsPreview(preview);

    fetch("/api/journal")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.articles) {
          const visible = d.articles.filter((a: JournalArticle) => a.status === "Published" || preview);
          setArticles(visible);
        }
      })
      .catch(Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error"));
  }, []);

  const layout = norm.journalConfig?.layout || "magazine-grid";
  const articleCount = norm.journalConfig?.articleCount || 3;
  const displayArticles = articles.slice(0, articleCount);

  if (displayArticles.length === 0) {
    if (isPreview) {
      return (
        <section id={sectionId} className="w-full relative px-4 py-32 flex items-center justify-center bg-gray-50 border-y border-dashed border-gray-200">
           <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Journal Section (No articles found)</p>
        </section>
      );
    }
    return null;
  }

  return (
    <section 
      id={sectionId} 
      className="w-full relative px-4 md:px-12 py-16 md:py-32"
      style={{ backgroundColor: norm.style.backgroundColor }}
    >
      <div className="max-w-[1600px] mx-auto flex flex-col items-center">
        {/* Header */}
        {(norm.content.heading || norm.content.description) && (
          <div className="text-center mb-16 md:mb-24 flex flex-col items-center max-w-2xl">
            {norm.content.heading && (
              <h2 
                className="uppercase tracking-[0.2em] mb-4 ml-[0.2em]"
                style={{ 
                  color: norm.style.heading.textColor,
                  fontSize: `${norm.style.heading.fontSize}rem`
                }}
              >
                {norm.content.heading}
              </h2>
            )}
            {norm.content.description && (
              <p 
                style={{ 
                  color: norm.style.description.textColor,
                  fontSize: `${norm.style.description.fontSize}rem`
                }}
              >
                {norm.content.description}
              </p>
            )}
          </div>
        )}

        {/* Layouts */}
        {layout === "magazine-grid" && (
          <div className={`grid grid-cols-1 gap-8 md:gap-12 w-full ${
            displayArticles.length === 1 ? "md:grid-cols-1 max-w-2xl" : 
            displayArticles.length === 2 ? "md:grid-cols-2 max-w-4xl" : 
            "md:grid-cols-3"
          }`}>
            {displayArticles.map(article => {
              const cardImg = article.thumbnailImage?.url || article.heroImage?.url;
              return (
              <Link href={isPreview ? `/journal/${article.slug}?preview=true` : `/journal/${article.slug}`} key={article.id} className="group flex flex-col gap-4">
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  {cardImg ? (
                    <img src={cardImg} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 text-center items-center">
                  <span className="text-[0.65rem] uppercase tracking-widest text-gray-500">{article.category}</span>
                  <h3 className="text-lg md:text-xl font-light text-[#1a1a18]">{article.title}</h3>
                </div>
              </Link>
              );
            })}
          </div>
        )}

        {layout === "editorial-split" && (
          <div className="flex flex-col gap-24 w-full">
            {displayArticles.map((article, idx) => {
              const cardImg = article.thumbnailImage?.url || article.heroImage?.url;
              return (
              <div key={article.id} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}>
                <Link href={isPreview ? `/journal/${article.slug}?preview=true` : `/journal/${article.slug}`} className="w-full md:w-1/2 relative aspect-[3/4] bg-gray-100 overflow-hidden group">
                  {cardImg ? (
                    <img src={cardImg} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </Link>
                <div className="w-full md:w-1/2 flex flex-col gap-6 justify-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-500">{article.category}</span>
                  <h3 className="text-3xl md:text-5xl font-light text-[#1a1a18] leading-tight">{article.title}</h3>
                  <p className="text-lg text-gray-600 font-light">{article.subtitle}</p>
                  <Link href={isPreview ? `/journal/${article.slug}?preview=true` : `/journal/${article.slug}`} className="text-xs uppercase tracking-[0.15em] border-b border-[#1a1a18] self-start pb-1 mt-4 hover:text-gray-500 hover:border-gray-500 transition-colors">
                    Read Story
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {layout === "large-feature" && (
          <div className="flex flex-col gap-12 w-full">
            {displayArticles.map(article => {
              const cardImg = article.thumbnailImage?.url || article.heroImage?.url;
              return (
              <Link href={isPreview ? `/journal/${article.slug}?preview=true` : `/journal/${article.slug}`} key={article.id} className="group relative w-full aspect-square md:aspect-[21/9] bg-gray-100 overflow-hidden flex items-end p-8 md:p-16">
                {cardImg ? (
                  <img src={cardImg} alt={article.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-4 text-white max-w-2xl">
                  <span className="text-xs uppercase tracking-[0.2em] opacity-80">{article.category}</span>
                  <h3 className="text-3xl md:text-5xl font-light leading-tight">{article.title}</h3>
                </div>
              </Link>
              );
            })}
          </div>
        )}

        {layout === "carousel" && (
          <div className="flex overflow-x-auto gap-8 w-full snap-x snap-mandatory pb-8 hide-scrollbar">
            {displayArticles.map(article => {
              const cardImg = article.thumbnailImage?.url || article.heroImage?.url;
              return (
              <Link href={isPreview ? `/journal/${article.slug}?preview=true` : `/journal/${article.slug}`} key={article.id} className="group flex-shrink-0 w-[85vw] md:w-[400px] flex flex-col gap-4 snap-start">
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  {cardImg ? (
                    <img src={cardImg} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[0.65rem] uppercase tracking-widest text-gray-500">{article.category}</span>
                  <h3 className="text-xl font-light text-[#1a1a18]">{article.title}</h3>
                </div>
              </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
