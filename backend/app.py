import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from models import db, User, Product, Category, Order, OrderItem, Customer
from datetime import datetime, timedelta
from sqlalchemy import func
import google.generativeai as genai
from payos import PayOS
from payos.types import ItemData, CreatePaymentLinkRequest

load_dotenv()

# Google Gemini (optional - skip if key not set)
try:
    genai.configure(api_key=os.getenv("GENAI_API_KEY", ""))
    model = genai.GenerativeModel('gemini-pro')
except Exception:
    model = None

# PayOS init
payos = PayOS(
    client_id=os.getenv("PAYOS_CLIENT_ID"),
    api_key=os.getenv("PAYOS_API_KEY"),
    checksum_key=os.getenv("PAYOS_CHECKSUM_KEY")
)

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'supermarket.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supermarket-pos-secret-2026'

db.init_app(app)
jwt = JWTManager(app)

api = Api(app, version='1.0', title='MiniMart POS API', doc='/docs')

ns_auth      = api.namespace('api/auth',      description='Xác thực nhân viên')
ns_pos       = api.namespace('api/pos',       description='Giao dịch bán hàng')
ns_products  = api.namespace('api/products',  description='Quản lý kho')
ns_dashboard = api.namespace('api/dashboard', description='Báo cáo thống kê')
ns_orders    = api.namespace('api/orders',    description='Lịch sử giao dịch')
ns_payment   = api.namespace('api/payment',   description='PayOS thanh toán')
ns_staff     = api.namespace('api/staff',     description='Quản lý nhân sự')
ns_customers = api.namespace('api/customers', description='Quản lý khách hàng')

# --- AUTH ---
@ns_auth.route('/login')
class Login(Resource):
    def post(self):
        data = request.json
        user = User.query.filter_by(username=data['username']).first()
        if user and check_password_hash(user.password, data['password']):
            token = create_access_token(identity={'id': user.id, 'role': user.role})
            return {'token': token, 'user': {'id': user.id, 'name': user.full_name, 'role': user.role}}
        return {'error': 'Unauthorized'}, 401

@ns_auth.route('/register')
class Register(Resource):
    def post(self):
        data = request.json
        if not data or not data.get('username') or not data.get('password'):
            return {'error': 'Vui lòng điền đủ tên đăng nhập và mật khẩu'}, 400
            
        if User.query.filter_by(username=data['username']).first():
            return {'error': 'Tên đăng nhập đã tồn tại'}, 400
            
        new_user = User(
            username=data['username'],
            password=generate_password_hash(data['password']),
            full_name=data.get('full_name', data['username']),
            role=data.get('role', 'admin') # Mặc định admin để dễ test
        )
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'Đăng ký thành công'}, 201

