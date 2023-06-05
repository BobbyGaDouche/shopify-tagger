const express = require('express');
const Shopify = require('shopify-api-node');

const app = express();
const port = process.env.PORT || 3000;

// Set up Shopify API
const shopify = new Shopify({
  shopName: 'brewedonline',
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_SECRET,
});

app.get('/tag-customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await shopify.customer.get(customerId);

    if (typeof customer.tags === 'string' && !customer.tags.includes('new-tag')) {
      customer.tags += ', new-tag';
    }

    await shopify.customer.update(customerId, { tags: customer.tags });

    res.status(200).send('Successfully tagged customer');
  } catch (error) {
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error status:", error.status);
    console.error("Error headers:", error.headers);
    console.error("Error response body:", error.body);

    res.status(500).send('An error occurred while tagging the customer');
  }
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
