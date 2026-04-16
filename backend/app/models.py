from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False, index=True)  # wedding, reception, birthday, others
    filename = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Image(id={self.id}, name='{self.name}', category='{self.category}')>"


class ContactInfo(Base):
    __tablename__ = "contact_info"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(255), default="SilkStage Decorations")
    phone = Column(String(50), default="+91 98765 43210")
    email = Column(String(255), default="hello@silkstage.com")
    address = Column(Text, default="123 Event Avenue, Mumbai, India")
    instagram = Column(String(255), default="@silkstage")
    whatsapp = Column(String(50), default="+91 98765 43210")
