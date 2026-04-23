import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import { Activity, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        full_name: form.full_name, email: form.email, password: form.password
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = ['Tra cứu không giới hạn', 'Lịch sử tìm kiếm cá nhân', 'Trợ lý AI y tế 24/7', 'Cập nhật dữ liệu tự động'];

  return (
    <div className="min-h-screen flex dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/20 p-2.5 rounded-xl"><Activity size={24} className="text-white" /></div>
            <span className="text-white font-bold text-xl">MediCheck AI</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Tham gia cùng<br />5,000+ người dùng<br />tin tưởng
          </h2>
          <p className="text-emerald-200 text-lg leading-relaxed mb-10">
            Đăng ký miễn phí và bắt đầu tra cứu thông tin thuốc, bệnh lý một cách nhanh chóng và chính xác.
          </p>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-300 flex-shrink-0" />
                <span className="text-emerald-100">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative bg-white/10 rounded-2xl p-6">
          <p className="text-emerald-100 italic text-sm leading-relaxed">"MediCheck AI giúp chúng tôi kiểm tra tương tác thuốc nhanh hơn 10 lần so với tra cứu thủ công."</p>
          <p className="text-emerald-300 text-sm font-semibold mt-3">— BS. Nguyễn Minh Tuấn, Trưởng khoa Dược</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-xl border transition-all dark:border-slate-700 border-slate-200 dark:bg-slate-800 bg-white dark:hover:bg-slate-700 hover:bg-slate-100"
          title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}>
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
        </button>

        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl"><Activity size={20} className="text-white" /></div>
            <span className="font-bold text-lg dark:text-white text-slate-800">MediCheck AI</span>
          </div>

          <h1 className="text-3xl font-bold dark:text-white text-slate-900 mb-2">Tạo tài khoản</h1>
          <p className="dark:text-slate-400 text-slate-500 mb-8">Miễn phí, không cần thẻ tín dụng</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 mb-6">
              <AlertCircle size={18} /><span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="dark:text-slate-400 text-slate-600 text-sm font-medium block mb-2">Họ và tên</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
                <input id="register-name" type="text" value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Nguyễn Văn A" required
                  className="w-full dark:bg-slate-900 bg-white dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 pl-12 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-emerald-500 transition-colors dark:placeholder-slate-600 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="dark:text-slate-400 text-slate-600 text-sm font-medium block mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
                <input id="register-email" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" required
                  className="w-full dark:bg-slate-900 bg-white dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 pl-12 pr-4 py-3.5 rounded-xl border focus:outline-none focus:border-emerald-500 transition-colors dark:placeholder-slate-600 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="dark:text-slate-400 text-slate-600 text-sm font-medium block mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
                <input id="register-password" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự" required
                  className="w-full dark:bg-slate-900 bg-white dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 pl-12 pr-12 py-3.5 rounded-xl border focus:outline-none focus:border-emerald-500 transition-colors dark:placeholder-slate-600 placeholder-slate-400"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 hover:text-blue-500">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : 'dark:bg-slate-700 bg-slate-200'} transition-all`} />
                    ))}
                  </div>
                  <p className="text-xs dark:text-slate-500 text-slate-400 mt-1">Độ mạnh: {strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="dark:text-slate-400 text-slate-600 text-sm font-medium block mb-2">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" />
                <input id="register-confirm" type="password" value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Nhập lại mật khẩu" required
                  className={`w-full dark:bg-slate-900 bg-white dark:text-white text-slate-900 pl-12 pr-4 py-3.5 rounded-xl border focus:outline-none transition-colors dark:placeholder-slate-600 placeholder-slate-400 ${
                    form.confirm && form.confirm !== form.password ? 'border-red-500' : 'dark:border-slate-700 border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            <button type="submit" id="register-submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25 mt-2">
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí'}
            </button>
          </form>

          <p className="text-center dark:text-slate-500 text-slate-500 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">Đăng nhập</Link>
          </p>
          <p className="text-center mt-4">
            <Link to="/" className="dark:text-slate-600 text-slate-400 hover:text-blue-500 text-sm transition-colors">← Về trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
