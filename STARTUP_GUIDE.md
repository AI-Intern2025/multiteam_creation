# 🚀 Starting Dream11 Multi-Team Creation Assistant

## Quick Start Commands

### Option 1: Manual Start (Two Terminals)

**Terminal 1 - Start Python Backend:**
```bash
cd backend
python simple_server.py
```

**Terminal 2 - Start Next.js Frontend:**
```bash
npm run dev
```

### Option 2: PowerShell Script (Single Command)

**Windows PowerShell:**
```powershell
# Start both servers in parallel
Start-Process powershell -ArgumentList "-Command", "cd backend; python simple_server.py"
Start-Process powershell -ArgumentList "-Command", "npm run dev"
```

### Option 3: Using VS Code Tasks

**Run the existing task:**
- Open VS Code Command Palette (Ctrl+Shift+P)
- Type "Tasks: Run Task"
- Select "Start Dream11 Frontend"
- Then manually run: `cd backend && python simple_server.py`

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Health**: http://localhost:8000/health

## 📋 Startup Checklist

1. ✅ **Backend Server** running on port 8000
2. ✅ **Frontend Server** running on port 3000
3. ✅ **Database** connected to Neon PostgreSQL
4. ✅ **API Integration** working between frontend and backend

## 🔧 Troubleshooting

### If Backend Fails to Start:
```bash
# Check Python version
python --version

# Ensure you're in the right directory
cd d:\VJTI\Internship\multiteam_creation_dream11\backend
python simple_server.py
```

### If Frontend Fails to Start:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### If Port is Already in Use:
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```
