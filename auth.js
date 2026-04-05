// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { store } = require('../config/db');

const SECRET = process.env.JWT_SECRET || 'saferoad_dev_secret';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = store.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ error: 'Role mismatch' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      badge: user.badge || null,
      vehiclePlate: user.vehiclePlate || null,
    }
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Stateless JWT — client just discards the token
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
