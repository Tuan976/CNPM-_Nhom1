import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const fd = { fontFamily: '"Bricolage Grotesque","Be Vietnam Pro",sans-serif' };
const fb = { fontFamily: '"Be Vietnam Pro",sans-serif' };

export default function PaymentResult({ type }) {
  const [params] = useSearchParams();
  const navigate  = useNavigate();
  const [status, setStatus] = useState('checking'); // checking | success | cancel

  const orderCode = params.get('orderCode');
  const code      = params.get('code'); // '00' = success

  useEffect(() => {
    if (type === 'cancel') { setStatus('cancel'); return; }
    if (code === '00') {
      setStatus('success');
    } else {
      setStatus('cancel');
    }
  }, [type, code]);

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 premium-bg" style={fb}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-12 max-w-md w-full text-center space-y-7"
        style={{ boxShadow: 'var(--bc-shadow-4)' }}>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
          className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-white"
          style={{
            background: isSuccess
              ? 'linear-gradient(135deg,var(--bc-teal),var(--bc-teal-700))'
              : 'linear-gradient(135deg,var(--bc-coral),var(--bc-coral-700))',
            boxShadow: isSuccess ? '0 16px 40px rgba(26,187,180,0.4)' : '0 16px 40px rgba(255,107,94,0.4)'
          }}>
          {isSuccess ? <CheckCircle size={50} /> : <XCircle size={50} />}
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold mb-2"
              style={{ ...fd, color: 'var(--bc-ink-900)', letterSpacing: '-0.04em' }}>
            {isSuccess ? 'Thanh toán thành công!' : 'Giao dịch bị hủy'}
          </h2>
          <p className="text-[13px]" style={{ color: 'var(--bc-ink-400)' }}>
            {isSuccess
              ? 'Đơn hàng đã được xác nhận và lưu vào hệ thống.'
              : 'Giao dịch đã bị hủy hoặc thất bại. Vui lòng thử lại.'}
          </p>
        </div>

        {orderCode && (
          <div className="p-4 rounded-2xl" style={{ background: 'var(--bc-bg-soft)', border: '1px solid var(--bc-ink-100)' }}>
            <p className="text-[11px] font-medium" style={{ color: 'var(--bc-ink-300)' }}>Mã đơn hàng</p>
            <p className="text-[15px] font-bold" style={{ ...fd, color: 'var(--bc-ink-900)' }}>#{orderCode}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="flex-1 py-3.5 rounded-2xl text-white text-[13px] font-semibold"
            style={{ background: 'linear-gradient(135deg,var(--bc-ink-900),var(--bc-ink-700))', boxShadow: 'var(--bc-shadow-3)' }}>
            Về trang chủ
          </button>
        </div>
      </motion.div>
    </div>
  );
}
