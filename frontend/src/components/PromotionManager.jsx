import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Plus, Edit3, Trash2, Search, X, CheckCircle, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fd = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro", sans-serif' };

export default function PromotionManager() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', description: '', discount_percent: 0, active: true, start_date: '', end_date: '' });
  const [editingId, setEditingId] = useState(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => { fetchPromotions(); }, []);

  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/promotions/', { headers });
      setPromotions(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, discount_percent: parseFloat(formData.discount_percent) };
      if (!data.start_date) delete data.start_date;
      if (!data.end_date) delete data.end_date;
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/promotions/${editingId}`, data, { headers });
      } else {
        await axios.post('http://localhost:5000/api/promotions/', data, { headers });
      }
      setIsModalOpen(false);
      fetchPromotions();
    } catch (e) {
      alert(e.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khuyến mãi này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/promotions/${id}`, { headers });
      fetchPromotions();
    } catch (e) {
      alert('Không thể xóa');
    }
  };

  const openModal = (p = null) => {
    if (p) {
      setEditingId(p.id);
      setFormData({ 
        code: p.code, description: p.description || '', 
        discount_percent: p.discount_percent, active: p.active,
        start_date: p.start_date ? p.start_date.split(' ')[0] : '', 
        end_date: p.end_date ? p.end_date.split(' ')[0] : '' 
      });
    } else {
      setEditingId(null);
      setFormData({ code: '', description: '', discount_percent: 10, active: true, start_date: '', end_date: '' });
    }
    setIsModalOpen(true);
  };

  const filtered = promotions.filter(p => p.code.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Tìm mã khuyến mãi..."
            className="w-full rounded-2xl text-[13px] outline-none"
            style={{ ...fb, paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, background: 'white', border: '1px solid var(--bc-ink-100)', boxShadow: 'var(--bc-shadow-1)' }}
            onFocus={e => e.target.style.borderColor = 'var(--bc-teal)'}
            onBlur={e => e.target.style.borderColor = 'var(--bc-ink-100)'}
          />
        </div>
        <button onClick={() => openModal()} className="px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5"
                style={{ ...fb, background: 'linear-gradient(135deg,var(--bc-teal),var(--bc-teal-700))', boxShadow: 'var(--bc-shadow-coral)' }}>
          <Plus size={16} /> Thêm khuyến mãi
        </button>
      </div>

      <div className="glass-panel rounded-3xl flex-1 overflow-hidden flex flex-col border" style={{ borderColor: 'var(--bc-ink-100)' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: 'var(--bc-bg-soft)', borderBottom: '1px solid var(--bc-ink-100)' }}>
              <th className="px-6 py-4 text-[11px] font-bold uppercase" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>Mã / Chi tiết</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase text-center" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>Mức giảm</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase text-center" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>Hiệu lực</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase text-right" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="group transition-colors hover:bg-slate-50" style={{ borderBottom: '1px solid var(--bc-ink-100)' }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bc-teal-tint)', color: 'var(--bc-teal)' }}>
                      <Tag size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-[14px] uppercase" style={{ ...fb, color: 'var(--bc-ink-900)' }}>{p.code}</span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--bc-ink-400)' }}>{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 font-bold text-[15px]" style={{ ...fd, color: 'var(--bc-coral)' }}>
                    {p.discount_percent}<Percent size={14} />
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-[12px] font-medium" style={{ ...fb, color: 'var(--bc-ink-500)' }}>
                  {p.active ? <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Đang kích hoạt</span> : <span className="text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Vô hiệu hóa</span>}
                  {p.start_date && <div className="mt-1 text-[10px]">{p.start_date.split(' ')[0]} - {p.end_date ? p.end_date.split(' ')[0] : 'Vô thời hạn'}</div>}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(p)} className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors mr-2"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{ ...fd, color: 'var(--bc-ink-900)' }}>
                  {editingId ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold mb-2" style={{ ...fb, color: 'var(--bc-ink-500)' }}>Mã khuyến mãi (Code)</label>
                  <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                         className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none border focus:border-teal-500 uppercase font-bold" style={fb} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-2" style={{ ...fb, color: 'var(--bc-ink-500)' }}>Phần trăm giảm (%)</label>
                  <input type="number" required value={formData.discount_percent} onChange={e => setFormData({...formData, discount_percent: e.target.value})}
                         className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none border focus:border-teal-500" style={fb} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-2" style={{ ...fb, color: 'var(--bc-ink-500)' }}>Mô tả chi tiết</label>
                  <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                         className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none border focus:border-teal-500" style={fb} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold mb-2" style={{ ...fb, color: 'var(--bc-ink-500)' }}>Ngày bắt đầu</label>
                    <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})}
                           className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none border focus:border-teal-500" style={fb} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-2" style={{ ...fb, color: 'var(--bc-ink-500)' }}>Ngày kết thúc</label>
                    <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})}
                           className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none border focus:border-teal-500" style={fb} />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-4 cursor-pointer text-[13px] font-semibold" style={{ ...fb, color: 'var(--bc-ink-700)' }}>
                  <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-4 h-4 accent-teal-500" />
                  Kích hoạt mã khuyến mãi
                </label>
                <button type="submit" className="w-full mt-4 py-3.5 rounded-2xl text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        style={{ ...fb, background: 'linear-gradient(135deg,var(--bc-teal),var(--bc-teal-700))', boxShadow: 'var(--bc-shadow-coral)' }}>
                  <CheckCircle size={18} /> Lưu khuyến mãi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
