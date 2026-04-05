// routes/vehicle.js
const express = require('express');
const router = express.Router();
const { store } = require('../config/db');
const { authenticate } = require('../middleware/auth');

// GET /api/vehicle/:plate
router.get('/:plate', authenticate, (req, res) => {
  const plate = req.params.plate.toUpperCase();
  const vehicle = store.vehicles.find(v => v.plate === plate);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found in database' });
  }

  const violations = store.violations.filter(v => v.vehiclePlate === plate);
  res.json({
    ...vehicle,
    violationHistory: violations.reverse().slice(0, 10),
    totalFines: violations.reduce((s, v) => s + v.fine, 0),
    riskScore: violations.length > 5 ? 'HIGH' : violations.length > 2 ? 'MEDIUM' : 'LOW',
  });
});

// GET /api/vehicle — list all vehicles
router.get('/', authenticate, (req, res) => {
  const vehicles = store.vehicles.map(v => ({
    ...v,
    violations: store.violations.filter(viol => viol.vehiclePlate === v.plate).length,
  }));
  res.json({ total: vehicles.length, vehicles });
});

module.exports = router;
