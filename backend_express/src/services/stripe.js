'use strict';

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
if (!STRIPE_SECRET_KEY) {
  console.warn('WARNING: STRIPE_SECRET_KEY is not set. Payment endpoints will fail until configured.');
}
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// PUBLIC_INTERFACE
async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
  /** Create a Stripe PaymentIntent for the given amount (in cents). */
  return stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

// PUBLIC_INTERFACE
async function retrievePaymentIntent(id) {
  /** Retrieve a PaymentIntent by id. */
  return stripe.paymentIntents.retrieve(id);
}

// PUBLIC_INTERFACE
async function confirmPaymentIntent(id) {
  /** Confirm a PaymentIntent (for flows that require server confirmation). */
  return stripe.paymentIntents.confirm(id);
}

module.exports = {
  createPaymentIntent,
  retrievePaymentIntent,
  confirmPaymentIntent,
};
