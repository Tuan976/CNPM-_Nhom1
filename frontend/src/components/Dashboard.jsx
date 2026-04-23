import React from 'react';
import { Pill, Stethoscope, MessageSquare, ShieldAlert } from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
  const stats = [
    { label: 'Thuốc trong kho', value: '1,240+', icon: <Pill />, color: 'bg-blue-500' },
    { label: 'Danh mục bệnh', value: '850+', icon: <Stethoscope />, color: 'bg-emerald-500' },
    { label: 'Yêu cầu AI/ngày', value: '45', icon: <MessageSquare />, color: 'bg-purple-500' },
    { label: 'Cảnh báo tương tác', value: '12', icon: <ShieldAlert />, color: 'bg-rose-500' },
  ];

  const quickActions = [
    { id: 'drugs', title: 'Tra cứu thuốc', desc: 'Thông tin chỉ định, chống chỉ định' },
    { id: 'interactions', title: 'Kiểm tra tương tác', desc: 'Thuốc - Thuốc, Thuốc - Bệnh' },
    { id: 'ai', title: 'Trợ lý AI', desc: 'Hỏi đáp y tế thông minh' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-2xl text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Thao tác nhanh</h2>
          <div className="space-y-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
              >
                <div className="text-left">
                  <h4 className="font-semibold text-slate-800">{action.title}</h4>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
                <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Pill size={18} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 bg-blue-600 text-white">
          <h2 className="text-xl font-bold mb-4">Cập nhật hệ thống</h2>
          <p className="text-blue-100 mb-6">
            Dữ liệu dược phẩm đã được cập nhật vào ngày 23/04/2026. Tích hợp AI Gemini Pro mới nhất để phân tích tương tác thuốc phức tạp.
          </p>
          <button 
            onClick={() => setActiveTab('ai')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
          >
            Trò chuyện với AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
