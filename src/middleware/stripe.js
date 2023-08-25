const express = require("express");
const app = express();
// This is your test secret API key.
const stripe = require("stripe")(
  "pk_test_51NdRM1SGor658vyKfuSsZbktNn3sUMNAWjvXR6EfEAz8SYEK8n8hsQpIY81ZBpc4WTpjb0Ozs1k5LWPFwN1v9E3W00hsS1gbP2"
);

const calculateOrderAmount = (items) => {
  return 1400 *100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    payment_methods_types: ['card','gpay',"ideal"]
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
