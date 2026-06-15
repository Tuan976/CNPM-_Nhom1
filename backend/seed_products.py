import os
import random
import urllib.parse
from datetime import datetime, timedelta
from flask import Flask
from werkzeug.security import generate_password_hash
from models import db, User, Category, Supplier, Promotion, Product, Customer

# Setup Flask App for seeding
app = Flask(__name__)
db_server = os.getenv("DB_SERVER", "(localdb)\\MSSQLLocalDB")
db_name = os.getenv("DB_NAME", "SupermarketPOS")

params = urllib.parse.quote_plus(
    f"DRIVER={{ODBC Driver 17 for SQL Server}};"
    f"SERVER={db_server};"
    f"DATABASE={db_name};"
    f"Trusted_Connection=yes;"
)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mssql+pyodbc:///?odbc_connect={params}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def seed():
    with app.app_context():
        print("Cleaning up old data from SQL Server...")
        # Clear child tables first
        db.session.execute(db.text("DELETE FROM order_items"))
        db.session.execute(db.text("DELETE FROM orders"))
        db.session.execute(db.text("DELETE FROM products"))
        db.session.execute(db.text("DELETE FROM users"))
        db.session.execute(db.text("DELETE FROM customers"))
        db.session.execute(db.text("DELETE FROM promotions"))
        db.session.execute(db.text("DELETE FROM categories"))
        db.session.execute(db.text("DELETE FROM suppliers"))
        db.session.commit()
        
        print("Creating default users...")
        admin = User(
            username="admin",
            password=generate_password_hash("admin123"),
            full_name="Quản lý Admin",
            role="admin"
        )
        staff = User(
            username="staff",
            password=generate_password_hash("staff123"),
            full_name="Thu ngân Nguyễn Văn B",
            role="staff"
        )
        db.session.add(admin)
        db.session.add(staff)
        
        print("Creating default suppliers...")
        sups = [
            Supplier(name="Công ty TNHH Nước Giải Khát Coca-Cola Việt Nam", contact_info="028 3896 1000"),
            Supplier(name="Công ty TNHH Nước Giải Khát Suntory PepsiCo Việt Nam", contact_info="028 3821 9437"),
            Supplier(name="Công ty Cổ phần Việt Nam Kỹ nghệ Súc sản (Vissan)", contact_info="1900 1960"),
            Supplier(name="Tập đoàn TH (TH Group)", contact_info="1800 54 54 40"),
            Supplier(name="Công ty Cổ phần Sữa Việt Nam (Vinamilk)", contact_info="1900 636 979")
        ]
        for s in sups:
            db.session.add(s)
        db.session.commit()  # commit to get supplier ids
        
        print("Creating default customers...")
        custs = [
            Customer(phone="0987654321", full_name="Nguyễn Văn A", points=150),
            Customer(phone="0912345678", full_name="Trần Thị B", points=80),
            Customer(phone="0909090909", full_name="Lê Văn C", points=0)
        ]
        for c in custs:
            db.session.add(c)
            
        print("Creating default promotions...")
        promos = [
            Promotion(code="KM10", description="Giảm giá 10% tổng hóa đơn", discount_percent=10.0, active=True, end_date=datetime.utcnow() + timedelta(days=30)),
            Promotion(code="KM20", description="Giảm giá 20% tổng hóa đơn", discount_percent=20.0, active=True, end_date=datetime.utcnow() + timedelta(days=30)),
            Promotion(code="KM50", description="Giảm giá 50% siêu đặc biệt", discount_percent=50.0, active=False, end_date=datetime.utcnow() + timedelta(days=5))
        ]
        for p in promos:
            db.session.add(p)
            
        print("Creating categories...")
        cat_names = [
            "Đồ uống", "Đồ ăn vặt", "Thực phẩm khô", "Gia vị", 
            "Chăm sóc cá nhân", "Vệ sinh nhà cửa", "Đồ dùng gia đình", "Sữa & Chế phẩm"
        ]
        
        categories = {}
        for cname in cat_names:
            cat = Category(name=cname)
            db.session.add(cat)
            categories[cname] = cat
            
        db.session.commit()  # commit to get category ids
        
        products_data = [
            # Đồ uống (30)
            ("Coca Cola 330ml", 10000, "Lon", "Đồ uống", sups[0]),
            ("Pepsi 330ml", 10000, "Lon", "Đồ uống", sups[1]),
            ("Sprite 330ml", 10000, "Lon", "Đồ uống", sups[0]),
            ("7Up 330ml", 10000, "Lon", "Đồ uống", sups[1]),
            ("Fanta Cam 330ml", 10000, "Lon", "Đồ uống", sups[0]),
            ("Mirinda Cam 330ml", 10000, "Lon", "Đồ uống", sups[1]),
            ("Nước khoáng Lavie 500ml", 5000, "Chai", "Đồ uống", sups[1]),
            ("Nước tinh khiết Aquafina 500ml", 5000, "Chai", "Đồ uống", sups[1]),
            ("Nước tinh khiết Dasani 500ml", 5000, "Chai", "Đồ uống", sups[0]),
            ("Trà ô long Tea+ Plus 455ml", 10000, "Chai", "Đồ uống", sups[1]),
            ("Trà xanh Không Độ 500ml", 10000, "Chai", "Đồ uống", sups[1]),
            ("Trà thanh nhiệt Dr Thanh 330ml", 10000, "Chai", "Đồ uống", sups[1]),
            ("Trà Lipton vị chanh 330ml", 9000, "Lon", "Đồ uống", sups[1]),
            ("Nước tăng lực Redbull 250ml", 12000, "Lon", "Đồ uống", sups[1]),
            ("Nước tăng lực Sting Dâu 330ml", 10000, "Chai", "Đồ uống", sups[1]),
            ("Nước tăng lực Wake-up 247 330ml", 10000, "Chai", "Đồ uống", sups[1]),
            ("Nước ép trái cây Vfresh Cam 1L", 45000, "Hộp", "Đồ uống", sups[4]),
            ("Nước ép trái cây Vfresh Táo 1L", 45000, "Hộp", "Đồ uống", sups[4]),
            ("Nước dừa tươi Cocoxim 330ml", 15000, "Hộp", "Đồ uống", sups[1]),
            ("Bia Heineken 330ml", 19000, "Lon", "Đồ uống", sups[0]),
            ("Bia Tiger 330ml", 16000, "Lon", "Đồ uống", sups[1]),
            ("Bia Tiger Crystal 330ml", 17000, "Lon", "Đồ uống", sups[1]),
            ("Bia Saigon Special 330ml", 15000, "Lon", "Đồ uống", sups[1]),
            ("Bia 333 330ml", 12000, "Lon", "Đồ uống", sups[1]),
            ("Cà phê đen đá Birdy 170ml", 12000, "Lon", "Đồ uống", sups[1]),
            ("Cà phê sữa đá Highlands 235ml", 15000, "Lon", "Đồ uống", sups[1]),
            ("Cà phê sữa Nescafe 330ml", 13000, "Lon", "Đồ uống", sups[1]),
            ("Nước yến sào Sanest 70ml", 35000, "Lọ", "Đồ uống", sups[1]),
            ("Nước sâm bí đao Wonderfarm 310ml", 9000, "Lon", "Đồ uống", sups[1]),
            ("Soju vị Nho Jinro 360ml", 65000, "Chai", "Đồ uống", sups[1]),

            # Đồ ăn vặt (40)
            ("Snack khoai tây O'Star vị tự nhiên 36g", 8000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack khoai tây O'Star vị kim chi 36g", 8000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack khoai tây O'Star vị tảo biển 36g", 8000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack khoai tây Lay's vị tự nhiên 56g", 12000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack khoai tây Lay's vị phô mai 56g", 12000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack khoai tây Lay's vị bò 56g", 12000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack bắp Oishi vị pho mát 40g", 6000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack phồng tôm Oishi 40g", 6000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Snack mực Bento Thái Lan 20g", 25000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Bánh quy Cosy Marie 160g", 15000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Bánh quy bơ Danisa 454g", 120000, "Hộp", "Đồ ăn vặt", sups[1]),
            ("Bánh quy Oreo vị kem vani 133g", 16000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Bánh quy Oreo vị socola 133g", 16000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Bánh xốp Nabati phô mai 140g", 18000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Bánh chocopie Orion hộp 6 cái", 35000, "Hộp", "Đồ ăn vặt", sups[1]),
            ("Bánh Custas Orion hộp 6 cái", 36000, "Hộp", "Đồ ăn vặt", sups[1]),
            ("Bánh gạo One-One vị ngọt 150g", 22000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Bánh gạo Ichi vị mặn 100g", 18000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Kẹo Alpenliebe vị dâu 32g", 6000, "Thỏi", "Đồ ăn vặt", sups[1]),
            ("Kẹo Alpenliebe vị caramen 32g", 6000, "Thỏi", "Đồ ăn vặt", sups[1]),
            ("Kẹo Sing-gum Coolair 11.6g", 5000, "Thỏi", "Đồ ăn vặt", sups[1]),
            ("Kẹo Sing-gum Doublemint 11.6g", 5000, "Thỏi", "Đồ ăn vặt", sups[1]),
            ("Kẹo Sing-gum Extra 11.6g", 6000, "Thỏi", "Đồ ăn vặt", sups[1]),
            ("Kẹo dẻo Chupa Chups 160g", 25000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Sô cô la KitKat 17g", 8000, "Thanh", "Đồ ăn vặt", sups[1]),
            ("Sô cô la Snickers 51g", 15000, "Thanh", "Đồ ăn vặt", sups[1]),
            ("Sô cô la M&M nhân đậu phộng 40g", 18000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Hạt điều rang muối Tân Tân 150g", 45000, "Hũ", "Đồ ăn vặt", sups[1]),
            ("Đậu phộng rang tỏi ớt Tân Tân 200g", 30000, "Hũ", "Đồ ăn vặt", sups[1]),
            ("Hạt hướng dương Chacheer 108g", 15000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Khô gà lá chanh 100g", 35000, "Hũ", "Đồ ăn vặt", sups[1]),
            ("Khô bò miếng cay 100g", 65000, "Hũ", "Đồ ăn vặt", sups[1]),
            ("Bánh tráng trộn tỏi ớt 50g", 15000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Rong biển cháy tỏi 50g", 20000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Thạch rau câu Orihiro Nhật Bản 120g", 40000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Bánh xốp KitKat trà xanh 17g", 9000, "Thanh", "Đồ ăn vặt", sups[1]),
            ("Bánh quy AFC rau cải 200g", 28000, "Hộp", "Đồ ăn vặt", sups[1]),
            ("Bánh quy LU Pháp Cẩm chướng 100g", 25000, "Hộp", "Đồ ăn vặt", sups[1]),
            ("Trái cây sấy Vinamit 100g", 32000, "Gói", "Đồ ăn vặt", sups[1]),
            ("Khoai lang sấy Vinamit 100g", 30000, "Gói", "Đồ ăn vặt", sups[1]),

            # Thực phẩm khô (30)
            ("Mì Hảo Hảo tôm chua cay 75g", 4500, "Gói", "Thực phẩm khô", sups[1]),
            ("Mì Omachi sườn hầm ngũ quả 80g", 8000, "Gói", "Thực phẩm khô", sups[1]),
            ("Mì Kokomi tôm chua cay 65g", 3500, "Gói", "Thực phẩm khô", sups[1]),
            ("Mì 3 Miền tôm chua cay 65g", 3500, "Gói", "Thực phẩm khô", sups[1]),
            ("Mì xào Indomie Goreng 85g", 6000, "Gói", "Thực phẩm khô", sups[1]),
            ("Mì cay Samyang gà phô mai 140g", 28000, "Gói", "Thực phẩm khô", sups[1]),
            ("Mì ly Modern tôm chua cay 65g", 8000, "Ly", "Thực phẩm khô", sups[1]),
            ("Mì ly Hảo Hảo Handy tôm chua cay 67g", 9000, "Ly", "Thực phẩm khô", sups[1]),
            ("Phở bò Vifon 65g", 6500, "Gói", "Thực phẩm khô", sups[1]),
            ("Phở gà Vifon 65g", 6500, "Gói", "Thực phẩm khô", sups[1]),
            ("Hủ tiếu Nam Vang Nhịp Sống 70g", 7000, "Gói", "Thực phẩm khô", sups[1]),
            ("Bún xào Vifon 65g", 6000, "Gói", "Thực phẩm khô", sups[1]),
            ("Miến Phú Hương thịt băm 58g", 10000, "Gói", "Thực phẩm khô", sups[1]),
            ("Cháo sườn Yến mạch 50g", 12000, "Gói", "Thực phẩm khô", sups[1]),
            ("Gạo ST25 A An 5kg", 180000, "Bao", "Thực phẩm khô", sups[1]),
            ("Gạo thơm Lài Miên 5kg", 110000, "Bao", "Thực phẩm khô", sups[1]),
            ("Gạo lứt đỏ huyết rồng 1kg", 35000, "Gói", "Thực phẩm khô", sups[1]),
            ("Đậu xanh hạt 500g", 25000, "Gói", "Thực phẩm khô", sups[1]),
            ("Đậu đen 500g", 28000, "Gói", "Thực phẩm khô", sups[1]),
            ("Đậu đỏ 500g", 30000, "Gói", "Thực phẩm khô", sups[1]),
            ("Đậu phộng hạt 500g", 35000, "Gói", "Thực phẩm khô", sups[1]),
            ("Nấm hương khô 100g", 45000, "Gói", "Thực phẩm khô", sups[1]),
            ("Mộc nhĩ khô 100g", 25000, "Gói", "Thực phẩm khô", sups[1]),
            ("Cá hộp 3 Cô Gái 155g", 15000, "Hộp", "Thực phẩm khô", sups[2]),
            ("Thịt heo lát Vissan 150g", 28000, "Hộp", "Thực phẩm khô", sups[2]),
            ("Pate gan Heo Vissan 130g", 22000, "Hộp", "Thực phẩm khô", sups[2]),
            ("Bò hầm Vissan 150g", 35000, "Hộp", "Thực phẩm khô", sups[2]),
            ("Xúc xích Vissan heo tiệt trùng 4x40g", 18000, "Gói", "Thực phẩm khô", sups[2]),
            ("Xúc xích Ponnie thịt heo 4x40g", 20000, "Gói", "Thực phẩm khô", sups[2]),
            ("Xúc xích CP Red tiệt trùng 4x40g", 19000, "Gói", "Thực phẩm khô", sups[2]),

            # Gia vị (35)
            ("Nước mắm Nam Ngư 500ml", 25000, "Chai", "Gia vị", sups[1]),
            ("Nước mắm Chinsu cá hồi 500ml", 40000, "Chai", "Gia vị", sups[1]),
            ("Nước mắm Liên Thành nhãn bạc 500ml", 55000, "Chai", "Gia vị", sups[1]),
            ("Nước tương Chinsu 250ml", 15000, "Chai", "Gia vị", sups[1]),
            ("Nước tương Maggi đậm đặc 300ml", 18000, "Chai", "Gia vị", sups[1]),
            ("Nước tương Tam Thái Tử 500ml", 16000, "Chai", "Gia vị", sups[1]),
            ("Tương ớt Chinsu 250g", 12000, "Chai", "Gia vị", sups[1]),
            ("Tương ớt Cholimex 270g", 11000, "Chai", "Gia vị", sups[1]),
            ("Tương cà Cholimex 270g", 11000, "Chai", "Gia vị", sups[1]),
            ("Mayonnaise Kewpie 130g", 22000, "Tuýp", "Gia vị", sups[1]),
            ("Mayonnaise Ajinomoto 130g", 18000, "Tuýp", "Gia vị", sups[1]),
            ("Dầu ăn Neptune Gold 1L", 55000, "Chai", "Gia vị", sups[1]),
            ("Dầu ăn Simply đậu nành 1L", 58000, "Chai", "Gia vị", sups[1]),
            ("Dầu ăn Tường An 1L", 48000, "Chai", "Gia vị", sups[1]),
            ("Dầu hào Maggi 350g", 25000, "Chai", "Gia vị", sups[1]),
            ("Dầu hào Chinsu 250g", 20000, "Chai", "Gia vị", sups[1]),
            ("Dầu mè thơm Nakydaco 250ml", 35000, "Chai", "Gia vị", sups[1]),
            ("Đường tinh luyện Biên Hòa 1kg", 25000, "Gói", "Gia vị", sups[1]),
            ("Đường vàng Biên Hòa 1kg", 26000, "Gói", "Gia vị", sups[1]),
            ("Đường phèn viên 500g", 22000, "Gói", "Gia vị", sups[1]),
            ("Muối tinh i-ốt 1kg", 6000, "Gói", "Gia vị", sups[1]),
            ("Muối tôm Tây Ninh 150g", 25000, "Hũ", "Gia vị", sups[1]),
            ("Bột ngọt Ajinomoto 454g", 35000, "Gói", "Gia vị", sups[1]),
            ("Bột ngọt Vedan 454g", 32000, "Gói", "Gia vị", sups[1]),
            ("Hạt nêm Knorr thịt heo 400g", 38000, "Gói", "Gia vị", sups[1]),
            ("Hạt nêm Maggi nấm hương 400g", 35000, "Gói", "Gia vị", sups[1]),
            ("Hạt nêm Aji-ngon heo 400g", 36000, "Gói", "Gia vị", sups[1]),
            ("Bột canh Hải Châu 190g", 6000, "Gói", "Gia vị", sups[1]),
            ("Tiêu đen xay 50g", 15000, "Hũ", "Gia vị", sups[1]),
            ("Ngũ vị hương hiệu Con Nai 10g", 5000, "Gói", "Gia vị", sups[1]),
            ("Bột chiên giòn Aji-Quick 150g", 10000, "Gói", "Gia vị", sups[1]),
            ("Bột chiên xù Panko 200g", 20000, "Gói", "Gia vị", sups[1]),
            ("Giấm gạo Lisa 500ml", 15000, "Chai", "Gia vị", sups[1]),
            ("Mù tạt wasabi S&B 43g", 35000, "Tuýp", "Gia vị", sups[1]),
            ("Nước cốt dừa Wonderfarm 400ml", 25000, "Lon", "Gia vị", sups[1]),

            # Chăm sóc cá nhân (35)
            ("Dầu gội Clear men 630g", 165000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Dầu gội Sunsilk mềm mượt 650g", 135000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Dầu gội Pantene phục hồi 650g", 140000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Dầu gội Head & Shoulders bạc hà 620g", 160000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Dầu gội Rejoice siêu mượt 600ml", 125000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Dầu xả Pantene 320g", 85000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Dầu xả Sunsilk 320g", 75000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Sữa tắm Lifebuoy bảo vệ vượt trội 850g", 155000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Sữa tắm Dove dưỡng ẩm 530g", 125000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Sữa tắm Hazeline matcha lựu đỏ 670g", 115000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Sữa tắm nam X-men Wood 650g", 165000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Sữa tắm nam Romano Classic 650g", 160000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Bọt cạo râu Gillette 175g", 75000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Dao cạo râu Gillette 3 lưỡi kép", 45000, "Cái", "Chăm sóc cá nhân", sups[1]),
            ("Kem đánh răng P/S bảo vệ 123 240g", 35000, "Hộp", "Chăm sóc cá nhân", sups[1]),
            ("Kem đánh răng Colgate ngừa sâu răng 225g", 36000, "Hộp", "Chăm sóc cá nhân", sups[1]),
            ("Kem đánh răng Sensodyne giảm ê buốt 100g", 65000, "Hộp", "Chăm sóc cá nhân", sups[1]),
            ("Kem đánh răng Closeup lộc đề 230g", 38000, "Hộp", "Chăm sóc cá nhân", sups[1]),
            ("Bàn chải đánh răng P/S lông mềm", 18000, "Cái", "Chăm sóc cá nhân", sups[1]),
            ("Bàn chải đánh răng Colgate mảnh", 20000, "Cái", "Chăm sóc cá nhân", sups[1]),
            ("Nước súc miệng Listerine Cool Mint 250ml", 55000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Sữa rửa mặt Pond's trắng da 100g", 65000, "Tuýp", "Chăm sóc cá nhân", sups[1]),
            ("Sữa rửa mặt Nivea nam kiểm soát nhờn 100g", 70000, "Tuýp", "Chăm sóc cá nhân", sups[1]),
            ("Sữa rửa mặt Acnes ngừa mụn 100g", 60000, "Tuýp", "Chăm sóc cá nhân", sups[1]),
            ("Bông tẩy trang Silcot 82 miếng", 45000, "Hộp", "Chăm sóc cá nhân", sups[1]),
            ("Lăn khử mùi Nivea nam 50ml", 65000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Lăn khử mùi Rexona nữ 50ml", 55000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Sáp khử mùi X-men 50g", 75000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Băng vệ sinh Diana siêu thấm 8 miếng", 18000, "Gói", "Chăm sóc cá nhân", sups[1]),
            ("Băng vệ sinh Kotex khô thoáng 8 miếng", 17000, "Gói", "Chăm sóc cá nhân", sups[1]),
            ("Dung dịch vệ sinh Dạ Hương 100ml", 35000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Kem dưỡng ẩm Hada Labo 50g", 180000, "Hũ", "Chăm sóc cá nhân", sups[1]),
            ("Sữa dưỡng thể Vaseline 200ml", 95000, "Chai", "Chăm sóc cá nhân", sups[1]),
            ("Kem chống nắng Sunplay 30g", 85000, "Tuýp", "Chăm sóc cá nhân", sups[1]),
            ("Bao cao su Durex Invisible 3s", 85000, "Hộp", "Chăm sóc cá nhân", sups[1]),

            # Vệ sinh nhà cửa (25)
            ("Nước giặt OMO Matic cửa trên 2.9kg", 185000, "Túi", "Vệ sinh nhà cửa", sups[1]),
            ("Nước giặt Ariel cửa trước 2.8kg", 190000, "Túi", "Vệ sinh nhà cửa", sups[1]),
            ("Bột giặt OMO hệ bọt thông minh 3kg", 125000, "Túi", "Vệ sinh nhà cửa", sups[1]),
            ("Bột giặt Surf hương nước hoa 3kg", 95000, "Túi", "Vệ sinh nhà cửa", sups[1]),
            ("Nước xả vải Downy huyền bí 1.5L", 115000, "Túi", "Vệ sinh nhà cửa", sups[1]),
            ("Nước xả vải Comfort ban mai 1.8L", 120000, "Túi", "Vệ sinh nhà cửa", sups[1]),
            ("Nước rửa chén Sunlight chanh 750g", 32000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước rửa chén Mỹ Hảo 1.5kg", 45000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước lau sàn Sunlight chanh sả 1kg", 35000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước lau sàn Gift hoa ly 1L", 30000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước tẩy bồn cầu Vim 900ml", 40000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước tẩy bồn cầu Duck 900ml", 35000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước tẩy Javel Mỹ Hảo 1kg", 20000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước xịt kính Gift 500ml", 25000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Nước lau bếp Cif 500ml", 35000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Bình xịt muỗi Raid 600ml", 65000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Bình xịt muỗi Jumbo Vape 600ml", 60000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Sáp thơm phòng Glade 180g", 45000, "Hộp", "Vệ sinh nhà cửa", sups[1]),
            ("Xịt phòng Ami 280ml", 35000, "Chai", "Vệ sinh nhà cửa", sups[1]),
            ("Viên tẩy bồn cầu Vim (vỉ 3 viên)", 45000, "Vỉ", "Vệ sinh nhà cửa", sups[1]),
            ("Nước tẩy lồng máy giặt OMO 250g", 40000, "Gói", "Vệ sinh nhà cửa", sups[1]),
            ("Cọ rửa chén Scotch-Brite", 15000, "Cái", "Vệ sinh nhà cửa", sups[1]),
            ("Cọ toilet cán dài", 25000, "Cái", "Vệ sinh nhà cửa", sups[1]),
            ("Bao tay cao su rửa chén", 20000, "Đôi", "Vệ sinh nhà cửa", sups[1]),
            ("Túi rác đen cuộn lớn", 35000, "Cuộn", "Vệ sinh nhà cửa", sups[1]),

            # Đồ dùng gia đình (15)
            ("Khăn giấy lụa Pulppy 100 tờ", 25000, "Hộp", "Đồ dùng gia đình", sups[1]),
            ("Khăn giấy rút Bless You 250 tờ", 28000, "Gói", "Đồ dùng gia đình", sups[1]),
            ("Giấy vệ sinh Watersilk 10 cuộn", 45000, "Lốc", "Đồ dùng gia đình", sups[1]),
            ("Giấy vệ sinh E'mos 10 cuộn", 55000, "Lốc", "Đồ dùng gia đình", sups[1]),
            ("Khăn ướt Baby Mamy Poko 80 miếng", 35000, "Gói", "Đồ dùng gia đình", sups[1]),
            ("Màng bọc thực phẩm Ringo 30cm", 45000, "Hộp", "Đồ dùng gia đình", sups[1]),
            ("Giấy bạc nướng thực phẩm 30cm", 35000, "Hộp", "Đồ dùng gia đình", sups[1]),
            ("Tăm tre Việt Nam", 5000, "Hộp", "Đồ dùng gia đình", sups[1]),
            ("Bông ngoáy tai Sakura 200 que", 15000, "Hộp", "Đồ dùng gia đình", sups[1]),
            ("Găng tay nilon xài 1 lần (100 cái)", 15000, "Gói", "Đồ dùng gia đình", sups[1]),
            ("Pin AA Energizer vỉ 2 viên", 35000, "Vỉ", "Đồ dùng gia đình", sups[1]),
            ("Pin AAA Panasonic vỉ 2 viên", 20000, "Vỉ", "Đồ dùng gia đình", sups[1]),
            ("Bóng đèn Led Điện Quang 9W", 45000, "Cái", "Đồ dùng gia đình", sups[1]),
            ("Keo dán 502", 5000, "Chai", "Đồ dùng gia đình", sups[1]),
            ("Bật lửa BIC", 8000, "Cái", "Đồ dùng gia đình", sups[1]),

            # Sữa & Chế phẩm (20)
            ("Sữa tươi Vinamilk có đường 180ml", 8000, "Hộp", "Sữa & Chế phẩm", sups[4]),
            ("Sữa tươi Vinamilk không đường 180ml", 8000, "Hộp", "Sữa & Chế phẩm", sups[4]),
            ("Sữa tươi TH True Milk có đường 180ml", 8500, "Hộp", "Sữa & Chế phẩm", sups[3]),
            ("Sữa tươi TH True Milk ít đường 180ml", 8500, "Hộp", "Sữa & Chế phẩm", sups[3]),
            ("Sữa Milo lúa mạch 180ml", 8500, "Hộp", "Sữa & Chế phẩm", sups[1]),
            ("Sữa đậu nành Fami nguyên chất 200ml", 5500, "Hộp", "Sữa & Chế phẩm", sups[1]),
            ("Sữa chua Vinamilk có đường (vỉ 4 hộp)", 28000, "Vỉ", "Sữa & Chế phẩm", sups[4]),
            ("Sữa chua Vinamilk nha đam (vỉ 4 hộp)", 32000, "Vỉ", "Sữa & Chế phẩm", sups[4]),
            ("Sữa chua uống Probi 65ml (lốc 5 chai)", 25000, "Lốc", "Sữa & Chế phẩm", sups[4]),
            ("Sữa chua uống Betagen 400ml", 35000, "Chai", "Sữa & Chế phẩm", sups[1]),
            ("Sữa chua uống Susu 110ml", 6000, "Chai", "Sữa & Chế phẩm", sups[4]),
            ("Sữa đặc Ngôi sao Phương Nam 380g", 22000, "Lon", "Sữa & Chế phẩm", sups[4]),
            ("Sữa đặc Ông Thọ đỏ 380g", 25000, "Lon", "Sữa & Chế phẩm", sups[4]),
            ("Phô mai Con Bò Cười 120g (8 miếng)", 38000, "Hộp", "Sữa & Chế phẩm", sups[1]),
            ("Phô mai lát Cheddar Anchor 200g", 85000, "Gói", "Sữa & Chế phẩm", sups[1]),
            ("Bơ lạt Anchor 227g", 95000, "Thỏi", "Sữa & Chế phẩm", sups[1]),
            ("Bơ thực vật Tường An 200g", 20000, "Hộp", "Sữa & Chế phẩm", sups[1]),
            ("Sữa bột Ensure Gold 850g", 850000, "Lon", "Sữa & Chế phẩm", sups[1]),
            ("Sữa bột Dielac Grow 900g", 350000, "Lon", "Sữa & Chế phẩm", sups[4]),
            ("Sữa chua sấy lạnh sầu riêng 30g", 45000, "Gói", "Sữa & Chế phẩm", sups[1])
        ]

        print(f"Adding {len(products_data)} products to SQL Server...")
        for name, price, unit, cat_name, supplier in products_data:
            barcode = str(random.randint(1000000000000, 9999999999999))
            cat = categories.get(cat_name) or categories.get("Đồ uống")
            
            cost_price = int(price * random.uniform(0.6, 0.8) / 1000) * 1000
            if cost_price >= price: 
                cost_price = price - 1000
                
            stock = random.randint(10, 200)

            p = Product(
                name=name,
                barcode=barcode,
                price=price,
                cost_price=cost_price,
                stock_quantity=stock,
                unit=unit,
                category_id=cat.id,
                supplier_id=supplier.id if supplier else None,
                image_url=None
            )
            db.session.add(p)
            
        db.session.commit()
        print(f"Successfully seeded database SupermarketPOS with default users, suppliers, categories, customers, promotions, and products!")

if __name__ == '__main__':
    seed()
