from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, Date, ForeignKey, ARRAY
from flask_wtf.csrf import generate_csrf
from werkzeug.security import generate_password_hash, check_password_hash
from user_service.token_required import token_required, decode_token
import datetime
import jwt
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('USER_DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
SECRET_KEY = os.environ.get('SECRET_KEY')
REFRESH_SECRET = os.environ.get('REFRESH_SECRET')
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app)

todays_date = datetime.date.today()

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
    last_completed_date: Mapped[datetime.date] = mapped_column(Date, default=todays_date)
    last_streak_update: Mapped[datetime.date] = mapped_column(Date, default=todays_date - datetime.timedelta(days=1))
    plans = relationship("UserPlans", back_populates="user")
    streak: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    num_tasks_completed: Mapped[int] = mapped_column(Integer, nullable=True, default=0) # How many tasks user completed in general.
    num_tasks_incomplete: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    reasons_for_tasks_incomplete: Mapped[list] = mapped_column(ARRAY(String), default=[])

class UserPlans(db.Model):
    __tablename__="user_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    plan_id: Mapped[list] = mapped_column(Integer, nullable=True)
    tasks_saved: Mapped[list] = mapped_column(ARRAY(Integer), default=[]) # What tasks user has marked for the plan.
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=True)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    user = relationship("Users", back_populates="plans")


with app.app_context():
    db.create_all()

