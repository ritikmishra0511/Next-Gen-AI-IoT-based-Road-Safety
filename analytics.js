// routes/analytics.js
const express = require('express');
const router = express.Router();
const { store } = require('../config/db');
const { authenticate } = require('../middleware/auth');

// GET /api/analytics — full dashboard stats
router.get('/', authenticate, (req, res) => {
  const violations = store.violations;
  const emergencies = store.emergencies;

  const totalViolations = violations.length;
  const totalFines = violations.reduce((s, v) => s + v.fine, 0);
  const totalEmergencies = emergencies.length;
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved').length;

  const byType = {
    helmet: violations.filter(v => v.type === 'helmet').length,
    seatbelt: violations.filter(v => v.type === 'seatbelt').length,
    signal: violations.filter(v => v.type === 'signal').length,
    speed: violations.filter(v => v.type === 'speed').length,
  };

  // Hourly breakdown (last 24 hours simulated)
  const hourly = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    violations: violations.filter(v => {
      const h = new Date(v.timestamp).getHours();
      return h === i;
    }).length,
  }));

  // Top vehicles by violations
  const vehicleCounts = {};
  violations.forEach(v => {
    vehicleCounts[v.vehiclePlate] = (vehicleCounts[v.vehiclePlate] || 0) + 1;
  });
  const topVehicles = Object.entries(vehicleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([plate, count]) => ({ plate, count }));

  res.json({
    summary: {
      totalViolations,
      totalFines,
      totalEmergencies,
      resolvedEmergencies,
      pendingViolations: violations.filter(v => v.status === 'pending').length,
    },
    byType,
    hourly,
    topVehicles,
    recentViolations: [...violations].reverse().slice(0, 5),
    recentEmergencies: [...emergencies].reverse().slice(0, 3),
  });
});

module.exports = router;
