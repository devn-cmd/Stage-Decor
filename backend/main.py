import os
import uuid
import shutil
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Image, ContactInfo
from schemas import (
    ImageResponse,
    ImageUpdate,
    ContactInfoResponse,
    ContactInfoUpdate,
)

# ── Create tables & uploads dir ─────────────────────────────────
Base.metadata.create_all(bind=engine)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ── FastAPI app ──────────────────────────────────────────────────
app = FastAPI(title="SilkStage Admin API", version="1.0.0")

# CORS – allow admin frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images as static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ── Helpers ──────────────────────────────────────────────────────
ALLOWED_CATEGORIES = {"wedding", "reception", "birthday", "others"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}


def _save_upload(file: UploadFile) -> str:
    """Save an uploaded file and return the stored filename."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    unique_name = f"{uuid.uuid4().hex}{ext}"
    dest = os.path.join(UPLOAD_DIR, unique_name)
    with open(dest, "wb") as buf:
        shutil.copyfileobj(file.file, buf)
    return unique_name


# ── Image Endpoints ──────────────────────────────────────────────

@app.post("/api/images/", response_model=ImageResponse)
async def upload_image(
    name: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a new stage decoration image."""
    if category.lower() not in ALLOWED_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Invalid category. Use: {', '.join(ALLOWED_CATEGORIES)}")

    filename = _save_upload(file)
    db_image = Image(name=name, category=category.lower(), filename=filename)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@app.get("/api/images/", response_model=List[ImageResponse])
def list_images(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List all images, optionally filtered by category."""
    query = db.query(Image).order_by(Image.created_at.desc())
    if category:
        query = query.filter(Image.category == category.lower())
    return query.all()


@app.get("/api/images/{image_id}", response_model=ImageResponse)
def get_image(image_id: int, db: Session = Depends(get_db)):
    """Get a single image by ID."""
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image


@app.put("/api/images/{image_id}", response_model=ImageResponse)
def update_image(
    image_id: int,
    update: ImageUpdate,
    db: Session = Depends(get_db),
):
    """Update image name and/or category."""
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    if update.name is not None:
        image.name = update.name
    if update.category is not None:
        if update.category.lower() not in ALLOWED_CATEGORIES:
            raise HTTPException(status_code=400, detail=f"Invalid category. Use: {', '.join(ALLOWED_CATEGORIES)}")
        image.category = update.category.lower()

    db.commit()
    db.refresh(image)
    return image


@app.delete("/api/images/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db)):
    """Delete an image and its file."""
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Remove file from disk
    filepath = os.path.join(UPLOAD_DIR, image.filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    db.delete(image)
    db.commit()
    return {"detail": "Image deleted successfully"}


# ── Stats Endpoint ───────────────────────────────────────────────

@app.get("/api/stats/")
def get_stats(db: Session = Depends(get_db)):
    """Return image count stats for the dashboard."""
    total = db.query(Image).count()
    wedding = db.query(Image).filter(Image.category == "wedding").count()
    reception = db.query(Image).filter(Image.category == "reception").count()
    birthday = db.query(Image).filter(Image.category == "birthday").count()
    others = db.query(Image).filter(Image.category == "others").count()
    return {
        "total": total,
        "wedding": wedding,
        "reception": reception,
        "birthday": birthday,
        "others": others,
    }


# ── Contact Info Endpoints ───────────────────────────────────────

@app.get("/api/contact/", response_model=ContactInfoResponse)
def get_contact(db: Session = Depends(get_db)):
    """Get admin contact information."""
    contact = db.query(ContactInfo).first()
    if not contact:
        # Create default entry
        contact = ContactInfo()
        db.add(contact)
        db.commit()
        db.refresh(contact)
    return contact


@app.put("/api/contact/", response_model=ContactInfoResponse)
def update_contact(update: ContactInfoUpdate, db: Session = Depends(get_db)):
    """Update admin contact information."""
    contact = db.query(ContactInfo).first()
    if not contact:
        contact = ContactInfo()
        db.add(contact)
        db.commit()
        db.refresh(contact)

    contact.phone = update.phone
    contact.email = update.email
    contact.address = update.address
    contact.whatsapp = update.whatsapp
    contact.instagram = update.instagram

    db.commit()
    db.refresh(contact)
    return contact


# ── Root ─────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "SilkStage Admin API is running", "docs": "/docs"}
