from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class Image(Base):
    """Stores stage decoration images with name and category."""
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # wedding, reception, birthday, others
    filename = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContactInfo(Base):
    """Stores admin contact details displayed on the user website."""
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone = Column(String(20), default="")
    email = Column(String(255), default="")
    address = Column(Text, default="")
    whatsapp = Column(String(20), default="")
    instagram = Column(String(255), default="")
