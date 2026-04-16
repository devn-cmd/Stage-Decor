from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil

from app.database import get_db
from app.models import Image
from app.schemas import ImageResponse
from app.routes.admin import get_current_admin

router = APIRouter(prefix="/api/images", tags=["images"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def image_to_response(image: Image, base_url: str = "") -> dict:
    """Convert Image model to response dict with image_url."""
    return {
        "id": image.id,
        "name": image.name,
        "category": image.category,
        "description": image.description,
        "filename": image.filename,
        "upload_date": image.upload_date,
        "image_url": f"/uploads/{image.filename}"
    }


@router.get("", response_model=List[ImageResponse])
def list_images(
    category: Optional[str] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1),
    per_page: int = Query(6, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """List all images with optional category filter and pagination."""
    query = db.query(Image)
    if category and category.lower() != "all":
        query = query.filter(Image.category == category.lower())
    
    total = query.count()
    images = query.order_by(Image.upload_date.desc()).offset((page - 1) * per_page).limit(per_page).all()
    
    return [image_to_response(img) for img in images]


@router.get("/count")
def count_images(
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """Get total count of images (for pagination)."""
    query = db.query(Image)
    if category and category.lower() != "all":
        query = query.filter(Image.category == category.lower())
    return {"count": query.count()}


@router.get("/{image_id}", response_model=ImageResponse)
def get_image(image_id: int, db: Session = Depends(get_db)):
    """Get a single image by ID."""
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image_to_response(image)


@router.post("", response_model=ImageResponse)
async def upload_image(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: bool = Depends(get_current_admin)
):
    """Upload a new image (admin only)."""
    # Validate category
    valid_categories = ["wedding", "reception", "birthday", "others"]
    if category.lower() not in valid_categories:
        raise HTTPException(status_code=400, detail=f"Category must be one of: {valid_categories}")
    
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1] or ".png"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Save to database
    db_image = Image(
        name=name,
        category=category.lower(),
        filename=unique_filename,
        description=description
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return image_to_response(db_image)


@router.delete("/{image_id}")
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin: bool = Depends(get_current_admin)
):
    """Delete an image (admin only)."""
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete file from disk
    file_path = os.path.join(UPLOAD_DIR, image.filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    
    db.delete(image)
    db.commit()
    return {"message": "Image deleted successfully"}
