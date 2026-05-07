import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Calendar, Download, Target, ShoppingBag, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const fd = { fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro",sans-serif' };

function MetricCard({ title, value, icon: Icon, color, tint, suffix }) {
  return (
    <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }}
      className="bg-white rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden"
      style={{ border:'1px solid var(--bc-ink-100)', boxShadow:'var(--bc-shadow-1)' }}>
      <div className="flex items-center justify-between z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: tint }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-slate-50 flex items-center justify-center text-slate-300">
          <ArrowUpRight size={18} />
        </div>
      </div>
      <div className="z-10">
        <p className="text-[12px] font-semibold mb-1" style={{ color:'var(--bc-ink-400)', letterSpacing:'0.05em' }}>{title}</p>
        <div className="flex items-end gap-1">
          <h3 className="text-3xl font-bold leading-none" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>
            {value.toLocaleString('vi-VN')}
          </h3>
          {suffix && <span className="text-sm font-bold mb-0.5" style={{ color:'var(--bc-ink-300)' }}>{suffix}</span>}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-12 pointer-events-none">
        <Icon size={120} />
      </div>
    </motion.div>
  );
}

export default function RevenueReport() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState({ summary: {}, chart: [], top_products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/dashboard/analytics?days=${days}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, [days]);

  const maxRevenue = Math.max(...(data.chart?.map(d => d.revenue) || [0]), 1);

  return (
    <div className="space-y-5" style={{ ...fb, paddingBottom: 24 }}>
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4"
           style={{ boxShadow:'var(--bc-shadow-1)', border:'1px solid var(--bc-ink-100)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:'var(--bc-blue-tint)' }}>
            <BarChart3 size={24} style={{ color:'var(--bc-blue)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>Báo cáo doanh thu</h2>
            <p className="text-[13px] font-medium" style={{ color:'var(--bc-ink-400)' }}>Phân tích hiệu quả kinh doanh chi tiết</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {[7, 14, 30].map(d => (
              <button key={d} onClick={() => setDays(d)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                style={{
                  background: days === d ? 'white' : 'transparent',
                  color: days === d ? 'var(--bc-blue-700)' : 'var(--bc-ink-400)',
                  boxShadow: days === d ? 'var(--bc-shadow-1)' : 'none'
                }}>
                {d} Ngày
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-slate-600 text-[13px] font-bold bg-white hover:bg-slate-50 border border-slate-200 transition-all">
            <Download size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div></div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-5">
            <MetricCard title="TỔNG DOANH THU" value={data.summary.total_revenue || 0} suffix="đ" icon={DollarSign} color="var(--bc-blue)" tint="var(--bc-blue-tint)" />
            <MetricCard title="TỔNG LỢI NHUẬN" value={data.summary.total_profit || 0} suffix="đ" icon={Target} color="var(--bc-teal)" tint="var(--bc-teal-tint)" />
            <MetricCard title="TỔNG SỐ HÓA ĐƠN" value={data.summary.total_orders || 0} suffix="Đơn" icon={ShoppingBag} color="var(--bc-coral)" tint="var(--bc-coral-tint)" />
            <MetricCard title="BIÊN LỢI NHUẬN" value={data.summary.profit_margin || 0} suffix="%" icon={PieChart} color="var(--bc-orange)" tint="var(--bc-orange-tint)" />
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* Chart */}
            <div className="col-span-2 bg-white rounded-3xl p-7 flex flex-col gap-6" style={{ border:'1px solid var(--bc-ink-100)', boxShadow:'var(--bc-shadow-1)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-semibold mb-1" style={{ color:'var(--bc-ink-400)', letterSpacing:'0.1em' }}>BIỂU ĐỒ TĂNG TRƯỞNG</p>
                  <h3 className="text-lg font-bold" style={{ ...fd, color:'var(--bc-ink-900)' }}>Doanh thu & Lợi nhuận</h3>
                </div>
                <div className="flex gap-4 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background:'var(--bc-blue)' }}></span>Doanh thu</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background:'var(--bc-teal)' }}></span>Lợi nhuận</div>
                </div>
              </div>

              <div className="flex-1 min-h-[250px] flex items-end gap-2 sm:gap-4 mt-4 pt-4 border-t border-dashed border-slate-200 relative">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="w-full h-px bg-slate-400"></div>
                  <div className="w-full h-px bg-slate-400"></div>
                  <div className="w-full h-px bg-slate-400"></div>
                  <div className="w-full h-px bg-slate-400"></div>
                </div>

                {data.chart?.map((d, i) => {
                  const rH = Math.max((d.revenue / maxRevenue) * 100, 2);
                  const pH = Math.max((d.profit / maxRevenue) * 100, 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 relative group">
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] p-2 rounded-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                        DT: {d.revenue.toLocaleString()}đ<br/>LN: {d.profit.toLocaleString()}đ
                      </div>
                      <div className="w-full h-full flex items-end justify-center relative">
                        {/* Cột doanh thu (Xanh dương đậm) */}
                        <motion.div initial={{ height: 0 }} animate={{ height: `${rH}%` }} transition={{ delay: i*0.05 }}
                          className="w-full max-w-[40px] rounded-t-xl absolute bottom-0"
                          style={{ background:'linear-gradient(180deg, var(--bc-blue), var(--bc-blue-700))' }} />
                        {/* Cột lợi nhuận (Xanh mòng két nhạt hơn) */}
                        <motion.div initial={{ height: 0 }} animate={{ height: `${pH}%` }} transition={{ delay: i*0.05 + 0.1 }}
                          className="w-full max-w-[40px] rounded-t-xl absolute bottom-0 opacity-90"
                          style={{ background:'var(--bc-teal)', boxShadow:'0 -4px 12px rgba(26,187,180,0.4)' }} />
                      </div>
                      <span className="text-[10px] font-bold" style={{ color:'var(--bc-ink-400)' }}>{d.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-3xl p-7" style={{ border:'1px solid var(--bc-ink-100)', boxShadow:'var(--bc-shadow-1)' }}>
               <div>
                <p className="text-[11px] font-semibold mb-1" style={{ color:'var(--bc-ink-400)', letterSpacing:'0.1em' }}>TOP SẢN PHẨM</p>
                <h3 className="text-lg font-bold" style={{ ...fd, color:'var(--bc-ink-900)' }}>Bán chạy nhất</h3>
              </div>
              <div className="mt-6 space-y-4">
                {data.top_products?.length === 0 ? (
                  <p className="text-[13px] text-slate-400 text-center py-10">Chưa có dữ liệu.</p>
                ) : (
                  data.top_products?.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
                           style={{ background: i===0 ? 'var(--bc-coral-tint)' : i===1 ? 'var(--bc-orange-tint)' : i===2 ? 'var(--bc-blue-tint)' : 'var(--bc-bg-soft)',
                                    color: i===0 ? 'var(--bc-coral)' : i===1 ? 'var(--bc-orange)' : i===2 ? 'var(--bc-blue)' : 'var(--bc-ink-400)' }}>
                        #{i+1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ ...fd, color:'var(--bc-ink-900)' }}>{p.name}</p>
                        <p className="text-[11px] font-medium" style={{ color:'var(--bc-ink-400)' }}>Đã bán: {p.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-bold" style={{ color:'var(--bc-teal)' }}>{p.rev.toLocaleString()}đ</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
