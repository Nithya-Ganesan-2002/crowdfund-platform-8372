'use strict';

const express = require('express');
const pledgesController = require('../controllers/pledges');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pledges
 *   description: Campaign contributions and payments
 */

/**
 * @swagger
 * /pledges/create-intent:
 *   post:
 *     summary: Create payment intent for a pledge
 *     tags: [Pledges]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [project_id, amount]
 *             properties:
 *               project_id: { type: string }
 *               amount: { type: number, description: "Dollars" }
 *               currency: { type: string, default: "usd" }
 *     responses:
 *       201: { description: Created PaymentIntent }
 *       400: { description: Bad request }
 *       401: { description: Unauthorized }
 */
router.post('/create-intent', authRequired, pledgesController.createPaymentIntent.bind(pledgesController));

/**
 * @swagger
 * /pledges/confirm:
 *   post:
 *     summary: Confirm a payment intent
 *     tags: [Pledges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [payment_intent_id]
 *             properties:
 *               payment_intent_id: { type: string }
 *     responses:
 *       200: { description: Confirmed or requires_action }
 */
router.post('/confirm', pledgesController.confirmPayment.bind(pledgesController));

/**
 * @swagger
 * /pledges/project/{project_id}:
 *   get:
 *     summary: List pledges for a project
 *     tags: [Pledges]
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List pledges }
 */
router.get('/project/:project_id', pledgesController.listProjectPledges.bind(pledgesController));

module.exports = router;
