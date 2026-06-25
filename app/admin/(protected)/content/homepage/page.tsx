"use client";

import { LivePreviewBuilder } from "@/components/admin/LivePreviewBuilder";

export default function HomepageBuilderPage() {
  return (
    <LivePreviewBuilder 
      apiEndpoint="/api/homepage"
      pageTitle="Homepage Builder"
      backUrl="/admin/content"
      previewUrl="/?preview=true"
    />
  );
}
