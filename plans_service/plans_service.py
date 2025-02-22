from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy import ForeignKey, String, Integer, Text
from flask_cors import CORS
from user_service.token_required import token_required
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('PLANS_DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

class Base(DeclarativeBase):
    pass
db = SQLAlchemy(model_class=Base)
db.init_app(app)

# Tables
class Plans(db.Model):
    __tablename__="plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    duration: Mapped[int] = mapped_column(Integer) # How much time the whole plan takes (in days)

    tasks = relationship("Tasks", back_populates="plan")
    blocks = relationship("Blocks", back_populates="plan")

class Blocks(db.Model):
    __tablename__="blocks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    plan_id: Mapped[int] = mapped_column(Integer, ForeignKey("plans.id"))
    plan = relationship("Plans", back_populates="blocks")

    name: Mapped[str] = mapped_column(String, nullable=False)
    tldr_info: Mapped[str] = mapped_column(Text, nullable=False)
    body_info: Mapped[str] = mapped_column(Text, nullable=False)
    time_info: Mapped[int] = mapped_column(Integer) # How much time reading of the info takes

class Tasks(db.Model):
    __tablename__="tasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    action_name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String)
    day: Mapped[int] = mapped_column(Integer)
    difficulty: Mapped[int] = mapped_column(Integer) 

    plan_id: Mapped[int] = mapped_column(Integer, ForeignKey("plans.id"))
    plan = relationship("Plans", back_populates="tasks")

with app.app_context():
    db.create_all()


@app.route("/plans/get-block-data")
@token_required
def get_block_data(*args, **kwargs):
    plan_id = request.args.get('plan_id')
    block_id = request.args.get('block_id')

    result = db.session.execute(db.select(Blocks).where(Blocks.plan_id == plan_id, Blocks.id == block_id)).scalars().first()
    
    if not result: return jsonify({"message": "Block not found"}), 404

    response = {
        "block_name": result.name,
        "tldr_info": result.tldr_info,
        "body_info": result.body_info,
        "time_info": result.time_info
    }

    return jsonify(response), 200

@app.route('/plans/get-tasks')
def get_tasks():
    data = request.get_json()
    tasks_completed = data.get('Tasks-IDs')
    plan_id = request.args.get('plan_id')
    day = request.args.get('day')

    result = db.session.execute(db.select(Tasks).where(Tasks.plan_id == plan_id, Tasks.day == day, Tasks.id not in tasks_completed)).scalars().all()
    return jsonify(result), 200

@app.route('/plans/get-plans')
def get_plans():
    plan_id = request.args.get('plan_id')
    if not plan_id:
        result = db.session.execute(db.select(Plans)).scalars().all()
        return jsonify(result), 200
    else:
        result = db.session.execute(db.select(Plans).where(Plans.id == plan_id)).scalars().first()
        return jsonify({
            "plan_duration": result.duration,
            "plan_name": result.name
        }), 200
    