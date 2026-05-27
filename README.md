# VedaAI – AI Assessment Creator

A full-stack AI-powered question paper generator. Provide assignment details, upload a reference document (PDF/text), and let the AI generate a structured question paper in real time.

---

## Architecture

```
vedaAi/
├── docker-compose.yml         # MongoDB + Redis
├── backend/                   # Express.js API + BullMQ workers
│   └── src/
│       ├── config/            # MongoDB connection
│       ├── controllers/       # Route handlers
│       ├── models/            # Mongoose schemas
│       ├── queues/            # BullMQ queue setup
│       ├── routes/            # Express routers
│       ├── services/          # Groq AI, PDF parsing, prompt builder
│       ├── socket/            # Socket.IO server
│       ├── types/             # TypeScript types
│       └── workers/           # BullMQ job processor
└── frontend/                  # Next.js 14 (App Router)
    └── app/
        ├── assignments/        # Assignments list page
        │   ├── new/            # Create assignment form
        │   └── [id]/           # Generated paper + real-time progress
        └── layout.tsx
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State | Zustand |
| Real-time | Socket.IO client |
| PDF export | @react-pdf/renderer |
| Form validation | react-hook-form + zod |
| Backend | Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Queue | BullMQ + Redis (ioredis) |
| AI | Groq SDK (`llama-3.3-70b-versatile`) |
| File processing | pdf-parse + multer |

---

## Prerequisites

- Node.js 18+
- Docker Desktop (for MongoDB + Redis)
- Groq API key ([console.groq.com](https://console.groq.com))

---

## Quick Start

### 1. Start Database Infrastructure (Docker)

> **Note for Reviewers:** Docker is intentionally used strictly for the state layer (**MongoDB** and **Redis**) to keep environment setup clean and simple. The Frontend and Backend run directly in your native terminal for easier logging and debugging.

Start the required databases in the background:

```bash
docker-compose up -d
```

This will automatically pull and start:
- **MongoDB** (running on port `27017`)
- **Redis** (running on port `6379`)

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and set GROQ_API_KEY=your_key_here

# Frontend
cp frontend/.env.example frontend/.env.local
```

### 3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run the application

In two separate terminals:

```bash
# Terminal 1 – Backend (port 5000)
cd backend && npm run dev

# Terminal 2 – Frontend (port 3000)
cd frontend && npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/upload` | Upload reference file |
| DELETE | `/api/upload/:fileId` | Delete uploaded file |
| POST | `/api/assignments/create` | Create assignment + start generation |
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id/status` | Get job status |
| GET | `/api/assignments/:id/paper` | Get generated paper |
| POST | `/api/assignments/:id/regenerate` | Regenerate paper |

## WebSocket Events

| Event | Direction | Payload |
|---|---|---|
| `subscribe:job` | Client → Server | `{ jobId }` |
| `assignment-created` | Server → Client | `{ assignmentId, jobId }` |
| `generation-started` | Server → Client | `{ assignmentId, progress }` |
| `generation-progress` | Server → Client | `{ assignmentId, progress }` |
| `generation-complete` | Server → Client | `{ assignmentId, paper }` |
| `generation-failed` | Server → Client | `{ assignmentId, error }` |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `MONGODB_URI` | `mongodb://localhost:27017/vedaai` | MongoDB connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `GROQ_API_KEY` | — | **Required** Groq API key |
| `FRONTEND_URL` | `http://localhost:3000` | CORS origin |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API base URL |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:5000` | WebSocket server URL |

## Deployment

### Backend (Railway / Render)

1. Connect your GitHub repository to a service like **Railway**.
2. Set the Root Directory to `/backend`.
3. Add the required environment variables (`MONGODB_URI`, `REDIS_URL`, `GROQ_API_KEY`, etc.).
4. For MongoDB Atlas, ensure you append `&authSource=admin` to your connection string to prevent authentication errors, and ensure your IP is whitelisted.

### Frontend (Vercel)

1. Create a new project on **Vercel** and connect your GitHub repository.
2. Set the Framework Preset to **Next.js**.
3. Set the **Root Directory** to `frontend`.
4. Add the following Environment Variables:
   - `NEXT_PUBLIC_API_URL` (Your deployed backend URL)
   - `NEXT_PUBLIC_WS_URL` (Your deployed backend URL)
5. Deploy. Vercel automatically handles Next.js optimization and caching.

