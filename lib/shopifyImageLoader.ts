export default function shopifyImageLoader({ src, width, quality }: { src: string, width: number, quality?: number }) {
  try {
    // Provide a dummy base URL so relative paths don't crash the URL parser
    const url = new URL(src, "http://localhost");
    
    // Only apply sizing to Shopify CDN URLs
    if (url.hostname === "cdn.shopify.com") {
      // Shopify uses the 'width' parameter natively
      url.searchParams.set("width", width.toString());
      return url.toString();
    }
  } catch (e) {
    // If parsing fails, just return the original src
  }

  // For non-Shopify URLs (like /uploads/...), return them as-is
  // Next.js will serve them directly if unoptimized is false and no other loader applies,
  // or they just remain as the raw src if unoptimized is true
  return src;
}
