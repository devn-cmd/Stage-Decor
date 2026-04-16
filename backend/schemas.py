from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# ── Image Schemas ──────────────────────────────────────────────

class ImageBase(BaseModel):
    name: str
    category: str  # wedding, reception, birthday, others


class ImageCreate(ImageBase):
    pass


class ImageUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None


class ImageResponse(ImageBase):
    id: int
    filename: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Contact Info Schemas ───────────────────────────────────────

class ContactInfoBase(BaseModel):
    phone: str = ""
    email: str = ""
    address: str = ""
    whatsapp: str = ""
    instagram: str = ""


class ContactInfoUpdate(ContactInfoBase):
    pass


class ContactInfoResponse(ContactInfoBase):
    id: int

    class Config:
        from_attributes = True
