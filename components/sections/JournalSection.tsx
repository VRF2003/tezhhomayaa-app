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

  const displayArticles = articles.slice(0, 2);

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
      className="w-full relative px-4 md:px-12 py-16 md:py-24 bg-white"
      style={{ backgroundColor: norm.style?.backgroundColor || '#ffffff' }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="w-full mb-12 flex flex-col items-center">
          <h2 className="font-dm-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#1a1a18]">
            Journal
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-12 w-full mb-16">
          {displayArticles.map((article, idx) => {
            const cardImg = article.thumbnailImage?.url || article.heroImage?.url;
            return (
              <Link 
                href={isPreview ? `/journal/${article.slug}?preview=true` : `/journal/${article.slug}`} 
                key={article.id} 
                className="group flex flex-col gap-5 w-full"
              >
                <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] bg-[#f7f5f2] overflow-hidden">
                  {cardImg ? (
                    <img 
                      src={cardImg} 
                      alt={article.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" 
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-dm-mono text-[0.55rem] uppercase tracking-widest text-gray-500">
                    {article.category}
                  </span>
                  <h3 className="font-cormorant text-xl md:text-2xl font-light text-[#1a1a18] leading-snug group-hover:text-gray-500 transition-colors duration-300">
                    {article.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Link */}
        <Link 
          href="/journal" 
          className="font-dm-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#1a1a18] border-b border-[#1a1a18] pb-[2px] hover:text-gray-500 hover:border-gray-500 transition-colors"
        >
          View Journal &rarr;
        </Link>
      </div>
    </section>
  );
}
