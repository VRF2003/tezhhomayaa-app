import { getProductsByCategory, getAllProducts } from "./lib/collections";
console.log("All products:", getAllProducts().map(p => p.category));
console.log("Matched:", getProductsByCategory("women/bags/mini-bags").map(p => p.name));
