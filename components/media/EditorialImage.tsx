"use client";

import Image from "next/image";
import { useState } from "react";

// A tiny base64 SVG that acts as a solid #f0ece6 color placeholder
// In production, this would be replaced by actual BlurHashes generated via Plaiceholder on the backend.
const DEFAULT_BLUR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMGVjZTYiLz48L3N2Zz4=";

interface EditorialImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  blurDataURL?: string;
  sizes?: string;
  className?: string;
}

export const EditorialImage = ({
  src,
  alt,
  fill = true,
  width,
  height,
  priority = false,
  blurDataURL = DEFAULT_BLUR,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = ""
}: EditorialImageProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#f0ece6] ${fill ? "w-full h-full" : ""} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        quality={85} // Premium quality, defaults to 75
        onLoad={() => setIsReady(true)}
        className={`object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isReady ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};
