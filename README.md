# Dream11 Multi Team Creation Assistant

A smart fantasy team creation assistant for Dream11 power users who want to generate 10–20 valid and optimized teams within a tight 30-minute window after lineups are announced.

## 🎯 Features

### Core MVP Features
- **OCR Upload**: Upload Dream11 screenshots and automatically extract player data using Tesseract.js
- **Strategy Selector**: Choose from presets (Stack Team 1, All-Rounder Focus, Safe Picks) or create custom strategies
- **Team Generation**: Generate 10-50 optimized teams based on your strategy and constraints
- **Validation Engine**: Ensure all teams follow Dream11 rules and constraints
- **Team Manager**: Search, edit, and manage generated teams with bulk operations
- **CSV Export**: Export teams in Dream11-compatible CSV format for easy upload
- **PWA Support**: Mobile-friendly progressive web app

### Advanced Features
- **Captain/Vice-Captain Distribution**: Set percentage distribution across your favorite players
- **Role Constraints**: Fine-tune team composition (WK, BAT, AR, BOWL ratios)
- **Player Lock/Exclude**: Lock must-have players or exclude underperformers
- **Uniqueness vs Optimization Slider**: Control team diversity vs point optimization
- **Bulk Player Swapping**: Replace players across multiple teams simultaneously
- **Team Validation & Scoring**: Real-time validation with actionable fix suggestions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Git

### Installation

1. **Install dependencies**
   ```bash
   npm install
   cd backend && pip install -r requirements.txt && cd ..
   ```

2. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start separately:
   # npm run dev (frontend)
   # npm run backend (backend)
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📱 Usage Guide

### Step 1: Upload Dream11 Screenshot
- Take a screenshot of Dream11's player selection screen
- Upload the image (PNG, JPG, JPEG, WEBP)
- The OCR will automatically extract player names, roles, and credits

### Step 2: Select Strategy
Choose from preset strategies or create your own:

**Presets:**
- **Stack Team 1**: Favor players from the first team
- **All-Rounder Focus**: Prioritize all-rounders for balance
- **Safe Picks**: Conservative strategy with proven performers

### Step 3: Generate Teams
- Set number of teams to generate (1-50)
- Review strategy summary and click "Generate Teams"

### Step 4: Manage Teams
- Browse, search, edit, and export your generated teams
- Use bulk operations for efficient management

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Tesseract.js
- **Backend**: FastAPI, Python, Pydantic
- **OCR**: Tesseract.js (client-side)
- **Export**: CSV generation with Dream11 format
- **PWA**: Mobile-first responsive design

### Key Components
- **OCR Processor**: Image text extraction
- **Strategy Selector**: Strategy configuration UI
- **Team Generator**: Core team generation algorithm
- **Validation Engine**: Rule-based validation
- **Team Manager**: Team CRUD operations
- **CSV Exporter**: Dream11-compatible export

## 📊 Dream11 Rules & Constraints

- **Team Size**: Exactly 11 players
- **Credit Limit**: Maximum 100 credits
- **Role Distribution**: 1 WK, 3-5 BAT, 1-4 AR, 3-5 BOWL
- **Team Balance**: 1-7 players from each team
- **Captain/Vice-Captain**: Must be different players

---

**Happy Team Building! 🏏**