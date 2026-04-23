import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle, Sun, Moon, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-500 overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex-1 flex flex-row w-full h-full min-h-screen">
        {/* Left panel - Decorative */}
        <div className="hidden lg:flex flex-[0.8] bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[140px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400 rounded-full blur-[120px]" />
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-20 group w-fit">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
                <Activity size={28} className="text-white" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">MediCheck AI</span>
            </Link>
            
            <h2 className="text-6xl font-bold text-white leading-tight mb-8">
              Chào mừng<br />trở lại,<br /><span className="text-blue-300 italic">Bác sĩ.</span>
            </h2>
          </div>

          <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white">
                  <Activity size={32} />
              </div>
              <div>
                  <p className="text-white font-bold text-lg">Hệ thống an toàn</p>
                  <p className="text-white/60 text-sm">Mã hóa dữ liệu 256-bit</p>
              </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="flex-1 flex flex-col relative overflow-y-auto dark:bg-slate-950 bg-white">
          <header className="p-8 flex justify-between items-center sticky top-0 dark:bg-slate-950/80 bg-white/80 backdrop-blur-md z-20">
              <Link to="/" className="text-slate-400 hover:text-blue-500 flex items-center gap-2 text-sm font-medium transition-colors">
                  <ChevronLeft size={18} /> Trang chủ
              </Link>
              <button onClick={toggleTheme} className="p-3 rounded-2xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 shadow-sm transition-transform active:scale-90">
                  {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
              </button>
          </header>

          <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md space-y-10">
              <div className="space-y-2 text-center">
                <h1 className="text-4xl font-bold dark:text-white text-slate-900 tracking-tight">Đăng nhập</h1>
                <p className="dark:text-slate-400 text-slate-500 font-medium">Chào mừng bạn trở lại</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-4 flex items-center gap-3 text-sm">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="bacsi@medicheck.vn" required className="w-full py-4 pl-14 pr-6 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required className="w-full py-4 pl-14 pr-12 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Quên mật khẩu?</a>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-50">
                  {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
                </button>
              </form>

              <div className="text-center pt-4">
                <p className="dark:text-slate-500 text-slate-500">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
