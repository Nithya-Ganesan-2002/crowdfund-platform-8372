'use strict';

const { query } = require('../config/db');

/**
 * Project model CRUD and listing
 */
async function createProject({ owner_id, title, description, goal_amount, deadline, category }) {
  const sql = `
    INSERT INTO projects (owner_id, title, description, goal_amount, deadline, category)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, owner_id, title, description, goal_amount, current_amount, deadline, category, created_at;
  `;
  const { rows } = await query(sql, [owner_id, title, description, goal_amount, deadline, category]);
  return rows[0];
}

async function getProjectById(id) {
  const { rows } = await query(
    'SELECT * FROM projects WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function listProjects({ q, category, owner_id, limit = 20, offset = 0 }) {
  const filters = [];
  const params = [];
  let idx = 1;

  if (q) {
    filters.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
    params.push(`%${q}%`);
    idx++;
  }
  if (category) {
    filters.push(`category = $${idx}`);
    params.push(category);
    idx++;
  }
  if (owner_id) {
    filters.push(`owner_id = $${idx}`);
    params.push(owner_id);
    idx++;
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const sql = `
    SELECT * FROM projects
    ${where}
    ORDER BY created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  params.push(limit, offset);
  const { rows } = await query(sql, params);
  return rows;
}

async function updateProject(id, owner_id, payload) {
  // Allow updating limited fields
  const fields = ['title', 'description', 'goal_amount', 'deadline', 'category'];
  const sets = [];
  const params = [];
  let idx = 1;

  fields.forEach((f) => {
    if (payload[f] !== undefined) {
      sets.push(`${f} = $${idx}`);
      params.push(payload[f]);
      idx++;
    }
  });

  if (!sets.length) {
    const current = await getProjectById(id);
    return current;
  }

  params.push(id);
  params.push(owner_id);
  const sql = `
    UPDATE projects
    SET ${sets.join(', ')}
    WHERE id = $${idx} AND owner_id = $${idx + 1}
    RETURNING *;
  `;
  const { rows } = await query(sql, params);
  return rows[0] || null;
}

async function deleteProject(id, owner_id) {
  const sql = 'DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING id;';
  const { rows } = await query(sql, [id, owner_id]);
  return rows[0] || null;
}

module.exports = {
  createProject,
  getProjectById,
  listProjects,
  updateProject,
  deleteProject,
};
