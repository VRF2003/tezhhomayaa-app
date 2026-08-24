require('dotenv').config({ path: '.env.local' });
async function run() {
  const query = `
    query {
      collection(handle: "dresses-and-jumpsuits") {
        title
        products(first: 5) {
          edges {
            node { title }
          }
        }
      }
    }
  `;
  const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN },
    body: JSON.stringify({ query })
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
run();
