import fs from "fs";
const raw = fs.readFileSync("./lib/products.json", "utf-8");
const products = JSON.parse(raw);
const categoryKey = "women/mini-bags";
const normalize = (str) => (str || "").toLowerCase().replace(/[^a-z0-9\/]+/g, '');
const normKey = normalize(categoryKey);

const matched = products.filter((p) => {
    if(p.status === "draft" || p.status === "archived") return false;
    const pCat = normalize(p.category);
    
    if (pCat === normKey) return true;
    if (pCat.startsWith(normKey + '/')) return true;
    
    const pDept = pCat.split('/')[0];
    const nDept = normKey.split('/')[0];
    
    if (pDept === nDept) {
      if (normKey.includes(pCat) && pCat.length > 5) return true;
      if (pCat.includes(normKey) && normKey.length > 5) return true;
    }
    
    if (categoryKey === "bags" && pCat.includes("bags")) return true;
    if (categoryKey === "fragrances" && pCat.startsWith("fragrances")) return true;
    
    return false;
});
console.log("Matched items for", categoryKey, ":", matched.length);
