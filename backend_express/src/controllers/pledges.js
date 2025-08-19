'use strict';

const { createPledge, listPledgesForProject, updatePledgeStatusByIntent } = require('../models/pledge');
const { getProjectById } = require('../models/project');
const stripeService = require('../services/stripe');

function dollarsToCents(amount) {
  return Math.round(Number(amount) * 100);
}

class PledgesController {
  // PUBLIC_INTERFACE
  async createPaymentIntent(req, res) {
    /** Create a PaymentIntent for a pledge to a project. */
    try {
      const user_id = req.user?.id;
      if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

      const { project_id, amount, currency = 'usd' } = req.body || {};
      if (!project_id || !amount) {
        return res.status(400).json({ error: 'project_id and amount are required' });
      }
      const project = await getProjectById(project_id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      const cents = dollarsToCents(amount);
      if (cents <= 0) return res.status(400).json({ error: 'Amount must be greater than 0' });

      const meta = { project_id: String(project_id), user_id: String(user_id) };
      const intent = await stripeService.createPaymentIntent(cents, currency, meta);

      // Create pledge in pending state
      const pledge = await createPledge({
        project_id,
        user_id,
        amount: Number(amount),
        status: 'pending',
        payment_intent_id: intent.id,
      });

      return res.status(201).json({
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        pledge,
      });
    } catch (e) {
      console.error('Create PaymentIntent error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async confirmPayment(req, res) {
    /** Confirm a PaymentIntent server-side and mark pledge as succeeded if appropriate. */
    try {
      const { payment_intent_id } = req.body || {};
      if (!payment_intent_id) return res.status(400).json({ error: 'payment_intent_id is required' });

      const intent = await stripeService.confirmPaymentIntent(payment_intent_id);

      if (intent.status === 'succeeded') {
        await updatePledgeStatusByIntent(payment_intent_id, 'succeeded');
      }
      return res.status(200).json({ paymentIntent: intent });
    } catch (e) {
      console.error('Confirm Payment error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async listProjectPledges(req, res) {
    /** List pledges for a given project. */
    try {
      const { project_id } = req.params;
      const pledges = await listPledgesForProject(project_id);
      return res.status(200).json({ pledges });
    } catch (e) {
      console.error('List pledges error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new PledgesController();
