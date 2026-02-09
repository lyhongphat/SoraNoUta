# 🚀 Development Setup Guide

## Local Frontend Development (Recommended for fast feedback)

### Start Local React Dev Server (with Hot Reload)

```bash
cd FRONTEND
npm run dev
```

✨ **Features:**
- Auto reload when you save files
- Fast refresh (preserves component state)
- Open http://localhost:5173 in browser
- Backend API still runs in Docker at http://localhost:8000

### Command Line:
```bash
# Terminal 1: Start local frontend
cd FRONTEND && npm run dev

# Terminal 2 (different terminal): Keep backend running
docker compose up -d

# Now edit code in editor, save, and see instant updates!
```

---

## Full Docker Setup (Production-like)

```bash
docker compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

---

## Updating Translation Files

When you edit JSON translation files:

```bash
# If running locally - changes apply instantly!
# Just save the file ✓

# If using Docker - rebuild is required:
docker compose up --build
```

---

## Docker with Live Reload (Advanced)

If you want Docker with live code reload:

```bash
# Edit docker-compose.yml - uncomment the frontend service volumes:
volumes:
  - ./FRONTEND:/app/src  # Add this line

# Then use dev mode in Dockerfile.frontend:
# Change: npm run build
# To: npm run dev

# Start Docker:
docker compose up -d
```

---

## Quick Commands

```bash
# Local dev (fastest)
cd FRONTEND && npm run dev

# Build frontend
cd FRONTEND && npm run build

# Start backend only
docker compose up -d

# Full stack with Docker
docker compose up --build

# Stop everything
docker compose down

# Check what's running
docker compose ps
```

---

## Architecture

```
┌─────────────────────────────────────┐
│  Your Editor (VSCode)               │
│  npm run dev (Vite dev server)       │
│  http://localhost:5173 ← Frontend   │
└─────────────────────────────────────┘
              ↓ (API calls)
┌─────────────────────────────────────┐
│  Docker Container (Backend)          │
│  http://localhost:8000 ← API        │
│  PostgreSQL, Redis, RabbitMQ        │
└─────────────────────────────────────┘
```

---

## Troubleshooting

### Port 5173/5174 already in use
```bash
# Kill the process
lsof -i :5173 | grep node | awk '{print $2}' | xargs kill -9

# Or specify different port
npm run dev -- --port 3000
```

### Changes not showing up
```bash
# Local dev:
- Just save the file, browser refreshes automatically

# Docker:
- Must rebuild: docker compose up --build
```

### API connection issues
```bash
# Make sure backend is running:
docker compose ps

# Should show sora-no-uta-webapp running on port 8000
```

---

**Happy coding! 🎉**
