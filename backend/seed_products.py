from app import app, db
from models import Product, Category
import random

def seed():
    with app.app_context():
        # Xóa dữ liệu cũ (tùy chọn, ở đây chỉ thêm mới hoặc skip nếu trùng)
        print("Đang tạo danh mục...")
        cat_names = [
            "Đồ uống", "Đồ ăn vặt", "Thực phẩm khô", "Gia vị", 
            "Chăm sóc cá nhân", "Vệ sinh nhà cửa", "Đồ dùng gia đình", "Sữa & Chế phẩm"
        ]
        
        categories = {}
        for cname in cat_names:
            cat = Category.query.filter_by(name=cname).first()
            if not cat:
                cat = Category(name=cname)
                db.session.add(cat)
                db.session.commit()
            categories[cname] = cat.id

        products_data = [
            # Đồ uống (30)
            ("Coca Cola 330ml", 10000, "Lon", "Đồ uống"),
            ("Pepsi 330ml", 10000, "Lon", "Đồ uống"),
            ("Sprite 330ml", 10000, "Lon", "Đồ uống"),
            ("7Up 330ml", 10000, "Lon", "Đồ uống"),
            ("Fanta Cam 330ml", 10000, "Lon", "Đồ uống"),
            ("Mirinda Cam 330ml", 10000, "Lon", "Đồ uống"),
            ("Nước khoáng Lavie 500ml", 5000, "Chai", "Đồ uống"),
            ("Nước tinh khiết Aquafina 500ml", 5000, "Chai", "Đồ uống"),
            ("Nước tinh khiết Dasani 500ml", 5000, "Chai", "Đồ uống"),
            ("Trà ô long Tea+ Plus 455ml", 10000, "Chai", "Đồ uống"),
            ("Trà xanh Không Độ 500ml", 10000, "Chai", "Đồ uống"),
            ("Trà thanh nhiệt Dr Thanh 330ml", 10000, "Chai", "Đồ uống"),
            ("Trà Lipton vị chanh 330ml", 9000, "Lon", "Đồ uống"),
            ("Nước tăng lực Redbull 250ml", 12000, "Lon", "Đồ uống"),
            ("Nước tăng lực Sting Dâu 330ml", 10000, "Chai", "Đồ uống"),
            ("Nước tăng lực Wake-up 247 330ml", 10000, "Chai", "Đồ uống"),
            ("Nước ép trái cây Vfresh Cam 1L", 45000, "Hộp", "Đồ uống"),
            ("Nước ép trái cây Vfresh Táo 1L", 45000, "Hộp", "Đồ uống"),
            ("Nước dừa tươi Cocoxim 330ml", 15000, "Hộp", "Đồ uống"),
            ("Bia Heineken 330ml", 19000, "Lon", "Đồ uống"),
            ("Bia Tiger 330ml", 16000, "Lon", "Đồ uống"),
            ("Bia Tiger Crystal 330ml", 17000, "Lon", "Đồ uống"),
            ("Bia Saigon Special 330ml", 15000, "Lon", "Đồ uống"),
            ("Bia 333 330ml", 12000, "Lon", "Đồ uống"),
            ("Cà phê đen đá Birdy 170ml", 12000, "Lon", "Đồ uống"),
            ("Cà phê sữa đá Highlands 235ml", 15000, "Lon", "Đồ uống"),
            ("Cà phê sữa Nescafe 330ml", 13000, "Lon", "Đồ uống"),
            ("Nước yến sào Sanest 70ml", 35000, "Lọ", "Đồ uống"),
            ("Nước sâm bí đao Wonderfarm 310ml", 9000, "Lon", "Đồ uống"),
            ("Soju vị Nho Jinro 360ml", 65000, "Chai", "Đồ uống"),

            # Đồ ăn vặt (40)
            ("Snack khoai tây O'Star vị tự nhiên 36g", 8000, "Gói", "Đồ ăn vặt"),
            ("Snack khoai tây O'Star vị kim chi 36g", 8000, "Gói", "Đồ ăn vặt"),
            ("Snack khoai tây O'Star vị tảo biển 36g", 8000, "Gói", "Đồ ăn vặt"),
            ("Snack khoai tây Lay's vị tự nhiên 56g", 12000, "Gói", "Đồ ăn vặt"),
            ("Snack khoai tây Lay's vị phô mai 56g", 12000, "Gói", "Đồ ăn vặt"),
            ("Snack khoai tây Lay's vị bò 56g", 12000, "Gói", "Đồ ăn vặt"),
            ("Snack bắp Oishi vị pho mát 40g", 6000, "Gói", "Đồ ăn vặt"),
            ("Snack phồng tôm Oishi 40g", 6000, "Gói", "Đồ ăn vặt"),
            ("Snack mực Bento Thái Lan 20g", 25000, "Gói", "Đồ ăn vặt"),
            ("Bánh quy Cosy Marie 160g", 15000, "Gói", "Đồ ăn vặt"),
            ("Bánh quy bơ Danisa 454g", 120000, "Hộp", "Đồ ăn vặt"),
            ("Bánh quy Oreo vị kem vani 133g", 16000, "Gói", "Đồ ăn vặt"),
            ("Bánh quy Oreo vị socola 133g", 16000, "Gói", "Đồ ăn vặt"),
            ("Bánh xốp Nabati phô mai 140g", 18000, "Gói", "Đồ ăn vặt"),
            ("Bánh chocopie Orion hộp 6 cái", 35000, "Hộp", "Đồ ăn vặt"),
            ("Bánh Custas Orion hộp 6 cái", 36000, "Hộp", "Đồ ăn vặt"),
            ("Bánh gạo One-One vị ngọt 150g", 22000, "Gói", "Đồ ăn vặt"),
            ("Bánh gạo Ichi vị mặn 100g", 18000, "Gói", "Đồ ăn vặt"),
            ("Kẹo Alpenliebe vị dâu 32g", 6000, "Thỏi", "Đồ ăn vặt"),
            ("Kẹo Alpenliebe vị caramen 32g", 6000, "Thỏi", "Đồ ăn vặt"),
            ("Kẹo Sing-gum Coolair 11.6g", 5000, "Thỏi", "Đồ ăn vặt"),
            ("Kẹo Sing-gum Doublemint 11.6g", 5000, "Thỏi", "Đồ ăn vặt"),
            ("Kẹo Sing-gum Extra 11.6g", 6000, "Thỏi", "Đồ ăn vặt"),
            ("Kẹo dẻo Chupa Chups 160g", 25000, "Gói", "Đồ ăn vặt"),
            ("Sô cô la KitKat 17g", 8000, "Thanh", "Đồ ăn vặt"),
            ("Sô cô la Snickers 51g", 15000, "Thanh", "Đồ ăn vặt"),
            ("Sô cô la M&M nhân đậu phộng 40g", 18000, "Gói", "Đồ ăn vặt"),
            ("Hạt điều rang muối Tân Tân 150g", 45000, "Hũ", "Đồ ăn vặt"),
            ("Đậu phộng rang tỏi ớt Tân Tân 200g", 30000, "Hũ", "Đồ ăn vặt"),
            ("Hạt hướng dương Chacheer 108g", 15000, "Gói", "Đồ ăn vặt"),
            ("Khô gà lá chanh 100g", 35000, "Hũ", "Đồ ăn vặt"),
            ("Khô bò miếng cay 100g", 65000, "Hũ", "Đồ ăn vặt"),
            ("Bánh tráng trộn tỏi ớt 50g", 15000, "Gói", "Đồ ăn vặt"),
            ("Rong biển cháy tỏi 50g", 20000, "Gói", "Đồ ăn vặt"),
            ("Thạch rau câu Orihiro Nhật Bản 120g", 40000, "Gói", "Đồ ăn vặt"),
            ("Bánh xốp KitKat trà xanh 17g", 9000, "Thanh", "Đồ ăn vặt"),
            ("Bánh quy AFC rau cải 200g", 28000, "Hộp", "Đồ ăn vặt"),
            ("Bánh quy LU Pháp Cẩm chướng 100g", 25000, "Hộp", "Đồ ăn vặt"),
            ("Trái cây sấy Vinamit 100g", 32000, "Gói", "Đồ ăn vặt"),
            ("Khoai lang sấy Vinamit 100g", 30000, "Gói", "Đồ ăn vặt"),

            # Thực phẩm khô (30)
            ("Mì Hảo Hảo tôm chua cay 75g", 4500, "Gói", "Thực phẩm khô"),
            ("Mì Omachi sườn hầm ngũ quả 80g", 8000, "Gói", "Thực phẩm khô"),
            ("Mì Kokomi tôm chua cay 65g", 3500, "Gói", "Thực phẩm khô"),
            ("Mì 3 Miền tôm chua cay 65g", 3500, "Gói", "Thực phẩm khô"),
            ("Mì xào Indomie Goreng 85g", 6000, "Gói", "Thực phẩm khô"),
            ("Mì cay Samyang gà phô mai 140g", 28000, "Gói", "Thực phẩm khô"),
            ("Mì ly Modern tôm chua cay 65g", 8000, "Ly", "Thực phẩm khô"),
            ("Mì ly Hảo Hảo Handy tôm chua cay 67g", 9000, "Ly", "Thực phẩm khô"),
            ("Phở bò Vifon 65g", 6500, "Gói", "Thực phẩm khô"),
            ("Phở gà Vifon 65g", 6500, "Gói", "Thực phẩm khô"),
            ("Hủ tiếu Nam Vang Nhịp Sống 70g", 7000, "Gói", "Thực phẩm khô"),
            ("Bún xào Vifon 65g", 6000, "Gói", "Thực phẩm khô"),
            ("Miến Phú Hương thịt băm 58g", 10000, "Gói", "Thực phẩm khô"),
            ("Cháo sườn Yến mạch 50g", 12000, "Gói", "Thực phẩm khô"),
            ("Gạo ST25 A An 5kg", 180000, "Bao", "Thực phẩm khô"),
            ("Gạo thơm Lài Miên 5kg", 110000, "Bao", "Thực phẩm khô"),
            ("Gạo lứt đỏ huyết rồng 1kg", 35000, "Gói", "Thực phẩm khô"),
            ("Đậu xanh hạt 500g", 25000, "Gói", "Thực phẩm khô"),
            ("Đậu đen 500g", 28000, "Gói", "Thực phẩm khô"),
            ("Đậu đỏ 500g", 30000, "Gói", "Thực phẩm khô"),
            ("Đậu phộng hạt 500g", 35000, "Gói", "Thực phẩm khô"),
            ("Nấm hương khô 100g", 45000, "Gói", "Thực phẩm khô"),
            ("Mộc nhĩ khô 100g", 25000, "Gói", "Thực phẩm khô"),
            ("Cá hộp 3 Cô Gái 155g", 15000, "Hộp", "Thực phẩm khô"),
            ("Thịt heo lát Vissan 150g", 28000, "Hộp", "Thực phẩm khô"),
            ("Pate gan Heo Vissan 130g", 22000, "Hộp", "Thực phẩm khô"),
            ("Bò hầm Vissan 150g", 35000, "Hộp", "Thực phẩm khô"),
            ("Xúc xích Vissan heo tiệt trùng 4x40g", 18000, "Gói", "Thực phẩm khô"),
            ("Xúc xích Ponnie thịt heo 4x40g", 20000, "Gói", "Thực phẩm khô"),
            ("Xúc xích CP Red tiệt trùng 4x40g", 19000, "Gói", "Thực phẩm khô"),

            # Gia vị (35)
            ("Nước mắm Nam Ngư 500ml", 25000, "Chai", "Gia vị"),
            ("Nước mắm Chinsu cá hồi 500ml", 40000, "Chai", "Gia vị"),
            ("Nước mắm Liên Thành nhãn bạc 500ml", 55000, "Chai", "Gia vị"),
            ("Nước tương Chinsu 250ml", 15000, "Chai", "Gia vị"),
            ("Nước tương Maggi đậm đặc 300ml", 18000, "Chai", "Gia vị"),
            ("Nước tương Tam Thái Tử 500ml", 16000, "Chai", "Gia vị"),
            ("Tương ớt Chinsu 250g", 12000, "Chai", "Gia vị"),
            ("Tương ớt Cholimex 270g", 11000, "Chai", "Gia vị"),
            ("Tương cà Cholimex 270g", 11000, "Chai", "Gia vị"),
            ("Mayonnaise Kewpie 130g", 22000, "Tuýp", "Gia vị"),
            ("Mayonnaise Ajinomoto 130g", 18000, "Tuýp", "Gia vị"),
            ("Dầu ăn Neptune Gold 1L", 55000, "Chai", "Gia vị"),
            ("Dầu ăn Simply đậu nành 1L", 58000, "Chai", "Gia vị"),
            ("Dầu ăn Tường An 1L", 48000, "Chai", "Gia vị"),
            ("Dầu hào Maggi 350g", 25000, "Chai", "Gia vị"),
            ("Dầu hào Chinsu 250g", 20000, "Chai", "Gia vị"),
            ("Dầu mè thơm Nakydaco 250ml", 35000, "Chai", "Gia vị"),
            ("Đường tinh luyện Biên Hòa 1kg", 25000, "Gói", "Gia vị"),
            ("Đường vàng Biên Hòa 1kg", 26000, "Gói", "Gia vị"),
            ("Đường phèn viên 500g", 22000, "Gói", "Gia vị"),
            ("Muối tinh i-ốt 1kg", 6000, "Gói", "Gia vị"),
            ("Muối tôm Tây Ninh 150g", 25000, "Hũ", "Gia vị"),
            ("Bột ngọt Ajinomoto 454g", 35000, "Gói", "Gia vị"),
            ("Bột ngọt Vedan 454g", 32000, "Gói", "Gia vị"),
            ("Hạt nêm Knorr thịt heo 400g", 38000, "Gói", "Gia vị"),
            ("Hạt nêm Maggi nấm hương 400g", 35000, "Gói", "Gia vị"),
            ("Hạt nêm Aji-ngon heo 400g", 36000, "Gói", "Gia vị"),
            ("Bột canh Hải Châu 190g", 6000, "Gói", "Gia vị"),
            ("Tiêu đen xay 50g", 15000, "Hũ", "Gia vị"),
            ("Ngũ vị hương hiệu Con Nai 10g", 5000, "Gói", "Gia vị"),
            ("Bột chiên giòn Aji-Quick 150g", 10000, "Gói", "Gia vị"),
            ("Bột chiên xù Panko 200g", 20000, "Gói", "Gia vị"),
            ("Giấm gạo Lisa 500ml", 15000, "Chai", "Gia vị"),
            ("Mù tạt wasabi S&B 43g", 35000, "Tuýp", "Gia vị"),
            ("Nước cốt dừa Wonderfarm 400ml", 25000, "Lon", "Gia vị"),

            # Chăm sóc cá nhân (35)
            ("Dầu gội Clear men 630g", 165000, "Chai", "Chăm sóc cá nhân"),
            ("Dầu gội Sunsilk mềm mượt 650g", 135000, "Chai", "Chăm sóc cá nhân"),
            ("Dầu gội Pantene phục hồi 650g", 140000, "Chai", "Chăm sóc cá nhân"),
            ("Dầu gội Head & Shoulders bạc hà 620g", 160000, "Chai", "Chăm sóc cá nhân"),
            ("Dầu gội Rejoice siêu mượt 600ml", 125000, "Chai", "Chăm sóc cá nhân"),
            ("Dầu xả Pantene 320g", 85000, "Chai", "Chăm sóc cá nhân"),
            ("Dầu xả Sunsilk 320g", 75000, "Chai", "Chăm sóc cá nhân"),
            ("Sữa tắm Lifebuoy bảo vệ vượt trội 850g", 155000, "Chai", "Chăm sóc cá nhân"),
            ("Sữa tắm Dove dưỡng ẩm 530g", 125000, "Chai", "Chăm sóc cá nhân"),
            ("Sữa tắm Hazeline matcha lựu đỏ 670g", 115000, "Chai", "Chăm sóc cá nhân"),
            ("Sữa tắm nam X-men Wood 650g", 165000, "Chai", "Chăm sóc cá nhân"),
            ("Sữa tắm nam Romano Classic 650g", 160000, "Chai", "Chăm sóc cá nhân"),
            ("Bọt cạo râu Gillette 175g", 75000, "Chai", "Chăm sóc cá nhân"),
            ("Dao cạo râu Gillette 3 lưỡi kép", 45000, "Cái", "Chăm sóc cá nhân"),
            ("Kem đánh răng P/S bảo vệ 123 240g", 35000, "Hộp", "Chăm sóc cá nhân"),
            ("Kem đánh răng Colgate ngừa sâu răng 225g", 36000, "Hộp", "Chăm sóc cá nhân"),
            ("Kem đánh răng Sensodyne giảm ê buốt 100g", 65000, "Hộp", "Chăm sóc cá nhân"),
            ("Kem đánh răng Closeup lộc đề 230g", 38000, "Hộp", "Chăm sóc cá nhân"),
            ("Bàn chải đánh răng P/S lông mềm", 18000, "Cái", "Chăm sóc cá nhân"),
            ("Bàn chải đánh răng Colgate mảnh", 20000, "Cái", "Chăm sóc cá nhân"),
            ("Nước súc miệng Listerine Cool Mint 250ml", 55000, "Chai", "Chăm sóc cá nhân"),
            ("Sữa rửa mặt Pond's trắng da 100g", 65000, "Tuýp", "Chăm sóc cá nhân"),
            ("Sữa rửa mặt Nivea nam kiểm soát nhờn 100g", 70000, "Tuýp", "Chăm sóc cá nhân"),
            ("Sữa rửa mặt Acnes ngừa mụn 100g", 60000, "Tuýp", "Chăm sóc cá nhân"),
            ("Bông tẩy trang Silcot 82 miếng", 45000, "Hộp", "Chăm sóc cá nhân"),
            ("Lăn khử mùi Nivea nam 50ml", 65000, "Chai", "Chăm sóc cá nhân"),
            ("Lăn khử mùi Rexona nữ 50ml", 55000, "Chai", "Chăm sóc cá nhân"),
            ("Sáp khử mùi X-men 50g", 75000, "Chai", "Chăm sóc cá nhân"),
            ("Băng vệ sinh Diana siêu thấm 8 miếng", 18000, "Gói", "Chăm sóc cá nhân"),
            ("Băng vệ sinh Kotex khô thoáng 8 miếng", 17000, "Gói", "Chăm sóc cá nhân"),
            ("Dung dịch vệ sinh Dạ Hương 100ml", 35000, "Chai", "Chăm sóc cá nhân"),
            ("Kem dưỡng ẩm Hada Labo 50g", 180000, "Hũ", "Chăm sóc cá nhân"),
            ("Sữa dưỡng thể Vaseline 200ml", 95000, "Chai", "Chăm sóc cá nhân"),
            ("Kem chống nắng Sunplay 30g", 85000, "Tuýp", "Chăm sóc cá nhân"),
            ("Bao cao su Durex Invisible 3s", 85000, "Hộp", "Chăm sóc cá nhân"),

            # Vệ sinh nhà cửa (25)
            ("Nước giặt OMO Matic cửa trên 2.9kg", 185000, "Túi", "Vệ sinh nhà cửa"),
            ("Nước giặt Ariel cửa trước 2.8kg", 190000, "Túi", "Vệ sinh nhà cửa"),
            ("Bột giặt OMO hệ bọt thông minh 3kg", 125000, "Túi", "Vệ sinh nhà cửa"),
            ("Bột giặt Surf hương nước hoa 3kg", 95000, "Túi", "Vệ sinh nhà cửa"),
            ("Nước xả vải Downy huyền bí 1.5L", 115000, "Túi", "Vệ sinh nhà cửa"),
            ("Nước xả vải Comfort ban mai 1.8L", 120000, "Túi", "Vệ sinh nhà cửa"),
            ("Nước rửa chén Sunlight chanh 750g", 32000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước rửa chén Mỹ Hảo 1.5kg", 45000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước lau sàn Sunlight chanh sả 1kg", 35000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước lau sàn Gift hoa ly 1L", 30000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước tẩy bồn cầu Vim 900ml", 40000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước tẩy bồn cầu Duck 900ml", 35000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước tẩy Javel Mỹ Hảo 1kg", 20000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước xịt kính Gift 500ml", 25000, "Chai", "Vệ sinh nhà cửa"),
            ("Nước lau bếp Cif 500ml", 35000, "Chai", "Vệ sinh nhà cửa"),
            ("Bình xịt muỗi Raid 600ml", 65000, "Chai", "Vệ sinh nhà cửa"),
            ("Bình xịt muỗi Jumbo Vape 600ml", 60000, "Chai", "Vệ sinh nhà cửa"),
            ("Sáp thơm phòng Glade 180g", 45000, "Hộp", "Vệ sinh nhà cửa"),
            ("Xịt phòng Ami 280ml", 35000, "Chai", "Vệ sinh nhà cửa"),
            ("Viên tẩy bồn cầu Vim (vỉ 3 viên)", 45000, "Vỉ", "Vệ sinh nhà cửa"),
            ("Nước tẩy lồng máy giặt OMO 250g", 40000, "Gói", "Vệ sinh nhà cửa"),
            ("Cọ rửa chén Scotch-Brite", 15000, "Cái", "Vệ sinh nhà cửa"),
            ("Cọ toilet cán dài", 25000, "Cái", "Vệ sinh nhà cửa"),
            ("Bao tay cao su rửa chén", 20000, "Đôi", "Vệ sinh nhà cửa"),
            ("Túi rác đen cuộn lớn", 35000, "Cuộn", "Vệ sinh nhà cửa"),

            # Đồ dùng gia đình (15)
            ("Khăn giấy lụa Pulppy 100 tờ", 25000, "Hộp", "Đồ dùng gia đình"),
            ("Khăn giấy rút Bless You 250 tờ", 28000, "Gói", "Đồ giấy gia đình"),
            ("Giấy vệ sinh Watersilk 10 cuộn", 45000, "Lốc", "Đồ dùng gia đình"),
            ("Giấy vệ sinh E'mos 10 cuộn", 55000, "Lốc", "Đồ dùng gia đình"),
            ("Khăn ướt Baby Mamy Poko 80 miếng", 35000, "Gói", "Đồ dùng gia đình"),
            ("Màng bọc thực phẩm Ringo 30cm", 45000, "Hộp", "Đồ dùng gia đình"),
            ("Giấy bạc nướng thực phẩm 30cm", 35000, "Hộp", "Đồ dùng gia đình"),
            ("Tăm tre Việt Nam", 5000, "Hộp", "Đồ dùng gia đình"),
            ("Bông ngoáy tai Sakura 200 que", 15000, "Hộp", "Đồ dùng gia đình"),
            ("Găng tay nilon xài 1 lần (100 cái)", 15000, "Gói", "Đồ dùng gia đình"),
            ("Pin AA Energizer vỉ 2 viên", 35000, "Vỉ", "Đồ dùng gia đình"),
            ("Pin AAA Panasonic vỉ 2 viên", 20000, "Vỉ", "Đồ dùng gia đình"),
            ("Bóng đèn Led Điện Quang 9W", 45000, "Cái", "Đồ dùng gia đình"),
            ("Keo dán 502", 5000, "Chai", "Đồ dùng gia đình"),
            ("Bật lửa BIC", 8000, "Cái", "Đồ dùng gia đình"),

            # Sữa & Chế phẩm (20)
            ("Sữa tươi Vinamilk có đường 180ml", 8000, "Hộp", "Sữa & Chế phẩm"),
            ("Sữa tươi Vinamilk không đường 180ml", 8000, "Hộp", "Sữa & Chế phẩm"),
            ("Sữa tươi TH True Milk có đường 180ml", 8500, "Hộp", "Sữa & Chế phẩm"),
            ("Sữa tươi TH True Milk ít đường 180ml", 8500, "Hộp", "Sữa & Chế phẩm"),
            ("Sữa Milo lúa mạch 180ml", 8500, "Hộp", "Sữa & Chế phẩm"),
            ("Sữa đậu nành Fami nguyên chất 200ml", 5500, "Hộp", "Sữa & Chế phẩm"),
            ("Sữa chua Vinamilk có đường (vỉ 4 hộp)", 28000, "Vỉ", "Sữa & Chế phẩm"),
            ("Sữa chua Vinamilk nha đam (vỉ 4 hộp)", 32000, "Vỉ", "Sữa & Chế phẩm"),
            ("Sữa chua uống Probi 65ml (lốc 5 chai)", 25000, "Lốc", "Sữa & Chế phẩm"),
            ("Sữa chua uống Betagen 400ml", 35000, "Chai", "Sữa & Chế phẩm"),
            ("Sữa chua uống Susu 110ml", 6000, "Chai", "Sữa & Chế phẩm"),
            ("Sữa đặc Ngôi sao Phương Nam 380g", 22000, "Lon", "Sữa & Chế phẩm"),
            ("Sữa đặc Ông Thọ đỏ 380g", 25000, "Lon", "Sữa & Chế phẩm"),
            ("Phô mai Con Bò Cười 120g (8 miếng)", 38000, "Hộp", "Sữa & Chế phẩm"),
            ("Phô mai lát Cheddar Anchor 200g", 85000, "Gói", "Sữa & Chế phẩm"),
            ("Bơ lạt Anchor 227g", 95000, "Thỏi", "Sữa & Chế phẩm"),
            ("Bơ thực vật Tường An 200g", 20000, "Hộp", "Sữa & Chế phẩm"),
            ("Sữa bột Ensure Gold 850g", 850000, "Lon", "Sữa & Chế phẩm"),
            ("Sữa bột Dielac Grow 900g", 350000, "Lon", "Sữa & Chế phẩm"),
            ("Sữa chua sấy lạnh sầu riêng 30g", 45000, "Gói", "Sữa & Chế phẩm")
        ]

        print(f"Đang thêm {len(products_data)} sản phẩm...")
        count = 0
        for name, price, unit, cat_name in products_data:
            barcode = str(random.randint(1000000000000, 9999999999999))
            
            # Kiểm tra xem tên đã có chưa
            exist = Product.query.filter_by(name=name).first()
            if not exist:
                cat_id = categories.get(cat_name) or categories.get("Đồ uống")
                
                # Giá vốn ngẫu nhiên khoảng 60% -> 80% giá bán
                cost_price = int(price * random.uniform(0.6, 0.8) / 1000) * 1000
                if cost_price >= price: cost_price = price - 1000
                
                # Kho hàng 10 -> 200
                stock = random.randint(10, 200)

                p = Product(
                    name=name,
                    barcode=barcode,
                    price=price,
                    cost_price=cost_price,
                    stock_quantity=stock,
                    unit=unit,
                    category_id=cat_id,
                    image_url=None
                )
                db.session.add(p)
                count += 1
                
        db.session.commit()
        print(f"✅ Đã thêm mới {count} sản phẩm thành công!")

if __name__ == '__main__':
    seed()
