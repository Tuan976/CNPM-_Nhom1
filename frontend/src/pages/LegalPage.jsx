import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, FileText, Scale } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

const LegalPage = ({ type }) => {
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const content = {
    terms: {
      title: 'Điều khoản sử dụng',
      icon: <Scale className="text-blue-500" />,
      sections: [
        { t: '1. Chấp nhận điều khoản', c: 'Bằng việc sử dụng hệ thống MediCheck AI, bạn đồng ý tuân thủ các quy định và điều khoản sử dụng này.' },
        { t: '2. Trách nhiệm chuyên môn', c: 'Hệ thống chỉ đóng vai trò hỗ trợ cung cấp thông tin. Các quyết định lâm sàng cuối cùng thuộc về trách nhiệm của bác sĩ và nhân viên y tế.' },
        { t: '3. Bảo mật tài khoản', c: 'Bạn có trách nhiệm bảo mật thông tin đăng nhập và không chia sẻ tài khoản cho người khác.' }
      ]
    },
    privacy: {
      title: 'Chính sách bảo mật',
      icon: <ShieldCheck className="text-emerald-500" />,
      sections: [
        { t: '1. Thu thập dữ liệu', c: 'Chúng tôi chỉ thu thập các thông tin chuyên môn cần thiết để thực hiện việc tra cứu tương tác thuốc và bệnh lý.' },
        { t: '2. Bảo mật thông tin bệnh nhân', c: 'MediCheck AI cam kết tuân thủ các tiêu chuẩn bảo mật dữ liệu y tế (HIPAA-compliant) để bảo vệ quyền riêng tư.' },
        { t: '3. Quyền của người dùng', c: 'Bạn có quyền yêu cầu trích xuất hoặc xóa dữ liệu cá nhân của mình khỏi hệ thống bất cứ lúc nào.' }
      ]
    }
  };

  const data = content[type] || content.terms;

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      <header className="sticky top-0 z-50 dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl border-b dark:border-slate-800 border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-blue-500 font-bold">
            <ChevronLeft size={20} /> Quay lại trang chủ
          </Link>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg text-white"><FileText size={18} /></div>
             <span className="font-bold dark:text-white text-slate-900">Legal Center</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="dark:bg-slate-900 bg-white p-12 rounded-[2.5rem] border dark:border-slate-800 border-slate-200 shadow-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 dark:bg-slate-800 bg-slate-50 rounded-2xl">{data.icon}</div>
            <h1 className="text-4xl font-bold dark:text-white text-slate-900">{data.title}</h1>
          </div>
          
          <div className="space-y-12">
            {data.sections.map((s, i) => (
              <section key={i} className="space-y-4">
                <h3 className="text-xl font-bold dark:text-slate-200 text-slate-800">{s.t}</h3>
                <p className="dark:text-slate-400 text-slate-600 leading-relaxed text-lg">{s.c}</p>
              </section>
            ))}
          </div>

          <div className="mt-16 p-8 dark:bg-blue-900/10 bg-blue-50 rounded-3xl border dark:border-blue-500/20 border-blue-100">
            <p className="dark:text-blue-400 text-blue-700 text-sm italic">
              * Mọi thắc mắc về văn bản pháp lý này, vui lòng liên hệ bộ phận pháp chế của MediCheck AI qua email: legal@medicheck.vn
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
