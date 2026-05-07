from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('admin', 'staff'), default='staff')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    barcode = db.Column(db.String(50), unique=True, index=True)
    name = db.Column(db.String(255), nullable=False, index=True)
    price = db.Column(db.Float, nullable=False)
    cost_price = db.Column(db.Float) # Giá vốn để tính lợi nhuận
    stock_quantity = db.Column(db.Integer, default=0)
    unit = db.Column(db.String(50), default='Cái')
    image_url = db.Column(db.String(512))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True)
    total_amount = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0)
    final_amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), default='Cash') # Cash, QR, Card
    staff_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)

class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), unique=True)
    full_name = db.Column(db.String(255))
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
