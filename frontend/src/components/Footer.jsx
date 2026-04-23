import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="dark:bg-slate-900 bg-white border-t dark:border-slate-800 border-slate-200 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Activity size={24} />
              </div>
              <span className="text-xl font-bold dark:text-white text-slate-900">MediCheck AI</span>
            </div>
            <p className="dark:text-slate-400 text-slate-500 leading-relaxed">
              Nền tảng hỗ trợ quyết định y khoa hàng đầu, giúp bác sĩ và dược sĩ tra cứu tương tác thuốc và bệnh lý chính xác.
            </p>
          </div>

          <div>
            <h4 className="font-bold dark:text-white text-slate-900 mb-6">Liên kết nhanh</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="dark:text-slate-400 text-slate-500 hover:text-blue-500">Trang chủ</Link></li>
              <li><Link to="/dashboard" className="dark:text-slate-400 text-slate-500 hover:text-blue-500">Tra cứu</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold dark:text-white text-slate-900 mb-6">Pháp lý</h4>
            <ul className="space-y-4">
              <li><Link to="/terms" className="dark:text-slate-400 text-slate-500 hover:text-blue-500">Điều khoản</Link></li>
              <li><Link to="/privacy" className="dark:text-slate-400 text-slate-500 hover:text-blue-500">Bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold dark:text-white text-slate-900 mb-6">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 dark:text-slate-400 text-slate-500"><MapPin size={20} className="text-blue-500" /> HCM</li>
              <li className="flex items-center gap-3 dark:text-slate-400 text-slate-500"><Mail size={20} className="text-blue-500" /> support@medicheck.vn</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t dark:border-slate-800 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm dark:text-slate-500 text-slate-400">
          <p>© 2026 MediCheck AI. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Chứng nhận an toàn dữ liệu y tế quốc tế</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
