from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, ARRAY
from flask_wtf.csrf import generate_csrf
from werkzeug.security import generate_password_hash, check_password_hash
from user_service.token_required import token_required
import datetime
import jwt
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('USER_DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
SECRET_KEY = os.environ.get('SECRET_KEY')
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app)

class Base(DeclarativeBase):
    pass
db = SQLAlchemy(model_class=Base)
db.init_app(app)


# Tables
class Users(db.Model):
    __tablename__ ="users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str]= mapped_column(String(250), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    paid_plan: Mapped[bool] = mapped_column(Boolean)
    last_completed_date: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.now(datetime.timezone.utc).date())
    plans = relationship("UserPlans", back_populates="user")
    streak: Mapped[int] = mapped_column(Integer, nullable=True)
    to_dos_completed: Mapped[int] = mapped_column(Integer, nullable=True) # How many tasks user completed in general.

class UserPlans(db.Model):
    __tablename__="user_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    plan_id: Mapped[list] = mapped_column(Integer, nullable=True)
    current_block_num: Mapped[int] = mapped_column(Integer, nullable=True) # What block user is on.
    day: Mapped[int] = mapped_column(Integer, nullable=True) # What day user is into the plan.
    tasks_completed: Mapped[list] = mapped_column(ARRAY(Integer), default=[]) # What tasks user has completed for the plan.

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    user = relationship("Users", back_populates="plans")


with app.app_context():
    db.create_all()


def generate_jwt(user):
    """Generate a JWT token for a user"""
    payload = {
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def create_streak(last_completed_date, streak):
    """Determines current streak of the user"""
    today = datetime.datetime.now(datetime.timezone.utc).date()

    if not last_completed_date: 
        last_completed_date = today
        streak = 1
    else:
        if last_completed_date == today: 
            streak += 1
        elif last_completed_date == today - datetime.timedelta(days=1): 
            return streak
        else: 
            streak = 0
    return streak


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

    return jsonify({"message": "Registred successfully", "token": generate_jwt(new_user)}), 201

@app.route('/users/login', methods=['POST'])
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
        token = generate_jwt(user)
        return jsonify({"message": "Logged in successfully", "token": token}), 200

@app.route('/users/user-plan')
@token_required
def get_user_plan(user_id, *args, **kwargs):
    plan_id = request.args.get('plan_id')
    if not plan_id: 
        return jsonify({"message": "Plan id is not provided"}), 401
    result = db.session.execute(db.select(UserPlans).where(UserPlans.plan_id == plan_id, UserPlans.user_id == user_id)).scalars().first()
    if not result: 
        return jsonify({"message": "This user doesn't have this plan"}), 404
    
    return jsonify({"current_block_num": result.current_block_num, "tasks_completed": result.tasks_completed, "current_day": result.day})

@app.route('/users/complete-task', methods=['POST'])
@token_required
def complete_task(user_id, *args, **kwargs):
    data = request.get_json()
    task_id = int(data.get('task_id'))
    plan_id = int(request.args.get('plan_id'))
    plan = db.session.execute(db.select(UserPlans).where(UserPlans.plan_id == plan_id, UserPlans.user_id == user_id)).scalars().first()

    if not task_id: 
        return jsonify({"message": "No task ID provided"}), 401

    plan.tasks_completed = plan.tasks_completed + [task_id]
    db.session.commit()

    return jsonify({"message": "Completed task successfully", "tasks_completed": plan.tasks_completed}), 200