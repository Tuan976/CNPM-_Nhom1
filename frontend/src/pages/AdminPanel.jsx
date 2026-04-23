import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import {
  Activity, LayoutDashboard, Pill, Stethoscope, ArrowLeftRight,
  Sparkles, LogOut, ShieldCheck, Sun, Moon, Plus, Trash2, Edit3, X, Save
} from 'lucide-react';
import axios from 'axios';

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ drugs: 0, diseases: 0, interactions: 0, users: 0 });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchStats();
    if (activeTab !== 'dashboard') fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    const res = await axios.get('http://localhost:5000/api/stats');
    setStats(res.data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'drugs' ? '/api/drugs' : '/api/diseases';
      const res = await axios.get(`http://localhost:5000${endpoint}`);
      setList(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa không?')) return;
    const endpoint = activeTab === 'drugs' ? `/api/drugs/${id}` : `/api/diseases/${id}`;
    await axios.delete(`http://localhost:5000${endpoint}`);
    fetchData();
    fetchStats();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === 'drugs' ? '/api/drugs' : '/api/diseases';
    if (editingItem) {
        await axios.put(`http://localhost:5000${endpoint}/${editingItem.id}`, formData);
    } else {
        await axios.post(`http://localhost:5000${endpoint}`, formData);
    }
    setIsModalOpen(false);
    setEditingItem(null);
    fetchData();
    fetchStats();
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || (activeTab === 'drugs' ? {
        name: '', ingredients: '', indications: '', contraindications: '', side_effects: '', dosage: '', pharmacological_group: ''
    } : {
        name: '', icd10: '', description: '', symptoms: ''
    }));
    setIsModalOpen(true);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'drugs', label: 'Quản lý Thuốc', icon: <Pill size={20} /> },
    { id: 'diseases', label: 'Quản lý Bệnh lý', icon: <Stethoscope size={20} /> },
  ];

  return (
    <div className="flex min-h-screen dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col h-screen sticky top-0 dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-200 border-r transition-colors duration-300">
        <div className="p-6 dark:border-slate-800 border-slate-100 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl"><Activity size={22} className="text-white" /></div>
            <div>
              <span className="font-bold dark:text-slate-100 text-slate-800 block">MediCheck AI</span>
              <span className="text-xs text-blue-500 font-semibold">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'dark:text-slate-400 text-slate-500 dark:hover:bg-slate-800 hover:bg-slate-100 dark:hover:text-white hover:text-slate-800'
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 dark:border-slate-800 border-slate-100 border-t">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm mb-4 border theme-border theme-text" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {theme === 'dark' ? <><Sun size={16} className="text-yellow-400" /> Sáng</> : <><Moon size={16} className="text-blue-500" /> Tối</>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-red-500 transition-all text-sm">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl border-b theme-border px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold theme-text uppercase tracking-wider">{activeTab === 'dashboard' ? 'Bảng điều khiển' : `Quản lý ${activeTab}`}</h1>
          <div className="flex items-center gap-4">
             {activeTab !== 'dashboard' && (
                 <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-all">
                     <Plus size={18} /> Thêm mới
                 </button>
             )}
             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">⚙ Quản trị viên</span>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Tổng số Thuốc', val: stats.drugs, icon: <Pill />, color: 'bg-blue-500' },
                { label: 'Tổng số Bệnh lý', val: stats.diseases, icon: <Stethoscope />, color: 'bg-emerald-500' },
                { label: 'Quy tắc tương tác', val: stats.interactions, icon: <ArrowLeftRight />, color: 'bg-orange-500' },
                { label: 'Người dùng', val: stats.users, icon: <ShieldCheck />, color: 'bg-purple-500' }
              ].map((s, i) => (
                <div key={i} className="dark:bg-slate-900 bg-white p-6 rounded-3xl border dark:border-slate-800 border-slate-200 shadow-sm">
                  <div className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4`}>{s.icon}</div>
                  <p className="text-sm dark:text-slate-500 text-slate-500 font-medium">{s.label}</p>
                  <p className="text-3xl font-bold dark:text-white text-slate-800">{s.val}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="dark:bg-slate-900 bg-white rounded-3xl border dark:border-slate-800 border-slate-200 overflow-hidden shadow-sm">
               <table className="w-full text-left">
                  <thead className="dark:bg-slate-800 bg-slate-50 border-b dark:border-slate-800 border-slate-200">
                     <tr>
                        <th className="px-6 py-4 text-sm font-bold dark:text-slate-400 text-slate-600">ID</th>
                        <th className="px-6 py-4 text-sm font-bold dark:text-slate-400 text-slate-600">Tên</th>
                        <th className="px-6 py-4 text-sm font-bold dark:text-slate-400 text-slate-600">{activeTab === 'drugs' ? 'Hoạt chất' : 'Mã ICD-10'}</th>
                        <th className="px-6 py-4 text-sm font-bold dark:text-slate-400 text-slate-600 text-right">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800 divide-slate-100">
                     {list.map((item) => (
                        <tr key={item.id} className="hover:dark:bg-slate-800/50 hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 text-sm theme-text">{item.id}</td>
                           <td className="px-6 py-4 text-sm font-bold theme-text">{item.name}</td>
                           <td className="px-6 py-4 text-sm theme-text">{activeTab === 'drugs' ? item.ingredients : item.icd10}</td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <button onClick={() => openModal(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit3 size={18} /></button>
                                 <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative dark:bg-slate-900 bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white text-slate-800">{editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {activeTab === 'drugs' ? 'Thuốc' : 'Bệnh lý'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-slate-400 text-slate-500"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {activeTab === 'drugs' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Tên thương mại</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="custom-input w-full" required /></div>
                    <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Hoạt chất (Generic)</label><input type="text" value={formData.ingredients || ''} onChange={e => setFormData({...formData, ingredients: e.target.value})} className="custom-input w-full" required /></div>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Nhóm dược lý</label><input type="text" value={formData.pharmacological_group || ''} onChange={e => setFormData({...formData, pharmacological_group: e.target.value})} className="custom-input w-full" placeholder="Ví dụ: NSAIDs, Kháng sinh..." /></div>
                  <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Chỉ định</label><textarea value={formData.indications || ''} onChange={e => setFormData({...formData, indications: e.target.value})} className="custom-input w-full h-20" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Chống chỉ định</label><textarea value={formData.contraindications || ''} onChange={e => setFormData({...formData, contraindications: e.target.value})} className="custom-input w-full h-20" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Liều dùng</label><input type="text" value={formData.dosage || ''} onChange={e => setFormData({...formData, dosage: e.target.value})} className="custom-input w-full" /></div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Tên bệnh</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="custom-input w-full" required /></div>
                    <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Mã ICD-10</label><input type="text" value={formData.icd10 || ''} onChange={e => setFormData({...formData, icd10: e.target.value})} className="custom-input w-full" placeholder="Ví dụ: I10, E11..." /></div>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Mô tả bệnh lý</label><textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="custom-input w-full h-24" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold dark:text-slate-500 text-slate-500 uppercase">Triệu chứng</label><textarea value={formData.symptoms || ''} onChange={e => setFormData({...formData, symptoms: e.target.value})} className="custom-input w-full h-24" /></div>
                </>
              )}
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-600 font-bold hover:opacity-80 transition-all">Hủy</button>
                 <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"><Save size={18} /> Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
