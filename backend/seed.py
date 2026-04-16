"""
Seed script to populate the database with initial stage decoration images.
Run this from the backend directory: python seed.py
"""
import os
import sys
import shutil

# Ensure app is importable
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, SessionLocal, Base
from app.models import Image, ContactInfo

# Create tables
Base.metadata.create_all(bind=engine)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
SEED_DIR = os.path.join(os.path.dirname(__file__), "seed_images")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Seed image data: (filename_in_seed_dir, display_name, category)
SEED_IMAGES = [
    ("wedding_stage_1.png", "Golden Mandap Elegance", "wedding"),
    ("wedding_stage_2.png", "Rose Garden Romance", "wedding"),
    ("wedding_stage_3.png", "Royal Palace Wedding", "wedding"),
    ("reception_stage_1.png", "Red & Gold Grandeur", "reception"),
    ("reception_stage_2.png", "Purple Majesty Reception", "reception"),
    ("reception_stage_3.png", "Rustic Charm Reception", "reception"),
    ("birthday_stage_1.png", "Balloon Fiesta Celebration", "birthday"),
    ("birthday_stage_2.png", "Enchanted Forest Party", "birthday"),
    ("birthday_stage_3.png", "Golden Jubilee Gala", "birthday"),
    ("others_stage_1.png", "Corporate Stage Setup", "others"),
    ("others_stage_2.png", "Engagement Ceremony Bliss", "others"),
]

def seed():
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing = db.query(Image).count()
        if existing > 0:
            print(f"Database already has {existing} images. Skipping seed.")
            return
        
        # Copy seed images to uploads and add to DB
        copied = 0
        for filename, name, category in SEED_IMAGES:
            src = os.path.join(SEED_DIR, filename)
            if not os.path.exists(src):
                print(f"  [!] Seed image not found: {filename}")
                continue
            
            # Copy to uploads
            dst = os.path.join(UPLOAD_DIR, filename)
            shutil.copy2(src, dst)
            
            # Add to database
            image = Image(
                name=name,
                category=category,
                filename=filename,
                description=f"Beautiful {category} stage decoration - {name}"
            )
            db.add(image)
            copied += 1
            print(f"  [+] Added: {name} ({category})")
        
        # Seed default contact info
        contact = db.query(ContactInfo).first()
        if not contact:
            contact = ContactInfo(
                business_name="SilkStage Decorations",
                phone="+91 98765 43210",
                email="hello@silkstage.com",
                address="123 Event Avenue, Mumbai, India",
                instagram="@silkstage",
                whatsapp="+91 98765 43210"
            )
            db.add(contact)
            print("  [+] Added default contact info")
        
        db.commit()
        print(f"\n[OK] Seeded {copied} images successfully!")
    
    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("[SEED] Seeding SilkStage database...\n")
    seed()
