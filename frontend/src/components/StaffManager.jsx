import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Shield, User, X, Check, Lock } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const fd = { fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro",sans-serif' };

function StaffModal({ staff, onClose, onSuccess }) {
  const isEdit = !!staff;
  const [formData, setFormData] = useState(
    staff || { username: '', full_name: '', password: '', role: 'staff' }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.full_name) {
      setError('Vui lòng điền tên đăng nhập và họ tên');
      return;
    }
    if (!isEdit && !formData.password) {
      setError('Vui lòng nhập mật khẩu cho nhân viên mới');
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/staff/${staff.id}`, formData, { headers });
      } else {
        await axios.post('http://localhost:5000/api/staff/', formData, { headers });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Đã có lỗi xảy ra');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
         style={{ background: 'rgba(14,21,48,0.5)', backdropFilter: 'blur(12px)' }}>
      <motion.div initial={{ opacity:0, scale:0.94, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.94, y:20 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-[10px] font-semibold mb-1" style={{ ...fb, color: 'var(--bc-ink-300)', letterSpacing:'0.1em' }}>QUẢN LÝ</p>
            <h3 className="text-xl font-bold" style={{ ...fd, color: 'var(--bc-ink-900)' }}>
              {isEdit ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl hover:bg-slate-50 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5" style={fb}>
          {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-[13px] font-medium">{error}</div>}
          
          <div>
            <label className="text-[12px] font-semibold block mb-2" style={{ color: 'var(--bc-ink-500)' }}>Họ và tên</label>
            <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
              placeholder="Nguyễn Văn A" className="w-full rounded-2xl text-[14px] font-medium outline-none"
              style={{ padding:'12px 16px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)' }}
              onFocus={e => e.target.style.borderColor='var(--bc-blue)'} onBlur={e => e.target.style.borderColor='var(--bc-ink-100)'} />
          </div>

          <div>
            <label className="text-[12px] font-semibold block mb-2" style={{ color: 'var(--bc-ink-500)' }}>Tên đăng nhập</label>
            <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
              disabled={isEdit}
              placeholder="nguyenvana" className="w-full rounded-2xl text-[14px] font-medium outline-none disabled:opacity-50"
              style={{ padding:'12px 16px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)' }}
              onFocus={e => e.target.style.borderColor='var(--bc-blue)'} onBlur={e => e.target.style.borderColor='var(--bc-ink-100)'} />
          </div>

          <div>
            <label className="text-[12px] font-semibold block mb-2" style={{ color: 'var(--bc-ink-500)' }}>
              {isEdit ? 'Mật khẩu mới (Bỏ trống nếu không đổi)' : 'Mật khẩu'}
            </label>
            <input value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              type="password" placeholder="••••••••" className="w-full rounded-2xl text-[14px] font-medium outline-none"
              style={{ padding:'12px 16px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)' }}
              onFocus={e => e.target.style.borderColor='var(--bc-blue)'} onBlur={e => e.target.style.borderColor='var(--bc-ink-100)'} />
          </div>

          <div>
            <label className="text-[12px] font-semibold block mb-2" style={{ color: 'var(--bc-ink-500)' }}>Vai trò</label>
            <div className="flex gap-3">
              {[
                { id: 'staff', label: 'Nhân viên (POS)', icon: User, color: 'var(--bc-teal)' },
                { id: 'admin', label: 'Quản trị viên',   icon: Shield, color: 'var(--bc-coral)' }
              ].map(r => (
                <div key={r.id} onClick={() => setFormData({...formData, role: r.id})}
                  className="flex-1 p-3 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-colors"
                  style={{
                    borderColor: formData.role === r.id ? r.color : 'var(--bc-ink-100)',
                    background: formData.role === r.id ? `${r.color}11` : 'white'
                  }}>
                  <r.icon size={20} style={{ color: formData.role === r.id ? r.color : 'var(--bc-ink-300)' }} />
                  <span className="text-[12px] font-semibold" style={{ color: formData.role === r.id ? r.color : 'var(--bc-ink-500)' }}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl text-white text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background:'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))', boxShadow:'var(--bc-shadow-blue)' }}>
            {loading ? 'Đang xử lý...' : (isEdit ? 'Lưu thay đổi' : 'Tạo nhân viên')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, data: null });

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/staff/', { headers });
      setStaff(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân sự ${user.full_name}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/staff/${user.id}`, { headers });
      fetchStaff();
    } catch(e) {
      alert(e.response?.data?.error || 'Lỗi khi xóa nhân viên');
    }
  };

  const filtered = staff.filter(s => s.full_name.toLowerCase().includes(q.toLowerCase()) || s.username.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5" style={{ ...fb, paddingBottom: 24 }}>
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4"
           style={{ boxShadow:'var(--bc-shadow-1)', border:'1px solid var(--bc-ink-100)' }}>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:'var(--bc-teal-tint)' }}>
            <Users size={24} style={{ color:'var(--bc-teal)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>Đội ngũ nhân sự</h2>
            <p className="text-[13px] font-medium" style={{ color:'var(--bc-ink-400)' }}>Quản lý tài khoản và phân quyền truy cập</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color:'var(--bc-ink-300)' }} />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Tìm nhân viên..."
              className="w-64 rounded-2xl text-[13px] font-medium outline-none"
              style={{ padding:'10px 14px 10px 38px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)', color:'var(--bc-ink-900)' }}
              onFocus={e => e.target.style.borderColor = 'var(--bc-teal)'} onBlur={e => e.target.style.borderColor = 'var(--bc-ink-100)'}
            />
          </div>
          <button onClick={() => setModal({ show: true, data: null })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background:'linear-gradient(135deg,var(--bc-teal),var(--bc-teal-700))', boxShadow:'0 8px 20px rgba(26,187,180,0.25)' }}>
            <Plus size={16} /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="py-20 text-center"><div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-3xl p-6 relative group transition-all hover:-translate-y-1"
                 style={{ boxShadow:'var(--bc-shadow-1)', border:'1px solid var(--bc-ink-100)' }}>
              
              <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal({ show: true, data: s })}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(s)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 border-4 border-white"
                     style={{ background: s.role === 'admin' ? 'var(--bc-coral-tint)' : 'var(--bc-teal-tint)', boxShadow:'var(--bc-shadow-2)' }}>
                  {s.role === 'admin' ? <Shield size={32} style={{ color:'var(--bc-coral)' }} /> : <User size={32} style={{ color:'var(--bc-teal)' }} />}
                </div>
                
                <h3 className="text-[17px] font-bold mb-1" style={{ ...fd, color:'var(--bc-ink-900)' }}>{s.full_name}</h3>
                <p className="text-[13px] mb-3" style={{ color:'var(--bc-ink-500)' }}>@{s.username}</p>
                
                <span className="px-3 py-1 rounded-full text-[11px] font-bold"
                      style={{ 
                        background: s.role === 'admin' ? 'var(--bc-coral)' : 'var(--bc-ink-100)',
                        color: s.role === 'admin' ? 'white' : 'var(--bc-ink-700)',
                        letterSpacing: '0.05em'
                      }}>
                  {s.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'NHÂN VIÊN POS'}
                </span>
                
                <div className="mt-5 w-full flex items-center justify-center gap-2 pt-4 border-t border-slate-100 text-[11px] font-medium" style={{ color:'var(--bc-ink-400)' }}>
                  <Lock size={12} /> Gia nhập: {s.created_at.split(' ')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal.show && (
          <StaffModal 
            staff={modal.data} 
            onClose={() => setModal({ show: false, data: null })}
            onSuccess={() => { setModal({ show: false, data: null }); fetchStaff(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
