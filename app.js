const express = require('express');
const Shopify = require('@shopify/shopify-api');

const app = express();
const port = process.env.PORT || 3000;

// Use environment variables to keep sensitive information secure
const store = process.env.SHOPIFY_STORE;
const apiKey = process.env.SHOPIFY_API_KEY;
const password = process.env.SHOPIFY_API_SECRET;
const accessToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

// Set up Shopify API
const shopify = new Shopify.Clients.Rest(store, apiKey, password);

// Set the Shopify request headers
shopify.options.headers['X-Shopify-Access-Token'] = accessToken;

app.get('/tag-customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const response = await shopify.get(`/admin/api/2023-01/customers/${customerId}.json`);
    const customer = response.body.customer;

    if (typeof customer.tags === 'string' && !customer.tags.includes('new-tag')) {
      customer.tags += ', new-tag';
    }

    const updatedCustomer = {
      id: customerId,
      tags: customer.tags,
    };

    await shopify.put(`/admin/api/2023-01/customers/${customerId}.json`, { customer: updatedCustomer });

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
