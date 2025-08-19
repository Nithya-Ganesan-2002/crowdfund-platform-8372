'use strict';

const { verifyToken } = require('../utils/auth');

/**
 * Express middleware to authenticate JWT.
 * Adds req.user if valid; otherwise responds 401.
 */
function authRequired(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization token' });
  }
  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authRequired };
