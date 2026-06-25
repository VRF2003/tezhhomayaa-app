"use client";

import React, { useState, useEffect } from "react";
import { UniversalMediaData } from "@/components/sections/UniversalMediaRenderer";

export type UniversalMediaBuilderProps = {
  label: string;
  media: UniversalMediaData;
  pendingDesktopFile: File | null;
  pendingMobileFile: File | null;
  onMediaChange: (media: UniversalMediaData) => void;
  onDesktopFileChange: (file: File | null) => void;
  onMobileFileChange: (file: File | null) => void;
  recommendedAspect?: string;
  recommendedSize?: string;
};

function formatBytes(bytes: number) {
  if (!bytes) return "Unknown";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function UniversalMediaBuilder({
  label,
  media,
  pendingDesktopFile,
  pendingMobileFile,
  onMediaChange,
  onDesktopFileChange,
  onMobileFileChange,
  recommendedAspect = "Any",
  recommendedSize = "Any",
}: UniversalMediaBuilderProps) {
  const [dDim, setDDim] = useState<string | null>(null);
  const [mDim, setMDim] = useState<string | null>(null);
  const [dSize, setDSize] = useState<number | null>(null);
  const [mSize, setMSize] = useState<number | null>(null);

  const displayDesktopUrl = pendingDesktopFile ? URL.createObjectURL(pendingDesktopFile) : media.desktop.url;
  const displayMobileUrl = pendingMobileFile ? URL.createObjectURL(pendingMobileFile) : media.mobile.url;

  const isDesktopVideo = displayDesktopUrl?.match(/\.(mp4|webm|ogg)$/i) || pendingDesktopFile?.type.startsWith("video/");
  const isMobileVideo = displayMobileUrl?.match(/\.(mp4|webm|ogg)$/i) || pendingMobileFile?.type.startsWith("video/");

  useEffect(() => {
    if (pendingDesktopFile) setDSize(pendingDesktopFile.size);
    else setDSize(media.desktop.sizeBytes || null);
  }, [pendingDesktopFile, media.desktop.sizeBytes]);

  useEffect(() => {
    if (pendingMobileFile) setMSize(pendingMobileFile.size);
    else setMSize(media.mobile.sizeBytes || null);
  }, [pendingMobileFile, media.mobile.sizeBytes]);

  const handleLoad = (e: any, isVideo: boolean, setDim: any, setMediaDim: (w: number, h: number) => void) => {
    const w = isVideo ? e.target.videoWidth : e.target.naturalWidth;
    const h = isVideo ? e.target.videoHeight : e.target.naturalHeight;
    setDim(`${w} × ${h}`);
    setMediaDim(w, h);
  };

  const updateSettings = (key: keyof UniversalMediaData["videoSettings"], val: boolean) => {
    onMediaChange({
      ...media,
      videoSettings: { ...media.videoSettings, [key]: val },
    });
  };

  return (
    <div style={{ border: "1px solid #e8e4df", background: "#fafaf8", borderRadius: "2px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1rem", borderBottom: "1px solid #e8e4df", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff" }}>
        <h4 style={{ margin: 0, fontSize: "0.85rem", color: "#1a1a18", fontWeight: 500, letterSpacing: "0.02em" }}>{label}</h4>
        <select
          value={media.type}
          onChange={(e) => onMediaChange({ ...media, type: e.target.value as any })}
          style={{ padding: "0.4rem 0.8rem", border: "1px solid #ccc9c4", borderRadius: "2px", fontSize: "0.75rem", background: "#fff" }}
        >
          <option value="image">Media Type: Image</option>
          <option value="video">Media Type: Video</option>
          <option value="mixed">Media Type: Mixed</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#e8e4df" }}>
        
        {/* Desktop Media */}
        <div style={{ background: "#fafaf8", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Desktop Media</span>
            {pendingDesktopFile && <span style={{ fontSize: "0.6rem", color: "#2d6b3a", background: "#e8f5e9", padding: "0.25rem 0.5rem", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>New File</span>}
          </div>
          
          <div style={{ width: "100%", aspectRatio: "16/9", background: "#f0ece6", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            {displayDesktopUrl ? (
              isDesktopVideo ? (
                <video src={displayDesktopUrl} onLoadedMetadata={(e) => handleLoad(e, true, setDDim, (w, h) => onMediaChange({ ...media, desktop: { ...media.desktop, width: w, height: h } }))} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <img src={displayDesktopUrl} onLoad={(e) => handleLoad(e, false, setDDim, (w, h) => onMediaChange({ ...media, desktop: { ...media.desktop, width: w, height: h } }))} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              )
            ) : (
              <span style={{ color: "#9a9690", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>No Media</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: "0.65rem", color: "#6b6865", lineHeight: 1.6 }}>
              <div><strong style={{ color: "#1a1a18", fontWeight: 500 }}>Dimensions:</strong> {dDim || (media.desktop.width ? `${media.desktop.width} × ${media.desktop.height}` : "Unknown")}</div>
              <div><strong style={{ color: "#1a1a18", fontWeight: 500 }}>Size:</strong> {formatBytes(dSize || media.desktop.sizeBytes || 0)}</div>
            </div>
            <label style={{ cursor: "pointer", display: "inline-block", padding: "0.4rem 0.8rem", background: "#ffffff", color: "#1a1a18", border: "1px solid #1a1a18", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: "2px", transition: "all 0.2s" }}>
              {displayDesktopUrl ? "Replace" : "Upload"}
              <input type="file" accept="image/*,video/*" onChange={(e) => { if(e.target.files?.[0]) onDesktopFileChange(e.target.files[0]) }} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        {/* Mobile Media */}
        <div style={{ background: "#fafaf8", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6865" }}>Mobile Media</span>
            {pendingMobileFile && <span style={{ fontSize: "0.6rem", color: "#2d6b3a", background: "#e8f5e9", padding: "0.25rem 0.5rem", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "0.1em" }}>New File</span>}
          </div>
          
          <div style={{ width: "100%", aspectRatio: "9/16", maxWidth: "200px", margin: "0 auto", background: "#f0ece6", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            {displayMobileUrl ? (
              isMobileVideo ? (
                <video src={displayMobileUrl} onLoadedMetadata={(e) => handleLoad(e, true, setMDim, (w, h) => onMediaChange({ ...media, mobile: { ...media.mobile, width: w, height: h } }))} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <img src={displayMobileUrl} onLoad={(e) => handleLoad(e, false, setMDim, (w, h) => onMediaChange({ ...media, mobile: { ...media.mobile, width: w, height: h } }))} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              )
            ) : (
              <span style={{ color: "#9a9690", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>No Media</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: "0.65rem", color: "#6b6865", lineHeight: 1.6 }}>
              <div><strong style={{ color: "#1a1a18", fontWeight: 500 }}>Dimensions:</strong> {mDim || (media.mobile.width ? `${media.mobile.width} × ${media.mobile.height}` : "Unknown")}</div>
              <div><strong style={{ color: "#1a1a18", fontWeight: 500 }}>Size:</strong> {formatBytes(mSize || media.mobile.sizeBytes || 0)}</div>
            </div>
            <label style={{ cursor: "pointer", display: "inline-block", padding: "0.4rem 0.8rem", background: "#ffffff", color: "#1a1a18", border: "1px solid #1a1a18", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: "2px", transition: "all 0.2s" }}>
              {displayMobileUrl ? "Replace" : "Upload"}
              <input type="file" accept="image/*,video/*" onChange={(e) => { if(e.target.files?.[0]) onMobileFileChange(e.target.files[0]) }} style={{ display: "none" }} />
            </label>
          </div>
        </div>

      </div>

      <div style={{ padding: "1rem 1.5rem", background: "#ffffff", borderTop: "1px solid #e8e4df", display: "flex", gap: "2rem" }}>
        <div style={{ fontSize: "0.65rem", color: "#6b6865" }}><strong style={{ color: "#1a1a18" }}>Recommended Dimensions:</strong> {recommendedSize}</div>
        <div style={{ fontSize: "0.65rem", color: "#6b6865" }}><strong style={{ color: "#1a1a18" }}>Aspect Ratio:</strong> {recommendedAspect}</div>
      </div>

      {(media.type === "video" || media.type === "mixed") && (
        <div style={{ padding: "1rem 1.5rem", background: "#fafaf8", borderTop: "1px solid #e8e4df" }}>
          <h5 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem", color: "#1a1a18" }}>Video Settings</h5>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" checked={media.videoSettings.autoplay} onChange={e => updateSettings("autoplay", e.target.checked)} /> Autoplay</label>
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" checked={media.videoSettings.loop} onChange={e => updateSettings("loop", e.target.checked)} /> Loop</label>
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" checked={media.videoSettings.muted} onChange={e => updateSettings("muted", e.target.checked)} /> Muted</label>
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" checked={media.videoSettings.controls} onChange={e => updateSettings("controls", e.target.checked)} /> Show Controls</label>
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" checked={media.videoSettings.lazyLoad} onChange={e => updateSettings("lazyLoad", e.target.checked)} /> Lazy Load</label>
            <label style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><input type="checkbox" checked={media.videoSettings.playOnHover} onChange={e => updateSettings("playOnHover", e.target.checked)} /> Play On Hover</label>
          </div>
        </div>
      )}
    </div>
  );
}
