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
  apiKey: shopifyApiKey,
  password: shopifyApiSecret,
});

// Update a customer
app.put('/update-customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const updatedCustomerData = req.body; // Contains the updated customer information

    // Perform the necessary operations to update the customer using the Shopify API
    const updatedCustomer = await shopify.customer.update(customerId, updatedCustomerData);

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('An error occurred while updating the customer');
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}...`));
