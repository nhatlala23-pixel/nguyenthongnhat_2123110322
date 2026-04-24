import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Specialties from '../components/home/Specialties';
import Doctors from '../components/home/Doctors';
import Stats from '../components/home/Stats';
import { Globe, Activity, Instagram, Linkedin, Send, MapPin, Phone, Mail, Link } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Specialties />
        <Doctors />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-100 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand Col */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <span className="text-xl font-bold">C</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-none">Clinical</h1>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sanctuary</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Hệ thống quản trị y tế hiện đại mang đến sự tận tâm, minh bạch và hiệu quả cao nhất trong mọi dịch vụ y tế.
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon icon={<Globe size={18} />} />
                <SocialIcon icon={<Activity size={18} />} />
                <SocialIcon icon={<Instagram size={18} />} />
                <SocialIcon icon={<Linkedin size={18} />} />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8">Khám phá</h4>
              <ul className="flex flex-col gap-4">
                <FooterLink text="Tìm bác sĩ" to="/doctors" />
                <FooterLink text="Dịch vụ y tế" to="#" />
                <FooterLink text="Chuyên khoa" to="#" />
                <FooterLink text="Tin tức sức khỏe" to="/news" />
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8">Thông tin</h4>
              <ul className="flex flex-col gap-4">
                <FooterLink text="Về chúng tôi" />
                <FooterLink text="Chính sách nội bộ" />
                <FooterLink text="Quyền lợi bệnh nhân" />
                <FooterLink text="Liên hệ hợp tác" />
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8">Liên hệ</h4>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-600 shrink-0 mt-1" />
                  <p className="text-gray-500 text-sm font-medium">Số 123, Đường Y Học, Phường 4, TP. Hồ Chí Minh</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-600 shrink-0" />
                  <p className="text-gray-500 text-sm font-bold">1900 1234</p>
                </div>
                <div className="mt-4 pt-6 border-t border-gray-200">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Nhận bản tin sức khỏe</p>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Email của bạn..." 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none pr-12 transition-all"
                    />
                    <button className="absolute right-2 top-2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-md">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              © 2024 Clinical Sanctuary. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy Policy</a>
              <a href="#" className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterLink = ({ text, to = "#" }) => (
  <li>
    <Link to={to} className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 group">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-blue-600 transition-colors"></div>
      {text}
    </Link>
  </li>
);

const SocialIcon = ({ icon }) => (
  <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all shadow-sm">
    {icon}
  </button>
);

export default Home;
