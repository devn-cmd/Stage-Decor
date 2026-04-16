from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ContactInfo
from app.schemas import ContactResponse, ContactUpdate
from app.routes.admin import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["contact"])


def get_or_create_contact(db: Session) -> ContactInfo:
    """Get existing contact info or create default."""
    contact = db.query(ContactInfo).first()
    if not contact:
        contact = ContactInfo()
        db.add(contact)
        db.commit()
        db.refresh(contact)
    return contact


@router.get("", response_model=ContactResponse)
def get_contact(db: Session = Depends(get_db)):
    """Get contact information."""
    return get_or_create_contact(db)


@router.put("", response_model=ContactResponse)
def update_contact(
    contact_data: ContactUpdate,
    db: Session = Depends(get_db),
    admin: bool = Depends(get_current_admin)
):
    """Update contact information (admin only)."""
    contact = get_or_create_contact(db)
    
    for field, value in contact_data.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    
    db.commit()
    db.refresh(contact)
    return contact
