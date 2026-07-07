"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

export type UniversalMediaData = {
  type: "image" | "video" | "mixed";
  desktop: { url: string; sizeBytes?: number; width?: number; height?: number };
  mobile: { url: string; sizeBytes?: number; width?: number; height?: number };
  poster: { url: string };
  videoSettings: {
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    controls: boolean;
    lazyLoad: boolean;
    playOnHover: boolean;
  };
};

export type UniversalMediaProps = {
  media?: UniversalMediaData;
  fallbackDesktopUrl?: string;
  fallbackMobileUrl?: string;
  fallbackVideoUrl?: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function UniversalMediaRenderer({
  media,
  fallbackDesktopUrl,
  fallbackMobileUrl,
  fallbackVideoUrl,
  priority = false,
  fill = true,
  className = "",
  style = {},
}: UniversalMediaProps) {
  const [isHovered, setIsHovered] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Fallback construction if media is missing
  const activeMedia: UniversalMediaData = media || {
    type: fallbackVideoUrl ? "video" : "image",
    desktop: { url: fallbackVideoUrl || fallbackDesktopUrl || "" },
    mobile: { url: fallbackMobileUrl || fallbackDesktopUrl || "" },
    poster: { url: fallbackDesktopUrl || "" },
    videoSettings: {
      autoplay: true,
      loop: true,
      muted: true,
      controls: false,
      lazyLoad: !priority,
      playOnHover: false,
    },
  };

  const { type, desktop, mobile, poster, videoSettings } = activeMedia;

  const defaultVideoSettings = {
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    playOnHover: false
  };

  const safeVideoSettings = {
    ...defaultVideoSettings,
    ...(videoSettings || {})
  };

  useEffect(() => {
    if (safeVideoSettings.playOnHover) {
      if (isHovered) {
        desktopVideoRef.current?.play().catch(() => {});
        mobileVideoRef.current?.play().catch(() => {});
      } else {
        desktopVideoRef.current?.pause();
        mobileVideoRef.current?.pause();
      }
    }
  }, [isHovered, safeVideoSettings.playOnHover]);

  const renderVideo = (
    url: string,
    displayClass: string,
    ref: React.RefObject<HTMLVideoElement | null>
  ) => {
    if (!url) return null;
    return (
      <video
        ref={ref}
        src={url}
        poster={poster?.url || ""}
        autoPlay={safeVideoSettings.autoplay && !safeVideoSettings.playOnHover}
        loop={safeVideoSettings.loop}
        muted={safeVideoSettings.muted}
        controls={safeVideoSettings.controls}
        playsInline
        className={`${displayClass} ${className}`}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: fill ? "absolute" : "relative",
          inset: fill ? 0 : "auto",
          ...style,
        }}
        preload={videoSettings.lazyLoad ? "metadata" : "auto"}
      />
    );
  };

  const renderImage = (dUrl: string, mUrl: string) => {
    if (!dUrl && !mUrl) return null;
    return (
      <picture className={className} style={{ position: fill ? "absolute" : "relative", inset: fill ? 0 : "auto", width: "100%", height: "100%", ...style }}>
        {mUrl && <source media="(max-width: 768px)" srcSet={mUrl} />}
        <img
          src={dUrl || mUrl}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </picture>
    );
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: fill ? "absolute" : "relative",
        inset: fill ? 0 : "auto",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {type === "video" && (
        <>
          {renderVideo(mobile.url, "md:hidden block", mobileVideoRef)}
          {renderVideo(desktop.url, "hidden md:block", desktopVideoRef)}
        </>
      )}

      {type === "image" && renderImage(desktop.url, mobile.url)}

      {type === "mixed" && (
        <>
          {/* Infer type by extension for mixed mode */}
          {mobile.url.match(/\.(mp4|webm|ogg)$/i) ? (
            renderVideo(mobile.url, "md:hidden block", mobileVideoRef)
          ) : (
            <div className="md:hidden block w-full h-full relative">
              {renderImage(mobile.url, mobile.url)}
            </div>
          )}

          {desktop.url.match(/\.(mp4|webm|ogg)$/i) ? (
            renderVideo(desktop.url, "hidden md:block", desktopVideoRef)
          ) : (
            <div className="hidden md:block w-full h-full relative">
              {renderImage(desktop.url, desktop.url)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
