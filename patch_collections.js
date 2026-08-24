const fs = require('fs');
const path = './lib/collections.ts';
let code = fs.readFileSync(path, 'utf8');

// Replace getProductsByCategory function
const getProductsByCategoryStart = code.indexOf('export async function getProductsByCategory');
if (getProductsByCategoryStart === -1) {
  console.log('Could not find getProductsByCategory');
  process.exit(1);
}

const replacement = `
function getShopifyCollectionHandle(categoryKey: string): string | null {
  const parts = categoryKey.split('/');
  const lastPart = parts[parts.length - 1];
  
  if (lastPart === 'dresses-jumpsuits') return 'dresses-and-jumpsuits';
  if (lastPart === 'pants-shorts') return 'pants-and-shorts';
  if (lastPart === 'tops-shirts') return 'tops-and-shirts';
  if (lastPart === 'trousers-shorts') return 'trousers-and-shorts';
  if (lastPart === 'skirts') return 'skirts';
  if (lastPart === 'shirts') return 'shirts';
  if (lastPart === 't-shirts-polos') return 't-shirts-and-polos';
  if (lastPart === 'coats-jackets') return 'coats-and-jackets';
  
  if (lastPart === 'sweatshirts' && categoryKey.includes('women')) return 't-shirts-and-sweatshirts';
  if (lastPart === 'tracksuits-sweatshirts' && categoryKey.includes('men')) return 'tracksuit-and-sweatshirts';
  
  if (lastPart === 'bags') return 'bags';
  
  return null;
}

export async function getProductsByCategory(categoryKey: string): Promise<Product[]> {
  const merged = await getAllProducts();
  
  // Normalize by removing all spaces, hyphens, and special characters (keeping slashes)
  const normalize = (str: string) => (str || "").toLowerCase().replace(/[^a-z0-9\\/]+/g, '');
  const normKey = normalize(categoryKey);

  let filtered = merged.filter((p) => {
    const pCat = normalize(p.category);
    
    // 1. Exact match
    if (pCat === normKey) return true;
    
    // 2. Prefix match (e.g. 'men/ready-to-wear' loads 'men/ready-to-wear/shirts')
    if (pCat.startsWith(normKey + '/')) return true;
    
    // 3. Substring match for subcategories but strictly enforcing the department
    // E.g. 'dresses' in 'women/ready-to-wear/dresses'
    const pDept = pCat.split('/')[0];
    const nDept = normKey.split('/')[0];
    
    if (pDept === nDept) {
      if (normKey.includes(pCat) && pCat.length > 5) return true;
      if (pCat.includes(normKey) && normKey.length > 5) return true;
    }
    
    // Special top-level fallback
    if (categoryKey === "bags" && pCat.includes("bags")) return true;
    if (categoryKey === "fragrances" && pCat.startsWith("fragrances")) return true;
    
    return false;
  });

  // Attempt to fetch exact native order from Shopify Collection
  const shopifyHandle = getShopifyCollectionHandle(categoryKey);
  if (shopifyHandle) {
    try {
      const query = \`query { collection(handle: "\${shopifyHandle}") { products(first: 250) { edges { node { handle } } } } }\`;
      const data = await shopifyFetch({ query });
      if (data?.collection?.products?.edges) {
        const order = data.collection.products.edges.map((e: any) => e.node.handle);
        filtered.sort((a, b) => {
          const idxA = order.indexOf(a.slug);
          const idxB = order.indexOf(b.slug);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });
      }
    } catch (err) {
      console.error("Error fetching collection order", err);
    }
  }
  
  return filtered;
}
`;

// Extract existing getProductsByCategory block
const getProductsByCategoryEnd = code.indexOf('export async function productsByCategory', getProductsByCategoryStart);
if (getProductsByCategoryEnd === -1) {
    console.log('Could not find end of getProductsByCategory');
    process.exit(1);
}

code = code.substring(0, getProductsByCategoryStart) + replacement + "\n" + code.substring(getProductsByCategoryEnd);

fs.writeFileSync(path, code, 'utf8');
console.log('Patched collections.ts');
