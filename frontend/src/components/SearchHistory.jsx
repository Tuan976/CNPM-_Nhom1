import React, { useState, useEffect } from 'react';
import { Clock, Search, Filter, ChevronRight, Activity } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/history/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHistory(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.2em]">Đang tải lịch sử...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black theme-text uppercase tracking-tighter flex items-center gap-4">
          <Clock size={32} className="text-blue-600" /> Lịch sử tra cứu
        </h2>
        <div className="flex gap-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Tìm kiếm..." className="custom-input pl-12 py-3 text-sm w-64" />
            </div>
            <button className="glass p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Filter size={20} /></button>
        </div>
      </div>

      <div className="space-y-4">
        {history.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={item.id} 
            className="glass-card p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${item.result === 'CONTRAINDICATED' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                <Activity size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                    <span className="font-black text-lg theme-text">Tra cứu #{item.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.result === 'CONTRAINDICATED' ? 'border-red-200 text-red-500' : 'border-emerald-200 text-emerald-500'}`}>
                        {item.result}
                    </span>
                </div>
                <p className="text-sm opacity-50 font-bold uppercase tracking-widest">
                    {new Date(item.date).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-10">
               <div className="text-right hidden md:block">
                  <p className="text-xs font-black opacity-30 uppercase tracking-widest mb-1">Quy mô</p>
                  <p className="text-sm font-black theme-text">
                    {item.query.drug_ids.length} Thuốc | {item.query.disease_ids.length} Bệnh
                  </p>
               </div>
               <div className="bg-blue-600/10 p-2 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <ChevronRight size={20} />
               </div>
            </div>
          </motion.div>
        ))}

        {history.length === 0 && (
            <div className="p-20 text-center glass-card opacity-40">
                <p className="text-xl font-black uppercase tracking-widest">Chưa có dữ liệu lịch sử</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
