import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Pill, Stethoscope, AlertTriangle, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';
import axios from 'axios';

const InteractionTool = () => {
  const [drugs, setDrugs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  
  const [selectedDrug, setSelectedDrug] = useState('');
  const [targetType, setTargetType] = useState('disease');
  const [targetId, setTargetId] = useState('');
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [drugsRes, diseasesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/drugs'),
        axios.get('http://localhost:5000/api/diseases')
      ]);
      setDrugs(drugsRes.data);
      setDiseases(diseasesRes.data);
    };
    fetchData();
  }, []);

  const handleCheck = async () => {
    if (!selectedDrug || !targetId) return;
    
    setLoading(true);
    setResult(null);
    setAiResult('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/check-interaction', {
        drug_id: selectedDrug,
        target_type: targetType,
        target_id: targetId
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAiAnalyze = async () => {
    const drugName = drugs.find(d => d.id === parseInt(selectedDrug))?.name;
    const targetName = targetType === 'drug' 
      ? drugs.find(d => d.id === parseInt(targetId))?.name 
      : diseases.find(d => d.id === parseInt(targetId))?.name;

    setAiLoading(true);
    try {
      const prompt = `Phân tích tương tác giữa thuốc ${drugName} và ${targetType === 'drug' ? 'thuốc' : 'bệnh'} ${targetName}. Cho biết mức độ nghiêm trọng và lời khuyên cho bác sĩ.`;
      const res = await axios.post('http://localhost:5000/api/ai-analyze', { prompt });
      setAiResult(res.data.response);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const getSeverityClasses = (severity) => {
    switch (severity) {
      case 'Severe': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-100 p-8 rounded-3xl shadow-xl transition-colors">
        <h2 className="text-2xl font-bold mb-8 dark:text-white text-slate-800 flex items-center gap-3">
          <div className="p-2 dark:bg-blue-900/50 bg-blue-50 text-blue-500 rounded-lg">
            <ArrowLeftRight size={24} />
          </div>
          Kiểm tra tương tác & Gợi ý thay thế
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <div className="space-y-2">
            <label className="text-sm font-bold dark:text-slate-400 text-slate-600">Chọn Thuốc</label>
            <select 
              value={selectedDrug}
              onChange={(e) => setSelectedDrug(e.target.value)}
              className="w-full p-4 rounded-xl dark:bg-slate-800 bg-slate-50 dark:border-slate-700 border-slate-200 dark:text-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-colors"
            >
              <option value="">-- Chọn thuốc --</option>
              {drugs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.ingredients})</option>)}
            </select>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="space-y-2 w-full">
              <label className="text-sm font-bold dark:text-slate-400 text-slate-600 text-center block">Đối tượng kiểm tra</label>
              <div className="flex dark:bg-slate-800 bg-slate-50 p-1 rounded-xl border dark:border-slate-700 border-slate-200">
                <button 
                  onClick={() => { setTargetType('drug'); setTargetId(''); }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${targetType === 'drug' ? 'dark:bg-slate-700 bg-white shadow-sm text-blue-500' : 'dark:text-slate-500 text-slate-500'}`}
                >
                  Thuốc
                </button>
                <button 
                  onClick={() => { setTargetType('disease'); setTargetId(''); }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${targetType === 'disease' ? 'dark:bg-slate-700 bg-white shadow-sm text-blue-500' : 'dark:text-slate-500 text-slate-500'}`}
                >
                  Bệnh
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold dark:text-slate-400 text-slate-600">
              {targetType === 'drug' ? 'Chọn Thuốc thứ 2' : 'Chọn Bệnh lý'}
            </label>
            <select 
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full p-4 rounded-xl dark:bg-slate-800 bg-slate-50 dark:border-slate-700 border-slate-200 dark:text-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-colors"
            >
              <option value="">-- Chọn mục --</option>
              {targetType === 'drug' 
                ? drugs.filter(d => d.id !== parseInt(selectedDrug)).map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                : diseases.map(d => <option key={d.id} value={d.id}>{d.name} ({d.icd10})</option>)
              }
            </select>
          </div>
        </div>

        <button 
          onClick={handleCheck}
          disabled={!selectedDrug || !targetId || loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang kiểm tra...' : 'Bắt đầu kiểm tra'}
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className={`dark:bg-slate-900 bg-white border p-8 rounded-3xl border-l-8 transition-colors ${result.found ? getSeverityClasses(result.severity) : 'dark:border-slate-800 border-slate-200'}`}>
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex gap-4">
                {result.found ? (
                  <AlertTriangle size={32} className="mt-1 flex-shrink-0" />
                ) : (
                  <CheckCircle size={32} className="text-emerald-500 mt-1 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">
                    {result.found ? `Cảnh báo: ${result.severity}` : 'Không tìm thấy tương tác trực tiếp'}
                  </h3>
                  <p className="text-lg leading-relaxed dark:text-slate-400 text-slate-600">
                    {result.found ? result.description : 'Hệ thống không ghi nhận tương tác nào trong cơ sở dữ liệu. Bạn có thể sử dụng AI để phân tích sâu hơn.'}
                  </p>
                </div>
              </div>
              {!result.found && (
                <button 
                  onClick={handleAiAnalyze}
                  disabled={aiLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex-shrink-0"
                >
                  <Sparkles size={18} /> {aiLoading ? 'AI đang nghĩ...' : 'Phân tích với AI'}
                </button>
              )}
            </div>
          </div>

          {/* Smart Alternatives */}
          {result.found && result.alternatives && result.alternatives.length > 0 && (
            <div className="dark:bg-emerald-950/20 bg-emerald-50 border border-emerald-500/30 p-8 rounded-3xl animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500 text-white rounded-lg">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-xl font-bold dark:text-emerald-400 text-emerald-700">Gợi ý thay thế an toàn hơn</h3>
              </div>
              <p className="text-sm dark:text-emerald-500 text-emerald-600 mb-6">Các loại thuốc dưới đây thuộc cùng nhóm dược lý nhưng chưa ghi nhận tương tác với đối tượng bạn đã chọn:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.alternatives.map((alt) => (
                  <div key={alt.id} className="dark:bg-slate-900 bg-white p-4 rounded-2xl border dark:border-emerald-500/20 border-emerald-200 flex items-center justify-between group hover:border-emerald-500 transition-all">
                    <div>
                      <h4 className="font-bold dark:text-white text-slate-800">{alt.name}</h4>
                      <p className="text-xs dark:text-slate-500 text-slate-500">{alt.ingredients}</p>
                    </div>
                    <div className="text-emerald-500 group-hover:translate-x-1 transition-transform">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {aiResult && (
        <div className="dark:bg-slate-900 bg-slate-900 text-white p-8 rounded-3xl animate-in zoom-in-95 duration-300 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Phân tích chuyên sâu từ AI</h3>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-slate-300 text-lg">
              {aiResult}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractionTool;
