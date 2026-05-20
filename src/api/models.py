from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
            # do not serialize the password, its a security breach
        }

class Service(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text(), nullable=True)
    price: Mapped[float] = mapped_column(Float(), nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=True) # e.g. 'servicio', 'producto'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "category": self.category
        }

class Course(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text(), nullable=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    button_text: Mapped[str] = mapped_column(String(50), nullable=True, default="Más Información")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "image_url": self.image_url,
            "button_text": self.button_text
        }

class PerformanceMetric(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    metric_name: Mapped[str] = mapped_column(String(50), nullable=False) # LCP, FID, CLS, TTFB, FCP
    value: Mapped[float] = mapped_column(Float(), nullable=False)
    rating: Mapped[str] = mapped_column(String(20), nullable=False) # good, needs-improvement, poor
    user_agent: Mapped[str] = mapped_column(String(255), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "metric_name": self.metric_name,
            "value": self.value,
            "rating": self.rating,
            "user_agent": self.user_agent,
            "timestamp": self.timestamp.isoformat()
        }