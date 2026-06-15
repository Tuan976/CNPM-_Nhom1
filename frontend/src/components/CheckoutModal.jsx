import React, { useState } from 'react';
import { X, Banknote, QrCode, CheckCircle, Receipt, ChevronRight, ArrowLeft, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const fd = { fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro",sans-serif' };

const METHODS = [
  { id: 'Cash',  label: 'Tiền mặt',         sub: 'Thanh toán trực tiếp tại quầy', icon: Banknote,    color: 'var(--bc-teal)',   tint: 'var(--bc-teal-tint)' },
  { id: 'QR',    label: 'QR Chuyển khoản',  sub: 'Vietcombank / MoMo / ZaloPay',  icon: QrCode,      color: 'var(--bc-blue)',   tint: 'var(--bc-blue-tint)' },
  { id: 'PayOS', label: 'PayOS',            sub: 'Thẻ ATM / Visa / Ngân hàng',    icon: Smartphone,  color: '#7c3aed',          tint: '#f5f3ff' },
];

// Fake QR - dùng QR online generator
const QR_URL = (amount) =>
  `https://img.vietqr.io/image/VCB-1234567890-compact2.png?amount=${amount}&addInfo=MiniMart+POS&accountName=MINIMART+STORE`;

export default function CheckoutModal({ cart, total, discountAmount, finalAmount, loyaltyDiscount, promoDiscount, customer, promotion, counterNumber, onClose, onSuccess }) {
  const [step, setStep]           = useState(1);
  const [method, setMethod]       = useState('');
  const [cashGiven, setCashGiven] = useState('');
  const [loading, setLoading]     = useState(false);
  const [orderId, setOrderId]     = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [payOsUrl, setPayOsUrl]   = useState('');

  const change   = Math.max(0, (parseFloat(cashGiven) || 0) - finalAmount);
  const canPay   = method === 'QR' || (method === 'Cash' && parseFloat(cashGiven) >= finalAmount);
  const now      = new Date();

  const currentQrUrl = method === 'PayOS' && payOsUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(payOsUrl)}`
    : QR_URL(finalAmount);

  const channelRef = React.useRef(null);
  React.useEffect(() => {
    channelRef.current = new BroadcastChannel('pos_customer_display');
    return () => {
      if (channelRef.current) {
        channelRef.current.postMessage({ type: 'CHECKOUT_UPDATE', checkoutState: null });
        channelRef.current.close();
      }
    };
  }, []);

  React.useEffect(() => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'CHECKOUT_UPDATE',
        checkoutState: { step, method, cashGiven, change, qrUrl: currentQrUrl, loading, isSuccess: step === 3 }
      });
    }
  }, [step, method, cashGiven, change, loading, currentQrUrl]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/pos/checkout', {
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
        payment_method: method,
        customer_id: customer?.id,
        promotion_id: promotion?.id,
        counter_number: parseInt(counterNumber) || 1,
        discount: discountAmount,
        total_amount: total
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setOrderId(res.data.order_id);
      setOrderNumber(res.data.order_number || `HD-${Date.now().toString().slice(-8)}`);
      setStep(3);
    } catch (e) {
      alert(e.response?.data?.error || 'Lỗi thanh toán');
    }
    setLoading(false);
  };

  const handleDone = () => { onSuccess(); onClose(); };

  // Thanh toán qua PayOS - tạo link & redirect
  const handlePayOS = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/payment/create', {
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
        customer_id: customer?.id,
        promotion_id: promotion?.id,
        counter_number: parseInt(counterNumber) || 1,
        discount: discountAmount,
        total_amount: total
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      
      setPayOsUrl(res.data.checkout_url);
      setMethod('PayOS');
      setStep(2);
    } catch (e) {
      if (e.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng xuất và đăng nhập lại!');
      } else {
        alert(e.response?.data?.error || e.message || 'Không thể tạo link thanh toán PayOS');
      }
      setLoading(false);
    }
  };
  const printReceipt = () => {
    const methodLabel = method === 'Cash' ? 'Tiền mặt' : 'QR Chuyển khoản';
    const timeStr = now.toLocaleString('vi-VN');
    const rows = cart.map(i => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;">${i.name}</td>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;text-align:center;">${i.qty}</td>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;text-align:right;">${i.price.toLocaleString('vi-VN')}đ</td>
        <td style="padding:6px 0;border-bottom:1px dashed #eee;text-align:right;font-weight:700;">${(i.price*i.qty).toLocaleString('vi-VN')}đ</td>
      </tr>`).join('');

    const cashRows = method === 'Cash' ? `
      <tr><td colspan="3" style="padding:4px 0;font-size:13px;color:#555;">Khách đưa:</td>
          <td style="padding:4px 0;text-align:right;font-size:13px;">${parseFloat(cashGiven).toLocaleString('vi-VN')}đ</td></tr>
      <tr><td colspan="3" style="padding:4px 0;font-size:13px;color:#555;">Tiền thối:</td>
          <td style="padding:4px 0;text-align:right;font-size:14px;font-weight:800;color:#1abbb4;">${change.toLocaleString('vi-VN')}đ</td></tr>` : '';

    const html = `<!DOCTYPE html><html lang="vi"><head>
      <meta charset="UTF-8"/>
      <title>Hóa đơn ${orderNumber}</title>
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
        <p>HÓA ĐƠN BÁN HÀNG · POS SYSTEM</p>
      </div>
      <div class="meta">
        <strong>Số HĐ:</strong> ${orderNumber}<br>
        <strong>Thời gian:</strong> ${timeStr}<br>
        <strong>Quầy số:</strong> ${counterNumber}<br>
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
            <td style="text-align:right;font-weight:700;">${total.toLocaleString('vi-VN')}đ</td>
          </tr>
          ${loyaltyDiscount > 0 ? `<tr class="total-row"><td colspan="3" style="color:#5c668a;">Giảm giá (Điểm):</td><td style="text-align:right;font-weight:700;color:#ff6b5e;">-${loyaltyDiscount.toLocaleString('vi-VN')}đ</td></tr>` : ''}
          ${promoDiscount > 0 ? `<tr class="total-row"><td colspan="3" style="color:#5c668a;">Khuyến mãi (${promotion?.discount_percent}%):</td><td style="text-align:right;font-weight:700;color:#1abbb4;">-${promoDiscount.toLocaleString('vi-VN')}đ</td></tr>` : ''}
          ${cashRows}
          <tr class="grand-total">
            <td colspan="3">THANH TOÁN:</td>
            <td style="text-align:right;">${finalAmount.toLocaleString('vi-VN')}đ</td>
          </tr>
        </tfoot>
      </table>
      <div class="footer">
        ${customer ? `<strong>Khách hàng:</strong> ${customer.full_name || customer.phone}<br>` : ''}
        Cảm ơn quý khách đã mua hàng!<br>
        <strong>MiniMart POS</strong> · Hotline: 1800-xxxx<br>
        Hóa đơn in lúc ${timeStr}
      </div>
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()};}<\/script>
    </body></html>`;

    const w = window.open('', '_blank', 'width=420,height=700,scrollbars=yes');
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
         style={{ background: 'rgba(14,21,48,0.55)', backdropFilter: 'blur(14px)' }}
         onClick={step < 3 ? onClose : undefined}>
      <motion.div initial={{ opacity:0, scale:0.93, y:24 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.93 }} transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ boxShadow:'var(--bc-shadow-4)' }}>

        {/* ── STEP 1: Chọn hình thức ── */}
        {step === 1 && (
          <>
            <div className="px-8 py-6 flex items-center justify-between border-b" style={{ borderColor:'var(--bc-ink-100)' }}>
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ ...fb, color:'var(--bc-ink-300)', letterSpacing:'0.1em' }}>BƯỚC 1 / 2 · THANH TOÁN</p>
                <h3 className="text-xl font-bold" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>Chọn hình thức thanh toán</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400"><X size={20}/></button>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="mx-8 mt-4 space-y-3">
              {/* Box Bill */}
              <div className="p-4 rounded-2xl" style={{ background:'var(--bc-bg-soft)', border:'1px solid var(--bc-ink-100)' }}>
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between items-center text-[13px]" style={fb}>
                      <span style={{ color:'var(--bc-ink-700)' }}>{i.name} <span style={{ color:'var(--bc-ink-300)' }}>×{i.qty}</span></span>
                      <span className="font-semibold" style={{ color:'var(--bc-ink-900)' }}>{(i.price * i.qty).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 flex flex-col gap-1 border-t" style={{ borderColor:'var(--bc-ink-100)' }}>
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-[12px] font-medium" style={{ color:'var(--bc-coral)' }}>
                      <span>Giảm điểm</span>
                      <span>-{loyaltyDiscount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[12px] font-medium" style={{ color:'var(--bc-teal)' }}>
                      <span>Khuyến mãi</span>
                      <span>-{promoDiscount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-semibold" style={{ ...fb, color:'var(--bc-ink-400)' }}>THANH TOÁN</span>
                    <span className="text-2xl font-bold" style={{ ...fd, color:'var(--bc-blue)', letterSpacing:'-0.04em' }}>{finalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Method cards */}
            <div className="px-8 py-6 space-y-3">
              {METHODS.map(({ id, label, sub, icon: Icon, color, tint }) => (
                <button key={id}
                  onClick={() => {
                    if (id === 'PayOS') { handlePayOS(); return; }
                    setMethod(id); setStep(2);
                  }}
                  disabled={id === 'PayOS' && loading}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60"
                  style={{ background: tint, border: `2px solid ${color}22` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: color }}>
                    {id === 'PayOS' && loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Icon size={22} color="white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold" style={{ ...fd, color: 'var(--bc-ink-900)' }}>{label}</p>
                    <p className="text-[12px]" style={{ ...fb, color: 'var(--bc-ink-400)' }}>{sub}</p>
                    {id === 'PayOS' && <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: '#7c3aed' }}>POWERED BY PAYOS</span>}
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--bc-ink-300)' }} />
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── STEP 2a: Tiền mặt ── */}
        {step === 2 && method === 'Cash' && (
          <>
            <div className="px-8 py-6 flex items-center gap-3 border-b" style={{ borderColor:'var(--bc-ink-100)' }}>
              <button onClick={() => setStep(1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><ArrowLeft size={18}/></button>
              <div>
                <p className="text-[10px] font-semibold" style={{ ...fb, color:'var(--bc-ink-300)', letterSpacing:'0.1em' }}>BƯỚC 2 / 2 · TIỀN MẶT</p>
                <h3 className="text-xl font-bold" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>Nhập tiền khách đưa</h3>
              </div>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="p-5 rounded-2xl text-center" style={{ background:'var(--bc-teal-tint)' }}>
                <p className="text-[11px] font-semibold mb-1" style={{ ...fb, color:'var(--bc-teal-700)', letterSpacing:'0.1em' }}>CẦN THANH TOÁN</p>
                <p className="text-4xl font-bold" style={{ ...fd, color:'var(--bc-teal)', letterSpacing:'-0.05em' }}>{finalAmount.toLocaleString('vi-VN')}đ</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold block mb-2" style={{ ...fb, color:'var(--bc-ink-500)' }}>Tiền khách đưa (đồng)</label>
                <input type="number" value={cashGiven} onChange={e => setCashGiven(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-2xl text-2xl font-bold text-center outline-none"
                  style={{ ...fd, padding:'16px 20px', background:'var(--bc-bg-soft)', border:'2px solid var(--bc-ink-100)', color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}
                  onFocus={e => e.target.style.borderColor='var(--bc-teal)'}
                  onBlur={e => e.target.style.borderColor='var(--bc-ink-100)'}
                />
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2">
                {[50000,100000,200000,500000].map(v => (
                  <button key={v} onClick={() => setCashGiven(String(v))}
                    className="py-2.5 rounded-xl text-[12px] font-bold transition-all hover:scale-105"
                    style={{ ...fb, background: parseFloat(cashGiven)===v ? 'var(--bc-teal)' : 'var(--bc-bg-soft)', color: parseFloat(cashGiven)===v ? 'white' : 'var(--bc-ink-700)', border:'1px solid var(--bc-ink-100)' }}>
                    {(v/1000)}K
                  </button>
                ))}
              </div>

              {/* Change */}
              <div className="p-4 rounded-2xl flex justify-between items-center"
                   style={{ background: canPay ? 'rgba(26,187,180,0.08)' : 'var(--bc-bg-soft)', border: `1px solid ${canPay ? 'rgba(26,187,180,0.3)' : 'var(--bc-ink-100)'}` }}>
                <span className="text-[13px] font-semibold" style={{ ...fb, color:'var(--bc-ink-500)' }}>Tiền thối lại</span>
                <span className="text-2xl font-bold" style={{ ...fd, color: canPay ? 'var(--bc-teal)' : 'var(--bc-ink-300)', letterSpacing:'-0.04em' }}>
                  {canPay ? change.toLocaleString('vi-VN') + 'đ' : '—'}
                </span>
              </div>

              <button onClick={handleConfirm} disabled={!canPay || loading}
                className="w-full py-4 rounded-2xl text-white text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-2"
                style={{ background:'linear-gradient(135deg,var(--bc-teal),var(--bc-teal-700))', boxShadow:'0 10px 24px rgba(26,187,180,0.35)', ...fb }}>
                {loading ? 'Đang xử lý...' : <><CheckCircle size={18}/> Xác nhận thanh toán</>}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2b: QR & PayOS ── */}
        {step === 2 && (method === 'QR' || method === 'PayOS') && (
          <>
            <div className="px-8 py-6 flex items-center gap-3 border-b" style={{ borderColor:'var(--bc-ink-100)' }}>
              <button onClick={() => setStep(1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><ArrowLeft size={18}/></button>
              <div>
                <p className="text-[10px] font-semibold" style={{ ...fb, color:'var(--bc-ink-300)', letterSpacing:'0.1em' }}>BƯỚC 2 / 2 · QR CHUYỂN KHOẢN</p>
                <h3 className="text-xl font-bold" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.03em' }}>Quét mã thanh toán</h3>
              </div>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-3xl" style={{ background:'white', border:'2px solid var(--bc-ink-100)', boxShadow:'var(--bc-shadow-2)' }}>
                  <img src={currentQrUrl} alt="QR thanh toán" className="w-52 h-52 object-contain" onError={e => e.target.style.display='none'} />
                  {/* Fallback nếu QR lỗi */}
                  <div className="w-52 h-52 flex flex-col items-center justify-center gap-3" style={{ color:'var(--bc-ink-300)' }}>
                    <QrCode size={64} style={{ color:'var(--bc-blue)' }} />
                    <p className="text-[11px] font-semibold text-center" style={fb}>QR đang tải...</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-medium mb-1" style={{ ...fb, color:'var(--bc-ink-400)' }}>Số tiền cần thanh toán</p>
                  <p className="text-3xl font-bold" style={{ ...fd, color:'var(--bc-blue)', letterSpacing:'-0.04em' }}>{finalAmount.toLocaleString('vi-VN')}đ</p>
                </div>
                {method === 'QR' && (
                  <div className="w-full p-4 rounded-2xl text-center" style={{ background:'var(--bc-blue-tint)', border:'1px solid rgba(74,144,255,0.2)' }}>
                    <p className="text-[12px] font-semibold" style={{ ...fb, color:'var(--bc-blue-700)' }}>
                      Nội dung: <strong>MINIMART {Date.now().toString().slice(-6)}</strong>
                    </p>
                  </div>
                )}
                {method === 'PayOS' && (
                  <div className="w-full p-3 rounded-2xl text-center" style={{ background:'#f5f3ff', border:'1px solid #ddd6fe' }}>
                    <p className="text-[12px] font-bold text-purple-700 uppercase">Hỗ trợ bởi PayOS</p>
                  </div>
                )}
              </div>

              <button onClick={handleConfirm} disabled={loading}
                className="w-full py-4 rounded-2xl text-white text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ background:'linear-gradient(135deg,var(--bc-blue),var(--bc-blue-700))', boxShadow:'var(--bc-shadow-blue)', ...fb }}>
                {loading ? 'Đang xử lý...' : <><CheckCircle size={18}/> Đã nhận tiền — Hoàn tất</>}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Hóa đơn hoàn tất ── */}
        {step === 3 && (
          <div className="px-8 py-10 flex flex-col items-center gap-6 text-center">
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', bounce:0.5 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-white"
              style={{ background:'linear-gradient(135deg,var(--bc-teal),var(--bc-teal-700))', boxShadow:'0 16px 40px rgba(26,187,180,0.4)' }}>
              <CheckCircle size={50} />
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ ...fd, color:'var(--bc-ink-900)', letterSpacing:'-0.04em' }}>Thanh toán thành công!</h3>
              <p className="text-[13px]" style={{ ...fb, color:'var(--bc-ink-400)' }}>Hóa đơn đã được lưu vào hệ thống</p>
            </div>

            <div className="w-full p-6 rounded-3xl space-y-3" style={{ background:'var(--bc-bg-soft)', border:'1px solid var(--bc-ink-100)' }}>
              <div className="flex justify-between text-[13px]" style={fb}>
                <span style={{ color:'var(--bc-ink-400)' }}>Hình thức</span>
                <span className="font-semibold" style={{ color:'var(--bc-ink-900)' }}>{method === 'Cash' ? 'Tiền mặt' : 'QR Chuyển khoản'}</span>
              </div>
              <div className="flex justify-between text-[13px]" style={fb}>
                <span style={{ color:'var(--bc-ink-400)' }}>Tổng tiền</span>
                <span className="font-bold" style={{ color:'var(--bc-blue)' }}>{total.toLocaleString('vi-VN')}đ</span>
              </div>
              {method === 'Cash' && (
                <>
                  <div className="flex justify-between text-[13px]" style={fb}>
                    <span style={{ color:'var(--bc-ink-400)' }}>Khách đưa</span>
                    <span className="font-semibold" style={{ color:'var(--bc-ink-900)' }}>{parseFloat(cashGiven).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-[14px] pt-2 border-t" style={{ borderColor:'var(--bc-ink-100)', ...fb }}>
                    <span className="font-semibold" style={{ color:'var(--bc-ink-700)' }}>Tiền thối</span>
                    <span className="text-xl font-bold" style={{ ...fd, color:'var(--bc-teal)', letterSpacing:'-0.03em' }}>{change.toLocaleString('vi-VN')}đ</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={printReceipt}
                className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ ...fb, background:'var(--bc-blue-tint)', color:'var(--bc-blue-700)', border:'1px solid rgba(74,144,255,0.25)' }}>
                <Receipt size={16} /> In hóa đơn
              </button>
              <button onClick={handleDone}
                className="flex-1 py-3.5 rounded-2xl text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ ...fb, background:'linear-gradient(135deg,var(--bc-ink-900),var(--bc-ink-700))', boxShadow:'var(--bc-shadow-3)' }}>
                Đơn hàng mới
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
