#!/bin/bash
# SafeRoad AI — Quick Start Script
# Usage: bash start.sh

set -e
echo ""
echo "🚦 SafeRoad AI — Quick Start"
echo "================================"

# Setup backend
echo ""
echo "📦 Setting up backend..."
cd backend
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   ✅ Created backend/.env (from .env.example)"
fi
npm install --silent
echo "   ✅ Backend dependencies installed"

# Start backend in background
echo "   🚀 Starting backend server on port 5000..."
NODE_ENV=development node server.js &
BACKEND_PID=$!
sleep 2
echo "   ✅ Backend running (PID $BACKEND_PID)"

# Setup frontend
cd ../frontend
echo ""
echo "🎨 Setting up frontend..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "   ✅ Created frontend/.env.local"
fi
npm install --silent
echo "   ✅ Frontend dependencies installed"

echo ""
echo "   🚀 Starting frontend dev server on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "✅ SafeRoad AI is running!"
echo ""
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:5000/api"
echo "   Health:    http://localhost:5000/api/health"
echo ""
echo "   Demo login:"
echo "   Operator → username: operator / password: admin123"
echo "   Citizen  → username: citizen  / password: citizen123"
echo ""
echo "   Press Ctrl+C to stop all services"
echo "================================"
echo ""

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Servers stopped.'" EXIT
wait
