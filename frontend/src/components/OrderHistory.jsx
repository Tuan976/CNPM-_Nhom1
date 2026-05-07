import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Search, Filter, ChevronLeft, ChevronRight,
  Eye, Trash2, X, Package, CreditCard, User, Clock,
  TrendingUp, ShoppingBag, DollarSign, Receipt
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const fontDisplay = { fontFamily: '"Bricolage Grotesque", "Be Vietnam Pro", sans-serif' };
const fontBody    = { fontFamily: '"Be Vietnam Pro", sans-serif' };

const PAYMENT_LABELS = { Cash: 'Tiền mặt', QR: 'QR Code', Card: 'Thẻ ngân hàng' };
const PAYMENT_COLORS = { Cash: '#1abbb4', QR: '#4a90ff', Card: '#ff8c52' };
const PAYMENT_TINTS  = { Cash: 'rgba(26,187,180,0.1)', QR: 'rgba(74,144,255,0.1)', Card: 'rgba(255,140,82,0.1)' };

function Badge({ method }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
          style={{ ...fontBody, background: PAYMENT_TINTS[method] || 'var(--bc-blue-tint)', color: PAYMENT_COLORS[method] || 'var(--bc-blue)' }}>
      <CreditCard size={11} />
      {PAYMENT_LABELS[method] || method}
    </span>
  );
}