# --- POS: BÁN HÀNG ---
@ns_pos.route('/checkout')
class Checkout(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        data = request.json # {items: [{product_id, quantity}], customer_phone, payment_method}
        
        total = 0
        discount = data.get('discount', 0)
        customer_id = data.get('customer_id')

        new_order = Order(
            order_number=f"HD-{datetime.utcnow().strftime('%y%m%d%H%M%S')}",
            staff_id=current_user['id'],
            payment_method=data.get('payment_method', 'Cash'),
            customer_id=customer_id
        )
        
        for item in data['items']:
            product = Product.query.get(item['product_id'])
            if product and product.stock_quantity >= item['quantity']:
                subtotal = product.price * item['quantity']
                total += subtotal
                # Trừ kho
                product.stock_quantity -= item['quantity']
                
                order_item = OrderItem(
                    product_id=product.id,
                    quantity=item['quantity'],
                    unit_price=product.price,
                    subtotal=subtotal
                )
                new_order.items.append(order_item)
            else:
                return {'error': f"Sản phẩm {product.name if product else 'N/A'} không đủ tồn kho"}, 400
        
        new_order.total_amount = total
        new_order.discount = discount
        new_order.final_amount = total - discount
        db.session.add(new_order)

        # Cập nhật điểm khách hàng
        if customer_id:
            customer = Customer.query.get(customer_id)
            if customer:
                if discount > 0: customer.points -= int(discount / 1000)
                customer.points += int(new_order.final_amount / 10000)

        db.session.commit()
        
        return {'message': 'Thanh toán thành công', 'order_id': new_order.id, 'total': new_order.final_amount}

# --- DASHBOARD: THỐNG KÊ ---
@ns_dashboard.route('/summary')
class Summary(Resource):
    @jwt_required()
    def get(self):
        today = datetime.utcnow().date()
        # Doanh thu hôm nay
        revenue_today = db.session.query(func.sum(Order.final_amount)).filter(func.date(Order.created_at) == today).scalar() or 0
        # Tổng đơn hàng hôm nay
        orders_today = Order.query.filter(func.date(Order.created_at) == today).count()
        # Sản phẩm sắp hết hàng
        low_stock = Product.query.filter(Product.stock_quantity < 10).count()
        
        return {
            'revenue_today': revenue_today,
            'orders_today': orders_today,
            'low_stock_count': low_stock
        }

@ns_dashboard.route('/analytics')
class Analytics(Resource):
    @jwt_required()
    def get(self):
        days = int(request.args.get('days', 7))
        start_date = datetime.utcnow() - timedelta(days=days-1)
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # 1. Lấy tất cả Order trong khoảng thời gian
        orders = Order.query.filter(Order.created_at >= start_date).all()
        
        total_revenue = 0
        total_orders = len(orders)
        
        # Thống kê theo ngày
        chart_data = {}
        for d in range(days):
            dt = (start_date + timedelta(days=d)).strftime('%Y-%m-%d')
            chart_data[dt] = {'revenue': 0, 'cost': 0, 'profit': 0}
            
        # Tính toán chi tiết
        product_sales = {} # Lấy top sản phẩm
        
        for order in orders:
            dt = order.created_at.strftime('%Y-%m-%d')
            total_revenue += order.final_amount
            if dt in chart_data:
                chart_data[dt]['revenue'] += order.final_amount
                
            # Tính cost
            order_cost = 0
            for item in order.items:
                product = Product.query.get(item.product_id)
                cost = (product.cost_price or 0) * item.quantity if product else 0
                order_cost += cost
                
                # Thống kê sản phẩm
                if product:
                    if product.id not in product_sales:
                        product_sales[product.id] = {'name': product.name, 'qty': 0, 'rev': 0}
                    product_sales[product.id]['qty'] += item.quantity
                    product_sales[product.id]['rev'] += item.subtotal

            if dt in chart_data:
                chart_data[dt]['cost'] += order_cost
                # Lợi nhuận = Doanh thu hóa đơn - Chi phí hàng (Lưu ý: chưa trừ discount phân bổ chính xác nhưng có thể lấy final_amount - cost)
                chart_data[dt]['profit'] += (order.final_amount - order_cost)

        # Tổng hợp
        total_profit = sum(d['profit'] for d in chart_data.values())
        
        # Top 5 sản phẩm
        top_products = sorted(product_sales.values(), key=lambda x: x['rev'], reverse=True)[:5]
        
        return {
            'summary': {
                'total_revenue': total_revenue,
                'total_profit': total_profit,
                'total_orders': total_orders,
                'profit_margin': round((total_profit/total_revenue*100) if total_revenue > 0 else 0, 1)
            },
            'chart': [
                {'date': k[5:], 'revenue': v['revenue'], 'profit': v['profit']} 
                for k, v in chart_data.items()
            ],
            'top_products': top_products
        }

@ns_products.route('/')
class ProductList(Resource):
    def get(self):
        q = request.args.get('q', '')
        products = Product.query.filter(Product.name.like(f'%{q}%')).all()
        return [{
            'id': p.id, 'name': p.name, 'barcode': p.barcode, 
            'price': p.price, 'stock': p.stock_quantity, 'unit': p.unit
        } for p in products]

@ns_orders.route('/')
class OrderList(Resource):
    @jwt_required()
    def get(self):
        page       = int(request.args.get('page', 1))
        per_page   = int(request.args.get('per_page', 20))
        date_from  = request.args.get('date_from')
        date_to    = request.args.get('date_to')
        payment    = request.args.get('payment')
        q          = request.args.get('q', '')

        query = Order.query
        if date_from:
            query = query.filter(Order.created_at >= date_from)
        if date_to:
            query = query.filter(Order.created_at <= date_to + ' 23:59:59')
        if payment:
            query = query.filter(Order.payment_method == payment)
        if q:
            query = query.filter(Order.order_number.like(f'%{q}%'))

        query = query.order_by(Order.created_at.desc())
        total = query.count()
        orders = query.offset((page - 1) * per_page).limit(per_page).all()

        def fmt(o):
            staff = User.query.get(o.staff_id)
            return {
                'id': o.id,
                'order_number': o.order_number,
                'total_amount': o.total_amount,
                'final_amount': o.final_amount,
                'discount': o.discount,
                'payment_method': o.payment_method,
                'staff_name': staff.full_name if staff else 'N/A',
                'created_at': o.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'item_count': len(o.items),
            }

        return {
            'total': total,
            'page': page,
            'per_page': per_page,
            'orders': [fmt(o) for o in orders]
        }

@ns_orders.route('/<int:id>')
class OrderDetail(Resource):
    @jwt_required()
    def get(self, id):
        o = Order.query.get_or_404(id)
        staff = User.query.get(o.staff_id)
        items = []
        for i in o.items:
            p = Product.query.get(i.product_id)
            items.append({
                'product_name': p.name if p else 'Không xác định',
                'barcode': p.barcode if p else '',
                'quantity': i.quantity,
                'unit_price': i.unit_price,
                'subtotal': i.subtotal,
            })
        return {
            'id': o.id,
            'order_number': o.order_number,
            'total_amount': o.total_amount,
            'final_amount': o.final_amount,
            'discount': o.discount,
            'payment_method': o.payment_method,
            'staff_name': staff.full_name if staff else 'N/A',
            'created_at': o.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'items': items
        }

    @jwt_required()
    def delete(self, id):
        o = Order.query.get_or_404(id)
        db.session.delete(o); db.session.commit()
        return {'message': 'Xóa thành công'}


# ─── STAFF: Quản lý nhân sự ────────────────────────────────────────────────
@ns_staff.route('/')
class StaffList(Resource):
    @jwt_required()
    def get(self):
        """Lấy danh sách nhân viên"""
        users = User.query.all()
        return [{
            'id': u.id,
            'username': u.username,
            'full_name': u.full_name,
            'role': u.role,
            'created_at': u.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for u in users]

    @jwt_required()
    def post(self):
        """Tạo nhân viên mới"""
        data = request.json
        if User.query.filter_by(username=data['username']).first():
            return {'error': 'Tên đăng nhập đã tồn tại'}, 400
        
        hashed = generate_password_hash(data['password'])
        new_user = User(
            username=data['username'],
            password=hashed,
            full_name=data['full_name'],
            role=data.get('role', 'staff')
        )
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'Thêm nhân sự thành công', 'id': new_user.id}

@ns_staff.route('/<int:id>')
class StaffDetail(Resource):
    @jwt_required()
    def put(self, id):
        """Cập nhật thông tin nhân viên"""
        user = User.query.get_or_404(id)
        data = request.json
        
        if 'full_name' in data: user.full_name = data['full_name']
        if 'role' in data: user.role = data['role']
        if 'password' in data and data['password']:
            user.password = generate_password_hash(data['password'])
            
        db.session.commit()
        return {'message': 'Cập nhật thành công'}

    @jwt_required()
    def delete(self, id):
        """Xóa nhân viên"""
        user = User.query.get_or_404(id)
        if user.role == 'admin' and User.query.filter_by(role='admin').count() <= 1:
            return {'error': 'Không thể xóa admin duy nhất của hệ thống'}, 400
            
        db.session.delete(user)
        db.session.commit()
        return {'message': 'Đã xóa nhân sự'}



# ─── CUSTOMERS: Quản lý khách hàng ─────────────────────────────────────────
@ns_customers.route('/')
class CustomerList(Resource):
    @jwt_required()
    def get(self):
        """Danh sách khách hàng hoặc tìm theo SĐT"""
        q = request.args.get('q', '')
        if q:
            customers = Customer.query.filter(Customer.phone.like(f'%{q}%')).all()
        else:
            customers = Customer.query.order_by(Customer.points.desc()).all()
            
        return [{
            'id': c.id,
            'phone': c.phone,
            'full_name': c.full_name,
            'points': c.points,
            'created_at': c.created_at.strftime('%Y-%m-%d')
        } for c in customers]

    @jwt_required()
    def post(self):
        """Thêm khách hàng mới"""
        data = request.json
        if Customer.query.filter_by(phone=data['phone']).first():
            return {'error': 'Số điện thoại đã tồn tại'}, 400
            
        new_c = Customer(phone=data['phone'], full_name=data.get('full_name', ''), points=data.get('points', 0))
        db.session.add(new_c)
        db.session.commit()
        return {'message': 'Thêm khách hàng thành công', 'id': new_c.id, 'name': new_c.full_name}

@ns_customers.route('/<int:id>')
class CustomerDetail(Resource):
    @jwt_required()
    def put(self, id):
        c = Customer.query.get_or_404(id)
        data = request.json
        if 'full_name' in data: c.full_name = data['full_name']
        if 'points' in data: c.points = data['points']
        db.session.commit()
        return {'message': 'Đã cập nhật khách hàng'}
        
    @jwt_required()
    def delete(self, id):
        c = Customer.query.get_or_404(id)
        db.session.delete(c)
        db.session.commit()
        return {'message': 'Đã xóa khách hàng'}

# ─── PAYOS: Thanh toán online ───────────────────────────────────────────────

@ns_payment.route('/create')
class PayOSCreate(Resource):
    @jwt_required()
    def post(self):
        """Tạo link thanh toán PayOS từ giỏ hàng"""
        current_user = get_jwt_identity()
        data = request.json  # { items:[{product_id, quantity}] }

        # Tính toán đơn hàng
        order_code  = int(time.time())  # unique int code
        items_data  = []
        total       = 0

        for item in data.get('items', []):
            product = Product.query.get(item['product_id'])
            if not product:
                return {'error': f'Sản phẩm #{item["product_id"]} không tồn tại'}, 404
            qty      = item['quantity']
            items_data.append(
                ItemData(name=product.name[:25], quantity=qty, price=int(product.price))
            )
        
        total       = data.get('total_amount', 0)
        discount    = data.get('discount', 0)
        customer_id = data.get('customer_id') # Có thể None
        
        if total <= 0:
            return {'error': 'Giỏ hàng trống'}, 400

        # Tạo PaymentData chuẩn mới
        payment_data = CreatePaymentLinkRequest(
            orderCode   = order_code,
            amount      = total - discount,
            description = f"MiniMart #{order_code % 100000}",
            items       = items_data,
            cancelUrl   = "http://localhost:5173/payment/cancel",
            returnUrl   = "http://localhost:5173/payment/success",
        )

        try:
            response = payos.payment_requests.create(payment_data)
            # Lưu đơn hàng tạm (chưa trừ kho) với trạng thái pending
            new_order = Order(
                order_number  = f"POS-{order_code}",
                total_amount  = total,
                discount      = discount,
                final_amount  = total - discount,
                payment_method= 'PayOS',
                staff_id      = current_user_id,
                customer_id   = customer_id
            )
            for item in data.get('items', []):
                p   = Product.query.get(item['product_id'])
                qty = item['quantity']
                new_order.items.append(OrderItem(
                    product_id = p.id,
                    quantity   = qty,
                    unit_price = p.price,
                    subtotal   = p.price * qty,
                ))
            db.session.add(new_order)
            db.session.commit()

            return {
                'checkout_url': response.checkout_url,
                'order_code':   order_code,
                'order_id':     new_order.id,
                'amount':       total,
            }
        except Exception as e:
            return {'error': str(e)}, 500


@ns_payment.route('/webhook')
class PayOSWebhook(Resource):
    def post(self):
        """Nhận callback từ PayOS khi thanh toán hoàn tất"""
        try:
            webhook_data = payos.webhooks.verify(request.json)
            order_code   = str(webhook_data.order_code)

            # Tìm đơn hàng theo order_number
            order = Order.query.filter(Order.order_number == f"POS-{order_code}").first()
            if order and webhook_data.code == '00':
                # Trừ kho sau khi thanh toán thành công
                for item in order.items:
                    product = Product.query.get(item.product_id)
                    if product and product.stock_quantity >= item.quantity:
                        product.stock_quantity -= item.quantity
            
                # Tích điểm/Trừ điểm nếu có khách hàng
                if order.customer_id:
                    customer = Customer.query.get(order.customer_id)
                    if customer:
                        # Trừ điểm đã dùng (1 điểm = 1000đ discount)
                        if order.discount > 0:
                            customer.points -= int(order.discount / 1000)
                        # Cộng điểm đơn hàng mới (1% hóa đơn = x điểm)
                        customer.points += int(order.final_amount / 10000) # 10k = 1 điểm

            db.session.commit()
            return jsonify({'success': True})
        except Exception as e:
            return {'error': str(e)}, 400


@ns_payment.route('/status/<int:order_code>')
class PayOSStatus(Resource):
    @jwt_required()
    def get(self, order_code):
        """Kiểm tra trạng thái thanh toán PayOS"""
        try:
            info = payos.payment_requests.get(order_code)
            return {
                'status':      info.status,
                'amount':      info.amount,
                'order_code':  info.id,
            }
        except Exception as e:
            return {'error': str(e)}, 400


if __name__ == '__main__':
    with app.app_context(): db.create_all()
    app.run(debug=True, port=5000)
