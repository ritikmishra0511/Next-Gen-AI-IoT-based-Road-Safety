// routes/emergency.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { store } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const LOCATIONS = [
  'NH-46 Near Toll Plaza', 'DB Road Junction', 'Ring Road Km 12',
  'AIIMS Bhopal Junction', 'Bhopal-Indore Highway Km 34',
  'Habibganj Flyover', 'MP Nagar Square', 'Kolar Road Junction',
];

// GET /api/emergency
router.get('/', authenticate, (req, res) => {
  const alerts = [...store.emergencies].reverse().slice(0, 20);
  res.json({ total: store.emergencies.length, alerts });
});

// POST /api/emergency
router.post('/', authenticate, (req, res) => {
  const { location, lat, lng, severity = 'high', type = 'accident' } = req.body;

  const alert = {
    id: uuidv4(),
    type,
    severity,
    location: location || LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    coordinates: {
      lat: lat || 23.2599 + (Math.random() - 0.5) * 0.1,
      lng: lng || 77.4126 + (Math.random() - 0.5) * 0.1,
    },
    status: 'active',
    responders: ['Ambulance MP-01', 'Traffic Police Unit 4'],
    eta: Math.floor(Math.random() * 8) + 3 + ' mins',
    timestamp: new Date().toISOString(),
  };

  store.emergencies.push(alert);

  const io = req.app.get('io');
  if (io) io.to('operators').emit('new-emergency', alert);

  res.status(201).json(alert);
});

// PATCH /api/emergency/:id/resolve
router.patch('/:id/resolve', authenticate, (req, res) => {
  const alert = store.emergencies.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.status = 'resolved';
  alert.resolvedAt = new Date().toISOString();
  res.json(alert);
});

module.exports = router;
