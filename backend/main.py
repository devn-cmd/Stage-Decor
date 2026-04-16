import os
import uuid
import shutil
import cloudinary
import cloudinary.uploader
from typing import Optional, List
from datetime import datetime, timedelta
import jwt

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Image, ContactInfo
from schemas import (
    ImageResponse,
    ImageUpdate,
    ContactInfoResponse,
    ContactInfoUpdate,
)

# ── Create tables ─────────────
Base.metadata.create_all(bind=engine)


# ── FastAPI app ──────────────────────────────────────────────────
app = FastAPI(title="Stage Decor API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_CATEGORIES = {"wedding", "reception", "birthday", "others"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}

# Configure Cloudinary
# It is assumed that CLOUDINARY_URL environment variable is set
# e.g., CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cloudinary.config(secure=True)

# ── Authentication ────────────────────────────────────────────────
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-for-stagedecor")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    return username

@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Hardcoded test credentials
    if form_data.username == "Devan" and form_data.password == "5753":
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

def _save_upload(file: UploadFile) -> str:
    """Save upload strictly to Cloudinary."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    
    # Upload to Cloudinary (assuming CLOUDINARY_URL is configured in environment)
    try:
        result = cloudinary.uploader.upload(file.file)
        return result.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image to Cloudinary: {str(e)}")


# ── Image Endpoints ──────────────────────────────────────────────

@app.post("/api/images/", response_model=ImageResponse)
async def upload_image(
    name: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    if category.lower() not in ALLOWED_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category. Use: {', '.join(ALLOWED_CATEGORIES)}",
        )

    filename_or_url = _save_upload(file)
    db_image = Image(name=name, category=category.lower(), filename=filename_or_url)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@app.get("/api/images/", response_model=List[ImageResponse])
def list_images(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Image).order_by(Image.created_at.desc())
    if category:
        query = query.filter(Image.category == category.lower())
    return query.all()


@app.get("/api/images/{image_id}", response_model=ImageResponse)
def get_image(image_id: int, db: Session = Depends(get_db)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image


@app.put("/api/images/{image_id}", response_model=ImageResponse)
def update_image(
    image_id: int,
    update: ImageUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    if update.name is not None:
        image.name = update.name
    if update.category is not None:
        if update.category.lower() not in ALLOWED_CATEGORIES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category. Use: {', '.join(ALLOWED_CATEGORIES)}",
            )
        image.category = update.category.lower()

    db.commit()
    db.refresh(image)
    return image


@app.delete("/api/images/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Clean up Cloudinary using public_id extraction
    if image.filename.startswith("http"):
        try:
            public_id = image.filename.split("/")[-1].split(".")[0]
            cloudinary.uploader.destroy(public_id)
        except Exception:
            pass

    db.delete(image)
    db.commit()
    return {"detail": "Image deleted successfully"}


# ── Stats ────────────────────────────────────────────────────────

@app.get("/api/stats/")
def get_stats(db: Session = Depends(get_db)):
    total     = db.query(Image).count()
    wedding   = db.query(Image).filter(Image.category == "wedding").count()
    reception = db.query(Image).filter(Image.category == "reception").count()
    birthday  = db.query(Image).filter(Image.category == "birthday").count()
    others    = db.query(Image).filter(Image.category == "others").count()
    return {
        "total": total, "wedding": wedding,
        "reception": reception, "birthday": birthday, "others": others,
    }


# ── Contact Info ─────────────────────────────────────────────────

@app.get("/api/contact/", response_model=ContactInfoResponse)
def get_contact(db: Session = Depends(get_db)):
    contact = db.query(ContactInfo).first()
    if not contact:
        contact = ContactInfo()
        db.add(contact)
        db.commit()
        db.refresh(contact)
    return contact


@app.put("/api/contact/", response_model=ContactInfoResponse)
def update_contact(update: ContactInfoUpdate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    contact = db.query(ContactInfo).first()
    if not contact:
        contact = ContactInfo()
        db.add(contact)
        db.commit()
        db.refresh(contact)

    contact.phone     = update.phone
    contact.email     = update.email
    contact.address   = update.address
    contact.whatsapp  = update.whatsapp
    contact.instagram = update.instagram

    db.commit()
    db.refresh(contact)
    return contact


# ── Root ─────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Stage Decor API is running ✓", "docs": "/docs"}
