from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy import ForeignKey, String, Integer, Text, ARRAY, and_
from flask_cors import CORS
from user_service.token_required import token_required
import os
from markdown import markdown

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
    day: Mapped[int] = mapped_column(Integer)

    name: Mapped[str] = mapped_column(String, nullable=False)
    tldr_info: Mapped[str] = mapped_column(Text, nullable=False)
    body_info: Mapped[str] = mapped_column(Text, nullable=False)
    time_info: Mapped[int] = mapped_column(Integer) # How much time reading of the info takes

class Tasks(db.Model):
    __tablename__="tasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    action_name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String)
    days: Mapped[list] = mapped_column(ARRAY(Integer), default=[])
    difficulty: Mapped[int] = mapped_column(Integer)

    plan_id: Mapped[int] = mapped_column(Integer, ForeignKey("plans.id"))
    plan = relationship("Plans", back_populates="tasks")

with app.app_context():
    db.create_all()


@app.route("/block-data")
@token_required
def get_block_data(*args, **kwargs):
    plan_id = request.args.get('plan_id')
    block_id = request.args.get('block_id')

    result = db.session.execute(db.select(Blocks).where(Blocks.plan_id == plan_id, Blocks.id == block_id)).scalars().first()
    
    if not result: return jsonify({"message": "Block not found"}), 404

    response = make_response(jsonify({
        "block_name": result.name,
        "tldr_info": result.tldr_info,
        "body_info": markdown(result.body_info),
        "time_info": result.time_info
    }), 200)
    response.headers['Cache-Control'] = "max-age=604800, private, must-revalidate"

    return response

@app.route('/tasks')
def get_tasks():
    tasks_data = request.args.get('tasks')
    plan_id = request.args.get('plan_id')
    day = request.args.get('day')
    response = []

    if not tasks_data:
        result = db.session.execute(db.select(Tasks).where(and_(Tasks.plan_id == plan_id, Tasks.days.any(day)))).scalars().all()
    else: 
        tasks_marked = list(map(int, tasks_data.split("t"))) 
        result = db.session.execute(db.select(Tasks).where(and_(Tasks.plan_id == plan_id, Tasks.days.any(day)), Tasks.id.notin_(tasks_marked))).scalars().all()
    
    for task in result:
        response.append({
            "task_id": task.id,
            "name": task.action_name,
            "description": task.description
        })
    
    return jsonify(response)

@app.route('/')
def get_plans():
    plan_id = request.args.get('plan_id')
    if not plan_id:
        result = db.session.execute(db.select(Plans)).scalars().all()
        return jsonify(result), 200
    else:
        result = db.session.execute(db.select(Plans).where(Plans.id == plan_id)).scalars().first()
        response = make_response(jsonify({
            "plan_duration": result.duration,
            "plan_name": result.name
        }), 200)

        response.headers['Cache-Control'] = "max_age=2628000, private"

        return response
    