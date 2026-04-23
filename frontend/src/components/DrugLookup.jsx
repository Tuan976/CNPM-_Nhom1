import React, { useState, useEffect } from 'react';
import { Search, Pill, Info, AlertCircle, Activity } from 'lucide-react';
import axios from 'axios';

const DrugLookup = () => {
  const [query, setQuery] = useState('');
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);

  const fetchDrugs = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/drugs?q=${search}`);
      setDrugs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDrugs(query);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên thuốc hoặc hoạt chất..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl dark:bg-slate-800 bg-white dark:text-white text-slate-900 border dark:border-slate-700 border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-lg transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold dark:text-slate-200 text-slate-800 px-2">Kết quả ({drugs.length})</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {drugs.map((drug) => (
              <button
                key={drug.id}
                onClick={() => setSelectedDrug(drug)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedDrug?.id === drug.id 
                    ? 'border-blue-500 dark:bg-blue-900/30 bg-blue-50 shadow-md' 
                    : 'dark:border-slate-800 border-slate-100 dark:bg-slate-900 bg-white hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 dark:bg-blue-900/50 bg-blue-100 text-blue-500 dark:text-blue-400 rounded-lg">
                    <Pill size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white text-slate-800">{drug.name}</h4>
                    <p className="text-xs dark:text-slate-500 text-slate-500 truncate">{drug.ingredients}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDrug ? (
            <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-100 p-8 rounded-3xl shadow-xl sticky top-8 transition-colors">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold dark:text-white text-slate-800 mb-2">{selectedDrug.name}</h2>
                  <span className="dark:bg-blue-900/50 bg-blue-100 dark:text-blue-400 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                    Hoạt chất: {selectedDrug.ingredients}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <section>
                    <h4 className="flex items-center gap-2 font-bold text-emerald-500 mb-2">
                      <Info size={18} /> Chỉ định
                    </h4>
                    <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{selectedDrug.indications}</p>
                  </section>
                  <section>
                    <h4 className="flex items-center gap-2 font-bold dark:text-slate-200 text-slate-800 mb-2">
                      <Activity size={18} /> Liều dùng
                    </h4>
                    <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{selectedDrug.dosage}</p>
                  </section>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="flex items-center gap-2 font-bold text-rose-500 mb-2">
                      <AlertCircle size={18} /> Chống chỉ định
                    </h4>
                    <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{selectedDrug.contraindications}</p>
                  </section>
                  <section>
                    <h4 className="flex items-center gap-2 font-bold text-amber-500 mb-2">
                      <AlertCircle size={18} /> Tác dụng phụ
                    </h4>
                    <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{selectedDrug.side_effects}</p>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center dark:text-slate-600 text-slate-400 dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-100 rounded-3xl p-8 transition-colors">
              <Pill size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Chọn một loại thuốc để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugLookup;
