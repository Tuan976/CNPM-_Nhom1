import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, Package, ArrowUpRight, BarChart3, Zap } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const fontDisplay = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
const fontBody    = { fontFamily: '"Be Vietnam Pro", sans-serif' };

const BARS = [45, 72, 38, 91, 60, 83, 55];
const CATEGORIES = [
  { label: 'Thực phẩm tươi sống', pct: 82, color: 'var(--bc-coral)' },
  { label: 'Đồ uống giải khát',   pct: 68, color: 'var(--bc-blue)' },
  { label: 'Hóa mỹ phẩm',        pct: 40, color: 'var(--bc-orange)' },
  { label: 'Bánh kẹo & Snack',    pct: 25, color: 'var(--bc-teal)' },
];

function KPICard({ title, value, unit, icon: Icon, tint, color, dark, trend }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      className="rounded-3xl p-6 flex flex-col gap-5"
      style={{
        background: dark ? 'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))' : 'white',
        boxShadow: dark ? 'var(--bc-shadow-blue)' : 'var(--bc-shadow-2)',
        border: dark ? 'none' : '1px solid var(--bc-ink-100)',
      }}>
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
             style={{ background: dark ? 'rgba(255,255,255,0.15)' : tint }}>
          <Icon size={20} color={dark ? 'white' : color} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[11px] font-semibold rounded-full px-2 py-1"
                style={{ ...fontBody, background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(26,187,180,0.1)', color: dark ? 'white' : 'var(--bc-teal-700)' }}>
            <ArrowUpRight size={12} />{trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-medium mb-1.5"
           style={{ ...fontBody, color: dark ? 'rgba(255,255,255,0.65)' : 'var(--bc-ink-400)', letterSpacing: '0.05em' }}>
          {title}
        </p>
        <div className="flex items-end gap-1.5">
          <span className="text-3xl font-bold leading-none"
                style={{ ...fontDisplay, color: dark ? 'white' : 'var(--bc-ink-900)', letterSpacing: '-0.04em' }}>
            {value}
          </span>
          {unit && <span className="text-sm font-medium mb-0.5" style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'var(--bc-ink-300)' }}>{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function SalesDashboard() {
  const [stats, setStats] = useState({ revenue_today: 0, orders_today: 0, low_stock_count: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/summary', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => setStats(r.data)).catch(console.error);
  }, []);

  return (
    <div style={{ ...fontBody, paddingBottom: 24 }} className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-3 gap-5">
        <KPICard title="Doanh thu hôm nay"   value={stats.revenue_today.toLocaleString('vi-VN')} unit="đ"   icon={DollarSign}    dark trend="+12.5%" />
        <KPICard title="Tổng số hóa đơn"     value={stats.orders_today}  unit="đơn" icon={ShoppingBag}  tint="var(--bc-coral-tint)"  color="var(--bc-coral)"  trend="+8%" />
        <KPICard title="Sản phẩm tồn thấp"   value={stats.low_stock_count} unit="SP" icon={AlertTriangle} tint="var(--bc-orange-tint)" color="var(--bc-orange)" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Bar chart — dark card */}
        <div className="rounded-3xl p-7 flex flex-col gap-6" style={{ background: 'var(--bc-ink-900)', boxShadow: 'var(--bc-shadow-4)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium mb-1" style={{ ...fontBody, color: 'var(--bc-blue)', letterSpacing: '0.1em' }}>THỐNG KÊ</p>
              <h3 className="text-lg font-bold leading-tight" style={{ ...fontDisplay, color: 'white', letterSpacing: '-0.03em' }}>
                Doanh thu 7 ngày
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
                 style={{ ...fontBody, background: 'rgba(74,144,255,0.15)', color: 'var(--bc-blue)', border: '1px solid rgba(74,144,255,0.25)' }}>
              <Zap size={10} /> Live
            </div>
          </div>
          <div className="flex items-end gap-3 h-32">
            {BARS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22,1,0.36,1] }}
                  className="w-full rounded-xl cursor-pointer transition-opacity hover:opacity-75"
                  style={{
                    background: i === 3
                      ? 'linear-gradient(180deg,var(--bc-blue),var(--bc-blue-700))'
                      : 'rgba(74,144,255,0.25)',
                    boxShadow: i === 3 ? 'var(--bc-shadow-blue)' : 'none',
                  }} />
                <span className="text-[9px] font-medium" style={{ ...fontBody, color: 'var(--bc-ink-500)' }}>T.{i+2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category chart — white card */}
        <div className="rounded-3xl p-7 flex flex-col gap-6 bg-white"
             style={{ boxShadow: 'var(--bc-shadow-2)', border: '1px solid var(--bc-ink-100)' }}>
          <div>
            <p className="text-[11px] font-medium mb-1" style={{ ...fontBody, color: 'var(--bc-ink-300)', letterSpacing: '0.1em' }}>PHÂN TÍCH</p>
            <h3 className="text-lg font-bold leading-tight" style={{ ...fontDisplay, color: 'var(--bc-ink-900)', letterSpacing: '-0.03em' }}>
              Nhóm hàng bán chạy
            </h3>
          </div>
          <div className="space-y-5">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium" style={{ ...fontBody, color: 'var(--bc-ink-700)' }}>{cat.label}</span>
                  <span className="text-[12px] font-bold" style={{ ...fontBody, color: cat.color }}>{cat.pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bc-ink-100)' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22,1,0.36,1] }}
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
