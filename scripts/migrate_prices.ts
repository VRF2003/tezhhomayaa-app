import fs from "fs";
import path from "path";

const productsPath = path.join(process.cwd(), "lib", "products.json");

try {
  const data = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  let updated = 0;
  for (const product of data) {
    if (typeof product.price === "string") {
      const parsed = parseFloat(product.price.replace(/[^\d.]/g, ""));
      if (!isNaN(parsed)) {
        product.price = parsed;
        updated++;
      }
    }
    
    // Convert variant prices too
    if (Array.isArray(product.variants)) {
      for (const variant of product.variants) {
        if (typeof variant.price === "string") {
          const parsed = parseFloat(variant.price.replace(/[^\d.]/g, ""));
          if (!isNaN(parsed)) {
            variant.price = parsed;
          }
        }
      }
    }
  }

  fs.writeFileSync(productsPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Successfully migrated ${updated} products in products.json.`);
} catch (e) {
  console.error("Migration failed:", e);
}
