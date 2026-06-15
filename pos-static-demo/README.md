# MINI MART POS - BẢN DEMO TĨNH (STATIC DEMO)

Đây là bản mô phỏng giao diện tĩnh chạy hoàn toàn trên trình duyệt (client-side) dành cho đồ án môn học. Bản này không cần cài đặt máy chủ, cơ sở dữ liệu hay NodeJS.

## Hướng dẫn sử dụng
1. Click đúp chuột vào file `index.html` trong thư mục này để mở trực tiếp bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari).
2. Trình duyệt sẽ tự động tải thư viện React, Tailwind CSS và render ra toàn bộ giao diện giống 100% như hệ thống thật.

## Các chức năng tương tác có sẵn trong bản Demo:
* **Màn hình bán hàng POS:**
  * Chọn các sản phẩm (tự động cộng dồn số lượng, kiểm tra giới hạn tồn kho).
  * Điều chỉnh số lượng hoặc xóa sản phẩm khỏi giỏ hàng.
  * Tìm kiếm sản phẩm theo Tên, Mã vạch hoặc Nhóm ngành hàng.
  * Nhập mã giảm giá thử nghiệm: `KM10` (giảm 10%), `KM20` (giảm 20%).
  * Tra cứu khách hàng theo SĐT (ví dụ: `0987654321` hoặc `0912345678`). Tự động nhận diện điểm tích lũy và cập nhật hạng. Đăng ký khách hàng mới trực tiếp nếu chưa có trong dữ liệu.
* **Quy trình thanh toán (PayOS QR):**
  * Ấn nút thanh toán sẽ hiển thị Pop-up thanh toán VietQR động kèm thông tin cụ thể của đơn hàng.
  * Ấn "Xác nhận đã chuyển khoản" để chuyển sang màn hình **In hóa đơn bán lẻ** (Simulated Receipt) thiết kế chuẩn mẫu in hóa đơn nhiệt siêu thị. Điểm tích lũy của khách hàng sẽ được tự động cộng và trừ tồn kho trực tiếp trong bộ nhớ đệm (React state).
* **Tổng quan doanh thu (Dashboard):**
  * Hiển thị các ô chỉ số thống kê (Doanh thu, Giao dịch, Sản phẩm, Thành viên).
  * Biểu đồ doanh thu hàng tuần dạng cột tương tác (hover chuột để hiển thị doanh thu cụ thể của từng ngày).
  * Nhật ký hoạt động gần đây của hệ thống.
* **Danh mục sản phẩm:**
  * Bảng dữ liệu sản phẩm trong kho (Tên, mã vạch, đơn vị, giá nhập, giá bán, tồn kho).
  * Có nút "Thêm sản phẩm" hoạt động đầy đủ, cho phép điền biểu mẫu để nạp trực tiếp sản phẩm mới vào bảng.
* **Khách hàng thành viên:**
  * Danh sách thành viên cùng số điện thoại, điểm tích lũy và tự động xếp hạng thành viên (Vàng, Bạc, Đồng) dựa trên điểm tích lũy.
  * Biểu mẫu đăng ký thành viên mới hoạt động trực tiếp.
