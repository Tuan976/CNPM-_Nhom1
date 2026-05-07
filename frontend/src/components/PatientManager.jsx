import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, Edit3, Save, X, Phone, AlertCircle, Fingerprint, MapPin, Droplets, Search, FileText, Activity, Clock } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const PatientManager = () => {
  const [patients, setPatients] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    id_card: '', full_name: '', dob: '', gender: 'Nam', 
    blood_group: 'O+', phone: '', address: '', ethnicity: 'Kinh',
    avatar: '', medical_history: '', allergies: '', disease_ids: []
  });

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients/', { headers }),
        axios.get('http://localhost:5000/api/diseases/')
      ]);
      setPatients(pRes.data);
      setDiseases(dRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    // Lấy chi tiết disease_ids từ API hoặc tìm trong list diseases
    // Ở đây p.diseases là list string name, ta cần list ID.
    // Cách tốt nhất là fetch lại chi tiết bệnh nhân đó
    axios.get(`http://localhost:5000/api/patients/${p.id}`, { headers }).then(res => {
        setFormData(res.data);
        setIsModalOpen(true);
        setSelectedPatient(null);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) return;
    try {
        await axios.delete(`http://localhost:5000/api/patients/${id}`, { headers });
        fetchData();
        setSelectedPatient(null);
    } catch (err) { alert('Lỗi khi xóa'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, avatar: formData.avatar || `https://i.pravatar.cc/150?u=${formData.full_name}` };
      if (editingId) {
          await axios.put(`http://localhost:5000/api/patients/${editingId}`, data, { headers });
      } else {
          await axios.post('http://localhost:5000/api/patients/', data, { headers });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ id_card: '', full_name: '', dob: '', gender: 'Nam', blood_group: 'O+', phone: '', address: '', ethnicity: 'Kinh', avatar: '', medical_history: '', allergies: '', disease_ids: [] });
      fetchData();
    } catch (err) { 
        alert(err.response?.status === 401 ? 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại!' : 'Lỗi hệ thống khi lưu.');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id_card?.includes(searchTerm)
  );

  return (
    <div className="space-y-10 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-blue-600 p-10 rounded-[3rem] shadow-2xl shadow-blue-500/20">
        <div className="text-white space-y-2">
           <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
             <Fingerprint size={44} /> Hệ thống Hồ sơ EMR
           </h2>
           <p className="opacity-80 font-bold tracking-widest text-xs uppercase">Quản lý bệnh án điện tử chuẩn ISO 27001</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                <input 
                    type="text" 
                    placeholder="Tìm tên hoặc số CCCD..." 
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-14 pr-6 text-white outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => { setEditingId(null); setIsModalOpen(true); }}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black flex items-center gap-3 uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-lg"
            >
                <Plus size={24} /> Thêm BN
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPatients.map((p) => (
          <motion.div 
            layoutId={p.id}
            onClick={() => setSelectedPatient(p)}
            key={p.id} 
            className="glass-card p-8 cursor-pointer hover:shadow-2xl hover:border-blue-500/20 group"
          >
            <div className="flex items-center gap-6 mb-6">
                <img src={p.avatar} className="w-20 h-20 rounded-3xl object-cover shadow-lg" />
                <div>
                    <h3 className="text-xl font-black theme-text uppercase leading-none mb-2">{p.full_name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-black">{p.blood_group}</span>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">ID: {p.id_card?.slice(-4) || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div className="space-y-3 py-4 border-t theme-border">
                <div className="flex items-center gap-3 text-xs font-bold opacity-60"><Phone size={14}/> {p.phone}</div>
                <div className="flex items-center gap-3 text-xs font-bold text-red-500"><AlertCircle size={14}/> {p.allergies || 'Không'}</div>
            </div>
            <div className="pt-4 flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-600 uppercase">Xem chi tiết hồ sơ →</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-900/90 backdrop-blur-xl">
             <motion.div layoutId={selectedPatient.id} className="bg-white dark:bg-slate-900 w-full max-w-6xl h-full max-h-[850px] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-blue-600 p-12 text-white flex justify-between items-start">
                    <div className="flex gap-8">
                        <img src={selectedPatient.avatar} className="w-32 h-32 rounded-[2.5rem] border-4 border-white/20 shadow-2xl" />
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black uppercase tracking-tighter">{selectedPatient.full_name}</h2>
                            <p className="font-bold opacity-70 flex items-center gap-2"><Fingerprint size={16}/> SỐ ĐỊNH DANH: {selectedPatient.id_card}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => handleDelete(selectedPatient.id)} className="p-4 bg-white/10 hover:bg-red-500/20 rounded-3xl transition-all"><Trash2 size={24}/></button>
                        <button onClick={() => setSelectedPatient(null)} className="p-4 hover:bg-white/10 rounded-3xl transition-all"><X size={32}/></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 grid grid-cols-3 gap-12 custom-scrollbar">
                    <div className="col-span-2 space-y-10">
                        <section className="space-y-4">
                            <h4 className="text-lg font-black theme-text uppercase flex items-center gap-3"><FileText className="text-blue-600" /> Tóm tắt lâm sàng</h4>
                            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] space-y-6">
                                <div><label className="text-[10px] font-black opacity-30 uppercase block mb-1">Tiền sử bệnh lý</label><p className="font-bold theme-text leading-relaxed">{selectedPatient.medical_history || 'Chưa có dữ liệu.'}</p></div>
                                <div className="pt-6 border-t theme-border">
                                    <label className="text-[10px] font-black text-red-500 uppercase block mb-1">Dị ứng thuốc</label>
                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4"><AlertCircle size={24} className="text-red-500" /><p className="font-black text-red-600">{selectedPatient.allergies || 'Không ghi nhận.'}</p></div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-lg font-black theme-text uppercase flex items-center gap-3"><Clock className="text-blue-600" /> Bệnh nền</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedPatient.diseases.map((d, i) => (
                                    <div key={i} className="bg-blue-600/5 p-6 rounded-3xl flex items-center gap-4"><div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black">ICD</div><div><p className="font-black theme-text uppercase text-sm">{d}</p></div></div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card p-8 bg-blue-600 text-white space-y-4">
                            <h5 className="font-black uppercase text-sm flex items-center gap-2"><Activity size={16}/> Chỉ số sinh tồn</h5>
                            <div className="space-y-3 text-xs font-bold">
                                <div className="flex justify-between"><span>Huyết áp:</span> <span>120/80 mmHg</span></div>
                                <div className="flex justify-between"><span>Nhịp tim:</span> <span>72 bpm</span></div>
                            </div>
                        </div>
                        <div className="glass-card p-8 space-y-4">
                            <h5 className="font-black theme-text uppercase text-sm flex items-center gap-2"><User size={16}/> Hành chính</h5>
                            <div className="space-y-2 text-[11px] font-bold opacity-70">
                                <div className="flex justify-between"><span>Ngày sinh:</span> <span>{selectedPatient.dob}</span></div>
                                <div className="flex justify-between"><span>Điện thoại:</span> <span>{selectedPatient.phone}</span></div>
                                <div className="flex justify-between"><span>Dân tộc:</span> <span>{selectedPatient.ethnicity}</span></div>
                            </div>
                        </div>
                        <button onClick={() => handleEdit(selectedPatient)} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-black">
                            <Edit3 size={18}/> Chỉnh sửa hồ sơ
                        </button>
                    </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-xl">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-12 border-b theme-border flex justify-between items-center">
                  <h3 className="text-3xl font-black theme-text uppercase tracking-tighter">{editingId ? 'Chỉnh sửa Hồ sơ Bệnh án' : 'Đăng ký Hồ sơ mới'}</h3>
                  <button onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="p-5 hover:bg-red-50 rounded-3xl"><X size={32} /></button>
               </div>
               <form onSubmit={handleSave} className="p-12 overflow-y-auto grid grid-cols-3 gap-12 custom-scrollbar">
                  <div className="space-y-8">
                     <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-4">I. Hành chính</h4>
                     <div className="space-y-2"><label className="text-[10px] font-black opacity-40 uppercase ml-4">Số CCCD</label><input type="text" className="custom-input w-full" value={formData.id_card} onChange={e => setFormData({...formData, id_card: e.target.value})} required /></div>
                     <div className="space-y-2"><label className="text-[10px] font-black opacity-40 uppercase ml-4">Họ và tên</label><input type="text" className="custom-input w-full uppercase" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required /></div>
                     <div className="space-y-2"><label className="text-[10px] font-black opacity-40 uppercase ml-4">Điện thoại</label><input type="text" className="custom-input w-full" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-black opacity-40 uppercase ml-4">Nhóm máu</label><select className="custom-input w-full" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})}>{['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                        <div className="space-y-2"><label className="text-[10px] font-black opacity-40 uppercase ml-4">Dân tộc</label><input type="text" className="custom-input w-full" value={formData.ethnicity} onChange={e => setFormData({...formData, ethnicity: e.target.value})} /></div>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-4">II. Lâm sàng</h4>
                     <div className="space-y-2"><label className="text-[10px] font-black opacity-40 uppercase ml-4">Địa chỉ</label><textarea className="custom-input w-full h-20" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                     <div className="space-y-2"><label className="text-[10px] font-black opacity-40 uppercase ml-4">Tiền sử</label><textarea className="custom-input w-full h-20" value={formData.medical_history} onChange={e => setFormData({...formData, medical_history: e.target.value})} /></div>
                     <div className="space-y-2"><label className="text-[10px] font-black text-red-600 uppercase ml-4">Dị ứng</label><textarea className="custom-input w-full h-20 border-red-200" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} /></div>
                  </div>
                  <div className="space-y-8">
                     <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-4">III. Bệnh nền (ICD-10)</h4>
                     <div className="h-[300px] overflow-y-auto border theme-border rounded-[2rem] p-6 space-y-2 bg-slate-50/50">
                        {diseases.map(d => (
                           <div key={d.id} onClick={() => toggleDisease(d.id)} className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${formData.disease_ids?.includes(d.id) ? 'bg-blue-600 text-white border-blue-600' : 'theme-text border-transparent hover:bg-white'}`}>
                              <p className="font-black text-xs uppercase leading-none mb-1">{d.name}</p><p className="text-[9px] font-bold opacity-50">{d.icd10}</p>
                           </div>
                        ))}
                     </div>
                     <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 hover:bg-blue-500">
                        <Save size={24} /> {editingId ? 'Cập nhật hồ sơ' : 'Lưu hồ sơ mới'}
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientManager;
