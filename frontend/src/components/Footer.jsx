import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, ShieldCheck, Globe, Share2, MessageSquare, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="dark:bg-slate-950 bg-white border-t theme-border pt-24 pb-12 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                <Activity size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase theme-text">MediCheck AI</span>
            </div>
            <p className="opacity-50 leading-loose font-medium theme-text text-lg">
              Nền tảng hỗ trợ quyết định y khoa hàng đầu thế giới, trao quyền cho chuyên gia y tế bằng trí tuệ nhân tạo thế hệ mới.
            </p>
            <div className="flex gap-4">
              {[Share2, MessageSquare, Send, Globe].map((Icon, i) => (
                <button key={i} className="p-3 rounded-xl glass border-none hover:bg-blue-600 hover:text-white transition-all">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-[0.2em] theme-text mb-10 opacity-40">Hệ sinh thái</h4>
            <ul className="space-y-5">
              {['Trang chủ', 'Tra cứu thuốc', 'Bản đồ bệnh lý', 'Phòng lab AI'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-lg font-bold opacity-60 hover:opacity-100 hover:text-blue-500 transition-all flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-[0.2em] theme-text mb-10 opacity-40">Chính sách</h4>
            <ul className="space-y-5">
              {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Tuyên bố miễn trừ', 'Hướng dẫn chuyên môn'].map((link) => (
                <li key={link}>
                  <Link to="/terms" className="text-lg font-bold opacity-60 hover:opacity-100 hover:text-blue-500 transition-all flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-[0.2em] theme-text mb-10 opacity-40">Trung tâm hỗ trợ</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 opacity-70 font-medium">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><MapPin size={20} /></div>
                <span className="text-lg">Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-4 opacity-70 font-medium">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><Mail size={20} /></div>
                <span className="text-lg">hello@medicheck.ai</span>
              </li>
              <li className="flex items-center gap-4 opacity-70 font-medium">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><Phone size={20} /></div>
                <span className="text-lg">1900 8888 99</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t theme-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm opacity-40 font-black uppercase tracking-widest">© 2026 MediCheck AI GLOBAL. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4 glass px-8 py-4 rounded-[2rem] border-emerald-500/20">
            <ShieldCheck size={24} className="text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Certified Data Security ISO/IEC 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

