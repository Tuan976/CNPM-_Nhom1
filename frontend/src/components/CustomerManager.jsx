import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Phone, Star, Gift, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const fd = { fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro",sans-serif' };

function CustomerModal({ customer, onClose, onSuccess }) {
  const isEdit = !!customer;
  const [formData, setFormData] = useState(
    customer || { phone: '', full_name: '', points: 0 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.phone) {
      setError('Số điện thoại là bắt buộc');
      return;
    }
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/customers/${customer.id}`, formData, { headers });
      } else {
        await axios.post('http://localhost:5000/api/customers/', formData, { headers });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi lưu khách hàng');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
         style={{ background: 'rgba(14,21,48,0.5)', backdropFilter: 'blur(12px)' }}>
      <motion.div initial={{ opacity:0, scale:0.94, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.94, y:20 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-[10px] font-semibold mb-1" style={{ ...fb, color: 'var(--bc-ink-300)', letterSpacing:'0.1em' }}>KHÁCH HÀNG</p>
            <h3 className="text-xl font-bold" style={{ ...fd, color: 'var(--bc-ink-900)' }}>
              {isEdit ? 'Cập nhật thông tin' : 'Đăng ký khách mới'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl hover:bg-slate-50 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5" style={fb}>
          {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-[13px] font-medium">{error}</div>}
          
          <div>
            <label className="text-[12px] font-semibold block mb-2" style={{ color: 'var(--bc-ink-500)' }}>Số điện thoại *</label>
            <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              disabled={isEdit} type="tel" placeholder="09xxxx..."
              className="w-full rounded-2xl text-[14px] font-bold outline-none disabled:opacity-50"
              style={{ padding:'12px 16px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)' }}
              onFocus={e => e.target.style.borderColor='var(--bc-blue)'} onBlur={e => e.target.style.borderColor='var(--bc-ink-100)'} />
          </div>

          <div>
            <label className="text-[12px] font-semibold block mb-2" style={{ color: 'var(--bc-ink-500)' }}>Họ và tên</label>
            <input value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
              placeholder="Nguyễn Văn A" className="w-full rounded-2xl text-[14px] font-medium outline-none"
              style={{ padding:'12px 16px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)' }}
              onFocus={e => e.target.style.borderColor='var(--bc-blue)'} onBlur={e => e.target.style.borderColor='var(--bc-ink-100)'} />
          </div>

          {isEdit && (
            <div>
              <label className="text-[12px] font-semibold block mb-2" style={{ color: 'var(--bc-ink-500)' }}>Điểm tích lũy</label>
              <input value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value)||0})}
                type="number" className="w-full rounded-2xl text-[14px] font-medium outline-none"
                style={{ padding:'12px 16px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)' }}
                onFocus={e => e.target.style.borderColor='var(--bc-blue)'} onBlur={e => e.target.style.borderColor='var(--bc-ink-100)'} />
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl text-white text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background:'linear-gradient(135deg,var(--bc-orange),var(--bc-orange-700))', boxShadow:'0 8px 20px rgba(255,140,82,0.3)' }}>
            {loading ? 'Đang xử lý...' : (isEdit ? 'Lưu thay đổi' : 'Tạo khách hàng')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, data: null });

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/?q=${q}`, { headers });
      setCustomers(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [q]);

  const handleDelete = async (c) => {
    if (!window.confirm(`Xóa khách hàng ${c.full_name || c.phone}? Điểm tích lũy sẽ mất vĩnh viễn.`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${c.id}`, { headers });
      fetchCustomers();
    } catch(e) { alert('Lỗi xóa khách hàng'); }
  };

  return (
    <div className="space-y-5" style={{ ...fb, paddingBottom: 24 }}>
      <div className="bg-white rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4"
           style={{ boxShadow:'var(--bc-shadow-1)', border:'1px solid var(--bc-ink-100)' }}>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:'var(--bc-orange-tint)' }}>
            <Gift size={24} style={{ color:'var(--bc-orange)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>Khách hàng thân thiết</h2>
            <p className="text-[13px] font-medium" style={{ color:'var(--bc-ink-400)' }}>Quản lý hội viên và tích điểm mua hàng</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color:'var(--bc-ink-300)' }} />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Tìm theo SĐT..."
              className="w-64 rounded-2xl text-[13px] font-medium outline-none"
              style={{ padding:'10px 14px 10px 38px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)', color:'var(--bc-ink-900)' }}
              onFocus={e => e.target.style.borderColor = 'var(--bc-orange)'} onBlur={e => e.target.style.borderColor = 'var(--bc-ink-100)'}
            />
          </div>
          <button onClick={() => setModal({ show: true, data: null })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold transition-all hover:scale-[1.02]"
            style={{ background:'linear-gradient(135deg,var(--bc-orange),var(--bc-orange-700))', boxShadow:'0 8px 20px rgba(255,140,82,0.3)' }}>
            <Plus size={16} /> Thêm khách
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto"></div></div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium">Chưa có khách hàng nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {customers.map(c => (
            <div key={c.id} className="bg-white rounded-3xl p-6 relative group transition-all hover:-translate-y-1"
                 style={{ boxShadow:'var(--bc-shadow-1)', border:'1px solid var(--bc-ink-100)' }}>
              
              <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal({ show: true, data: c })}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(c)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                     style={{ background:'linear-gradient(135deg,var(--bc-ink-300),var(--bc-ink-500))' }}>
                  {c.full_name ? c.full_name.charAt(0).toUpperCase() : <Phone size={20} />}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold" style={{ ...fd, color:'var(--bc-ink-900)' }}>{c.full_name || 'Khách vãng lai'}</h3>
                  <p className="text-[13px] font-medium" style={{ color:'var(--bc-ink-500)' }}>{c.phone}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[12px]"
                     style={{ background:'var(--bc-orange-tint)', color:'var(--bc-orange-700)' }}>
                  <Star size={14} fill="currentColor" />
                  {c.points} điểm
                </div>
                <span className="text-[11px] font-medium" style={{ color:'var(--bc-ink-300)' }}>
                  Từ {c.created_at}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal.show && (
          <CustomerModal 
            customer={modal.data} 
            onClose={() => setModal({ show: false, data: null })}
            onSuccess={() => { setModal({ show: false, data: null }); fetchCustomers(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
