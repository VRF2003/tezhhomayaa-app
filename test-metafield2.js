const STORE_DOMAIN = "https://www.tezhhomayaa.com";
const STOREFRONT_TOKEN = "cc69ca817ac686156325a3c621dfbaa2";

const query = `
{
  product(handle: "the-nurazaa-cuban-collared-cropped-shirt") {
    title
    metafield(namespace: "custom", key: "horizontal_image") {
      value
      type
    }
  }
}
`;

fetch(`${STORE_DOMAIN}/api/2023-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
  },
  body: JSON.stringify({ query }),
})
.then(res => res.json())
.then(json => console.log(JSON.stringify(json, null, 2)))
.catch(err => console.error(err));
