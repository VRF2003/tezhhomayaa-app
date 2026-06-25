"use client";

import { useState, useEffect } from "react";
import CollectionPageUI from "@/components/layout/CollectionPageUI";

export default function CollectionPreviewProxy() {
  const [previewState, setPreviewState] = useState<any>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin if necessary, or just rely on iframe sandbox
      if (event.data?.type === "SYNC_COLLECTION_PREVIEW") {
        setPreviewState(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    // Let parent know we are ready to receive data
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!previewState) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "var(--font-dm-mono, monospace)", fontSize: "0.8rem", color: "#9a9690", background: "#f0ede8" }}>
        INITIALIZING PREVIEW...
      </div>
    );
  }

  // Hide the debugging panel for preview and bypass header spacer
  // We'll pass the dynamic smartCollection object directly to CollectionPageUI
  return (
    <div style={{ pointerEvents: "none" }}>
      <CollectionPageUI 
        categoryKey={previewState.slug || "preview"} 
        meta={{}} // Mock meta
        bannerData={null}
        finalProducts={previewState.products || []}
        totalRaw={previewState.products?.length || 0}
        totalActive={previewState.products?.length || 0}
        totalDraft={0}
        smartCollection={{
          title: previewState.title || "Collection Title",
          description: previewState.description || "",
          bannerImage: previewState.bannerImage || "",
          products: previewState.products || [],
          presentation: previewState.presentation || {}
        }}
      />
    </div>
  );
}
