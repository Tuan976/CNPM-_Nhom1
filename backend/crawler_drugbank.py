import requests
from app import app, db
from models import Drug

def crawl_vietnam_drugs(limit=100):
    """
    Kết nối API DrugBank Việt Nam để lấy dữ liệu thuốc chính thống
    """
    print(f"--- Đang bắt đầu cào {limit} thuốc từ DrugBank Việt Nam ---")
    
    url = f"https://drugbank.vn/api/public/thuoc/search?size={limit}&page=0"
    
    try:
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            data = response.json()
            drugs_raw = data.get('content', [])
            
            with app.app_context():
                count = 0
                for item in drugs_raw:
                    # Kiểm tra xem thuốc đã tồn tại chưa
                    existing = Drug.query.filter_by(name=item.get('tenThuoc')).first()
                    if not existing:
                        new_drug = Drug(
                            name=item.get('tenThuoc'),
                            ingredients=item.get('hoatChat', 'N/A'),
                            indications=item.get('chiDinh', 'Theo hướng dẫn của bác sĩ'),
                            dosage=item.get('hamLuong', 'N/A'),
                            pharmacological_group=item.get('phanLoai', 'Chưa phân loại')
                        )
                        db.session.add(new_drug)
                        count += 1
                
                db.session.commit()
                print(f"--- Hoàn tất! Đã thêm mới {count} thuốc vào Database ---")
        else:
            print(f"Lỗi kết nối API: {response.status_code}")
    except Exception as e:
        print(f"Lỗi hệ thống: {e}")

if __name__ == '__main__':
    # Bạn có thể tăng số lượng lên 500, 1000 tùy ý
    crawl_vietnam_drugs(limit=200)
