import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fd = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro", sans-serif' };

const LegalLayout = ({ title, lastUpdated, children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" style={fb}>
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-bold" style={{ ...fd, color: 'var(--bc-ink-900)' }}>{title}</h1>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-3xl font-extrabold mb-2" style={{ ...fd, color: 'var(--bc-ink-900)' }}>{title}</h2>
          <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">Cập nhật lần cuối: {lastUpdated}</p>
          
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
            {children}
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-[13px] border-t border-slate-200 bg-white">
        <p className="font-medium">© 2026 MiniMart POS System. Phát triển bởi CNPM_Nhom1.</p>
      </footer>
    </div>
  );
};

export const TermsOfService = () => (
  <LegalLayout title="Điều khoản dịch vụ" lastUpdated="07/05/2026">
    <h3>1. Giới thiệu</h3>
    <p>Chào mừng bạn đến với hệ thống phần mềm quản lý điểm bán hàng MiniMart POS. Bằng việc truy cập và sử dụng phần mềm, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây.</p>
    
    <h3>2. Cung cấp Dịch vụ</h3>
    <p>Chúng tôi cung cấp giải pháp quản lý bán hàng, tồn kho, báo cáo doanh thu và các tính năng tích hợp thanh toán cho các siêu thị và cửa hàng tiện lợi. Chúng tôi cam kết duy trì hệ thống hoạt động ổn định ở mức 99.9%.</p>
    
    <h3>3. Quyền và Trách nhiệm của Người dùng</h3>
    <ul>
      <li>Người dùng cam kết cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
      <li>Bảo mật tuyệt đối thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của mình.</li>
      <li>Không sử dụng phần mềm vào các mục đích vi phạm pháp luật hiện hành của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.</li>
    </ul>

    <h3>4. Thay đổi Điều khoản</h3>
    <p>MiniMart có quyền sửa đổi, cập nhật các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên hệ thống.</p>
  </LegalLayout>
);

export const PrivacyPolicy = () => (
  <LegalLayout title="Chính sách bảo mật" lastUpdated="07/05/2026">
    <h3>1. Thu thập thông tin</h3>
    <p>Chúng tôi thu thập các thông tin cơ bản của khách hàng và người dùng hệ thống bao gồm: Tên, Số điện thoại, Lịch sử mua hàng, để phục vụ cho tính năng tích điểm và báo cáo doanh thu.</p>
    
    <h3>2. Sử dụng thông tin</h3>
    <p>Thông tin của bạn được sử dụng nhằm:</p>
    <ul>
      <li>Định danh và xác thực người dùng trên hệ thống.</li>
      <li>Cải thiện và cá nhân hóa trải nghiệm sử dụng phần mềm.</li>
      <li>Xử lý và theo dõi các giao dịch thanh toán.</li>
    </ul>
    
    <h3>3. Bảo vệ dữ liệu</h3>
    <p>Tất cả dữ liệu được lưu trữ trên hệ thống đều được mã hóa bằng các tiêu chuẩn bảo mật tiên tiến nhất. Mật khẩu của bạn được băm (hash) và hoàn toàn không thể bị đảo ngược.</p>

    <h3>4. Chia sẻ thông tin</h3>
    <p>Chúng tôi cam kết không bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào, ngoại trừ các cổng thanh toán (ví dụ: PayOS) để phục vụ cho việc xử lý hóa đơn.</p>
  </LegalLayout>
);

export const RefundPolicy = () => (
  <LegalLayout title="Chính sách hoàn tiền" lastUpdated="07/05/2026">
    <h3>1. Quy định hoàn tiền</h3>
    <p>Hệ thống MiniMart POS không trực tiếp xử lý các yêu cầu hoàn tiền bán lẻ giữa cửa hàng và người tiêu dùng. Cửa hàng sử dụng phần mềm (đối tác của MiniMart) tự chịu trách nhiệm giải quyết việc đổi trả với khách mua hàng.</p>
    
    <h3>2. Hoàn tiền Gói phần mềm</h3>
    <p>Đối với khách hàng mua gói đăng ký sử dụng phần mềm MiniMart POS:</p>
    <ul>
      <li>Chúng tôi hoàn lại 100% số tiền nếu khách hàng yêu cầu hủy dịch vụ trong vòng 14 ngày đầu tiên kể từ ngày kích hoạt tài khoản.</li>
      <li>Không áp dụng hoàn tiền cho các tài khoản vi phạm Điều khoản dịch vụ.</li>
    </ul>
    
    <h3>3. Quy trình xử lý</h3>
    <p>Mọi yêu cầu hoàn tiền phải được gửi về địa chỉ email <strong>hotro@minimart.vn</strong>. Chúng tôi sẽ xử lý yêu cầu trong vòng 3-5 ngày làm việc.</p>
  </LegalLayout>
);

export const DisputeResolution = () => (
  <LegalLayout title="Giải quyết khiếu nại" lastUpdated="07/05/2026">
    <h3>1. Nguyên tắc giải quyết</h3>
    <p>MiniMart POS và Khách hàng cam kết giải quyết mọi tranh chấp, khiếu nại phát sinh từ hoặc liên quan đến quá trình sử dụng phần mềm trên tinh thần thiện chí, thương lượng và hòa giải.</p>
    
    <h3>2. Kênh tiếp nhận khiếu nại</h3>
    <p>Khách hàng có thể gửi khiếu nại thông qua các kênh sau:</p>
    <ul>
      <li>Gọi điện thoại đến Hotline: <strong>1800-xxxx-xxxx</strong></li>
      <li>Gửi email về địa chỉ: <strong>hotro@minimart.vn</strong></li>
      <li>Đến trực tiếp văn phòng tại: <strong>Khu Công nghệ cao, TP. Thủ Đức, TP.HCM</strong></li>
    </ul>
    
    <h3>3. Thời gian xử lý</h3>
    <p>Chúng tôi cam kết phản hồi khiếu nại trong vòng 24 giờ kể từ khi tiếp nhận và cung cấp giải pháp xử lý triệt để trong vòng tối đa 7 ngày làm việc.</p>
  </LegalLayout>
);
