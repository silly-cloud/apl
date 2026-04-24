# VenueIQ

AI-powered smart venue assistant for large-scale sporting events. Two-panel SPA: attendee chat on the left, staff ops dashboard on the right. One MongoDB document is the single source of truth for every Claude call.

## Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18 + Vite, served by nginx          |
| Backend   | Node.js + Express                         |
| Database  | MongoDB 7 via Mongoose                    |
| AI        | Anthropic Claude (`claude-sonnet-4-6`)    |
| Streaming | SSE for venue updates + chat token stream |
| Infra     | Docker Compose                            |

## Credentials

Two separate Anthropic credentials are required:

| Variable                    | Purpose                                                                       |
|-----------------------------|-------------------------------------------------------------------------------|
| `ANTHROPIC_ADMIN_API_KEY`   | Server-only. Used to validate user-supplied key IDs via Anthropic Admin API.  |
| `ANTHROPIC_API_KEY`         | Local dev fallback only. Never used in production code paths.                 |

The user's `sk-ant-...` key is entered in the UI at runtime, validated against the Admin API, then passed per-request in `X-Venue-Api-Key`. It is never stored server-side or in localStorage.

## Quick start

```bash
# 1. Copy env template and fill in your admin key
cp .env.example .env
# Edit .env — set ANTHROPIC_ADMIN_API_KEY

# 2. Build and start all services
docker compose up --build

# App    → http://localhost:5173
# API    → http://localhost:3001/api/health
# Mongo  → mongodb://localhost:27017/venueiq
```

## Demo flow

**Step 1 — Connect.** Enter your `apikey_01...` ID and `sk-ant-...` key in the banner. Click Connect. The server validates the key ID against the Anthropic Admin API. On success, the banner collapses to show the key name and hint.

**Step 2 — Attendee query.** Click a quick-send button or type a question. Claude reads the live zone data from MongoDB and streams a grounded reply with a tappable action pill.

**Step 3 — Surge demo.** Click "Simulate crowd surge" — Gate A and Concessions East spike to 9–10. The minimap dots turn red, zone cards show critical bars, and a CRITICAL alert fires within seconds via SSE.

## API routes

| Method  | Path                            | Auth required | Description                        |
|---------|---------------------------------|---------------|------------------------------------|
| POST    | `/api/auth/validate-key`        | No            | Validate API key ID via Admin API  |
| POST    | `/api/auth/connect`             | Yes (key hdr) | Register key with simulator        |
| POST    | `/api/auth/disconnect`          | No            | Clear active key from simulator    |
| GET     | `/api/venue/state`              | No            | Current venue snapshot             |
| POST    | `/api/venue/surge`              | Optional      | Trigger surge + alert generation   |
| GET     | `/api/venue/events`             | No            | SSE stream (venueUpdate, opsAlerts)|
| POST    | `/api/chat/message`             | Yes           | Stream attendee reply              |
| GET     | `/api/chat/history/:sessionId`  | No            | Fetch chat history                 |
| GET     | `/api/ops/alerts`               | No            | Active alerts                      |
| PATCH   | `/api/ops/alerts/:id/resolve`   | No            | Resolve an alert                   |
| GET     | `/api/health`                   | No            | Health check                       |

## Architecture notes

- **venueSimulator** runs a `setInterval` every 30s, random-walks each queue value ±1, saves to MongoDB, broadcasts via SSE, then calls Claude for ops alerts (only if an active API key is registered).
- **sseManager** keeps a `Set` of active SSE response objects; `broadcast()` writes to all of them.
- **claudeService** takes `apiKey` as a function parameter — it never touches `process.env.ANTHROPIC_API_KEY` in any production code path.
- **requireApiKey middleware** validates that `X-Venue-Api-Key` starts with `sk-ant-` before any Claude call is made.
- **nginx** is configured with `proxy_buffering off` and `proxy_read_timeout 300s` so SSE and streaming chat work correctly through the reverse proxy.

## File structure

```
venueiq/
├── docker-compose.yml
├── .env                         ← gitignored; add your keys here
├── .env.example
├── .gitignore
├── README.md
├── server/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js                 ← boot, seed, start simulator
│   ├── constants/index.js       ← all hardcoded strings
│   ├── models/                  ← VenueState, ChatMessage, OpsAlert
│   ├── services/                ← claudeService, adminApiService, venueSimulator, sseManager
│   ├── middleware/              ← requireApiKey, errorHandler
│   ├── controllers/             ← auth, venue, chat, ops
│   └── routes/                  ← auth, venue, chat, ops
└── client/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── index.css
        ├── main.jsx
        ├── App.jsx
        ├── store/venueStore.js  ← useReducer context
        ├── services/api.js      ← axios + fetch helpers
        ├── hooks/               ← useVenueState, useChat, useOpsAlerts
        └── components/          ← Header, ApiKeyBanner, AttendeePanel, OpsPanel
```
# apl
