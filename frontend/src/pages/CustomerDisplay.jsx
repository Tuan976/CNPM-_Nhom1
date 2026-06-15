import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fb = { fontFamily: '"Be Vietnam Pro", sans-serif' };
const fd = { fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' };

export default function CustomerDisplay() {
  const [state, setState] = useState({
    cart: [],
    total: 0,
    discountAmount: 0,
    finalAmount: 0,
    loyaltyDiscount: 0,
    promoDiscount: 0,
    customer: null,
    promotion: null,
    checkoutState: null
  });

  useEffect(() => {
    document.title = "MiniMart - Màn hình khách hàng";
    const channel = new BroadcastChannel('pos_customer_display');
    
    channel.onmessage = (event) => {
      if (event.data?.type === 'CHECKOUT_UPDATE') {
        setState(prev => ({ ...prev, checkoutState: event.data.checkoutState }));
      } else if (event.data && event.data.cart) {
        setState(prev => ({ ...prev, ...event.data }));
      }
    };
    
    // Yêu cầu đồng bộ ngay lập tức
    channel.postMessage({ type: 'INIT_REQUEST' });
    
    return () => channel.close();
  }, []);

  const { cart, total, finalAmount, loyaltyDiscount, promoDiscount, customer, checkoutState } = state;

  const renderCheckoutState = () => {
    if (!checkoutState) return null;
    const { step, method, cashGiven, change, qrUrl, isSuccess } = checkoutState;

    if (isSuccess) {
      return (
        <div className="flex flex-col items-center justify-center text-white h-full text-center z-10 relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 bg-green-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(74,222,128,0.5)]">
            <CheckCircle size={80} color="white" />
          </motion.div>
          <h2 className="text-5xl font-bold mb-4" style={fd}>Thanh toán thành công!</h2>
          <p className="text-2xl opacity-90">Cảm ơn quý khách và hẹn gặp lại.</p>
        </div>
      );
    }

    if (step === 2 && method === 'Cash') {
      const given = parseFloat(cashGiven) || 0;
      return (
        <div className="flex flex-col items-center justify-center text-white h-full text-center w-full max-w-2xl mx-auto z-10 relative">
          <h2 className="text-[40px] font-bold mb-12" style={{ ...fd, letterSpacing: '-0.02em' }}>Thanh toán tiền mặt</h2>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full bg-white/10 backdrop-blur-md rounded-[2rem] p-10 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/20">
              <span className="text-3xl opacity-80">Khách đưa:</span>
              <span className="text-5xl font-bold">{given.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-3xl opacity-80">Tiền thừa:</span>
              <span className="text-[56px] font-black text-yellow-300 drop-shadow-md" style={{ ...fd, letterSpacing: '-0.02em' }}>{change.toLocaleString('vi-VN')}đ</span>
            </div>
          </motion.div>
        </div>
      );
    }

    if (step === 2 && (method === 'QR' || method === 'PayOS')) {
      return (
        <div className="flex flex-col items-center justify-center text-white h-full text-center z-10 relative">
          <h2 className="text-[40px] font-bold mb-10" style={{ ...fd, letterSpacing: '-0.02em' }}>Quét mã QR để thanh toán</h2>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-white rounded-[2rem] shadow-2xl">
            <img src={qrUrl} alt="QR Code" className="w-[340px] h-[340px] object-contain" />
          </motion.div>
          <p className="text-2xl mt-10 opacity-90">Vui lòng kiểm tra lại số tiền trước khi chuyển khoản</p>
          {method === 'PayOS' && <p className="mt-5 px-6 py-2 bg-purple-600 rounded-full text-sm font-bold tracking-widest uppercase">Hỗ trợ bởi PayOS</p>}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-white h-full text-center z-10 relative">
        <h2 className="text-4xl font-bold mb-4" style={fd}>Đang xử lý thanh toán...</h2>
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mt-6"></div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100" style={fb}>
      {/* ── LEFT: Banners / Welcome ── */}
      <div className="flex-1 p-10 flex flex-col justify-center items-center text-center relative overflow-hidden" 
           style={{ background: 'linear-gradient(135deg, var(--bc-blue), var(--bc-teal))' }}>
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {checkoutState ? renderCheckoutState() : (
          <>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <h1 className="text-[80px] font-black text-white mb-4 drop-shadow-lg" style={{ ...fd, letterSpacing: '-0.04em' }}>
                Mini<span className="text-yellow-400">Mart</span>
              </h1>
              <p className="text-4xl text-blue-50 font-medium drop-shadow-md">Xin chào quý khách!</p>
              <p className="text-xl text-blue-100/90 mt-4 max-w-lg mx-auto">
                Vui lòng theo dõi hóa đơn và thanh toán tại quầy. Cảm ơn quý khách đã mua sắm tại MiniMart.
              </p>
            </motion.div>
            
            <AnimatePresence>
              {customer && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                  className="mt-16 bg-white/10 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 text-white shadow-2xl min-w-[400px]">
                  <p className="text-lg font-medium opacity-80 uppercase tracking-widest mb-2">Thành viên thân thiết</p>
                  <p className="text-4xl font-bold" style={fd}>{customer.full_name}</p>
                  <div className="inline-flex items-center gap-2 mt-4 px-6 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-300">
                    <Sparkles size={24}/>
                    <span className="text-2xl font-bold">{customer.points} điểm</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* ── RIGHT: Cart Display ── */}
      <div className="w-[500px] bg-white shadow-2xl flex flex-col z-10 shrink-0 border-l border-slate-200">
        <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-3xl font-bold text-slate-800" style={{ ...fd, letterSpacing: '-0.02em' }}>Giỏ hàng</h2>
          <p className="text-slate-500 font-medium mt-1 text-lg">{cart.length} sản phẩm</p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 custom-scrollbar relative">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item.id} 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex justify-between items-center pb-5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg uppercase leading-tight">{item.name}</p>
                    <p className="text-slate-400 font-medium text-[15px] mt-0.5">{item.price.toLocaleString('vi-VN')}đ × {item.qty}</p>
                  </div>
                </div>
                <p className="font-bold text-slate-800 text-2xl shrink-0" style={{ ...fd, letterSpacing: '-0.02em' }}>
                  {(item.price * item.qty).toLocaleString('vi-VN')}đ
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
               <ShoppingCart size={100} className="mb-6 opacity-30" />
               <p className="text-2xl font-bold text-slate-400" style={fd}>Giỏ hàng đang trống</p>
             </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-200">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-500 text-xl font-medium">
              <span>Tạm tính</span>
              <span className="text-slate-800">{total.toLocaleString('vi-VN')}đ</span>
            </div>
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-orange-500 text-xl font-medium">
                <span>Giảm điểm</span>
                <span className="font-bold">-{loyaltyDiscount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-teal-500 text-xl font-medium">
                <span>Khuyến mãi</span>
                <span className="font-bold">-{promoDiscount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-end border-t-2 border-slate-200 border-dashed pt-6">
            <span className="text-xl font-bold text-slate-500 uppercase tracking-widest">CẦN THANH TOÁN</span>
            <span className="text-[52px] font-black leading-none" style={{ ...fd, color: 'var(--bc-blue)', letterSpacing: '-0.04em' }}>
              {finalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
