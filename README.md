# GIS Medical Dashboard

Production-quality GIS medical operations dashboard for Syria.

The platform visualizes hospitals and ambulances on an interactive OpenStreetMap map, streams live Socket.io updates, supports filtering, an Alert Center, nearest-hospital GIS lookup, and a Time Machine historical view.

## Features

- Interactive map centered on Syria (React Leaflet + OpenStreetMap)
- Hospital markers colored by occupancy (green / yellow / red)
- Live ambulance movement every 2 seconds
- Live hospital occupancy updates every 5 seconds
- Random alert generation every 20 seconds
- Advanced filtering (search, governorate, type, status, occupancy, layer toggles)
- Alert Center with INFO / WARNING / CRITICAL severities
- Critical alert toast notifications
- **Time Machine** historical snapshots (every 1 minute)
- **Nearest hospitals** for each ambulance (Haversine distance)
- Dashboard statistics, loading / error / empty states
- Connection status indicator (Connected / Disconnected)
- No authentication (MVP scope)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript, React Leaflet, Socket.io Client |
| Backend | Node.js, Express, TypeScript, Socket.io |
| Database | PostgreSQL |
| Map tiles | OpenStreetMap |

## Project Structure

```text
medical-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/        # schema.sql, seed.sql, init, local DB helper
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/        # simulation, filters, history, distance, nearest
│   │   ├── socket/
│   │   ├── utils/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # map, filters, alerts, history, stats, layout
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── types/
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (or use the local embedded helper if configured)

## Installation

```bash
npm run install:all
```

Or:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Database Setup

1. Create the database:

```sql
CREATE DATABASE medical_dashboard;
```

2. Configure `backend/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/medical_dashboard
CORS_ORIGIN=http://localhost:5173
```

3. Apply schema + seed:

```bash
cd backend
npm run db:init
```

This creates operational tables plus Time Machine history tables and seeds hospitals, ambulances, and alerts.

## Running

```bash
# Terminal 1 — API + simulation + history snapshots
cd backend
npm run dev

# Terminal 2 — UI
cd frontend
npm run dev
```

Open **http://localhost:5173**

Simulation + history:

- Ambulances move every **2s** → `ambulance_updated`
- Hospital occupancy every **5s** → `hospital_updated`
- Alerts every **20s** → `alert_created`
- System snapshots every **60s** (Time Machine)

## REST Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/hospitals` | Hospitals (supports filters) |
| `GET` | `/api/ambulances` | All ambulances |
| `GET` | `/api/ambulances/:id/nearest-hospitals` | Closest 3 hospitals |
| `GET` | `/api/dashboard` | Aggregate stats |
| `GET` | `/api/alerts` | Latest alerts |
| `GET` | `/api/history/snapshots` | Available snapshot timestamps |
| `GET` | `/api/history/at?datetime=ISO` | Nearest snapshot to a date/time |
| `GET` | `/api/history/:snapshotId` | Full system state for a snapshot |
| `GET` | `/api/health` | Health check |

### Hospital filters

Examples:

```text
/api/hospitals?search=Damascus
/api/hospitals?type=Hospital
/api/hospitals?status=Active
/api/hospitals?occupancy=high
/api/hospitals?governorate=Damascus
```

## How to Test New Features

### 1) Time Machine

1. Start backend and frontend.
2. Wait at least **1 minute** so a history snapshot is created (one is also created on backend start).
3. In the sidebar **Time Machine** panel, pick a date and time.
4. Click **Load historical view**.
5. Confirm:
   - Banner shows **Historical Mode**
   - Map freezes live movement
   - Hospital occupancy / ambulance positions reflect the snapshot
6. Click **Return to Live Mode** and confirm live Socket.io updates resume.

API check:

```bash
curl http://localhost:3001/api/history/snapshots
curl "http://localhost:3001/api/history/at?datetime=2026-07-17T18:00:00.000Z"
```

### 2) Nearest Hospitals

1. Click any ambulance marker on the map.
2. Popup shows ambulance info plus **Nearest hospitals** (name, km, occupancy).

API check:

```bash
curl http://localhost:3001/api/ambulances/<AMBULANCE_ID>/nearest-hospitals
```

### 3) UX Improvements

- Map legend: Green / Yellow / Red occupancy + ambulance
- Connection status: Connected / Disconnected in the sidebar
- Empty states: filtered map (“No hospitals found”), Alert Center (“No active alerts”)
- Loading overlay while historical data loads
- Friendly error when backend is unavailable

## Map Legend

| Marker | Meaning |
| --- | --- |
| Green | Low occupancy (&lt; 40%) |
| Yellow | Medium occupancy (40–80%) |
| Red | High occupancy (&gt; 80%) |
| Blue ambulance | Ambulance unit |

## Notes

- Authentication is out of scope for this MVP.
- PostGIS, clustering, routing algorithms, Docker, and AI are not included.
- Time Machine stores simplified snapshots (ambulance positions, hospital occupancy, active alerts).

## License

MIT
