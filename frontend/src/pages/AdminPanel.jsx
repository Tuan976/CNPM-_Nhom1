import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import {
  Activity, LayoutDashboard, Pill, Stethoscope, ArrowLeftRight,
  LogOut, ShieldCheck, Sun, Moon, Plus, Trash2, Edit3, X, Save, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import PatientManager from '../components/PatientManager';

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

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchStats();
    if (activeTab !== 'dashboard') fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/admin/stats', { headers });
        setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'drugs' ? '/api/drugs/' : (activeTab === 'diseases' ? '/api/diseases/' : '/api/interactions/');
      const res = await axios.get(`http://localhost:5000${endpoint}`, { headers });
      setList(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa không?')) return;
    const endpoint = activeTab === 'drugs' ? `/api/drugs/${id}` : `/api/diseases/${id}`;
    await axios.delete(`http://localhost:5000${endpoint}`, { headers });
    fetchData();
    fetchStats();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === 'drugs' ? '/api/drugs/' : (activeTab === 'diseases' ? '/api/diseases/' : '/api/interactions/');
    try {
        if (editingItem) {
            await axios.put(`http://localhost:5000${endpoint}${editingItem.id}`, formData, { headers });
        } else {
            await axios.post(`http://localhost:5000${endpoint}`, formData, { headers });
        }
        setIsModalOpen(false);
        setEditingItem(null);
        fetchData();
        fetchStats();
    } catch (err) { alert(err.response?.data?.error || 'Có lỗi xảy ra'); }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) setFormData(item);
    else {
        setFormData(activeTab === 'drugs' ? { name: '', ingredients: '', indications: '', dosage: '' } 
                 : (activeTab === 'diseases' ? { name: '', icd10: '', description: '' }
                 : { drug_id: '', disease_id: '', severity: 'SAFE', description: '' }));
    }
    setIsModalOpen(true);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'drugs', label: 'Quản lý Thuốc', icon: <Pill size={20} /> },
    { id: 'diseases', label: 'Quản lý Bệnh lý', icon: <Stethoscope size={20} /> },
    { id: 'patients', label: 'Quản lý Bệnh nhân', icon: <User size={20} /> },
    { id: 'interactions', label: 'Quy tắc tương tác', icon: <ArrowLeftRight size={20} /> },
  ];

  return (
    <div className="flex min-h-screen dark:bg-slate-950 bg-slate-50">
      <aside className="w-72 flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r theme-border z-20">
        <div className="p-8 flex items-center gap-4">
           <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-500/30">
             <Activity size={24} />
           </div>
           <span className="font-black text-xl theme-text uppercase tracking-tighter">MediCheck Admin</span>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'theme-text opacity-40 hover:opacity-100 hover:bg-blue-500/5'
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8">
           <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-red-500 font-black uppercase text-xs tracking-widest border border-red-500/20 hover:bg-red-50">
             <LogOut size={18} /> Đăng xuất
           </button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-black theme-text uppercase tracking-tighter">{activeTab === 'dashboard' ? 'Bảng điều khiển' : `Quản lý ${activeTab}`}</h1>
            {activeTab !== 'dashboard' && (
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-blue-500 transition-all uppercase text-sm tracking-widest">
                    <Plus size={20} /> Thêm {activeTab}
                </button>
            )}
        </header>

        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Tổng số Thuốc', val: stats.drugs, icon: <Pill />, color: 'text-blue-500 bg-blue-500/10' },
              { label: 'Tổng số Bệnh lý', val: stats.diseases, icon: <Stethoscope />, color: 'text-emerald-500 bg-emerald-500/10' },
              { label: 'Quy tắc tương tác', val: stats.interactions, icon: <ArrowLeftRight />, color: 'text-orange-500 bg-orange-500/10' },
              { label: 'Người dùng', val: stats.users, icon: <ShieldCheck />, color: 'text-purple-500 bg-purple-500/10' }
            ].map((s, i) => (
              <div key={i} className="glass-card p-10">
                <div className={`${s.color} w-16 h-16 rounded-[2rem] flex items-center justify-center mb-6`}>{s.icon}</div>
                <p className="text-sm font-black opacity-40 uppercase tracking-widest mb-2">{s.label}</p>
                <p className="text-5xl font-black theme-text tracking-tighter">{s.val}</p>
              </div>
            ))}
          </div>
        ) : activeTab === 'patients' ? (
          <PatientManager />
        ) : (
          <div className="glass-card overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b theme-border">
                   <tr>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest opacity-40">Thông tin</th>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest opacity-40 text-right">Hành động</th>
                   </tr>
                </thead>
                <tbody className="divide-y theme-border">
                   {list.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                         <td className="px-8 py-6">
                            <p className="font-black text-lg theme-text">{item.name || `Tương tác #${item.id}`}</p>
                            <p className="text-xs opacity-50 font-bold uppercase tracking-wider">{item.ingredients || item.icd10 || `ID Thuốc: ${item.drug_id}`}</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3">
                               <button onClick={() => openModal(item)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl"><Edit3 size={20} /></button>
                               <button onClick={() => handleDelete(item.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden p-12">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-2xl font-black theme-text uppercase tracking-tight">{editingItem ? 'Chỉnh sửa' : 'Thêm mới'}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl"><X size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                 {activeTab === 'drugs' ? (
                    <>
                       <input type="text" placeholder="Tên thuốc" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="custom-input w-full" required />
                       <input type="text" placeholder="Hoạt chất" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} className="custom-input w-full" required />
                       <textarea placeholder="Chỉ định" value={formData.indications} onChange={e => setFormData({...formData, indications: e.target.value})} className="custom-input w-full h-32" />
                    </>
                 ) : activeTab === 'diseases' ? (
                    <>
                       <input type="text" placeholder="Tên bệnh" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="custom-input w-full" required />
                       <input type="text" placeholder="Mã ICD-10" value={formData.icd10} onChange={e => setFormData({...formData, icd10: e.target.value})} className="custom-input w-full" />
                       <textarea placeholder="Mô tả" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="custom-input w-full h-32" />
                    </>
                 ) : (
                    <>
                       <div className="grid grid-cols-2 gap-4">
                           <input type="number" placeholder="ID Thuốc" value={formData.drug_id} onChange={e => setFormData({...formData, drug_id: e.target.value})} className="custom-input" required />
                           <input type="number" placeholder="ID Bệnh lý" value={formData.disease_id} onChange={e => setFormData({...formData, disease_id: e.target.value})} className="custom-input" required />
                       </div>
                       <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="custom-input w-full">
                           <option value="SAFE">An toàn (SAFE)</option>
                           <option value="CAUTION">Thận trọng (CAUTION)</option>
                           <option value="CONTRAINDICATED">Chống chỉ định (CONTRAINDICATED)</option>
                       </select>
                       <textarea placeholder="Mô tả tương tác" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="custom-input w-full h-32" />
                    </>
                 )}
                 <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                    <Save size={20} /> Lưu thay đổi
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
