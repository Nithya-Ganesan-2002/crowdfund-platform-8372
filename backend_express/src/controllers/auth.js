'use strict';

const { createUser, getUserByEmail, getUserById } = require('../models/user');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res) {
    /** Register a new user with name, email, and password. */
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email, and password are required' });
      }
      const existing = await getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const password_hash = await hashPassword(password);
      const user = await createUser({ name, email, password_hash });
      const token = generateToken({ id: user.id, email: user.email });
      return res.status(201).json({ user, token });
    } catch (e) {
      console.error('Register error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async login(req, res) {
    /** Login with email and password, returns JWT. */
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const ok = await comparePassword(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = generateToken({ id: user.id, email: user.email });
      // Do not leak password hash
      const { password_hash, ...publicUser } = user;
      return res.status(200).json({ user: publicUser, token });
    } catch (e) {
      console.error('Login error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async me(req, res) {
    /** Return the currently authenticated user (from token). */
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ user });
    } catch (e) {
      console.error('Me error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new AuthController();
