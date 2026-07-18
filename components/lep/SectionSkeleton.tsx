import React from "react";

export function SectionSkeleton({ type }: { type: string }) {
  if (type === "HERO") {
    return (
      <div className="w-full h-[75dvh] md:h-[100dvh] bg-[#1a1a1a] animate-pulse flex flex-col items-center justify-center p-4">
        <div className="w-32 h-4 bg-white/10 rounded mb-4"></div>
        <div className="w-full max-w-2xl h-12 bg-white/10 rounded mb-6"></div>
        <div className="w-full max-w-lg h-6 bg-white/10 rounded"></div>
      </div>
    );
  }
  return <div className="w-full h-64 bg-gray-100 animate-pulse" />;
}
