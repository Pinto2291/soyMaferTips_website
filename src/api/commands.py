import click
from api.models import db, User, Service, Course
from werkzeug.security import generate_password_hash

def setup_commands(app):
    
    @app.cli.command("seed-db")
    def seed_db():
        print("Starting database seeding...")
        
        # 1. Create Admin User
        admin_email = "admin@soymafertips.com"
        admin_password = "mariaadmin2026"
        
        existing_admin = User.query.filter_by(email=admin_email).first()
        if not existing_admin:
            hashed_pwd = generate_password_hash(admin_password)
            admin_user = User(
                email=admin_email,
                password=hashed_pwd,
                is_active=True
            )
            db.session.add(admin_user)
            db.session.commit()
            print(f"Admin user '{admin_email}' created successfully.")
        else:
            # Update password just in case
            existing_admin.password = generate_password_hash(admin_password)
            db.session.commit()
            print(f"Admin user '{admin_email}' already existed. Password updated.")

        # 2. Seed Services & Products
        services_data = [
            {
                "name": "Maquillaje Social",
                "price": 30.00,
                "image_url": "img/Photos-1-001/maquillaje.jpg",
                "description": "Realza tu belleza para eventos especiales, fiestas y celebraciones. Utilizamos productos de alta calidad.",
                "category": "servicio"
            },
            {
                "name": "Maquillaje Y Estilismismo",
                "price": 50.00,
                "image_url": "img/IMG_8749.JPG",
                "description": "Un look perfecto y duradero para tu día más especial. Incluye prueba de maquillaje. Desde $50 en adelante",
                "category": "servicio"
            },
            {
                "name": "Tratamientos Faciales",
                "price": 30.00,
                "image_url": "img/Photos-1-001/IMG-20250529-WA0121.jpg",
                "description": "Limpieza facial profunda, hidratación, tratamientos anti-edad y más para cuidar tu piel. A partir de $30",
                "category": "servicio"
            },
            {
                "name": "Venta de Productos",
                "price": 0.00,
                "image_url": "img/mafer vitamina C.jpg",
                "description": "Adquiere los mejores productos de maquillaje y cuidado de la piel recomendados por una profesional.",
                "category": "producto"
            }
        ]
        
        # Clear existing services to prevent duplicates in seed
        db.session.query(Service).delete()
        
        for s in services_data:
            service = Service(
                name=s["name"],
                price=s["price"],
                image_url=s["image_url"],
                description=s["description"],
                category=s["category"]
            )
            db.session.add(service)
            
        print(f"Inserted {len(services_data)} initial services.")
        
        # 3. Seed Courses
        courses_data = [
            {
                "title": "Curso de Automaquillaje",
                "image_url": "img/auto-maquillaje.JPG",
                "description": "Aprende a maquillarte como una profesional, conociendo tu tipo de rostro y los productos adecuados para ti.",
                "button_text": "Más Información"
            },
            {
                "title": "Curso de Maquillaje Profesional",
                "image_url": "img/IMG_8676.JPG",
                "description": "Fórmate como maquillador/a profesional con técnicas avanzadas y conocimiento de productos.",
                "button_text": "Más Información"
            },
            {
                "title": "Talleres de Perfeccionamiento",
                "image_url": "img/talleres de perfeccionamiento.JPG",
                "description": "Actualiza tus técnicas y aprende las últimas tendencias en maquillaje para profesionales.",
                "button_text": "Más Información"
            }
        ]
        
        # Clear existing courses to prevent duplicates in seed
        db.session.query(Course).delete()
        
        for c in courses_data:
            course = Course(
                title=c["title"],
                image_url=c["image_url"],
                description=c["description"],
                button_text=c["button_text"]
            )
            db.session.add(course)
            
        print(f"Inserted {len(courses_data)} initial courses.")
        
        db.session.commit()
        print("Database seeding completed successfully!")