import React, { useState, useContext } from 'react';
import { LayoutDashboard, LogOut, ChevronRight, Bell, ShoppingCart, Package, FileText, Users, TrendingUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import SalesDashboard from '../components/SalesDashboard';
import POSInterface from '../components/POSInterface';
import InventoryManager from '../components/InventoryManager';
import OrderHistory from '../components/OrderHistory';
import StaffManager from '../components/StaffManager';
import CustomerManager from '../components/CustomerManager';
import RevenueReport from '../components/RevenueReport';
import SupplierManager from '../components/SupplierManager';
import PromotionManager from '../components/PromotionManager';
import { Gift, BarChart3, Truck, Tag } from 'lucide-react';

const menuItems = [
  { id: 'home',      label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'analytics', label: 'Báo cáo doanh thu', icon: BarChart3 },
  { id: 'pos',       label: 'Bán hàng POS',       icon: ShoppingCart },
  { id: 'inventory', label: 'Kho sản phẩm',       icon: Package },
  { id: 'orders',    label: 'Lịch sử giao dịch',  icon: FileText },
  { id: 'customers', label: 'Khách hàng',         icon: Gift },
  { id: 'suppliers', label: 'Nhà cung cấp',       icon: Truck },
  { id: 'promotions',label: 'Khuyến mãi',         icon: Tag },
  { id: 'staff',     label: 'Đội ngũ nhân sự',    icon: Users },
];

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('home');
  const active = menuItems.find(i => i.id === activeTab);

  const fontDisplay = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
  const fontBody    = { fontFamily: '"Be Vietnam Pro", sans-serif' };

  return (
    <div className="premium-bg flex min-h-screen p-4 gap-4" style={{ ...fontBody, minHeight: '100vh' }}>

      {/* ── SIDEBAR ── */}
      <aside className="glass-panel w-60 shrink-0 rounded-3xl flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="px-5 pt-7 pb-5 flex items-center gap-3 border-b" style={{ borderColor: 'var(--bc-ink-100)' }}>
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-sm font-bold"
               style={{ background: 'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))', boxShadow: 'var(--bc-shadow-blue)' }}>
            M
          </div>
          <div>
            <h1 className="text-base font-bold leading-none" style={{ ...fontDisplay, color: 'var(--bc-ink-900)', letterSpacing: '-0.03em' }}>
              Mini<span style={{ color: 'var(--bc-coral)' }}>Mart</span>
            </h1>
            <p className="text-[9px] font-semibold mt-0.5" style={{ color: 'var(--bc-ink-300)', letterSpacing: '0.08em' }}>
              POS SYSTEM
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200 text-left"
                style={{
                  fontFamily: '"Be Vietnam Pro", sans-serif',
                  color: isActive ? 'white' : 'var(--bc-ink-500)',
                  background: isActive ? 'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))' : 'transparent',
                  boxShadow: isActive ? 'var(--bc-shadow-blue)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bc-blue-tint)'; e.currentTarget.style.color = 'var(--bc-ink-700)'; }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--bc-ink-500)'; } }}>
                <Icon size={17} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        {/* User card */}
        <div className="p-3 m-3 mt-4 rounded-2xl flex items-center gap-3"
             style={{ background: 'var(--bc-bg-soft)', border: '1px solid var(--bc-ink-100)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
               style={{ background: 'var(--bc-ink-900)', fontFamily: '"Bricolage Grotesque", sans-serif' }}>
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--bc-ink-900)', fontFamily: '"Be Vietnam Pro", sans-serif' }}>
              {user?.name}
            </p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--bc-ink-300)' }}>{user?.role}</p>
          </div>
          <button onClick={logout}
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'var(--bc-ink-300)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bc-coral-tint)'; e.currentTarget.style.color = 'var(--bc-coral)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--bc-ink-300)'; }}>
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="glass-panel rounded-3xl px-7 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--bc-blue)', letterSpacing: '0.12em', fontFamily: '"Be Vietnam Pro", sans-serif' }}>
              MiniMart · Quận 1 · Đang hoạt động
            </p>
            <h2 className="text-2xl font-bold leading-none" style={{ ...fontDisplay, color: 'var(--bc-ink-900)', letterSpacing: '-0.04em' }}>
              {active?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-2xl flex items-center justify-center transition-colors"
                    style={{ background: 'white', border: '1px solid var(--bc-ink-100)', color: 'var(--bc-ink-500)', boxShadow: 'var(--bc-shadow-1)' }}>
              <Bell size={17} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-semibold"
                 style={{ background: 'rgba(26,187,180,0.1)', color: 'var(--bc-teal-700)', border: '1px solid rgba(26,187,180,0.25)', fontFamily: '"Be Vietnam Pro", sans-serif' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--bc-teal)' }}></span>
              Hệ thống online
            </div>
            <button className="px-5 py-2.5 rounded-full text-white text-[12px] font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,var(--bc-coral),var(--bc-coral-700))', boxShadow: 'var(--bc-shadow-coral)', fontFamily: '"Be Vietnam Pro", sans-serif' }}>
              + Tạo đơn mới
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
          {activeTab === 'home'      && <SalesDashboard />}
          {activeTab === 'analytics' && <RevenueReport />}
          {activeTab === 'pos'       && <POSInterface />}
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'orders'    && <OrderHistory />}
          {activeTab === 'customers' && <CustomerManager />}
          {activeTab === 'suppliers' && <SupplierManager />}
          {activeTab === 'promotions'&& <PromotionManager />}
          {activeTab === 'staff'     && <StaffManager />}
          {!['home','analytics','pos','inventory','orders','customers','suppliers','promotions','staff'].includes(activeTab) && (
            <div className="h-48 flex flex-col items-center justify-center gap-3" style={{ color: 'var(--bc-ink-300)' }}>
              <TrendingUp size={40} />
              <p className="text-sm font-semibold">Đang phát triển...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
