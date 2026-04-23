import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import Dashboard from '../components/Dashboard';
import DrugLookup from '../components/DrugLookup';
import DiseaseLookup from '../components/DiseaseLookup';
import InteractionTool from '../components/InteractionTool';
import AIAssistant from '../components/AIAssistant';
import {
  Activity, LayoutDashboard, Pill, Stethoscope, ArrowLeftRight,
  Sparkles, LogOut, ShieldCheck, Sun, Moon
} from 'lucide-react';

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => { logout(); navigate('/'); };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
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
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const tabTitles = {
    dashboard: 'Bảng điều khiển Admin', drugs: 'Tra cứu thuốc',
    diseases: 'Tra cứu bệnh', interactions: 'Kiểm tra tương tác', ai: 'Trợ lý AI'
  };

  return (
    <div className="flex min-h-screen dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col h-screen sticky top-0 dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-200 border-r transition-colors duration-300">
        <div className="p-6 dark:border-slate-800 border-slate-100 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl"><Activity size={22} className="text-white" /></div>
            <div>
              <span className="font-bold dark:text-slate-100 text-slate-800 block">MediCheck AI</span>
              <span className="text-xs text-blue-500 font-semibold">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'dark:text-slate-400 text-slate-500 dark:hover:bg-slate-800 hover:bg-slate-100 dark:hover:text-white hover:text-slate-800'
              }`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 dark:border-slate-800 border-slate-100 border-t">
          <div className="flex items-center gap-3 p-3 rounded-xl dark:bg-slate-800 bg-slate-50 dark:border-slate-700 border-slate-200 border mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="dark:text-slate-100 text-slate-800 text-sm font-bold truncate">{user?.full_name}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-blue-500" />
                <p className="text-blue-500 text-xs font-semibold">Quản trị viên</p>
              </div>
            </div>
          </div>

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm mb-2 transition-all dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200">
            {theme === 'dark'
              ? <><Sun size={16} className="text-yellow-400" /> Chuyển sang sáng</>
              : <><Moon size={16} className="text-blue-500" /> Chuyển sang tối</>}
          </button>

          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl dark:text-slate-400 text-slate-500 hover:text-red-500 dark:hover:bg-red-500/10 hover:bg-red-50 transition-all text-sm">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
        <header className="sticky top-0 z-10 dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 border-slate-200 border-b px-8 py-4 flex items-center justify-between transition-colors duration-300">
          <div>
            <h1 className="text-xl font-bold dark:text-slate-100 text-slate-800">{tabTitles[activeTab]}</h1>
            <p className="dark:text-slate-500 text-slate-400 text-xs">Hệ thống tra cứu y tế chuyên nghiệp</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme}
              title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
              className="p-2.5 rounded-xl transition-all hover:scale-110 dark:bg-slate-800 dark:border-slate-700 bg-slate-100 border border-slate-200">
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>
            <span className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold border dark:border-blue-500/30 border-blue-200">
              ⚙ Admin
            </span>
          </div>
        </header>
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminPanel;
