import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Pill, Stethoscope, ArrowLeftRight, Sparkles, 
  ShieldCheck, Sun, Moon, Menu, X, ChevronRight, Zap
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 mesh-gradient ${theme === 'dark' ? 'dark text-white' : 'text-slate-900'}`}>
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-500/20 animate-float">
              <Activity size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">MediCheck AI</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-bold opacity-60 hover:opacity-100 hover:text-blue-500 transition-all">
                {item.label}
              </a>
            ))}
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />
            <button onClick={toggleTheme} className="p-3 rounded-2xl bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all active:scale-90 shadow-sm">
              {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            {user ? (
              <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5">
                Vào Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-sm font-black hover:text-blue-500 transition-colors">Đăng nhập</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20">Dùng thử</Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white/10 border border-white/10">
               {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass overflow-hidden"
            >
              <div className="p-8 space-y-8">
                {navLinks.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black">
                    {item.label}
                  </a>
                ))}
                <div className="h-[1px] bg-white/10 w-full" />
                {user ? (
                  <Link to="/dashboard" className="block w-full bg-blue-600 text-white text-center py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-500/20">Vào Dashboard</Link>
                ) : (
                  <div className="space-y-6">
                    <Link to="/login" className="block text-center font-black text-xl">Đăng nhập</Link>
                    <Link to="/register" className="block w-full bg-blue-600 text-white text-center py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-500/20">Bắt đầu ngay</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 overflow-hidden px-6">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 animate-pulse-slow" />
        <div className="container mx-auto relative z-10 text-center space-y-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-black uppercase tracking-[0.2em] mb-10">
              <Zap size={14} /> Kỷ nguyên y tế thông minh
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-10">
              Kê đơn an toàn hơn với<br />
              <span className="bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                Trí tuệ Nhân tạo.
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-60 max-w-3xl mx-auto leading-relaxed font-medium">
              Giải pháp tối ưu hỗ trợ bác sĩ và dược sĩ phát hiện tức thì các tương tác thuốc nguy hiểm và chống chỉ định bệnh lý chỉ trong vài giây.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10"
          >
            <Link to="/register" className="group relative bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                Bắt đầu ngay miễn phí <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <a href="#features" className="px-10 py-6 rounded-[2rem] border-2 border-slate-300 dark:border-slate-800 font-black text-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
              Tìm hiểu thêm
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 container mx-auto px-6 scroll-mt-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            { 
              title: 'Tra cứu đa dạng', 
              desc: 'Tìm kiếm theo tên biệt dược hoặc hoạt chất Generic chuẩn xác với dữ liệu từ Dược thư quốc gia.', 
              icon: <Pill size={32} className="text-blue-500" />,
              color: 'blue'
            },
            { 
              title: 'Chuẩn hóa ICD-10', 
              desc: 'Dữ liệu bệnh lý được phân loại theo mã ICD-10 quốc tế, giúp chẩn đoán và kiểm tra chống chỉ định chính xác.', 
              icon: <Stethoscope size={32} className="text-emerald-500" />,
              color: 'emerald'
            },
            { 
              title: 'Gợi ý thay thế', 
              desc: 'Tự động gợi ý thuốc an toàn hơn trong cùng nhóm dược lý khi phát hiện tương tác không mong muốn.', 
              icon: <ArrowLeftRight size={32} className="text-orange-500" />,
              color: 'orange'
            }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="glass-card p-12 group"
            >
               <div className={`mb-8 bg-${f.color}-500/10 w-20 h-20 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                {f.icon}
               </div>
               <h3 className="text-3xl font-black mb-6">{f.title}</h3>
               <p className="text-lg opacity-60 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
