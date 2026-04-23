import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Info } from 'lucide-react';
import axios from 'axios';

const DiseaseLookup = () => {
  const [query, setQuery] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const fetchDiseases = async (search = '') => {
    try {
      const res = await axios.get(`http://localhost:5000/api/diseases?q=${search}`);
      setDiseases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={(e) => { e.preventDefault(); fetchDiseases(query); }} className="relative max-w-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên bệnh lý..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl dark:bg-slate-800 bg-white dark:text-white text-slate-900 border dark:border-slate-700 border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-lg transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {diseases.map((disease) => (
              <button
                key={disease.id}
                onClick={() => setSelectedDisease(disease)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedDisease?.id === disease.id 
                    ? 'border-blue-500 dark:bg-blue-900/30 bg-blue-50 shadow-md' 
                    : 'dark:border-slate-800 border-slate-100 dark:bg-slate-900 bg-white hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 dark:bg-emerald-900/50 bg-emerald-100 text-emerald-500 dark:text-emerald-400 rounded-lg">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white text-slate-800">{disease.name}</h4>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDisease ? (
            <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-100 p-8 rounded-3xl shadow-xl sticky top-8 transition-colors">
              <h2 className="text-3xl font-bold dark:text-white text-slate-800 mb-6">{selectedDisease.name}</h2>
              
              <div className="space-y-8">
                <section>
                  <h4 className="flex items-center gap-2 font-bold text-blue-500 mb-3">
                    <Info size={18} /> Mô tả bệnh lý
                  </h4>
                  <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-lg">{selectedDisease.description}</p>
                </section>

                <section>
                  <h4 className="flex items-center gap-2 font-bold text-amber-500 mb-3">
                    <Info size={18} /> Triệu chứng điển hình
                  </h4>
                  <div className="p-6 dark:bg-amber-900/20 bg-amber-50 rounded-2xl border dark:border-amber-900/30 border-amber-100 dark:text-amber-200 text-amber-900">
                    {selectedDisease.symptoms}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center dark:text-slate-600 text-slate-400 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-100 rounded-3xl p-8 transition-colors">
              <Stethoscope size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Chọn một bệnh lý để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseLookup;
