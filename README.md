# Stage Decor - Full Stack Web App

A beautiful, lively gallery website for a stage decoration business. Built with FastAPI (Backend) and React (Frontend).

## Prerequisites
- Node.js (v18+)
- Python (3.10+)

## 1. Backend Setup (FastAPI)

The backend code is located in `admin/backend`.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd admin/backend
   ```
2. Create a virtual environment and activate it (optional but recommended):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database with mock images:
   ```bash
   python seed.py
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
The backend API will run on `http://localhost:8000`.

## 2. Frontend Setup (React)

The frontend code is located in `user/frontend`.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd user/frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend website will run on `http://localhost:5173`.

## Usage
- **Gallery**: Visit `http://localhost:5173` to see the public gallery.
- **Admin Panel**: Visit `http://localhost:5173/admin` to upload and manage decorations. The admin password is `stagedecor2024`.
