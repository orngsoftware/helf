from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Float, Boolean
from flask_cors import CORS
import os

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, template_folder=os.path.join(base_dir, 'templates'), static_folder=os.path.join(base_dir, 'static'))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('PRODUCTS_DB_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

class Base(DeclarativeBase):
    pass
db = SQLAlchemy(model_class=Base)
db.init_app(app)

class Products(db.Model):
    __tablename__ ="products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String)
    duration: Mapped[int] = mapped_column(Integer)
    free: Mapped[bool] = mapped_column(Boolean)
    price: Mapped[float] = mapped_column(Float)

with app.app_context():
    db.create_all()

@app.route('/all-products')
def products():
    result = db.session.execute(db.select(Products))
    all_products = result.scalars().all()
    return all_products

@app.route("/product/<int:product_id>")
def show_product(product_id): 
    requested_product = db.get_or_404(Products, product_id)
    return requested_product
