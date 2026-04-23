# Website Tra Cứu Tương Tác Thuốc – Bệnh (MediCheck AI)

Hệ thống tra cứu chuyên nghiệp dành cho phòng khám, tích hợp AI để phân tích tương tác thuốc và bệnh lý.

## Tính năng chính
- **Tra cứu thuốc**: Chỉ định, chống chỉ định, liều dùng, tác dụng phụ.
- **Tra cứu bệnh**: Mô tả bệnh lý, triệu chứng.
- **Kiểm tra tương tác**: Tương tác Thuốc-Thuốc, Thuốc-Bệnh.
- **Trợ lý AI**: Tích hợp Gemini Pro để trả lời các câu hỏi y khoa phức tạp.

## Công nghệ sử dụng
- **Backend**: Flask (Python), SQLAlchemy.
- **Frontend**: React (Vite), TailwindCSS, Lucide React, Framer Motion.
- **Database**: MySQL.
- **AI**: Google Gemini API.

## Hướng dẫn cài đặt

### 1. Database (MySQL)
- Tạo database tên `medical_db`.
- Chạy các lệnh SQL trong file `backend/schema.sql` để tạo bảng và dữ liệu mẫu.

### 2. Backend (Flask)
- Di chuyển vào thư mục `backend`.
- Cài đặt thư viện: `pip install -r requirements.txt`.
- Tạo file `.env` từ `.env.example` và điền `GENAI_API_KEY` (Gemini API Key).
- Cập nhật thông tin kết nối database trong `app.py` (dòng 15).
- Chạy backend: `python app.py`.

### 3. Frontend (React)
- Di chuyển vào thư mục `frontend`.
- Cài đặt dependencies: `npm install`.
- Chạy frontend: `npm run dev`.

## Cấu trúc thư mục
- `/backend`: Mã nguồn Flask API và Database Schema.
- `/frontend`: Mã nguồn React UI và các components.
