// config/db.js — MongoDB connection with graceful in-memory fallback

let usingMongo = false;

// In-memory store (used when MongoDB is not configured)
const store = {
  violations: [],
  emergencies: [],
  users: [
    { id: '1', username: 'operator', password: 'admin123', role: 'operator', name: 'Officer Kumar', badge: 'MP-TFC-001' },
    { id: '2', username: 'citizen', password: 'citizen123', role: 'citizen', name: 'Rajesh Singh', vehiclePlate: 'MP09CD5678' },
  ],
  vehicles: [
    { plate: 'MH04AB1234', owner: 'Amit Sharma', type: 'Bike', model: 'Honda Activa', violations: 2 },
    { plate: 'MP09CD5678', owner: 'Rajesh Singh', type: 'Car', model: 'Maruti Swift', violations: 0 },
    { plate: 'DL8CAF9012', owner: 'Priya Mehta', type: 'Bike', model: 'Bajaj Pulsar', violations: 5 },
    { plate: 'KA03MN3456', owner: 'Suresh Kumar', type: 'Car', model: 'Hyundai i20', violations: 1 },
    { plate: 'UP32XY7890', owner: 'Neha Gupta', type: 'Bike', model: 'TVS Apache', violations: 3 },
    { plate: 'GJ01LM2345', owner: 'Vijay Patel', type: 'Car', model: 'Tata Nexon', violations: 0 },
  ],
};

async function initDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('localhost')) {
    console.log('📦 Using in-memory store (no MongoDB configured)');
    return;
  }
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(uri);
    usingMongo = true;
    console.log('✅ MongoDB connected:', uri);
  } catch (err) {
    console.warn('⚠️  MongoDB unavailable, using in-memory store:', err.message);
  }
}

module.exports = { initDB, store, usingMongo: () => usingMongo };
