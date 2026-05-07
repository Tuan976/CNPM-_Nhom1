import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Info, ChevronRight, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DiseaseLookup = () => {
  const [query, setQuery] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDiseases = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/diseases?q=${search}`);
      setDiseases(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  return (
    <div className="space-y-10">
      <motion.form 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={(e) => { e.preventDefault(); fetchDiseases(query); }} 
        className="relative max-w-2xl group"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên bệnh lý hoặc mã ICD-10..."
          className="custom-input pl-14 pr-6 py-5 group-hover:border-blue-500/50"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        {loading && (
           <div className="absolute right-6 top-1/2 -translate-y-1/2">
             <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
           </div>
        )}
      </motion.form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 px-4">Kết quả ({diseases.length})</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {diseases.map((disease, i) => (
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                key={disease.id}
                onClick={() => setSelectedDisease(disease)}
                className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-300 ${
                  selectedDisease?.id === disease.id 
                    ? 'border-blue-500 bg-blue-500/5 shadow-xl shadow-blue-500/10' 
                    : 'theme-border bg-white/50 dark:bg-slate-900/50 hover:border-blue-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${selectedDisease?.id === disease.id ? 'bg-emerald-600 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Stethoscope size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black theme-text tracking-tight truncate uppercase">{disease.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 truncate">ICD-10: {disease.icd10 || 'N/A'}</p>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${selectedDisease?.id === disease.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedDisease ? (
              <motion.div 
                key={selectedDisease.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-10 sticky top-32 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Stethoscope size={160} className="text-emerald-600" />
                </div>

                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div>
                    <h2 className="text-4xl font-black theme-text tracking-tighter uppercase mb-4">{selectedDisease.name}</h2>
                    <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                      <Zap size={14} /> ICD-10 Code: {selectedDisease.icd10 || 'Global Standard'}
                    </div>
                  </div>
                </div>

                <div className="space-y-10 relative z-10">
                  <section className="glass p-8 rounded-[2.5rem] border-blue-500/10 hover:border-blue-500/30 transition-all">
                    <h4 className="flex items-center gap-3 font-black text-blue-500 uppercase tracking-widest text-xs mb-6">
                      <Info size={20} /> Mô tả chuyên khoa
                    </h4>
                    <p className="theme-text opacity-70 leading-relaxed font-medium text-lg">{selectedDisease.description}</p>
                  </section>

                  <section className="glass p-8 rounded-[2.5rem] border-amber-500/10 hover:border-amber-500/30 transition-all bg-gradient-to-br from-amber-500/5 to-transparent">
                    <h4 className="flex items-center gap-3 font-black text-amber-500 uppercase tracking-widest text-xs mb-6">
                      <Activity size={20} /> Triệu chứng lâm sàng
                    </h4>
                    <div className="theme-text opacity-80 leading-loose font-bold text-xl whitespace-pre-wrap">
                      {selectedDisease.symptoms}
                    </div>
                  </section>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[500px] flex flex-col items-center justify-center glass-card p-10 opacity-60"
              >
                <div className="w-24 h-24 bg-slate-500/5 rounded-[2rem] flex items-center justify-center mb-6">
                  <Stethoscope size={64} className="opacity-20 text-slate-500" />
                </div>
                <p className="text-xl font-black uppercase tracking-[0.2em] opacity-40">Chọn bệnh lý để xem chi tiết</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiseaseLookup;

