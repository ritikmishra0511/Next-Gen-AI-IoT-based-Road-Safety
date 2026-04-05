// routes/violations.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { store } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const VIOLATION_TYPES = {
  helmet: { label: 'No Helmet', fine: 1000, color: '#FF4757' },
  seatbelt: { label: 'No Seatbelt', fine: 1000, color: '#00E5C0' },
  signal: { label: 'Signal Jump', fine: 5000, color: '#FFB800' },
  speed: { label: 'Overspeeding', fine: 2000, color: '#8B5CF6' },
};

const VEHICLES = ['MH04AB1234','MP09CD5678','DL8CAF9012','KA03MN3456','UP32XY7890','GJ01LM2345'];

// GET /api/violations
router.get('/', authenticate, (req, res) => {
  const { limit = 20, offset = 0, type, vehicle } = req.query;
  let results = [...store.violations].reverse();
  if (type) results = results.filter(v => v.type === type);
  if (vehicle) results = results.filter(v => v.vehiclePlate.includes(vehicle.toUpperCase()));
  const total = results.length;
  results = results.slice(Number(offset), Number(offset) + Number(limit));
  res.json({ total, violations: results });
});

// POST /api/violations
router.post('/', authenticate, (req, res) => {
  const { type, vehiclePlate, source = 'AI Camera', location = 'Auto-detected' } = req.body;

  const vtype = VIOLATION_TYPES[type] || VIOLATION_TYPES[Object.keys(VIOLATION_TYPES)[Math.floor(Math.random()*4)]];
  const plate = vehiclePlate || VEHICLES[Math.floor(Math.random() * VEHICLES.length)];

  const violation = {
    id: uuidv4(),
    type: type || 'helmet',
    label: vtype.label,
    fine: vtype.fine,
    color: vtype.color,
    vehiclePlate: plate,
    source,
    location,
    status: 'pending',
    timestamp: new Date().toISOString(),
    challanNumber: 'CH' + Date.now(),
  };

  store.violations.push(violation);

  // Emit real-time update
  const io = req.app.get('io');
  if (io) io.to('operators').emit('new-violation', violation);

  res.status(201).json(violation);
});

// GET /api/violations/stats
router.get('/stats', authenticate, (req, res) => {
  const total = store.violations.length;
  const totalFine = store.violations.reduce((s, v) => s + v.fine, 0);
  const byType = {};
  Object.keys(VIOLATION_TYPES).forEach(k => {
    byType[k] = store.violations.filter(v => v.type === k).length;
  });
  res.json({ total, totalFine, byType, pending: store.violations.filter(v => v.status === 'pending').length });
});

// PATCH /api/violations/:id/pay
router.patch('/:id/pay', authenticate, (req, res) => {
  const v = store.violations.find(v => v.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Violation not found' });
  v.status = 'paid';
  v.paidAt = new Date().toISOString();
  res.json(v);
});

module.exports = router;
