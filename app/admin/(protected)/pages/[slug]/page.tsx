"use client";

import { LivePreviewBuilder } from "@/components/admin/LivePreviewBuilder";
import { useParams, useSearchParams } from "next/navigation";

export default function PageBuilder() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const mode = searchParams.get("mode");

  const targetSlug = mode === "motion" ? `${slug}-motion` : slug;
  const displayTitle = mode === "motion" ? `${slug} (Motion Experience)` : slug;

  return (
    <LivePreviewBuilder 
      apiEndpoint={`/api/pages/${targetSlug}`}
      pageTitle={`Page Builder: ${displayTitle}`}
      backUrl="/admin/pages"
      previewUrl={`/${slug}?preview=true`}
    />
  );
}
