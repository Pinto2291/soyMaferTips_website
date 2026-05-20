"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Service, Course, PerformanceMetric
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import func

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# A static secure token for simplicity in the boilerplate.
# In a real environment, you'd generate a JWT token.
ADMIN_TOKEN = "maria-admin-session-secure-token-2026"

def check_admin_auth():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return False
    token = auth_header.split(' ')[1]
    return token == ADMIN_TOKEN

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# --- AUTHENTICATION ---
@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    if not body:
        return jsonify({"message": "Request body must be JSON"}), 400
    
    email = body.get("email")
    password = body.get("password")
    
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
        
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401
        
    if not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid email or password"}), 401
        
    if not user.is_active:
        return jsonify({"message": "User account is disabled"}), 403
        
    return jsonify({
        "token": ADMIN_TOKEN,
        "user": user.serialize()
    }), 200


# --- SERVICES CRUD ---
@api.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    serialized = [s.serialize() for s in services]
    return jsonify(serialized), 200

@api.route('/services', methods=['POST'])
def add_service():
    if not check_admin_auth():
        return jsonify({"message": "Unauthorized"}), 401
        
    body = request.get_json()
    if not body:
        return jsonify({"message": "Body is required"}), 400
        
    name = body.get("name")
    price = body.get("price")
    description = body.get("description", "")
    image_url = body.get("image_url", "")
    category = body.get("category", "servicio")
    
    if not name or price is None:
        return jsonify({"message": "Name and Price are required"}), 400
        
    new_service = Service(
        name=name,
        price=float(price),
        description=description,
        image_url=image_url,
        category=category
    )
    
    db.session.add(new_service)
    db.session.commit()
    return jsonify(new_service.serialize()), 201

@api.route('/services/<int:id>', methods=['PUT'])
def update_service(id):
    if not check_admin_auth():
        return jsonify({"message": "Unauthorized"}), 401
        
    body = request.get_json()
    if not body:
        return jsonify({"message": "Body is required"}), 400
        
    service = Service.query.get(id)
    if not service:
        return jsonify({"message": "Service not found"}), 404
        
    if "name" in body:
        service.name = body["name"]
    if "price" in body:
        service.price = float(body["price"])
    if "description" in body:
        service.description = body["description"]
    if "image_url" in body:
        service.image_url = body["image_url"]
    if "category" in body:
        service.category = body["category"]
        
    db.session.commit()
    return jsonify(service.serialize()), 200

@api.route('/services/<int:id>', methods=['DELETE'])
def delete_service(id):
    if not check_admin_auth():
        return jsonify({"message": "Unauthorized"}), 401
        
    service = Service.query.get(id)
    if not service:
        return jsonify({"message": "Service not found"}), 404
        
    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted successfully"}), 200


# --- COURSES CRUD ---
@api.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    serialized = [c.serialize() for c in courses]
    return jsonify(serialized), 200

@api.route('/courses', methods=['POST'])
def add_course():
    if not check_admin_auth():
        return jsonify({"message": "Unauthorized"}), 401
        
    body = request.get_json()
    if not body:
        return jsonify({"message": "Body is required"}), 400
        
    title = body.get("title")
    description = body.get("description", "")
    image_url = body.get("image_url", "")
    button_text = body.get("button_text", "Más Información")
    
    if not title:
        return jsonify({"message": "Title is required"}), 400
        
    new_course = Course(
        title=title,
        description=description,
        image_url=image_url,
        button_text=button_text
    )
    
    db.session.add(new_course)
    db.session.commit()
    return jsonify(new_course.serialize()), 201

@api.route('/courses/<int:id>', methods=['PUT'])
def update_course(id):
    if not check_admin_auth():
        return jsonify({"message": "Unauthorized"}), 401
        
    body = request.get_json()
    if not body:
        return jsonify({"message": "Body is required"}), 400
        
    course = Course.query.get(id)
    if not course:
        return jsonify({"message": "Course not found"}), 404
        
    if "title" in body:
        course.title = body["title"]
    if "description" in body:
        course.description = body["description"]
    if "image_url" in body:
        course.image_url = body["image_url"]
    if "button_text" in body:
        course.button_text = body["button_text"]
        
    db.session.commit()
    return jsonify(course.serialize()), 200

@api.route('/courses/<int:id>', methods=['DELETE'])
def delete_course(id):
    if not check_admin_auth():
        return jsonify({"message": "Unauthorized"}), 401
        
    course = Course.query.get(id)
    if not course:
        return jsonify({"message": "Course not found"}), 404
        
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted successfully"}), 200


# --- PERFORMANCE METRICS API ---
@api.route('/performance', methods=['POST'])
def add_performance_metric():
    body = request.get_json()
    if not body:
        return jsonify({"message": "Body is required"}), 400
        
    metric_name = body.get("metric_name")
    value = body.get("value")
    rating = body.get("rating")
    user_agent = request.headers.get('User-Agent', '')
    
    if not metric_name or value is None or not rating:
        return jsonify({"message": "Metric name, value and rating are required"}), 400
        
    new_metric = PerformanceMetric(
        metric_name=metric_name,
        value=float(value),
        rating=rating,
        user_agent=user_agent
    )
    
    db.session.add(new_metric)
    db.session.commit()
    return jsonify(new_metric.serialize()), 201

@api.route('/performance', methods=['GET'])
def get_performance_metrics():
    if not check_admin_auth():
        return jsonify({"message": "Unauthorized"}), 401
        
    # Get average values for each metric type
    averages = db.session.query(
        PerformanceMetric.metric_name,
        func.avg(PerformanceMetric.value).label('avg_value'),
        func.count(PerformanceMetric.id).label('count')
    ).group_by(PerformanceMetric.metric_name).all()
    
    # Get all logs for diagnostic list (limit to 50 latest)
    logs = PerformanceMetric.query.order_by(PerformanceMetric.timestamp.desc()).limit(50).all()
    
    avg_data = []
    for avg in averages:
        # Determine rating for the average value
        name = avg[0]
        val = avg[1]
        cnt = avg[2]
        
        rating = "good"
        if name == "LCP":
            if val > 4000: rating = "poor"
            elif val > 2500: rating = "needs-improvement"
        elif name == "FID":
            if val > 300: rating = "poor"
            elif val > 100: rating = "needs-improvement"
        elif name == "CLS":
            if val > 0.25: rating = "poor"
            elif val > 0.1: rating = "needs-improvement"
        elif name == "TTFB":
            if val > 1800: rating = "poor"
            elif val > 800: rating = "needs-improvement"
        elif name == "FCP":
            if val > 3000: rating = "poor"
            elif val > 1800: rating = "needs-improvement"
            
        avg_data.append({
            "metric_name": name,
            "avg_value": round(val, 3),
            "count": cnt,
            "rating": rating
        })
        
    return jsonify({
        "averages": avg_data,
        "logs": [l.serialize() for l in logs]
    }), 200
