from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, ARRAY, ForeignKey, DateTime
from flask_wtf.csrf import generate_csrf
from flask_login import UserMixin, login_user, LoginManager, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS
import os

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, template_folder=os.path.join(base_dir, 'templates'), static_folder=os.path.join(base_dir, 'static'))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('USER_DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
CORS(app)

class Base(DeclarativeBase):
    pass
db = SQLAlchemy(model_class=Base)
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)

# Tables
class Users(UserMixin, db.Model):
    __tablename__ ="users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str]= mapped_column(String(250), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    paid_plan: Mapped[bool] = mapped_column(Boolean)
    product_ids: Mapped[list] = mapped_column(ARRAY(Integer), nullable=True)
    streak: Mapped[int] = mapped_column(Integer, nullable=True)
    to_dos_completed: Mapped[int] = mapped_column(Integer, nullable=True)

class UserLogs(db.Model): 
    __tablename__="user_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    log_date: Mapped[datetime] = mapped_column(DateTime)
    sleep_score: Mapped[int] = mapped_column(Integer, nullable=True)
    nutrition_score: Mapped[int] = mapped_column(Integer, nullable=True)
    workout_minutes: Mapped[int] = mapped_column(Integer, nullable=True)
    feeling_score: Mapped[int] = mapped_column(Integer, nullable=True)

with app.app_context():
    db.create_all()


# Routes
@app.route('/get-csrf-token')
def get_csrf_token():
    return jsonify({"csrf_token": generate_csrf()})

@app.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    print(data)

    result = db.session.execute(db.select(Users).where(Users.email == email))
    if result.scalar(): 
        return jsonify({"message": "User with this email already exists."}), 401
        
    hash_and_salted_password = generate_password_hash(
        password, 
        method='pbkdf2:sha256',
        salt_length=8
    )
    new_user = Users(
        name = name,
        email = email,
        password = hash_and_salted_password,  
        paid_plan= False
    )

    db.session.add(new_user)
    db.session.commit()

    login_user(new_user)
    return jsonify({"message": "Registred successfully"}), 201

@login_manager.user_loader
def load_user(user_id):
    return db.get_or_404(Users, user_id)

@app.route('/users/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    result = db.session.execute(db.select(Users).where(Users.email == email))
    user = result.scalar()
    if not user:
        return jsonify({"message": "Account with this email does not exist"}), 404
    elif not check_password_hash(user.password, password):
        return jsonify({"message": "Password is incorrect"}), 401
    else:
        login_user(user)
        return jsonify({"message": "Logged in successfully"}), 201

@app.route('/users/logout', methods=['POST'])
def logout(): 
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 201
