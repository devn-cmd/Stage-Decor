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
| **SQLite** | Built-in | Lightweight relational database (file-based) |
| **Pydantic** | v2 | Data validation and serialization (via FastAPI) |
| **Python-Multipart** | Latest | Handles image file uploads (multipart/form-data) |
| **Shutil / OS** | Built-in | File system operations for image storage |

**Key Backend Features:**
- RESTful API with automatic Swagger docs at `/docs`
- Image upload, listing, update, and deletion endpoints
- Category-based filtering (`wedding`, `reception`, `birthday`, `others`)
- Contact info CRUD (WhatsApp, Instagram, Phone)
- Static file serving for uploaded images
- SQLite database with SQLAlchemy models
- CORS middleware enabled for React frontend

---

### 🔷 Frontend

| Tool | Version | Purpose |
|---|---|---|
| **React** | 18+ | UI component library |
| **Vite** | 5+ | Fast build tool and dev server |
| **React Router DOM** | v6 | Client-side routing (SPA navigation) |
| **Axios** | Latest | HTTP client for API calls |
| **React Icons** | Latest | Icon library (HeroIcons, Remix Icons) |
| **React Toastify** | Latest | Toast notification system |
| **Vanilla CSS** | — | Custom styling with CSS Variables |

**Key Frontend Features:**
- Public gallery with category filter tabs
- Image lightbox / modal with booking panel
- Contact options (WhatsApp, Instagram, Phone call)
- Admin login (`Devan` / `5753`)
- Admin dashboard with image stats
- Image upload with drag-and-drop dropzone
- Admin gallery with edit and delete modals
- Contact settings configuration panel
- Full mobile responsive design with hamburger sidebar
- Dark navy + violet/lavender gradient design system

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
├── backend/                  # FastAPI application
│   ├── main.py               # App entry point, routes, CORS
│   ├── models.py             # SQLAlchemy DB models
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── database.py           # DB engine and session setup
│   ├── seed.py               # Script to populate sample data
│   ├── requirements.txt      # Python dependencies
│   └── seed_images/          # Sample decoration images
│
├── frontend/                 # React + Vite application
│   ├── public/               # Static assets (favicon, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── PublicGallery.jsx   # Public gallery page
│   │   │   ├── PublicGallery.css
│   │   │   ├── AdminLogin.jsx      # Login page
│   │   │   ├── AdminLayout.jsx     # Admin shell layout
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── Sidebar.css
│   │   │   ├── Dashboard.jsx       # Admin dashboard
│   │   │   ├── ImageUpload.jsx     # Upload new images
│   │   │   ├── ImageGallery.jsx    # Manage gallery (edit/delete)
│   │   │   ├── ContactSettings.jsx # Set contact info
│   │   │   └── ImageEditModal.jsx  # Edit image name/category
│   │   ├── api.js            # Axios API helper functions
│   │   ├── App.jsx           # Route definitions
│   │   ├── App.css           # Layout styles
│   │   └── index.css         # Global design tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── seed_images/              # Root-level seed images
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **Python** 3.10+

---

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux / Mac

# Install dependencies
pip install -r requirements.txt

# Seed sample images (optional)
python seed.py

# Start the API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> API runs at: **http://localhost:8000**
> Swagger UI: **http://localhost:8000/docs**

---

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> Website runs at: **http://localhost:5173**

---

## 🔑 Access

| Page | URL | Credentials |
|---|---|---|
| Public Gallery | `http://localhost:5173` | Open to all |
| Admin Login | `http://localhost:5173/login` | — |
| Admin Panel | `http://localhost:5173/admin` | `Devan` / `5753` |
| API Docs | `http://localhost:8000/docs` | — |

---

## 👤 Author

**Devadeth N** — Full Stack Developer
> *Stage Decor — Crafted with ✦*
