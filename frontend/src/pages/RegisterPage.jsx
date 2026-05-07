import React, { useState } from 'react';
import { ShoppingCart, Lock, User, ArrowRight, UserPlus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const fontDisplay = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
const fontBody    = { fontFamily: '"Be Vietnam Pro", sans-serif' };

export default function RegisterPage() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username: username,
        password: password,
        full_name: fullname,
        role: 'admin' // Mặc định admin
      });
      if (res.status === 201) {
        alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Đã có lỗi xảy ra khi đăng ký');
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg min-h-screen flex items-center justify-center p-6" style={fontBody}>
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration: 0.42, ease: [0.22,1,0.36,1] }}
          className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: 'var(--bc-shadow-4)' }}>

          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center"
               style={{ background: 'linear-gradient(160deg, var(--bc-blue-tint) 0%, #fff 100%)', borderBottom: '1px solid var(--bc-ink-100)' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg,var(--bc-teal),var(--bc-blue-700))', boxShadow: 'var(--bc-shadow-blue)' }}>
              <UserPlus size={26} />
            </div>
            <h1 className="text-2xl font-bold leading-none mb-2"
                style={{ ...fontDisplay, color: 'var(--bc-ink-900)', letterSpacing: '-0.04em' }}>
              Tạo tài khoản mới
            </h1>
            <p className="text-[11px] font-medium" style={{ color: 'var(--bc-ink-300)', letterSpacing: '0.1em' }}>
              MINIMART POS SYSTEM
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
            {error && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                className="px-4 py-3 rounded-2xl text-[12px] font-semibold text-center"
                style={{ ...fontBody, background: 'var(--bc-coral-tint)', color: 'var(--bc-coral-700)', border: '1px solid rgba(255,107,94,0.2)' }}>
                {error}
              </motion.div>
            )}

            {[
              { label: 'Họ và tên',     type: 'text',     val: fullname, set: setFullname, icon: FileText, placeholder: 'Nguyễn Văn A' },
              { label: 'Tên đăng nhập', type: 'text',     val: username, set: setUsername, icon: User,     placeholder: 'admin2' },
              { label: 'Mật khẩu',      type: 'password', val: password, set: setPassword, icon: Lock,     placeholder: '••••••' },
            ].map(({ label, type, val, set, icon: Icon, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-[11px] font-semibold block ml-1"
                       style={{ ...fontBody, color: 'var(--bc-ink-500)', letterSpacing: '0.05em' }}>
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2" size={16}
                        style={{ color: 'var(--bc-ink-300)' }} />
                  <input type={type} value={val} onChange={e => set(e.target.value)}
                    placeholder={placeholder} required
                    className="w-full rounded-2xl text-[14px] font-medium outline-none transition-all"
                    style={{
                      ...fontBody,
                      paddingLeft: 44, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
                      background: 'var(--bc-bg-soft)',
                      border: '2px solid var(--bc-ink-100)',
                      color: 'var(--bc-ink-900)',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--bc-blue)'; e.target.style.background = 'white'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--bc-ink-100)'; e.target.style.background = 'var(--bc-bg-soft)'; }}
                  />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full rounded-2xl text-white text-[13px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2.5 mt-2"
              style={{
                ...fontBody,
                padding: '14px 24px',
                background: 'linear-gradient(135deg,var(--bc-teal),var(--bc-blue-700))',
                boxShadow: 'var(--bc-shadow-3)',
                letterSpacing: '0.02em',
              }}>
              {loading ? 'Đang tạo tài khoản...' : (<>Đăng ký ngay <ArrowRight size={16} /></>)}
            </button>

            <div className="text-center mt-6">
              <span className="text-[12px] font-medium text-slate-500">Đã có tài khoản? </span>
              <button type="button" onClick={() => navigate('/login')} className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Đăng nhập
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
