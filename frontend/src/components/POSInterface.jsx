import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Trash2, Package, Plus, Minus, X, Zap } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutModal from './CheckoutModal';

const fb = { fontFamily: '"Be Vietnam Pro", sans-serif' };
const fd = { fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' };

export default function POSInterface() {
  const [products, setProducts] = useState([]);
  const [cart, setCart]         = useState([]);
  const [q, setQ]               = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  // Khuyến mãi & Quầy
  const [counterNumber, setCounterNumber] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [promotion, setPromotion] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Khách hàng
  const [phoneInput, setPhoneInput] = useState('');
  const [customer, setCustomer]     = useState(null);
  const [usePoints, setUsePoints]   = useState(false);

  const searchInputRef = React.useRef(null);
  const phoneInputRef  = React.useRef(null);
  const promoInputRef  = React.useRef(null);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const loyaltyDiscount = (usePoints && customer) ? Math.min(total, customer.points * 1000) : 0;
  const promoDiscount = promotion ? (total * promotion.discount_percent / 100) : 0;
  const discountAmount = loyaltyDiscount + promoDiscount;
  const finalAmount    = total - discountAmount;

  // Broadcast Channel cho Màn hình khách
  const channelRef = React.useRef(null);
  useEffect(() => {
    const channel = new BroadcastChannel('pos_customer_display');
    channelRef.current = channel;
    
    channel.onmessage = (e) => {
      if (e.data?.type === 'INIT_REQUEST') {
        channel.postMessage({ cart, total, discountAmount, finalAmount, loyaltyDiscount, promoDiscount, customer, promotion });
      }
    };
    
    return () => channel.close();
  }, [cart, total, discountAmount, finalAmount, loyaltyDiscount, promoDiscount, customer, promotion]);

  // Broadcast mỗi khi state thay đổi
  useEffect(() => {
    if (channelRef.current) {
      channelRef.current.postMessage({ cart, total, discountAmount, finalAmount, loyaltyDiscount, promoDiscount, customer, promotion });
    }
  }, [cart, total, discountAmount, finalAmount, loyaltyDiscount, promoDiscount, customer, promotion]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (phoneInput.length >= 9) {
        try {
          const res = await axios.get(`http://localhost:5000/api/customers/?q=${phoneInput}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          if (res.data.length > 0) setCustomer(res.data[0]);
          else setCustomer(null);
        } catch(e) { setCustomer(null); }
      } else {
        setCustomer(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [phoneInput]);

  const handlePhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    setPhoneInput(cleaned);
    setUsePoints(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'F1': e.preventDefault(); searchInputRef.current?.focus(); break;
        case 'F2': e.preventDefault(); setCart([]); break;
        case 'F3': e.preventDefault(); if (cart.length > 0) setShowCheckout(true); break;
        case 'F4': e.preventDefault(); phoneInputRef.current?.focus(); break;
        case 'F5': e.preventDefault(); promoInputRef.current?.focus(); break;
        case 'F6': e.preventDefault(); window.open('/customer-display', '_blank', 'width=1024,height=768'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  const handleApplyPromo = async () => {
    setPromoError('');
    if (!promoCode) { setPromotion(null); return; }
    try {
      const res = await axios.get(`http://localhost:5000/api/promotions/check/${promoCode}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPromotion(res.data);
    } catch (e) {
      setPromotion(null);
      setPromoError(e.response?.data?.error || 'Mã không hợp lệ');
    }
  };

  useEffect(() => { fetchProducts(''); }, []);

  const fetchProducts = async (query) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/?q=${query}`);
      setProducts(res.data);
    } catch (e) { console.error(e); }
  };

  const addToCart = (p) => {
    setCart(prev => {
      const found = prev.find(i => i.id === p.id);
      return found
        ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...p, qty: 1 }];
    });
  };

  const changeQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="grid gap-5 flex-1 min-h-0" style={{ gridTemplateColumns: '1fr 340px' }}>

      {/* ── LEFT: Products ── */}
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="relative shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--bc-ink-300)' }} />
          <input ref={searchInputRef} value={q} onChange={e => { setQ(e.target.value); fetchProducts(e.target.value); }}
            placeholder="Tìm sản phẩm hoặc quét mã vạch (F1)..."
            className="w-full rounded-2xl text-[14px] font-medium outline-none transition-all"
            style={{ ...fb, paddingLeft: 44, paddingRight: 16, paddingTop: 13, paddingBottom: 13, background: 'white', border: '2px solid var(--bc-ink-100)', color: 'var(--bc-ink-900)', boxShadow: 'var(--bc-shadow-1)' }}
            onFocus={e => e.target.style.borderColor = 'var(--bc-blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--bc-ink-100)'}
          />
        </div>

        {/* ── SHORTCUT BAR ── */}
        <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-6 shrink-0" style={{ border: '1px solid var(--bc-ink-100)' }}>
          {[
            { key: 'F1', label: 'Tìm SP' },
            { key: 'F2', label: 'Hủy đơn' },
            { key: 'F3', label: 'Thanh toán' },
            { key: 'F4', label: 'Nhập SĐT' },
            { key: 'F5', label: 'Khuyến mãi' },
            { key: 'F6', label: 'Màn hình khách' },
          ].map(s => (
            <div key={s.key} className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-bold border-b-2 border-slate-200 text-slate-500 shadow-sm" style={{ ...fd }}>{s.key}</kbd>
              <span className="text-[12px] font-medium" style={{ ...fb, color: 'var(--bc-ink-500)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-4 overflow-y-auto custom-scrollbar pb-4 flex-1"
             style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))' }}>
          {products.map(p => (
            <motion.button key={p.id}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}
              onClick={() => addToCart(p)}
              className="bg-white rounded-3xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer"
              style={{ border: '2px solid var(--bc-ink-100)', boxShadow: 'var(--bc-shadow-1)', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bc-blue)'; e.currentTarget.style.boxShadow = 'var(--bc-shadow-blue)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bc-ink-100)'; e.currentTarget.style.boxShadow = 'var(--bc-shadow-1)'; }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg,var(--bc-blue-tint),#dbeafe)' }}>
                <Package size={28} style={{ color: 'var(--bc-blue)' }} />
              </div>
              <div>
                <p className="font-bold text-[11px] uppercase leading-tight mb-1.5" style={{ ...fb, color: 'var(--bc-ink-900)' }}>{p.name}</p>
                <p className="font-bold text-[15px]" style={{ ...fd, color: 'var(--bc-blue)', letterSpacing: '-0.02em' }}>{p.price.toLocaleString('vi-VN')}đ</p>
                <p className="text-[10px] mt-0.5" style={{ ...fb, color: 'var(--bc-ink-300)' }}>Kho: {p.stock} {p.unit}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Cart ── */}
      <div className="flex flex-col rounded-3xl overflow-hidden bg-white"
           style={{ boxShadow: 'var(--bc-shadow-3)', border: '1px solid var(--bc-ink-100)' }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
             style={{ borderBottom: '1px solid var(--bc-ink-100)', background: 'var(--bc-bg-soft)' }}>
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={18} style={{ color: 'var(--bc-blue)' }} />
            <span className="font-bold text-[14px]" style={{ ...fd, color: 'var(--bc-ink-900)' }}>Hóa đơn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                  style={{ background: cart.length > 0 ? 'var(--bc-coral)' : 'var(--bc-ink-300)' }}>
              {cart.length}
            </span>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="p-1.5 rounded-xl hover:bg-red-50 transition-colors" style={{ color: 'var(--bc-ink-300)' }}>
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Customer & Promo Inputs */}
        <div className="p-4 space-y-2" style={{ borderBottom: '1px solid var(--bc-ink-100)', background: 'white' }}>
          <input ref={phoneInputRef} value={phoneInput} onChange={e => handlePhoneChange(e.target.value)}
                 placeholder="Nhập SĐT khách hàng tích điểm (F4)..."
                 className="w-full text-[13px] outline-none px-3 py-2 rounded-xl"
                 style={{ background: 'var(--bc-bg-soft)', border: '1px solid var(--bc-ink-200)', color: 'var(--bc-ink-900)' }} />
          {customer && (
            <div className="flex items-center justify-between text-[12px] px-1" style={{ color: 'var(--bc-ink-700)' }}>
              <span>{customer.full_name} ({customer.points} điểm)</span>
              {customer.points > 0 && (
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} /> Dùng điểm
                </label>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input ref={promoInputRef} value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())}
                     placeholder="Mã khuyến mãi (F5)"
                     className="w-full text-[13px] outline-none pl-3 pr-16 py-2 rounded-xl uppercase font-bold"
                     style={{ background: 'var(--bc-bg-soft)', border: '1px solid var(--bc-ink-200)', color: 'var(--bc-teal-700)' }} />
              <button onClick={handleApplyPromo} className="absolute right-1 top-1 bottom-1 px-3 bg-teal-500 hover:bg-teal-600 text-white text-[11px] font-bold rounded-lg transition-colors">ÁP DỤNG</button>
            </div>
            <input type="number" value={counterNumber} onChange={e => setCounterNumber(e.target.value)} min="1"
                   title="Số quầy"
                   className="w-14 text-center text-[13px] font-bold outline-none py-2 rounded-xl"
                   style={{ background: 'var(--bc-bg-soft)', border: '1px solid var(--bc-ink-200)', color: 'var(--bc-blue-700)' }} />
          </div>
          {promoError && <p className="text-[10px] text-red-500 px-1">{promoError}</p>}
          {promotion && <p className="text-[10px] text-teal-600 font-semibold px-1">Đã áp dụng giảm {promotion.discount_percent}%</p>}
        </div>

        {/* Items */}
        <div className="flex-initial min-h-0 overflow-y-auto px-4 py-3 space-y-1 custom-scrollbar">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-3 rounded-2xl group transition-colors hover:bg-slate-50">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bc-blue-tint)' }}>
                  <Package size={15} style={{ color: 'var(--bc-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate uppercase" style={{ ...fb, color: 'var(--bc-ink-900)' }}>{item.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--bc-ink-300)' }}>{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => changeQty(item.id, -1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: 'var(--bc-bg-soft)', border: '1px solid var(--bc-ink-100)' }}>
                    <Minus size={11} style={{ color: 'var(--bc-ink-500)' }} />
                  </button>
                  <span className="w-5 text-center text-[13px] font-bold" style={{ color: 'var(--bc-ink-900)' }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: 'var(--bc-blue)', border: '1px solid var(--bc-blue)' }}>
                    <Plus size={11} color="white" />
                  </button>
                  <button onClick={() => remove(item.id)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ color: 'var(--bc-coral)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-16 gap-3" style={{ color: 'var(--bc-ink-200)' }}>
              <ShoppingCart size={44} />
              <p className="text-[12px] font-semibold" style={{ ...fb, color: 'var(--bc-ink-300)' }}>Chưa có sản phẩm</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 space-y-4" style={{ borderTop: '2px solid var(--bc-ink-100)', background: 'var(--bc-bg-soft)' }}>
          {/* Subtotal rows */}
          <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--bc-ink-100)' }}>
            <div className="flex justify-between text-[12px]" style={fb}>
              <span style={{ color: 'var(--bc-ink-400)' }}>Tạm tính ({cart.length} món)</span>
              <span style={{ color: 'var(--bc-ink-700)' }}>{total.toLocaleString('vi-VN')}đ</span>
            </div>
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-[12px]" style={fb}>
                <span style={{ color: 'var(--bc-ink-400)' }}>Giảm điểm</span>
                <span style={{ color: 'var(--bc-coral)' }}>-{loyaltyDiscount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[12px]" style={fb}>
                <span style={{ color: 'var(--bc-ink-400)' }}>Khuyến mãi</span>
                <span style={{ color: 'var(--bc-teal)' }}>-{promoDiscount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end pt-2 border-t" style={{ borderColor: 'var(--bc-ink-100)' }}>
            <span className="text-[11px] font-semibold" style={{ ...fb, color: 'var(--bc-ink-400)', letterSpacing: '0.06em' }}>TỔNG CỘNG</span>
            <span className="text-2xl font-bold leading-none" style={{ ...fd, color: 'var(--bc-blue)', letterSpacing: '-0.04em' }}>
              {finalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <button onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
            className="w-full py-4 rounded-2xl text-white text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-2.5"
            style={{ ...fb, background: cart.length > 0 ? 'linear-gradient(135deg,var(--bc-coral),var(--bc-coral-700))' : 'var(--bc-ink-300)', boxShadow: cart.length > 0 ? 'var(--bc-shadow-coral)' : 'none' }}>
            <Zap size={18} /> Tiến hành thanh toán (F3)
          </button>
        </div>
      </div>
      </div>

      {/* ── CHECKOUT MODAL ── */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            cart={cart}
            total={total}
            discountAmount={discountAmount}
            finalAmount={finalAmount}
            loyaltyDiscount={loyaltyDiscount}
            promoDiscount={promoDiscount}
            customer={customer}
            promotion={promotion}
            counterNumber={counterNumber}
            onClose={() => setShowCheckout(false)}
            onSuccess={() => { setCart([]); setCustomer(null); setPhoneInput(''); setPromoCode(''); setPromotion(null); setShowCheckout(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
