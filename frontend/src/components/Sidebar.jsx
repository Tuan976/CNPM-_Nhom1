import React from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  Stethoscope, 
  ArrowLeftRight, 
  MessageSquareText,
  Activity
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'drugs', label: 'Tra cứu thuốc', icon: <Pill size={20} /> },
    { id: 'diseases', label: 'Tra cứu bệnh', icon: <Stethoscope size={20} /> },
    { id: 'interactions', label: 'Kiểm tra tương tác', icon: <ArrowLeftRight size={20} /> },
    { id: 'ai', label: 'Trợ lý AI', icon: <MessageSquareText size={20} /> },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <Activity size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">MediCheck AI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === item.id 
                ? 'active text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card p-4 bg-slate-900 text-white rounded-2xl">
          <p className="text-xs text-slate-400 mb-2">Hỗ trợ kỹ thuật</p>
          <p className="text-sm font-semibold">Hotline: 1900-XXXX</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
