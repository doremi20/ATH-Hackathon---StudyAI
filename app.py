import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__name__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'studyai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False) # In production, this should be hashed!

class StudyPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(120), unique=True, nullable=False)
    problem = db.Column(db.Text, default='')
    days = db.Column(db.Integer, default=0)
    subjects = db.Column(db.Integer, default=0)
    hours = db.Column(db.Integer, default=0)
    difficulty = db.Column(db.String(50), default='medium')
    progress = db.Column(db.Integer, default=0)
    completed_tasks = db.Column(db.Integer, default=0)
    total_tasks = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)
    plan_generated = db.Column(db.Boolean, default=False)

# Create tables
with app.app_context():
    db.create_all()

# --- Routes ---

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already in use"}), 400

    new_user = User(name=name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user": {"name": name, "email": email}}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user and user.password == password:
        return jsonify({"message": "Login successful", "user": {"name": user.name, "email": user.email}}), 200
    
    return jsonify({"error": "Invalid email or password"}), 401


@app.route('/api/study-plan', methods=['GET'])
def get_study_plan():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email required"}), 400
        
    plan = StudyPlan.query.filter_by(user_email=email).first()
    
    if not plan:
        return jsonify({
            "problem": "", "days": 0, "subjects": 0, "hours": 0,
            "difficulty": "medium", "progress": 0, "completedTasks": 0,
            "totalTasks": 0, "streak": 0, "planGenerated": False
        }), 200

    return jsonify({
        "problem": plan.problem,
        "days": plan.days,
        "subjects": plan.subjects,
        "hours": plan.hours,
        "difficulty": plan.difficulty,
        "progress": plan.progress,
        "completedTasks": plan.completed_tasks,
        "totalTasks": plan.total_tasks,
        "streak": plan.streak,
        "planGenerated": plan.plan_generated
    }), 200


@app.route('/api/study-plan', methods=['POST'])
def save_study_plan():
    data = request.json
    email = data.get('user_email')
    
    if not email:
        return jsonify({"error": "User email required to save plan"}), 400
        
    plan = StudyPlan.query.filter_by(user_email=email).first()
    
    if not plan:
        plan = StudyPlan(user_email=email)
        db.session.add(plan)
        
    plan.problem = data.get('problem', '')
    plan.days = int(data.get('days', 0))
    plan.subjects = int(data.get('subjects', 0))
    plan.hours = int(data.get('hours', 0))
    plan.difficulty = data.get('difficulty', 'medium')
    plan.progress = int(data.get('progress', 0))
    plan.completed_tasks = int(data.get('completedTasks', 0))
    plan.total_tasks = int(data.get('totalTasks', 0))
    plan.streak = int(data.get('streak', 0))
    plan.plan_generated = bool(data.get('planGenerated', False))
    
    db.session.commit()
    
    return jsonify({"message": "Study plan saved successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
