require('dotenv').config({ path: '.env.local' });
async function run() {
  let hasNext = true;
  let cursor = null;
  const collections = [];
  
  while (hasNext) {
    const afterParam = cursor ? `, after: "${cursor}"` : '';
    const query = `
      {
        collections(first: 50${afterParam}) {
          pageInfo { hasNextPage endCursor }
          edges { node { handle title } }
        }
      }
    `;
    const res = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    if (json.data && json.data.collections) {
      json.data.collections.edges.forEach(e => collections.push({ handle: e.node.handle, title: e.node.title }));
      hasNext = json.data.collections.pageInfo.hasNextPage;
      cursor = json.data.collections.pageInfo.endCursor;
    } else {
      hasNext = false;
    }
  }
  console.log(JSON.stringify(collections, null, 2));
}
run();
