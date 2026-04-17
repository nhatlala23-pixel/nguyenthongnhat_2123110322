import React from 'react';
import { Search, ChevronRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-red-100/30 rounded-full blur-3xl -z-10 animate-bounce transition-all duration-[5000ms]"></div>

      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest mb-10 shadow-sm border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
          Đang phục vụ hơn 5000+ Bệnh nhân mỗi tháng
        </div>

        {/* Title */}
        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-8 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Chăm sóc tận tâm,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Sức khỏe vững bền.</span>
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Khám phá hệ thống đặt lịch y tế hiện đại tại Clinical Sanctuary. 
          Chúng tôi kết nối bạn với những chuyên gia hàng đầu để đảm bảo hành trình hồi phục tốt nhất.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-3xl bg-white p-2 rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-gray-100 flex flex-col md:flex-row items-center gap-2 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <div className="flex-1 flex items-center gap-3 pl-6 w-full py-4 md:py-0">
            <Search className="text-blue-600" size={24} />
            <input 
              type="text" 
              placeholder="Tìm tên bác sĩ, chuyên khoa hoặc bệnh lý..." 
              className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <button className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-[1.5rem] font-bold text-sm hover:bg-blue-700 transition-all hover:-translate-x-1 flex items-center justify-center gap-2 group shadow-lg shadow-blue-200">
            Tìm kiếm ngay
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Links / Video */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all shadow-sm">
              <Play size={18} fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Xem giới thiệu</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-200 hidden sm:block"></div>
          <div className="flex -space-x-4">
            {[1,2,3,4].map(idx => (
              <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/150?img=${idx+20}`} alt="doctor" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
              +50
            </div>
          </div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-2">Top chuyên gia hàng đầu</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
