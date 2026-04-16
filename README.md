# 🎭 Stage Decor — Full Stack Web Application

> An elegant, full-featured event decoration gallery and booking platform.
> Built with a modern dark navy + violet theme by **Devadeth N**.

---

## 📌 Project Overview

Stage Decor is a full-stack web application designed for a stage decoration business. It features a **public-facing gallery** where visitors can browse decoration photos by category and a **password-protected admin panel** for managing the gallery content, uploading images, and configuring contact details.

---

## 🛠️ Tech Stack

### 🔙 Backend

| Tool | Version | Purpose |
|---|---|---|
| **Python** | 3.10+ | Core programming language |
| **FastAPI** | 0.100+ | High-performance REST API framework |
| **Uvicorn** | Latest | ASGI web server for FastAPI |
| **SQLAlchemy** | 2.x | ORM for database modeling and queries |
| **SQLite** | Built-in | Lightweight local database (development) |
| **PostgreSQL** | Latest | Production database hosted on Render |
| **psycopg2-binary** | Latest | PostgreSQL driver for SQLAlchemy |
| **python-dotenv** | Latest | Load environment variables from `.env` |
| **Pydantic** | v2 | Data validation and serialization |
| **Python-Multipart** | Latest | Handles multipart form data |

**Key Backend Features:**
- RESTful API with automatic Swagger docs at `/docs`
- Image metadata CRUD (name, category, Firebase Storage URL)
- Category-based filtering (`wedding`, `reception`, `birthday`, `others`)
- Contact info management (WhatsApp, Instagram, Phone, Email)
- Auto-detects SQLite (local) vs PostgreSQL (Render) via `DATABASE_URL` env var
- CORS middleware for cross-origin frontend requests

---

### 🔷 Frontend

| Tool | Version | Purpose |
|---|---|---|
| **React** | 18+ | UI component library |
| **Vite** | 5+ | Fast build tool and dev server |
| **React Router DOM** | v6 | Client-side SPA routing |
| **Axios** | Latest | HTTP client for API calls |
| **Firebase SDK** | 10+ | Auth, Storage integration |
| **React Icons** | Latest | Icon library (HeroIcons, Remix Icons) |
| **React Toastify** | Latest | Toast notifications |
| **React Dropzone** | Latest | Drag-and-drop file upload UI |
| **Vanilla CSS** | — | Custom styling with CSS Variables |

**Key Frontend Features:**
- Public gallery with category filter tabs and image lightbox
- Direct-to-Firebase Storage image upload with progress bar
- Firebase Auth email/password admin login
- Admin dashboard with real-time image stats
- Manage gallery: edit name/category, delete images
- Contact settings panel
- Full mobile responsive design with hamburger sidebar menu
- Dark navy + violet/lavender gradient design system

---

### ☁️ Cloud Services

| Service | Provider | Purpose | Free Tier |
|---|---|---|---|
| **Hosting** | Vercel | Serves the React frontend | Generous |
| **Image Storage** | Cloudinary | Stores uploaded images | Generous |
| **Admin Auth** | FastAPI Custom Auth | Secure JWT-based admin login | Built-in |
| **API Server** | Render | Runs the FastAPI backend | 750 hrs/month |
| **Database** | Render PostgreSQL | Stores image metadata & contact info | 90 days free |

---

### 🎨 Design System

| Token | Value | Use |
|---|---|---|
| Background | `#060a14` | Page base |
| Card surface | `#0d1329` | Cards, panels |
| Accent (Primary) | `#6c5ce7` | Buttons, active states |
| Lavender | `#a29bfe` | Links, highlights |
| Gradient | `#6c5ce7 → #a29bfe` | Logo, CTAs, creator credit |
| Font (Body) | Inter | All text |
| Font (Display) | Outfit | Headings, logo |

---

### 🗂️ Project Structure

