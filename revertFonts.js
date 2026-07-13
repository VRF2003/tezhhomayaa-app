const fs = require('fs');

const files = [
  "app/admin/(protected)/content/page.tsx",
  "app/cart/page.tsx",
  "app/globals.css",
  "app/wishlist/page.tsx",
  "components/sections/ProductGrid.tsx",
  "components/sections/ShopBanner.tsx",
  "components/sections/CampaignStory.tsx",
  "components/ecommerce/SearchOverlay.tsx",
  "components/ecommerce/MiniCart.tsx",
  "components/layout/Navbar.tsx",
  "components/layout/CollectionPageUI.tsx",
  "components/layout/CurrencySelector.tsx",
  "components/layout/ProductDetailPage.tsx",
  "components/admin/CommerceBuilder.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/var\(--font-jost, sans-serif\)/g, "var(--font-cormorant, serif)");
  content = content.replace(/var\(--font-jost, 'Jost'\)/g, "var(--font-cormorant, 'Cormorant Garamond')");
  content = content.replace(/var\(--font-jost\)/g, "var(--font-cormorant, serif)");
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
}