function OrderDetailModal({ order, onClose, onDelete }) {
  if (!order) return null;
  const total_items = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  const printReceipt = () => {
    const timeStr = new Date(order.created_at).toLocaleString('vi-VN');
    const methodLabel = PAYMENT_LABELS[order.payment_method] || order.payment_method;
    
    const rows = order.items?.map(i => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;">${i.product_name}</td>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;text-align:right;">${i.unit_price.toLocaleString('vi-VN')}đ</td>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;text-align:right;font-weight:700;">${i.subtotal.toLocaleString('vi-VN')}đ</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html lang="vi"><head>
      <meta charset="UTF-8"/>
      <title>Hóa đơn ${order.order_number}</title>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Be Vietnam Pro',sans-serif;font-size:14px;color:#0e1530;background:#fff;padding:20px;max-width:380px;margin:0 auto;}
        .logo{text-align:center;padding:16px 0 8px;border-bottom:2px dashed #e3e6ef;margin-bottom:12px}
        .logo h1{font-size:26px;font-weight:800;letter-spacing:-1px;color:#0e1530;}
        .logo h1 span{color:#ff6b5e}
        .logo p{font-size:11px;color:#a8afc4;letter-spacing:1px;margin-top:4px}
        .meta{font-size:12px;color:#5c668a;margin-bottom:12px;line-height:1.8}
        .meta strong{color:#0e1530}
        .divider{border:none;border-top:1px dashed #e3e6ef;margin:10px 0}
        table{width:100%;border-collapse:collapse;font-size:13px}
        thead th{font-size:11px;color:#a8afc4;text-transform:uppercase;letter-spacing:.05em;padding:4px 0;border-bottom:2px solid #e3e6ef;}
        thead th:not(:first-child){text-align:right}
        thead th:nth-child(2){text-align:center}
        .total-row td{padding:6px 0;font-size:14px}
        .grand-total td{padding:10px 0;font-size:20px;font-weight:800;color:#4a90ff;border-top:2px solid #e3e6ef}
        .footer{text-align:center;margin-top:20px;padding-top:14px;border-top:2px dashed #e3e6ef;font-size:12px;color:#a8afc4;line-height:1.9}
        .badge{display:inline-block;background:#e6efff;color:#4a90ff;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.05em}
        @media print{body{padding:0}@page{margin:8mm;size:80mm auto}}
      </style>
    </head><body>
      <div class="logo">
        <h1>Mini<span>Mart</span></h1>
        <p>HÓA ĐƠN BÁN HÀNG · BẢN SAO</p>
      </div>
      <div class="meta">
        <strong>Số HĐ:</strong> ${order.order_number}<br>
        <strong>Thời gian:</strong> ${timeStr}<br>
        <strong>Nhân viên:</strong> ${order.staff_name}<br>
        <strong>Thanh toán:</strong> <span class="badge">${methodLabel}</span>
      </div>
      <hr class="divider"/>
      <table>
        <thead><tr>
          <th style="text-align:left">Sản phẩm</th>
          <th>SL</th>
          <th style="text-align:right">Đơn giá</th>
          <th style="text-align:right">Thành tiền</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="3" style="color:#5c668a;">Tổng cộng:</td>
            <td style="text-align:right;font-weight:700;">${order.total_amount?.toLocaleString('vi-VN')}đ</td>
          </tr>
          ${order.discount > 0 ? `
          <tr class="total-row">
            <td colspan="3" style="color:#5c668a;">Giảm giá:</td>
            <td style="text-align:right;font-weight:700;color:#ff6b5e;">-${order.discount?.toLocaleString('vi-VN')}đ</td>
          </tr>` : ''}
          <tr class="grand-total">
            <td colspan="3">THANH TOÁN:</td>
            <td style="text-align:right;">${order.final_amount?.toLocaleString('vi-VN')}đ</td>
          </tr>
        </tfoot>
      </table>
      <div class="footer">
        Cảm ơn quý khách đã mua hàng!<br>
        <strong>MiniMart POS</strong> · Hotline: 1800-xxxx<br>
        In lại lúc ${new Date().toLocaleString('vi-VN')}
      </div>
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()};}<\/script>
    </body></html>`;

    const w = window.open('', '_blank', 'width=420,height=700,scrollbars=yes');
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
         style={{ background: 'rgba(14,21,48,0.5)', backdropFilter: 'blur(12px)' }}
         onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.94, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.94, y:20 }} transition={{ duration: 0.25, ease:[0.22,1,0.36,1] }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{ boxShadow: 'var(--bc-shadow-4)' }}>

        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between"
             style={{ background: 'linear-gradient(135deg,var(--bc-ink-900),var(--bc-ink-700))', fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' }}>
          <div>
            <p className="text-[11px] font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing:'0.1em' }}>HÓA ĐƠN BÁN HÀNG</p>
            <h3 className="text-2xl font-bold text-white leading-none" style={{ letterSpacing:'-0.03em' }}>{order.order_number}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={printReceipt}
              className="px-4 py-2.5 flex items-center gap-2 rounded-2xl font-semibold text-[13px] transition-colors"
              style={{ ...fontBody, background: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <Receipt size={16} /> In lại hóa đơn
            </button>
            <div className="w-px h-6 bg-white/20 mx-2"></div>
            <button onClick={() => { onDelete(order.id); onClose(); }}
              className="p-2.5 rounded-2xl text-red-400 hover:bg-red-500/20 transition-colors">
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="p-2.5 rounded-2xl text-white/50 hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-3 gap-px" style={{ background: 'var(--bc-ink-100)' }}>
          {[
            { icon: Clock,  label: 'Thời gian',    val: order.created_at },
            { icon: User,   label: 'Nhân viên',    val: order.staff_name },
            { icon: CreditCard, label: 'Thanh toán', val: PAYMENT_LABELS[order.payment_method] || order.payment_method },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="px-6 py-4 bg-white flex items-center gap-3">
              <Icon size={16} style={{ color: 'var(--bc-ink-300)' }} />
              <div>
                <p className="text-[10px] font-medium" style={{ ...fontBody, color:'var(--bc-ink-300)', letterSpacing:'0.05em' }}>{label}</p>
                <p className="text-[13px] font-semibold" style={{ ...fontBody, color:'var(--bc-ink-900)' }}>{val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Items table */}
        <div className="px-8 py-5" style={{ fontFamily:'"Be Vietnam Pro",sans-serif' }}>
          <p className="text-[11px] font-semibold mb-3" style={{ color:'var(--bc-ink-300)', letterSpacing:'0.08em' }}>
            CHI TIẾT {total_items} SẢN PHẨM
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl"
                   style={{ background: i % 2 === 0 ? 'var(--bc-bg-soft)' : 'white' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background:'var(--bc-blue-tint)' }}>
                  <Package size={16} style={{ color:'var(--bc-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color:'var(--bc-ink-900)' }}>{item.product_name}</p>
                  <p className="text-[11px]" style={{ color:'var(--bc-ink-300)' }}>
                    {item.unit_price.toLocaleString('vi-VN')}đ × {item.quantity}
                  </p>
                </div>
                <span className="text-[14px] font-bold" style={{ color:'var(--bc-ink-900)' }}>
                  {item.subtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer total */}
        <div className="px-8 py-5 flex justify-between items-center border-t"
             style={{ borderColor:'var(--bc-ink-100)', background:'var(--bc-bg-soft)' }}>
          <div style={{ ...fontBody }}>
            {order.discount > 0 && (
              <p className="text-[12px]" style={{ color:'var(--bc-ink-300)' }}>
                Tạm tính: {order.total_amount?.toLocaleString('vi-VN')}đ
                &nbsp;·&nbsp; Giảm giá: -{order.discount?.toLocaleString('vi-VN')}đ
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium mb-1" style={{ color:'var(--bc-ink-300)', letterSpacing:'0.08em' }}>THÀNH TIỀN</p>
            <p className="text-3xl font-bold leading-none" style={{ ...fontDisplay, color:'var(--bc-blue)', letterSpacing:'-0.04em' }}>
              {order.final_amount?.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderHistory() {
  const [orders, setOrders]     = useState([]);
  const [meta, setMeta]         = useState({ total: 0, page: 1 });
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Filters
  const [q, setQ]               = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [payment, setPayment]   = useState('');
  const [page, setPage]         = useState(1);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const PER_PAGE = 15;

  const fetchOrders = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, per_page: PER_PAGE });
      if (q)         params.append('q', q);
      if (dateFrom)  params.append('date_from', dateFrom);
      if (dateTo)    params.append('date_to', dateTo);
      if (payment)   params.append('payment', payment);
      const res = await axios.get(`http://localhost:5000/api/orders/?${params}`, { headers });
      setOrders(res.data.orders);
      setMeta({ total: res.data.total, page: pg });
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [q, dateFrom, dateTo, payment]);

  useEffect(() => { fetchOrders(1); setPage(1); }, [q, dateFrom, dateTo, payment]);

  const openDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${id}`, { headers });
      setSelected(res.data);
    } catch(e) { console.error(e); }
    setLoadingDetail(false);
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Xác nhận xóa hóa đơn này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, { headers });
      fetchOrders(page);
    } catch(e) { alert('Lỗi xóa'); }
  };

  const totalRevenue = orders.reduce((s, o) => s + (o.final_amount || 0), 0);
  const totalPages   = Math.ceil(meta.total / PER_PAGE);

  return (
    <div style={{ ...fontBody, paddingBottom: 24 }} className="space-y-5">

      {/* Summary mini-cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tổng giao dịch hiển thị', value: meta.total + ' đơn', icon: Receipt, tint: 'var(--bc-blue-tint)', color: 'var(--bc-blue)' },
          { label: 'Doanh thu trang hiện tại', value: totalRevenue.toLocaleString('vi-VN') + 'đ', icon: DollarSign, tint: 'var(--bc-coral-tint)', color: 'var(--bc-coral)' },
          { label: 'Trung bình / hóa đơn', value: orders.length ? (totalRevenue / orders.length).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + 'đ' : '0đ', icon: TrendingUp, tint: 'var(--bc-teal-tint)', color: 'var(--bc-teal)' },
        ].map(({ label, value, icon: Icon, tint, color }) => (
          <div key={label} className="bg-white rounded-3xl p-5 flex items-center gap-4"
               style={{ boxShadow:'var(--bc-shadow-1)', border:'1px solid var(--bc-ink-100)' }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                 style={{ background: tint }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-[10px] font-medium mb-0.5" style={{ color:'var(--bc-ink-300)', letterSpacing:'0.05em' }}>{label}</p>
              <p className="text-[17px] font-bold leading-none" style={{ ...fontDisplay, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-3xl p-5 flex flex-wrap items-center gap-3"
           style={{ boxShadow:'var(--bc-shadow-1)', border:'1px solid var(--bc-ink-100)' }}>
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color:'var(--bc-ink-300)' }} />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Tìm số hóa đơn..."
            className="w-full rounded-2xl text-[13px] font-medium outline-none"
            style={{ ...fontBody, paddingLeft:38, paddingRight:14, paddingTop:10, paddingBottom:10, background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)', color:'var(--bc-ink-900)' }}
            onFocus={e => e.target.style.borderColor = 'var(--bc-blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--bc-ink-100)'}
          />
        </div>

        {/* Date range */}
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="rounded-2xl text-[13px] font-medium outline-none"
          style={{ ...fontBody, padding:'10px 14px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)', color:'var(--bc-ink-700)' }} />
        <span className="text-[12px]" style={{ color:'var(--bc-ink-300)' }}>đến</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="rounded-2xl text-[13px] font-medium outline-none"
          style={{ ...fontBody, padding:'10px 14px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)', color:'var(--bc-ink-700)' }} />

        {/* Payment filter */}
        <select value={payment} onChange={e => setPayment(e.target.value)}
          className="rounded-2xl text-[13px] font-medium outline-none"
          style={{ ...fontBody, padding:'10px 14px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)', color:'var(--bc-ink-700)' }}>
          <option value="">Tất cả hình thức</option>
          <option value="Cash">Tiền mặt</option>
          <option value="QR">QR Code</option>
          <option value="Card">Thẻ ngân hàng</option>
        </select>

        {(q || dateFrom || dateTo || payment) && (
          <button onClick={() => { setQ(''); setDateFrom(''); setDateTo(''); setPayment(''); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[12px] font-semibold transition-colors"
            style={{ background:'var(--bc-coral-tint)', color:'var(--bc-coral)' }}>
            <X size={14} /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl overflow-hidden"
           style={{ boxShadow:'var(--bc-shadow-2)', border:'1px solid var(--bc-ink-100)' }}>
        {/* Table header */}
        <div className="grid px-6 py-4"
             style={{ gridTemplateColumns:'1.5fr 1fr 1fr 1fr 0.8fr 80px', background:'var(--bc-bg-soft)', borderBottom:'1px solid var(--bc-ink-100)' }}>
          {['Số hóa đơn', 'Thời gian', 'Nhân viên', 'Hình thức', 'Thành tiền', ''].map(h => (
            <span key={h} className="text-[10px] font-semibold uppercase" style={{ ...fontBody, color:'var(--bc-ink-400)', letterSpacing:'0.08em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex items-center justify-center py-20" style={{ color:'var(--bc-ink-300)' }}>
            <div className="space-y-3 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto"></div>
              <p className="text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" style={{ color:'var(--bc-ink-300)' }}>
            <FileText size={40} />
            <p className="text-sm font-semibold">Không tìm thấy giao dịch nào</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor:'var(--bc-ink-100)' }}>
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.03 }}
                className="grid px-6 py-4 items-center hover:bg-blue-50/40 transition-colors group cursor-pointer"
                style={{ gridTemplateColumns:'1.5fr 1fr 1fr 1fr 0.8fr 80px' }}
                onClick={() => openDetail(order.id)}>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                       style={{ background:'var(--bc-blue-tint)' }}>
                    <Receipt size={14} style={{ color:'var(--bc-blue)' }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color:'var(--bc-ink-900)' }}>{order.order_number}</p>
                    <p className="text-[10px]" style={{ color:'var(--bc-ink-300)' }}>{order.item_count} sản phẩm</p>
                  </div>
                </div>

                <p className="text-[12px] font-medium" style={{ color:'var(--bc-ink-500)' }}>
                  {new Date(order.created_at).toLocaleString('vi-VN', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' })}
                </p>

                <p className="text-[13px] font-medium" style={{ color:'var(--bc-ink-700)' }}>{order.staff_name}</p>

                <Badge method={order.payment_method} />

                <p className="text-[14px] font-bold" style={{ ...fontDisplay, color:'var(--bc-ink-900)', letterSpacing:'-0.02em' }}>
                  {order.final_amount?.toLocaleString('vi-VN')}đ
                </p>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openDetail(order.id)}
                    className="p-2 rounded-xl hover:bg-blue-100 transition-colors" style={{ color:'var(--bc-blue)' }}>
                    <Eye size={15} />
                  </button>
                  <button onClick={() => deleteOrder(order.id)}
                    className="p-2 rounded-xl hover:bg-red-50 transition-colors" style={{ color:'var(--bc-coral)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t" style={{ borderColor:'var(--bc-ink-100)' }}>
            <p className="text-[12px] font-medium" style={{ ...fontBody, color:'var(--bc-ink-400)' }}>
              Hiển thị {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, meta.total)} / {meta.total} giao dịch
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page === 1}
                onClick={() => { const p = page-1; setPage(p); fetchOrders(p); }}
                className="p-2 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pg = i + 1;
                return (
                  <button key={pg} onClick={() => { setPage(pg); fetchOrders(pg); }}
                    className="w-8 h-8 rounded-xl text-[12px] font-bold transition-all"
                    style={{
                      background: pg === page ? 'var(--bc-blue)' : 'var(--bc-bg-soft)',
                      color: pg === page ? 'white' : 'var(--bc-ink-500)',
                    }}>
                    {pg}
                  </button>
                );
              })}
              <button disabled={page === totalPages}
                onClick={() => { const p = page+1; setPage(p); fetchOrders(p); }}
                className="p-2 rounded-xl disabled:opacity-30 hover:bg-slate-100 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {(selected || loadingDetail) && (
          <OrderDetailModal
            order={selected}
            onClose={() => setSelected(null)}
            onDelete={deleteOrder}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