```
stagedecor/
├── backend/                    # FastAPI application
│   ├── main.py                 # App entry point, all API routes
│   ├── database.py             # DB engine (SQLite/PostgreSQL auto-detect)
│   ├── models.py               # SQLAlchemy DB models (Image, ContactInfo)
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── seed.py                 # Script to populate sample data
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React + Vite application
│   ├── firebase.json           # Firebase Hosting config
│   ├── .firebaserc             # Firebase project ID config
│   ├── .env.example            # Environment variable template
│   ├── public/                 # Static assets
│   └── src/
│       ├── api.js              # Axios API helper functions
│       ├── App.jsx             # Route definitions
│       ├── App.css             # Layout styles
│       ├── index.css           # Global design tokens / CSS variables
│       └── components/
│           ├── PublicGallery.jsx/css   # Public gallery page
│           ├── AdminLogin.jsx          # Firebase Auth login
│           ├── Sidebar.jsx/css         # Admin nav (hamburger on mobile)
│           ├── Dashboard.jsx/css       # Stats dashboard
│           ├── ImageUpload.jsx/css     # Backend direct upload UI
│           ├── ImageGallery.jsx/css    # Manage gallery (edit/delete)
│           ├── ContactSettings.jsx/css # Contact info manager
│           └── ImageEditModal.jsx/css  # Edit image modal
│
├── render.yaml                 # Render deployment blueprint
├── .gitignore
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
- **Node.js** v18+
- **Python** 3.10+

### 1. Backend (FastAPI + SQLite)

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux / Mac

# Install dependencies
pip install -r requirements.txt

# Optionally seed with sample images
python seed.py

# Start API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> API: **http://localhost:8000** | Swagger Docs: **http://localhost:8000/docs**

### 2. Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Copy env template & fill values (see .env.example)
cp .env.example .env

# Start dev server
npm run dev
```

> Website: **http://localhost:5173**

---

## 🌐 Production Deployment (End-to-End Guide)

This section walks you through deploying the full stack for free using:
- **Vercel** for the frontend
- **Render** (Web Service + PostgreSQL) for the backend
- **Cloudinary** for image storage

---

### ─── PHASE 1: Cloudinary Setup ──────────────────────────────────────

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard and get the API Environment variable:
   `CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@<your_cloud_name>`
3. Add this to your Render Environment Variables for the backend.

### ─── PHASE 2: Render Backend Deployment ──────────────────────────

The repo already contains `render.yaml` which auto-configures the basic services.

1. Render Dashboard → **New → Blueprint**
2. Select your GitHub repo
3. Click **Apply** — Render provisions both API and Database.
4. Add Environment Variables to your Web Service:
   - `CLOUDINARY_URL`: <your_cloudinary_url>
   - `JWT_SECRET_KEY`: <your_secret_key>

Note the Backend URL (e.g. `https://stagedecor-api.onrender.com`).

### ─── PHASE 3: Deploy Frontend to Vercel ──────────────────────────

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Add New** → **Project**
3. Import your GitHub repository.
4. Select the `frontend` folder as the Root Directory.
5. In Environment Variables, add:
   `VITE_API_URL=https://stagedecor-api.onrender.com`
6. Click **Deploy**.

> 🎉 Your website is now live!

### ─── Final URLs ────────────────────────────────────────────────

| Page | URL |
|---|---|
| 🌐 Public Gallery | _Assigned Vercel URL_ |
| 🔐 Admin Login | `_Vercel_URL_/login` |
| 📊 Admin Panel | `_Vercel_URL_/admin` |
| ⚙️ API (Render) | `https://stagedecor-api.onrender.com` |

### 🔑 Admin Credentials

| Field | Value |
|---|---|
| **Username** | `Devan` |
| **Password** | `5753` |

> These are custom JWT credentials handled directly by your backend.

---

## 🔄 Redeployment (After Code Changes)

### Update Frontend
```bash
# Push to GitHub
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys on push
```

### Update Backend
```bash
git add .
git commit -m "your changes"
git push
# Render auto-deploys on every push to main branch
```

---

## 👤 Author

**Devadeth N** — Full Stack Developer
> *Stage Decor — Crafted with ✦*
