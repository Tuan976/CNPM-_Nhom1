import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import { Activity, Mail, Lock, User, Eye, EyeOff, AlertCircle, Sun, Moon, Stethoscope, Pill, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', role: 'doctor' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-500 overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex-1 flex flex-row w-full h-full min-h-screen">
        {/* Left panel - Decorative */}
        <div className="hidden lg:flex flex-[0.8] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-20 group w-fit">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform">
                <Activity size={28} className="text-white" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">MediCheck AI</span>
            </Link>
            
            <h2 className="text-5xl font-bold text-white leading-[1.2] mb-8">
              Nền tảng hỗ trợ<br />quyết định y khoa<br /><span className="text-cyan-300">chính xác nhất.</span>
            </h2>
            
            <div className="space-y-6">
              {[
                { t: 'Tra cứu ICD-10 chuẩn hóa', d: 'Dữ liệu bệnh lý cập nhật theo WHO.' },
                { t: 'Cảnh báo tương tác thời gian thực', d: 'Phân tích đa chiều thuốc và bệnh lý.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 bg-white/10 p-1.5 rounded-full h-fit"><Activity size={18} className="text-cyan-300" /></div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.t}</h4>
                    <p className="text-blue-100/70 text-sm">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
            <p className="text-white/80 italic text-lg leading-relaxed">"Giao diện hiện đại và tốc độ tra cứu đáng kinh ngạc."</p>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="flex-1 flex flex-col relative overflow-y-auto dark:bg-slate-950 bg-white">
          <header className="p-8 flex justify-between items-center sticky top-0 dark:bg-slate-950/80 bg-white/80 backdrop-blur-md z-20">
              <Link to="/" className="text-slate-400 hover:text-blue-500 flex items-center gap-2 text-sm font-medium transition-colors">
                  <ChevronLeft size={18} /> Quay lại
              </Link>
              <button onClick={toggleTheme} className="p-3 rounded-2xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 shadow-sm transition-transform active:scale-90">
                  {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
              </button>
          </header>

          <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-xl space-y-10">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold dark:text-white text-slate-900 tracking-tight text-center">Tạo tài khoản mới</h1>
                <p className="dark:text-slate-400 text-slate-500 font-medium text-center">Bắt đầu hành trình số hóa y khoa cùng MediCheck</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 flex items-center gap-3 text-sm">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3 text-center">
                  <label className="text-sm font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest">Tôi là</label>
                  <div className="grid grid-cols-2 gap-6">
                    <button type="button" onClick={() => setForm({...form, role: 'doctor'})} 
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${form.role === 'doctor' ? 'border-blue-500 bg-blue-500/5 text-blue-500' : 'dark:border-slate-800 border-slate-100 opacity-60'}`}>
                      <Stethoscope size={28} /> <span className="font-bold text-lg">Bác sĩ</span>
                    </button>
                    <button type="button" onClick={() => setForm({...form, role: 'pharmacist'})} 
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${form.role === 'pharmacist' ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' : 'dark:border-slate-800 border-slate-100 opacity-60'}`}>
                      <Pill size={28} /> <span className="font-bold text-lg">Dược sĩ</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                    <div className="relative">
                      <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Nguyễn Văn A" required className="w-full py-4 pl-14 pr-6 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="bacsi@vinmed.vn" required className="w-full py-4 pl-14 pr-6 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required className="w-full py-4 pl-14 pr-12 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest ml-1">Xác nhận</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="••••••••" required className="w-full py-4 pl-14 pr-6 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-50">
                  {loading ? 'Đang xử lý...' : 'Kích hoạt tài khoản'}
                </button>
              </form>

              <div className="text-center pt-4">
                <p className="dark:text-slate-500 text-slate-500">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập ngay</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
