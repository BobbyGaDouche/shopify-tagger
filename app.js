const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const Shopify = require('shopify-api-node');
const shopifyApiKey = process.env.SHOPIFY_API_KEY;
const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;

console.log('Shopify API Key:', shopifyApiKey);
console.log('Shopify API Secret:', shopifyApiSecret);

if (!shopifyApiKey || !shopifyApiSecret) {
  console.error('Missing Shopify API Key or API Secret');
  process.exit(1);
}

const shopify = new Shopify({
  shopName: 'brewedonline',
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_SECRET,
});

app.put('/admin/api/2023-01/customers/:id.json', async (req, res) => {
  try {
    const customerId = req.params.id;

    const metafield = {
      key: 'test',
      value: 'text',
      type: 'single_line_text_field',
      namespace: 'global',
    };

    const customer = await shopify.customer.get(customerId);
    customer.metafields.push(metafield);

    await shopify.customer.update(customerId, customer);

    res.status(200).send('Customer metafield added successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while adding the customer metafield');
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}...`));
