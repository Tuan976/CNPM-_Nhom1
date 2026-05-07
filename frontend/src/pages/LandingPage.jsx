import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Smartphone, LineChart, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';

const fd = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro", sans-serif' };

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: ShoppingCart,
      title: "Bán hàng thần tốc",
      desc: "Giao diện thu ngân tối giản, hỗ trợ quét mã vạch và xử lý giỏ hàng nhanh chóng chỉ trong vài giây.",
      color: "var(--bc-teal)",
      tint: "var(--bc-teal-tint)"
    },
    {
      icon: Smartphone,
      title: "Tích hợp PayOS",
      desc: "Chấp nhận thanh toán bằng mọi ngân hàng qua mã QR động PayOS. Tự động xác nhận giao dịch qua Webhook.",
      color: "var(--bc-blue)",
      tint: "var(--bc-blue-tint)"
    },
    {
      icon: Star,
      title: "Khách hàng Loyalty",
      desc: "Quản lý khách hàng thân thiết, tích điểm tự động và quy đổi điểm thành chiết khấu cho lần mua sau.",
      color: "var(--bc-orange)",
      tint: "var(--bc-orange-tint)"
    },
    {
      icon: LineChart,
      title: "Phân tích Real-time",
      desc: "Báo cáo doanh thu, lợi nhuận, và theo dõi top sản phẩm bán chạy nhất bằng biểu đồ trực quan, sinh động.",
      color: "var(--bc-coral)",
      tint: "var(--bc-coral-tint)"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={fb}>
      {/* ── HEADER ── */}
      <header className="absolute top-0 w-full px-8 py-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
               style={{ background: 'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))', boxShadow: 'var(--bc-shadow-blue)' }}>
            M
          </div>
          <h1 className="text-2xl font-bold leading-none" style={{ ...fd, color: 'var(--bc-ink-900)', letterSpacing: '-0.03em' }}>
            Mini<span style={{ color: 'var(--bc-coral)' }}>Mart</span>
          </h1>
        </div>
        <button onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-full text-[14px] font-bold text-white transition-all hover:scale-105"
          style={{ background: 'var(--bc-ink-900)', boxShadow: '0 8px 20px rgba(14,21,48,0.2)' }}>
          Đăng nhập hệ thống
        </button>
      </header>

      {/* ── HERO SECTION ── */}
      <main className="flex-1 flex flex-col justify-center relative overflow-hidden pt-20 pb-20">
        
        {/* Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-40"
             style={{ background: 'radial-gradient(circle, var(--bc-blue-tint) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-40"
             style={{ background: 'radial-gradient(circle, var(--bc-teal-tint) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 w-full relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-slate-200 bg-white shadow-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                <Zap size={12} fill="currentColor" />
              </span>
              <span className="text-[12px] font-bold text-slate-700">Phiên bản 2.0 đã ra mắt với PayOS Checkout</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6" style={{ ...fd, color: 'var(--bc-ink-900)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              Giải pháp POS hoàn hảo cho <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, var(--bc-blue), var(--bc-teal))' }}>
                Siêu thị hiện đại
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10" style={{ lineHeight: 1.6 }}>
              Hệ thống bán hàng cực mượt, tích hợp thanh toán mã QR động tự động nhận diện và quản lý khách hàng thân thiết thông minh.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-[16px] font-bold text-white transition-all hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, var(--bc-blue), var(--bc-blue-700))', boxShadow: 'var(--bc-shadow-blue)' }}>
                Bắt đầu kinh doanh ngay <ArrowRight size={20} />
              </button>
              <a href="https://payos.vn/" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-[16px] font-bold transition-all hover:-translate-y-1 bg-white border border-slate-200"
                style={{ color: 'var(--bc-ink-700)', boxShadow: 'var(--bc-shadow-1)' }}>
                <ShieldCheck size={20} className="text-emerald-500" /> Được bảo mật bởi PayOS
              </a>
            </div>
          </motion.div>

          {/* ── FEATURES GRID ── */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 text-left">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl transition-all hover:-translate-y-2 group"
                   style={{ boxShadow: 'var(--bc-shadow-1)', border: '1px solid var(--bc-ink-100)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                     style={{ background: f.tint }}>
                  <f.icon size={28} style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ ...fd, color: 'var(--bc-ink-900)' }}>{f.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="pt-16 pb-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16 text-left">
            
            {/* Cột 1: Thông tin chung */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                     style={{ background: 'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))' }}>
                  M
                </div>
                <h2 className="text-xl font-bold" style={{ ...fd, color: 'var(--bc-ink-900)' }}>
                  MiniMart
                </h2>
              </div>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                Giải pháp phần mềm quản lý điểm bán hàng chuyên nghiệp, nhanh chóng và tối ưu hóa trải nghiệm khách hàng cho chuỗi siêu thị.
              </p>
            </div>

            {/* Cột 2: Sản phẩm */}
            <div>
              <h4 className="text-[14px] font-bold mb-4" style={{ color: 'var(--bc-ink-900)' }}>Sản phẩm</h4>
              <ul className="space-y-3 text-[13px] text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tính năng POS</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Quản lý Kho</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Khách hàng thân thiết</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tích hợp PayOS</a></li>
              </ul>
            </div>

            {/* Cột 3: Pháp lý (Điều khoản) */}
            <div>
              <h4 className="text-[14px] font-bold mb-4" style={{ color: 'var(--bc-ink-900)' }}>Pháp lý & Điều khoản</h4>
              <ul className="space-y-3 text-[13px] text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Chính sách hoàn tiền</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Giải quyết khiếu nại</a></li>
              </ul>
            </div>

            {/* Cột 4: Liên hệ */}
            <div>
              <h4 className="text-[14px] font-bold mb-4" style={{ color: 'var(--bc-ink-900)' }}>Liên hệ</h4>
              <ul className="space-y-3 text-[13px] text-slate-500 font-medium">
                <li>Hotline: 1800-xxxx-xxxx</li>
                <li>Email: hotro@minimart.vn</li>
                <li>Địa chỉ: Khu Công nghệ cao, TP. Thủ Đức, TP.HCM</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-slate-400 text-[13px] font-medium">
            <p>© 2026 MiniMart POS System. Phát triển bởi CNPM_Nhom1.</p>
            <p>Hệ thống được thiết kế với giao diện Premium Tech.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
