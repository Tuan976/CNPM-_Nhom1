import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import DrugLookup from '../components/DrugLookup';
import DiseaseLookup from '../components/DiseaseLookup';
import InteractionTool from '../components/InteractionTool';
import AIAssistant from '../components/AIAssistant';
import {
  Activity, Pill, Stethoscope, ArrowLeftRight, Sparkles,
  LayoutDashboard, LogOut, ChevronRight, Bell, Sun, Moon
} from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => { logout(); navigate('/'); };

  const menuItems = [
    { id: 'home', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'drugs', label: 'Tra cứu thuốc', icon: <Pill size={20} /> },
    { id: 'diseases', label: 'Tra cứu bệnh', icon: <Stethoscope size={20} /> },
    { id: 'interactions', label: 'Kiểm tra tương tác', icon: <ArrowLeftRight size={20} /> },
    { id: 'ai', label: 'Trợ lý AI', icon: <Sparkles size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'drugs': return <DrugLookup />;
      case 'diseases': return <DiseaseLookup />;
      case 'interactions': return <InteractionTool />;
      case 'ai': return <AIAssistant />;
      default: return (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Chào mừng, {user?.full_name}! 👋</h2>
              <p className="text-blue-100 mb-6">Hệ thống MediCheck AI đã sẵn sàng hỗ trợ bạn.</p>
              <button onClick={() => setActiveTab('ai')} className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                Hỏi Trợ lý AI →
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setActiveTab('drugs')} className="glass-card p-6 text-left hover:-translate-y-1 transition-all">
              <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl w-fit mb-4"><Pill size={24} /></div>
              <h3 className="font-bold text-lg mb-1 theme-text">Tra cứu thuốc</h3>
              <p className="text-sm opacity-60 theme-text">Xem chỉ định và liều dùng</p>
            </button>
            <button onClick={() => setActiveTab('interactions')} className="glass-card p-6 text-left hover:-translate-y-1 transition-all">
              <div className="bg-orange-500/10 text-orange-500 p-3 rounded-xl w-fit mb-4"><ArrowLeftRight size={24} /></div>
              <h3 className="font-bold text-lg mb-1 theme-text">Kiểm tra tương tác</h3>
              <p className="text-sm opacity-60 theme-text">Phát hiện tương tác nguy hiểm</p>
            </button>
          </div>
        </div>
      );
    }
  };

  const tabTitles = { home: 'Tổng quan', drugs: 'Tra cứu thuốc', diseases: 'Tra cứu bệnh', interactions: 'Kiểm tra tương tác', ai: 'Trợ lý AI' };

  return (
    <div className="flex min-h-screen theme-bg transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col h-screen sticky top-0 border-r theme-border transition-colors duration-300" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
        <div className="p-6 flex items-center gap-3 border-b theme-border">
          <div className="bg-blue-600 p-2 rounded-xl"><Activity size={20} className="text-white" /></div>
          <span className="font-bold theme-text">MediCheck AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === item.id ? 'nav-item-active' : 'theme-text opacity-60 hover:opacity-100 hover:bg-slate-500/10'
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t theme-border space-y-2">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all border theme-border theme-text" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {theme === 'dark' ? <><Sun size={16} className="text-yellow-400" /> Sáng</> : <><Moon size={16} className="text-blue-500" /> Tối</>}
          </button>

          <div className="flex items-center gap-3 p-3 rounded-xl theme-border border" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate theme-text">{user?.full_name}</p>
              <p className="text-xs truncate theme-text opacity-50">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-500 transition-all text-sm">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 backdrop-blur-xl border-b theme-border px-8 py-4 flex items-center justify-between transition-colors" style={{ backgroundColor: 'var(--bg-sidebar)' + 'e6' }}>
          <h1 className="text-xl font-bold theme-text">{tabTitles[activeTab]}</h1>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border theme-border theme-text hover:scale-105 transition-all">
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-500" />}
            </button>
            <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">User</span>
          </div>
        </header>
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
