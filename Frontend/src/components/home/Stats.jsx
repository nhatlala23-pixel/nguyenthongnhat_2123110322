import React from 'react';
import { Microscope, Award, Heart, ShieldCheck } from 'lucide-react';

const Stats = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Big Card - Satisfied Patients */}
          <div className="lg:col-span-2 bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/10 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <Heart size={32} fill="white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight tracking-tight">
                98% Bệnh nhân <br /> hài lòng với dịch vụ
              </h3>
              <p className="text-blue-100 font-medium max-w-sm">
                Chúng tôi cam kết mang lại chất lượng phục vụ và chăm sóc y tế chuẩn quốc tế bằng trái tim nhiệt huyết.
              </p>
            </div>
            {/* Absolute Decoration */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          </div>
          
          {/* Small Card - Doctors */}
          <div className="bg-gray-50 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Award size={32} />
            </div>
            <h3 className="text-5xl font-black text-gray-900 mb-2">500+</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">BÁC SĨ CHUYÊN KHOA</p>
          </div>
          
          {/* Small Card - 24/7 */}
          <div className="bg-gray-50 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-5xl font-black text-gray-900 mb-2">24/7</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">HỖ TRỢ KHẨN CẤP</p>
          </div>

          {/* Wide Card Bottom - Modern System */}
          <div className="lg:col-span-4 bg-gray-900 rounded-[2.5rem] p-10 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
            <div className="relative z-10 flex-1">
              <h3 className="text-3xl font-black mb-4">Hệ thống Y tế số hiện đại</h3>
              <p className="text-gray-400 font-medium leading-relaxed max-w-2xl text-lg">
                Công nghệ AI hỗ trợ chẩn đoán chính xác và nhanh chóng. Chuyển đổi số hoàn diện trong quản lý y tế tại Clinical Sanctuary 
                giúp tối ưu hóa quy trình khám chữa bệnh.
              </p>
              <button className="mt-8 bg-blue-600 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20">
                Tìm hiểu về công nghệ của chúng tôi
              </button>
            </div>
            <div className="relative z-10 w-24 h-24 md:w-40 md:h-40 bg-gray-800 rounded-[2rem] flex items-center justify-center border border-gray-700 group-hover:rotate-6 transition-transform duration-500">
              <Microscope size={64} className="text-blue-500" />
            </div>
            {/* Background Decoration */}
            <div className="absolute -left-20 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
