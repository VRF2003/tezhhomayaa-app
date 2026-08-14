require('dotenv').config({ path: '.env.local' });
async function run() {
  const query = `
    query {
      c1: collection(handle: "coats-and-jackets") { products(first: 2) { edges { node { title } } } }
      c2: collection(handle: "skirts") { products(first: 2) { edges { node { title } } } }
      c3: collection(handle: "shirts") { products(first: 2) { edges { node { title } } } }
      c4: collection(handle: "tops-and-shirts") { products(first: 2) { edges { node { title } } } }
      c5: collection(handle: "t-shirts-and-sweatshirts") { products(first: 2) { edges { node { title } } } }
    }
  `;
  const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN },
    body: JSON.stringify({ query })
  });
  const json = await res.json();
  console.log(JSON.stringify(json.data, null, 2));
}
run();
