import { Product } from './collections';

export function adaptShopifyProduct(node: any): Product {
  // Extract images
  const images = node.images?.edges?.map((e: any) => e.node.url) || [];
  
  // Resolve Horizontal Image Metafield (Option 1 Strategy)
  const horizontalImageUrl = node.horizontalImage?.reference?.image?.url;
  
  // Primary Image Logic: Use Metafield if available, otherwise fallback to standard first image
  const primaryImage = horizontalImageUrl || images[0] || '';
  const hoverImage = images.length > 1 ? images[1] : undefined;
  
  // ─── Map existing Shopify tags to Next.js Category Structure ───
  let gender = 'women';
  if (node.tags?.includes('gender_men')) gender = 'men';
  if (node.tags?.includes('gender_unisex')) gender = 'unisex';

  let subCategory = 'ready-to-wear';
  if (node.tags?.some((t: string) => t.includes('bag'))) subCategory = 'bags';
  if (node.tags?.some((t: string) => t.includes('fragrance'))) subCategory = 'fragrances';

  let itemCategory = '';
  // Most specific tags first so products with multiple tags get classified correctly
  if (node.tags?.some((t: string) => t.toLowerCase().includes('dress') || t.toLowerCase().includes('jumpsuit'))) itemCategory = 'dresses-jumpsuits';
  else if (node.tags?.some((t: string) => t.toLowerCase().includes('coat') || t.toLowerCase().includes('jacket') || t.toLowerCase().includes('hoodie'))) itemCategory = 'coats-jackets';
  else if (node.tags?.some((t: string) => t.includes('trouser') || t.includes('short') || t.includes('bottom') || t.includes('pant'))) itemCategory = gender === 'men' ? 'trousers-shorts' : 'pants-shorts';
  else if (node.tags?.some((t: string) => t.includes('polo') || t.includes('t_shirt'))) itemCategory = 't-shirts-polos';
  else if (node.tags?.some((t: string) => t.includes('shirt') || t.includes('top'))) itemCategory = gender === 'men' ? 'shirts' : 'tops-shirts';

  let mappedCategory = `${gender}/${subCategory}`;
  if (itemCategory && subCategory === 'ready-to-wear') {
      mappedCategory += `/${itemCategory}`;
  }

  // Extract explicit category if it exists, otherwise use our smart mapping
  const categoryTag = node.tags?.find((t: string) => t.startsWith('category:'));
  const category = categoryTag ? categoryTag.split(':')[1] : mappedCategory;
  const categoryLabel = node.productType || 'Product';

  // Extract Variants
  const variants = node.variants?.edges?.map((e: any) => {
    const vNode = e.node;
    return {
      id: vNode.id,
      optionName: vNode.selectedOptions?.[0]?.name || 'Size',
      option: vNode.selectedOptions?.[0]?.value || 'Default',
      price: vNode.price?.amount || '0',
      sku: vNode.sku || '',
      availableForSale: vNode.availableForSale
    };
  }) || [];

  // Remove HTML tags for editorial description if needed, or keep it.
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

  return {
    id: node.id,
    slug: node.handle,
    handle: node.handle,
    name: node.title,
    price: node.priceRange?.minVariantPrice?.amount || '0',
    image: primaryImage,
    hoverImage: hoverImage,
    gallery: images,
    category: category,
    categoryLabel: categoryLabel,
    href: `/product/${node.handle}`,
    editorialDescription: stripHtml(node.descriptionHtml || ''),
    tags: node.tags || [],
    variants: variants,
    status: 'active', // Live Shopify products returned by GraphQL are active
    sku: variants[0]?.sku || '',
  };
}

export function adaptShopifyProducts(edges: any[]): Product[] {
  if (!edges) return [];
  return edges.map((edge: any) => adaptShopifyProduct(edge.node));
}
