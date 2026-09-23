# Interact.ai — Campus to Corporate AI Platform

Interact.ai is an enterprise-grade, AI-powered career acceleration platform. It provides personalized career roadmaps, real-time AI mock interviews with integrated DSA IDE compiler, automated resume ATS scanners, dedicated job & internship matchers (with TinyFish & Firecrawl web intelligence), global course aggregation, gamified peer leaderboards, and institutional analytics.

---

## 📁 Optimized Project Structure (NPM Workspaces Monorepo)

```
mponline/                              # Project Root Directory
├── .env                               # MASTER Environment Variables (Single source of truth)
├── .env.example                       # Environment Variables Template
├── .gitignore                         # Master gitignore (ignores node_modules, .env, dist)
├── package.json                       # Monorepo NPM Workspaces & Root Scripts
├── README.md                          # Platform Documentation & Setup Guide
│
├── frontend/                          # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/                # UI Components (Navbar, WebScannerCard, SystemDiagnosticsModal)
│   │   ├── pages/                     # Page Views (InternshipsPage, JobsPage, CoursesPage, ProfilePage)
│   │   ├── layouts/                   # Layout wrappers
│   │   ├── hooks/                     # Custom React Hooks
│   │   ├── services/                  # Supabase, Gemini, Piston API Clients
│   │   ├── context/                   # Auth & User Context Providers
│   │   ├── utils/                     # Utility Functions & Formatters
│   │   ├── App.jsx                    # Root App Component & Theme Manager
│   │   └── index.css                  # Design Tokens & Light/Dark Mode CSS System
│   ├── public/                        # Static Assets & Icons
│   ├── index.html                     # Entry HTML Shell
│   ├── vite.config.js                 # Vite Bundler (configured envDir: '../')
│   └── package.json                   # Frontend Dependencies (@supabase/supabase-js, lucide-react, react)
│
└── backend/                           # Node.js + Express API Backend
    ├── src/
    │   ├── controllers/               # API Controllers (jobController, authController, etc.)
    │   ├── routes/                    # Express REST API Routes (/api/jobs, /api/auth, etc.)
    │   ├── models/                    # Database Models & Schemas
    │   ├── services/                  # TinyFish, Firecrawl, Gemini, Scraper & Email Services
    │   ├── middleware/                # Rate Limiter & Error Handler
    │   ├── config/                    # Supabase, Redis, Gemini Configs
    │   └── server.js                  # Express API Server (resolves root .env)
    └── package.json                   # Backend Dependencies (express, @google/generative-ai, @upstash/redis, bullmq, etc.)
```

---

## 🚀 How to Run the Project on a New Device

Follow these step-by-step instructions when cloning the project on a new machine:

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd mponline
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
*(Fill in your Google Gemini API Key, Supabase Credentials, Upstash Redis keys, and Scraping API keys in `.env`)*

### Step 3: Install All Dependencies (Single Command)
Run `npm install` from the **root directory**. NPM Workspaces will automatically install and link dependencies for both `frontend` and `backend`:
```bash
npm install
```

### Step 4: Start Development Servers

#### Option A: Run Frontend Dev Server
```bash
npm run dev
# or: npm run dev:frontend
```
*Frontend runs on `http://localhost:5173`*

#### Option B: Run Backend API Server
```bash
npm run dev:backend
```
*Backend runs on `http://localhost:5000`*

#### Option C: Build Frontend for Production
```bash
npm run build:frontend
```

---

## 🔑 Configured Services & Integrations
- **LLM Core:** Google Gemini 1.5 Flash & Pro API
- **Web Intelligence:** TinyFish Web Agent API & Firecrawl API
- **Auth & Database:** Supabase Auth + PostgreSQL Database
- **Leaderboard & Cache:** Upstash Redis
- **Code Execution:** Piston Compiler API
- **Payment Gateway:** Cashfree Sandbox API
- **Email Service:** SendGrid API
