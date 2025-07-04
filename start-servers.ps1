# Dream11 Multi-Team Creation Assistant - Startup Script
# This script starts both the Python backend and Next.js frontend

Write-Host "🚀 Starting Dream11 Multi-Team Creation Assistant..." -ForegroundColor Green
Write-Host "📍 Project Directory: $PWD" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Not in project root directory!" -ForegroundColor Red
    Write-Host "Please run this script from: d:\VJTI\Internship\multiteam_creation_dream11" -ForegroundColor Yellow
    exit 1
}

# Check if backend directory exists
if (-not (Test-Path "backend\simple_server.py")) {
    Write-Host "❌ Error: Backend server not found!" -ForegroundColor Red
    Write-Host "Please ensure backend\simple_server.py exists" -ForegroundColor Yellow
    exit 1
}

Write-Host "🐍 Starting Python Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd '$PWD\backend'; python simple_server.py; Read-Host 'Press Enter to close'"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host "⚛️  Starting Next.js Frontend Server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm run dev; Read-Host 'Press Enter to close'"

# Wait a moment for frontend to start
Start-Sleep -Seconds 5

Write-Host "✅ Both servers are starting up!" -ForegroundColor Green
Write-Host "📊 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "🌐 Opening browser..." -ForegroundColor Magenta

# Open browser to frontend
Start-Process "http://localhost:3000"

Write-Host "🎉 Dream11 Assistant is ready!" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Gray
Read-Host
