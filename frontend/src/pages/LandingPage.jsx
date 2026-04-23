import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import {
  Pill, Stethoscope, ArrowLeftRight, Sparkles, ShieldCheck,
  Users, ChevronRight, Heart, Activity, Menu, X, Sun, Moon
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const features = [
    { icon: <Pill size={28} />, title: 'Tra cứu thuốc', desc: 'Thông tin đầy đủ về chỉ định, chống chỉ định, liều dùng và tác dụng phụ của hàng nghìn loại thuốc.', color: 'from-blue-500 to-cyan-500' },
    { icon: <Stethoscope size={28} />, title: 'Tra cứu bệnh lý', desc: 'Mô tả chi tiết các bệnh lý thường gặp, triệu chứng nhận biết và hướng điều trị phù hợp.', color: 'from-emerald-500 to-teal-500' },
    { icon: <ArrowLeftRight size={28} />, title: 'Kiểm tra tương tác', desc: 'Phát hiện nhanh tương tác nguy hiểm giữa thuốc với thuốc hoặc thuốc với bệnh lý.', color: 'from-orange-500 to-rose-500' },
    { icon: <Sparkles size={28} />, title: 'Trợ lý AI', desc: 'Tích hợp trí tuệ nhân tạo tiên tiến để tư vấn và phân tích các câu hỏi y tế phức tạp.', color: 'from-purple-500 to-pink-500' },
  ];

  const stats = [
    { value: '1,200+', label: 'Loại thuốc', icon: <Pill size={20} /> },
    { value: '850+', label: 'Bệnh lý', icon: <Heart size={20} /> },
    { value: '5,000+', label: 'Người dùng', icon: <Users size={20} /> },
    { value: '99.9%', label: 'Độ chính xác', icon: <ShieldCheck size={20} /> },
  ];

  const steps = [
    { num: '01', title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí trong vài giây với email của bạn.' },
    { num: '02', title: 'Tra cứu thông tin', desc: 'Tìm kiếm thuốc, bệnh lý hoặc kiểm tra tương tác thuốc nhanh chóng.' },
    { num: '03', title: 'Nhận phân tích AI', desc: 'Đặt câu hỏi chuyên sâu và nhận tư vấn từ trợ lý AI y tế thông minh.' },
  ];

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-white transition-colors duration-300 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 dark:bg-slate-950/90 bg-white/90 backdrop-blur-xl dark:border-slate-800 border-slate-200 border-b transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl">
              <Activity size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold dark:text-white text-slate-800">
              MediCheck <span className="text-blue-500">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="dark:text-slate-400 text-slate-500 hover:text-blue-500 dark:hover:text-white transition-colors text-sm font-medium">Tính năng</a>
            <a href="#how-it-works" className="dark:text-slate-400 text-slate-500 hover:text-blue-500 dark:hover:text-white transition-colors text-sm font-medium">Cách dùng</a>
            <a href="#stats" className="dark:text-slate-400 text-slate-500 hover:text-blue-500 dark:hover:text-white transition-colors text-sm font-medium">Thống kê</a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className="p-2.5 rounded-xl dark:border-slate-700 border-slate-200 border dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all"
              title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}>
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>

            {user ? (
              <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ml-1">
                Vào hệ thống →
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')}
                  className="dark:text-slate-300 text-slate-600 hover:text-blue-500 px-4 py-2 rounded-xl font-medium transition-colors text-sm">
                  Đăng nhập
                </button>
                <button onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all text-sm">
                  Đăng ký miễn phí
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg dark:bg-slate-800 bg-slate-100">
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
            <button className="dark:text-slate-400 text-slate-600 p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-200 border-t px-6 py-4 space-y-3">
            <button onClick={() => navigate('/login')} className="block w-full text-left dark:text-slate-300 text-slate-600 py-2">Đăng nhập</button>
            <button onClick={() => navigate('/register')} className="block w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold">Đăng ký</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 border dark:text-blue-400 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles size={14} /> Tích hợp AI tiên tiến nhất 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 dark:text-white text-slate-900">
            Tra cứu thuốc &<br />
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Tương tác bệnh lý
            </span>
            <br />thông minh
          </h1>

          <p className="dark:text-slate-400 text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Hệ thống tra cứu dược phẩm chuyên nghiệp dành cho phòng khám và bệnh viện.
            Kết hợp dữ liệu y tế chuẩn với trí tuệ nhân tạo để hỗ trợ quyết định lâm sàng.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Bắt đầu miễn phí <ChevronRight size={20} />
            </button>
            <button onClick={() => navigate('/login')}
              className="dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 dark:hover:border-slate-500 hover:border-slate-400 border px-8 py-4 rounded-2xl font-semibold text-lg transition-all">
              Đăng nhập
            </button>
          </div>

          {/* Demo preview */}
          <div className="mt-16 dark:bg-slate-900/60 bg-slate-50 dark:border-slate-700/50 border-slate-200 border rounded-3xl p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="dark:text-slate-500 text-slate-400 text-xs ml-2">MediCheck AI — Trợ lý y tế</span>
            </div>
            <div className="space-y-3 text-left">
              <div className="dark:bg-slate-800 bg-white rounded-2xl p-4 max-w-xs border dark:border-slate-700 border-slate-200">
                <p className="dark:text-slate-300 text-slate-700 text-sm">Ibuprofen có tương tác với bệnh dạ dày không?</p>
              </div>
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 ml-auto max-w-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-blue-400" />
                  <span className="text-blue-400 text-xs font-bold">MediCheck AI</span>
                </div>
                <p className="dark:text-slate-200 text-slate-700 text-sm leading-relaxed">
                  ⚠️ <strong>Tương tác mức độ CAO</strong>: Ibuprofen (NSAID) làm trầm trọng thêm viêm loét và có thể gây <strong>xuất huyết dạ dày</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6 dark:border-slate-800 border-slate-200 border-y transition-colors">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-500 mb-2">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 mb-1">{s.value}</div>
              <div className="dark:text-slate-500 text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 mb-4">Tính năng nổi bật</h2>
            <p className="dark:text-slate-400 text-slate-600 text-lg max-w-xl mx-auto">Đầy đủ công cụ cần thiết để hỗ trợ quyết định điều trị an toàn và hiệu quả</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group dark:bg-slate-900/50 bg-white dark:border-slate-800 border-slate-200 hover:border-blue-300 dark:hover:border-slate-600 border rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className={`bg-gradient-to-br ${f.color} p-3 rounded-2xl w-fit mb-6 text-white`}>{f.icon}</div>
                <h3 className="text-xl font-bold dark:text-white text-slate-800 mb-3">{f.title}</h3>
                <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 dark:bg-slate-900/30 bg-slate-50 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 mb-4">Cách sử dụng</h2>
            <p className="dark:text-slate-400 text-slate-600 text-lg">Chỉ 3 bước để bắt đầu tra cứu thông tin y tế</p>
          </div>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl dark:bg-blue-600/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 border flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-lg">{step.num}</span>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold dark:text-white text-slate-800 mb-2">{step.title}</h3>
                  <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center dark:bg-blue-600/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 border rounded-3xl p-12">
          <ShieldCheck size={48} className="text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="dark:text-slate-400 text-slate-600 text-lg mb-8">Đăng ký miễn phí ngay hôm nay và trải nghiệm hệ thống tra cứu y tế thông minh nhất.</p>
          <button onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1">
            Đăng ký miễn phí →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="dark:border-slate-800 border-slate-200 border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-1.5 rounded-lg">
              <Activity size={16} className="text-white" />
            </div>
            <span className="dark:text-slate-400 text-slate-500 text-sm">MediCheck AI © 2026</span>
          </div>
          <p className="dark:text-slate-600 text-slate-400 text-xs text-center">Hệ thống chỉ hỗ trợ tra cứu thông tin. Không thay thế chẩn đoán và điều trị của bác sĩ.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
