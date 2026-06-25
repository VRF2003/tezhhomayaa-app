import fs from 'fs';
import path from 'path';

const basePath = '/Users/sarang/Desktop/tezhhomayaa-app/app';

const allCategories = [
  // Men
  'men/new-in',
  'men/bags/tote-bags',
  'men/bags/backpacks',
  'men/bags/travel-bags',
  'men/ready-to-wear/shirts',
  'men/ready-to-wear/t-shirts-polos',
  'men/ready-to-wear/trousers-shorts',
  'men/ready-to-wear/tracksuits-sweatshirts',
  'men/ready-to-wear/coats-jackets',
  'men/accessories',
  // Women
  'women/new-in',
  'women/bags/tote-bags',
  'women/bags/shoulder-bags',
  'women/bags/mini-bags',
  'women/ready-to-wear/tops-shirts',
  'women/ready-to-wear/dresses-jumpsuits',
  'women/ready-to-wear/pants-shorts',
  'women/ready-to-wear/skirts',
  'women/ready-to-wear/sweatshirts',
  'women/accessories',
  // Fragrances
  'fragrances/men',
  'fragrances/women'
];

for (const cat of allCategories) {
  const catDir = path.join(basePath, cat);
  
  // Create category folder if it doesn't exist
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }

  // Create Collection page
  const collectionPagePath = path.join(catDir, 'page.tsx');
  if (!fs.existsSync(collectionPagePath)) {
    const title = cat.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const content = `import CollectionPage from "@/components/layout/CollectionPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title} | TEZHHOMAYAA",
  description: "${title} collection.",
};

export default function Page() {
  return <CollectionPage categoryKey="${cat}" />;
}
`;
    fs.writeFileSync(collectionPagePath, content);
  }

  // Create Product route page inside the category
  const slugDir = path.join(catDir, '[slug]');
  if (!fs.existsSync(slugDir)) {
    fs.mkdirSync(slugDir, { recursive: true });
  }

  const productPagePath = path.join(slugDir, 'page.tsx');
  const productContent = `import ProductPage, { generateMetadata } from "@/app/products/[slug]/page";
export { generateMetadata };
export default ProductPage;
`;
  fs.writeFileSync(productPagePath, productContent);
}

// Also make sure parent folders like men/bags, women/ready-to-wear get [slug]/page.tsx just in case
const parentDirs = [
  'men', 'men/bags', 'men/ready-to-wear',
  'women', 'women/bags', 'women/ready-to-wear',
  'fragrances'
];

for (const p of parentDirs) {
  const slugDir = path.join(basePath, p, '[slug]');
  if (!fs.existsSync(slugDir)) {
    fs.mkdirSync(slugDir, { recursive: true });
  }
  const productPagePath = path.join(slugDir, 'page.tsx');
  const productContent = `import ProductPage, { generateMetadata } from "@/app/products/[slug]/page";
export { generateMetadata };
export default ProductPage;
`;
  fs.writeFileSync(productPagePath, productContent);
}

console.log("Routing generation complete.");
