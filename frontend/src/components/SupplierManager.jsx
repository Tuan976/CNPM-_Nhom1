import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Plus, Edit3, Trash2, Search, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fd = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro", sans-serif' };

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact_info: '' });
  const [editingId, setEditingId] = useState(null);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers/', { headers });
      setSuppliers(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/suppliers/${editingId}`, formData, { headers });
      } else {
        await axios.post('http://localhost:5000/api/suppliers/', formData, { headers });
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (e) {
      alert(e.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`, { headers });
      fetchSuppliers();
    } catch (e) {
      alert('Không thể xóa nhà cung cấp');
    }
  };

  const openModal = (sup = null) => {
    if (sup) {
      setEditingId(sup.id);
      setFormData({ name: sup.name, contact_info: sup.contact_info });
    } else {
      setEditingId(null);
      setFormData({ name: '', contact_info: '' });
    }
    setIsModalOpen(true);
  };

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Tìm nhà cung cấp..."
            className="w-full rounded-2xl text-[13px] outline-none"
            style={{ ...fb, paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, background: 'white', border: '1px solid var(--bc-ink-100)', boxShadow: 'var(--bc-shadow-1)' }}
            onFocus={e => e.target.style.borderColor = 'var(--bc-blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--bc-ink-100)'}
          />
        </div>
        <button onClick={() => openModal()} className="px-5 py-2.5 rounded-2xl text-white text-[13px] font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5"
                style={{ ...fb, background: 'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))', boxShadow: 'var(--bc-shadow-blue)' }}>
          <Plus size={16} /> Thêm nhà cung cấp
        </button>
      </div>

      {/* ── LIST ── */}
      <div className="glass-panel rounded-3xl flex-1 overflow-hidden flex flex-col border" style={{ borderColor: 'var(--bc-ink-100)' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: 'var(--bc-bg-soft)', borderBottom: '1px solid var(--bc-ink-100)' }}>
              <th className="px-6 py-4 text-[11px] font-bold uppercase" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>Tên nhà cung cấp</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>Thông tin liên hệ</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase text-right" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="group transition-colors hover:bg-slate-50" style={{ borderBottom: '1px solid var(--bc-ink-100)' }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bc-blue-tint)', color: 'var(--bc-blue)' }}>
                      <Truck size={18} />
                    </div>
                    <span className="font-bold text-[14px]" style={{ ...fb, color: 'var(--bc-ink-900)' }}>{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] font-medium" style={{ ...fb, color: 'var(--bc-ink-500)' }}>{s.contact_info}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(s)} className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors mr-2">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan="3" className="text-center py-10 text-[13px] text-slate-400" style={fb}>Không tìm thấy nhà cung cấp nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{ ...fd, color: 'var(--bc-ink-900)', letterSpacing: '-0.02em' }}>
                  {editingId ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold mb-2" style={{ ...fb, color: 'var(--bc-ink-500)' }}>Tên nhà cung cấp</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                         className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none border focus:border-blue-500" style={fb} />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-2" style={{ ...fb, color: 'var(--bc-ink-500)' }}>Thông tin liên hệ</label>
                  <input value={formData.contact_info} onChange={e => setFormData({...formData, contact_info: e.target.value})}
                         className="w-full rounded-2xl px-4 py-3 text-[14px] outline-none border focus:border-blue-500" style={fb} />
                </div>
                <button type="submit" className="w-full mt-4 py-3.5 rounded-2xl text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        style={{ ...fb, background: 'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))', boxShadow: 'var(--bc-shadow-blue)' }}>
                  <CheckCircle size={18} /> Lưu thông tin
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
