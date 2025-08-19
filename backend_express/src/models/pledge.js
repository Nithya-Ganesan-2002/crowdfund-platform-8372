'use strict';

const { query } = require('../config/db');

/**
 * Pledge model for tracking contributions
 */
async function createPledge({ project_id, user_id, amount, status, payment_intent_id }) {
  const sql = `
    INSERT INTO pledges (project_id, user_id, amount, status, payment_intent_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, project_id, user_id, amount, status, payment_intent_id, created_at;
  `;
  const { rows } = await query(sql, [project_id, user_id, amount, status, payment_intent_id]);
  return rows[0];
}

async function listPledgesForProject(project_id) {
  const { rows } = await query(
    `SELECT p.*, u.name as backer_name
     FROM pledges p
     LEFT JOIN users u ON u.id = p.user_id
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [project_id]
  );
  return rows;
}

async function updatePledgeStatusByIntent(payment_intent_id, status) {
  const { rows } = await query(
    'UPDATE pledges SET status = $1 WHERE payment_intent_id = $2 RETURNING *',
    [status, payment_intent_id]
  );
  return rows[0] || null;
}

module.exports = {
  createPledge,
  listPledgesForProject,
  updatePledgeStatusByIntent,
};
