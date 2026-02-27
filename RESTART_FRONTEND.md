# How to Restart Frontend

## Quick Restart Commands

### Option 1: Stop and Restart (Recommended)
```powershell
# Navigate to frontend directory
cd D:\Z-front\zipli-dark

# Stop any running Next.js process (Ctrl+C in the terminal where it's running)
# Or find and kill the process:
Get-Process | Where-Object {$_.Path -like "*zipli-dark*" -or $_.CommandLine -like "*next dev*"} | Stop-Process -Force

# Start the dev server
npm run dev
```

### Option 2: Simple Restart
If the server is running in a terminal:
1. Press `Ctrl+C` to stop it
2. Then run: `npm run dev`

### Option 3: Full Clean Restart
```powershell
cd D:\Z-front\zipli-dark

# Stop the server (Ctrl+C or kill process)
# Clear Next.js cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Restart
npm run dev
```

## What Port It Runs On
- Frontend: http://localhost:3000
- Backend: http://localhost:8002
