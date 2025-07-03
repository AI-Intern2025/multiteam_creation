# Setting up Neon Database for Dream11 Project

## Step 1: Create Neon Account and Database

1. **Sign up for Neon**
   - Go to https://neon.tech
   - Click "Sign up" and create an account
   - Choose the free tier (perfect for development)

2. **Create a New Project**
   - Click "Create Project"
   - Choose a project name (e.g., "Dream11 Multi Team Creator")
   - Select the region closest to you
   - Choose PostgreSQL version 15+ (recommended)

3. **Get Database Connection String**
   - Once the project is created, you'll see the connection details
   - Copy the "Connection string" - it looks like:
     ```
     postgresql://username:password@ep-xxx-xxx.region.neon.tech/neondb?sslmode=require
     ```

## Step 2: Configure Environment Variables

1. **Update `.env.local` file**
   ```bash
   # Replace the placeholder with your actual Neon connection string
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.neon.tech/neondb?sslmode=require"
   
   # Next.js
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

## Step 3: Initialize Database Schema

1. **Generate and push the schema to Neon**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Push schema to Neon database
   npm run db:push
   ```

2. **Seed the database with cricket players**
   ```bash
   # Populate database with WI vs AUS player data
   npm run db:seed
   ```

## Step 4: Verify Database Setup

1. **Check database contents (optional)**
   ```bash
   # Open Drizzle Studio to view data
   npm run db:studio
   ```
   This opens a web interface at http://localhost:4983

2. **Test the API**
   - Start your Next.js server: `npm run dev`
   - Visit: http://localhost:3000/api/players
   - You should see JSON with all players

## Step 5: Test OCR with Database Integration

1. **Load demo players**
   - Go to http://localhost:3000
   - Click "🚀 Load Demo Players" button
   - You should see 22 players loaded from the database

2. **Test OCR with your screenshot**
   - Upload the Dream11 screenshot
   - The system will extract player names and lookup their full stats from the database
   - Much more accurate than parsing credits/roles from the image!

## Database Schema Overview

The database contains:

### Players Table
- **name**: Short name (as shown in Dream11)
- **fullName**: Complete player name
- **team**: Cricket team (WI, AUS, etc.)
- **role**: Position (BAT, BOWL, WK, ALL)
- **credits**: Dream11 credit value
- **selectionPercentage**: How often this player is selected
- **points**: Recent performance points
- **matchTeam**: team1 or team2 for current match
- Additional metadata: country, batting/bowling style

### Matches Table
- **team1/team2**: Teams playing
- **format**: T20, ODI, TEST
- **venue**: Match location
- **matchDate**: When the match is played

## Benefits of Database Approach

✅ **More Accurate**: No need to parse credits/roles from blurry screenshots
✅ **Faster**: Only extract player names, lookup rest from database
✅ **Reliable**: Consistent data regardless of image quality
✅ **Scalable**: Easy to add more players, matches, and stats
✅ **Future-Ready**: Can integrate with live cricket APIs later

## Troubleshooting

**Connection Issues:**
- Verify your DATABASE_URL is correct
- Check that Neon project is active (not sleeping)
- Ensure your IP is allowed (Neon free tier allows all IPs by default)

**Seed Issues:**
- Make sure you ran `npm run db:push` first
- Check that all dependencies are installed
- Verify the connection string format

**OCR Not Finding Players:**
- The database contains specific player names from WI vs AUS
- For other matches, you'll need to seed more players
- Use the manual CSV entry for testing with different players
