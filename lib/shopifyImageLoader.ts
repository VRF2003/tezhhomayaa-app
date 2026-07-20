export default function shopifyImageLoader({ src, width, quality }: { src: string, width: number, quality?: number }) {
  const url = new URL(src);
  
  // Only apply sizing to Shopify CDN URLs
  if (url.hostname === "cdn.shopify.com") {
    // Shopify uses the 'width' parameter natively
    url.searchParams.set("width", width.toString());
  }

  return url.toString();
}
