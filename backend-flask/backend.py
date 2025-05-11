import boto3
import psycopg2
from sqlalchemy import create_engine
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Replace with your actual database details
host = 'jahanzeb-abdullah-db.chkocg22cbbj.eu-north-1.rds.amazonaws.com'
port = 5432
user = 'iam_user'  # IAM user for DB
region = 'eu-north-1'  # Your AWS region

# Generate IAM Token
rds_client = boto3.client('rds', region_name=region)
token = rds_client.generate_db_auth_token(
    DBHostname=host, Port=port, DBUsername=user
)

# Construct the database URI with IAM Token
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql+psycopg2://{user}:{token}@{host}:{port}/postgres?sslmode=require"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'

# Initialize database and JWT manager
db = SQLAlchemy(app)
jwt = JWTManager(app)

# -------------------
# DATABASE MODELS
# -------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    notes = db.relationship('Note', backref='user', lazy=True)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# -------------------
# ROUTES
# -------------------

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    hashed_pw = generate_password_hash(data['password'])
    new_user = User(username=data['username'], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token})

@app.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    user_id = int(get_jwt_identity())
    data = request.json
    note = Note(title=data['title'], content=data['content'], user_id=user_id)
    db.session.add(note)
    db.session.commit()
    return jsonify({'message': 'Note created'}), 201

@app.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    user_id = int(get_jwt_identity())
    notes = Note.query.filter_by(user_id=user_id).all()
    result = [{'id': n.id, 'title': n.title, 'content': n.content} for n in notes]
    return jsonify(result)

@app.route('/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.get_or_404(note_id)
    if note.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.json
    note.title = data.get('title', note.title)
    note.content = data.get('content', note.content)
    db.session.commit()
    return jsonify({'message': 'Note updated'})

@app.route('/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.get_or_404(note_id)
    if note.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    db.session.delete(note)
    db.session.commit()
    return jsonify({'message': 'Note deleted'})

@app.route('/')
def index():
    return "Flask Note API is running"

# -------------------
# CREATE TABLES
# -------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
