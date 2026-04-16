from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# --- Image Schemas ---
class ImageBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None

class ImageCreate(ImageBase):
    pass

class ImageResponse(ImageBase):
    id: int
    filename: str
    upload_date: datetime
    image_url: str = ""

    class Config:
        from_attributes = True


# --- Contact Schemas ---
class ContactBase(BaseModel):
    business_name: Optional[str] = "SilkStage Decorations"
    phone: Optional[str] = "+91 98765 43210"
    email: Optional[str] = "hello@silkstage.com"
    address: Optional[str] = "123 Event Avenue, Mumbai, India"
    instagram: Optional[str] = "@silkstage"
    whatsapp: Optional[str] = "+91 98765 43210"

class ContactUpdate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: int

    class Config:
        from_attributes = True


# --- Admin Schemas ---
class AdminLogin(BaseModel):
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
