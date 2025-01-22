from flask import Flask, redirect, url_for, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, ARRAY, ForeignKey, DateTime
from flask_wtf import FlaskForm, CSRFProtect
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired
from flask_login import UserMixin, login_user, LoginManager, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, template_folder=os.path.join(base_dir, 'templates'), static_folder=os.path.join(base_dir, 'static'))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('USER_DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

class Base(DeclarativeBase):
    pass
db = SQLAlchemy(model_class=Base)
csrf = CSRFProtect(app)
db.init_app(app)
csrf.init_app(app)
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

# Forms setup
class RegisterForm(FlaskForm):
    name = StringField("Name",validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired()])
    password = PasswordField("Password",validators=[DataRequired()])
    sumbit = SubmitField("Sign Up")

class LoginForm(FlaskForm): 
    email = StringField("Email", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    sumbit = SubmitField("Log In")


# Routes
@app.route('/users/register', methods=['GET', 'POST'])
def register():
    register_form = RegisterForm()
    if register_form.validate_on_submit():
        result = db.session.execute(db.select(Users).where(Users.email == register_form.email.data))
        if result.scalar(): 
            return redirect(url_for('login'))
        
        hash_and_salted_password = generate_password_hash(
            register_form.password.data, 
            method='pbkdf2:sha256',
            salt_length=8
        )
        new_user = Users(
            name = register_form.name.data,
            email = register_form.email.data,
            password = hash_and_salted_password,  
            paid_plan= False
        )

        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        return redirect(f"{os.environ.get("BASE_URL")}")
    
    return render_template("register.html", form=register_form)

@login_manager.user_loader
def load_user(user_id):
    return db.get_or_404(Users, user_id)

@app.route('/users/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        password = form.password.data
        result = db.session.execute(db.select(Users).where(Users.email == form.email.data))
        user = result.scalar()
        if not user:
            print("User doesn't exist") # <-- I am not sure about the front end yet.
            return redirect(url_for('login'))
        elif not check_password_hash(user.password, password):
            print("Password is incorrect")
            return redirect(url_for('login'))
        else:
            login_user(user)
            return True # <-- product_ids, statistics and etc. will be returned in the future.
    return render_template("login.html", form=form)

@app.route('/users/logout', methods=['GET', 'POST'])
def logout(): 
    logout_user()
    return redirect(f"{os.environ.get("BASE_URL")}")
