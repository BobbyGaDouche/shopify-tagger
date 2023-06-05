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
    const customer = await shopify.customer.get(customerId);

    // Update the customer's metafield
    const metafield = {
      key: 'new',
      value: 'newvalue',
      type: 'single_line_text_field',
      namespace: 'global'
    };

    // Check if the metafield already exists for the customer
    const existingMetafield = customer.metafields.find(mf => mf.key === metafield.key);
    if (existingMetafield) {
      existingMetafield.value = metafield.value; // Update the existing metafield value
    } else {
      customer.metafields.push(metafield); // Add the new metafield
    }

    await shopify.customer.update(customerId, customer);

    res.status(200).send('Successfully updated customer metafield');
  } catch (error) {
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error status:', error.status);
    console.error('Error headers:', error.headers);
    console.error('Error response body:', error.body);

    res.status(500).send('An error occurred while updating the customer metafield');
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}...`));
