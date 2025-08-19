'use strict';

const { Pool } = require('pg');

/**
 * Database pool initialization.
 * Reads configuration from environment variables.
 * IMPORTANT: Ensure the following env vars are provided (see .env.example):
 * - POSTGRES_URL or POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB/POSTGRES_HOST/POSTGRES_PORT
 */
const getPoolConfig = () => {
  if (process.env.POSTGRES_URL) {
    return {
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  }
  return {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

const pool = new Pool(getPoolConfig());

pool.on('error', (err) => {
  // Log unexpected errors on idle clients
  console.error('Unexpected PG client error', err);
});

/**
 * Run a query using the shared pool.
 * @param {string} text SQL text
 * @param {Array<any>} params bound params
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params) {
  return pool.query(text, params);
}

/**
 * Get a pooled client for transactions.
 * @returns {Promise<import('pg').PoolClient>}
 */
async function getClient() {
  return pool.connect();
}

module.exports = { pool, query, getClient };
