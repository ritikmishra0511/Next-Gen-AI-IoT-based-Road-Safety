require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const violationRoutes = require('./routes/violations');
const emergencyRoutes = require('./routes/emergency');
const analyticsRoutes = require('./routes/analytics');
const iotRoutes = require('./routes/iot');
const vehicleRoutes = require('./routes/vehicle');

const { initDB } = require('./config/db');
const { setupSocketIO } = require('./config/socket');

const app = express();
const server = http.createServer(app);

// ── Socket.IO ──
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
setupSocketIO(io);
app.set('io', io); // Share io instance with routes

// ── Middleware ──
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Routes ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SafeRoad AI API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/vehicle', vehicleRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ── Start ──
const PORT = process.env.PORT || 5000;
initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🚦 SafeRoad AI Server`);
    console.log(`   API:      http://localhost:${PORT}/api`);
    console.log(`   Health:   http://localhost:${PORT}/api/health`);
    console.log(`   Env:      ${process.env.NODE_ENV || 'development'}\n`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
