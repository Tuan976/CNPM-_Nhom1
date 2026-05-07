# MiniMart POS & Analytics System 🛒

Hệ thống quản lý điểm bán hàng (POS) siêu thị chuyên nghiệp, được thiết kế với giao diện hiện đại (Premium Tech UI) cùng với đầy đủ tính năng quản lý bán hàng, kho bãi, nhân sự và báo cáo doanh thu.

## 🌟 Các tính năng nổi bật
- **Bán hàng POS (Point of Sale)**: Giao diện tính tiền nhanh chóng, hỗ trợ thanh toán bằng Tiền mặt, QR Code trực tiếp, và tích hợp cổng thanh toán **PayOS** (chuyển hướng thanh toán an toàn, xác nhận tự động qua Webhook).
- **Quản lý Khách hàng & Loyalty**: Đăng ký khách hàng thân thiết bằng Số điện thoại, tự động tích điểm sau mỗi hóa đơn, và có thể quy đổi điểm để giảm giá.
- **Báo cáo Doanh thu (Analytics)**: Biểu đồ thống kê trực quan (được vẽ bằng Framer Motion) về doanh thu, lợi nhuận, và hiển thị danh sách các sản phẩm bán chạy nhất trong ngày/tuần/tháng.
- **Quản lý Kho sản phẩm**: Theo dõi số lượng tồn kho theo thời gian thực, quản lý giá vốn và giá bán để tính toán tỷ suất lợi nhuận.
- **Quản lý Nhân sự (Staff)**: Phân quyền rõ ràng giữa `Admin` (Quản trị viên) và `Staff` (Nhân viên POS).
- **Lịch sử giao dịch**: Lưu trữ hóa đơn chi tiết, xem lại và hỗ trợ chức năng **In lại hóa đơn**.

## 🚀 Công nghệ sử dụng
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Axios, Lucide Icons.
- **Backend**: Python (Flask, Flask-RESTx, Flask-JWT-Extended), SQLAlchemy, Werkzeug Security.
- **Cơ sở dữ liệu**: SQLite (Mặc định - `supermarket.db`).
- **Payment Gateway**: PayOS SDK (v2).

## 💻 Hướng dẫn cài đặt

### Bước 1: Khởi động Backend
Mở Terminal, di chuyển vào thư mục `backend`:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # (Với Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
python app.py
```
*(API sẽ chạy tại `http://localhost:5000`)*

### Bước 2: Nạp dữ liệu mẫu (Seed Data)
Để trải nghiệm trọn vẹn, bạn nên tạo hơn 200 sản phẩm mẫu (bao gồm Đồ uống, Bánh kẹo, Gia vị, Vệ sinh...) với đầy đủ mã vạch, tồn kho và giá vốn (để tính lợi nhuận):
```bash
cd backend
python seed_products.py
```

### Bước 3: Khởi động Frontend
Mở một Terminal khác, di chuyển vào thư mục `frontend`:
```bash
cd frontend
npm install
npm run dev
```
*(Giao diện sẽ chạy tại `http://localhost:5173`)*

## 🔑 Tài khoản đăng nhập (Khởi tạo sẵn)
- **Username:** `admin`
- **Password:** `admin123`
*(Bạn có thể vào tab Đội ngũ nhân sự trên hệ thống để đổi mật khẩu hoặc tạo thêm tài khoản).*

## 💳 Cấu hình thanh toán PayOS
Để kết nối luồng thanh toán thực tế, vui lòng tạo tài khoản trên [PayOS](https://payos.vn/) và cập nhật các khóa API vào file `backend/.env`:
```env
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key
```
*(Để test Webhook cập nhật hóa đơn tự động khi chạy ở máy local, bạn cần dùng ngrok `ngrok http 5000` và điền URL webhook vào Dashboard của PayOS).*

---
**Dự án được xây dựng bởi CNPM_Nhom1.**
