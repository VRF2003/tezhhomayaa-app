require('dotenv').config({ path: '.env.local' });
async function run() {
  const query = `
    {
      collections(first: 50, after: "eyJsYXN0X2lkIjo0NzE5MTQ5ODc4MTEsImxhc3RfdmFsdWUiOiI0NzE5MTQ5ODc4MTEifQ==") {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  `;
  const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    },
    body: JSON.stringify({ query })
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
run();
