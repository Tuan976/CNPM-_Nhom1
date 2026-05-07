# MediCheck AI - Hệ thống Tra cứu Tương tác Thuốc & Bệnh nền

Hệ thống Fullstack chuyên nghiệp dành cho bác sĩ và dược sĩ để kiểm tra tương tác thuốc và bệnh nền, đảm bảo an toàn trong điều trị.

## 🚀 Công nghệ sử dụng
- **Backend**: Flask (Python 3.12), SQLAlchemy, JWT, Flask-RESTx (Swagger).
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide Icons.
- **Database**: MySQL 8.0.
- **DevOps**: Docker, Docker Compose.

## 🛠 Hướng dẫn cài đặt nhanh (DOCKER)

Đây là cách nhanh nhất để chạy toàn bộ hệ thống (bao gồm Database, Backend và Frontend).

1. **Yêu cầu**: Cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. **Khởi chạy**: Tại thư mục gốc của dự án, chạy lệnh:
   ```bash
   docker-compose up --build
   ```
3. **Truy cập**:
   - Giao diện người dùng: `http://localhost:5173`
   - Tài liệu API (Swagger): `http://localhost:5000/docs`

## 💻 Hướng dẫn chạy thủ công (LOCAL)

### 1. Cấu hình Database (MySQL)
- Tạo database tên `medical_db`.
- Cấu hình file `backend/.env` (dựa trên `.env.example`).

### 2. Chạy Backend
```bash
cd backend
pip install -r requirements.txt
python seed.py  # Khởi tạo dữ liệu mẫu
python app.py
```

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Tài khoản mặc định (Sau khi chạy seed.py)
| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| **Quản trị viên** | `admin@medicheck.vn` | `admin123` |
| **Bác sĩ mẫu** | `doctor@medicheck.vn` | `doctor123` (Cần tự đăng ký) |

## 📁 Cấu trúc thư mục
- `/backend`: Mã nguồn Flask API, Models và Seeding script.
- `/frontend`: Mã nguồn React, Components và Pages.
- `docker-compose.yml`: Cấu hình container hóa toàn bộ hệ thống.

## 🌟 Tính năng chính
- ✅ Đăng nhập/Đăng ký với JWT.
- ✅ Tra cứu đa đối tượng (Chọn nhiều thuốc & bệnh cùng lúc).
- ✅ Cảnh báo màu sắc theo mức độ nghiêm trọng (SAFE, CAUTION, CONTRAINDICATED).
- ✅ Quản lý lịch sử tra cứu của bác sĩ.
- ✅ Admin Panel quản lý danh mục Thuốc, Bệnh lý và Quy tắc tương tác.
- ✅ Tài liệu API tự động sinh bởi Swagger.
