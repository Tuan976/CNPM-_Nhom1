import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import { 
  Activity, Pill, Stethoscope, ArrowLeftRight, Sparkles, 
  ShieldCheck, Sun, Moon, Menu, X
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tính năng', href: '#features' },
    { label: 'Giải pháp', href: '#solutions' },
    { label: 'Về chúng tôi', href: '#about' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 scroll-smooth ${theme === 'dark' ? 'dark bg-slate-950' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className="fixed w-full z-50 dark:bg-slate-950/80 bg-white/80 backdrop-blur-xl border-b dark:border-slate-800 border-slate-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Activity size={24} />
            </div>
            <span className="text-xl font-bold dark:text-white text-slate-900 tracking-tight">MediCheck AI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium dark:text-slate-400 text-slate-500 hover:text-blue-500 transition-colors">
                {item.label}
              </a>
            ))}
            <div className="h-4 w-[1px] dark:bg-slate-800 bg-slate-200" />
            <button onClick={toggleTheme} className="p-2 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 transition-transform active:scale-90">
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
            {user ? (
              <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:shadow-lg">
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold dark:text-white text-slate-900">Đăng nhập</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all">Dùng thử</Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-xl dark:bg-slate-900 bg-slate-100">
               {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            <button className="p-2 dark:text-white text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden dark:bg-slate-900 bg-white border-b dark:border-slate-800 border-slate-100 p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold dark:text-white text-slate-900">
                {item.label}
              </a>
            ))}
            <hr className="dark:border-slate-800 border-slate-100" />
            {user ? (
              <Link to="/dashboard" className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-bold">Vào Dashboard</Link>
            ) : (
              <div className="space-y-4">
                <Link to="/login" className="block text-center font-bold dark:text-white text-slate-900">Đăng nhập</Link>
                <Link to="/register" className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-bold">Bắt đầu ngay</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 overflow-hidden px-6">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="container mx-auto relative z-10 text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold dark:text-white text-slate-900 leading-tight tracking-tighter">
            Kê đơn an toàn hơn với<br /><span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent italic">Trí tuệ Nhân tạo.</span>
          </h1>
          <p className="text-xl dark:text-slate-400 text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Phát hiện tức thì các tương tác thuốc nguy hiểm và chống chỉ định bệnh lý chỉ trong vài giây.
          </p>
          <div className="pt-8">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-blue-500/30">
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 container mx-auto px-6 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'Tra cứu đa dạng', desc: 'Tìm kiếm theo tên biệt dược hoặc hoạt chất Generic chuẩn xác.', icon: <Pill className="text-blue-500" /> },
            { title: 'Chuẩn hóa ICD-10', desc: 'Dữ liệu bệnh lý được phân loại theo mã ICD-10 quốc tế.', icon: <Stethoscope className="text-emerald-500" /> },
            { title: 'Gợi ý thay thế', desc: 'Tự động gợi ý thuốc an toàn hơn trong cùng nhóm dược lý.', icon: <ArrowLeftRight className="text-orange-500" /> }
          ].map((f, i) => (
            <div key={i} className="p-10 rounded-[3rem] dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-100 shadow-xl dark:shadow-none hover:border-blue-500 transition-all duration-300">
               <div className="mb-6 bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center">{f.icon}</div>
               <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-4">{f.title}</h3>
               <p className="dark:text-slate-400 text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
