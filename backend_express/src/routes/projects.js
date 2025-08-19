'use strict';

const express = require('express');
const projectsController = require('../controllers/projects');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: owner_id
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0 }
 *     responses:
 *       200: { description: List of projects }
 */
router.get('/', projectsController.list.bind(projectsController));

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a project
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, goal_amount]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               goal_amount: { type: number }
 *               deadline: { type: string, format: date-time }
 *               category: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 *       401: { description: Unauthorized }
 */
router.post('/', authRequired, projectsController.create.bind(projectsController));

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: Project }
 *       404: { description: Not found }
 */
router.get('/:id', projectsController.get.bind(projectsController));

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200: { description: Updated }
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */
router.put('/:id', authRequired, projectsController.update.bind(projectsController));

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: Deleted }
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */
router.delete('/:id', authRequired, projectsController.remove.bind(projectsController));

module.exports = router;
