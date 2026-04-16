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
| **Hosting** | Firebase Hosting | Serves the React frontend | 10 GB/month |
| **Image Storage** | Firebase Storage | Stores uploaded images | 5 GB |
| **Admin Auth** | Firebase Auth | Secure admin login | 10k users/month |
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
│       ├── firebase.js         # Firebase SDK initialization
│       ├── api.js              # Axios API helper functions
│       ├── App.jsx             # Route definitions
│       ├── App.css             # Layout styles
│       ├── index.css           # Global design tokens / CSS variables
│       └── components/
│           ├── PublicGallery.jsx/css   # Public gallery page
│           ├── AdminLogin.jsx          # Firebase Auth login
│           ├── Sidebar.jsx/css         # Admin nav (hamburger on mobile)
│           ├── Dashboard.jsx/css       # Stats dashboard
│           ├── ImageUpload.jsx/css     # Firebase Storage upload UI
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
- **Firebase** (Hosting + Storage + Authentication) for the frontend
- **Render** (Web Service + PostgreSQL) for the backend

---

### ─── PHASE 1: Firebase Setup ──────────────────────────────────────

#### 1.1 — Create a Firebase Project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Add project"**
3. Enter project name: `stage-decor` (or any name)
4. Disable Google Analytics (optional) → **Create project**

---

#### 1.2 — Enable Firebase Authentication

1. In the Firebase Console sidebar → **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method** tab → Click **Email/Password** → Toggle **Enable** → Save
4. Go to the **Users** tab → Click **"Add user"**
   - Email: `admin@stagedecor.com`
   - Password: `5753`
5. Click **Add user** — this is the admin login credential

> ⚠️ The app login page will now use this email/password via Firebase Auth.

---

#### 1.3 — Enable Firebase Storage

1. Firebase Console → **Build → Storage**
2. Click **"Get started"** → Choose **Production mode** → Select your region → Done
3. Go to the **Rules** tab → Replace the rules with:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;                      // Anyone can view images
      allow write: if request.auth != null;     // Only logged-in admins can upload
    }
  }
}
```

4. Click **Publish**

---

#### 1.4 — Register Your Web App & Get Config

1. Firebase Console → ⚙️ **Project Settings** (gear icon)
2. Scroll to **"Your apps"** → Click **`</>`** (Web) icon
3. Register app with nickname `stage-decor-web` → **Register app**
4. Copy the `firebaseConfig` object — you'll need these values:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "stage-decor.firebaseapp.com",
  projectId: "stage-decor",
  storageBucket: "stage-decor.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### ─── PHASE 2: Render Backend Deployment ──────────────────────────

#### 2.1 — Create a Render Account

1. Go to **[render.com](https://render.com)** → Sign up (free)
2. Connect your **GitHub** account

---

#### 2.2 — Deploy via Blueprint (render.yaml)

The repo already contains `render.yaml` which auto-configures everything.

1. Render Dashboard → **New → Blueprint**
2. Select your GitHub repo: `devn-cmd/Stage-Decor`
3. Render will detect `render.yaml` and show you:
   - ✅ **stagedecor-api** — FastAPI web service
   - ✅ **stagedecor-db** — Free PostgreSQL database
4. Click **Apply** — Render provisions both automatically

> 🕐 First deploy takes ~3–5 minutes.

---

#### 2.3 — Note Your Backend URL

After deploy, Render gives your API a public URL like:

```
https://stagedecor-api.onrender.com
```

Copy this — you'll need it for the frontend `.env` file.

> ⚠️ **Free Render services sleep after 15 minutes of inactivity.** First request after sleep takes ~30 seconds to wake up.

---

### ─── PHASE 3: Frontend Environment Variables ─────────────────────

#### 3.1 — Create Your `.env` File

Inside `frontend/`, create a file called `.env` (copy from `.env.example`):

```env
# Firebase — paste values from Step 1.4
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=stage-decor.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=stage-decor
VITE_FIREBASE_STORAGE_BUCKET=stage-decor.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Render backend URL — from Step 2.3
VITE_API_URL=https://stagedecor-api.onrender.com
```

> ⚠️ Never commit `.env` to Git. It is already in `.gitignore`.

---

#### 3.2 — Update `.firebaserc` with Your Project ID

Open `frontend/.firebaserc` and replace the placeholder:

```json
{
  "projects": {
    "default": "stage-decor"
  }
}
```

---

### ─── PHASE 4: Deploy Frontend to Firebase Hosting ───────────────

#### 4.1 — Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### 4.2 — Login to Firebase

```bash
firebase login
```

This opens a browser window — sign in with the Google account that owns your Firebase project.

#### 4.3 — Build the React App

```bash
cd frontend
npm run build
```

This outputs a production-ready `dist/` folder.

#### 4.4 — Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

After a few seconds you'll see:

```
✔  Deploy complete!
Hosting URL: https://stage-decor.web.app
```

> 🎉 Your website is now live!

---

### ─── PHASE 5: Also Add Firebase Env Vars to Render ──────────────

Your backend doesn't use Firebase directly, but for future Firebase Admin SDK integration, add the project ID to Render:

1. Render Dashboard → Your **stagedecor-api** service → **Environment**
2. Update `ALLOWED_ORIGINS` to include your Firebase Hosting URL:
   ```
   https://stage-decor.web.app,https://stage-decor.firebaseapp.com
   ```
3. Click **Save Changes** → Render redeploys automatically

---

### ─── Final URLs ────────────────────────────────────────────────

| Page | URL |
|---|---|
| 🌐 Public Gallery | `https://stage-decor.web.app` |
| 🔐 Admin Login | `https://stage-decor.web.app/login` |
| 📊 Admin Panel | `https://stage-decor.web.app/admin` |
| ⚙️ API (Render) | `https://stagedecor-api.onrender.com` |
| 📖 API Swagger Docs | `https://stagedecor-api.onrender.com/docs` |

### 🔑 Admin Credentials

| Field | Value |
|---|---|
| **Email** | `admin@stagedecor.com` |
| **Password** | `5753` |

> These are your Firebase Auth credentials — change them anytime in Firebase Console → Authentication → Users.

---

## 🔄 Redeployment (After Code Changes)

### Update Frontend
```bash
cd frontend
npm run build
firebase deploy --only hosting
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
