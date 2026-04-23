import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle, Sun, Moon } from 'lucide-react';
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
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/20 p-2.5 rounded-xl"><Activity size={24} className="text-white" /></div>
            <span className="text-white font-bold text-xl">MediCheck AI</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Tra cứu thuốc<br />thông minh hơn<br />với AI
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Hệ thống tra cứu dược phẩm chuyên nghiệp, hỗ trợ phát hiện tương tác thuốc nguy hiểm trong tích tắc.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {[{ val: '1,200+', label: 'Loại thuốc' }, { val: '850+', label: 'Bệnh lý' }, { val: '24/7', label: 'Hỗ trợ AI' }, { val: '99.9%', label: 'Chính xác' }].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-4">
              <div className="text-white font-bold text-xl">{s.val}</div>
              <div className="text-blue-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-xl border transition-all dark:border-slate-700 border-slate-200 dark:bg-slate-800 bg-white dark:hover:bg-slate-700 hover:bg-slate-100"
          title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}>
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
        </button>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl"><Activity size={20} className="text-white" /></div>
            <span className="font-bold text-lg dark:text-white text-slate-800">MediCheck AI</span>
          </div>

          <h1 className="text-3xl font-bold dark:text-white text-slate-900 mb-2">Chào mừng trở lại</h1>
          <p className="dark:text-slate-400 text-slate-500 mb-8">Đăng nhập để tiếp tục sử dụng hệ thống</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 mb-6">
              <AlertCircle size={18} /><span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="dark:text-slate-400 text-slate-600 text-sm font-medium block mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
                <input
                  id="login-email" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" required
                  className="w-full dark:bg-slate-900 bg-white dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 pl-12 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-blue-500 transition-colors dark:placeholder-slate-600 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="dark:text-slate-400 text-slate-600 text-sm font-medium block mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
                <input
                  id="login-password" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="w-full dark:bg-slate-900 bg-white dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 pl-12 pr-12 py-3.5 rounded-xl border focus:outline-none focus:border-blue-500 transition-colors dark:placeholder-slate-600 placeholder-slate-400"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 hover:text-blue-500 transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" id="login-submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-4 p-4 dark:bg-slate-900 bg-slate-100 dark:border-slate-700 border-slate-200 border rounded-xl">
            <p className="dark:text-slate-500 text-slate-400 text-xs font-medium mb-1">Tài khoản demo:</p>
            <p className="dark:text-slate-400 text-slate-500 text-xs">
              Admin: <span className="text-blue-500">admin@medicheck.vn</span> / <span className="text-blue-500">admin123</span>
            </p>
          </div>

          <p className="text-center dark:text-slate-500 text-slate-500 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">Đăng ký ngay</Link>
          </p>
          <p className="text-center mt-4">
            <Link to="/" className="dark:text-slate-600 text-slate-400 hover:text-blue-500 text-sm transition-colors">← Về trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
