const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const Shopify = require('shopify-api-node');
const shopify = new Shopify({
  shopName: 'brewedonline',
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_SECRET,
});

// Log the values of the API keys
console.log('API Key:', process.env.SHOPIFY_API_KEY);
console.log('API Secret:', process.env.SHOPIFY_API_SECRET);

app.get('/tag-customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await shopify.customer.get(customerId);

    customer.tags += ', new-tag'; // Append new tag

    await shopify.customer.update(customerId, customer);

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

app.listen(port, () => console.log(`Server is running on port ${port}...`));
