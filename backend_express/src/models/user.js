'use strict';

const { query } = require('../config/db');

/**
 * User model: basic queries for auth.
 */
async function createUser({ name, email, password_hash }) {
  const sql = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;
  const { rows } = await query(sql, [name, email, password_hash]);
  return rows[0];
}

async function getUserByEmail(email) {
  const sql = `
    SELECT id, name, email, password_hash, created_at
    FROM users
    WHERE email = $1
    LIMIT 1;
  `;
  const { rows } = await query(sql, [email]);
  return rows[0] || null;
}

async function getUserById(id) {
  const sql = `
    SELECT id, name, email, created_at
    FROM users
    WHERE id = $1;
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
