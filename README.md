# Nuzio

Nuzio is a personalized news web application. Users sign up, select their interests during onboarding, and receive a news feed ranked to match their preferences. Articles are served through a REST API powered by Express and MongoDB, with a React frontend built on Vite.

## Project structure

```
nuzio/
│
├── client/                       # React frontend (Vite)
│   └── src/
│       ├── components/           # Presentational components
│       │   ├── ui/               # Reusable UI primitives
│       │   ├── auth/
│       │   ├── onboarding/
│       │   ├── news/
│       │   └── player/
│       ├── pages/                # Route-level components
│       │   ├── Login/
│       │   ├── Onboarding/
│       │   └── Home/
│       ├── features/             # Feature state/logic slices
│       │   ├── auth/
│       │   ├── preferences/
│       │   ├── news/
│       │   └── player/
│       ├── services/             # API client modules
│       │   ├── apiClient.js
│       │   ├── authApi.js
│       │   ├── newsApi.js
│       │   └── preferenceApi.js
│       ├── hooks/
│       ├── routes/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/                       # Express REST API
│   └── src/
│       ├── modules/
│       │   ├── auth/             # register / login / logout + JWT
│       │   ├── users/            # user model & profile
│       │   ├── news/             # feed, search, article endpoints
│       │   └── personalization/  # interest scoring & ranking
│       ├── middleware/           # auth, validation, error handling
│       ├── config/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── .env.example
├── .gitignore
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB (local or MongoDB Atlas)

### Server

```bash
cd server
npm install
cp ../.env.example .env   # adjust values as needed
npm run dev
```

Runs on `http://localhost:5000`. Health check: `GET /api/health` → `{ "status": "ok" }`.

### Client

```bash
cd client
npm install
cp ../.env.example .env
npm run dev
```

Runs on `http://localhost:5173`. In dev, `/api` requests are proxied to the server.