'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-in-env';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// PUBLIC_INTERFACE
function generateToken(payload) {
  /** Generate a JWT for the given payload. */
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// PUBLIC_INTERFACE
function verifyToken(token) {
  /** Verify a JWT and return its payload or throw on invalid token. */
  return jwt.verify(token, JWT_SECRET);
}

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