def generate_jwt(user_id, user_name) -> str:
    """Generate a JWT token for a user"""
    payload = {
        "user_id": user_id,
        "name": user_name,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def generate_refresh_token(user) -> str:
    """Generate a Refresh token for a user"""
    payload = {
        "user_id": user.id,
        "name": user.name,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, REFRESH_SECRET, algorithm="HS256")

def calculate_streak(last_completed_date, streak, longest_streak, last_streak_update) -> tuple:
    """Determines user's streak.
    Last value in an output tuple shows whether streak was kept (1) or not (0).
    """

    if last_completed_date == todays_date:
        if last_streak_update != todays_date:
            streak = streak + 1
            last_completed_date = last_streak_update = todays_date
            if streak > longest_streak:
                longest_streak = streak
        return (streak, longest_streak, last_streak_update, 1)
    
    elif last_completed_date == todays_date - datetime.timedelta(days=1):
        return (streak, longest_streak, last_streak_update, 0)
    else:
        return (0, longest_streak, last_streak_update, 0)

    
# Routes
@app.route('/get-csrf-token', methods=['GET'])
def get_csrf_token():
    return jsonify({"csrf_token": generate_csrf()})
    
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

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

    return jsonify({"message": "Registred successfully", "token": generate_jwt(user_id=new_user.id, user_name=new_user.name), "refresh_token": generate_refresh_token(new_user)}), 201

@app.route('/login', methods=['POST'])
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
        return jsonify({"message": "Logged in successfully", "token": generate_jwt(user.id, user.name), "refresh_token": generate_refresh_token(user)}), 200
    
@app.route('/refresh', methods=['POST'])
def refresh_token():
    data = request.get_json()
    refresh_token = data.get("refresh_token")
    try:
        payload = decode_token(refresh_token, is_refresh=True)
        new_jwt = generate_jwt(payload['user_id'], payload['name'])
        return jsonify({"token": new_jwt})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Refresh token expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid refresh token"}), 403

@app.route('/user-plan', methods=['GET'])
@token_required
def get_user_plan(user_id, name, *args, **kwargs):
    plan_id = request.args.get('plan_id')
    if not plan_id: 
        return jsonify({"message": "Plan id is not provided"}), 401
    result = db.session.execute(db.select(UserPlans).where(UserPlans.plan_id == plan_id, UserPlans.user_id == user_id)).scalars().first()
    current_day = (todays_date - result.start_date).days

    if not result: 
        return jsonify({"message": "This user doesn't have this plan"}), 404
    
    return jsonify({"tasks_saved": result.tasks_saved if result.tasks_saved else None, "current_day": 1 if current_day == 0 else current_day, "user_name": name})

@app.route('/start-plan', methods=['POST'])
@token_required
def start_plan(user_id, *args, **kwargs):
    plan_id = request.args.get('plan_id')

    result = db.session.execute(db.select(UserPlans).where(UserPlans.plan_id == plan_id, UserPlans.user_id == user_id)).scalars().first()
    if result: 
        return jsonify({"message": "User already has this plan"}), 401

    new_user_plan = UserPlans(
        plan_id = plan_id,
        start_date = todays_date,
        user_id = user_id
    )

    db.session.add(new_user_plan)
    db.session.commit()

    return jsonify({"message": "Started the plan successfully"}), 200

@app.route('/complete-task', methods=['POST'])
@token_required
def complete_task(user_id, *args, **kwargs):
    data = request.get_json()
    task_id = int(data.get('task_id'))
    plan_id = int(request.args.get('plan_id'))
    user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    plan = db.session.execute(db.select(UserPlans).where(UserPlans.plan_id == plan_id, UserPlans.user_id == user_id)).scalars().first()

    if not task_id: 
        return jsonify({"message": "No task ID provided"}), 401

    plan.tasks_saved = plan.tasks_saved + [task_id]
    user.num_tasks_completed += 1

    # Update user's streak
    user.last_completed_date = todays_date
    updated_streak = calculate_streak(user.last_completed_date, user.streak, user.longest_streak, user.last_streak_update)
    user.streak = updated_streak[0]
    user.longest_streak = updated_streak[1]
    user.last_streak_update = updated_streak[2]

    db.session.commit()

    return jsonify({"message": "Completed task and updated the streak successfully.", "streak_change": updated_streak[-1]}), 200

@app.route('/incomplete-task', methods=['POST'])
@token_required
def incomplete_task(user_id, *args, **kwargs):
    data = request.get_json()
    reason = data.get('reason')
    user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not user:
        return jsonify({"message": "User wasn't found"}), 404
    
    user_plan = db.session.execute(db.select(UserPlans).where(UserPlans.user_id == user_id)).scalar()

    user.reasons_for_tasks_incomplete = user.reasons_for_tasks_incomplete + [reason]
    user.num_tasks_incomplete += 1
    user_plan.tasks_saved = user_plan.tasks_saved + [data.get('task_id')]

    db.session.commit()

    return jsonify({"message": "Successfully incompleted the task"}), 200

@app.route('/stats', methods=['GET'])
@token_required
def get_stats(user_id, *args, **kwargs):
    """Get 1. How many tasks user hasn't completed, 
        2. How many tasks user has completed, 
        3. Frequancies of reasons for not completing tasks in precents.
    """

    user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()

    if not user:
        return jsonify({"message": "User wasn't found"}), 404
    
    reasons_arr = user.reasons_for_tasks_incomplete

    if reasons_arr:
        reasons = {
            "b": reasons_arr.count("b") / len(reasons_arr),
            "ned": reasons_arr.count("ned") / len(reasons_arr),
            "dht": reasons_arr.count("dht") / len(reasons_arr),
            "th": reasons_arr.count("th") / len(reasons_arr),
            "Other": reasons_arr.count("Other") / len(reasons_arr)
        }
    else: 
        reasons = []
    
    return jsonify({"non_completed_tasks": user.num_tasks_incomplete if user.num_tasks_incomplete else 0, "completed_tasks": user.num_tasks_completed if user.num_tasks_completed else 0, "reasons_with_percents": reasons}), 200
    
@app.route('/stats/streak', methods=['GET'])
@token_required
def get_streak(user_id, *args, **kwargs):
    """Get current streak, longest streak of a user and whether it is kept or not."""
    user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not user:
        return jsonify({"message": "User wasn't found"}), 404

    db.session.commit()

    return jsonify({
        "streak": user.streak,
        "longest_streak": user.longest_streak,
        "result": 1 if user.last_streak_update == todays_date else 0
})