# 🚦 SafeRoad AI — Smart Road Safety Platform

> Next-Gen AI & IoT Road Safety System — Accident Prevention, Detection & Automated Enforcement

![SafeRoad AI](https://img.shields.io/badge/SafeRoad-AI%20Powered-00E5C0?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📁 Project Structure

```
roadsafety/
├── frontend/          # React-based UI (Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── utils/
├── backend/           # Node.js + Express REST API
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── config/
└── docs/              # API docs & architecture
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) MongoDB for persistent storage

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/saferoad-ai.git
cd saferoad-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env       # Edit .env with your values
npm run dev                # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local # Edit .env.local
npm run dev                # Runs on http://localhost:5173
```

---

## 🌐 Deployment

### Deploy Frontend → Vercel (Recommended)
```bash
cd frontend
npx vercel --prod
```

### Deploy Frontend → Netlify
```bash
cd frontend
npm run build
# Drag & drop the `dist/` folder at app.netlify.com
```

### Deploy Backend → Railway
```bash
cd backend
railway login
railway init
railway up
```

### Deploy Backend → Render
- Connect GitHub repo at render.com
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

### Full Stack → Docker Compose
```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/saferoad
JWT_SECRET=your_super_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SafeRoad AI
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login (citizen/operator) |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/violations` | Get all violations |
| POST | `/api/violations` | Create violation/challan |
| GET | `/api/emergency` | Get emergency alerts |
| POST | `/api/emergency` | Trigger emergency alert |
| GET | `/api/analytics` | Dashboard analytics |
| GET | `/api/vehicle/:plate` | Vehicle info lookup |
| POST | `/api/iot/helmet` | IoT helmet status update |
| POST | `/api/iot/rfid` | IoT RFID scan event |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS** for styling
- **Recharts** for analytics charts
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose (or in-memory for demo)
- **JWT** authentication
- **Socket.IO** for real-time updates
- **Helmet.js** for security headers

---

## 👥 Team
- Mahima Sharma
- Ritik Mishra  
- Vivek Kumar Mishra

---

## 📄 License
MIT © 2025 SafeRoad AI Team
