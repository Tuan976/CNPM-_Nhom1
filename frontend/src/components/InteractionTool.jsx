import React, { useState, useEffect } from 'react';
import { Pill, Stethoscope, AlertTriangle, CheckCircle, Trash2, User, Info, Activity, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const InteractionTool = () => {
  const [allDrugs, setAllDrugs] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [dRes, pRes] = await Promise.all([
        axios.get('http://localhost:5000/api/drugs/'),
        axios.get('http://localhost:5000/api/patients/', { headers })
      ]);
      setAllDrugs(dRes.data);
      setAllPatients(pRes.data);
    } catch (err) { console.error(err); }
  };

  const handleCheck = async () => {
    if (selectedDrugs.length === 0 || !selectedPatient) {
        setError('Vui lòng chọn ít nhất 1 thuốc và 1 bệnh nhân');
        return;
    }
    setLoading(true); setResult(null); setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/interactions/check', {
        drug_ids: selectedDrugs.map(d => d.id),
        patient_id: selectedPatient.id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResult(res.data);
    } catch (err) { 
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chọn Bệnh Nhân */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-xl font-black theme-text flex items-center gap-3 uppercase">
            <User className="text-blue-500" /> Chọn Bệnh Nhân
          </h3>
          <select 
            className="custom-input w-full"
            onChange={(e) => {
                const p = allPatients.find(item => item.id === parseInt(e.target.value));
                setSelectedPatient(p);
            }}
            value={selectedPatient?.id || ""}
          >
            <option value="">-- Chọn bệnh nhân từ hồ sơ --</option>
            {allPatients.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.dob})</option>)}
          </select>

          {selectedPatient && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-600/5 p-6 rounded-3xl border border-blue-500/20 space-y-3">
                <p className="text-sm font-black theme-text uppercase tracking-widest">Hồ sơ lâm sàng:</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><span className="opacity-50">Dị ứng:</span> <span className="font-bold text-red-500">{selectedPatient.allergies}</span></div>
                    <div><span className="opacity-50">Bệnh nền:</span> <span className="font-bold">{selectedPatient.diseases.join(", ")}</span></div>
                </div>
            </motion.div>
          )}
        </div>

        {/* Chọn Thuốc Kê Đơn */}
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-xl font-black theme-text flex items-center gap-3 uppercase">
            <Pill className="text-emerald-500" /> Thuốc Kê Đơn ({selectedDrugs.length})
          </h3>
          <select 
            className="custom-input w-full"
            onChange={(e) => {
              const drug = allDrugs.find(d => d.id === parseInt(e.target.value));
              if (drug && !selectedDrugs.find(sd => sd.id === drug.id)) {
                setSelectedDrugs([...selectedDrugs, drug]);
              }
            }}
            value=""
          >
            <option value="">-- Thêm thuốc vào đơn --</option>
            {allDrugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <div className="flex flex-wrap gap-3">
            {selectedDrugs.map(d => (
              <span key={d.id} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                {d.name} <button onClick={() => setSelectedDrugs(selectedDrugs.filter(sd => sd.id !== d.id))}><Trash2 size={14} /></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleCheck}
        disabled={loading || selectedDrugs.length === 0 || !selectedPatient}
        className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-30"
      >
        {loading ? 'Đang phân tích hồ sơ...' : 'Phân tích tương tác dựa trên hồ sơ'}
      </button>

      <AnimatePresence>
        {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl text-center font-bold">{error}</div>}
        
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className={`p-8 rounded-[2.5rem] border-2 flex items-center gap-6 ${result.overall_severity === 'CONTRAINDICATED' ? 'text-red-500 bg-red-50 border-red-200' : 'text-emerald-500 bg-emerald-50 border-emerald-200'}`}>
               {result.overall_severity === 'CONTRAINDICATED' ? <AlertTriangle size={48} /> : <CheckCircle size={48} />}
               <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">KẾT QUẢ: {result.overall_severity}</h2>
                  <p className="font-bold opacity-80">Hệ thống đã đối chiếu thuốc với bệnh nền, tiền sử và dị ứng của {selectedPatient?.full_name}.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {result.interactions.map((inter, i) => (
                <div key={i} className={`p-6 rounded-3xl border-l-8 ${inter.severity === 'CONTRAINDICATED' ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'}`}>
                  <h4 className="font-black text-lg uppercase tracking-tight mb-2">{inter.drug} ↔ {inter.disease}</h4>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">{inter.description}</p>
                  {inter.management && (
                      <div className="bg-white/50 p-4 rounded-xl flex items-start gap-3">
                        <Info size={16} className="mt-1 flex-shrink-0" />
                        <p className="text-sm font-bold italic">Hướng xử trí: {inter.management}</p>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractionTool;
