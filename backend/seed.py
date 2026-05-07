from app import app, db
from models import User, Product, Category, Order, OrderItem
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

def seed_supermarket():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # 1. Tạo Tài khoản
        admin = User(username='admin', password=generate_password_hash('admin123'), full_name='Quản lý Siêu thị', role='admin')
        staff = User(username='staff', password=generate_password_hash('staff123'), full_name='Nhân viên Bán hàng', role='staff')
        db.session.add_all([admin, staff])

        # 2. Tạo Danh mục
        cat1 = Category(name='Thực phẩm tươi sống')
        cat2 = Category(name='Đồ uống & Nước giải khát')
        cat3 = Category(name='Hóa mỹ phẩm')
        cat4 = Category(name='Bánh kẹo & Snack')
        db.session.add_all([cat1, cat2, cat3, cat4])
        db.session.commit()

        # 3. Tạo Sản phẩm
        products = [
            Product(name='Sữa tươi TH True Milk 1L', barcode='8936039100012', price=35000, cost_price=28000, stock_quantity=100, unit='Hộp', category_id=cat2.id),
            Product(name='Coca-Cola 330ml', barcode='8935049500010', price=10000, cost_price=7000, stock_quantity=200, unit='Lon', category_id=cat2.id),
            Product(name='Mì tôm Hảo Hảo', barcode='8934563301234', price=4500, cost_price=3200, stock_quantity=500, unit='Gói', category_id=cat1.id),
            Product(name='Bánh Snack Lay\'s Classic', barcode='8934563305555', price=12000, cost_price=8500, stock_quantity=50, unit='Gói', category_id=cat4.id),
            Product(name='Nước rửa chén Sunlight 750ml', barcode='8934563309999', price=28000, cost_price=22000, stock_quantity=30, unit='Chai', category_id=cat3.id),
            Product(name='Bánh mì tươi Kinh Đô', barcode='8934563301111', price=15000, cost_price=10000, stock_quantity=20, unit='Cái', category_id=cat1.id),
            Product(name='Nước khoáng Lavie 500ml', barcode='8934563302222', price=6000, cost_price=3500, stock_quantity=300, unit='Chai', category_id=cat2.id)
        ]
        db.session.add_all(products)
        db.session.commit()

        # 4. Tạo một số Đơn hàng mẫu cho Dashboard
        for i in range(10):
            order = Order(
                order_number=f"HD-TEST-{i}",
                total_amount=0,
                final_amount=0,
                staff_id=staff.id,
                created_at=datetime.utcnow() - timedelta(hours=random.randint(0, 24))
            )
            total = 0
            for _ in range(random.randint(1, 3)):
                p = random.choice(products)
                qty = random.randint(1, 5)
                sub = p.price * qty
                total += sub
                item = OrderItem(product_id=p.id, quantity=qty, unit_price=p.price, subtotal=sub)
                order.items.append(item)
            order.total_amount = total
            order.final_amount = total
            db.session.add(order)
        
        db.session.commit()
        print("--- Đã thiết lập dữ liệu Siêu thị mẫu thành công! ---")

if __name__ == '__main__':
    seed_supermarket()
