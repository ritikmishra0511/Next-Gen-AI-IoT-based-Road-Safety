// routes/iot.js — IoT device events (Arduino/Raspberry Pi integration)
const express = require('express');
const router = express.Router();

// Simple IoT state (per-session)
const iotState = {
  helmet: false,
  rfid: null,
  engineEnabled: false,
  lastUpdate: null,
};

// POST /api/iot/helmet — helmet sensor event
router.post('/helmet', (req, res) => {
  const { detected, confidence = 0, deviceId } = req.body;
  iotState.helmet = !!detected;
  iotState.lastUpdate = new Date().toISOString();

  // Engine logic: needs both RFID + helmet
  const wasEnabled = iotState.engineEnabled;
  iotState.engineEnabled = iotState.helmet && !!iotState.rfid;

  const io = req.app.get('io');
  if (io) {
    io.to('operators').emit('iot-helmet', {
      detected,
      confidence,
      deviceId,
      engineEnabled: iotState.engineEnabled,
      timestamp: iotState.lastUpdate,
    });
  }

  res.json({
    received: true,
    helmetDetected: iotState.helmet,
    engineEnabled: iotState.engineEnabled,
    action: !detected && wasEnabled ? 'ENGINE_BLOCKED' : detected ? 'HELMET_OK' : 'AWAITING_RFID',
  });
});

// POST /api/iot/rfid — RFID scan event
router.post('/rfid', (req, res) => {
  const { cardId, vehiclePlate, deviceId } = req.body;
  iotState.rfid = cardId || null;
  iotState.lastUpdate = new Date().toISOString();
  iotState.engineEnabled = iotState.helmet && !!iotState.rfid;

  const io = req.app.get('io');
  if (io) {
    io.to('operators').emit('iot-rfid', {
      cardId,
      vehiclePlate,
      deviceId,
      engineEnabled: iotState.engineEnabled,
      timestamp: iotState.lastUpdate,
    });
  }

  res.json({
    received: true,
    cardVerified: !!cardId,
    engineEnabled: iotState.engineEnabled,
    action: cardId ? 'RFID_VERIFIED' : 'RFID_CLEARED',
  });
});

// GET /api/iot/status — current IoT state
router.get('/status', (req, res) => {
  res.json(iotState);
});

// POST /api/iot/reset — reset IoT state
router.post('/reset', (req, res) => {
  iotState.helmet = false;
  iotState.rfid = null;
  iotState.engineEnabled = false;
  iotState.lastUpdate = new Date().toISOString();
  const io = req.app.get('io');
  if (io) io.to('operators').emit('iot-reset', iotState);
  res.json({ reset: true, state: iotState });
});

module.exports = router;
