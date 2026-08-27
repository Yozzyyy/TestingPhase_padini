# seed.py
from database import SessionLocal
import models
from auth import pwd_context

def seed_database():
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(models.User).first():
            print("⚠️ Database already seeded. Skipping...")
            return

        print("🌱 Seeding database...")
        admin_user = models.User(
            staff_id=9000,
            email="hr.admin@padini.com",
            role="Admin",
            job_title="HR Manager",
            store_location="Headquarters",
            hashed_password=pwd_context.hash("PadiniAdmin123!")
        )
        
        staff = models.User(
            staff_id=1001, email="jessica.k@padini.com", role="Staff", 
            job_title="Senior Sales Associate", store_location="Mid Valley Megamall"
        )

        db.add_all([admin_user, staff])
        db.commit()
        print("✅ Seeding complete!")
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
    finally:
        db.close()
        
        
seed_database()
        
        
